-- Untold: secure room-scoped multiplayer, authenticated anonymous guests.
create extension if not exists pgcrypto;
create table public.rooms (
 id uuid primary key default gen_random_uuid(),
 room_code text not null unique check (room_code ~ '^[A-Z0-9]{8}$'),
 host_user_id uuid not null,
 status text not null default 'active' check (status in ('active','closed')),
 deck_cycle integer not null default 1 check (deck_cycle > 0),
 created_at timestamptz not null default now(),
 updated_at timestamptz not null default now(),
 expires_at timestamptz not null default (now()+ interval '7 days')
);
create table public.room_members (
 room_id uuid not null references public.rooms(id) on delete cascade,
 guest_user_id uuid not null,
 joined_at timestamptz not null default now(),
 last_seen_at timestamptz not null default now(),
 current_card_id text,
 current_cycle integer,
 primary key(room_id,guest_user_id)
);
create table public.drawn_cards (
 id bigint generated always as identity primary key,
 room_id uuid not null references public.rooms(id) on delete cascade,
 deck_cycle integer not null,
 card_id text not null check (card_id ~ '^CARD-0(0[1-9]|1[0-5])$'),
 drawn_by uuid not null,
 drawn_at timestamptz not null default now(),
 unique(room_id,deck_cycle,card_id)
);
create index rooms_expiry_idx on public.rooms(expires_at);
create index drawn_cards_room_cycle_idx on public.drawn_cards(room_id,deck_cycle);
create index members_user_idx on public.room_members(guest_user_id);
alter table public.rooms enable row level security;
alter table public.room_members enable row level security;
alter table public.drawn_cards enable row level security;
-- Public tables deny direct writes; only security-definer RPCs can mutate game state.
revoke all on public.rooms, public.room_members, public.drawn_cards from anon, authenticated;
grant select on public.rooms,public.room_members to authenticated;
create policy "member may view room" on public.rooms for select to authenticated
using (exists(select 1 from public.room_members m where m.room_id=rooms.id and m.guest_user_id=(select auth.uid())));
create policy "member sees own row" on public.room_members for select to authenticated
using (guest_user_id=(select auth.uid()));
-- Keep drawn_cards inaccessible directly: no policy, results served through get_room_state.
create or replace function public.create_room() returns text
language plpgsql security definer set search_path = public, pg_temp as $$
declare v_user uuid := auth.uid(); v_room uuid; v_code text; v_try int;
begin
 if v_user is null then raise exception 'AUTH_REQUIRED'; end if;
 for v_try in 1..12 loop
   v_code := upper(substr(encode(gen_random_bytes(8),'hex'),1,8));
   insert into public.rooms(room_code,host_user_id) values (v_code,v_user)
     on conflict (room_code) do nothing returning id into v_room;
   exit when v_room is not null;
 end loop;
 if v_room is null then raise exception 'ROOM_CREATION_FAILED'; end if;
 insert into public.room_members(room_id,guest_user_id) values(v_room,v_user);
 return v_code;
end $$;
create or replace function public.join_room(p_code text) returns text
language plpgsql security definer set search_path = public, pg_temp as $$
declare v_user uuid:=auth.uid(); v_room public.rooms%rowtype;
begin
 if v_user is null then raise exception 'AUTH_REQUIRED'; end if;
 if p_code is null or p_code !~ '^[A-Z0-9]{8}$' then raise exception 'INVALID_ROOM_CODE'; end if;
 select * into v_room from public.rooms where room_code=p_code;
 if not found then raise exception 'ROOM_NOT_FOUND'; end if;
 if v_room.status<>'active' then raise exception 'ROOM_CLOSED'; end if;
 if v_room.expires_at<=now() then raise exception 'ROOM_EXPIRED'; end if;
 insert into public.room_members(room_id,guest_user_id) values(v_room.id,v_user)
 on conflict (room_id,guest_user_id) do update set last_seen_at=now();
 return v_room.room_code;
end $$;
create or replace function public.get_room_state(p_code text) returns jsonb
language plpgsql security definer set search_path = public, pg_temp as $$
declare v_user uuid:=auth.uid(); v_room public.rooms%rowtype; v_member public.room_members%rowtype; v_count int;
begin
 if v_user is null then raise exception 'AUTH_REQUIRED'; end if;
 select * into v_room from public.rooms where room_code=p_code;
 if not found then raise exception 'ROOM_NOT_FOUND'; end if;
 if v_room.expires_at<=now() then raise exception 'ROOM_EXPIRED'; end if;
 select * into v_member from public.room_members where room_id=v_room.id and guest_user_id=v_user;
 if not found then raise exception 'NOT_MEMBER'; end if;
 select count(*) into v_count from public.drawn_cards where room_id=v_room.id and deck_cycle=v_room.deck_cycle;
 return jsonb_build_object('code',v_room.room_code,'host',v_room.host_user_id=v_user,
   'count',v_count,'cycle',v_room.deck_cycle,
   'current_card',case when v_member.current_cycle=v_room.deck_cycle then v_member.current_card_id else null end,
   'status',v_room.status,'expires_at',v_room.expires_at);
end $$;
create or replace function public.draw_card(p_code text,p_cycle integer) returns text
language plpgsql security definer set search_path = public, pg_temp as $$
declare v_user uuid:=auth.uid(); v_room public.rooms%rowtype; v_card text; v_member public.room_members%rowtype;
begin
 if v_user is null then raise exception 'AUTH_REQUIRED'; end if;
 -- Exclusive room lock serializes all draws and resets in this room.
 select * into v_room from public.rooms where room_code=p_code for update;
 if not found then raise exception 'ROOM_NOT_FOUND'; end if;
 if v_room.status<>'active' then raise exception 'ROOM_CLOSED'; end if;
 if v_room.expires_at<=now() then raise exception 'ROOM_EXPIRED'; end if;
 if v_room.deck_cycle<>p_cycle then raise exception 'STALE_DECK'; end if;
 select * into v_member from public.room_members where room_id=v_room.id and guest_user_id=v_user for update;
 if not found then raise exception 'NOT_MEMBER'; end if;
 -- Rate-limit a guest to one draw per second while preserving valid consecutive draws.
 if exists(select 1 from public.drawn_cards where room_id=v_room.id and deck_cycle=v_room.deck_cycle
   and drawn_by=v_user and drawn_at>clock_timestamp()-interval '1 second') then raise exception 'RATE_LIMIT'; end if;
 select 'CARD-' || lpad(n::text,3,'0') into v_card from generate_series(1,15) as n
 where not exists (select 1 from public.drawn_cards d where d.room_id=v_room.id
   and d.deck_cycle=v_room.deck_cycle and d.card_id='CARD-' || lpad(n::text,3,'0'))
 order by random() limit 1;
 if v_card is null then return null; end if;
 insert into public.drawn_cards(room_id,deck_cycle,card_id,drawn_by) values(v_room.id,v_room.deck_cycle,v_card,v_user);
 update public.room_members set current_card_id=v_card,current_cycle=v_room.deck_cycle,last_seen_at=now()
 where room_id=v_room.id and guest_user_id=v_user;
 update public.rooms set updated_at=now() where id=v_room.id;
 return v_card;
end $$;
create or replace function public.reset_room(p_code text) returns integer
language plpgsql security definer set search_path = public, pg_temp as $$
declare v_user uuid:=auth.uid();v_room public.rooms%rowtype;
begin
 if v_user is null then raise exception 'AUTH_REQUIRED'; end if;
 select * into v_room from public.rooms where room_code=p_code for update;
 if not found then raise exception 'ROOM_NOT_FOUND'; end if;
 if v_room.host_user_id<>v_user then raise exception 'NOT_HOST'; end if;
 if v_room.status<>'active' or v_room.expires_at<=now() then raise exception 'ROOM_EXPIRED'; end if;
 update public.rooms set deck_cycle=deck_cycle+1,updated_at=now() where id=v_room.id;
 update public.room_members set current_card_id=null,current_cycle=null where room_id=v_room.id;
 return v_room.deck_cycle+1;
end $$;
revoke all on function public.create_room(), public.join_room(text), public.get_room_state(text), public.draw_card(text,integer), public.reset_room(text) from public, anon;
grant execute on function public.create_room(), public.join_room(text), public.get_room_state(text), public.draw_card(text,integer), public.reset_room(text) to authenticated;
-- Realtime room updates are visible only to members under the rooms SELECT RLS policy.
do $$ begin
 if not exists(select 1 from pg_publication_tables where pubname='supabase_realtime' and schemaname='public' and tablename='rooms') then
   alter publication supabase_realtime add table public.rooms;
 end if;
end $$;
-- In production: add optional scheduled cleanup of rooms older than expires_at.

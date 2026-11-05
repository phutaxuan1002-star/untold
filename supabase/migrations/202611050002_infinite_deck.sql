-- Apply AFTER 202611050001_initial.sql. Existing production data is preserved.
alter table public.drawn_cards add column if not exists request_id uuid;
create unique index if not exists drawn_cards_room_user_request_idx
 on public.drawn_cards(room_id, drawn_by, request_id) where request_id is not null;

create or replace function public.get_room_state(p_code text) returns jsonb
language plpgsql security definer set search_path=public,pg_temp as $$
declare v_user uuid:=auth.uid(); v_room public.rooms%rowtype; v_member public.room_members%rowtype; v_count integer;
begin
 if v_user is null then raise exception 'AUTH_REQUIRED'; end if;
 select * into v_room from public.rooms where room_code=p_code;
 if not found then raise exception 'ROOM_NOT_FOUND'; end if;
 if v_room.expires_at<=now() then raise exception 'ROOM_EXPIRED'; end if;
 select * into v_member from public.room_members where room_id=v_room.id and guest_user_id=v_user;
 if not found then raise exception 'NOT_MEMBER'; end if;
 select count(*) into v_count from public.drawn_cards where room_id=v_room.id and deck_cycle=v_room.deck_cycle;
 return jsonb_build_object('code',v_room.room_code,'host',v_room.host_user_id=v_user,
 'count',v_count,'cycle',v_room.deck_cycle,'current_card',v_member.current_card_id,
 'status',v_room.status,'expires_at',v_room.expires_at);
end $$;

create or replace function public.draw_card(p_code text,p_request_id uuid) returns text
language plpgsql security definer set search_path=public,pg_temp as $$
declare v_user uuid:=auth.uid();v_room public.rooms%rowtype;v_card text;v_previous text;v_member public.room_members%rowtype;
begin
 if v_user is null then raise exception 'AUTH_REQUIRED'; end if;
 if p_request_id is null then raise exception 'REQUEST_ID_REQUIRED'; end if;
 -- A single room row lock serializes simultaneous draws and cycle transitions.
 select * into v_room from public.rooms where room_code=p_code for update;
 if not found then raise exception 'ROOM_NOT_FOUND'; end if;
 if v_room.status<>'active' then raise exception 'ROOM_CLOSED'; end if;
 if v_room.expires_at<=now() then raise exception 'ROOM_EXPIRED'; end if;
 select * into v_member from public.room_members where room_id=v_room.id and guest_user_id=v_user for update;
 if not found then raise exception 'NOT_MEMBER'; end if;
 select card_id into v_previous from public.drawn_cards
 where room_id=v_room.id and drawn_by=v_user and request_id=p_request_id;
 if found then return v_previous; end if;
 -- Enforce original one-second limit on new requests only.
 if exists(select 1 from public.drawn_cards where room_id=v_room.id and drawn_by=v_user
 and drawn_at>clock_timestamp()-interval '1 second') then raise exception 'RATE_LIMIT'; end if;
 select 'CARD-'||lpad(n::text,3,'0') into v_card from generate_series(1,15) n
 where not exists(select 1 from public.drawn_cards d where d.room_id=v_room.id
 and d.deck_cycle=v_room.deck_cycle and d.card_id='CARD-'||lpad(n::text,3,'0'))
 order by random() limit 1;
 if v_card is null then
   update public.rooms set deck_cycle=deck_cycle+1,updated_at=now() where id=v_room.id
   returning * into v_room;
   select 'CARD-'||lpad(n::text,3,'0') into v_card from generate_series(1,15) n order by random() limit 1;
 end if;
 insert into public.drawn_cards(room_id,deck_cycle,card_id,drawn_by,request_id)
 values(v_room.id,v_room.deck_cycle,v_card,v_user,p_request_id);
 update public.room_members set current_card_id=v_card,current_cycle=v_room.deck_cycle,last_seen_at=now()
 where room_id=v_room.id and guest_user_id=v_user;
 update public.rooms set updated_at=now() where id=v_room.id;
 return v_card;
end $$;
revoke all on function public.draw_card(text,uuid) from public,anon;
grant execute on function public.draw_card(text,uuid) to authenticated;
-- Remove legacy API only after the new frontend is live and active sessions have migrated.
-- revoke execute on function public.draw_card(text,integer) from authenticated;

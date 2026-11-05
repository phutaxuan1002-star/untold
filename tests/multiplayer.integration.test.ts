import { describe, expect, it } from 'vitest';
import { createClient } from '@supabase/supabase-js';

// Only run against a disposable Supabase project with the migration applied.
// RUN_SUPABASE_INTEGRATION=1 npm run test
const enabled = process.env.RUN_SUPABASE_INTEGRATION === '1';
const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '';
const suite = enabled && url && key ? describe : describe.skip;

suite('real PostgreSQL multiplayer integration', () => {
  const newGuest = async () => {
    const client = createClient(url, key, {
      auth: { autoRefreshToken: false, persistSession: false, detectSessionInUrl: false },
    });
    const result = await client.auth.signInAnonymously();
    if (result.error) throw result.error;
    return client;
  };
  it('serializes concurrent draws and checks host authorization', async () => {
    const [host, guest] = await Promise.all([newGuest(), newGuest()]);
    const created = await host.rpc('create_room');
    expect(created.error).toBeNull();
    const code = created.data as string;
    expect((await guest.rpc('join_room', { p_code: code })).error).toBeNull();
    const results = await Promise.all([
      host.rpc('draw_card', { p_code: code, p_cycle: 1 }),
      guest.rpc('draw_card', { p_code: code, p_cycle: 1 }),
    ]);
    expect(results.map(r => r.error)).toEqual([null, null]);
    expect(new Set(results.map(r => r.data)).size).toBe(2);
    const state = await host.rpc('get_room_state', { p_code: code });
    expect(state.data.count).toBe(2);
    const denied = await guest.rpc('reset_room', { p_code: code });
    expect(denied.error?.message).toContain('NOT_HOST');
    const reset = await host.rpc('reset_room', { p_code: code });
    expect(reset.error).toBeNull();
    expect(reset.data).toBe(2);
    const stale = await guest.rpc('draw_card', { p_code: code, p_cycle: 1 });
    expect(stale.error?.message).toContain('STALE_DECK');
    const cleared = await guest.rpc('get_room_state', { p_code: code });
    expect(cleared.data.count).toBe(0);
    expect(cleared.data.current_card).toBeNull();
  }, 30000);

  it('rejects non-members and isolates room decks', async () => {
    const [host, stranger] = await Promise.all([newGuest(), newGuest()]);
    const room = await host.rpc('create_room');
    const code = room.data as string;
    const denied = await stranger.rpc('draw_card', { p_code: code, p_cycle: 1 });
    expect(denied.error?.message).toContain('NOT_MEMBER');
    const other = await stranger.rpc('create_room');
    expect(other.data).not.toBe(code);
    const state = await stranger.rpc('get_room_state', { p_code: other.data });
    expect(state.data.count).toBe(0);
  }, 30000);
});

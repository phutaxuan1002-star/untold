import type { SupabaseClient } from '@supabase/supabase-js';
export type RoomState = {
  code: string; host: boolean; count: number; cycle: number;
  current_card: string | null; status: string; expires_at: string;
};
export async function rpc<T>(client: SupabaseClient, name: string, args: Record<string, unknown> = {}): Promise<T> {
  const { data, error } = await client.rpc(name, args);
  if (error) throw error;
  return data as T;
}
export function normalizeRoomCode(value:string) { return value.toUpperCase().replace(/[^A-Z0-9]/g,'').slice(0,8); }
export function inviteUrl(code: string) { return typeof window === 'undefined' ? '' : `${window.location.origin}/room/${code}`; }

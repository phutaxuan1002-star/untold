import { createClient, type SupabaseClient } from '@supabase/supabase-js';
let instance: SupabaseClient | undefined;
export function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) throw new Error('Chưa cấu hình Supabase. Xem README để thiết lập biến môi trường.');
  return instance ??= createClient(url, key, {
    auth: { autoRefreshToken: true, persistSession: true, detectSessionInUrl: false },
    realtime: { params: { eventsPerSecond: 5 } }
  });
}
export async function ensureGuest() {
  const client = getSupabase();
  const { data: { session }, error } = await client.auth.getSession();
  if (error) throw error;
  if (session) return client;
  const result = await client.auth.signInAnonymously();
  if (result.error) throw result.error;
  return client;
}
export function prettyError(error: unknown): string {
  // Supabase PostgrestError can be a plain object rather than an Error instance.
  const obj = error && typeof error === 'object'
    ? error as Record<string, unknown> : null;
  const msg = [obj?.message, obj?.details, obj?.hint, obj?.code]
    .filter((item): item is string => typeof item === 'string' && item.length > 0)
    .join(' | ') || (error instanceof Error ? error.message : String(error));
  const map: Record<string, string> = {
    ROOM_NOT_FOUND: 'Không tìm thấy phòng chơi. Vui lòng kiểm tra mã phòng.',
    ROOM_EXPIRED: 'Phòng đã hết hạn. Hãy tạo phòng mới.',
    NOT_MEMBER: 'Bạn chưa tham gia phòng này.',
    NOT_HOST: 'Chỉ chủ phòng mới có thể đặt lại bộ thẻ.',
    ROOM_CLOSED: 'Phòng đã đóng.',
    INVALID_ROOM_CODE: 'Mã phòng không hợp lệ.',
    STALE_DECK: 'Bộ thẻ vừa được đặt lại. Hãy thử bốc thẻ mới.',
    RATE_LIMIT: 'Bạn thao tác quá nhanh. Hãy thử lại.',
    AUTH_REQUIRED: 'Phiên khách đã hết hạn. Vui lòng tải lại trang.',
  };
  const found = Object.keys(map).find(k => msg.includes(k));
  return found ? map[found] : msg;
}

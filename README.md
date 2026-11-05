# UNTOLD — Discover Your Potential

Ứng dụng bốc thẻ song ngữ cho team Designathon. Next.js App Router, TypeScript, Tailwind CSS, Motion, Supabase PostgreSQL và Realtime. **15 câu tiếng Việt được giữ nguyên đúng master prompt.** Không cần tạo tài khoản, không chấm điểm, không có lượt bắt buộc.

## Chức năng

- Tạo phòng, vào phòng bằng mã 8 ký tự hoặc link/QR.
- Đăng nhập khách ẩn danh Supabase, không phải nhập tên.
- Bộ 15 thẻ chung, bốc ngẫu nhiên bằng PostgreSQL transaction và row lock, không trùng giữa các thiết bị trong một vòng.
- Mỗi người thấy thẻ của mình; thẻ đang xem được khôi phục khi reload.
- Đồng bộ tiến độ qua Supabase Realtime và polling dự phòng; hiện số thiết bị đang kết nối qua Realtime Presence.
- Chủ phòng reset vòng chơi mới; UI responsive, card flip, hỗ trợ reduced motion.
- Phòng tự hết hạn sau 7 ngày (logic kiểm tra hết hạn trong RPC; dọn dữ liệu vật lý cần cron nếu muốn).

## Yêu cầu

Node.js 20+, npm, tài khoản GitHub, Supabase, Vercel.

## 1. Tạo Supabase project

1. Trên https://supabase.com/dashboard tạo project.
2. **Authentication → Providers → Anonymous Sign-Ins**: bật Allow anonymous sign-ins. Kiểm tra captcha/rate limits phù hợp trước khi mở website công khai.
3. Vào **SQL Editor**, chạy toàn bộ `supabase/migrations/202611050001_initial.sql` đúng một lần trên project mới. Hoặc chạy CLI:

```bash
npx supabase login
npx supabase link --project-ref YOUR_PROJECT_REF
npx supabase db push
```

4. Realtime cần publication `rooms` (được cấu hình trong migration). Policies bảo vệ room data theo membership. Realtime Presence cho participant count hoạt động best-effort trên channel của phòng; người chơi không cần gửi tên.

## 2. Phát triển local

```bash
npm install
cp .env.example .env.local
```

Sửa `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_PUBLISHABLE_OR_ANON_KEY
```

Dùng Supabase publishable key (`sb_publishable_...`) hoặc legacy anon key. Những giá trị này được phép xuất hiện ở trình duyệt **chỉ khi RLS và RPC authorization được cấu hình đúng**. KHÔNG đưa service_role / secret key vào NEXT_PUBLIC hoặc repository.

```bash
npm run dev
npm run typecheck
npm run test
npm run build
```

Truy cập http://localhost:3000.

## 3. GitHub

Tạo repository `untold`, sau đó:

```bash
git init
git add .
git commit -m "Initial Untold"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/untold.git
git push -u origin main
```

`.env.local` đã bị bỏ qua bởi `.gitignore`.

## 4. Deploy Vercel

1. https://vercel.com/new → Import Git Repository → chọn `untold`.
2. Framework: Next.js, build: `npm run build`, root: `./`.
3. Vào Environment Variables cấu hình `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` bằng giá trị của project Supabase đã tạo.
4. Deploy; truy cập link HTTPS. Không cần thêm site URL nếu dùng `window.location.origin`.
5. Nếu chỉnh biến môi trường sau deploy, redeploy để Next.js build nhận giá trị mới.

## 5. Kiểm tra hai thiết bị

1. Trên thiết bị A: Create Room, ghi lại room code.
2. Thiết bị B: mở link/QR hoặc Join Room; đảm bảo có 2 participants connected (presence có thể trễ).
3. Bốc thẻ cùng lúc. Không được nhận cùng card ID trong cùng room cycle.
4. Kiểm tra progress trên cả 2 máy, thử reload, thử disconnect/reconnect.
5. Bốc hết 15 thẻ, xác minh thông báo hoàn tất.
6. Chủ phòng reset → hai máy phải thấy progress 0/15 và thẻ cũ biến mất.
7. Thiết bị không phải host không thấy/reset được bộ thẻ.

## 6. Cấu trúc code

- `src/data/questions.ts`: 15 câu Việt/Anh, 5 categories.
- `src/components/GameCard.tsx`: front/back flip.
- `src/components/GameRoom.tsx`: room, shared progress, Realtime, Presence, controls.
- `src/lib/supabase.ts`: guest auth và xử lý lỗi.
- `src/lib/game.ts`: RPC client utilities.
- `supabase/migrations`: schema, RLS, transaction-safe RPCs.
- `tests`: kiểm tra dataset. SQL concurrency testing cần database chạy thật.

## 7. Thay đổi câu hỏi

Sửa `src/data/questions.ts` giữ đúng ID `CARD-001` đến `CARD-015`. Nếu thay đổi số lượng thẻ phải đồng bộ `generate_series(1,15)` trong SQL, `drawn_cards.card_id` constraint, các bài test và code UI. Để giữ phiên chơi cũ ổn định, ưu tiên triển khai bộ thẻ mới qua phiên bản migration thay vì sửa ID hiện hữu.

## 8. Troubleshooting

- `Chưa cấu hình Supabase`: kiểm tra `.env.local` hoặc biến môi trường trên Vercel và redeploy.
- `Anonymous sign-ins are disabled`: bật Anonymous Sign-Ins trong Supabase Auth.
- `Could not find function ...`: kiểm tra migration đã chạy và PostgREST schema cache (Settings/API hoặc chờ refresh).
- `permission denied`: xác nhận client dùng publishable/anon key và SQL đã grant RPC cho authenticated.
- `ROOM_NOT_FOUND`: room code không tồn tại.
- `ROOM_EXPIRED`: room đã hết hạn (7 ngày).
- `NOT_HOST`: tài khoản guest khác chủ phòng, kể cả sau khi xóa dữ liệu trình duyệt.
- Realtime chậm: kiểm tra `rooms` publication, websocket, RLS; polling 10 giây là fallback.
- QR/Copy lỗi: cần HTTPS hoặc localhost cho Clipboard API; link QR vẫn hoạt động.
- Build fail: chạy Node >=20, npm install rồi `npm run typecheck`, `npm run build`.

## 9. Bảo mật và giới hạn

RPC dùng `auth.uid()`, SECURITY DEFINER + explicit room-membership check. Draw và reset lock hàng `rooms` để tuần tự hóa concurrent mutations. Bảng deny direct writes; không sử dụng service role trên client. Room code là mã chia sẻ, người có mã có thể vào phòng; không dùng room code cho dữ liệu nhạy cảm. `join_room` mở cho người dùng ẩn danh có mã; cân nhắc CAPTCHA/rate limits nếu phổ biến rộng. Presence là ước lượng kết nối live, không phải số user duy nhất. Mã nguồn chưa thay cho kiểm thử concurrency E2E trên hai trình duyệt và kiểm thử bảo mật môi trường thực.

## 10. Integration test với Supabase thật (tùy chọn)

Dùng **test project riêng** và cấu hình các biến môi trường trong terminal (Vitest không tự load `.env.local`):

```bash
RUN_SUPABASE_INTEGRATION=1 NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_PUBLISHABLE_KEY npm run test
```

Kiểm tra hai khách cùng bốc thẻ, unique card, quyền reset, chống thao tác vòng thẻ cũ và phân cách phòng. Test sẽ bỏ qua nếu không đặt `RUN_SUPABASE_INTEGRATION=1`. Không chạy với database production khi không cần thiết vì test tạo phòng thật.

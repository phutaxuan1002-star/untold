# UNTOLD — update package

This is a reconstructed source bundle based on the previously generated UNTOLD claymorphism ZIP and SVG patch. It has **not** been compared with the current GitHub repository.

1. Back up the existing GitHub repository and Supabase database.
2. Copy the files in this ZIP into the repository root, preserving `src/` and `supabase/migrations/`.
3. Run `202611050002_infinite_deck.sql` in Supabase SQL Editor **after** the initial migration. Do not rerun the initial migration on an existing database.
4. Set `NEXT_PUBLIC_SUPABASE_URL` to the project base URL (not `/rest/v1/`) and `NEXT_PUBLIC_SUPABASE_ANON_KEY` to the publishable/anon key in Vercel.
5. Run `npm install`, `npm run typecheck`, `npm test`, and `npm run build` locally; resolve any incompatibilities with your live repository.
6. Push to GitHub and deploy via Vercel. Test concurrent draws with multiple browser sessions.

The old `draw_card(text,integer)` function is retained temporarily for compatibility. Revoke its authenticated execution after old clients have stopped using it. The host's manual reset is retained.

NOTE: This package was not deployed or end-to-end tested against your live Supabase instance.

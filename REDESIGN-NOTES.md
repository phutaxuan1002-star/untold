# UNTOLD — Claymorphism redesign

## Changed
- `src/app/page.tsx`: pink clay hero, static decorative card composition, requested content removed.
- `src/components/GameRoom.tsx`: three-region cream/mint/lavender room layout, no progress card/headline/footer, preserved RPC actions and error handling.
- `src/components/GameCard.tsx`: cream bilingual question face and lavender clay back; category and ID hidden in UI only.
- `src/components/Brand.tsx`: molded badge.
- `src/app/globals.css`: complete Claymorphism token set, shadows, responsive breakpoints, reduced motion, focus.
- `src/app/layout.tsx`: Instrument Sans via next/font/google.

## Verification
Static source checks passed for requested removals and preservation of questions, Supabase client, SQL migration files and game RPC references. `npm install` timed out in this runtime; therefore `npm run build`, tests, runtime visuals, and multiplayer integration have NOT been verified here.

## Deployment
Replace project files, commit and push to GitHub. Existing Vercel project redeploys on push. Keep the existing Vercel Supabase environment variables, project configuration, and database. Do not rerun original SQL migration on an existing database.

## Note
The original SQL migration is intentionally unchanged as requested; the previously applied `create_room()` `pgcrypto` fix needs to stay applied to the Supabase database.

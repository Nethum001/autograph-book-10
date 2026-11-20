# Autograph Book'10

A responsive Next.js + Supabase autograph guestbook. New messages are private (`pending`) until an administrator approves them. Only approved notes are shown on the public page.

## 1. Create the database
1. Create a project at https://supabase.com/
2. Open SQL Editor and run `supabase/schema.sql`.
3. In Authentication → Users, create an admin user with an email and password.
4. In `supabase/schema.sql`, replace `admin@example.com` with that exact admin email before running the admin policies (or edit/recreate the policy if already run).

## 2. Configure and run
1. Copy `.env.example` to `.env.local`.
2. Set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` from Supabase Project Settings → API.
3. `npm install`
4. `npm run dev`
5. Open http://localhost:3000

## 3. Admin
Visit `/admin` and sign in with the Supabase user created above. Approve or reject submissions there.

## 4. Deploy
Import this folder into a GitHub repository and deploy it on Vercel. Add the same two `NEXT_PUBLIC_SUPABASE_*` environment variables in Vercel project settings, then deploy.

## Security notes
- Never put the Supabase `service_role` key in browser code or commit it.
- The SQL policy limits public inserts to `pending`, and public reads to `approved`.
- Replace the admin email in the update policy with your own admin account email. Do not share the admin password.
- Add CAPTCHA/rate limiting before sharing widely to reduce spam.

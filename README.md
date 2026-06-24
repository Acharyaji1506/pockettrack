# PocketTrack

A daily expense tracker built for students and bachelors. Log what you spend
on a calendar, see monthly totals, get a daily reminder, and your data quietly
ages out after a year. Built for the Digital Heroes developer trial task.

**Live tool:** pockettrack-beta.vercel.app
**Built by:** Jatin Acharya —jatinacharyan@gmail.com

## Stack (all free tiers)

- Next.js 16 (App Router) + TypeScript + Tailwind CSS
- Supabase (Postgres database + nothing else — auth is custom, not Supabase Auth)
- Deployed on Vercel's free Hobby plan

## 1. Set up the free database (Supabase)

1. Go to [supabase.com](https://supabase.com) → sign up free → "New project".
2. Once it's created, go to **SQL Editor** → paste the contents of
   `supabase/schema.sql` → click **Run**. This creates the `users`,
   `categories`, and `expenses` tables.
3. Go to **Project Settings → API**. Copy:
   - **Project URL** → this is `SUPABASE_URL`
   - **service_role key** (under "Project API keys") → this is
     `SUPABASE_SERVICE_ROLE_KEY`. Keep this secret, never put it in the
     frontend.

## 2. Run it locally

```bash
npm install
cp .env.example .env.local
# paste your Supabase URL + service role key into .env.local
# JWT_SECRET can be any long random string, e.g. run: openssl rand -hex 32
npm run dev
```

Open http://localhost:3000, create an account, start logging expenses.

## 3. Push to GitHub

```bash
git init
git add .
git commit -m "PocketTrack — daily expense tracker"
gh repo create pockettrack --public --source=. --push
# or create a repo on github.com and follow its "push an existing repo" instructions
```

## 4. Deploy on Vercel (free)

1. Go to [vercel.com](https://vercel.com) → sign up with GitHub → **Add New Project**.
2. Import the `pockettrack` repo.
3. Under **Environment Variables**, add the same three variables from your
   `.env.local` (`SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `JWT_SECRET`).
4. Click **Deploy**. No card required on the Hobby plan.

## 5. Before you submit to Digital Heroes

- [ ] Replace the placeholder email in `src/components/Footer.tsx` with your
      real, reachable email.
- [ ] Confirm the live Vercel URL works end to end: sign up, add an expense,
      see it on the calendar.
- [ ] Add this project link to your portfolio.
- [ ] Send: live URL, GitHub repo link, your name + email, one line on why you
      built it, and the portfolio link — all in one message.

## Notes on the daily reminder

The reminder uses the browser's native Notification API — it's free and
needs no backend. It only fires while the site is open in a tab (browsers
don't allow background notifications from a website without a full push
setup). For now this is "good enough to show the feature"; if you want
reminders even when the tab is closed, that needs Web Push + a service
worker + a server-side scheduler — a good next iteration once the core
tool is approved.

## Data retention

Expenses older than 365 days are deleted automatically the next time that
user loads their data — no separate cron job needed, keeps it simple and free.

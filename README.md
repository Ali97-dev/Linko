# LINKO — V1 skeleton

Auth end to end, plus the four core tables (`User`, `Business`, `Provider`,
`Category`). Nothing else yet — that's deliberate. Get this deployed and
working before adding the request workflow.

## What's here

- Registration with role choice (Business / Provider), per ACC-01/ACC-02
- Email verification before login, per ACC-03
- Login/logout with signed httpOnly session cookies, per ACC-04
- Server-side route protection by role (middleware + `requireRole`), per ACC-06
- Basic login rate limiting
- The five launch categories, seeded

Not here yet, on purpose: password reset UI, profile completion forms,
provider verification queue, requests, file uploads. Those come once this
skeleton is confirmed working end to end in production.

## 1. Install dependencies

```
npm install
```

## 2. Set up a free Postgres database

Create a project at [neon.tech](https://neon.tech) (or Supabase). Copy the
connection string.

## 3. Configure environment variables

```
cp .env.example .env
```

Fill in:
- `DATABASE_URL` — the connection string from step 2
- `SESSION_SECRET` — generate with `openssl rand -base64 32`
- Leave `RESEND_API_KEY` blank for now — verification links will print to
  your terminal instead of being emailed, which is enough to test the flow

## 4. Create the database schema

```
npx prisma migrate dev --name init
```

## 5. Seed categories (and optionally an admin account)

```
npm run prisma:seed
```

To also create an admin login, run instead:

```
SEED_ADMIN_EMAIL=admin@yourcompany.com SEED_ADMIN_PASSWORD=changeme123 npm run prisma:seed
```

## 6. Run it

```
npm run dev
```

Visit `http://localhost:3000`.

## 7. Test the full loop

1. Go to `/register`, sign up as a Business.
2. Check your terminal — the verification email is logged there (no Resend
   key configured yet). Copy the link and open it.
3. Go to `/login` and sign in. You should land on `/business`.
4. Try visiting `/provider` or `/admin` directly while logged in as that
   business — you should get bounced to `/login`. That's the role guard
   in `middleware.ts` doing its job.
5. Repeat registration as a Provider, confirm the same flow lands on
   `/provider`.
6. Log in with the seeded admin account, confirm it lands on `/admin`.

## 8. Deploy it

Push to GitHub, import the repo into [Vercel](https://vercel.com), add the
same environment variables in the Vercel project settings, and deploy.
Run `npx prisma migrate deploy` against the production `DATABASE_URL` once
(Vercel's build step won't run migrations for you by default).

Confirm registration → verification email → login → role redirect all work
against the live URL before building anything else on top. This is the
step people skip and regret — better to find a Neon connection or cookie
issue now, with nothing riding on it, than three features in.

## What's new: design system + provider verification

- Tailwind is wired up with the LINKO design tokens (`tailwind.config.ts`) —
  colors, fonts (Poppins for headings, IBM Plex Sans for body), and reusable
  classes (`lk-card`, `lk-btn-primary`, `lk-input`, etc.) in `app/globals.css`
- Provider profile completion at `/provider/profile` — submitting sets
  Verification State to `Pending` (PRV-01, PRV-02, PRV-03)
- Admin verification queue at `/admin/verification` — approve publishes the
  provider, reject requires a reason that's shown back to them (ADM-01, ADM-02)

### Test this flow

1. Register as a Provider, verify email, log in — you'll see a
   "Complete your profile" banner.
2. Fill out the profile form and submit — status flips to "Pending review."
3. Log in as your seeded Admin account, go to `/admin/verification`, and
   you should see that provider's submission.
4. Try both branches: approve one provider, reject another with a reason.
5. Log back in as the rejected provider — confirm the reason shows on their
   dashboard and they can edit and resubmit.

## Next steps, in order

1. ~~Provider profile completion + Admin verification queue~~ — done above
2. Category browsing + provider directory (public pages)
3. Service request state machine
4. File attachments (object storage + async virus scan, per the earlier
   architecture discussion)

# DataGhost.me 👻

The simplest, most transparent way to disappear from data brokers.

**One-time $49 → We blast 70+ opt-out requests and CC you on every single email.  
No account. No subscription. No dashboard. No bullshit.**

Live at → https://dataghost.me

## How It Works (The "Stateful" Flow)

1. **User Pays:** $49 via Stripe (one-time).
2. **Onboarding:** User enters Name, City, State, Age Range, Email.
3. **Immediate Action (Next.js):**
   - Creates a **"Pending Job"** in Supabase (Stateful tracking).
   - Instantly sends ~70 automated opt-out emails via Resend.
   - Instantly sends ~70 automated opt-out emails via Resend.
4. **Background Protocol (Worker):**
   - The Next.js app wakes up our **External Worker** (hosted on Railway).
   - The Worker launches a headless browser (Playwright) to physically fill out removal forms for brokers that reject emails.
   - Updates the job status to `completed` in the database.
5. **The Ghost Protocol:**
   - We re-scan weekly for 45 days.
   - **Day 46:** A hard-deletion cron job wipes the user data from our database permanently.

## Tech Stack

- **Frontend:** Next.js 14 (App Router) + Tailwind + shadcn/ui
- **Backend:** Server Actions + Supabase (Postgres)
- **Worker:** Node.js + Playwright (Microservice on Railway)
- **Email:** Resend (Transactional + Throttling enabled)
- **Payments:** Stripe
- **Hosting:** Netlify (Frontend) + Railway (Worker)

## Env Vars

```env
# App Secrets
RESEND_API_KEY=re_...
STRIPE_WEBHOOK_SECRET=...

# Supabase (Database)
NEXT_PUBLIC_SUPABASE_URL=https://...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=eyJh...

# Worker Connection
WORKER_URL=https://your-worker-app.up.railway.app

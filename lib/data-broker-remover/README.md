# DataGhost 👻

> **"Stateful but Stateless."** The simplest, most transparent way to disappear from data brokers.

DataGhost is a privacy tool that removes user data from 70+ data brokers for a **one-time fee of $49**. Unlike competitors (DeleteMe, Incogni) that require subscriptions, DataGhost executes a "nuclear option": it blasts opt-out requests, confirms removal, and then permanently deletes its own records of the user after 45 days.

**Live at:** [https://dataghost.me](https://dataghost.me)

## Tech Stack

* **Frontend:** [Next.js 14](https://nextjs.org) (App Router) + Tailwind CSS
* **Database:** [Supabase](https://supabase.com) (PostgreSQL)
* **Email:** [Resend](https://resend.com) (Transactional & Batch sending)
* **Payments:** [Lemon Squeezy](https://lemonsqueezy.com) (Merchant of Record)
* **Hosting:** Netlify (Frontend)

## The Ghost Protocol (Architecture)

The system operates on a distributed architecture to handle long-running automation tasks without blocking the user interface.

### Phase 1: Initiation
1.  **Payment:** User pays $49. A webhook (`/api/webhook`) verifies the signature using constant-time comparison to prevent fraud.
2.  **Onboarding:** User enters minimal PII (Name, City, State, Age).
3.  **The "Blast":** The server immediately sends legal opt-out emails to ~40 brokers (e.g., Spokeo, Epsilon). **The user is CC'd on every email** for absolute transparency.

### Phase 2: The "Haunt" (Background Automation)
1.  **Trigger:** The Next.js backend triggers the remote **Worker Service** via a secured HTTP POST.
2.  **Handoff:** The request uses a "Fire-and-Forget" pattern. The frontend waits only for a handshake (HTTP 202) to prevent UI timeouts, ensuring the user sees the Success page immediately.
3.  **Execution:** The Worker (running Playwright) navigates to "hard" targets (e.g., BeenVerified, Whitepages) to fill out complex removal forms.

### Phase 3: The Purge
* **Retention:** Data is held for exactly 45 days to allow for weekly re-scans.
* **Deletion:** On Day 46, a cron job permanently wipes user data from Supabase. No backups. No logs.

## Local Development

### Prerequisites
* Node.js 18+
* Supabase Project
* Resend API Key
* Lemon Squeezy Store ID

### Installation

1.  **Clone & Install**
    ```bash
    git clone [https://github.com/your-username/dataghost.git](https://github.com/your-username/dataghost.git)
    cd dataghost
    npm install
    ```

2.  **Environment Setup**
    Copy `.env.local.example` to `.env.local` and fill in your secrets.
    ```env
    NEXT_PUBLIC_SUPABASE_URL=...
    NEXT_PUBLIC_SUPABASE_ANON_KEY=...
    SUPABASE_SERVICE_ROLE_KEY=...
    RESEND_API_KEY=re_...
    WORKER_URL=http://localhost:8080
    CRON_SECRET=your_shared_secret
    ```

3.  **Run Development Server**
    ```bash
    npm run dev
    ```

##  Security Features

* **CSP:** Strict Content Security Policy with nonces in `middleware.ts`.
* **RLS:** Supabase Row Level Security ensures users (and the service role) can only access authorized data.
* **PII Minimization:** We do not store credit card info. User PII is stored temporarily and encrypted at rest.

## 🔍 SEO & Metadata

This project is optimized to compete with high-DR incumbents.
* **Metadata:** Dynamic generation in `layout.tsx` ensures optimal title/description length for SERPs.
* **JSON-LD:** Rich snippets for `Service`, `Offer`, and `FAQPage`.
* **Sitemap:** Automated `sitemap.ts` prioritizes money pages.

---
*Built by Cavin Krenik.*
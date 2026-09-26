# Ismail Abdul Kareem — Portfolio

Personal portfolio and freelance lead site for **Ismail Abdul Kareem, Freelance Full-Stack AI Engineer**. Live at [buildwithismail.xyz](https://buildwithismail.xyz).

- Interactive 3D hero (React Three Fiber), dark design system, fully responsive, reduced-motion aware
- Pages: Home, About, Projects (+ a case-study page per project), Services, Contact
- Projects, services and skills are stored in **Supabase** and edited from an **admin dashboard**
- Contact form saves leads to Supabase and emails them via **Resend**
- **Groq-powered AI chatbot** that answers questions about Ismail's work, captures leads and saves transcripts
- Direct WhatsApp contact, downloadable CV
- SEO: per-page metadata, canonical URLs, Open Graph image, `sitemap.xml`, `robots.txt`, JSON-LD structured data, and [`llms.txt`](https://llmstxt.org) / `llms-full.txt` for AI assistants

## Tech stack

| Area | Tools |
| --- | --- |
| Framework | Next.js 16 (App Router), React 19, TypeScript |
| Styling & motion | Tailwind CSS v4, Framer Motion |
| 3D | three.js, @react-three/fiber, @react-three/drei |
| Data & auth | Supabase (Postgres, Row Level Security, Auth, Storage) |
| AI chatbot | Vercel AI SDK v7 + `@ai-sdk/groq` |
| Email | Resend |

## Getting started

### 1. Prerequisites

- **Node.js 20+** (developed on Node 24) and npm
- Free accounts on [Supabase](https://supabase.com), [Groq](https://console.groq.com) and [Resend](https://resend.com)

### 2. Clone and install

```bash
git clone https://github.com/IsmailAbdulkareem/ismail-portfolio.git
cd ismail-portfolio
npm install
```

### 3. Create the Supabase database

1. Create a new Supabase project.
2. Open **SQL Editor → New query**, paste the whole of [`supabase/migrations/0001_init.sql`](supabase/migrations/0001_init.sql) and run it. This creates the tables, Row Level Security policies and the public `project-images` storage bucket.
3. In a new query, run [`supabase/seed.sql`](supabase/seed.sql) to load the starting projects, services and skills.
4. *(Optional)* After step 4 below, add the extra CV content (more projects and skills):

   ```bash
   node --env-file=.env.local supabase/scripts/apply-cv-content.mjs
   ```

### 4. Configure environment variables

Copy the template and fill it in:

```bash
cp .env.example .env.local
```

| Variable | Where to find it | Notes |
| --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase → Project Settings → API | e.g. `https://xxxx.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Supabase → Project Settings → API Keys | `sb_publishable_…` (or the legacy anon key) |
| `SUPABASE_SECRET_KEY` | Supabase → Project Settings → API Keys | `sb_secret_…` (or legacy service_role). **Server-only — never expose.** |
| `GROQ_API_KEY` | [console.groq.com/keys](https://console.groq.com/keys) | Powers the chatbot |
| `GROQ_MODEL` | optional | Defaults to `openai/gpt-oss-20b`. Groq retires models over time — pick one from [console.groq.com/docs/models](https://console.groq.com/docs/models) |
| `RESEND_API_KEY` | [resend.com/api-keys](https://resend.com/api-keys) | Sends lead notification emails |
| `CONTACT_TO_EMAIL` | your inbox | Without a verified Resend domain this **must** be your Resend account email |
| `NEXT_PUBLIC_SITE_URL` | optional | Public origin for canonical URLs, sitemap and llms.txt. Defaults to `https://buildwithismail.xyz` |

`.env.local` is git-ignored. Never commit real keys.

### 5. Create your admin account

1. Supabase → **Authentication → Users → Add user → Create new user**. Enter your email and a password and tick **Auto Confirm User**.
2. Copy the new user's **UID**, then run in the SQL Editor:

   ```sql
   insert into admins (user_id) values ('PASTE-USER-UID-HERE');
   ```

Only users listed in `admins` can sign in to the dashboard.

### 6. Run it

```bash
npm run dev        # http://localhost:3000
```

Admin dashboard: [http://localhost:3000/admin/login](http://localhost:3000/admin/login)

Production build:

```bash
npm run build
npm start
```

`npm run lint` runs ESLint. Note that `npm run build` fetches content from Supabase, so the environment variables must be set.

## Project structure

```
src/
  app/
    (site)/            Public pages: /, /about, /projects, /projects/[slug], /services, /contact
    admin/             Dashboard: login, projects (with image upload), leads, chats, services, skills
    api/contact/       Contact form → Supabase + Resend
    api/chat/          Groq chatbot (streaming, lead-capture tool, transcripts)
    llms.txt/, llms-full.txt/, sitemap.ts, robots.ts, manifest.ts, opengraph-image.tsx
  components/          UI by area (hero/ holds the 3D scene, admin/, chat/, projects/, …)
  data/profile.ts      Personal details from the CV — About page, JSON-LD, llms.txt and chatbot all read this
  data/site.ts         Site URL, email, phone/WhatsApp, social links
  lib/                 Supabase clients, queries, auth guard, validation, email, structured data
  proxy.ts             Next.js 16 proxy (middleware): protects /admin
supabase/
  migrations/          Database schema + RLS
  seed.sql             Starting content
  scripts/             Content scripts
public/                Static files, including the downloadable CV
```

## How content works

- **Projects, services and skills** come from Supabase. Edit them at `/admin`; public pages, the sitemap and `llms.txt` refresh immediately after a save.
  - Changes made directly in the Supabase table editor appear within about an hour (pages revalidate hourly).
- **Personal details** (bio, experience, education, contact info) live in `src/data/profile.ts` and `src/data/site.ts`.
- **The CV** is `public/Ismail_Abdul_Kareem.pdf` — replace the file to update the download.

## Security model

- Row Level Security is on for every table. Visitors can only read published content.
- Leads and chat messages are written only by server routes using the secret key, after validation, a honeypot check and per-IP rate limiting.
- The admin area is protected by the proxy **and** by a server-side `requireAdmin()` check in every admin page and Server Action.

## Deploying (Vercel)

1. Import the repository in [Vercel](https://vercel.com/new).
2. Add every variable from `.env.local` under **Project → Settings → Environment Variables** (set `NEXT_PUBLIC_SITE_URL` to your real domain).
3. Deploy. Then submit `https://your-domain/sitemap.xml` in Google Search Console.

## Known limits

- **Resend** without a verified domain can only email the Resend account owner, so there is no automatic reply to visitors until you verify a domain.
- The **rate limiter** is in-memory (per server instance) — fine for a portfolio; use a shared store such as Upstash for stricter limits.
- The **Groq free tier** has per-minute and daily limits; if they're hit, the chatbot shows a friendly "busy" message and points to the contact form.

## Contact

- Email: [ismail233290@gmail.com](mailto:ismail233290@gmail.com)
- WhatsApp: [+92 327 9671138](https://wa.me/923279671138)
- LinkedIn: [ismail-abdul-kareem](https://linkedin.com/in/ismail-abdul-kareem-233b302b3)
- GitHub: [IsmailAbdulkareem](https://github.com/IsmailAbdulkareem)

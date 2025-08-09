## SaaS Analytics Dashboard

Real-time analytics platform for B2B SaaS companies with custom chart builders, user segmentation, and automated reporting.

### Features
- Event ingestion API + tiny browser SDK (`sa(name, props)`).
- Chart Builder with metrics (events.count, users.dau, adoption rate), range, interval, groupBy, filters.
- Dashboards with multiple charts, drag and reorder, realtime updates.
- Segments rule builder → SQL preview and save.
- Reports scheduling (cron) with PDF export and email via Resend.
- Seed + simulator scripts to generate realistic demo data.
- NextAuth email login and RBAC (owner, admin, viewer).
- Accessible UI, responsive, light/dark mode, subtle motion.

### Tech Stack
- Next.js App Router (TypeScript), Tailwind, shadcn/ui, Framer Motion
- Prisma + PostgreSQL (Railway/Supabase/Neon)
- NextAuth (Email)
- socket.io (realtime)
- Recharts (charts)
- Resend (emails), Puppeteer (PDF)
- node-cron or Vercel Cron (scheduling)

### Local Setup
1. Copy `.env.example` to `.env` and fill values.
2. Install deps: `npm i`
3. Setup DB and set `DATABASE_URL`.
4. Generate and migrate:
   - `npx prisma generate`
   - `npx prisma migrate dev`
5. Seed: `node --loader tsx ./src/scripts/seed.ts`
6. Start simulator (optional): `node --loader tsx ./src/scripts/simulator.ts`
7. Start dev server: `npm run dev`

### Event Ingestion
POST `/api/events`
Body:
```json
{"workspaceId":"demo","accountId":"...","userId":"...","name":"feature_x_used","ts":"2025-01-01T00:00:00Z","props":{"k":"v"}}
```

Browser SDK example:
```html
<script>
  window.__SA_WORKSPACE__ = 'demo';
  function sa(name, props){ fetch('/api/events',{method:'POST', headers:{'content-type':'application/json'}, body: JSON.stringify({workspaceId: window.__SA_WORKSPACE__, name, ts: new Date().toISOString(), props})}); }
  sa('page_view', { path: location.pathname });
</script>
```

### Query API
POST `/api/query` returns `{ series[], totals, table[] }` from query JSON.

### Reports
- POST `/api/reports/send` with `{ reportId }` generates a PDF and emails recipients.
- Configure Vercel Cron to call `/api/reports/cron`.

### Deployment
- DB on Railway/Supabase/Neon.
- Deploy app on Vercel. Set env vars: `DATABASE_URL`, `NEXTAUTH_URL`, `NEXTAUTH_SECRET`, `RESEND_API_KEY`, `EMAIL_FROM`.
- For Docker Compose, ensure Chromium deps for Puppeteer.

### Glossary
- DAU: Daily Active Users
- Adoption rate: share of active users that used a given feature during period
- MRR: Monthly Recurring Revenue (not computed here, illustrative only)

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

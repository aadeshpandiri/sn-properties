# SN Properties — Claude Instructions

## Project Overview

**Name:** SN Properties — Premium Real Estate Platform  
**Stack:** Next.js 14+ (App Router) · Tailwind CSS · Supabase · Vercel  
**Language:** JavaScript ONLY — never TypeScript  
**Developer:** Solo (1 developer)  
**Status:** Phase 2 complete ✅ — Phase 3 next

---

## Non-Negotiable Development Rules

1. **JavaScript only** — no `.ts`, no `.tsx`, no type annotations
2. **App Router only** — no `pages/` directory
3. **Tailwind CSS only** — no inline styles, no CSS modules, no styled-components
4. **Design tokens only** — always use `primary`, `secondary`, `accent`, `surface`, `muted`, `border` — never hardcode hex values
5. **Server Components by default** — only add `'use client'` when strictly necessary (event handlers, hooks, browser APIs)
6. **Reusable components** — DRY principle; build to `components/ui/`, `components/forms/`, `components/property/`, `components/admin/`
7. **React Hook Form + Zod** — for every form without exception
8. **Mobile-first** — write mobile styles first, then `sm:`, `md:`, `lg:` overrides
9. **Accessibility** — WCAG 2.1: proper ARIA labels, semantic HTML, keyboard navigation
10. **SEO-first** — export `metadata` from every page, use semantic HTML, structured data where relevant

---

## Design System

### Color Tokens (tailwind.config.js)
| Token | Hex | Usage |
|---|---|---|
| `primary` | `#0F172A` | Dark navy — headings, primary buttons, logo |
| `secondary` | `#1E293B` | Slate — secondary buttons, hover states |
| `accent` | `#D4A373` | Gold/bronze — highlights, focus rings |
| `background` | `#FFFFFF` | Page background |
| `surface` | `#F8FAFC` | Cards, inputs, subtle sections |
| `border` | `#E2E8F0` | Dividers, input borders |
| `text` | `#0F172A` | Body text |
| `muted` | `#64748B` | Subtitles, placeholders, meta text |

### Typography
- **Headings:** Poppins (loaded via Google Fonts in `app/layout.js`)
- **Body:** Inter (loaded via Google Fonts in `app/layout.js`)

### Border Radius
- `rounded-sm` = 8px · `rounded-md` = 12px · `rounded-lg` = 16px · `rounded-xl` = 24px

### Global Utility Classes (defined in `styles/globals.css`)
- `.container-custom` — max-w-7xl, centered, responsive padding
- `.btn-primary`, `.btn-secondary`, `.btn-ghost` — button base styles
- `.card` — white bg, shadow-card, hover shadow
- `.section-title` — text-4xl, bold, text-primary

---

## Project Structure

```
snproperties/
├── app/
│   ├── layout.js              ← Root layout (Navigation + Footer)
│   ├── page.js                ← Homepage
│   ├── properties/page.js     ← Property listings
│   ├── contact/page.js        ← Contact form
│   ├── about/page.js          ← About page
│   └── api/                   ← API routes (Phase 3+)
├── components/
│   ├── Navigation.js          ← Sticky header with Get Started CTA
│   ├── Footer.js              ← Multi-section footer
│   ├── ui/                    ← Button, Card, Modal, Table, ImageGallery, VideoPlayer
│   ├── forms/                 ← Input, TextArea
│   ├── property/              ← PropertyCard
│   └── admin/                 ← Admin-only components (Phase 6+)
├── lib/
│   ├── supabase.js            ← Supabase client
│   ├── utils.js               ← Utility functions
│   ├── constants.js           ← App constants
│   └── validators.js          ← Zod schemas
├── services/
│   ├── properties.js          ← Property data service
│   └── inquiries.js           ← Inquiry data service
├── hooks/
│   ├── useAuth.js             ← Auth hook
│   └── useProperties.js       ← Property queries hook
├── styles/
│   └── globals.css            ← Tailwind imports + custom utilities
├── context/                   ← Project docs (read before each phase)
├── tailwind.config.js
├── next.config.js
└── nodemon.json
```

---

## Database Schema (Supabase — PostgreSQL)

### `properties`
`id` UUID PK · `title` · `slug` (unique) · `description` · `listing_type` (sale/rent) · `property_type` (apartment/house/villa) · `price` decimal · `bedrooms` int · `bathrooms` int · `area` decimal · `address` · `city` · `status` (available/sold/rented) · `featured` bool · `availability_date` · `created_at` · `updated_at` · `user_id` FK

### `property_images`
`id` UUID PK · `property_id` FK · `image_url` · `created_at`

### `property_videos`
`id` UUID PK · `property_id` FK · `video_url` · `created_at`

### `inquiries`
`id` UUID PK · `property_id` FK · `name` · `email` · `phone` · `message` · `status` (new/contacted/qualified/unqualified) · `created_at` · `updated_at`

### `schedule_visits`
`id` UUID PK · `property_id` FK · `visitor_name` · `visitor_email` · `visitor_phone` · `date` · `time` · `status` (pending/confirmed/completed/cancelled) · `created_at`

### `testimonials`
`id` UUID PK · `name` · `rating` int (1-5) · `review` · `image_url` optional · `approved` bool · `created_at`

### `users`
`id` UUID PK · `email` unique · `full_name` · `role` (admin/agent) · `created_at`

---

## Phase Roadmap

| Phase | Title | Status |
|---|---|---|
| 1 | Project Setup | ✅ Complete |
| 2 | UI Components & Page Integration | ✅ Complete |
| 3 | Application Architecture | ✅ Complete |
| 4 | Homepage UI (10 sections) | 🔄 Next |
| 5 | Supabase Setup | ⏳ Pending |
| 6 | Authentication | ⏳ Pending |
| 7 | Property CRUD | ⏳ Pending |
| 8 | Media Uploads | ⏳ Pending |
| 9 | Listing & Search | ⏳ Pending |
| 10 | Property Detail Pages | ⏳ Pending |
| 11 | Lead Management | ⏳ Pending |
| 12 | Testimonials | ⏳ Pending |
| 13 | Content Management | ⏳ Pending |
| 14 | SEO | ⏳ Pending |
| 15 | Testing | ⏳ Pending |
| 16 | Deployment | ⏳ Pending |
| 17 | Performance Optimization | ⏳ Pending |
| 18 | Future Enhancements | ⏳ Pending |

---

## Before Starting Any Phase

1. Read `context/PROGRESS_TRACKER.md` to confirm current status (single source of truth)
2. Read `context/COPILOT_INSTRUCTIONS.md` for full requirements detail
3. Read relevant context files for the phase (PRD, design system, schema)
4. Confirm all dependencies from the previous phase are complete
5. Ask if requirements are unclear — never assume

---

## After Every Phase Completion — MANDATORY

**Two required actions before declaring any phase complete:**

### 1. Update Progress Tracker
Update `context/PROGRESS_TRACKER.md` immediately after completing a phase:
- Mark phase status as `✅ Completed`
- Check off all completed tasks `[x]`
- Add implementation notes (what was built, key decisions)
- Mark the next phase as `🔄 Next Up`
- Update the Summary section (Current Progress %, Last Phase Completed, Next Phase)
- Update `Last Updated` date to today

Also update `CLAUDE.md` Phase Roadmap table to reflect new statuses.

### 2. Verify Live Site
**Check the running dev server before marking complete — do NOT start a new server.**

- Dev server runs at **http://localhost:3001** (or 3000 if 3001 is free — check server output)
- Read the background task output file to confirm the server is healthy and compiling cleanly
- Use `Invoke-WebRequest` to verify all affected pages return expected status codes
- Check for regressions on pages that existed before the phase
- Only mark the phase complete after all checks pass

---

## Component Conventions

### Button (`components/ui/Button.js`)
- Variants: `primary` · `secondary` · `ghost`
- Base includes padding (`px-6 py-3`) and `text-sm` — do not add padding inline unless intentionally overriding for larger CTAs (`px-8 py-3`)
- Use `w-full` when the button should fill its container (e.g. inside cards)

### Card (`components/ui/Card.js`)
- Use `.card` utility class or the `Card` component
- Never add `background-color` inline

### Forms
- All forms use React Hook Form + Zod resolver
- Use `components/forms/Input.js` and `components/forms/TextArea.js`
- Display validation errors inline below each field

### Pages
- Export `metadata` object from every Server Component page
- Keep pages thin — extract sections into components when a section exceeds ~40 lines

---

## Environment Variables

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_APP_URL=
```

Defined in `.env.local`. Never commit secrets. Reference via `process.env.NEXT_PUBLIC_*`.

---

## Key Context Files (read when relevant)

| File | When to read |
|---|---|
| `context/PROGRESS_TRACKER.md` | Live status — always check before starting work (single source of truth) |
| `context/COPILOT_INSTRUCTIONS.md` | Full project rules, phase checklist, communication protocol |
| `context/SN_PROPERTIES_PRD_FULL.md` | Product requirements — what to build and why |
| `context/SN_PROPERTIES_IMPLEMENTATION_PLAN_FULL.md` | Phase-by-phase implementation roadmap |
| `context/DATABASE_SCHEMA.md` | Table definitions for Supabase work |
| `context/UI_UX_DESIGN_SYSTEM.md` | Brand, colors, typography, component list |
| `context/AI_DEVELOPMENT_RULES.md` | Concise rule list for quick reference |

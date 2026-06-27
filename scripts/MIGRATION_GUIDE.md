# SN Properties — Complete Migration Guide

Follow these steps in order when setting up a new Supabase project.

---

## Step 1 — Create Supabase Project

1. Go to **https://supabase.com** → sign in → **New Project**
2. Fill in:
   - **Name:** `sn-properties` (or any name)
   - **Database password:** choose a strong password and save it
   - **Region:** `Europe (London)` — closest to your London office
3. Click **Create new project** and wait ~2 minutes for provisioning

---

## Step 2 — Copy API Keys into .env.local

1. In your Supabase project go to **Settings → API**
2. Copy the following into `.env.local` in your project root:

```env
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...  (anon / public key)
SUPABASE_SERVICE_ROLE_KEY=eyJ...       (service_role key — never expose this publicly)
NEXT_PUBLIC_APP_URL=https://your-vercel-domain.vercel.app
```

> **Important:** `SUPABASE_SERVICE_ROLE_KEY` must NOT have `NEXT_PUBLIC_` prefix.
> It is server-side only and gives full DB access — keep it secret.

Also add these same 4 variables in **Vercel → Project → Settings → Environment Variables**.

---

## Step 3 — Update Supabase Domain in next.config.js

Open `next.config.js` and update the images domains to include your new Supabase project URL:

```js
images: {
  domains: [
    'localhost',
    'vercel.app',
    'YOUR_PROJECT_REF.supabase.co',   // ← replace with your new project ref
    'images.unsplash.com',
  ],
},
```

---

## Step 4 — Run Schema SQL in Supabase SQL Editor

Go to **Supabase → SQL Editor → New query**, paste the entire block below and click **Run**:

```sql
-- =============================================================
-- SN Properties — Full Database Schema
-- Run in: Supabase → SQL Editor → New query
-- =============================================================


-- ── PROPERTIES ───────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS properties (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title             TEXT NOT NULL,
  slug              TEXT UNIQUE,
  description       TEXT,
  listing_type      TEXT NOT NULL CHECK (listing_type IN ('sale', 'rent')),
  property_type     TEXT NOT NULL CHECK (property_type IN ('apartment', 'house', 'villa', 'commercial', 'land')),
  price             DECIMAL NOT NULL,
  bedrooms          INT DEFAULT 0,
  bathrooms         INT DEFAULT 0,
  area              DECIMAL,
  address           TEXT,
  city              TEXT,
  status            TEXT DEFAULT 'available' CHECK (status IN ('available', 'sold', 'rented')),
  featured          BOOL DEFAULT false,
  availability_date DATE,
  user_id           UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  updated_at        TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE properties ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read available" ON properties
  FOR SELECT USING (status = 'available');

CREATE POLICY "Admin full access" ON properties
  FOR ALL USING (auth.role() = 'authenticated');


-- ── PROPERTY IMAGES ──────────────────────────────────────────

CREATE TABLE IF NOT EXISTS property_images (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  image_url   TEXT NOT NULL,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE property_images ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read" ON property_images FOR SELECT USING (true);
CREATE POLICY "Admin write" ON property_images FOR ALL USING (auth.role() = 'authenticated');


-- ── PROPERTY VIDEOS ──────────────────────────────────────────

CREATE TABLE IF NOT EXISTS property_videos (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  video_url   TEXT NOT NULL,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE property_videos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read" ON property_videos FOR SELECT USING (true);
CREATE POLICY "Admin write" ON property_videos FOR ALL USING (auth.role() = 'authenticated');


-- ── INQUIRIES ────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS inquiries (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID REFERENCES properties(id) ON DELETE SET NULL,
  name        TEXT NOT NULL,
  email       TEXT NOT NULL,
  phone       TEXT,
  message     TEXT NOT NULL,
  status      TEXT DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'qualified', 'unqualified')),
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE inquiries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public insert" ON inquiries FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin read/write" ON inquiries FOR ALL USING (auth.role() = 'authenticated');


-- ── SCHEDULE VISITS ──────────────────────────────────────────

CREATE TABLE IF NOT EXISTS schedule_visits (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id   UUID REFERENCES properties(id) ON DELETE SET NULL,
  visitor_name  TEXT NOT NULL,
  visitor_email TEXT NOT NULL,
  visitor_phone TEXT,
  date          DATE NOT NULL,
  time          TEXT NOT NULL,
  status        TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE schedule_visits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public insert" ON schedule_visits FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin read/write" ON schedule_visits FOR ALL USING (auth.role() = 'authenticated');


-- ── TESTIMONIALS ─────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS testimonials (
  id        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name      TEXT NOT NULL,
  rating    INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  review    TEXT NOT NULL,
  image_url TEXT,
  approved  BOOL DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read approved" ON testimonials
  FOR SELECT USING (approved = true);

CREATE POLICY "Admin full access" ON testimonials
  FOR ALL USING (auth.role() = 'authenticated');


-- ── SITE SETTINGS ────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS site_settings (
  key        TEXT PRIMARY KEY,
  value      TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read" ON site_settings FOR SELECT USING (true);
CREATE POLICY "Admin write" ON site_settings FOR ALL USING (auth.role() = 'authenticated');


-- ── FAQS ─────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS faqs (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question    TEXT NOT NULL,
  answer      TEXT NOT NULL,
  order_index INT DEFAULT 0,
  active      BOOL DEFAULT true,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE faqs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read active" ON faqs FOR SELECT USING (active = true);
CREATE POLICY "Admin write" ON faqs FOR ALL USING (auth.role() = 'authenticated');
```

---

## Step 5 — Create Storage Buckets

Go to **Supabase → Storage → New bucket** and create **two** buckets:

### Bucket 1: property-images
- **Name:** `property-images`
- **Public bucket:** ✅ Yes (toggle ON)
- Click **Create bucket**

### Bucket 2: property-videos
- **Name:** `property-videos`
- **Public bucket:** ✅ Yes (toggle ON)
- Click **Create bucket**

Then for **each bucket**, go to **Policies** and add these storage policies:

```sql
-- Run once for property-images bucket:
CREATE POLICY "Public read images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'property-images');

CREATE POLICY "Auth upload images"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'property-images' AND auth.role() = 'authenticated');

CREATE POLICY "Auth delete images"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'property-images' AND auth.role() = 'authenticated');

-- Run once for property-videos bucket:
CREATE POLICY "Public read videos"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'property-videos');

CREATE POLICY "Auth upload videos"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'property-videos' AND auth.role() = 'authenticated');

CREATE POLICY "Auth delete videos"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'property-videos' AND auth.role() = 'authenticated');
```

---

## Step 6 — Create Admin User

Go to **Supabase → Authentication → Users → Add user**:
- **Email:** your admin email
- **Password:** your admin password
- Click **Create user**

This user will be able to log in to `/admin/login`.

---

## Step 7 — Seed Initial Data (Optional)

Run this in **Supabase → SQL Editor** to populate contact info and FAQs:

```sql
-- Site settings (company contact details)
INSERT INTO site_settings (key, value) VALUES
  ('phone',           '+44 7424 794571'),
  ('email',           'Snlettingsproperties@gmail.com'),
  ('address',         'Icon Office London, Office 1, 182-184 High Street North, East Ham, London E6 2JA'),
  ('hours_weekday',   'Mon - Fri: 9:00 AM - 6:00 PM'),
  ('hours_saturday',  'Sat: 10:00 AM - 4:00 PM'),
  ('hours_sunday',    'Sun: Closed'),
  ('whatsapp',        '447424794571')
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;

-- FAQs
INSERT INTO faqs (question, answer, order_index, active) VALUES
('What areas do you cover?',
 'We cover London and surrounding areas. Contact us with your specific location and we will connect you with the right expert.',
 0, true),
('How long does the buying process typically take?',
 'On average, buying a property in the UK takes 8 to 12 weeks from offer acceptance to completion. Our team will keep you informed at every stage.',
 1, true),
('Do you handle both sales and rentals?',
 'Yes, we manage both sales and long-term rental listings across London and the wider UK.',
 2, true),
('What documents do I need to start the process?',
 'For buyers: a mortgage agreement in principle or proof of funds, government-issued ID, and proof of address. For renters: ID, proof of income, and references. We will walk you through everything on our first call.',
 3, true);
```

---

## Step 8 — Update Vercel Environment Variables

In **Vercel → Project → Settings → Environment Variables**, update all 4 variables with your new Supabase project values:

| Variable | Value |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | New project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | New anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | New service role key |
| `NEXT_PUBLIC_APP_URL` | Your Vercel domain |

Then go to **Vercel → Deployments → Redeploy** (latest deployment) to apply the new env vars.

---

## Step 9 — Update Supabase Auth Redirect URLs

In **Supabase → Authentication → URL Configuration**:
- **Site URL:** `https://your-vercel-domain.vercel.app`
- **Redirect URLs:** add `https://your-vercel-domain.vercel.app/**`

---

## Checklist

- [ ] New Supabase project created (London region)
- [ ] `.env.local` updated with new keys
- [ ] `next.config.js` updated with new Supabase domain
- [ ] Schema SQL run (Step 4)
- [ ] `property-images` storage bucket created (public)
- [ ] `property-videos` storage bucket created (public)
- [ ] Storage policies applied (Step 5)
- [ ] Admin user created in Supabase Auth
- [ ] Site settings and FAQs seeded (Step 7)
- [ ] Vercel env vars updated and redeployed (Step 8)
- [ ] Supabase auth redirect URLs updated (Step 9)

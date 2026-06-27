-- =============================================================
-- SN Properties -- Full Setup + Seed Data for Manual Testing
-- Run in: Supabase -> SQL Editor
-- =============================================================


-- ── CREATE TABLES (Phase 13) ─────────────────────────────────

CREATE TABLE IF NOT EXISTS site_settings (
  key        TEXT PRIMARY KEY,
  value      TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'site_settings' AND policyname = 'Public read'
  ) THEN
    CREATE POLICY "Public read" ON site_settings FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'site_settings' AND policyname = 'Admin write'
  ) THEN
    CREATE POLICY "Admin write" ON site_settings FOR ALL USING (auth.role() = 'authenticated');
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS faqs (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question    TEXT NOT NULL,
  answer      TEXT NOT NULL,
  order_index INT  DEFAULT 0,
  active      BOOL DEFAULT TRUE,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE faqs ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'faqs' AND policyname = 'Public read active'
  ) THEN
    CREATE POLICY "Public read active" ON faqs FOR SELECT USING (active = true);
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'faqs' AND policyname = 'Admin write'
  ) THEN
    CREATE POLICY "Admin write" ON faqs FOR ALL USING (auth.role() = 'authenticated');
  END IF;
END $$;


-- ── PROPERTIES ───────────────────────────────────────────────

INSERT INTO properties (id, title, slug, description, listing_type, property_type, price, bedrooms, bathrooms, area, address, city, status, featured) VALUES

('aaaaaaaa-0001-0001-0001-000000000001',
 'Luxury Penthouse with City Views',
 'luxury-penthouse-city-views',
 'Breathtaking penthouse on the 32nd floor with panoramic San Francisco skyline views. Features floor-to-ceiling windows, a gourmet kitchen with marble countertops, an open-plan living area, and a private rooftop terrace. Building amenities include a concierge, gym, and underground parking.',
 'sale', 'apartment', 2500000, 3, 2, 2800,
 '100 Market Street', 'San Francisco', 'available', true),

('aaaaaaaa-0002-0002-0002-000000000002',
 'Modern Family Home in Pacific Heights',
 'modern-family-home-pacific-heights',
 'Beautifully renovated 4-bedroom home in the prestigious Pacific Heights neighbourhood. Bright and airy interiors with hardwood floors throughout, a modern kitchen, formal dining room, and a sun-filled rear garden. Walking distance to top-rated schools and boutique shops.',
 'sale', 'house', 1850000, 4, 3, 3200,
 '2240 Broadway Street', 'San Francisco', 'available', true),

('aaaaaaaa-0003-0003-0003-000000000003',
 'Beachfront Villa Half Moon Bay',
 'beachfront-villa-half-moon-bay',
 'Stunning oceanfront villa with direct beach access and unobstructed Pacific Ocean views. The property features 5 bedrooms, a resort-style pool, outdoor entertaining deck, and a separate guest cottage. Fully furnished and available for long-term lease.',
 'rent', 'villa', 9500, 5, 4, 4800,
 '1 Ocean View Drive', 'Half Moon Bay', 'available', true),

('aaaaaaaa-0004-0004-0004-000000000004',
 'Chic Studio in SoMa',
 'chic-studio-soma',
 'Compact and clever studio apartment in the heart of South of Market. High ceilings, polished concrete floors, and a modern kitchen make this the perfect urban retreat. In-unit laundry, bike storage, and rooftop access included.',
 'rent', 'apartment', 2800, 0, 1, 520,
 '888 Brannan Street', 'San Francisco', 'available', false),

('aaaaaaaa-0005-0005-0005-000000000005',
 'Elegant Noe Valley Townhouse',
 'elegant-noe-valley-townhouse',
 'Immaculate three-storey townhouse in one of San Francisco most sought-after neighbourhoods. Features a private garage, roof deck with Bay Bridge views, open-plan kitchen and living area, and three generous bedrooms each with en-suite bathrooms.',
 'sale', 'house', 3100000, 3, 3, 2600,
 '4100 24th Street', 'San Francisco', 'available', false),

('aaaaaaaa-0006-0006-0006-000000000006',
 'Spacious 2-Bed in Mission District',
 'spacious-2bed-mission-district',
 'Bright and spacious 2-bedroom apartment in the vibrant Mission District. Original Victorian details blend with modern finishes. Large eat-in kitchen, bay windows, in-unit washer/dryer, and a private storage unit in the basement.',
 'rent', 'apartment', 4200, 2, 1, 1050,
 '3250 21st Street', 'San Francisco', 'available', false);


-- ── PROPERTY IMAGES ──────────────────────────────────────────

INSERT INTO property_images (property_id, image_url) VALUES
('aaaaaaaa-0001-0001-0001-000000000001', 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=900'),
('aaaaaaaa-0001-0001-0001-000000000001', 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=900'),
('aaaaaaaa-0001-0001-0001-000000000001', 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=900'),

('aaaaaaaa-0002-0002-0002-000000000002', 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=900'),
('aaaaaaaa-0002-0002-0002-000000000002', 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=900'),

('aaaaaaaa-0003-0003-0003-000000000003', 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=900'),
('aaaaaaaa-0003-0003-0003-000000000003', 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=900'),
('aaaaaaaa-0003-0003-0003-000000000003', 'https://images.unsplash.com/photo-1416331108676-a22ccb276e35?w=900'),

('aaaaaaaa-0004-0004-0004-000000000004', 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=900'),

('aaaaaaaa-0005-0005-0005-000000000005', 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=900'),
('aaaaaaaa-0005-0005-0005-000000000005', 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=900'),

('aaaaaaaa-0006-0006-0006-000000000006', 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=900');


-- ── TESTIMONIALS ─────────────────────────────────────────────

INSERT INTO testimonials (name, rating, review, approved) VALUES
('Jennifer and Mark Davis', 5,
 'SN Properties turned what seemed like an impossible dream into reality. Their team guided us through every step with patience and expertise. We could not be happier with our new home in Pacific Heights.',
 true),
('Robert Chen', 5,
 'As a property investor I rely on accurate market insights and reliable execution. SN Properties delivered on both fronts. Closed two deals in under 30 days -- outstanding service.',
 true),
('Sarah Mitchell', 4,
 'Found the perfect rental for my family within a week of first contact. The process was completely transparent and stress-free from start to finish. Highly recommended.',
 true);


-- ── FAQS ─────────────────────────────────────────────────────

INSERT INTO faqs (question, answer, order_index, active) VALUES
('What areas do you cover?',
 'We cover the entire San Francisco Bay Area including San Francisco, Oakland, San Jose, Marin County, the Peninsula, and the East Bay. Contact us if you are looking in a specific neighbourhood and we will connect you with the right expert.',
 0, true),
('How long does the buying process typically take?',
 'On average, buying a property takes 30 to 60 days from offer acceptance to close of escrow. The timeline depends on financing, inspections, and any contingencies in the contract. Our team will keep you informed at every stage.',
 1, true),
('Do you handle both sales and rentals?',
 'Yes, we manage both sales and long-term rental listings. Whether you are buying your first home, investing in a rental property, or looking for a place to lease, our agents are experienced across all transaction types.',
 2, true),
('What documents do I need to start the process?',
 'For buyers: a mortgage pre-approval letter or proof of funds for cash buyers, government-issued ID, and a signed buyer agreement. For renters: ID, proof of income (last 2 pay stubs), and references. We will walk you through everything on our first call.',
 3, true);


-- ── SITE SETTINGS ────────────────────────────────────────────

INSERT INTO site_settings (key, value) VALUES
  ('phone',           '+44 7424 794571'),
  ('email',           'Snlettingsproperties@gmail.com'),
  ('address',         'Icon Office London, Office 1, 182-184 High Street North, East Ham, London E6 2JA'),
  ('hours_weekday',   'Mon - Fri: 9:00 AM - 6:00 PM'),
  ('hours_saturday',  'Sat: 10:00 AM - 4:00 PM'),
  ('hours_sunday',    'Sun: Closed'),
  ('whatsapp',        '447424794571')
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;

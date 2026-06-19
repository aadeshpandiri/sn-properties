-- ============================================================
-- SN Properties — Full Database Schema
-- Run this in Supabase Dashboard → SQL Editor → New Query
-- ============================================================

-- UUID extension (usually already enabled on Supabase)
create extension if not exists "uuid-ossp";


-- ── 1. PROPERTIES ───────────────────────────────────────────
create table public.properties (
  id              uuid default uuid_generate_v4() primary key,
  title           text not null,
  slug            text unique not null,
  description     text,
  listing_type    text not null check (listing_type in ('sale', 'rent')),
  property_type   text not null check (property_type in ('apartment', 'house', 'villa', 'commercial', 'land')),
  price           decimal(12, 2) not null,
  bedrooms        integer default 0,
  bathrooms       integer default 0,
  area            decimal(10, 2),
  address         text,
  city            text not null,
  status          text not null default 'available' check (status in ('available', 'sold', 'rented')),
  featured        boolean default false,
  availability_date date,
  user_id         uuid references auth.users(id) on delete set null,
  created_at      timestamptz default now(),
  updated_at      timestamptz default now()
);


-- ── 2. PROPERTY IMAGES ──────────────────────────────────────
create table public.property_images (
  id          uuid default uuid_generate_v4() primary key,
  property_id uuid references public.properties(id) on delete cascade not null,
  image_url   text not null,
  created_at  timestamptz default now()
);


-- ── 3. PROPERTY VIDEOS ──────────────────────────────────────
create table public.property_videos (
  id          uuid default uuid_generate_v4() primary key,
  property_id uuid references public.properties(id) on delete cascade not null,
  video_url   text not null,
  created_at  timestamptz default now()
);


-- ── 4. INQUIRIES ────────────────────────────────────────────
create table public.inquiries (
  id          uuid default uuid_generate_v4() primary key,
  property_id uuid references public.properties(id) on delete set null,
  name        text not null,
  email       text not null,
  phone       text,
  message     text not null,
  status      text not null default 'new' check (status in ('new', 'contacted', 'qualified', 'unqualified', 'closed')),
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);


-- ── 5. SCHEDULE VISITS ──────────────────────────────────────
create table public.schedule_visits (
  id             uuid default uuid_generate_v4() primary key,
  property_id    uuid references public.properties(id) on delete set null,
  visitor_name   text not null,
  visitor_email  text not null,
  visitor_phone  text,
  date           date not null,
  time           text not null,
  status         text not null default 'pending' check (status in ('pending', 'confirmed', 'completed', 'cancelled')),
  created_at     timestamptz default now()
);


-- ── 6. TESTIMONIALS ─────────────────────────────────────────
create table public.testimonials (
  id          uuid default uuid_generate_v4() primary key,
  name        text not null,
  rating      integer not null check (rating >= 1 and rating <= 5),
  review      text not null,
  image_url   text,
  approved    boolean default false,
  created_at  timestamptz default now()
);


-- ── 7. USERS / PROFILES ─────────────────────────────────────
create table public.users (
  id          uuid references auth.users(id) on delete cascade primary key,
  email       text unique not null,
  full_name   text,
  role        text not null default 'agent' check (role in ('admin', 'agent')),
  created_at  timestamptz default now()
);


-- ── INDEXES ─────────────────────────────────────────────────
create index idx_properties_listing_type  on public.properties(listing_type);
create index idx_properties_city          on public.properties(city);
create index idx_properties_status        on public.properties(status);
create index idx_properties_featured      on public.properties(featured);
create index idx_property_images_prop     on public.property_images(property_id);
create index idx_property_videos_prop     on public.property_videos(property_id);
create index idx_inquiries_property_id    on public.inquiries(property_id);
create index idx_inquiries_status         on public.inquiries(status);
create index idx_visits_property_id       on public.schedule_visits(property_id);
create index idx_testimonials_approved    on public.testimonials(approved);


-- ── AUTO-UPDATE updated_at ──────────────────────────────────
create or replace function public.update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger trg_properties_updated_at
  before update on public.properties
  for each row execute function public.update_updated_at();

create trigger trg_inquiries_updated_at
  before update on public.inquiries
  for each row execute function public.update_updated_at();


-- ── AUTO-CREATE USER PROFILE ON SIGNUP ──────────────────────
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.users (id, email, full_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', new.email)
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();


-- ── ROW LEVEL SECURITY ──────────────────────────────────────
alter table public.properties       enable row level security;
alter table public.property_images  enable row level security;
alter table public.property_videos  enable row level security;
alter table public.inquiries        enable row level security;
alter table public.schedule_visits  enable row level security;
alter table public.testimonials     enable row level security;
alter table public.users            enable row level security;


-- Properties: public can read available properties
create policy "Public read available properties"
  on public.properties for select
  using (status = 'available');

-- Properties: authenticated users can read all (admin/agent)
create policy "Auth users read all properties"
  on public.properties for select
  using (auth.role() = 'authenticated');

-- Properties: authenticated users can insert/update/delete
create policy "Auth users manage properties"
  on public.properties for all
  using (auth.role() = 'authenticated');


-- Property images & videos: public can read
create policy "Public read property images"
  on public.property_images for select using (true);

create policy "Auth users manage property images"
  on public.property_images for all using (auth.role() = 'authenticated');

create policy "Public read property videos"
  on public.property_videos for select using (true);

create policy "Auth users manage property videos"
  on public.property_videos for all using (auth.role() = 'authenticated');


-- Inquiries: anyone can submit; only auth users can read/update
create policy "Anyone can submit inquiry"
  on public.inquiries for insert with check (true);

create policy "Auth users read inquiries"
  on public.inquiries for select using (auth.role() = 'authenticated');

create policy "Auth users update inquiries"
  on public.inquiries for update using (auth.role() = 'authenticated');

create policy "Auth users delete inquiries"
  on public.inquiries for delete using (auth.role() = 'authenticated');


-- Schedule visits: anyone can book; only auth users can read/update
create policy "Anyone can book a visit"
  on public.schedule_visits for insert with check (true);

create policy "Auth users read visits"
  on public.schedule_visits for select using (auth.role() = 'authenticated');

create policy "Auth users update visits"
  on public.schedule_visits for update using (auth.role() = 'authenticated');


-- Testimonials: public reads approved; auth manages all
create policy "Public read approved testimonials"
  on public.testimonials for select using (approved = true);

create policy "Auth users manage testimonials"
  on public.testimonials for all using (auth.role() = 'authenticated');


-- Users: users see their own row; auth users see all
create policy "Users see own profile"
  on public.users for select using (auth.uid() = id);

create policy "Auth users see all profiles"
  on public.users for select using (auth.role() = 'authenticated');

create policy "Auth users update profiles"
  on public.users for update using (auth.role() = 'authenticated');

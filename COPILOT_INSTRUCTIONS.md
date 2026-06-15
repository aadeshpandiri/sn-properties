# SN Properties - Development Context & Copilot Instructions

## Session Context

**Project:** SN Properties - Premium Real Estate Platform  
**Language:** JavaScript (NOT TypeScript)  
**Framework:** Next.js 14+ with App Router  
**Status:** Pre-Development (Ready for Phase 1)  
**Timeline:** 2-3 weeks expedited  
**Developer:** Solo (1 developer)  
**Last Updated:** 2026-06-16

---

## Project Summary

Build a premium real estate platform with:
- **Public Site:** Homepage, property listings, property details, search/filter
- **Admin Dashboard:** Property management, lead management, testimonials, content management
- **Lead Management:** Inquiry tracking, status updates, follow-ups
- **SEO:** Dynamic metadata, sitemap, structured data, robots.txt
- **Database:** Supabase (PostgreSQL)
- **Deployment:** Vercel
- **Email:** Resend for notifications

---

## Tech Stack (Confirmed)

```
Frontend: Next.js 14+ (App Router)
Language: JavaScript only
Styling: Tailwind CSS (no inline styles)
Forms: React Hook Form + Zod validation
Database: Supabase (PostgreSQL)
Storage: Supabase Storage (images/videos)
Auth: Supabase Auth
Email: Resend
Deployment: Vercel
Hosting: Vercel
```

---

## Development Rules (Must Follow)

### CRITICAL - Non-Negotiable Rules:
1. ✅ **JavaScript only** - NO TypeScript
2. ✅ **Server Components by default** - minimize client-side JS
3. ✅ **Tailwind CSS only** - NO inline styles
4. ✅ **Reusable components only** - DRY principle
5. ✅ **Design tokens** - use color/spacing variables consistently
6. ✅ **Mobile-first** - design for mobile then scale up
7. ✅ **Accessibility** - WCAG 2.1 compliance
8. ✅ **SEO-first** - structure for search engines
9. ✅ **React Hook Form + Zod** - for all forms

### Code Organization:
```
project-root/
├── app/
│   ├── (public)/
│   │   ├── page.js          (homepage)
│   │   ├── properties/      (listings & details)
│   │   └── contact/         (contact forms)
│   ├── (admin)/
│   │   ├── dashboard/       (admin dashboard)
│   │   ├── properties/      (property CRUD)
│   │   ├── inquiries/       (lead management)
│   │   ├── testimonials/    (testimonial management)
│   │   └── content/         (content management)
│   ├── api/
│   │   ├── properties/      (property endpoints)
│   │   ├── inquiries/       (inquiry endpoints)
│   │   ├── upload/          (media upload)
│   │   └── auth/            (authentication)
│   └── layout.js
├── components/
│   ├── ui/                  (reusable UI components)
│   ├── forms/               (form components)
│   ├── property/            (property-specific components)
│   └── admin/               (admin-only components)
├── lib/
│   ├── supabase.js          (Supabase client)
│   ├── utils.js             (utility functions)
│   ├── constants.js         (app constants)
│   └── validators.js        (Zod schemas)
├── hooks/
│   ├── useAuth.js           (authentication hook)
│   ├── useProperties.js     (property queries)
│   └── custom hooks...
├── services/
│   ├── properties.js        (property service)
│   ├── inquiries.js         (inquiry service)
│   ├── email.js             (email service)
│   └── storage.js           (Supabase storage)
├── public/
│   └── images/              (static images)
├── styles/
│   └── globals.css          (Tailwind + design tokens)
├── tailwind.config.js       (design tokens)
└── package.json
```

---

## Database Schema Reference

### Tables to Create (in Supabase):

#### properties
```
- id: UUID (primary key)
- title: string
- slug: string (unique)
- description: text
- listing_type: enum (sale/rent)
- property_type: enum (apartment/house/villa/etc)
- price: decimal
- bedrooms: integer
- bathrooms: integer
- area: decimal
- address: string
- city: string
- status: enum (available/sold/rented)
- featured: boolean
- availability_date: date
- created_at: timestamp
- updated_at: timestamp
- user_id: UUID (foreign key to users)
```

#### property_images
```
- id: UUID (primary key)
- property_id: UUID (foreign key)
- image_url: string
- created_at: timestamp
```

#### property_videos
```
- id: UUID (primary key)
- property_id: UUID (foreign key)
- video_url: string
- created_at: timestamp
```

#### inquiries
```
- id: UUID (primary key)
- property_id: UUID (foreign key)
- name: string
- email: string
- phone: string
- message: text
- status: enum (new/contacted/qualified/unqualified)
- created_at: timestamp
- updated_at: timestamp
```

#### schedule_visits
```
- id: UUID (primary key)
- property_id: UUID (foreign key)
- visitor_name: string
- visitor_email: string
- visitor_phone: string
- date: date
- time: time
- status: enum (pending/confirmed/completed/cancelled)
- created_at: timestamp
```

#### testimonials
```
- id: UUID (primary key)
- name: string
- rating: integer (1-5)
- review: text
- image_url: string (optional)
- approved: boolean
- created_at: timestamp
```

#### users
```
- id: UUID (primary key)
- email: string (unique)
- full_name: string
- role: enum (admin/agent)
- created_at: timestamp
```

---

## Design System Reference

### Color Palette
```javascript
const colors = {
  primary: '#0F172A',      // Dark navy
  secondary: '#1E293B',    // Slate
  accent: '#D4A373',       // Gold/bronze
  background: '#FFFFFF',   // White
  surface: '#F8FAFC',      // Light slate
  border: '#E2E8F0',       // Light border
  text: '#0F172A',         // Primary text
  muted: '#64748B',        // Muted text
};
```

### Typography
```javascript
const typography = {
  headings: 'Poppins',     // Font family
  body: 'Inter',           // Font family
};
```

### Spacing & Border Radius
```javascript
const spacing = {
  sm: '8px',
  md: '12px',
  lg: '16px',
  xl: '24px',
};
```

### Components to Build (Phase 2)
- Button (primary, secondary, ghost variants)
- Card (elevated, flat variants)
- Form inputs (text, email, tel, textarea, select)
- Modal
- Table
- Property Card
- Image Gallery
- Video Player

---

## Implementation Phases Checklist

### Phase 1: Project Setup
Deliverables:
- Next.js 14+ project initialized with App Router
- Tailwind CSS configured with design tokens
- Essential packages installed (React Hook Form, Zod, Supabase)
- Environment variables configured
- Project folder structure created
- Git repository initialized

### Phase 2: Design System
Deliverables:
- Design token variables in tailwind.config.js
- 8+ reusable UI components built
- Component documentation/usage examples
- Design consistency maintained

### Phase 3: Application Architecture
Deliverables:
- Folder structure created
- API route handlers setup
- Custom hooks created
- Utility functions created
- Error handling implemented
- Logging system setup

### Phase 4: Homepage UI
Deliverables:
- 10 homepage sections built
- Mobile-first responsive design
- SEO metadata setup
- Accessibility compliance

### Phase 5: Supabase Setup
Deliverables:
- Supabase project created
- All tables created with correct schemas
- RLS (Row Level Security) policies configured
- Storage buckets created
- Database connection tested

### Phase 6: Authentication
Deliverables:
- Supabase Auth integrated
- Login/signup pages built
- Protected admin routes
- Session management working
- Password reset functional

### Phase 7: Property CRUD
Deliverables:
- Property form component
- Add/Edit/Delete property functionality
- API endpoints for CRUD
- Property validation with Zod
- Admin pages for property management

### Phase 8: Media Uploads
Deliverables:
- Image/video upload components
- Image optimization
- Supabase Storage integration
- Media gallery functionality
- Delete media capability

### Phase 9: Listing & Search
Deliverables:
- Property listings page
- Search functionality
- Filter system (price, type, location, etc.)
- Sort options
- Pagination

### Phase 10: Property Detail Pages
Deliverables:
- Dynamic property detail pages
- Image gallery
- Video tour
- Amenities display
- Inquiry form
- WhatsApp CTA
- Schedule visit form
- Dynamic SEO metadata

### Phase 11: Lead Management
Deliverables:
- Inquiries list view
- Inquiry detail view
- Status update functionality
- Notes system
- Follow-up tracking
- Email notifications

### Phase 12: Testimonials
Deliverables:
- Testimonial management interface
- Homepage testimonial display
- Carousel component
- Rating system

### Phase 13: Content Management
Deliverables:
- About/Why Choose Us content management
- Contact information management
- CTA configuration
- Content editing interface

### Phase 14: SEO
Deliverables:
- Dynamic meta tags
- sitemap.xml
- robots.txt
- OpenGraph tags
- JSON-LD structured data
- Breadcrumbs

### Phase 15: Testing
Deliverables:
- Unit tests for components
- Integration tests for API routes
- E2E tests
- Accessibility tests
- Performance benchmarks

### Phase 16: Deployment
Deliverables:
- Production Vercel deployment
- CI/CD pipeline setup
- Domain configuration
- SSL certificate
- Monitoring setup

### Phase 17: Performance Optimization
Deliverables:
- Image optimization
- Code splitting
- Caching strategy
- Lighthouse scores > 90

### Phase 18: Future Enhancements
Deliverables:
- Documentation for future features
- Feature roadmap

---

## Progress Tracking

**Always update PROGRESS_TRACKER.md:**
1. When starting a new task, mark status as "🔄 In Progress"
2. When completing a task, mark status as "✅ Completed"
3. Document blockers if any
4. Add notes about decisions/changes
5. Update completion percentage

---

## Important Notes

### Before Starting Each Phase:
1. Read the progress tracker to understand completed work
2. Check for dependencies on previous phases
3. Ask questions if requirements are unclear
4. Update the progress tracker with current phase status

### During Development:
1. Keep components small and reusable
2. Use design tokens consistently
3. Test on mobile first (mobile-first development)
4. Maintain accessibility (WCAG 2.1)
5. No inline styles - use Tailwind classes only
6. Prefer Server Components over Client Components

### Code Quality:
1. Clean, readable JavaScript code
2. Consistent naming conventions
3. Proper error handling
4. Environment variables for secrets
5. Comments for complex logic
6. DRY principle - no code duplication

### Communication Protocol:
1. **Phase Complete:** Mark in tracker before moving to next
2. **Questions:** Ask before assuming
3. **Blockers:** Document and communicate immediately
4. **Changes:** Update all affected MD files
5. **Context:** Refer to this file and PROGRESS_TRACKER.md

---

## Quick Reference Links

- [Progress Tracker](PROGRESS_TRACKER.md)
- [Product Requirements](SN_PROPERTIES_PRD_FULL.md)
- [Implementation Plan](SN_PROPERTIES_IMPLEMENTATION_PLAN_FULL.md)
- [Design System](UI_UX_DESIGN_SYSTEM.md)
- [Database Schema](DATABASE_SCHEMA.md)
- [Development Rules](AI_DEVELOPMENT_RULES.md)

---

## Next Steps

✅ **Preparation Complete**  
→ Ready to start **Phase 1: Project Setup**


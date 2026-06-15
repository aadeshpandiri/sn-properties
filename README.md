# SN Properties - Real Estate Platform

A premium real estate platform built with Next.js 14, React, Tailwind CSS, and Supabase.

## Project Structure

```
snproperties/ (project root)
├── app/                    # Next.js App Router
│   ├── layout.js          # Root layout
│   ├── page.js            # Homepage
│   ├── (public)/          # Public routes
│   └── (admin)/           # Admin routes (protected)
├── components/            # Reusable React components
│   ├── ui/               # Base UI components
│   ├── forms/            # Form components
│   ├── property/         # Property-specific components
│   └── admin/            # Admin-only components
├── lib/                   # Utility and helper functions
│   ├── supabase.js       # Supabase client initialization
│   ├── utils.js          # Utility functions
│   ├── constants.js      # Application constants
│   └── validators.js     # Zod validation schemas
├── hooks/                 # Custom React hooks
│   ├── useAuth.js        # Authentication hook
│   └── useProperties.js  # Properties hook
├── services/             # Business logic and API calls
│   ├── properties.js     # Property service
│   └── inquiries.js      # Inquiry service
├── styles/               # Global styles
│   └── globals.css       # Tailwind + custom styles
├── public/               # Static assets
├── context/              # Documentation & context files
│   ├── PROGRESS_TRACKER.md
│   ├── COPILOT_INSTRUCTIONS.md
│   ├── SN_PROPERTIES_PRD_FULL.md
│   ├── SN_PROPERTIES_IMPLEMENTATION_PLAN_FULL.md
│   ├── DATABASE_SCHEMA.md
│   ├── UI_UX_DESIGN_SYSTEM.md
│   └── AI_DEVELOPMENT_RULES.md
├── .env.local            # Environment variables (local)
├── .env.example          # Environment variables template
├── tailwind.config.js    # Tailwind CSS configuration
├── postcss.config.js     # PostCSS configuration
├── next.config.js        # Next.js configuration
└── package.json          # Project dependencies
```

## Tech Stack

- **Framework:** Next.js 14+ (App Router)
- **Language:** JavaScript
- **Styling:** Tailwind CSS with design tokens
- **Forms:** React Hook Form + Zod validation
- **Database:** Supabase (PostgreSQL)
- **Authentication:** Supabase Auth
- **Storage:** Supabase Storage
- **Deployment:** Vercel

## Getting Started

### Prerequisites

- Node.js 18+ (v20.11.0 recommended)
- npm or yarn
- Supabase account

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment variables:**
   - Copy `.env.example` to `.env.local`
   - Add your Supabase credentials:
     ```
     NEXT_PUBLIC_SUPABASE_URL=your_url
     NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
     ```

3. **Run development server:**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

## Development Guidelines

### Code Standards
- ✅ JavaScript only (no TypeScript)
- ✅ Server Components by default
- ✅ Tailwind CSS only (no inline styles)
- ✅ Reusable components only
- ✅ Design tokens for styling
- ✅ Mobile-first development
- ✅ Accessibility compliance (WCAG 2.1)
- ✅ SEO-first approach

### Commit Conventions
- Use clear, descriptive commit messages
- Reference issue numbers when applicable
- Group related changes together

### Component Development
1. Create new components in `components/` directory
2. Export components from an index file for easy imports
3. Use design tokens from `tailwind.config.js`
4. Keep components small and reusable

## Available Scripts

```bash
# Development
npm run dev              # Start development server

# Production
npm run build            # Build for production
npm start               # Start production server

# Linting
npm run lint            # Run ESLint
```

## Database Setup

The database will be configured in Phase 5. Tables to be created:
- properties
- property_images
- property_videos
- inquiries
- schedule_visits
- testimonials
- users

See `context/DATABASE_SCHEMA.md` for detailed schema information.

## Design System

Colors and typography are configured in `tailwind.config.js`:

### Colors
- Primary: #0F172A
- Secondary: #1E293B
- Accent: #D4A373
- Background: #FFFFFF
- Surface: #F8FAFC

### Typography
- Headings: Poppins
- Body: Inter

See `UI_UX_DESIGN_SYSTEM.md` for complete design system documentation.

## Project Phases

This project follows a structured 18-phase implementation plan. See `context/PROGRESS_TRACKER.md` for details on:
- Phase 1: Project Setup ✅
- Phase 2: Design System
- Phase 3: Application Architecture
- ... (and more)

## Environment Variables

Required variables (see `.env.example`):
- `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anonymous key
- `NEXT_PUBLIC_RESEND_API_KEY` - Resend email service API key
- `NEXT_PUBLIC_APP_URL` - Application URL

## Deployment

The application is configured for deployment on Vercel:

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Set environment variables in Vercel dashboard
4. Deploy automatically on push to main branch

## Support & Documentation

- [SN Properties PRD](context/SN_PROPERTIES_PRD_FULL.md)
- [Implementation Plan](context/SN_PROPERTIES_IMPLEMENTATION_PLAN_FULL.md)
- [Database Schema](context/DATABASE_SCHEMA.md)
- [Design System](context/UI_UX_DESIGN_SYSTEM.md)
- [Development Rules](context/AI_DEVELOPMENT_RULES.md)

## License

Private project - SN Properties

## Next Steps

Phase 2: Design System implementation with reusable components.

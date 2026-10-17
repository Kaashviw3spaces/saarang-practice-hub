# Saarang Practice Hub

> AI-powered music-club management, practice coordination & rehearsal system.

Saarang Practice Hub is a responsive web application for the **Saarang** college music club.
Members can coordinate individual practice, collaborative practice, and band rehearsals while sharing rooms, instruments, and equipment intelligently.

---

## Tech stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) + TypeScript |
| Styling | Tailwind CSS v4 |
| UI components | shadcn/ui + Lucide icons |
| Database / Auth | Supabase (PostgreSQL + Row-Level Security) |
| Realtime | Supabase Realtime |
| Validation | Zod |
| Testing | Jest · React Testing Library · Playwright |
| Deployment | TBD (Vercel recommended) |

---

## Prerequisites

- Node.js ≥ 20
- npm ≥ 10
- A Supabase project (free tier works for development)

---

## Quick start

```bash
# 1. Clone and enter the repo
git clone <REPO_URL> saarang-practice-hub
cd saarang-practice-hub/app

# 2. Install dependencies
npm install

# 3. Copy environment template and fill in your Supabase credentials
cp ../.env.example .env.local

# 4. Start the development server
npm run dev
# → http://localhost:3000
```

---

## Environment variables

Copy `.env.example` to `.env.local` and supply your own values.
**Never commit `.env.local` or any file containing real secrets.**

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL (safe to expose to the browser) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous/public key (safe to expose to the browser) |

The service-role key must **never** appear in client-side code.
Server-side API routes that require elevated privileges should read it from a server-only environment variable (`SUPABASE_SERVICE_ROLE_KEY`) and must never send it to the browser.

---

## Project structure

```
saarang-practice-hub/
├── app/                        # Next.js application root
│   ├── app/                    # App Router pages & layouts
│   │   ├── (public)/           # Public routes (landing, auth)
│   │   ├── (auth)/             # Auth-guarded routes
│   │   ├── dashboard/          # Member dashboard
│   │   ├── bookings/           # Booking creation & history
│   │   ├── rooms/              # Room listings & details
│   │   └── admin/              # Admin-only interface
│   ├── components/
│   │   ├── ui/                 # shadcn/ui primitives
│   │   ├── navigation/         # Header, sidebar, mobile nav
│   │   ├── bookings/           # Booking-specific components
│   │   └── rooms/              # Room cards & details
│   ├── features/
│   │   ├── authentication/
│   │   ├── booking/
│   │   ├── compatibility/
│   │   ├── occupancy/
│   │   └── notifications/
│   ├── lib/
│   │   ├── supabase/           # Supabase client helpers
│   │   ├── validation/         # Zod schemas
│   │   └── utils/
│   ├── types/                  # Shared TypeScript types
│   └── styles/                 # Global CSS & design tokens
├── supabase/
│   ├── migrations/             # Versioned SQL migrations
│   └── seed.sql                # Development seed data
├── public/
│   ├── images/
│   └── fonts/
├── tests/
│   ├── unit/
│   ├── integration/
│   └── e2e/
├── .env.example
├── .gitignore
└── README.md
```

---

## Database migrations

```bash
# Apply migrations using the Supabase CLI (must be installed separately)
supabase db push
```

Migrations live in `supabase/migrations/` as timestamped `.sql` files.
Row-Level Security is enabled on every exposed table.
See `supabase/README.md` (to be created) for dashboard configuration that cannot be automated.

---

## Scripts

```bash
npm run dev      # Start local dev server
npm run build    # Production build
npm run start    # Start production server
npm run lint     # ESLint check
npm run type-check  # TypeScript check (tsc --noEmit)
npm run test     # Run unit + integration tests
npm run test:e2e # Run Playwright end-to-end tests
```

---

## Implementation checklist

### ✅ Milestone 1 — Repository & foundation (DONE)
- [x] Repository initialised with main branch
- [x] Next.js 16 + TypeScript + Tailwind scaffold in `app/`
- [x] Core dependencies installed (`@supabase/supabase-js`, `zod`, `lucide-react`)
- [x] `.gitignore` created (excludes `node_modules`, `.next`, `.env.*`, logs)
- [x] `.env.example` with Supabase placeholder variables
- [x] `.vscode/settings.json` with format-on-save & Tailwind IntelliSense
- [x] README with tech stack, setup instructions, and checklist

### 🔲 Milestone 2 — Design system & frontend
- [ ] Design tokens (CSS variables: background, surface, paper, accent, secondary, text)
- [ ] Global font setup (display + body typefaces)
- [ ] Shared layout component with responsive navigation
- [ ] Landing page hero ("Make Room for Music.")
- [ ] Room listing page with placeholder cards
- [ ] Dashboard skeleton (upcoming sessions, room status, quick actions)
- [ ] Booking form skeleton (date, time, room, instrument, mode)
- [ ] Responsive mobile navigation
- [ ] All visible controls functional or clearly labelled "planned"

### 🔲 Milestone 3 — Supabase integration
- [ ] Supabase client (`lib/supabase/client.ts`) and server client (`lib/supabase/server.ts`)
- [ ] Auth: sign-up, sign-in, sign-out flows
- [ ] Profile creation trigger / server action after signup
- [ ] RLS policies for `profiles`, `rooms`, `bookings`
- [ ] Database migrations: `profiles`, `rooms`, `instruments`, `equipment`, `room_equipment`, `bookings`, `booking_members`, `booking_instruments`
- [ ] Typed Supabase database types (generated)
- [ ] Replace all placeholder data with real Supabase queries
- [ ] Admin role enforcement

### 🔲 Milestone 4 — Booking engine
- [ ] Availability check API route (returns free slots)
- [ ] Booking creation with server-side conflict prevention (uses DB transaction / exclusion constraint)
- [ ] Booking cancellation
- [ ] Booking status lifecycle: `pending` → `confirmed` → `active` → `completed` / `cancelled`
- [ ] Extension request flow
- [ ] Fairness / daily-limit enforcement
- [ ] Waitlist entry creation when slot is full
- [ ] Simultaneous-booking concurrency test (two users, same slot)

### 🔲 Milestone 5 — Music intelligence
- [ ] Instrument & equipment profiles in DB
- [ ] `compatibility_rules` table with instrument/equipment pairs and interference level
- [ ] Compatibility engine: `compatible` / `conditionally_compatible` / `incompatible` / `insufficient_info`
- [ ] Explanation text for each recommendation
- [ ] Compatible shared-slot recommendations
- [ ] Quiet / exclusive-slot recommendations
- [ ] Full-band rehearsal slot finder
- [ ] Member feedback on compatibility accuracy

### 🔲 Milestone 6 — Reminders & occupancy
- [ ] QR code generation for each booking (check-in URL)
- [ ] QR check-in endpoint → creates `occupancy_events` record
- [ ] One-tap check-out
- [ ] Session countdown timer (in-app)
- [ ] Mid-session reminder notification
- [ ] Pre-expiry reminder (10–7 min before end)
- [ ] Final reminder (2 min before end)
- [ ] `occupancy_events` table with confidence state
- [ ] Room states: `available`, `reserved`, `occupied`, `departure_pending`, `occupancy_uncertain`
- [ ] Stale-session detection background job
- [ ] Automatic checkout recovery with grace period
- [ ] Admin override for occupancy state
- [ ] (Phase 2) Hardware sensor integration hooks

### 🔲 Milestone 7 — Verification & deployment prep
- [ ] ESLint passes with 0 errors
- [ ] TypeScript compiles with 0 errors
- [ ] Unit tests for booking conflict logic
- [ ] Unit tests for compatibility rules engine
- [ ] Integration tests for auth & booking API routes
- [ ] E2E test: full booking flow (sign in → book → check in → check out)
- [ ] Responsive layout verified on mobile, tablet, desktop
- [ ] `npm run build` succeeds
- [ ] Environment variable documentation complete
- [ ] Supabase dashboard manual-setup steps documented
- [ ] Deployment guide written (Vercel / hosting provider TBD)

---

## Security notes

- RLS is enforced on every Supabase table — the database itself is the last line of defence.
- Booking conflict prevention is validated server-side (API route + DB constraint), not only on the client.
- The service-role key never appears in client-side bundles.
- All user input is validated with Zod before being sent to the database.

---

## Known limitations & manual setup required

- **Supabase project**: Must be created manually on [supabase.com](https://supabase.com). Copy the project URL and anon key into `.env.local`.
- **Auth provider**: Email/password auth is enabled by default. OAuth providers (Google, GitHub, etc.) require additional Supabase dashboard configuration.
- **Sensor integration**: Hardware presence-sensor integration (Phase 2) is not yet implemented. QR-based check-in is the only occupancy signal in the MVP.
- **Push notifications**: Browser push requires VAPID keys and a service worker, to be added in Milestone 6.

---

## Contributing

1. Create ₹a feature branch: `git checkout -b feature/your-feature`
2. Make focused, well-described commits.
3. Open a pull request against `main`.
4. Ensure `npm run lint`, `npm run type-check`, and `npm run test` pass before merging.

---

*Saarang Practice Hub — Make room for music.*


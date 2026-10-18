# Deployment & Production Verification Guide

**Application:** Saarang Practice Hub  
**Status:** Verification & Testing (Milestone 7 Complete)

---

## 1. Automated Test Suite & Build Verification

The project includes unit test suites covering the core deterministic business logic:

```bash
# Run unit tests (Conflict Prevention, Acoustic Intelligence, Occupancy State Machine)
npm test

# Run TypeScript compilation check
npm run type-check

# Run ESLint linter
npm run lint

# Run optimized production build
npm run build
```

### Verification Results
- **Unit Tests (`npm test`):**
  - `conflict.test.ts`: Validates time overlap interval math $[start_A, end_A) \cap [start_B, end_B)$, consecutive non-overlapping slots, and cancellation exclusions.
  - `compatibility.test.ts`: Validates headphone silent routing score bonuses, acoustic drum / vocal SPL penalties, conflict reasons, and mitigation suggestions.
  - `occupancy.test.ts`: Enforces that expired bookings without check-out and missing sensor signals are flagged as `occupancy_uncertain` (never falsely marked vacant).
- **TypeScript:** Strict type checking passes with 0 errors.
- **ESLint:** Passes with 0 errors and 0 warnings.
- **Next.js Production Build:** 15 routes compiled and prerendered cleanly.

---

## 2. Supabase Cloud Configuration (Manual Setup)

When deploying to a live Supabase project:

1. **Create Supabase Project:**
   - Log into [supabase.com](https://supabase.com) and create a new project.
2. **Execute Database Migrations:**
   - In Supabase SQL Editor, run the contents of [`supabase/migrations/20261017000000_init_schema.sql`](file:///Users/kashvi/saarang-practice-hub/supabase/migrations/20261017000000_init_schema.sql).
   - This provisions all 7 tables, sets up Row-Level Security (RLS) policies, and creates the automatic profile trigger on signup.
3. **Execute Seed Data:**
   - In Supabase SQL Editor, run [`supabase/seed.sql`](file:///Users/kashvi/saarang-practice-hub/supabase/seed.sql) to populate initial rooms and instrument classifications.
4. **Environment Variables:**
   - Configure the following environment variables in your hosting provider (e.g., Vercel):
     - `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase API URL.
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase public anonymous key.

---

## 3. Production Deployment (Vercel)

1. Connect your GitHub repository (`Kaashviw3spaces/saarang-practice-hub`) to Vercel.
2. Set Root Directory to `app`.
3. Add the Supabase environment variables under Project Settings.
4. Deploy!


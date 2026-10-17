import Link from "next/link";
import {
  Music2,
  Calendar,
  Zap,
  Users,
  Shield,
  Clock,
  ArrowRight,
  Guitar,
  Drum,
  Mic2,
  Piano,
} from "lucide-react";
import { RoomCard } from "@/components/rooms/RoomCard";
import { type Room } from "@/types";

/* ─── Placeholder data (replaced in Milestone 3) ─────────────────────────── */

const PLACEHOLDER_ROOMS: Room[] = [
  {
    id: "r1",
    name: "Session A",
    description: "Fully soundproofed rehearsal session area with professional mixing desk and drum kit.",
    capacity: 6,
    status: "available",
    equipment: ["Drum Kit", "PA System", "Bass Amp", "Guitar Amp", "Mixing Desk"],
    acousticProperties: "Fully isolated",
  },
  {
    id: "r2",
    name: "Session B",
    description: "Intimate practice session area ideal for solo practice, duets, and acoustic sessions.",
    capacity: 3,
    status: "occupied",
    equipment: ["Upright Piano", "Headphone Amp", "Music Stands"],
    acousticProperties: "Semi-isolated",
    currentBooking: {
      memberName: "Aryan K.",
      instrument: "Electric Guitar",
      mode: "individual",
      endsAt: new Date("2026-10-17T19:00:00Z"),
    },
  },
  {
    id: "r3",
    name: "Jam Session",
    description: "Open jam space for collaborative sessions and ensemble rehearsals.",
    capacity: 8,
    status: "reserved",
    equipment: ["Drum Kit", "Bass Amp", "Guitar Amp", "Vocal Mic", "Keyboard"],
    acousticProperties: "Acoustic panels",
    nextAvailableAt: new Date("2026-10-17T19:30:00Z"),
  },
];

const FEATURES = [
  {
    icon: Zap,
    title: "AI Compatibility",
    description:
      "Smart acoustic analysis tells you whether your setup is compatible with other musicians in the session — before you even arrive.",
  },
  {
    icon: Calendar,
    title: "Live Availability",
    description:
      "Check real-time session occupancy, book your slot in seconds, and receive smart alternative suggestions when your preferred time is taken.",
  },
  {
    icon: Users,
    title: "Find Your Band",
    description:
      "Discover compatible musicians practising at the same time and turn solo sessions into collaborative ones.",
  },
  {
    icon: Clock,
    title: "Smart Reminders",
    description:
      "Gentle mid-session check-ins, pre-expiry alerts, and one-tap extension requests keep your practice on track.",
  },
  {
    icon: Shield,
    title: "Fair Booking",
    description:
      "Automatic conflict prevention and fairness rules ensure everyone gets equal access to practice sessions.",
  },
  {
    icon: Music2,
    title: "All Modes",
    description:
      "Individual practice, collaborative jams, and full-band rehearsals — each mode optimised for your needs.",
  },
];

const STATS = [
  { value: "5", label: "Active Sessions" },
  { value: "50+", label: "Club Members" },
  { value: "< 60s", label: "To Book a Slot" },
  { value: "0", label: "Double Bookings" },
];

/* ─── Decorative floating note ────────────────────────────────────────────── */
function FloatingNote({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={`absolute text-[var(--color-accent)] opacity-20 font-[var(--font-display)] font-black select-none pointer-events-none ${className}`}
    >
      {children}
    </span>
  );
}

/* ─── Page ────────────────────────────────────────────────────────────────── */

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section className="relative min-h-[90vh] flex flex-col items-center justify-center overflow-hidden px-6 py-24 text-center">
        {/* Decorative background glows */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[700px] h-[700px] rounded-full bg-[var(--color-accent)]/5 blur-[120px]" />
          <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full bg-[var(--color-secondary)]/8 blur-[100px]" />
        </div>

        {/* Floating musical notes */}
        <FloatingNote className="top-20 left-[8%] text-6xl md:text-8xl rotate-[-12deg]">♩</FloatingNote>
        <FloatingNote className="top-32 right-[10%] text-5xl md:text-7xl rotate-[8deg]">♪</FloatingNote>
        <FloatingNote className="bottom-24 left-[12%] text-4xl md:text-6xl rotate-[15deg]">♫</FloatingNote>
        <FloatingNote className="bottom-16 right-[8%] text-7xl md:text-9xl rotate-[-5deg]">𝄞</FloatingNote>

        {/* Content */}
        <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center gap-8">
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 rounded-[var(--radius-full)] border border-[var(--color-accent)]/30 bg-[var(--color-accent)]/8 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-[var(--color-accent)]">
            <Music2 size={12} />
            Saarang Music Club
          </div>

          {/* Headline */}
          <h1 className="font-[var(--font-display)] text-5xl md:text-7xl lg:text-8xl font-black leading-none tracking-tight text-[var(--color-text)]">
            Make Space{" "}
            <br />
            <span className="text-[var(--color-accent)] relative inline-block">
              for Music
              {/* Underline flourish */}
              <svg
                className="absolute -bottom-2 left-0 w-full"
                viewBox="0 0 300 12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path
                  d="M2 8 Q75 2 150 8 Q225 14 298 8"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  fill="none"
                  opacity="0.5"
                />
              </svg>
            </span>
          </h1>

          {/* Subheading */}
          <p className="max-w-2xl text-lg md:text-xl text-[var(--color-text-muted)] leading-relaxed">
            AI-powered practice session management for the Saarang music club. Book
            your slot, find compatible bandmates, and make every minute count.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <Link
              href="/rooms"
              className="inline-flex h-12 items-center gap-2 rounded-[var(--radius-full)] bg-[var(--color-accent)] px-7 text-base font-semibold text-[var(--color-background)] hover:bg-[var(--color-accent-dim)] transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              Book a Practice Slot
              <ArrowRight size={16} />
            </Link>
            <Link
              href="/dashboard"
              className="inline-flex h-12 items-center gap-2 rounded-[var(--radius-full)] border border-[var(--color-border)] px-7 text-base font-medium text-[var(--color-text-muted)] hover:border-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-all"
            >
              View Dashboard
            </Link>
          </div>

          {/* Instrument row */}
          <div className="flex items-center gap-6 text-[var(--color-text-dim)] mt-4">
            <div className="flex items-center gap-1.5 text-sm">
              <Guitar size={15} /> Guitar
            </div>
            <div className="flex items-center gap-1.5 text-sm">
              <Drum size={15} /> Drums
            </div>
            <div className="flex items-center gap-1.5 text-sm">
              <Piano size={15} /> Keys
            </div>
            <div className="flex items-center gap-1.5 text-sm">
              <Mic2 size={15} /> Vocals
            </div>
            <span className="text-xs opacity-60">& more</span>
          </div>
        </div>
      </section>

      {/* ── STATS ────────────────────────────────────────────────────────── */}
      <section className="border-y border-[var(--color-border)] bg-[var(--color-surface)] py-12 px-6">
        <div className="container grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {STATS.map(({ value, label }) => (
            <div key={label} className="flex flex-col gap-1">
              <span className="font-[var(--font-display)] text-4xl md:text-5xl font-black text-[var(--color-accent)]">
                {value}
              </span>
              <span className="text-sm text-[var(--color-text-muted)]">{label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── LIVE SESSIONS PREVIEW ────────────────────────────────────────── */}
      <section className="section">
        <div className="container flex flex-col gap-10">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-[var(--color-accent)] mb-2">
                Right Now
              </p>
              <h2 className="font-[var(--font-display)] text-3xl md:text-4xl font-bold text-[var(--color-text)]">
                Practice Sessions
              </h2>
              <p className="mt-2 text-[var(--color-text-muted)]">
                Live status — check session availability before you head over.
              </p>
            </div>
            <Link
              href="/rooms"
              className="hidden md:inline-flex items-center gap-1 text-sm font-medium text-[var(--color-accent)] hover:underline shrink-0"
            >
              See all sessions <ArrowRight size={14} />
            </Link>
          </div>

          {/* Session cards */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {PLACEHOLDER_ROOMS.map((room) => (
              <RoomCard key={room.id} {...room} />
            ))}
          </div>

          <Link
            href="/rooms"
            className="md:hidden inline-flex items-center gap-1 text-sm font-medium text-[var(--color-accent)] hover:underline self-start"
          >
            See all sessions <ArrowRight size={14} />
          </Link>
        </div>
      </section>

      {/* ── FEATURES ─────────────────────────────────────────────────────── */}
      <section className="section bg-[var(--color-surface)] border-t border-[var(--color-border)]">
        <div className="container flex flex-col gap-12">
          <div className="text-center max-w-2xl mx-auto">
            <p className="text-xs font-semibold uppercase tracking-widest text-[var(--color-accent)] mb-3">
              What Saarang AI Does
            </p>
            <h2 className="font-[var(--font-display)] text-3xl md:text-4xl font-bold text-[var(--color-text)]">
              Everything a music club needs
            </h2>
            <p className="mt-3 text-[var(--color-text-muted)]">
              From smart acoustic compatibility to fair booking enforcement — designed
              around how musicians actually practise.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map(({ icon: Icon, title, description }) => (
              <div
                key={title}
                className="card group hover:border-[var(--color-accent)]/30 transition-all duration-200 flex flex-col gap-4"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-[var(--radius-md)] bg-[var(--color-accent)]/10 text-[var(--color-accent)] group-hover:bg-[var(--color-accent)]/20 transition-colors">
                  <Icon size={20} />
                </div>
                <div>
                  <h3 className="font-semibold text-[var(--color-text)] mb-1">{title}</h3>
                  <p className="text-sm text-[var(--color-text-muted)] leading-relaxed">
                    {description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────────────────────────── */}
      <section className="section">
        <div className="container flex flex-col gap-12">
          <div className="text-center max-w-xl mx-auto">
            <p className="text-xs font-semibold uppercase tracking-widest text-[var(--color-accent)] mb-3">
              Simple Process
            </p>
            <h2 className="font-[var(--font-display)] text-3xl md:text-4xl font-bold text-[var(--color-text)]">
              From idea to practice in 60 seconds
            </h2>
          </div>

          <div className="grid md:grid-cols-4 gap-5">
            {[
              { step: "01", title: "Pick your setup", body: "Choose your instrument, equipment, and preferred noise level." },
              { step: "02", title: "Browse availability", body: "See which rooms are free, occupied, or compatible with other sessions." },
              { step: "03", title: "Confirm your slot", body: "Book instantly. The system prevents double bookings automatically." },
              { step: "04", title: "QR check-in", body: "Scan the QR code at the door to confirm your arrival and start your session." },
            ].map(({ step, title, body }) => (
              <div key={step} className="flex flex-col gap-3">
                <span className="font-[var(--font-display)] text-5xl font-black text-[var(--color-accent)]/25 leading-none">
                  {step}
                </span>
                <h4 className="font-semibold text-[var(--color-text)]">{title}</h4>
                <p className="text-sm text-[var(--color-text-muted)] leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ───────────────────────────────────────────────────── */}
      <section className="section border-t border-[var(--color-border)] bg-[var(--color-surface)]">
        <div className="container">
          <div className="relative overflow-hidden rounded-[var(--radius-lg)] bg-[var(--color-surface-2)] border border-[var(--color-border)] px-8 py-12 md:py-16 text-center">
            {/* Glow */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-[500px] h-[200px] bg-[var(--color-accent)]/6 blur-[80px] rounded-full" />
            </div>
            <div className="relative z-10 flex flex-col items-center gap-6 max-w-xl mx-auto">
              <h2 className="font-[var(--font-display)] text-3xl md:text-5xl font-black text-[var(--color-text)]">
                Ready to practise?
              </h2>
              <p className="text-[var(--color-text-muted)]">
                Join the Saarang club, book your first slot, and let the AI find
                you the perfect practice window.
              </p>
              <Link
                href="/signup"
                className="inline-flex h-12 items-center gap-2 rounded-[var(--radius-full)] bg-[var(--color-accent)] px-8 text-base font-bold text-[var(--color-background)] hover:bg-[var(--color-accent-dim)] transition-all hover:scale-[1.02]"
              >
                Join Saarang <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────────────────────── */}
      <footer className="border-t border-[var(--color-border)] px-6 py-8">
        <div className="container flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-[var(--color-text-dim)]">
          <div className="flex items-center gap-2">
            <Music2 size={14} className="text-[var(--color-accent)]" />
            <span className="font-[var(--font-display)] font-semibold text-[var(--color-text-muted)]">
              Saarang Practice Hub
            </span>
          </div>
          <p>
            Built for the Saarang Music Club ·{" "}
            <span className="text-[var(--color-accent)]/70">Milestone 2 – UI Preview</span>
          </p>
        </div>
      </footer>
    </div>
  );
}

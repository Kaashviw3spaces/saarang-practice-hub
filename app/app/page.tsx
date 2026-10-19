import Link from "next/link";
import {
  Music2,
  Zap,
  ArrowRight,
  Guitar,
  Drum,
  Mic2,
  Piano,
  Radio,
} from "lucide-react";
import { RoomCard } from "@/components/rooms/RoomCard";
import { type Room } from "@/types";
import { OpeningCurtain } from "@/components/motion/OpeningCurtain";
import { SoundwaveVisualizer } from "@/components/motion/SoundwaveVisualizer";
import { RockArchive } from "@/components/gallery/RockArchive";
import { PosterBackdrop } from "@/components/motion/PosterBackdrop";
import { HeroRockSection } from "@/components/home/HeroRockSection";
import { parseSeedSql } from "@/lib/seed/parser";

/* ─── Fallback placeholder data ───────────────────────────────────────────── */
const FALLBACK_ROOMS: Room[] = [
  {
    id: "r1",
    name: "Session A",
    description: "Rehearsal space with drums, drum pads and amplifiers.",
    capacity: 8,
    status: "available",
    equipment: ["Drums", "Drum Pads", "Amplifiers", "PA System"],
    acousticProperties: "Fully isolated — suitable for loud instruments and full-band rehearsals.",
  },
  {
    id: "r2",
    name: "Session B",
    description: "Practice space ideal for solo practice, duets, and acoustic or electronic sessions.",
    capacity: 6,
    status: "available",
    equipment: ["Piano", "Headphone Amp", "Music Stands"],
    acousticProperties: "Semi-isolated — suitable for moderately loud practice sessions together.",
  },
  {
    id: "r3",
    name: "Jam Session",
    description: "Open jam space for collaborative sessions and small band rehearsals.",
    capacity: 8,
    status: "available",
    equipment: ["Drum Kit", "Bass Amp", "Guitar Amp", "Vocal Mic", "Keyboard"],
    acousticProperties: "Acoustic panels — good for ensemble practice.",
  },
  {
    id: "r4",
    name: "Recording Session",
    description: "Recording space for vocals and acoustic instruments.",
    capacity: 4,
    status: "available",
    equipment: ["Studio Mics", "Audio Interface", "Monitor Speakers"],
    acousticProperties: "Isolated — perfect for focused recording sessions.",
  },
];

export default function HomePage() {
  const seedData = parseSeedSql();
  const displayRooms = seedData.rooms.length > 0 ? seedData.rooms : FALLBACK_ROOMS;

  const STATS = [
    { value: String(displayRooms.length).padStart(2, "0"), label: "ACTIVE REHEARSAL STAGES" },
    { value: "100%", label: "CONFLICT FREE PROTOCOL" },
    { value: "<60s", label: "INSTANT SLOT RESERVATION" },
    { value: "24/7", label: "LIVE REHEARSAL ACCESS" },
  ];
  return (
    <div className="flex flex-col bg-[var(--color-ink)] text-[var(--color-cream)]">
      {/* ── OPENING CURTAIN (Awwwards reveal animation) ──────────────────── */}
      <OpeningCurtain />

      {/* ── PSYCHEDELIC RIBBON (Beatles / Rolling Stones Color Bands) ─── */}
      <div className="psychedelic-ribbon" />

      {/* ── HERO SECTION (Interactive Rock Gig Poster Composition) ──────── */}
      <HeroRockSection />

      {/* ── STATS (Member Session Metrics Strip) ─────────────────────────── */}
      <section className="border-t border-b border-[var(--color-border)] bg-[var(--color-surface)] py-8 px-4">
        <div className="container grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {STATS.map(({ value, label }) => (
            <div
              key={label}
              className="flex flex-col items-center justify-center p-4 border border-[var(--color-border)] bg-[var(--color-ink)] shadow-[0_18px_38px_-6px_rgba(0,0,0,0.9),0_8px_16px_-4px_rgba(0,0,0,0.8)] hover:-translate-y-1 transition-all"
            >
              <span className="font-[var(--font-display)] text-4xl md:text-5xl font-bold text-[var(--color-ochre)] leading-none">
                {value}
              </span>
              <span className="mt-2 text-[10px] font-mono uppercase tracking-widest text-[var(--color-text-dim)]">
                {label}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* ── LIVE REHEARSAL SESSIONS PREVIEW ───────────────────────────────── */}
      <section className="section bg-[var(--color-ink)] relative overflow-hidden">
        {/* Metallica 1985 & Arctic Monkeys backdrop */}
        <PosterBackdrop variant="rooms" overlayOpacity={0.72} />

        <div className="container relative z-10 flex flex-col gap-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[var(--color-border)] pb-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="badge-tour badge-tour-rust">Slot Radar</span>
                <span className="text-[10px] font-mono uppercase tracking-widest text-[var(--color-text-dim)]">
                  Real-Time Availability
                </span>
              </div>
              <h2 className="font-[var(--font-display)] text-4xl md:text-6xl text-[var(--color-cream)] leading-none tracking-tight poster-headline">
                ACTIVE SESSIONS
              </h2>
              <p className="mt-2 text-sm text-[var(--color-text-muted)] max-w-xl">
                Check room availability, equipment status, and volume limits before heading to the room.
              </p>
            </div>
            <Link
              href="/rooms"
              className="btn-rock-ghost text-xs py-2 px-4 self-start md:self-auto"
            >
              Explore All Sessions <ArrowRight size={13} />
            </Link>
          </div>

          {/* Session Cards */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayRooms.map((room) => (
              <RoomCard key={room.id} {...room} />
            ))}
          </div>
        </div>
      </section>

      {/* ── POSTER VISUAL GALLERY (5 Attached Poster References) ─────────── */}
      <RockArchive />

      {/* ── HOW IT WORKS (Stage Roadmap) ─────────────────────────────────── */}
      <section className="section bg-[var(--color-ink)] relative overflow-hidden">
        <PosterBackdrop variant="dashboard" overlayOpacity={0.65} />
        <div className="container relative z-10 flex flex-col gap-12">
          <div className="text-center max-w-3xl mx-auto p-6 md:p-8 bg-[var(--color-surface)]/95 backdrop-blur-md border border-[var(--color-ivory)]/40 shadow-[inset_0_0_0_2px_var(--color-ink),inset_0_0_0_3px_rgba(238,230,213,0.25),0_16px_40px_rgba(0,0,0,0.8)]">
            <span className="badge-tour badge-tour-accent mb-3 inline-block">Soundcheck Roadmap</span>
            <h2 className="font-[var(--font-display)] text-3xl sm:text-5xl md:text-6xl text-[var(--color-cream)] leading-none tracking-tight poster-headline">
              FROM RIFF TO REHEARSAL IN 60 SECONDS
            </h2>
            <p className="poster-subhead text-xs md:text-sm text-[var(--color-text-muted)] tracking-wider uppercase mt-2">
              Four steps to your uninterrupted practice session
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                step: "01",
                tag: "SETUP",
                title: "SELECT INSTRUMENTATION",
                body: "Specify acoustic or amplified gear, loudness tier, and session intention.",
              },
              {
                step: "02",
                tag: "RADAR",
                title: "SCAN STAGE AVAILABILITY",
                body: "Review real-time slots and instant acoustic compatibility with adjacent slots.",
              },
              {
                step: "03",
                tag: "RESERVE",
                title: "LOCK DOWN RESERVATION",
                body: "Instant slot reservation with automated lockouts preventing overlapping bookings.",
              },
              {
                step: "04",
                tag: "SESSION",
                title: "START REHEARSING",
                body: "Step straight into your reserved slot, power up the backline gear, and play without interruption.",
              },
            ].map(({ step, tag, title, body }) => (
              <div
                key={step}
                className="p-6 bg-[var(--color-surface)]/95 backdrop-blur-sm border border-[var(--color-border)] shadow-[0_20px_45px_-8px_rgba(0,0,0,0.92),0_10px_20px_-5px_rgba(0,0,0,0.85),inset_0_0_0_2px_var(--color-ink),inset_0_0_0_3px_rgba(238,230,213,0.2)] hover:border-[var(--color-ivory)] hover:shadow-[0_32px_65px_-10px_rgba(0,0,0,0.98),0_16px_30px_-6px_rgba(0,0,0,0.92)] hover:-translate-y-1.5 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between border-b border-[var(--color-border)] pb-2 mb-4">
                    <span className="font-[var(--font-display)] text-4xl text-[var(--color-rust)] leading-none">
                      {step}
                    </span>
                    <span className="text-[9px] font-mono uppercase tracking-widest text-[var(--color-text-dim)] border border-[var(--color-border)] px-1.5 py-0.5">
                      {tag}
                    </span>
                  </div>
                  <h4 className="font-[var(--font-display)] text-xl text-[var(--color-cream)] leading-tight mb-2">
                    {title}
                  </h4>
                  <p className="text-xs text-[var(--color-text-muted)] leading-relaxed">{body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* ── CTA BANNER (Concert Ticket Style) ─────────────────────────────── */}
      <section className="section bg-[var(--color-ink)] relative overflow-hidden">
        <PosterBackdrop variant="booking" overlayOpacity={0.75} />

        <div className="container relative z-10">
          <div className="relative p-8 md:p-14 border-2 border-[var(--color-ivory)] bg-[var(--color-surface)]/95 backdrop-blur-md shadow-[0_32px_75px_-10px_rgba(0,0,0,0.98),0_16px_32px_-6px_rgba(0,0,0,0.92),inset_0_0_0_4px_var(--color-ink),inset_0_0_0_5px_rgba(238,230,213,0.4)] text-center flex flex-col items-center gap-6 max-w-3xl mx-auto">
            {/* Top banner tag */}
            <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.25em] text-[var(--color-ochre)]">
              <Music2 size={14} /> REHEARSAL HUB // SAARANG MUSIC CLUB
            </div>

            <h2 className="font-[var(--font-display)] text-4xl sm:text-5xl md:text-7xl font-bold text-[var(--color-cream)] leading-none tracking-tight poster-headline">
              READY TO TURN UP THE VOLUME?
            </h2>

            <p className="text-sm md:text-base text-[var(--color-text-muted)] max-w-lg">
              Reserved exclusively for Saarang Music Club members. Book your rehearsal space, check your acoustic compatibility with fellow musicians, and turn up the volume.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <Link
                href="/book"
                className="btn-rock-primary text-base py-3 px-8 shadow-[4px_4px_0_0_var(--color-rust)]"
              >
                Book Practice Slot <ArrowRight size={16} />
              </Link>
              <Link
                href="/rooms"
                className="btn-rock-ghost text-base py-3 px-8"
              >
                Browse Stage Sessions
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER (Vintage Gig Billing Block) ────────────────────────────── */}
      <footer className="border-t border-[var(--color-border)] bg-[var(--color-surface)] px-6 py-10">
        <div className="container flex flex-col md:flex-row items-center justify-between gap-6 text-xs font-mono text-[var(--color-text-dim)] uppercase tracking-wider">
          <div className="flex items-center gap-2 text-[var(--color-cream)]">
            <Zap size={14} className="text-[var(--color-ochre)]" />
            <span className="font-[var(--font-display)] text-base tracking-widest">
              SAARANG PRACTICE HUB
            </span>
          </div>

          <p className="text-center md:text-right">
            ROCK ART DIRECTION INSPIRED BY KNOWN BANDS <br />
          </p>

          <p className="text-[10px] text-[var(--color-text-dim)]">
            EST. 2026 · ALL RIGHTS RESERVED
          </p>
        </div>
      </footer>
    </div>
  );
}

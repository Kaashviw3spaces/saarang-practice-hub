"use client";

import Image from "next/image";

interface PosterBackdropProps {
  variant?:
    | "hero"
    | "rooms"
    | "booking"
    | "dashboard"
    | "compatibility"
    | "checkin"
    | "auth";
  overlayOpacity?: number;
}

/* ─── Vintage Band Flyer Badge Component ───────────────────────────────────── */
function VintageGigFlyer({
  band,
  subhead,
  date,
  venue,
  city,
  theme = "rust",
  rotate = "-2deg",
  className = "",
}: {
  band: string;
  subhead?: string;
  date: string;
  venue: string;
  city: string;
  theme?: "rust" | "gold" | "burgundy" | "cyan" | "purple";
  rotate?: string;
  className?: string;
}) {
  const themeColors = {
    rust: "border-[var(--color-rust)]/60 bg-[#1e1311]/90 text-[var(--color-rust)] shadow-[4px_4px_0_0_rgba(184,76,45,0.35)]",
    gold: "border-[var(--color-ochre)]/60 bg-[#1c1810]/90 text-[var(--color-ochre)] shadow-[4px_4px_0_0_rgba(212,168,63,0.35)]",
    burgundy: "border-[var(--color-burgundy)]/70 bg-[#1c0f11]/90 text-[var(--color-ivory)] shadow-[4px_4px_0_0_rgba(109,32,36,0.4)]",
    cyan: "border-cyan-500/50 bg-[#0c181c]/90 text-cyan-300 shadow-[4px_4px_0_0_rgba(6,182,212,0.35)]",
    purple: "border-[var(--color-purple)]/60 bg-[#151020]/90 text-[var(--color-purple)] shadow-[4px_4px_0_0_rgba(113,60,232,0.35)]",
  };

  return (
    <div
      className={`p-3 border flex flex-col justify-between font-mono select-none pointer-events-none transition-transform ${themeColors[theme]} ${className}`}
      style={{ transform: `rotate(${rotate})` }}
    >
      <div className="flex items-center justify-between border-b border-current/25 pb-1 text-[8px] tracking-[0.25em] uppercase opacity-75">
        <span>TOUR FLYER</span>
        <span>{date}</span>
      </div>
      <div className="my-2">
        <div className="font-['Metal_Mania'] text-xl sm:text-2xl leading-none uppercase tracking-wider text-[var(--color-cream)]">
          {band}
        </div>
        {subhead && (
          <div className="text-[9px] font-mono uppercase tracking-widest text-[var(--color-ochre)] mt-0.5">
            {subhead}
          </div>
        )}
      </div>
      <div className="border-t border-current/25 pt-1 flex items-center justify-between text-[8px] tracking-wider uppercase opacity-80">
        <span>{venue}</span>
        <span className="font-bold">{city}</span>
      </div>
    </div>
  );
}

export function PosterBackdrop({
  variant = "hero",
  overlayOpacity = 0.65,
}: PosterBackdropProps) {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none select-none z-0 transform-gpu">
      {/* ── AMBIENT STAGE LIGHTING GLOWS (Fills black negative space with warmth) ── */}
      <div className="absolute -top-32 -left-32 w-[600px] h-[600px] bg-[var(--color-burgundy)]/30 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/3 -right-32 w-[650px] h-[650px] bg-[var(--color-rust)]/25 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute -bottom-32 left-1/4 w-[700px] h-[700px] bg-[var(--color-ochre)]/20 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] bg-[#1a120c]/60 rounded-full blur-[180px] pointer-events-none" />

      {/* ── BACKGROUND TILE: REPEATING SUBTLE GIG BILLS TEXTURE ──────────────── */}
      <div
        className="absolute inset-0 opacity-[0.07] mix-blend-screen pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 25px 25px, rgba(238,230,213,0.3) 2%, transparent 0%), radial-gradient(circle at 75px 75px, rgba(212,168,63,0.2) 2%, transparent 0%)`,
          backgroundSize: "100px 100px",
        }}
      />

      {/* ── TOP/BOTTOM VINTAGE GIG TICKER ────────────────────────────────────── */}
      <div className="absolute top-0 inset-x-0 h-6 border-b border-[var(--color-border)]/50 bg-[var(--color-ink)]/70 flex items-center overflow-hidden z-10 text-[9px] font-mono uppercase tracking-[0.3em] text-[var(--color-text-dim)]/70">
        <div className="whitespace-nowrap flex gap-8 animate-[marquee_40s_linear_infinite]">
          <span>★ LIVE REHEARSAL HUB ★</span>
          <span>AC/DC • PWR UP WORLD TOUR</span>
          <span>★ METALLICA • 1985 ARAGON THRASH ★</span>
          <span>ARCTIC MONKEYS • AM LIVE</span>
          <span>★ THE ROLLING STONES • SANTIAGO CHILE ★</span>
          <span>THE BEATLES • STRAWBERRY FIELDS</span>
          <span>★ BLACK SABBATH • BIRMINGHAM UK ★</span>
          <span>IRON MAIDEN • WORLD SLAVERY TOUR</span>
          <span>★ NIRVANA • PARAMOUNT THEATRE ★</span>
          <span>LED ZEPPELIN • EARLS COURT 1975</span>
        </div>
      </div>

      {/* ── VARIANT: HERO (Dense Rock Venue Poster Wall) ────────────────────── */}
      {variant === "hero" && (
        <>
          {/* LEFT FLANK: AC/DC Angus Young Power Highway */}
          <div
            className="absolute -top-6 -left-10 w-[42vw] max-w-[560px] aspect-[3/4] mix-blend-screen filter contrast-125 saturate-125 -rotate-2"
            style={{ opacity: overlayOpacity }}
          >
            <div className="relative w-full h-full border-2 border-[var(--color-ivory)]/25 shadow-[0_12px_40px_rgba(0,0,0,0.9)]">
              <Image
                src="/posters/acdc-pwrup.jpg"
                alt="AC/DC PWR UP Tour"
                fill
                priority
                className="object-cover object-top"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-[var(--color-ink)]/60" />
            </div>
          </div>

          {/* LOWER-LEFT FLANK: Metallica 1985 Aragon Thrash Band */}
          <div
            className="absolute top-1/2 -left-12 -translate-y-1/4 w-[38vw] max-w-[480px] aspect-[3/4] mix-blend-screen filter contrast-125 rotate-3"
            style={{ opacity: overlayOpacity * 0.9 }}
          >
            <div className="relative w-full h-full border-2 border-[var(--color-ivory)]/20 shadow-[0_12px_40px_rgba(0,0,0,0.9)]">
              <Image
                src="/posters/metallica-aragon.jpg"
                alt="Metallica Band 1985"
                fill
                className="object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-ink)]/60 via-transparent to-transparent" />
            </div>
          </div>

          {/* RIGHT FLANK: Arctic Monkeys Monochrome Band Screenprint */}
          <div
            className="absolute -top-8 -right-8 w-[40vw] max-w-[540px] aspect-[3/4] mix-blend-screen filter contrast-125 grayscale rotate-2"
            style={{ opacity: overlayOpacity * 0.95 }}
          >
            <div className="relative w-full h-full border-2 border-[var(--color-ivory)]/25 shadow-[0_12px_40px_rgba(0,0,0,0.9)]">
              <Image
                src="/posters/arctic-monkeys.jpg"
                alt="Arctic Monkeys Band"
                fill
                priority
                className="object-cover object-top"
              />
              <div className="absolute inset-0 bg-gradient-to-l from-transparent via-transparent to-[var(--color-ink)]/60" />
            </div>
          </div>

          {/* LOWER-RIGHT FLANK: Rolling Stones Psychedelic Burgundy Swirl */}
          <div
            className="absolute top-1/2 -right-12 -translate-y-1/4 w-[36vw] max-w-[480px] aspect-[3/4] mix-blend-screen filter contrast-125 -rotate-3"
            style={{ opacity: overlayOpacity * 0.9 }}
          >
            <div className="relative w-full h-full border-2 border-[var(--color-ivory)]/20 shadow-[0_12px_40px_rgba(0,0,0,0.9)]">
              <Image
                src="/posters/rolling-stones.webp"
                alt="Rolling Stones Chile"
                fill
                className="object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-ink)]/60 via-transparent to-transparent" />
            </div>
          </div>

          {/* BOTTOM CENTER: The Beatles Strawberry Fields 1967 Artwork */}
          <div
            className="absolute -bottom-16 left-1/2 -translate-x-1/2 w-[50vw] max-w-[620px] aspect-[16/9] mix-blend-screen filter contrast-125 opacity-40"
          >
            <Image
              src="/posters/beatles-strawberry.webp"
              alt="The Beatles 1967"
              fill
              className="object-cover object-bottom"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-ink)] via-transparent to-transparent" />
          </div>

          {/* OVERLAPPING VINTAGE BAND FLYERS (Filling remaining gaps) */}
          <div className="absolute top-24 left-[28vw] hidden xl:block z-0">
            <VintageGigFlyer
              band="BLACK SABBATH"
              subhead="PARANOID WORLD TOUR"
              date="OCT 18, 1970"
              venue="TOWN HALL"
              city="BIRMINGHAM"
              theme="purple"
              rotate="-4deg"
              className="w-48"
            />
          </div>

          <div className="absolute top-28 right-[27vw] hidden xl:block z-0">
            <VintageGigFlyer
              band="IRON MAIDEN"
              subhead="WORLD SLAVERY TOUR"
              date="NOV 14, 1984"
              venue="LONG BEACH ARENA"
              city="LOS ANGELES"
              theme="gold"
              rotate="3.5deg"
              className="w-52"
            />
          </div>

          <div className="absolute bottom-16 left-12 hidden lg:block z-0">
            <VintageGigFlyer
              band="LED ZEPPELIN"
              subhead="PHYSICAL GRAFFITI"
              date="MAY 23, 1975"
              venue="EARLS COURT"
              city="LONDON UK"
              theme="rust"
              rotate="2deg"
              className="w-48"
            />
          </div>

          <div className="absolute bottom-16 right-12 hidden lg:block z-0">
            <VintageGigFlyer
              band="NIRVANA"
              subhead="NEVERMIND LIVE"
              date="OCT 31, 1991"
              venue="PARAMOUNT"
              city="SEATTLE WA"
              theme="gold"
              rotate="-2.5deg"
              className="w-48"
            />
          </div>
        </>
      )}

      {/* ── VARIANT: ROOMS / SESSIONS (Packed Rehearsal Hall Poster Wall) ────── */}
      {variant === "rooms" && (
        <>
          {/* Top-Right: Metallica 1985 Aragon Ballroom 4-piece Thrash */}
          <div
            className="absolute -top-6 -right-10 w-[45vw] max-w-[620px] aspect-[3/4] mix-blend-screen filter contrast-125 rotate-2"
            style={{ opacity: overlayOpacity }}
          >
            <div className="relative w-full h-full border-2 border-[var(--color-ivory)]/30 shadow-[0_16px_50px_rgba(0,0,0,0.95)]">
              <Image
                src="/posters/metallica-aragon.jpg"
                alt="Metallica Band 1985"
                fill
                priority
                className="object-cover object-top"
              />
              <div className="absolute inset-0 bg-gradient-to-l from-transparent to-[var(--color-ink)]/50" />
            </div>
          </div>

          {/* Top-Left: AC/DC PWR UP Lightning & Flying V */}
          <div
            className="absolute -top-8 -left-8 w-[40vw] max-w-[540px] aspect-[3/4] mix-blend-screen filter contrast-125 -rotate-2"
            style={{ opacity: overlayOpacity * 0.9 }}
          >
            <div className="relative w-full h-full border-2 border-[var(--color-ivory)]/30 shadow-[0_16px_50px_rgba(0,0,0,0.95)]">
              <Image
                src="/posters/acdc-pwrup.jpg"
                alt="AC/DC"
                fill
                priority
                className="object-cover object-top"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[var(--color-ink)]/50" />
            </div>
          </div>

          {/* Mid-Left: Rolling Stones Psychedelic Burgundy Swirl */}
          <div
            className="absolute top-1/2 -left-12 -translate-y-1/4 w-[36vw] max-w-[460px] aspect-[3/4] mix-blend-screen filter contrast-125 rotate-3"
            style={{ opacity: overlayOpacity * 0.85 }}
          >
            <div className="relative w-full h-full border-2 border-[var(--color-ivory)]/25">
              <Image
                src="/posters/rolling-stones.webp"
                alt="Rolling Stones Chile"
                fill
                className="object-cover object-center"
              />
            </div>
          </div>

          {/* Mid-Right: Arctic Monkeys Monochrome Screenprint */}
          <div
            className="absolute top-1/2 -right-12 -translate-y-1/4 w-[38vw] max-w-[480px] aspect-[3/4] mix-blend-screen filter contrast-125 grayscale -rotate-2"
            style={{ opacity: overlayOpacity * 0.85 }}
          >
            <div className="relative w-full h-full border-2 border-[var(--color-ivory)]/25">
              <Image
                src="/posters/arctic-monkeys.jpg"
                alt="Arctic Monkeys"
                fill
                className="object-cover object-center"
              />
            </div>
          </div>

          {/* Bottom Center: Beatles Strawberry Fields */}
          <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-[55vw] max-w-[650px] aspect-[16/9] mix-blend-screen opacity-45">
            <Image
              src="/posters/beatles-strawberry.webp"
              alt="The Beatles"
              fill
              className="object-cover object-bottom"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-ink)] to-transparent" />
          </div>

          {/* Overlapping Band Gig Flyers */}
          <div className="absolute top-20 left-1/3 hidden lg:block z-0">
            <VintageGigFlyer
              band="MOTORHEAD"
              subhead="NO SLEEP 'TIL HAMMERSMITH"
              date="JUN 1981"
              venue="HAMMERSMITH ODEON"
              city="LONDON"
              theme="rust"
              rotate="-3deg"
              className="w-48"
            />
          </div>

          <div className="absolute bottom-20 right-1/4 hidden lg:block z-0">
            <VintageGigFlyer
              band="DEEP PURPLE"
              subhead="MACHINE HEAD TOUR"
              date="DEC 1972"
              venue="RAINBOW THEATRE"
              city="LONDON"
              theme="purple"
              rotate="3deg"
              className="w-52"
            />
          </div>
        </>
      )}

      {/* ── VARIANT: BOOKING PASS (High-Voltage Electric Gig Backdrop) ──────── */}
      {variant === "booking" && (
        <>
          {/* Main Full-Bleed High-Voltage Backdrop */}
          <div
            className="absolute inset-0 w-full h-full mix-blend-screen filter contrast-125 saturate-125"
            style={{ opacity: overlayOpacity }}
          >
            <Image
              src="/posters/acdc-pwrup.jpg"
              alt="AC/DC Highway"
              fill
              priority
              className="object-cover object-center"
            />
            <div className="absolute inset-0 bg-[var(--color-ink)]/40" />
          </div>

          {/* Left Flank Poster: Metallica 1985 */}
          <div className="absolute top-10 -left-12 w-[35vw] max-w-[420px] aspect-[3/4] mix-blend-screen opacity-50 rotate-3 hidden md:block">
            <div className="relative w-full h-full border border-[var(--color-ivory)]/30">
              <Image
                src="/posters/metallica-aragon.jpg"
                alt="Metallica"
                fill
                className="object-cover"
              />
            </div>
          </div>

          {/* Right Flank Poster: Arctic Monkeys */}
          <div className="absolute top-12 -right-12 w-[35vw] max-w-[420px] aspect-[3/4] mix-blend-screen opacity-50 -rotate-3 hidden md:block">
            <div className="relative w-full h-full border border-[var(--color-ivory)]/30">
              <Image
                src="/posters/arctic-monkeys.jpg"
                alt="Arctic Monkeys"
                fill
                className="object-cover grayscale"
              />
            </div>
          </div>

          {/* Bottom Left: Rolling Stones */}
          <div className="absolute -bottom-16 -left-8 w-[32vw] max-w-[380px] aspect-[3/4] mix-blend-screen opacity-45 -rotate-2 hidden lg:block">
            <Image
              src="/posters/rolling-stones.webp"
              alt="Rolling Stones"
              fill
              className="object-cover"
            />
          </div>

          {/* Bottom Right: Beatles */}
          <div className="absolute -bottom-16 -right-8 w-[32vw] max-w-[380px] aspect-[3/4] mix-blend-screen opacity-45 rotate-2 hidden lg:block">
            <Image
              src="/posters/beatles-strawberry.webp"
              alt="Beatles"
              fill
              className="object-cover"
            />
          </div>
        </>
      )}

      {/* ── VARIANT: DASHBOARD (Artist Backstage Lounge Plastered Poster Wall) ── */}
      {variant === "dashboard" && (
        <>
          {/* Top-Right: Rolling Stones Chile Olé Tour */}
          <div
            className="absolute -top-8 -right-10 w-[46vw] max-w-[620px] aspect-[3/4] mix-blend-screen filter contrast-125 rotate-2"
            style={{ opacity: overlayOpacity }}
          >
            <div className="relative w-full h-full border-2 border-[var(--color-ivory)]/30">
              <Image
                src="/posters/rolling-stones.webp"
                alt="Rolling Stones Chile"
                fill
                priority
                className="object-cover object-top"
              />
            </div>
          </div>

          {/* Top-Left: Arctic Monkeys UK Tour */}
          <div
            className="absolute -top-8 -left-8 w-[42vw] max-w-[560px] aspect-[3/4] mix-blend-screen filter contrast-125 grayscale -rotate-2"
            style={{ opacity: overlayOpacity * 0.9 }}
          >
            <div className="relative w-full h-full border-2 border-[var(--color-ivory)]/30">
              <Image
                src="/posters/arctic-monkeys.jpg"
                alt="Arctic Monkeys"
                fill
                priority
                className="object-cover object-top"
              />
            </div>
          </div>

          {/* Bottom-Left: The Beatles 1967 */}
          <div className="absolute bottom-0 -left-10 w-[40vw] max-w-[500px] aspect-[3/4] mix-blend-screen opacity-55 rotate-2">
            <Image
              src="/posters/beatles-strawberry.webp"
              alt="The Beatles"
              fill
              className="object-cover object-bottom"
            />
          </div>

          {/* Bottom-Right: AC/DC Lightning */}
          <div className="absolute bottom-0 -right-10 w-[40vw] max-w-[500px] aspect-[3/4] mix-blend-screen opacity-55 -rotate-2">
            <Image
              src="/posters/acdc-pwrup.jpg"
              alt="AC/DC"
              fill
              className="object-cover object-bottom"
            />
          </div>

          {/* Backstage VIP Badges */}
          <div className="absolute top-24 left-[32vw] hidden xl:block z-0">
            <VintageGigFlyer
              band="QUEEN"
              subhead="A NIGHT AT THE OPERA"
              date="DEC 24, 1975"
              venue="HAMMERSMITH ODEON"
              city="LONDON"
              theme="gold"
              rotate="3deg"
              className="w-48"
            />
          </div>

          <div className="absolute bottom-24 right-[30vw] hidden xl:block z-0">
            <VintageGigFlyer
              band="GUNS N' ROSES"
              subhead="APPETITE FOR DESTRUCTION"
              date="JUN 1987"
              venue="THE MARQUEE CLUB"
              city="LONDON"
              theme="rust"
              rotate="-3.5deg"
              className="w-52"
            />
          </div>
        </>
      )}

      {/* ── VARIANT: COMPATIBILITY (Psychedelic Resonance Sound Wall) ───────── */}
      {variant === "compatibility" && (
        <>
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl aspect-[16/9] mix-blend-screen filter contrast-125"
            style={{ opacity: overlayOpacity }}
          >
            <Image
              src="/posters/beatles-strawberry.webp"
              alt="The Beatles Strawberry Fields"
              fill
              priority
              className="object-cover object-center"
            />
          </div>

          {/* Left: AC/DC Amp Highway */}
          <div className="absolute top-1/4 -left-10 w-[35vw] max-w-[450px] aspect-[3/4] mix-blend-screen opacity-50 rotate-3">
            <Image
              src="/posters/acdc-pwrup.jpg"
              alt="AC/DC"
              fill
              className="object-cover"
            />
          </div>

          {/* Right: Metallica Thrash Stage */}
          <div className="absolute top-1/4 -right-10 w-[35vw] max-w-[450px] aspect-[3/4] mix-blend-screen opacity-50 -rotate-3">
            <Image
              src="/posters/metallica-aragon.jpg"
              alt="Metallica"
              fill
              className="object-cover"
            />
          </div>
        </>
      )}

      {/* ── VARIANT: CHECK-IN / AUTH (Monochrome & Industrial Thrash) ──────── */}
      {(variant === "checkin" || variant === "auth") && (
        <>
          <div
            className="absolute inset-0 w-full h-full mix-blend-screen filter contrast-125"
            style={{ opacity: overlayOpacity }}
          >
            <Image
              src={variant === "auth" ? "/posters/metallica-aragon.jpg" : "/posters/arctic-monkeys.jpg"}
              alt="Rock Band Stage"
              fill
              priority
              className="object-cover object-center"
            />
            <div className="absolute inset-0 bg-[var(--color-ink)]/40" />
          </div>

          <div className="absolute top-10 left-10 w-44 aspect-[3/4] mix-blend-screen opacity-60 rotate-4 hidden md:block border border-[var(--color-ivory)]/30">
            <Image
              src="/posters/acdc-pwrup.jpg"
              alt="AC/DC"
              fill
              className="object-cover"
            />
          </div>

          <div className="absolute bottom-10 right-10 w-44 aspect-[3/4] mix-blend-screen opacity-60 -rotate-4 hidden md:block border border-[var(--color-ivory)]/30">
            <Image
              src="/posters/rolling-stones.webp"
              alt="Rolling Stones"
              fill
              className="object-cover"
            />
          </div>
        </>
      )}

      {/* ── SCREENPRINT HALFTONE MESH OVERLAY ───────────────────────────────── */}
      <div className="absolute inset-0 halftone-overlay opacity-25" />

      {/* ── VINTAGE PAPER VIGNETTE (Gentle edges, preserves poster visibility) ── */}
      <div className="absolute inset-0 bg-radial-gradient from-transparent via-transparent to-[var(--color-ink)]/75 pointer-events-none" />
    </div>
  );
}


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

export function PosterBackdrop({
  variant = "hero",
  overlayOpacity = 0.5,
}: PosterBackdropProps) {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none select-none z-0 transform-gpu">
      {/* ── VARIANT: HERO (Collage of AC/DC, Arctic Monkeys, Stones & Metallica) ── */}
      {variant === "hero" && (
        <>
          {/* Top-Left: AC/DC Guitarist & Fiery Speeding Highway */}
          <div
            className="absolute -top-12 -left-12 w-[52vw] max-w-[620px] aspect-[3/4] mix-blend-screen filter contrast-150 saturate-150"
            style={{ opacity: overlayOpacity }}
          >
            <Image
              src="/posters/acdc-pwrup.jpg"
              alt="AC/DC PWR UP Tour"
              fill
              priority
              className="object-cover object-top"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[var(--color-ink)]/50 to-[var(--color-ink)]" />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[var(--color-ink)]" />
          </div>

          {/* Top-Right: Arctic Monkeys Band Members (Alex Turner & Band) */}
          <div
            className="absolute -top-10 -right-10 w-[48vw] max-w-[580px] aspect-[3/4] mix-blend-lighten filter contrast-125 grayscale"
            style={{ opacity: overlayOpacity * 0.95 }}
          >
            <Image
              src="/posters/arctic-monkeys.jpg"
              alt="Arctic Monkeys Band"
              fill
              priority
              className="object-cover object-top"
            />
            <div className="absolute inset-0 bg-gradient-to-l from-transparent via-[var(--color-ink)]/60 to-[var(--color-ink)]" />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[var(--color-ink)]" />
          </div>

          {/* Bottom Flank: Rolling Stones Psychedelic Burgundy Swirl */}
          <div
            className="absolute -bottom-24 right-1/4 w-[42vw] max-w-[500px] aspect-[3/4] mix-blend-screen filter contrast-125 opacity-30"
          >
            <Image
              src="/posters/rolling-stones.webp"
              alt="Rolling Stones Chile"
              fill
              className="object-cover object-bottom"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-ink)] via-[var(--color-ink)]/70 to-transparent" />
          </div>
        </>
      )}

      {/* ── VARIANT: ROOMS / SESSIONS (Metallica 1985 4-Piece Band Screenprint) ─ */}
      {variant === "rooms" && (
        <>
          {/* Metallica 4 Band Members (James, Lars, Cliff, Kirk) */}
          <div
            className="absolute top-0 right-0 w-[55vw] max-w-[680px] aspect-[3/4] mix-blend-screen filter contrast-150 saturate-125"
            style={{ opacity: overlayOpacity }}
          >
            <Image
              src="/posters/metallica-aragon.jpg"
              alt="Metallica Band 1985"
              fill
              priority
              className="object-cover object-top"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[var(--color-ink)]/60 to-[var(--color-ink)]" />
            <div className="absolute inset-0 bg-gradient-to-l from-transparent via-[var(--color-ink)]/70 to-[var(--color-ink)]" />
          </div>

          {/* Lower Left Flank: Arctic Monkeys Monochrome Screenprint */}
          <div className="absolute bottom-0 left-0 w-[45vw] max-w-[500px] aspect-[3/4] opacity-35 mix-blend-screen grayscale filter contrast-125">
            <Image
              src="/posters/arctic-monkeys.jpg"
              alt="Arctic Monkeys"
              fill
              className="object-cover object-bottom"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-ink)] via-[var(--color-ink)]/70 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[var(--color-ink)]" />
          </div>
        </>
      )}

      {/* ── VARIANT: BOOKING PASS (AC/DC High Voltage Electric Power Highway) ── */}
      {variant === "booking" && (
        <>
          <div
            className="absolute inset-0 w-full h-full mix-blend-screen filter contrast-150 saturate-150"
            style={{ opacity: overlayOpacity }}
          >
            <Image
              src="/posters/acdc-pwrup.jpg"
              alt="AC/DC Highway"
              fill
              priority
              className="object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-[var(--color-ink)]/80 via-transparent to-[var(--color-ink)]/90" />
            <div className="absolute inset-0 bg-[var(--color-ink)]/60" />
          </div>
        </>
      )}

      {/* ── VARIANT: DASHBOARD (Rolling Stones Santiago Chile Psychedelic) ─── */}
      {variant === "dashboard" && (
        <>
          <div
            className="absolute top-0 right-0 w-[55vw] max-w-[700px] aspect-[3/4] mix-blend-screen filter contrast-125"
            style={{ opacity: overlayOpacity }}
          >
            <Image
              src="/posters/rolling-stones.webp"
              alt="Rolling Stones Chile"
              fill
              priority
              className="object-cover object-top"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[var(--color-ink)]/65 to-[var(--color-ink)]" />
            <div className="absolute inset-0 bg-gradient-to-l from-transparent via-[var(--color-ink)]/70 to-[var(--color-ink)]" />
          </div>

          <div className="absolute bottom-0 left-0 w-[40vw] max-w-[450px] aspect-[3/4] opacity-25 mix-blend-screen">
            <Image
              src="/posters/beatles-strawberry.webp"
              alt="The Beatles"
              fill
              className="object-cover object-bottom"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-ink)] to-transparent" />
          </div>
        </>
      )}

      {/* ── VARIANT: COMPATIBILITY (The Beatles Strawberry Fields Forever) ──── */}
      {variant === "compatibility" && (
        <>
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl aspect-[4/3] mix-blend-screen filter contrast-125"
            style={{ opacity: overlayOpacity }}
          >
            <Image
              src="/posters/beatles-strawberry.webp"
              alt="The Beatles Strawberry Fields"
              fill
              priority
              className="object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[var(--color-ink)]/75 to-[var(--color-ink)]" />
            <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-ink)]/80 via-transparent to-transparent" />
          </div>
        </>
      )}

      {/* ── VARIANT: CHECK-IN (Arctic Monkeys AM Monochrome Band Backdrop) ─── */}
      {variant === "checkin" && (
        <>
          <div
            className="absolute inset-0 w-full h-full mix-blend-screen filter contrast-125 grayscale"
            style={{ opacity: overlayOpacity }}
          >
            <Image
              src="/posters/arctic-monkeys.jpg"
              alt="Arctic Monkeys AM Sessions"
              fill
              priority
              className="object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-[var(--color-ink)]/85 via-[var(--color-ink)]/60 to-[var(--color-ink)]/90" />
          </div>
        </>
      )}

      {/* ── VARIANT: AUTH / SIGN IN (Metallica Aragon Ballroom Stage) ──────── */}
      {variant === "auth" && (
        <>
          <div
            className="absolute inset-0 w-full h-full mix-blend-screen filter contrast-125"
            style={{ opacity: overlayOpacity }}
          >
            <Image
              src="/posters/metallica-aragon.jpg"
              alt="Metallica Chicago 1985"
              fill
              priority
              className="object-cover object-center"
            />
            <div className="absolute inset-0 bg-[var(--color-ink)]/70" />
            <div className="absolute inset-0 bg-gradient-to-b from-[var(--color-ink)]/80 via-transparent to-[var(--color-ink)]" />
          </div>
        </>
      )}

      {/* ── Screen-Print Halftone Mesh Overlay across all pages ────────────── */}
      <div className="absolute inset-0 halftone-overlay opacity-35" />
      <div className="absolute inset-0 bg-radial-gradient from-transparent via-transparent to-[var(--color-ink)]/90" />
    </div>
  );
}

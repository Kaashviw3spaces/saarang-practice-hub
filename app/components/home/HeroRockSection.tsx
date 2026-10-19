"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Radio,
  ArrowRight,
  Guitar,
  Drum,
  Piano,
  Mic2,
} from "lucide-react";
import { PosterBackdrop } from "@/components/motion/PosterBackdrop";
import { ElectricGuitarGraphic } from "@/components/motion/ElectricGuitarGraphic";
import { SoundwaveVisualizer } from "@/components/motion/SoundwaveVisualizer";
import { BottomRightVuDock } from "@/components/motion/BottomRightVuDock";
import { StageAtmosphere } from "@/components/motion/StageAtmosphere";

export function HeroRockSection() {
  const [isOverdrive, setIsOverdrive] = useState(false);

  return (
    <section className="relative min-h-[95vh] flex flex-col items-center justify-center overflow-hidden px-4 md:px-8 py-16 md:py-24 text-center">
      {/* Actual poster artwork backdrop (AC/DC lightning + Stones burgundy swirl + AM wave) */}
      <PosterBackdrop variant="hero" overlayOpacity={0.72} />

      {/* ── CONCERT STAGE LIGHTING & ATMOSPHERIC EMBERS ─────────────────── */}
      <StageAtmosphere isOverdrive={isOverdrive} />

      {/* Subtle background halftone & radial aura */}
      <div className="absolute inset-0 halftone-overlay opacity-30 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-[var(--color-burgundy)]/25 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute -top-20 right-10 w-[400px] h-[400px] bg-[var(--color-ochre)]/15 rounded-full blur-[120px] pointer-events-none" />

      {/* Gig tour background watermark */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 poster-watermark pointer-events-none">
        SAARANG &apos;85
      </div>

      {/* ── 1. PERFECTLY CENTERED HERO BOX (EXACT AUTHENTIC ROCK GIG POSTER) ── */}
      <div
        className={`relative z-10 w-full max-w-5xl mx-auto p-6 md:p-12 border border-[var(--color-ivory)]/60 bg-[var(--color-surface)]/95 backdrop-blur-md paper-fold-creases rock-paper-surface overflow-hidden transition-all duration-500 ${
          isOverdrive
            ? "amp-overdrive-glow"
            : "shadow-[0_35px_80px_-10px_rgba(0,0,0,0.98),0_18px_36px_-6px_rgba(0,0,0,0.92),inset_0_0_0_3px_var(--color-ink),inset_0_0_0_4px_rgba(238,230,213,0.35)]"
        }`}
      >
        {/* Tactile Rock Paper / Mineral Stone Paper Grain */}
        <div className="absolute inset-0 rock-paper-grain opacity-65 pointer-events-none z-0" />

        {/* Aesthetic Attachment Elements from Live Rock Fest poster: */}
        {/* 1. Amplifier Grill Backing Weave */}
        <div className="absolute inset-0 amp-grill-backing opacity-25 pointer-events-none z-0" />

        {/* 2. Dense Halftone Screenprint Dots */}
        <div className="absolute inset-0 halftone-dense opacity-15 pointer-events-none z-0" />

        {/* 3. Screenprint Grunge Speckles & Ink Splatters */}
        <div className="absolute inset-0 grunge-speckles opacity-55 pointer-events-none z-0" />

        {/* 4. Rock Fissure Scratches */}
        <div className="absolute inset-0 rock-scratches opacity-20 pointer-events-none z-0" />

        {/* 5. Clickable & Pluckable Electric Guitar Graphic on Left */}
        <div className="absolute top-0 bottom-0 -left-6 sm:left-0 md:left-2 w-32 sm:w-44 md:w-56 lg:w-64 z-20 flex items-center justify-start overflow-hidden pointer-events-none group">
          <ElectricGuitarGraphic
            className="h-[95%] w-auto max-w-none opacity-40 sm:opacity-50 md:opacity-90 hover:opacity-100 transition-opacity pointer-events-auto"
            accentColor="var(--color-rust)"
            isOverdriven={isOverdrive}
          />
        </div>

        <div className="relative z-10">
          {/* Top Billing Line (Aragon Ballroom / Arctic Monkeys poster inspired) */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 border-b border-[var(--color-border)] pb-4 mb-8 text-[10px] md:text-xs font-mono uppercase tracking-[0.25em] text-[var(--color-text-dim)]">
            <span className="flex items-center gap-1.5 text-[var(--color-cream)]">
              <Radio size={13} className="text-[var(--color-rust)]" /> SAARANG PRACTICE HUB
            </span>
            <span className="text-[var(--color-ochre)] font-bold">
               NOW OPEN
            </span>
            <span className="hidden sm:inline text-[var(--color-text-muted)]">
              SONIPAT, INDIA
            </span>
          </div>

            {/* Monumental Headline with Continuous Rock Chromatic Glitch and Pink FIND YOUR SPACE */}
            <div className="flex flex-col items-center gap-2 mb-6">
              <p className="poster-subhead text-xs md:text-sm uppercase tracking-[0.25em] text-[var(--color-rust)] font-bold">

              </p>
              <h1 className="font-[var(--font-display)] text-6xl sm:text-7xl md:text-8xl lg:text-9xl text-[var(--color-cream)] leading-[0.88] tracking-tight poster-headline rock-headline-glitch cursor-pointer">
                <span className="block">
                  MAKE SOME NOISE.
                </span>
                <span className="block text-[var(--color-magenta)]">
                  FIND YOUR SPACE.
                </span>
              </h1>
            </div>

          {/* Live Frequency Wave Indicator (Pure poster ornament, audio reactive) */}
          <div className="my-6 max-w-lg mx-auto flex flex-col items-center">
            <SoundwaveVisualizer barsCount={32} />
            <p className="text-[10px] font-mono uppercase tracking-widest text-[var(--color-text-dim)] mt-1 text-center">
              • • • LIVE ACOUSTIC FREQUENCY METER • • •
            </p>
          </div>

          {/* Subheading */}
          <div className="max-w-xl mx-auto mb-8 flex flex-col items-center gap-2">
            <p className="poster-subhead text-lg md:text-2xl text-[var(--color-cream)] tracking-wider">
              Now practice better
            </p>
            <p className="text-sm md:text-base text-[var(--color-text-muted)] leading-relaxed">
              No sound bleed, no scheduling clashes, just uninterrupted rehearsal.
            </p>
          </div>

          {/* CTAs (Inverted Rock Buttons with High-Voltage Electric Arc) */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Link
              href="/rooms"
              className="btn-rock-primary btn-electric-arc text-base py-3 px-8 shadow-[4px_4px_0_0_var(--color-rust)] w-full sm:w-auto"
            >
              Book Practice Slot <ArrowRight size={16} />
            </Link>
            <Link
              href="/dashboard"
              className="btn-rock-ghost text-base py-3 px-8 w-full sm:w-auto hover:shadow-[0_0_20px_rgba(212,168,63,0.3)]"
            >
              Access Dashboard
            </Link>
          </div>

          {/* Instrument Lineup Footer */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-[var(--color-text-dim)] border-t border-[var(--color-border)] mt-10 pt-5 text-xs font-mono uppercase tracking-widest">
            <span className="flex items-center gap-1.5 text-[var(--color-cream)] hover:text-[var(--color-rust)] transition-colors cursor-default">
              <Guitar size={14} className="text-[var(--color-rust)]" /> Electric & Bass
            </span>
            <span>·</span>
            <span className="flex items-center gap-1.5 text-[var(--color-cream)] hover:text-[var(--color-ochre)] transition-colors cursor-default">
              <Drum size={14} className="text-[var(--color-ochre)]" /> Acoustic Drums
            </span>
            <span>·</span>
            <span className="flex items-center gap-1.5 text-[var(--color-cream)] hover:text-[var(--color-olive)] transition-colors cursor-default">
              <Piano size={14} className="text-[var(--color-olive)]" /> Keyboards & MIDI
            </span>
            <span>·</span>
            <span className="flex items-center gap-1.5 text-[var(--color-cream)] hover:text-[var(--color-magenta)] transition-colors cursor-default">
              <Mic2 size={14} className="text-[var(--color-magenta)]" /> Lead Vocals
            </span>
          </div>
        </div>
      </div>

      {/* ── 2. MINIMAL CLEAN NEEDLE DOCK AT BOTTOM RIGHT OF PAGE ── */}
      <BottomRightVuDock
        isOverdrive={isOverdrive}
        onOverdriveChange={setIsOverdrive}
      />
    </section>
  );
}

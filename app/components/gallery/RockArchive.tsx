"use client";

import { useState } from "react";
import Image from "next/image";
import { Zap, Eye, X, Music, Radio, Disc3, Sparkles } from "lucide-react";

interface PosterItem {
  id: string;
  title: string;
  band: string;
  year: string;
  venue: string;
  src: string;
  tagline: string;
  accentColor: string;
  palette: string[];
  tracklistOrNotes: string;
}

const POSTERS: PosterItem[] = [
  {
    id: "acdc",
    title: "PWR UP TOUR",
    band: "AC/DC",
    year: "2024–2025",
    venue: "Optus Stadium, Perth",
    src: "/posters/acdc-pwrup.jpg",
    tagline: "HIGH VOLTAGE ROCK 'N' ROLL",
    accentColor: "var(--color-magenta)",
    palette: ["#10100F", "#E63CA6", "#713CE8", "#D4A83F"],
    tracklistOrNotes: "Thunderstruck · Highway to Hell · Back in Black · Shot in the Dark",
  },
  {
    id: "arctic-monkeys",
    title: "AM LIVE SESSIONS",
    band: "ARCTIC MONKEYS",
    year: "2013–2014",
    venue: "Screenprint Series",
    src: "/posters/arctic-monkeys.jpg",
    tagline: "DO I WANNA KNOW? · SOUNDWAVE MINIMALISM",
    accentColor: "var(--color-ivory)",
    palette: ["#10100F", "#EEE6D5", "#D8CBA9", "#FFF7DF"],
    tracklistOrNotes: "Do I Wanna Know · R U Mine? · Arabella · Knee Socks · No. 1 Party Anthem",
  },
  {
    id: "metallica",
    title: "RIDE THE LIGHTNING",
    band: "METALLICA",
    year: "1985-FEB-09",
    venue: "Aragon Ballroom, Chicago",
    src: "/posters/metallica-aragon.jpg",
    tagline: "NOW ON TOUR · TICKETS ON SALE AT BOX OFFICE",
    accentColor: "var(--color-rust)",
    palette: ["#10100F", "#FFF7DF", "#D8CBA9", "#B84C2D"],
    tracklistOrNotes: "Creeping Death · Ride the Lightning · Fade to Black · Seek & Destroy",
  },
  {
    id: "beatles",
    title: "STRAWBERRY FIELDS FOREVER",
    band: "THE BEATLES",
    year: "1967",
    venue: "Panavision Studio Film",
    src: "/posters/beatles-strawberry.webp",
    tagline: "LIVING IS EASY WITH EYES CLOSED",
    accentColor: "var(--color-ochre)",
    palette: ["#D8CBA9", "#6D2024", "#D4A83F", "#929765"],
    tracklistOrNotes: "A film by The Beatles · Produced by George Martin · Apple Films Ltd.",
  },
  {
    id: "stones",
    title: "AMÉRICA LATINA OLÉ TOUR",
    band: "THE ROLLING STONES",
    year: "2016-FEB-03",
    venue: "Estadio Nacional, Santiago",
    src: "/posters/rolling-stones.webp",
    tagline: "IT'S ONLY ROCK 'N' ROLL BUT I LIKE IT",
    accentColor: "var(--color-burgundy)",
    palette: ["#6D2024", "#B84C2D", "#FFF7DF", "#10100F"],
    tracklistOrNotes: "Paint It Black · Gimme Shelter · Start Me Up · Sympathy for the Devil",
  },
];

export function RockArchive() {
  const [selectedPoster, setSelectedPoster] = useState<PosterItem | null>(null);

  return (
    <section className="section border-t border-b border-[var(--color-border)] bg-[var(--color-surface)] relative overflow-hidden">
      {/* Background halftone */}
      <div className="absolute inset-0 halftone-overlay opacity-30 pointer-events-none" />

      <div className="container relative z-10 flex flex-col gap-10">
        {/* Section Header with Editorial Framing */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[var(--color-border)] pb-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="badge-tour badge-tour-accent">
                <Sparkles size={11} /> Art Direction Inspiration
              </span>
              <span className="text-xs font-mono uppercase tracking-[0.2em] text-[var(--color-text-dim)]">
                Archive // Volume 01
              </span>
            </div>
            <h2 className="font-[var(--font-display)] text-4xl md:text-6xl text-[var(--color-cream)] leading-none tracking-tight">
              THE ROCK ARCHIVE
            </h2>
            <p className="mt-2 text-sm text-[var(--color-text-muted)] max-w-xl">
              From underground gig flyers to psych-rock screenprints. The visual spirit that drives
              every practice session at Saarang.
            </p>
          </div>

          <div className="hidden lg:flex items-center gap-6 text-xs font-mono uppercase tracking-widest text-[var(--color-text-dim)]">
            <span className="flex items-center gap-1.5">
              <Radio size={14} className="text-[var(--color-rust)]" /> Analog Screenprint
            </span>
            <span className="flex items-center gap-1.5">
              <Disc3 size={14} className="text-[var(--color-ochre)]" /> Double-Border Frame
            </span>
          </div>
        </div>

        {/* Poster Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {POSTERS.map((poster) => (
            <div
              key={poster.id}
              onClick={() => setSelectedPoster(poster)}
              className="group cursor-pointer flex flex-col bg-[var(--color-ink)] border border-[var(--color-border)] hover:border-[var(--color-ivory)] transition-all duration-300 relative shadow-[inset_0_0_0_2px_var(--color-ink),inset_0_0_0_3px_rgba(238,230,213,0.2)] hover:shadow-[inset_0_0_0_2px_var(--color-ink),inset_0_0_0_4px_var(--color-ivory),0_12px_32px_rgba(0,0,0,0.6)] hover:-translate-y-1"
            >
              {/* Corner tour metadata */}
              <div className="p-2.5 flex items-center justify-between border-b border-[var(--color-border)] text-[9px] font-mono uppercase tracking-widest text-[var(--color-text-dim)]">
                <span>{poster.year}</span>
                <span className="text-[var(--color-ochre)] truncate max-w-[120px]">
                  {poster.band}
                </span>
              </div>

              {/* Poster Image Crop */}
              <div className="relative aspect-[3/4] w-full overflow-hidden bg-black/60">
                <Image
                  src={poster.src}
                  alt={`${poster.band} — ${poster.title}`}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 20vw"
                  className="object-cover object-top transition-transform duration-500 group-hover:scale-105 filter contrast-105"
                />
                {/* Vintage overlay shimmer on hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-30 transition-opacity" />

                {/* Inspect eye icon button */}
                <div className="absolute top-2 right-2 flex h-7 w-7 items-center justify-center rounded-full bg-[var(--color-ink)]/80 text-[var(--color-cream)] border border-[var(--color-border)] opacity-0 group-hover:opacity-100 transition-opacity">
                  <Eye size={13} />
                </div>
              </div>

              {/* Poster Footer Text Block */}
              <div className="p-3 flex flex-col gap-1 border-t border-[var(--color-border)]">
                <h3 className="font-[var(--font-display)] text-base text-[var(--color-cream)] leading-none truncate">
                  {poster.title}
                </h3>
                <p className="text-[10px] font-mono uppercase tracking-wider text-[var(--color-text-dim)] truncate">
                  {poster.venue}
                </p>

                {/* Mini palette strip */}
                <div className="flex items-center gap-1 mt-2 pt-2 border-t border-[var(--color-border)]/60">
                  {poster.palette.map((col, idx) => (
                    <span
                      key={idx}
                      className="h-2 flex-1 rounded-none border border-black/40"
                      style={{ backgroundColor: col }}
                    />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer Editorial Tag */}
        <div className="text-center pt-2">
          <p className="text-xs font-mono uppercase tracking-[0.2em] text-[var(--color-text-dim)]">
            ARCHIVE CREDITS: AC/DC · ARCTIC MONKEYS · METALLICA · THE BEATLES · THE ROLLING STONES
          </p>
        </div>
      </div>

      {/* Lightbox Modal */}
      {selectedPoster && (
        <div
          className="fixed inset-0 z-[110] flex items-center justify-center bg-black/90 p-4 backdrop-blur-md transition-all"
          onClick={() => setSelectedPoster(null)}
        >
          <div
            className="relative max-w-4xl w-full bg-[var(--color-ink)] border-2 border-[var(--color-ivory)] shadow-[inset_0_0_0_4px_var(--color-ink),inset_0_0_0_5px_rgba(238,230,213,0.5),0_20px_60px_rgba(0,0,0,0.9)] p-6 md:p-8 flex flex-col md:flex-row gap-6 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={() => setSelectedPoster(null)}
              className="absolute top-4 right-4 z-10 flex h-8 w-8 items-center justify-center rounded-none bg-[var(--color-ink)] border border-[var(--color-ivory)] text-[var(--color-cream)] hover:bg-[var(--color-cream)] hover:text-[var(--color-ink)] transition-colors cursor-pointer"
            >
              <X size={16} />
            </button>

            {/* Poster image */}
            <div className="relative aspect-[3/4] w-full md:w-1/2 min-h-[350px] border border-[var(--color-border)] bg-black">
              <Image
                src={selectedPoster.src}
                alt={selectedPoster.title}
                fill
                className="object-contain"
              />
            </div>

            {/* Poster info block */}
            <div className="flex-1 flex flex-col justify-between gap-4">
              <div>
                <span className="badge-tour badge-tour-rust mb-2">
                  Vintage Gig Archive
                </span>
                <p className="text-xs font-mono uppercase tracking-[0.2em] text-[var(--color-ochre)] mt-2">
                  {selectedPoster.band} // {selectedPoster.year}
                </p>
                <h3 className="font-[var(--font-display)] text-3xl md:text-5xl text-[var(--color-cream)] tracking-tight mt-1">
                  {selectedPoster.title}
                </h3>
                <p className="text-xs font-mono uppercase tracking-widest text-[var(--color-text-dim)] border-b border-[var(--color-border)] pb-3 mt-1">
                  VENUE: {selectedPoster.venue}
                </p>

                <p className="text-sm text-[var(--color-text-muted)] italic my-4">
                  &ldquo;{selectedPoster.tagline}&rdquo;
                </p>

                <div className="flex flex-col gap-1 text-xs font-mono text-[var(--color-text-muted)] bg-[var(--color-surface-2)] p-3 border border-[var(--color-border)]">
                  <span className="text-[10px] text-[var(--color-text-dim)] uppercase tracking-widest">
                    Notes & Tracklist
                  </span>
                  <span>{selectedPoster.tracklistOrNotes}</span>
                </div>
              </div>

              {/* Color breakdown */}
              <div className="border-t border-[var(--color-border)] pt-4">
                <p className="text-[10px] font-mono uppercase tracking-widest text-[var(--color-text-dim)] mb-2">
                  Palette breakdown
                </p>
                <div className="flex items-center gap-2">
                  {selectedPoster.palette.map((c, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1">
                      <span className="h-6 w-full border border-black/40" style={{ backgroundColor: c }} />
                      <span className="text-[9px] font-mono text-[var(--color-text-dim)]">{c}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

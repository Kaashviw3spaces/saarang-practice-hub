"use client";

import { useId, useState } from "react";
import { rockSynth } from "@/lib/audio/rockSynth";

interface ElectricGuitarGraphicProps {
  className?: string;
  accentColor?: string;
  isOverdriven?: boolean;
}

interface StringDef {
  x: number;
  width: number;
  note: string;
  fullName: string;
}

const STRINGS: StringDef[] = [
  { x: 99, width: 1.6, note: "E2", fullName: "Low E (82Hz)" },
  { x: 103, width: 1.3, note: "A2", fullName: "A (110Hz)" },
  { x: 107, width: 1.1, note: "D3", fullName: "D (147Hz)" },
  { x: 111, width: 0.95, note: "G3", fullName: "G (196Hz)" },
  { x: 115, width: 0.85, note: "B3", fullName: "B (247Hz)" },
  { x: 119, width: 0.75, note: "E4", fullName: "High E (330Hz)" },
];

export function ElectricGuitarGraphic({
  className = "",
  accentColor = "var(--color-rust)",
  isOverdriven = false,
}: ElectricGuitarGraphicProps) {
  const maskId = useId();
  // String vibration counter to force re-render of CSS keyframe animation on each click
  const [stringVibrations, setStringVibrations] = useState<Record<number, number>>({});
  const [pluckedNote, setPluckedNote] = useState<{ note: string; x: number; id: number } | null>(null);
  const [volumeAngle, setVolumeAngle] = useState(25);

  const pluckString = (index: number, e?: React.MouseEvent) => {
    e?.stopPropagation();

    // 1. Ensure AudioContext is active upon user interaction
    rockSynth.initContext();

    // 2. Play synthesized electric guitar string pitch with harmonics
    rockSynth.playGuitarString(index, isOverdriven);

    // 3. Trigger physical string vibration animation
    const timestamp = Date.now();
    setStringVibrations((prev) => ({ ...prev, [index]: timestamp }));

    // 4. Show floating musical note indicator
    const str = STRINGS[index];
    if (str) {
      setPluckedNote({ note: str.note, x: str.x, id: timestamp });
    }

    // Auto-clear vibration after duration
    setTimeout(() => {
      setStringVibrations((prev) => {
        if (prev[index] === timestamp) {
          const updated = { ...prev };
          delete updated[index];
          return updated;
        }
        return prev;
      });
    }, 700);
  };

  const handleKnobClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    rockSynth.initContext();
    setVolumeAngle((prev) => (prev >= 260 ? 25 : prev + 45));
    rockSynth.playStompClick();
  };

  return (
    <div className={`relative ${className}`}>
      {/* Permanent vintage cue badge */}
      <div className="absolute top-2 left-6 z-30 pointer-events-none transition-opacity duration-300">
        <span className="text-[7.5px] font-mono uppercase tracking-widest px-2 py-0.5 bg-[var(--color-ink)]/95 border border-[var(--color-ochre)] text-[var(--color-ochre)] shadow-[0_4px_12px_rgba(0,0,0,0.95)] flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-rust)] animate-ping inline-block" />
          ⚡ CLICK STRINGS TO PLAY
        </span>
      </div>

      {/* Floating Note indicator popup when string is plucked */}
      {pluckedNote && (
        <div
          key={pluckedNote.id}
          className="absolute z-40 pointer-events-none anim-note-float text-[9px] font-mono font-bold px-2 py-0.5 bg-[var(--color-ink)] border border-[var(--color-ochre)] text-[var(--color-ochre)] shadow-[0_0_12px_rgba(212,168,63,0.8)]"
          style={{
            left: `${(pluckedNote.x / 240) * 100}%`,
            top: "45%",
          }}
        >
          🎸 {pluckedNote.note}
        </div>
      )}

      <svg
        viewBox="0 0 240 760"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full select-none"
        aria-label="Interactive Rock Electric Guitar - Click strings to play notes"
      >
        <defs>
          <filter id={`${maskId}-grunge`} x="0" y="0" width="100%" height="100%">
            <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="3" result="noise" />
            <feColorMatrix
              type="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0.18 0"
            />
            <feComposite in="SourceGraphic" in2="noise" operator="over" />
          </filter>

          <linearGradient id={`${maskId}-body-grad`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#141413" />
            <stop offset="60%" stopColor="#0B0B0A" />
            <stop offset="100%" stopColor="#181716" />
          </linearGradient>

          <linearGradient id={`${maskId}-neck-grad`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#1A1918" />
            <stop offset="50%" stopColor="#252422" />
            <stop offset="100%" stopColor="#151413" />
          </linearGradient>

          {/* Glowing pickup field when overdriven */}
          <radialGradient id={`${maskId}-pickup-glow`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(212,168,63,0.5)" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>
        </defs>

        {/* ── 1. GUITAR BODY SILHOUETTE (Left half / cutaway matching poster) ── */}
        <path
          d="M 120 280
             C 115 260 100 240 85 240
             C 70 240 50 255 45 275
             C 40 300 50 330 65 350
             C 35 380 20 425 20 480
             C 20 540 40 600 65 650
             C 85 690 105 720 120 735
             L 120 280 Z"
          fill={`url(#${maskId}-body-grad)`}
          stroke="rgba(238,230,213,0.3)"
          strokeWidth="1.5"
        />

        {/* Outer body bevel contour / edge highlight */}
        <path
          d="M 115 290
             C 105 270 90 252 82 252
             C 72 252 56 265 52 280
             C 47 302 56 328 68 346
             C 42 376 28 420 28 475
             C 28 530 46 588 70 638
             C 86 672 104 702 115 720"
          stroke="rgba(212,168,63,0.35)"
          strokeWidth="1"
          fill="none"
        />

        {/* ── 2. GUITAR NECK & FRETBOARD ── */}
        <rect
          x="96"
          y="110"
          width="24"
          height="330"
          fill={`url(#${maskId}-neck-grad)`}
          stroke="rgba(238,230,213,0.35)"
          strokeWidth="1"
        />

        {/* Frets along the neck (spaced proportionally) */}
        {[
          122, 134, 147, 161, 175, 190, 205, 221, 237, 254,
          271, 289, 307, 325, 343, 361, 379, 396, 412, 426, 438
        ].map((y, idx) => (
          <line
            key={`fret-${idx}`}
            x1="96"
            y1={y}
            x2="120"
            y2={y}
            stroke={accentColor}
            strokeWidth={idx === 10 ? "2" : "1.2"}
            opacity="0.85"
          />
        ))}

        {/* Fret position inlay dots */}
        {[
          { y: 154, r: 1.8 },
          { y: 182, r: 1.8 },
          { y: 213, r: 1.8 },
          { y: 245, r: 1.8 },
          { y: 280, r: 1.5, offset: -2 },
          { y: 280, r: 1.5, offset: 2 },
          { y: 316, r: 1.6 },
          { y: 352, r: 1.6 },
          { y: 387, r: 1.5 },
          { y: 419, r: 1.4 },
        ].map((dot, idx) => (
          <circle
            key={`dot-${idx}`}
            cx={108 + (dot.offset || 0)}
            cy={dot.y}
            r={dot.r}
            fill="var(--color-cream)"
            opacity="0.8"
          />
        ))}

        {/* ── 3. STRUMMABLE & CLICKABLE INTERACTIVE STRINGS ── */}
        {STRINGS.map((str, idx) => {
          const isVibrating = Boolean(stringVibrations[idx]);
          return (
            <g
              key={`str-${idx}`}
              onClick={(e) => pluckString(idx, e)}
              onMouseEnter={() => pluckString(idx)}
              className="cursor-pointer group/str"
              aria-label={`Pluck ${str.fullName}`}
            >
              <title>{`Click to pluck string ${idx + 1}: ${str.fullName}`}</title>

              {/* Generous invisible hit rectangle */}
              <rect
                x={str.x - 7}
                y="50"
                width="14"
                height="590"
                fill="transparent"
                className="cursor-pointer"
              />

              {/* Vibrating String Path or Resting Line */}
              {isVibrating ? (
                <g key={`vib-anim-${stringVibrations[idx]}`} className="anim-string-pluck">
                  {/* Left harmonic ghost blur */}
                  <path
                    d={`M ${str.x} 70 Q ${str.x - 3.5} 350, ${str.x} 630`}
                    stroke="var(--color-ochre)"
                    strokeWidth={str.width * 0.8}
                    opacity="0.6"
                  />
                  {/* Right harmonic ghost blur */}
                  <path
                    d={`M ${str.x} 70 Q ${str.x + 3.5} 350, ${str.x} 630`}
                    stroke="var(--color-cream)"
                    strokeWidth={str.width * 0.8}
                    opacity="0.6"
                  />
                  {/* High-intensity central vibrating wire */}
                  <line
                    x1={str.x}
                    y1="70"
                    x2={str.x}
                    y2="630"
                    stroke="var(--color-ochre)"
                    strokeWidth={str.width * 2}
                    className="filter drop-shadow-[0_0_8px_var(--color-ochre)]"
                  />
                </g>
              ) : (
                <line
                  x1={str.x}
                  y1="70"
                  x2={str.x}
                  y2="630"
                  stroke={isOverdriven ? "rgba(255,247,223,0.95)" : "rgba(255,247,223,0.72)"}
                  strokeWidth={str.width}
                  className="group-hover/str:stroke-[var(--color-ochre)] group-hover/str:stroke-[2.5px] transition-all"
                />
              )}
            </g>
          );
        })}

        {/* ── 4. REVERSE / 6-IN-LINE HEADSTOCK (Top left matching poster) ── */}
        <path
          d="M 96 110
             L 96 40
             C 96 25 88 18 78 22
             C 70 25 65 35 68 50
             L 72 70
             C 74 78 78 88 88 98
             L 96 110 Z"
          fill={`url(#${maskId}-neck-grad)`}
          stroke="rgba(238,230,213,0.4)"
          strokeWidth="1.5"
        />

        {/* 6 Tuning pegs */}
        {[
          { postY: 34, pegX: 52, pegY: 32 },
          { postY: 46, pegX: 50, pegY: 44 },
          { postY: 58, pegX: 48, pegY: 56 },
          { postY: 70, pegX: 52, pegY: 68 },
          { postY: 82, pegX: 58, pegY: 80 },
          { postY: 94, pegX: 68, pegY: 92 },
        ].map((peg, idx) => (
          <g key={`peg-${idx}`}>
            <line
              x1="96"
              y1={peg.postY}
              x2={peg.pegX}
              y2={peg.pegY}
              stroke={accentColor}
              strokeWidth="1.8"
            />
            <circle
              cx={peg.pegX}
              cy={peg.pegY}
              r="4.5"
              fill="var(--color-ink)"
              stroke={accentColor}
              strokeWidth="1.5"
            />
          </g>
        ))}

        {/* ── 5. PICKGUARD & CONTOURS ── */}
        <path
          d="M 120 440
             C 105 440 90 450 82 465
             C 74 480 72 505 72 530
             C 72 560 80 590 95 615
             C 105 630 115 640 120 645
             L 120 440 Z"
          fill="none"
          stroke="rgba(238,230,213,0.4)"
          strokeWidth="1.2"
          strokeDasharray="4 3"
        />

        {/* ── 6. DUAL HUMBUCKER PICKUPS ── */}
        {/* Neck Pickup */}
        <g>
          <rect
            x="93"
            y="450"
            width="27"
            height="18"
            rx="2"
            fill="#1A1815"
            stroke={accentColor}
            strokeWidth="1.2"
          />
          {/* Overdrive Pickup Magnetic Flux Glow */}
          {isOverdriven && (
            <rect
              x="91"
              y="448"
              width="31"
              height="22"
              rx="4"
              fill="none"
              stroke="var(--color-ochre)"
              strokeWidth="1"
              className="animate-pulse"
              opacity="0.8"
            />
          )}
          {/* Pickup Pole Pieces */}
          {[454, 461].map((poleY, rIdx) => (
            <g key={`pole-neck-${rIdx}`}>
              {[98, 104, 110, 116].map((poleX, cIdx) => (
                <circle
                  key={`pole-n-${rIdx}-${cIdx}`}
                  cx={poleX}
                  cy={poleY}
                  r="1.4"
                  fill="var(--color-cream)"
                  stroke="rgba(0,0,0,0.6)"
                  strokeWidth="0.5"
                />
              ))}
            </g>
          ))}
        </g>

        {/* Bridge Pickup */}
        <g>
          <rect
            x="93"
            y="510"
            width="27"
            height="18"
            rx="2"
            fill="#1A1815"
            stroke={accentColor}
            strokeWidth="1.2"
          />
          {isOverdriven && (
            <rect
              x="91"
              y="508"
              width="31"
              height="22"
              rx="4"
              fill="none"
              stroke="var(--color-ochre)"
              strokeWidth="1"
              className="animate-pulse"
              opacity="0.8"
            />
          )}
          {[514, 521].map((poleY, rIdx) => (
            <g key={`pole-bridge-${rIdx}`}>
              {[98, 104, 110, 116].map((poleX, cIdx) => (
                <circle
                  key={`pole-b-${rIdx}-${cIdx}`}
                  cx={poleX}
                  cy={poleY}
                  r="1.4"
                  fill="var(--color-cream)"
                  stroke="rgba(0,0,0,0.6)"
                  strokeWidth="0.5"
                />
              ))}
            </g>
          ))}
        </g>

        {/* ── 7. TUNE-O-MATIC BRIDGE & TAILPIECE ── */}
        <rect
          x="92"
          y="575"
          width="28"
          height="8"
          rx="1"
          fill="#25221D"
          stroke={accentColor}
          strokeWidth="1.2"
        />
        {/* Individual bridge saddles */}
        {[95, 99, 103, 107, 111, 115].map((saddleX, idx) => (
          <rect
            key={`saddle-${idx}`}
            x={saddleX}
            y="583"
            width="4"
            height="7"
            fill={accentColor}
            stroke="rgba(0,0,0,0.8)"
            strokeWidth="0.5"
          />
        ))}

        {/* Interactive Volume & Tone Rotary Knobs */}
        <g onClick={handleKnobClick} className="cursor-pointer" aria-label="Click to turn volume knob">
          <title>Click to turn volume knob</title>
          <circle
            cx="72"
            cy="565"
            r="8"
            fill="var(--color-ink)"
            stroke={accentColor}
            strokeWidth="1.5"
          />
          <circle
            cx="72"
            cy="565"
            r="5"
            fill="none"
            stroke="rgba(255,247,223,0.4)"
            strokeWidth="1"
          />
          <line
            x1="72"
            y1="558"
            x2="72"
            y2="563"
            stroke="var(--color-cream)"
            strokeWidth="1.5"
            transform={`rotate(${volumeAngle} 72 565)`}
            className="transition-transform duration-300"
          />
        </g>

        <g onClick={handleKnobClick} className="cursor-pointer" aria-label="Click to adjust tone">
          <title>Click to adjust tone</title>
          <circle
            cx="62"
            cy="605"
            r="8"
            fill="var(--color-ink)"
            stroke={accentColor}
            strokeWidth="1.5"
          />
          <circle
            cx="62"
            cy="605"
            r="5"
            fill="none"
            stroke="rgba(255,247,223,0.4)"
            strokeWidth="1"
          />
          <line
            x1="62"
            y1="598"
            x2="62"
            y2="603"
            stroke="var(--color-cream)"
            strokeWidth="1.5"
            transform={`rotate(${volumeAngle + 30} 62 605)`}
            className="transition-transform duration-300"
          />
        </g>
      </svg>
    </div>
  );
}

"use client";

import { useId } from "react";

interface ElectricGuitarGraphicProps {
  className?: string;
  accentColor?: string; // default ochre / rust
}

export function ElectricGuitarGraphic({
  className = "",
  accentColor = "var(--color-rust)",
}: ElectricGuitarGraphicProps) {
  const maskId = useId();

  return (
    <svg
      viewBox="0 0 240 760"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`pointer-events-none select-none ${className}`}
      aria-hidden="true"
    >
      <defs>
        {/* Subtle distressed scratch filter for guitar surface */}
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
      </defs>

      {/* ── 1. GUITAR BODY SILHOUETTE (Left half / cutaway matching poster) ── */}
      {/* Lower & upper bout, treble horn, and vertical split */}
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
      {/* Neck profile from headstock (y=100) down into body (y=440) */}
      <rect
        x="96"
        y="110"
        width="24"
        height="330"
        fill={`url(#${maskId}-neck-grad)`}
        stroke="rgba(238,230,213,0.35)"
        strokeWidth="1"
      />

      {/* Frets along the neck (24 frets, spaced proportionally) */}
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

      {/* Fret position inlay dots (3, 5, 7, 9, 12, 15, 17, 19, 21) */}
      {[
        { y: 154, r: 1.8 }, // 3rd
        { y: 182, r: 1.8 }, // 5th
        { y: 213, r: 1.8 }, // 7th
        { y: 245, r: 1.8 }, // 9th
        { y: 280, r: 1.5, offset: -2 }, // 12th double
        { y: 280, r: 1.5, offset: 2 },
        { y: 316, r: 1.6 }, // 15th
        { y: 352, r: 1.6 }, // 17th
        { y: 387, r: 1.5 }, // 19th
        { y: 419, r: 1.4 }, // 21st
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

      {/* Strings (E, A, D, G, B, E running from headstock to bridge) */}
      {[99, 103, 107, 111, 115, 119].map((x, idx) => (
        <line
          key={`string-${idx}`}
          x1={x}
          y1="80"
          x2={x}
          y2="630"
          stroke="rgba(255,247,223,0.7)"
          strokeWidth={idx < 3 ? "1.2" : "0.8"}
        />
      ))}

      {/* ── 3. REVERSE / 6-IN-LINE HEADSTOCK (Top left matching poster) ── */}
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

      {/* 6 Tuning pegs with posts pointing out on the left */}
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
          <circle
            cx={peg.pegX}
            cy={peg.pegY}
            r="1.8"
            fill="var(--color-cream)"
          />
        </g>
      ))}

      {/* Nut (string separator) */}
      <rect
        x="95"
        y="108"
        width="26"
        height="4"
        fill="var(--color-cream)"
        stroke="rgba(16,16,15,0.9)"
        strokeWidth="0.8"
      />

      {/* ── 4. PICKUPS, CONTROLS & HARDWARE (Matching poster line-art) ── */}
      {/* Neck Pickup (Humbucker / Single coil) */}
      <g>
        <rect
          x="90"
          y="470"
          width="30"
          height="18"
          rx="2"
          fill="var(--color-ink)"
          stroke={accentColor}
          strokeWidth="1.5"
        />
        {/* Pole pieces */}
        {[96, 102, 108, 114].map((px, i) => (
          <circle key={`np-${i}`} cx={px} cy="479" r="1.5" fill="var(--color-cream)" />
        ))}
      </g>

      {/* Middle Pickup */}
      <g>
        <rect
          x="92"
          y="505"
          width="28"
          height="12"
          rx="2"
          fill="var(--color-ink)"
          stroke={accentColor}
          strokeWidth="1.2"
        />
        {[96, 102, 108, 114].map((px, i) => (
          <circle key={`mp-${i}`} cx={px} cy="511" r="1.3" fill="var(--color-cream)" />
        ))}
      </g>

      {/* Bridge Pickup (Double Humbucker) */}
      <g>
        <rect
          x="88"
          y="535"
          width="32"
          height="22"
          rx="2"
          fill="var(--color-ink)"
          stroke={accentColor}
          strokeWidth="1.5"
        />
        {/* Double row of pole pieces */}
        {[94, 100, 106, 112, 118].map((px, i) => (
          <g key={`bp-${i}`}>
            <circle cx={px} cy="541" r="1.5" fill="var(--color-cream)" />
            <circle cx={px} cy="551" r="1.5" fill="var(--color-cream)" />
          </g>
        ))}
      </g>

      {/* Bridge & Saddle */}
      <rect
        x="86"
        y="580"
        width="34"
        height="16"
        rx="2"
        fill="var(--color-ink)"
        stroke="var(--color-cream)"
        strokeWidth="1.5"
      />
      {[92, 98, 104, 110, 116].map((sx, i) => (
        <rect
          key={`saddle-${i}`}
          x={sx}
          y="583"
          width="4"
          height="7"
          fill={accentColor}
          stroke="rgba(0,0,0,0.8)"
          strokeWidth="0.5"
        />
      ))}

      {/* Volume & Tone Rotary Knobs */}
      {[
        { cx: 72, cy: 565, label: "VOL" },
        { cx: 62, cy: 605, label: "TONE" },
      ].map((knob, idx) => (
        <g key={`knob-${idx}`}>
          <circle
            cx={knob.cx}
            cy={knob.cy}
            r="8"
            fill="var(--color-ink)"
            stroke={accentColor}
            strokeWidth="1.5"
          />
          <circle
            cx={knob.cx}
            cy={knob.cy}
            r="5"
            fill="none"
            stroke="rgba(255,247,223,0.4)"
            strokeWidth="1"
          />
          <line
            x1={knob.cx}
            y1={knob.cy - 7}
            x2={knob.cx}
            y2={knob.cy - 2}
            stroke="var(--color-cream)"
            strokeWidth="1.5"
          />
        </g>
      ))}

      {/* Pickup Selector Switch */}
      <circle cx="85" cy="515" r="3.5" fill="var(--color-ink)" stroke="var(--color-cream)" strokeWidth="1" />
      <line x1="85" y1="515" x2="82" y2="508" stroke="var(--color-cream)" strokeWidth="2" />
    </svg>
  );
}

"use client";

import { useId, useState } from "react";
import { rockSynth } from "@/lib/audio/rockSynth";

interface ElectricGuitarGraphicProps {
  className?: string;
  accentColor?: string;
  isOverdriven?: boolean;
}

export function ElectricGuitarGraphic({
  className = "",
  accentColor = "var(--color-rust)",
  isOverdriven = false,
}: ElectricGuitarGraphicProps) {
  const maskId = useId();
  const [activeStrings, setActiveStrings] = useState<Record<number, boolean>>({});
  const [volumeAngle, setVolumeAngle] = useState(25);
  const [lastStrumTime, setLastStrumTime] = useState(0);

  const handleStringStrum = (index: number) => {
    // Debounce rapid continuous hovering on the same string (120ms)
    const now = Date.now();
    if (now - lastStrumTime < 100 && activeStrings[index]) return;
    setLastStrumTime(now);

    // Audio pitch
    rockSynth.playGuitarString(index);

    // Trigger visual string vibration
    setActiveStrings((prev) => ({ ...prev, [index]: true }));
    setTimeout(() => {
      setActiveStrings((prev) => ({ ...prev, [index]: false }));
    }, 600);
  };

  const handleKnobClick = () => {
    setVolumeAngle((prev) => (prev >= 260 ? 25 : prev + 45));
    rockSynth.playStompClick();
  };

  return (
    <div className={`relative ${className}`}>
      {/* Interactive Tooltip badge above headstock on hover */}
      <div className="absolute top-2 left-6 z-20 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <span className="text-[8px] font-mono uppercase tracking-widest px-1.5 py-0.5 bg-[var(--color-ink)] border border-[var(--color-ochre)] text-[var(--color-ochre)] shadow-[0_4px_12px_rgba(0,0,0,0.9)]">
          ⚡ STRUM
        </span>
      </div>

      <svg
        viewBox="0 0 240 760"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full select-none"
        aria-label="Interactive Rock Electric Guitar"
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

        {/* ── 3. STRUMMABLE INTERACTIVE STRINGS ── */}
        {/* Invisible wider hit areas + vibrating SVG string paths */}
        {[
          { x: 99, width: 1.4, note: "E2" },
          { x: 103, width: 1.2, note: "A2" },
          { x: 107, width: 1.0, note: "D3" },
          { x: 111, width: 0.9, note: "G3" },
          { x: 115, width: 0.8, note: "B3" },
          { x: 119, width: 0.7, note: "E4" },
        ].map((str, idx) => {
          const isVibrating = activeStrings[idx];
          return (
            <g
              key={`str-${idx}`}
              onMouseEnter={() => handleStringStrum(idx)}
              onClick={() => handleStringStrum(idx)}
              className="cursor-pointer group/str"
            >
              {/* Invisible wider mouse-hover hit area */}
              <line
                x1={str.x}
                y1="80"
                x2={str.x}
                y2="630"
                stroke="transparent"
                strokeWidth="10"
              />

              {/* Glowing string resonance line */}
              {isVibrating ? (
                <path
                  d={`M ${str.x} 80 Q ${str.x + (idx % 2 === 0 ? 3 : -3)} 355, ${str.x} 630`}
                  stroke="var(--color-ochre)"
                  strokeWidth={str.width * 1.8}
                  className="filter drop-shadow-[0_0_6px_var(--color-ochre)]"
                />
              ) : (
                <line
                  x1={str.x}
                  y1="80"
                  x2={str.x}
                  y2="630"
                  stroke={isOverdriven ? "rgba(255,247,223,0.95)" : "rgba(255,247,223,0.7)"}
                  strokeWidth={str.width}
                  className="group-hover/str:stroke-[var(--color-ochre)] group-hover/str:stroke-2 transition-colors"
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
            <circle
              cx={peg.pegX}
              cy={peg.pegY}
              r="1.8"
              fill="var(--color-cream)"
            />
          </g>
        ))}

        {/* Nut */}
        <rect
          x="95"
          y="108"
          width="26"
          height="4"
          fill="var(--color-cream)"
          stroke="rgba(16,16,15,0.9)"
          strokeWidth="0.8"
        />

        {/* ── 5. PICKUPS WITH MAGNETIC FLUX GLOW ── */}
        {isOverdriven && (
          <ellipse
            cx="104"
            cy="510"
            rx="32"
            ry="60"
            fill={`url(#${maskId}-pickup-glow)`}
            className="animate-pulse"
          />
        )}

        {/* Neck Pickup */}
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

        {/* Bridge Pickup */}
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
            transform={`rotate(${volumeAngle * 0.8} 62 605)`}
            className="transition-transform duration-300"
          />
        </g>

        {/* Pickup Selector Switch */}
        <circle cx="85" cy="515" r="3.5" fill="var(--color-ink)" stroke="var(--color-cream)" strokeWidth="1" />
        <line x1="85" y1="515" x2="82" y2="508" stroke="var(--color-cream)" strokeWidth="2" />
      </svg>
    </div>
  );
}

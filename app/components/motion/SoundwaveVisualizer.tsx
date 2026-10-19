"use client";

import { useEffect, useState } from "react";
import { rockSynth } from "@/lib/audio/rockSynth";

interface SoundwaveVisualizerProps {
  className?: string;
  barsCount?: number;
  interactive?: boolean;
}

export function SoundwaveVisualizer({
  className = "",
  barsCount = 32,
  interactive = true,
}: SoundwaveVisualizerProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [audioScale, setAudioScale] = useState(1);

  // Real-time audio reactivity from background mic & guitar synthesizer
  useEffect(() => {
    let animFrame: number;
    let t = 0;

    const tick = () => {
      t += 0.08;
      const level = rockSynth.getLiveAudioLevel();

      if (level.hasAudio) {
        const boost = 1 + Math.min(1.8, Math.max(level.rms * 3.5, level.peak * 2.2));
        setAudioScale(boost);
      } else {
        // Subtle ambient rhythm breath
        const idleWave = 1 + Math.sin(t * 2) * 0.15;
        setAudioScale(idleWave);
      }

      animFrame = requestAnimationFrame(tick);
    };

    animFrame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animFrame);
  }, []);

  // Generate dynamic sinusoidal height profile
  const baseHeights = Array.from({ length: barsCount }, (_, i) => {
    const norm = i / (barsCount - 1); // 0 to 1
    const center = Math.sin(norm * Math.PI); // 0 at edges, 1 at center
    const ripple = Math.sin(norm * Math.PI * 6) * 0.25;
    return Math.max(8, Math.round((center + ripple) * 44));
  });

  return (
    <div
      className={`flex items-center justify-center gap-1 sm:gap-1.5 h-16 py-2 select-none ${className}`}
      onMouseLeave={() => setHoveredIndex(null)}
    >
      {baseHeights.map((h, i) => {
        const isHovered = hoveredIndex === i;
        const isNear = hoveredIndex !== null && Math.abs(hoveredIndex - i) <= 2;
        const scaleBoost = isHovered ? 1.4 : isNear ? 1.2 : 1;

        // Modulate individual bar heights with sinusoidal phase wave when audio is active
        const phase = Math.sin(i * 0.35 + audioScale * 2);
        const dynamicHeight = Math.max(6, Math.min(54, h * (audioScale * 0.75 + phase * 0.25) * scaleBoost));

        return (
          <div
            key={i}
            onMouseEnter={() => interactive && setHoveredIndex(i)}
            className="w-1 md:w-1.5 rounded-full bg-[var(--color-ivory)] transition-all duration-75 ease-out cursor-pointer"
            style={{
              height: `${dynamicHeight}px`,
              opacity: isHovered ? 1 : isNear ? 0.95 : audioScale > 1.2 ? 0.85 : 0.6,
              backgroundColor: isHovered
                ? "var(--color-magenta)"
                : isNear || audioScale > 1.5
                ? "var(--color-ochre)"
                : "var(--color-ivory)",
              transformOrigin: "center",
            }}
          />
        );
      })}
    </div>
  );
}

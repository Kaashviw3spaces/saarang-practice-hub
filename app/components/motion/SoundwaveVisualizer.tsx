"use client";

import { useState } from "react";

interface SoundwaveVisualizerProps {
  className?: string;
  barsCount?: number;
  interactive?: boolean;
}

export function SoundwaveVisualizer({
  className = "",
  barsCount = 36,
  interactive = true,
}: SoundwaveVisualizerProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Generate dynamic sinusoidal height profile
  const baseHeights = Array.from({ length: barsCount }, (_, i) => {
    const norm = i / (barsCount - 1); // 0 to 1
    const center = Math.sin(norm * Math.PI); // 0 at edges, 1 at center
    const ripple = Math.sin(norm * Math.PI * 6) * 0.25;
    return Math.max(6, Math.round((center + ripple) * 44));
  });

  return (
    <div
      className={`flex items-center justify-center gap-1.5 h-16 py-2 ${className}`}
      onMouseLeave={() => setHoveredIndex(null)}
    >
      {baseHeights.map((h, i) => {
        const isHovered = hoveredIndex === i;
        const isNear = hoveredIndex !== null && Math.abs(hoveredIndex - i) <= 2;
        const scaleBoost = isHovered ? 1.4 : isNear ? 1.2 : 1;

        return (
          <div
            key={i}
            onMouseEnter={() => interactive && setHoveredIndex(i)}
            className="w-1 md:w-1.5 rounded-full bg-[var(--color-ivory)] transition-all duration-150 ease-out cursor-pointer"
            style={{
              height: `${Math.min(56, h * scaleBoost)}px`,
              opacity: isHovered ? 1 : isNear ? 0.9 : 0.6,
              backgroundColor: isHovered
                ? "var(--color-magenta)"
                : isNear
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

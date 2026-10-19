"use client";

import { useEffect, useRef, useState } from "react";

interface StatItem {
  value: string;
  label: string;
}

interface AnimatedStatsStripProps {
  stats: StatItem[];
  className?: string;
}

export function AnimatedStatsStrip({ stats, className = "" }: AnimatedStatsStripProps) {
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    if (!("IntersectionObserver" in window)) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={containerRef}
      className={`border-t border-b border-[var(--color-border)] bg-[var(--color-surface)] py-8 px-4 ${className}`}
    >
      <div className="container grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
        {stats.map(({ value, label }, idx) => (
          <div
            key={label}
            className={`flex flex-col items-center justify-center p-5 border border-[var(--color-border)] bg-[var(--color-ink)] shadow-[0_18px_38px_-6px_rgba(0,0,0,0.9),0_8px_16px_-4px_rgba(0,0,0,0.8)] hover:-translate-y-1.5 hover:border-[var(--color-ochre)] hover:shadow-[0_24px_45px_-8px_rgba(212,168,63,0.3)] transition-all duration-300 relative group overflow-hidden ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
            style={{
              transitionDelay: `${idx * 130}ms`,
              transitionDuration: "600ms",
              transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
            }}
          >
            {/* Corner accent rivets */}
            <div className="absolute top-1 left-1 w-1 h-1 bg-[var(--color-border)] group-hover:bg-[var(--color-ochre)] transition-colors" />
            <div className="absolute top-1 right-1 w-1 h-1 bg-[var(--color-border)] group-hover:bg-[var(--color-ochre)] transition-colors" />
            <div className="absolute bottom-1 left-1 w-1 h-1 bg-[var(--color-border)] group-hover:bg-[var(--color-ochre)] transition-colors" />
            <div className="absolute bottom-1 right-1 w-1 h-1 bg-[var(--color-border)] group-hover:bg-[var(--color-ochre)] transition-colors" />

            <span className="font-[var(--font-display)] text-4xl md:text-5xl font-bold text-[var(--color-ochre)] group-hover:text-[var(--color-cream)] leading-none transition-colors duration-300">
              {value}
            </span>
            <span className="mt-2 text-[10px] font-mono uppercase tracking-widest text-[var(--color-text-dim)] group-hover:text-[var(--color-ivory)] transition-colors duration-300">
              {label}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}

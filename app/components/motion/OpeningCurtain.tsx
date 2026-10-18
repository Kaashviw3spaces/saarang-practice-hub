"use client";

import { useEffect, useState } from "react";
import { Zap, X } from "lucide-react";

export function OpeningCurtain() {
  const [visible, setVisible] = useState(false);
  const [animStep, setAnimStep] = useState(0);

  useEffect(() => {
    // Only run on first visit per session
    const hasSeen = sessionStorage.getItem("saarang_intro_seen");
    if (!hasSeen) {
      setVisible(true);
      sessionStorage.setItem("saarang_intro_seen", "true");

      const t1 = setTimeout(() => setAnimStep(1), 200);   // Draw frame
      const t2 = setTimeout(() => setAnimStep(2), 700);   // Reveal wordmark & wave
      const t3 = setTimeout(() => setAnimStep(3), 1800);  // Fade curtain
      const t4 = setTimeout(() => setVisible(false), 2400);

      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
        clearTimeout(t3);
        clearTimeout(t4);
      };
    }
  }, []);

  const handleSkip = () => {
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center bg-[var(--color-ink)] transition-opacity duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
        animStep >= 3 ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      {/* Skip button */}
      <button
        onClick={handleSkip}
        className="absolute top-6 right-6 z-10 flex items-center gap-1.5 text-xs uppercase tracking-widest text-[var(--color-ivory)]/70 hover:text-[var(--color-ivory)] transition-colors cursor-pointer"
      >
        <span>Skip</span>
        <X size={14} />
      </button>

      {/* Drawing Poster Double-Frame */}
      <div
        className={`relative w-[90vw] max-w-2xl p-10 md:p-14 border border-[var(--color-ivory)]/70 shadow-[inset_0_0_0_4px_var(--color-ink),inset_0_0_0_5px_rgba(238,230,213,0.4)] transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          animStep >= 1 ? "scale-100 opacity-100" : "scale-95 opacity-0"
        }`}
      >
        {/* Corner tour metadata */}
        <div className="flex justify-between items-center text-[10px] md:text-xs font-mono uppercase tracking-[0.25em] text-[var(--color-text-dim)] mb-6 border-b border-[var(--color-border)] pb-3">
          <span>SAARANG MUSIC HUB</span>
          <span className="flex items-center gap-1 text-[var(--color-ochre)]">
            <Zap size={11} /> LIVE SESSION REHEARSAL
          </span>
          <span>EST. 2026</span>
        </div>

        {/* Wordmark Reveal */}
        <div className="text-center overflow-hidden my-4">
          <p className="text-xs md:text-sm font-mono tracking-[0.3em] uppercase text-[var(--color-rust)] mb-1">
            Now Entering The Underground
          </p>
          <h1
            className={`font-[var(--font-display)] text-6xl md:text-8xl tracking-tight text-[var(--color-cream)] transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
              animStep >= 2 ? "translate-y-0" : "translate-y-full"
            }`}
          >
            SAARANG
          </h1>
        </div>

        {/* Fine Animated Soundwave */}
        <div
          className={`flex items-center justify-center gap-1 my-6 h-10 transition-opacity duration-500 ${
            animStep >= 2 ? "opacity-100" : "opacity-0"
          }`}
        >
          {[4, 12, 24, 38, 20, 8, 32, 40, 28, 14, 36, 18, 8, 28, 38, 16, 6, 22, 34, 12, 4].map(
            (height, i) => (
              <span
                key={i}
                className="w-1 bg-[var(--color-ivory)] rounded-full animate-soundwave"
                style={{
                  height: `${height}px`,
                  animationDelay: `${i * 0.05}s`,
                }}
              />
            )
          )}
        </div>

        {/* Footer headline */}
        <p
          className={`text-center font-[var(--font-display)] text-lg md:text-xl tracking-widest uppercase text-[var(--color-text-muted)] transition-opacity duration-500 ${
            animStep >= 2 ? "opacity-100" : "opacity-0"
          }`}
        >
          MAKE SOME NOISE · FIND YOUR SPACE
        </p>
      </div>
    </div>
  );
}

"use client";

import { useMemo } from "react";

interface StageAtmosphereProps {
  isOverdrive?: boolean;
}

export function StageAtmosphere({ isOverdrive = false }: StageAtmosphereProps) {
  // Pre-generate random ember particle trajectories for buttery performance
  const embers = useMemo(() => {
    return Array.from({ length: 18 }).map((_, i) => ({
      id: i,
      left: `${(i * 5.8 + 2.5) % 96}%`,
      size: `${(i % 3) * 1.5 + 2}px`,
      duration: `${4 + (i % 5) * 1.2}s`,
      delay: `${(i * 0.4) % 3}s`,
      drift: `${(i % 2 === 0 ? 1 : -1) * (15 + (i % 20))}px`,
    }));
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
      {/* ── CONCERT STAGE SPOTLIGHT 1 (Left Sweeper) ── */}
      <div
        className={`absolute -top-32 left-1/4 w-[45vw] max-w-[600px] h-[120vh] origin-top mix-blend-screen transition-opacity duration-700 ${
          isOverdrive ? "opacity-35" : "opacity-15"
        }`}
        style={{
          background: "conic-gradient(from 165deg at 50% 0%, transparent 0deg, rgba(212,168,63,0.22) 15deg, rgba(255,247,223,0.35) 22deg, rgba(184,76,45,0.25) 30deg, transparent 40deg)",
          filter: "blur(24px)",
          animation: "stageSpotlightLeft 12s ease-in-out infinite alternate",
        }}
      />

      {/* ── CONCERT STAGE SPOTLIGHT 2 (Right Sweeper) ── */}
      <div
        className={`absolute -top-32 right-1/4 w-[45vw] max-w-[600px] h-[120vh] origin-top mix-blend-screen transition-opacity duration-700 ${
          isOverdrive ? "opacity-35" : "opacity-15"
        }`}
        style={{
          background: "conic-gradient(from 155deg at 50% 0%, transparent 0deg, rgba(230,60,166,0.25) 15deg, rgba(255,247,223,0.3) 24deg, rgba(113,60,232,0.2) 32deg, transparent 42deg)",
          filter: "blur(28px)",
          animation: "stageSpotlightRight 14s ease-in-out infinite alternate",
        }}
      />

      {/* ── STADIUM PYRO EMBERS & ELECTRIC SPARKS ── */}
      {embers.map((em) => (
        <span
          key={em.id}
          className="absolute bottom-0 rounded-full"
          style={{
            left: em.left,
            width: em.size,
            height: em.size,
            backgroundColor: isOverdrive ? "var(--color-ochre)" : "var(--color-rust)",
            boxShadow: isOverdrive ? "0 0 8px #FFD700, 0 0 16px #FF4500" : "0 0 6px #B84C2D",
            animation: `emberRise ${em.duration} cubic-bezier(0.25, 1, 0.5, 1) infinite`,
            animationDelay: em.delay,
            opacity: 0,
          }}
        />
      ))}

      {/* Keyframes injected directly */}
      <style jsx>{`
        @keyframes stageSpotlightLeft {
          0% {
            transform: rotate(-18deg) scaleX(0.85);
          }
          50% {
            transform: rotate(4deg) scaleX(1.1);
          }
          100% {
            transform: rotate(22deg) scaleX(0.9);
          }
        }

        @keyframes stageSpotlightRight {
          0% {
            transform: rotate(20deg) scaleX(0.9);
          }
          50% {
            transform: rotate(-3deg) scaleX(1.15);
          }
          100% {
            transform: rotate(-24deg) scaleX(0.85);
          }
        }

        @keyframes emberRise {
          0% {
            transform: translateY(0) scale(0.6);
            opacity: 0;
          }
          15% {
            opacity: 0.85;
          }
          85% {
            opacity: 0.6;
          }
          100% {
            transform: translateY(-90vh) translateX(${isOverdrive ? "30px" : "-20px"}) scale(1.4);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}


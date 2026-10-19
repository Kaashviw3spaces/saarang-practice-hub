"use client";

import { useState } from "react";
import { Zap, Volume2, Sparkles, Radio } from "lucide-react";
import { rockSynth } from "@/lib/audio/rockSynth";

interface AmpOverdrivePedalProps {
  onOverdriveChange?: (active: boolean) => void;
  className?: string;
}

export function AmpOverdrivePedal({ onOverdriveChange, className = "" }: AmpOverdrivePedalProps) {
  const [isOverdrive, setIsOverdrive] = useState(false);
  const [isStrumming, setIsStrumming] = useState(false);

  const toggleOverdrive = () => {
    const nextState = !isOverdrive;
    setIsOverdrive(nextState);
    rockSynth.playStompClick();
    if (nextState) {
      rockSynth.playPowerChord(true);
    }
    if (onOverdriveChange) {
      onOverdriveChange(nextState);
    }
  };

  const handleTestRiff = () => {
    setIsStrumming(true);
    rockSynth.playPowerChord(isOverdrive);
    setTimeout(() => setIsStrumming(false), 800);
  };

  return (
    <div
      className={`inline-flex items-center gap-3 p-2 sm:p-2.5 bg-[var(--color-ink)]/95 border border-[var(--color-border)] shadow-[0_12px_28px_rgba(0,0,0,0.85),inset_0_0_0_1px_rgba(238,230,213,0.15)] rounded-none ${className}`}
    >
      {/* Jewel Pilot Lamp (Authentic Marshall Red Amp Lamp) */}
      <div className="flex items-center gap-2 pl-1.5">
        <div
          className={`relative h-4 w-4 rounded-full border border-black transition-all duration-300 ${
            isOverdrive
              ? "bg-[#FF2222] shadow-[0_0_16px_4px_#FF2222,inset_0_0_4px_#FFF] animate-pulse"
              : "bg-[#441111] shadow-[inset_0_0_3px_#000]"
          }`}
        >
          {/* Glass faceted highlight */}
          <div className="absolute top-0.5 left-0.5 h-1.5 w-1.5 rounded-full bg-white/60 pointer-events-none" />
        </div>
        <div className="flex flex-col text-left">
          <span className="text-[9px] font-mono uppercase tracking-[0.2em] text-[var(--color-text-dim)] leading-none">
            AMP TUBE
          </span>
          <span
            className={`text-[10px] font-mono uppercase font-bold tracking-wider leading-none mt-0.5 ${
              isOverdrive ? "text-[#FF4444]" : "text-[var(--color-text-dim)]"
            }`}
          >
            {isOverdrive ? "CRUNCH 11" : "STANDBY"}
          </span>
        </div>
      </div>

      <div className="h-6 w-px bg-[var(--color-border)]" />

      {/* Stomp Switch Button */}
      <button
        type="button"
        onClick={toggleOverdrive}
        className={`group relative flex items-center gap-2 px-3 py-1.5 text-xs font-mono uppercase font-bold tracking-widest cursor-pointer transition-all duration-200 border ${
          isOverdrive
            ? "bg-[var(--color-rust)] text-[var(--color-cream)] border-[var(--color-ochre)] shadow-[0_0_14px_rgba(184,76,45,0.6)]"
            : "bg-[var(--color-surface-2)] text-[var(--color-text-muted)] border-[var(--color-border)] hover:border-[var(--color-ivory)] hover:text-[var(--color-cream)]"
        }`}
        title="Toggle high-voltage tube overdrive and power chord synthesis"
      >
        <Zap
          size={13}
          className={`transition-transform duration-300 ${
            isOverdrive ? "text-[var(--color-ochre)] scale-110 rotate-12" : "text-[var(--color-text-dim)]"
          }`}
        />
        <span>{isOverdrive ? "OVERDRIVE ON" : "PUSH TO 11"}</span>
      </button>

      {/* Quick Riff Strum Button */}
      <button
        type="button"
        onClick={handleTestRiff}
        className={`flex items-center gap-1.5 px-2.5 py-1.5 text-[11px] font-mono uppercase tracking-wider text-[var(--color-cream)] bg-[var(--color-ink)] border border-[var(--color-border)] hover:border-[var(--color-ochre)] hover:text-[var(--color-ochre)] transition-all cursor-pointer ${
          isStrumming ? "scale-95 border-[var(--color-ochre)] text-[var(--color-ochre)]" : ""
        }`}
        title="Play an electric rock power chord"
      >
        <Volume2 size={12} className={isStrumming ? "animate-bounce" : ""} />
        <span>POWER CHORD</span>
      </button>
    </div>
  );
}


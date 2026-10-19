"use client";

import { useState } from "react";
import { AnalogVuMeter } from "@/components/motion/AnalogVuMeter";
import { Volume2, Zap, ChevronDown, ChevronUp } from "lucide-react";
import { rockSynth } from "@/lib/audio/rockSynth";

interface BottomRightVuDockProps {
  isOverdrive: boolean;
  onOverdriveChange: (overdrive: boolean) => void;
  className?: string;
}

export function BottomRightVuDock({
  isOverdrive,
  onOverdriveChange,
  className = "",
}: BottomRightVuDockProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleOverdrive = () => {
    rockSynth.initContext();
    rockSynth.playStompClick();
    onOverdriveChange(!isOverdrive);
  };

  return (
    <aside
      className={`fixed bottom-4 right-4 z-50 select-none transition-all duration-300 ${className}`}
      aria-label="Live Audio VU Meter Console"
    >
      {isCollapsed ? (
        // Minimal collapsed floating badge
        <button
          type="button"
          onClick={() => setIsCollapsed(false)}
          className="flex items-center gap-2 px-3 py-1.5 bg-[#12110F]/95 backdrop-blur-md border border-[#38332A] hover:border-[var(--color-ochre)] text-[var(--color-cream)] shadow-[0_10px_25px_rgba(0,0,0,0.9)] text-[10px] font-mono tracking-widest uppercase transition-all duration-200 group"
        >
          <Volume2 size={12} className="text-[var(--color-ochre)] group-hover:animate-pulse" />
          <span>VU METER</span>
          {isOverdrive && (
            <span className="text-[8px] px-1 py-0.2 bg-[var(--color-rust)] text-white font-bold rounded">
              DRIVE
            </span>
          )}
          <ChevronUp size={12} className="text-[#887F6E]" />
        </button>
      ) : (
        // Expanded minimal clean vintage VU meter dock
        <div className="w-56 sm:w-64 bg-[#12110F]/95 backdrop-blur-md border border-[#38332A] p-2.5 shadow-[0_16px_36px_rgba(0,0,0,0.95),0_0_20px_rgba(0,0,0,0.8)]">
          {/* Header Bar */}
          <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-[#25221B] text-[8px] font-mono tracking-widest text-[#9A8F7A]">
            <div className="flex items-center gap-1.5">
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  isOverdrive ? "bg-[var(--color-rust)] animate-ping" : "bg-[#4CAF50]"
                }`}
              />
              <span className="font-bold text-[var(--color-cream)]">LIVE ROOM VU</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[7px] text-[#706757] uppercase tracking-wider">
                CH 1-2
              </span>
              <button
                type="button"
                onClick={() => setIsCollapsed(true)}
                className="text-[#887F6E] hover:text-[var(--color-cream)] transition-colors p-0.5"
                title="Minimize VU Meter"
              >
                <ChevronDown size={11} />
              </button>
            </div>
          </div>

          {/* Minimal Analog VU Meter (Responsive to Background Audio) */}
          <AnalogVuMeter isOverdrive={isOverdrive} className="w-full" />

          {/* Minimal Bottom Control: Overdrive Switch */}
          <div className="mt-2 pt-1.5 border-t border-[#25221B] flex items-center justify-between">
            <span className="text-[7.5px] font-mono uppercase tracking-widest text-[#7D7362]">
              TUBE AMP DRIVE
            </span>
            <button
              type="button"
              onClick={toggleOverdrive}
              className={`flex items-center gap-1 px-2 py-0.5 rounded text-[8px] font-mono font-bold uppercase tracking-wider transition-all duration-200 border ${
                isOverdrive
                  ? "bg-[var(--color-rust)] border-[var(--color-rust)] text-[var(--color-cream)] shadow-[0_0_10px_rgba(184,76,45,0.7)]"
                  : "bg-[#1A1815] border-[#38332A] text-[#9E9480] hover:text-[var(--color-cream)] hover:border-[#554D3F]"
              }`}
            >
              <Zap size={9} className={isOverdrive ? "text-yellow-300 animate-bounce" : "text-[#777063]"} />
              <span>{isOverdrive ? "DRIVE: 11" : "DRIVE: OFF"}</span>
            </button>
          </div>
        </div>
      )}
    </aside>
  );
}

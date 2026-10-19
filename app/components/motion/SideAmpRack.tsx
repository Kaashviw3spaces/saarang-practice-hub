"use client";

import { AnalogVuMeter } from "@/components/motion/AnalogVuMeter";
import { AmpOverdrivePedal } from "@/components/motion/AmpOverdrivePedal";

interface SideAmpRackProps {
  isOverdrive: boolean;
  onOverdriveChange: (overdrive: boolean) => void;
  className?: string;
}

export function SideAmpRack({
  isOverdrive,
  onOverdriveChange,
  className = "",
}: SideAmpRackProps) {
  return (
    <aside
      className={`relative flex flex-col items-center p-3.5 bg-[#12110F] border-2 border-[#2E2A23] shadow-[0_25px_50px_rgba(0,0,0,0.95),inset_0_1px_0_rgba(255,255,255,0.08)] select-none transition-all duration-300 ${
        isOverdrive ? "border-[var(--color-rust)] shadow-[0_0_30px_rgba(184,76,45,0.4)]" : ""
      } ${className}`}
      aria-label="Stage Audio Control Rack"
    >
      {/* 4 Corner Rack Mount Screws */}
      <div className="absolute top-2 left-2 w-2.5 h-2.5 rounded-full bg-[#2A261F] border border-[#443E33] flex items-center justify-center text-[7px] text-[#887F6E]">
        +
      </div>
      <div className="absolute top-2 right-2 w-2.5 h-2.5 rounded-full bg-[#2A261F] border border-[#443E33] flex items-center justify-center text-[7px] text-[#887F6E]">
        +
      </div>
      <div className="absolute bottom-2 left-2 w-2.5 h-2.5 rounded-full bg-[#2A261F] border border-[#443E33] flex items-center justify-center text-[7px] text-[#887F6E]">
        +
      </div>
      <div className="absolute bottom-2 right-2 w-2.5 h-2.5 rounded-full bg-[#2A261F] border border-[#443E33] flex items-center justify-center text-[7px] text-[#887F6E]">
        +
      </div>

      {/* Top Brushed Faceplate Header */}
      <div className="w-full flex items-center justify-between pb-2 mb-2 border-b border-[#26231D] px-2 text-[8px] font-mono tracking-widest text-[#9A8F7A]">
        <div className="flex items-center gap-1.5">
          <span className={`w-1.5 h-1.5 rounded-full ${isOverdrive ? "bg-[var(--color-rust)] animate-ping" : "bg-[#4CAF50]"}`} />
          <span className="font-bold text-[var(--color-cream)]">STAGE RIG 01</span>
        </div>
        <span className="text-[7px] text-[#706757] uppercase tracking-wider">
          SOUND CONTROL
        </span>
      </div>

      {/* Module 1: Analog VU Meter (Responsive to Background Audio) */}
      <div className="w-full flex flex-col items-center">
        <div className="text-[7.5px] font-mono uppercase tracking-widest text-[#7D7362] mb-1 flex items-center justify-between w-full px-1">
          <span>ANALOG LEVEL</span>
          <span>CH 1-2</span>
        </div>
        <AnalogVuMeter isOverdrive={isOverdrive} className="w-full" />
      </div>

      {/* Rack Mount Horizontal Divider */}
      <div className="w-full my-3 border-t border-[#26231D] relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 px-2 bg-[#12110F] text-[7px] font-mono uppercase tracking-widest text-[#665D4D]">
          PATCH BAY
        </div>
      </div>

      {/* Module 2: Overdrive Stompbox Pedal */}
      <div className="w-full flex flex-col items-center">
        <div className="text-[7.5px] font-mono uppercase tracking-widest text-[#7D7362] mb-1 flex items-center justify-between w-full px-1">
          <span>OVERDRIVE PEDAL</span>
          <span className={isOverdrive ? "text-[var(--color-rust)] font-bold animate-pulse" : "text-[#7D7362]"}>
            {isOverdrive ? "HIGH GAIN" : "STANDBY"}
          </span>
        </div>
        <AmpOverdrivePedal onOverdriveChange={onOverdriveChange} />
      </div>

      {/* Bottom Chassis Stamped Spec */}
      <div className="w-full mt-3 pt-2 border-t border-[#221F1A] flex items-center justify-between text-[6.5px] font-mono text-[#615849] uppercase tracking-widest px-1">
        <span>SAARANG TUBE AMP</span>
        <span>8Ω LOAD // 100W</span>
      </div>
    </aside>
  );
}

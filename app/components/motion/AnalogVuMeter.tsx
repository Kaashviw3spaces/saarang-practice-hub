"use client";

import { useEffect, useState } from "react";

interface AnalogVuMeterProps {
  isOverdrive?: boolean;
  className?: string;
}

export function AnalogVuMeter({ isOverdrive = false, className = "" }: AnalogVuMeterProps) {
  const [needleAngle, setNeedleAngle] = useState(-32); // -40deg = -20dB, 0deg = 0dB, +25deg = +3dB

  useEffect(() => {
    let animFrame: number;
    let t = 0;

    const updateNeedle = () => {
      t += 0.08;
      // Spring needle physics with realistic rock dynamic range
      const baseAngle = isOverdrive ? 12 : -18;
      const jitterAmp = isOverdrive ? 18 : 9;
      const noise =
        Math.sin(t * 3.2) * (jitterAmp * 0.4) +
        Math.sin(t * 7.1) * (jitterAmp * 0.35) +
        Math.cos(t * 11.3) * (jitterAmp * 0.25);

      const target = Math.max(-38, Math.min(26, baseAngle + noise));
      setNeedleAngle(target);
      animFrame = requestAnimationFrame(updateNeedle);
    };

    animFrame = requestAnimationFrame(updateNeedle);
    return () => cancelAnimationFrame(animFrame);
  }, [isOverdrive]);

  return (
    <div
      className={`relative w-44 sm:w-52 h-24 bg-[#141311] border border-[var(--color-border)] p-2 shadow-[inset_0_0_12px_rgba(0,0,0,0.9),0_8px_20px_rgba(0,0,0,0.7)] select-none ${className}`}
    >
      {/* Vintage Backlit Dial Face */}
      <div className="relative w-full h-full overflow-hidden border border-[#2A2722] bg-gradient-to-b from-[#2B271F] via-[#1E1B15] to-[#12110E] flex flex-col justify-between p-1.5">
        {/* Incandescent Bulb Warm Backlight */}
        <div
          className={`absolute inset-0 pointer-events-none transition-opacity duration-500 ${
            isOverdrive ? "opacity-60 bg-[radial-gradient(circle_at_50%_80%,rgba(255,200,80,0.35),transparent_70%)]" : "opacity-30 bg-[radial-gradient(circle_at_50%_80%,rgba(212,168,63,0.25),transparent_70%)]"
          }`}
        />

        {/* Dial Scale Markings */}
        <div className="relative z-10 flex justify-between items-end px-3 text-[8px] font-mono tracking-tighter text-[#A89E88]">
          <span>-20</span>
          <span>-10</span>
          <span>-7</span>
          <span>-5</span>
          <span>-3</span>
          <span>-1</span>
          <span className="text-[var(--color-cream)] font-bold">0</span>
          <span className="text-[#FF5555] font-bold">+1</span>
          <span className="text-[#FF3333] font-bold">+3</span>
        </div>

        {/* Dial Scale Arc & Tick marks SVG */}
        <svg
          viewBox="0 0 160 55"
          className="absolute top-2 left-0 w-full h-full pointer-events-none z-10"
        >
          {/* Black scale arc */}
          <path
            d="M 20 48 A 75 75 0 0 1 115 22"
            fill="none"
            stroke="#8E8573"
            strokeWidth="1.2"
          />
          {/* Red +dB overdrive arc */}
          <path
            d="M 115 22 A 75 75 0 0 1 146 36"
            fill="none"
            stroke="#FF4444"
            strokeWidth="2.2"
          />
        </svg>

        {/* Mechanical Needle Pivot and Pointer */}
        <div className="absolute bottom-[-14px] left-1/2 -translate-x-1/2 z-20 pointer-events-none">
          {/* Pointer needle */}
          <div
            className="w-[1.5px] h-20 origin-bottom bg-gradient-to-t from-[#EAE0D0] via-[#D84C2D] to-[#FF2222] transition-transform duration-75 ease-out shadow-[0_0_3px_rgba(255,50,50,0.6)]"
            style={{ transform: `rotate(${needleAngle}deg)` }}
          />
          {/* Needle pivot brass cap */}
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-[#1A1815] border border-[#554D40] shadow-[0_0_6px_#000]" />
        </div>

        {/* Bottom Vintage Label */}
        <div className="relative z-10 flex justify-between items-center text-[7px] font-mono tracking-widest text-[#807663] pt-4">
          <span>VOLUME UNIT</span>
          <span className={isOverdrive ? "text-[#FF4444] font-bold animate-pulse" : "text-[#D4A83F]"}>
            {isOverdrive ? "PEAK +3dB" : "VU 0dB"}
          </span>
          <span>SAARANG 85</span>
        </div>
      </div>
    </div>
  );
}


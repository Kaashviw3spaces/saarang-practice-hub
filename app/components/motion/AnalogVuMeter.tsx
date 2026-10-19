"use client";

import { useEffect, useRef, useState } from "react";
import { Mic, MicOff } from "lucide-react";
import { rockSynth } from "@/lib/audio/rockSynth";

interface AnalogVuMeterProps {
  isOverdrive?: boolean;
  className?: string;
}

export function AnalogVuMeter({ isOverdrive = false, className = "" }: AnalogVuMeterProps) {
  const [needleAngle, setNeedleAngle] = useState(-34); // -38deg = -20dB, 0deg = 0dB, +25deg = +3dB
  const [isMicActive, setIsMicActive] = useState(false);
  const [micState, setMicState] = useState<"inactive" | "active" | "denied">("inactive");
  const [isPeakOverload, setIsPeakOverload] = useState(false);
  const [displayDb, setDisplayDb] = useState("-20");
  const angleRef = useRef(-34);

  // Toggle background microphone input
  const handleToggleMic = async () => {
    if (isMicActive) {
      rockSynth.disableMic();
      setIsMicActive(false);
      setMicState("inactive");
    } else {
      const res = await rockSynth.enableMic();
      if (res.success) {
        setIsMicActive(true);
        setMicState("active");
      } else {
        setIsMicActive(false);
        setMicState(res.state === "denied" ? "denied" : "inactive");
      }
    }
  };

  useEffect(() => {
    let animFrame: number;
    let t = 0;

    const updateNeedle = () => {
      t += 0.05;
      const audioLevel = rockSynth.getLiveAudioLevel();

      let targetAngle = -34;
      let calculatedDb = "-20";

      if (audioLevel.isMicActive || audioLevel.hasAudio) {
        // High-sensitivity mapping for room background audio & instruments
        // Combine peak and RMS for realistic ANSI VU ballistic meter response
        const responsiveLevel = Math.max(audioLevel.rms * 2.4, audioLevel.peak * 1.3);

        if (responsiveLevel < 0.015) {
          // Low room noise floor
          targetAngle = -35 + Math.sin(t * 1.5) * 1.2;
          calculatedDb = "-20";
        } else if (responsiveLevel < 0.08) {
          // Subtle room background noise / ambient sound (-15dB to -8dB)
          targetAngle = -28 + (responsiveLevel / 0.08) * 10;
          calculatedDb = "-10";
        } else if (responsiveLevel < 0.25) {
          // Speech / moderate music (-7dB to -2dB)
          targetAngle = -18 + ((responsiveLevel - 0.08) / 0.17) * 14;
          calculatedDb = "-3";
        } else if (responsiveLevel < 0.55) {
          // Loud speech, guitar pluck, loud music (-1dB to +1dB)
          targetAngle = -4 + ((responsiveLevel - 0.25) / 0.3) * 15;
          calculatedDb = "0";
        } else {
          // Heavy peak, power chord, loud clap, singing (+1dB to +3dB)
          targetAngle = 11 + Math.min(14, ((responsiveLevel - 0.55) / 0.45) * 14);
          calculatedDb = "+3";
        }

        // Extra kick if overdrive pedal is active
        if (isOverdrive) {
          targetAngle = Math.min(25, targetAngle + 6);
        }
      } else {
        // Fallback idle breath when no audio or mic is inactive
        const baseAngle = isOverdrive ? 10 : -22;
        const jitterAmp = isOverdrive ? 14 : 7;
        const noise =
          Math.sin(t * 2.8) * (jitterAmp * 0.45) +
          Math.sin(t * 6.2) * (jitterAmp * 0.35) +
          Math.cos(t * 9.7) * (jitterAmp * 0.2);
        targetAngle = baseAngle + noise;
        calculatedDb = isOverdrive ? "+2" : "-10";
      }

      // Constrain target within physical meter dial stops
      targetAngle = Math.max(-38, Math.min(25, targetAngle));

      // Realistic mechanical needle ballistics:
      // Rapid acceleration on transient attacks, smooth damping on releases
      const current = angleRef.current;
      const stepSpeed = targetAngle > current ? 0.36 : 0.09;
      const nextAngle = current + (targetAngle - current) * stepSpeed;
      angleRef.current = nextAngle;

      setNeedleAngle(nextAngle);
      setIsPeakOverload(nextAngle > 8);
      setDisplayDb(calculatedDb);

      animFrame = requestAnimationFrame(updateNeedle);
    };

    animFrame = requestAnimationFrame(updateNeedle);
    return () => cancelAnimationFrame(animFrame);
  }, [isOverdrive]);

  return (
    <div
      className={`relative w-48 sm:w-56 bg-[#141311] border border-[var(--color-border)] p-2 shadow-[inset_0_0_12px_rgba(0,0,0,0.9),0_8px_20px_rgba(0,0,0,0.7)] select-none ${className}`}
    >
      {/* Vintage Backlit Dial Face */}
      <div className="relative w-full h-24 overflow-hidden border border-[#2A2722] bg-gradient-to-b from-[#2B271F] via-[#1E1B15] to-[#12110E] flex flex-col justify-between p-1.5">
        {/* Incandescent Bulb Warm Backlight */}
        <div
          className={`absolute inset-0 pointer-events-none transition-opacity duration-500 ${
            isOverdrive || isPeakOverload
              ? "opacity-65 bg-[radial-gradient(circle_at_50%_80%,rgba(255,200,80,0.4),transparent_70%)]"
              : isMicActive
              ? "opacity-45 bg-[radial-gradient(circle_at_50%_80%,rgba(212,168,63,0.32),transparent_70%)]"
              : "opacity-25 bg-[radial-gradient(circle_at_50%_80%,rgba(212,168,63,0.18),transparent_70%)]"
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
          {/* Pointer needle with realistic physical glow */}
          <div
            className={`w-[1.5px] h-20 origin-bottom bg-gradient-to-t from-[#EAE0D0] via-[#D84C2D] to-[#FF2222] transition-transform duration-75 ease-out ${
              isPeakOverload ? "shadow-[0_0_6px_rgba(255,50,50,0.9)]" : "shadow-[0_0_2px_rgba(255,50,50,0.5)]"
            }`}
            style={{ transform: `rotate(${needleAngle}deg)` }}
          />
          {/* Needle pivot brass cap */}
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-[#1A1815] border border-[#554D40] shadow-[0_0_6px_#000]" />
        </div>

        {/* Bottom Vintage Label */}
        <div className="relative z-10 flex justify-between items-center text-[7px] font-mono tracking-widest text-[#807663] pt-4">
          <span>VOLUME UNIT</span>
          <span
            className={
              isPeakOverload
                ? "text-[#FF4444] font-bold animate-pulse"
                : isMicActive
                ? "text-[var(--color-ochre)] font-bold"
                : "text-[#807663]"
            }
          >
            {isPeakOverload ? `PEAK ${displayDb}dB` : `VU ${displayDb}dB`}
          </span>
          <span>SAARANG 85</span>
        </div>
      </div>

      {/* ── LIVE BACKGROUND AUDIO / MIC CONTROLLER BAR ── */}
      <div className="mt-1.5 pt-1.5 border-t border-[#26241F] flex items-center justify-between text-[8px] font-mono">
        <button
          type="button"
          onClick={handleToggleMic}
          className={`flex items-center gap-1 px-2 py-0.5 rounded border transition-colors ${
            isMicActive
              ? "bg-[var(--color-rust)]/20 border-[var(--color-rust)] text-[var(--color-cream)] hover:bg-[var(--color-rust)]/30"
              : "bg-[#1C1A17] border-[#38332A] text-[#9E9480] hover:text-[var(--color-cream)] hover:border-[#5A5243]"
          }`}
          title={isMicActive ? "Disable live microphone" : "Enable live microphone to move needle with room sound"}
        >
          {isMicActive ? (
            <>
              <Mic size={10} className="text-[#FF5555] animate-pulse" />
              <span className="font-bold text-[#FF9999]">MIC: LIVE</span>
            </>
          ) : (
            <>
              <MicOff size={10} className="text-[#777063]" />
              <span>{micState === "denied" ? "MIC: BLOCKED" : "MIC: STANDBY"}</span>
            </>
          )}
        </button>

        <span className="text-[7px] tracking-widest text-[#736B5C] uppercase">
          {isMicActive ? "LISTENING TO ROOM" : "CLICK MIC TO SYNC"}
        </span>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import {
  Zap,
  Volume2,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Radio,
  Sliders,
  Sparkles,
  Loader2,
} from "lucide-react";
import { CompatibilityAnalysis, SessionSetup } from "@/lib/compatibility/engine";
import { BackButton } from "@/components/ui/BackButton";

export default function CompatibilityPage() {
  const [sessionA, setSessionA] = useState<SessionSetup>({
    instrumentName: "Electric Guitar",
    category: "electric",
    routing: "headphones",
    hasPhysicalSound: false,
    isolationLevel: "semi",
    practiceObjective: "focus",
  });

  const [sessionB, setSessionB] = useState<SessionSetup>({
    instrumentName: "Acoustic Drums",
    category: "acoustic",
    routing: "amplifier_high",
    hasPhysicalSound: true,
    isolationLevel: "none",
    practiceObjective: "jam",
  });

  const [analysis, setAnalysis] = useState<CompatibilityAnalysis | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/compatibility", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionA, sessionB }),
      });
      const data = await res.json();
      setAnalysis(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="section min-h-[90vh] bg-[var(--color-ink)] text-[var(--color-cream)]">
      <div className="container flex flex-col gap-10 max-w-4xl mx-auto">
        <BackButton href="/" label="Home" />

        {/* Page Banner Header */}
        <div className="p-8 border border-[var(--color-ivory)]/40 bg-[var(--color-surface)] shadow-[inset_0_0_0_2px_var(--color-ink),inset_0_0_0_3px_rgba(238,230,213,0.25)] flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <span className="badge-tour badge-tour-magenta">
              <Zap size={12} /> AI ACOUSTIC ENGINE
            </span>
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[var(--color-text-dim)]">
              FREQUENCY INTERFERENCE RADAR
            </span>
          </div>

          <h1 className="font-[var(--font-display)] text-4xl sm:text-5xl md:text-6xl font-bold text-[var(--color-cream)] leading-none tracking-tight">
            INSTRUMENT RESONANCE & SETUP CHECKER
          </h1>
          <p className="text-xs md:text-sm text-[var(--color-text-muted)] max-w-2xl leading-relaxed">
            Analyze physical decibels, monitoring topology, and sound-wave bleed between two simultaneous
            musicians before stepping into the studio.
          </p>
        </div>

        {/* Dual Channel Strips (A vs B) */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Setup A (Channel Strip 1) */}
          <div className="p-6 bg-[var(--color-surface)] border border-[var(--color-border)] shadow-[inset_0_0_0_2px_var(--color-ink),inset_0_0_0_3px_rgba(238,230,213,0.15)] flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-[var(--color-border)] pb-3">
              <h2 className="font-[var(--font-display)] text-xl text-[var(--color-cream)] tracking-wider flex items-center gap-2">
                <Volume2 size={16} className="text-[var(--color-ochre)]" /> CHANNEL A // YOUR SETUP
              </h2>
              <span className="text-[9px] font-mono uppercase text-[var(--color-ochre)]">PRIMARY</span>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-mono uppercase tracking-widest text-[var(--color-text-dim)]">
                Selected Instrument
              </label>
              <input
                type="text"
                value={sessionA.instrumentName}
                onChange={(e) => setSessionA({ ...sessionA, instrumentName: e.target.value })}
                className="h-10 px-3 bg-[var(--color-ink)] border border-[var(--color-border)] font-mono text-xs uppercase text-[var(--color-cream)] focus:outline-none focus:border-[var(--color-ivory)]"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-mono uppercase tracking-widest text-[var(--color-text-dim)]">
                Monitoring Route
              </label>
              <select
                value={sessionA.routing}
                onChange={(e) => setSessionA({ ...sessionA, routing: e.target.value as SessionSetup["routing"] })}
                className="h-10 px-2 bg-[var(--color-ink)] border border-[var(--color-border)] font-mono text-xs uppercase text-[var(--color-cream)] focus:outline-none focus:border-[var(--color-ivory)] cursor-pointer"
              >
                <option value="headphones" className="bg-[var(--color-ink)]">Direct Headphones (Silent Monitoring)</option>
                <option value="amplifier_low" className="bg-[var(--color-ink)]">Low Volume Practice Amp</option>
                <option value="amplifier_high" className="bg-[var(--color-ink)]">Loud Stage Stack (High Decibel)</option>
                <option value="pa_system" className="bg-[var(--color-ink)]">Full PA Speaker System</option>
              </select>
            </div>

            <div className="flex items-center gap-2 pt-2 border-t border-[var(--color-border)]/60">
              <input
                type="checkbox"
                id="physA"
                checked={sessionA.hasPhysicalSound}
                onChange={(e) => setSessionA({ ...sessionA, hasPhysicalSound: e.target.checked })}
                className="h-4 w-4 accent-[var(--color-ochre)]"
              />
              <label htmlFor="physA" className="text-xs font-mono text-[var(--color-text-muted)] cursor-pointer">
                Produces unamplified physical sound (e.g. acoustic drums or belting vocals)
              </label>
            </div>
          </div>

          {/* Setup B (Channel Strip 2) */}
          <div className="p-6 bg-[var(--color-surface)] border border-[var(--color-border)] shadow-[inset_0_0_0_2px_var(--color-ink),inset_0_0_0_3px_rgba(238,230,213,0.15)] flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-[var(--color-border)] pb-3">
              <h2 className="font-[var(--font-display)] text-xl text-[var(--color-cream)] tracking-wider flex items-center gap-2">
                <Volume2 size={16} className="text-[var(--color-rust)]" /> CHANNEL B // PARALLEL OCCUPANT
              </h2>
              <span className="text-[9px] font-mono uppercase text-[var(--color-rust)]">ADJACENT</span>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-mono uppercase tracking-widest text-[var(--color-text-dim)]">
                Parallel Instrument
              </label>
              <input
                type="text"
                value={sessionB.instrumentName}
                onChange={(e) => setSessionB({ ...sessionB, instrumentName: e.target.value })}
                className="h-10 px-3 bg-[var(--color-ink)] border border-[var(--color-border)] font-mono text-xs uppercase text-[var(--color-cream)] focus:outline-none focus:border-[var(--color-ivory)]"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-mono uppercase tracking-widest text-[var(--color-text-dim)]">
                Monitoring Route
              </label>
              <select
                value={sessionB.routing}
                onChange={(e) => setSessionB({ ...sessionB, routing: e.target.value as SessionSetup["routing"] })}
                className="h-10 px-2 bg-[var(--color-ink)] border border-[var(--color-border)] font-mono text-xs uppercase text-[var(--color-cream)] focus:outline-none focus:border-[var(--color-ivory)] cursor-pointer"
              >
                <option value="headphones" className="bg-[var(--color-ink)]">Direct Headphones (Silent Monitoring)</option>
                <option value="amplifier_low" className="bg-[var(--color-ink)]">Low Volume Practice Amp</option>
                <option value="amplifier_high" className="bg-[var(--color-ink)]">Loud Stage Stack (High Decibel)</option>
                <option value="pa_system" className="bg-[var(--color-ink)]">Full PA Speaker System</option>
              </select>
            </div>

            <div className="flex items-center gap-2 pt-2 border-t border-[var(--color-border)]/60">
              <input
                type="checkbox"
                id="physB"
                checked={sessionB.hasPhysicalSound}
                onChange={(e) => setSessionB({ ...sessionB, hasPhysicalSound: e.target.checked })}
                className="h-4 w-4 accent-[var(--color-rust)]"
              />
              <label htmlFor="physB" className="text-xs font-mono text-[var(--color-text-muted)] cursor-pointer">
                Produces unamplified physical sound (e.g. acoustic drums or belting vocals)
              </label>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={handleAnalyze}
          disabled={loading}
          className="btn-rock-primary text-base py-3.5 shadow-[4px_4px_0_0_var(--color-rust)] w-full justify-center disabled:opacity-50"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <Loader2 size={16} className="animate-spin" />
              CALCULATING HARMONIC INTERFERENCE…
            </span>
          ) : (
            <span className="flex items-center gap-2">
              RUN ACOUSTIC COMPATIBILITY RADAR <ArrowRight size={16} />
            </span>
          )}
        </button>

        {/* Results Panel */}
        {analysis && (
          <div className="p-8 bg-[var(--color-surface)] border-2 border-[var(--color-ivory)] shadow-[inset_0_0_0_3px_var(--color-ink),inset_0_0_0_4px_rgba(238,230,213,0.3)] flex flex-col gap-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--color-border)] pb-4">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[var(--color-text-dim)] font-semibold">
                  AUDITED RESONANCE VERDICT
                </span>
                <h3 className="font-[var(--font-display)] text-3xl sm:text-4xl text-[var(--color-cream)] mt-1 flex items-center gap-2">
                  {analysis.level === "compatible" && (
                    <>
                      <CheckCircle2 className="text-[var(--color-available)]" size={26} /> FULLY COMPATIBLE
                    </>
                  )}
                  {analysis.level === "conditionally_compatible" && (
                    <>
                      <AlertTriangle className="text-[var(--color-ochre)]" size={26} /> CONDITIONALLY COMPATIBLE
                    </>
                  )}
                  {analysis.level === "incompatible" && (
                    <>
                      <ShieldAlert className="text-[var(--color-danger)]" size={26} /> HIGH ACOUSTIC CLASH RISK
                    </>
                  )}
                </h3>
              </div>

              <div className="bg-[var(--color-ink)] border border-[var(--color-border)] p-3 text-right">
                <span className="font-[var(--font-display)] text-4xl font-bold text-[var(--color-ochre)] leading-none block">
                  {analysis.score}
                </span>
                <span className="text-[9px] font-mono uppercase tracking-widest text-[var(--color-text-dim)]">
                  HARMONY INDEX
                </span>
              </div>
            </div>

            <p className="text-sm font-mono text-[var(--color-cream)] leading-relaxed">
              {analysis.summary}
            </p>

            <div className="grid md:grid-cols-2 gap-6 pt-2">
              <div className="bg-[var(--color-ink)] border border-[var(--color-border)] p-4">
                <h4 className="text-[10px] font-mono uppercase tracking-widest text-[var(--color-ochre)] mb-3">
                  ACOUSTIC FACTOR BREAKDOWN
                </h4>
                <ul className="flex flex-col gap-2 font-mono text-xs text-[var(--color-text-muted)]">
                  {analysis.reasons.map((r, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-[var(--color-rust)]">•</span> {r}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-[var(--color-ink)] border border-[var(--color-border)] p-4">
                <h4 className="text-[10px] font-mono uppercase tracking-widest text-[var(--color-available)] mb-3">
                  AI STAGE DIRECTIVES
                </h4>
                <ul className="flex flex-col gap-2 font-mono text-xs text-[var(--color-text-muted)]">
                  {analysis.recommendations.map((rec, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-[var(--color-available)]">✓</span> {rec}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

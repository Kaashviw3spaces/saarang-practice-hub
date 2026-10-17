"use client";

import { useState } from "react";
import { Zap, Volume2, ShieldAlert, CheckCircle2, AlertTriangle, ArrowRight } from "lucide-react";
import { CompatibilityAnalysis, SessionSetup } from "@/lib/compatibility/engine";

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
    <div className="section min-h-[90vh]">
      <div className="container flex flex-col gap-8 max-w-4xl mx-auto">
        <div className="flex flex-col gap-2">
          <div className="inline-flex items-center gap-2 rounded-[var(--radius-full)] border border-[var(--color-accent)]/30 bg-[var(--color-accent)]/10 px-3 py-1 text-xs font-semibold text-[var(--color-accent)] w-fit">
            <Zap size={14} /> AI Acoustic Intelligence
          </div>
          <h1 className="font-[var(--font-display)] text-3xl md:text-4xl font-bold text-[var(--color-text)]">
            Instrument & Setup Compatibility Checker
          </h1>
          <p className="text-sm text-[var(--color-text-muted)]">
            Analyze physical sound levels, monitoring routes, and acoustic bleed between two simultaneous practice setups before booking.
          </p>
        </div>

        {/* Input setups */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Setup A */}
          <div className="card flex flex-col gap-4">
            <h2 className="font-semibold text-[var(--color-text)] flex items-center gap-2">
              <Volume2 size={18} className="text-[var(--color-accent)]" /> Your Setup (Musician A)
            </h2>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-[var(--color-text-muted)] font-medium">Instrument</label>
              <input
                type="text"
                value={sessionA.instrumentName}
                onChange={(e) => setSessionA({ ...sessionA, instrumentName: e.target.value })}
                className="h-9 px-3 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface-2)] text-sm text-[var(--color-text)]"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-[var(--color-text-muted)] font-medium">Monitoring / Audio Routing</label>
              <select
                value={sessionA.routing}
                onChange={(e) => setSessionA({ ...sessionA, routing: e.target.value as SessionSetup["routing"] })}
                className="h-9 px-2 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface-2)] text-sm text-[var(--color-text)]"
              >
                <option value="headphones">Direct Headphones (Silent Monitoring)</option>
                <option value="amplifier_low">Low Volume Amp</option>
                <option value="amplifier_high">Loud Amp / Stage Stack</option>
                <option value="pa_system">Full PA Speaker System</option>
              </select>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <input
                type="checkbox"
                id="physA"
                checked={sessionA.hasPhysicalSound}
                onChange={(e) => setSessionA({ ...sessionA, hasPhysicalSound: e.target.checked })}
                className="h-4 w-4"
              />
              <label htmlFor="physA" className="text-xs text-[var(--color-text-muted)]">
                Produces loud physical sound (e.g. acoustic drums or belting vocals)
              </label>
            </div>
          </div>

          {/* Setup B */}
          <div className="card flex flex-col gap-4">
            <h2 className="font-semibold text-[var(--color-text)] flex items-center gap-2">
              <Volume2 size={18} className="text-[var(--color-secondary)]" /> Session Occupant Setup (Musician B)
            </h2>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-[var(--color-text-muted)] font-medium">Instrument</label>
              <input
                type="text"
                value={sessionB.instrumentName}
                onChange={(e) => setSessionB({ ...sessionB, instrumentName: e.target.value })}
                className="h-9 px-3 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface-2)] text-sm text-[var(--color-text)]"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-[var(--color-text-muted)] font-medium">Monitoring / Audio Routing</label>
              <select
                value={sessionB.routing}
                onChange={(e) => setSessionB({ ...sessionB, routing: e.target.value as SessionSetup["routing"] })}
                className="h-9 px-2 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface-2)] text-sm text-[var(--color-text)]"
              >
                <option value="headphones">Direct Headphones (Silent Monitoring)</option>
                <option value="amplifier_low">Low Volume Amp</option>
                <option value="amplifier_high">Loud Amp / Stage Stack</option>
                <option value="pa_system">Full PA Speaker System</option>
              </select>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <input
                type="checkbox"
                id="physB"
                checked={sessionB.hasPhysicalSound}
                onChange={(e) => setSessionB({ ...sessionB, hasPhysicalSound: e.target.checked })}
                className="h-4 w-4"
              />
              <label htmlFor="physB" className="text-xs text-[var(--color-text-muted)]">
                Produces loud physical sound (e.g. acoustic drums or belting vocals)
              </label>
            </div>
          </div>
        </div>

        <button
          onClick={handleAnalyze}
          disabled={loading}
          className="h-11 rounded-[var(--radius-full)] bg-[var(--color-accent)] text-sm font-semibold text-[var(--color-background)] hover:bg-[var(--color-accent-dim)] transition-colors flex items-center justify-center gap-2 cursor-pointer"
        >
          {loading ? "Analyzing Acoustics…" : "Run Acoustic Compatibility Check"}
          <ArrowRight size={16} />
        </button>

        {/* Results view */}
        {analysis && (
          <div className="card flex flex-col gap-5 border-[var(--color-border)] bg-[var(--color-surface-2)]">
            <div className="flex items-center justify-between border-b border-[var(--color-border)] pb-4">
              <div>
                <span className="text-xs uppercase tracking-widest text-[var(--color-text-dim)] font-semibold">
                  Compatibility Status
                </span>
                <h3 className="font-[var(--font-display)] text-2xl font-bold text-[var(--color-text)] mt-1 flex items-center gap-2">
                  {analysis.level === "compatible" && (
                    <>
                      <CheckCircle2 className="text-[var(--color-success)]" size={24} /> Fully Compatible
                    </>
                  )}
                  {analysis.level === "conditionally_compatible" && (
                    <>
                      <AlertTriangle className="text-[var(--color-warning)]" size={24} /> Conditionally Compatible
                    </>
                  )}
                  {analysis.level === "incompatible" && (
                    <>
                      <ShieldAlert className="text-[var(--color-danger)]" size={24} /> Incompatible Setup
                    </>
                  )}
                </h3>
              </div>
              <div className="text-right">
                <span className="text-3xl font-black text-[var(--color-accent)]">
                  {analysis.score}
                </span>
                <span className="text-xs text-[var(--color-text-muted)] block">/ 100 Harmony</span>
              </div>
            </div>

            <p className="text-sm font-medium text-[var(--color-text)]">
              {analysis.summary}
            </p>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h4 className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider mb-2">
                  Identified Acoustic Factors
                </h4>
                <ul className="flex flex-col gap-1.5">
                  {analysis.reasons.map((r, idx) => (
                    <li key={idx} className="text-xs text-[var(--color-text-muted)] leading-relaxed flex items-start gap-1.5">
                      <span className="text-[var(--color-accent)]">•</span> {r}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider mb-2">
                  AI Recommendations
                </h4>
                <ul className="flex flex-col gap-1.5">
                  {analysis.recommendations.map((rec, idx) => (
                    <li key={idx} className="text-xs text-[var(--color-text-muted)] leading-relaxed flex items-start gap-1.5">
                      <span className="text-[var(--color-success)]">✓</span> {rec}
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

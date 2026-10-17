export type AcousticCategory = "acoustic" | "electric" | "electronic";

export type AudioRouting = "headphones" | "amplifier_low" | "amplifier_high" | "pa_system";

export interface SessionSetup {
  instrumentName: string;
  category: AcousticCategory;
  routing: AudioRouting;
  hasPhysicalSound: boolean;
  isolationLevel: "none" | "semi" | "full";
  practiceObjective: "focus" | "casual" | "jam";
}

export type CompatibilityResultLevel =
  | "compatible"
  | "conditionally_compatible"
  | "incompatible"
  | "insufficient_info";

export interface CompatibilityAnalysis {
  level: CompatibilityResultLevel;
  score: number; // 0 (unusable) to 100 (perfect harmony)
  summary: string;
  reasons: string[];
  recommendations: string[];
}

/**
 * Deterministic rules engine analyzing two sessions in the same physical space.
 */
export function analyzeCompatibility(
  sessionA: SessionSetup,
  sessionB: SessionSetup
): CompatibilityAnalysis {
  const reasons: string[] = [];
  const recommendations: string[] = [];
  let score = 100;

  // Rule 1: High-noise physical sound clashes with focus sessions
  const aIsLoud = sessionA.hasPhysicalSound || sessionA.routing === "amplifier_high" || sessionA.routing === "pa_system";
  const bIsLoud = sessionB.hasPhysicalSound || sessionB.routing === "amplifier_high" || sessionB.routing === "pa_system";

  if (aIsLoud && sessionB.practiceObjective === "focus") {
    score -= 60;
    reasons.push(
      `${sessionA.instrumentName} generates physical acoustic volume that conflicts with focused, concentration-heavy practice.`
    );
    recommendations.push("Consider reserving a fully soundproofed room (e.g. Studio A) or practicing during quiet hours.");
  }

  if (bIsLoud && sessionA.practiceObjective === "focus") {
    score -= 60;
    reasons.push(
      `${sessionB.instrumentName} creates background acoustic sound interfering with ${sessionA.instrumentName} focus.`
    );
    recommendations.push("Recommend scheduling individual focused vocal/acoustic parts in the Recording Booth.");
  }

  // Rule 2: Both using headphone monitoring
  if (sessionA.routing === "headphones" && sessionB.routing === "headphones") {
    if (!sessionA.hasPhysicalSound && !sessionB.hasPhysicalSound) {
      score = 98;
      reasons.push("Both setups utilize direct headphone monitoring without physical noise spill.");
      recommendations.push("Ideal for simultaneous collaborative practice in any space.");
    } else {
      score -= 20;
      reasons.push("Headphones minimize monitored audio, but residual mechanical/physical instrument vibration remains audible.");
      recommendations.push("Position stations on opposite sides of the room.");
    }
  }

  // Rule 3: Vocal practice + amplified instruments
  const isVocal = (name: string) => name.toLowerCase().includes("vocal") || name.toLowerCase().includes("voice");
  if ((isVocal(sessionA.instrumentName) && bIsLoud) || (isVocal(sessionB.instrumentName) && aIsLoud)) {
    score -= 40;
    reasons.push("Microphone pickup risks bleed and feedback loop from nearby amplified speakers.");
    recommendations.push("Aim directional microphones away from amplifiers or practice in separate rooms.");
  }

  // Rule 4: Drums in shared room
  const isDrums = (s: SessionSetup) => s.instrumentName.toLowerCase().includes("drum") && s.category === "acoustic";
  if (isDrums(sessionA) || isDrums(sessionB)) {
    score -= 50;
    reasons.push("Acoustic drums have high SPL (>100dB) that cannot be attenuated with headphones.");
    recommendations.push("Only compatible with ensemble rehearsals or musicians with high noise tolerance.");
  }

  // Determine overall compatibility status
  let level: CompatibilityResultLevel = "compatible";
  if (score < 40) {
    level = "incompatible";
  } else if (score < 75) {
    level = "conditionally_compatible";
  }

  let summary = "Both setups can share this practice session comfortably.";
  if (level === "conditionally_compatible") {
    summary = "Compatible under specific volume and placement conditions.";
  } else if (level === "incompatible") {
    summary = "High probability of severe acoustic interference.";
  }

  return {
    level,
    score: Math.max(0, score),
    summary,
    reasons: reasons.length > 0 ? reasons : ["No significant acoustic conflicts detected."],
    recommendations: recommendations.length > 0 ? recommendations : ["Standard room arrangement is sufficient."],
  };
}

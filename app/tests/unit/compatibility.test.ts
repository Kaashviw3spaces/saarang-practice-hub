import assert from "node:assert";
import { analyzeCompatibility, SessionSetup } from "../../lib/compatibility/engine";

console.log("▶ Running Unit Test: analyzeCompatibility");

// Test 1: Both headphones, no physical noise -> compatible
{
  const a: SessionSetup = {
    instrumentName: "Electric Guitar",
    category: "electric",
    routing: "headphones",
    hasPhysicalSound: false,
    isolationLevel: "semi",
    practiceObjective: "focus",
  };
  const b: SessionSetup = {
    instrumentName: "Synthesizer",
    category: "electronic",
    routing: "headphones",
    hasPhysicalSound: false,
    isolationLevel: "none",
    practiceObjective: "jam",
  };

  const res = analyzeCompatibility(a, b);
  assert.strictEqual(res.level, "compatible", "Silent headphone monitoring should be compatible");
  assert.ok(res.score >= 90, "Score should be > 90");
}

// Test 2: Acoustic drums + focused practice -> incompatible
{
  const a: SessionSetup = {
    instrumentName: "Acoustic Drums",
    category: "acoustic",
    routing: "amplifier_high",
    hasPhysicalSound: true,
    isolationLevel: "none",
    practiceObjective: "jam",
  };
  const b: SessionSetup = {
    instrumentName: "Vocal Techniques",
    category: "acoustic",
    routing: "headphones",
    hasPhysicalSound: true,
    isolationLevel: "semi",
    practiceObjective: "focus",
  };

  const res = analyzeCompatibility(a, b);
  assert.strictEqual(res.level, "incompatible", "Acoustic drums with focused vocals must be flagged incompatible");
  assert.ok(res.score < 40, "Score should be < 40");
  assert.ok(res.reasons.length > 0, "Must provide clear reasons");
  assert.ok(res.recommendations.length > 0, "Must provide actionable recommendations");
}

console.log("✅ All Music Intelligence Compatibility unit tests passed!");


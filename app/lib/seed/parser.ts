import fs from "fs";
import path from "path";
import { Room } from "@/types";

export interface SeedInstrument {
  name: string;
  category: "acoustic" | "electric" | "electronic";
  baseNoiseLevelDb: number;
  physicalSound: boolean;
}

export interface ParsedSeedData {
  rooms: Room[];
  instruments: SeedInstrument[];
}

export function parseSeedSql(): ParsedSeedData {
  const possiblePaths = [
    path.resolve(process.cwd(), "../supabase/seed.sql"),
    path.resolve(process.cwd(), "supabase/seed.sql"),
    path.resolve(process.cwd(), "../../supabase/seed.sql"),
    "/Users/kashvi/Saarang-Practice-Hub/supabase/seed.sql",
  ];

  let content = "";
  for (const p of possiblePaths) {
    try {
      if (fs.existsSync(/* turbopackIgnore: true */ p)) {
        content = fs.readFileSync(/* turbopackIgnore: true */ p, "utf-8");
        break;
      }
    } catch {
      // Ignore read errors and try next path
    }
  }

  const rooms: Room[] = [];
  const instruments: SeedInstrument[] = [];

  if (!content) {
    return { rooms, instruments };
  }

  // Parse rooms block:
  // INSERT INTO public.rooms (name, description, capacity, status, acoustic_properties) VALUES ...
  const roomsMatch = content.match(
    /INSERT\s+INTO\s+public\.rooms\s*\([^)]+\)\s*VALUES\s*([\s\S]*?)(?:ON\s+CONFLICT|;)/i
  );

  if (roomsMatch && roomsMatch[1]) {
    const valuesBlock = roomsMatch[1];
    // Split on tuple boundaries: each tuple is enclosed in parentheses (...),
    // Match each: ('name', 'description', capacity, 'status', 'acoustic_properties')
    const tupleRegex = /\(\s*'([^']*(?:''[^']*)*)'\s*,\s*'([^']*(?:''[^']*)*)'\s*,\s*(\d+)\s*,\s*'([^']*(?:''[^']*)*)'\s*,\s*'([^']*(?:''[^']*)*)'\s*\)/g;
    
    let match: RegExpExecArray | null;
    while ((match = tupleRegex.exec(valuesBlock)) !== null) {
      const name = match[1].replace(/''/g, "'").trim();
      const description = match[2].replace(/''/g, "'").trim();
      const capacity = parseInt(match[3], 10);
      const status = match[4].trim() as Room["status"];
      const acousticProperties = match[5].replace(/''/g, "'").trim();

      // Skip excluded rooms (like electronics corner)
      if (name.toLowerCase().includes("electronics corner")) {
        continue;
      }

      // Infer default equipment based on room description / name
      const equipment: string[] = [];
      const lowerDesc = (description + " " + name).toLowerCase();
      if (lowerDesc.includes("drum") || lowerDesc.includes("drums")) equipment.push("Drums");
      if (lowerDesc.includes("drum pad")) equipment.push("Drum Pads");
      if (lowerDesc.includes("amplifier") || lowerDesc.includes("amp")) equipment.push("Amplifiers");
      if (lowerDesc.includes("piano")) equipment.push("Piano");
      if (lowerDesc.includes("synth") || lowerDesc.includes("keyboard")) equipment.push("Keyboard");
      if (lowerDesc.includes("vocal")) equipment.push("Studio Mics");
      if (lowerDesc.includes("recording")) equipment.push("Audio Interface");
      if (lowerDesc.includes("jam")) equipment.push("PA System");

      rooms.push({
        id: "seed-" + name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        name,
        description,
        capacity,
        status: status || "available",
        acousticProperties,
        equipment: equipment.length > 0 ? equipment : ["PA System", "Music Stands"],
      });
    }
  }

  // Parse instruments block:
  // INSERT INTO public.instruments (name, category, base_noise_level_db, physical_sound_even_with_headphones) VALUES ...
  const instMatch = content.match(
    /INSERT\s+INTO\s+public\.instruments\s*\([^)]+\)\s*VALUES\s*([\s\S]*?)(?:ON\s+CONFLICT|;)/i
  );

  if (instMatch && instMatch[1]) {
    const valuesBlock = instMatch[1];
    const instTupleRegex = /\(\s*'([^']*(?:''[^']*)*)'\s*,\s*'([^']*(?:''[^']*)*)'\s*,\s*(\d+)\s*,\s*(true|false)\s*\)/gi;
    
    let match: RegExpExecArray | null;
    while ((match = instTupleRegex.exec(valuesBlock)) !== null) {
      const name = match[1].replace(/''/g, "'").trim();
      const category = match[2].trim().toLowerCase() as SeedInstrument["category"];
      const baseNoiseLevelDb = parseInt(match[3], 10);
      const physicalSound = match[4].toLowerCase() === "true";

      instruments.push({
        name,
        category,
        baseNoiseLevelDb,
        physicalSound,
      });
    }
  }

  return { rooms, instruments };
}

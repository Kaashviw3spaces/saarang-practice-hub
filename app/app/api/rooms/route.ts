import { NextResponse } from "next/server";
import { parseSeedSql } from "@/lib/seed/parser";

export async function GET() {
  try {
    const seedData = parseSeedSql();
    return NextResponse.json(seedData, {
      headers: {
        "Cache-Control": "no-store, max-age=0",
      },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to parse seed.sql";
    return NextResponse.json({ error: message, rooms: [], instruments: [] }, { status: 500 });
  }
}


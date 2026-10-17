import { NextResponse } from "next/server";
import { analyzeCompatibility, SessionSetup } from "@/lib/compatibility/engine";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { sessionA, sessionB } = body as { sessionA: SessionSetup; sessionB: SessionSetup };

    if (!sessionA || !sessionB) {
      return NextResponse.json(
        { error: "Both sessionA and sessionB setups are required" },
        { status: 400 }
      );
    }

    const analysis = analyzeCompatibility(sessionA, sessionB);

    return NextResponse.json(analysis);
  } catch {
    return NextResponse.json(
      { error: "Failed to perform compatibility analysis" },
      { status: 500 }
    );
  }
}


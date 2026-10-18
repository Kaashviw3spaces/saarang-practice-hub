import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { bookingId, action, source } = await request.json();

    if (!bookingId || !action) {
      return NextResponse.json(
        { error: "bookingId and action (check_in | check_out) are required." },
        { status: 400 }
      );
    }

    const event = {
      id: crypto.randomUUID(),
      bookingId,
      action,
      source: source || "qr_scan",
      timestamp: new Date().toISOString(),
      confidence: 1.0,
    };

    return NextResponse.json({
      success: true,
      message: action === "check_in" ? "Checked in successfully!" : "Checked out successfully!",
      event,
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to record occupancy check-in/out." },
      { status: 500 }
    );
  }
}


import { NextRequest, NextResponse } from "next/server";
import { recordInteractionEvent } from "@/lib/tracking/tracker";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { submissionId, eventType, metadata } = body;

    if (!submissionId || !eventType) {
      return NextResponse.json({ error: "Missing submissionId or eventType" }, { status: 400 });
    }

    const validEvents = ["video_played", "download_clicked", "download_started", "processing_failed"];
    if (!validEvents.includes(eventType)) {
      return NextResponse.json({ error: "Invalid eventType" }, { status: 400 });
    }

    await recordInteractionEvent(submissionId, eventType, metadata);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[Track Event Error]:", err);
    return NextResponse.json({ error: "Failed to record event" }, { status: 500 });
  }
}

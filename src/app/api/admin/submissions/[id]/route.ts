import { NextRequest, NextResponse } from "next/server";
import { isAuthenticatedAdmin } from "@/lib/admin/auth";
import { client, ensureDbInitialized } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const isAuth = await isAuthenticatedAdmin(request);
  if (!isAuth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  if (!id) {
    return NextResponse.json({ error: "ID is required" }, { status: 400 });
  }

  await ensureDbInitialized();

  try {
    const subResult = await client.execute({
      sql: `SELECT * FROM submissions WHERE id = ? LIMIT 1`,
      args: [id],
    });

    const submission = subResult.rows[0];
    if (!submission) {
      return NextResponse.json({ error: "Submission not found" }, { status: 404 });
    }

    const eventsResult = await client.execute({
      sql: `SELECT * FROM interaction_events WHERE submission_id = ? ORDER BY timestamp ASC`,
      args: [id],
    });

    return NextResponse.json({
      submission,
      events: eventsResult.rows,
    });
  } catch (err: any) {
    console.error("[Get Submission Detail Error]:", err);
    return NextResponse.json({ error: "Failed to fetch submission detail" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const isAuth = await isAuthenticatedAdmin(request);
  if (!isAuth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  if (!id) {
    return NextResponse.json({ error: "ID is required" }, { status: 400 });
  }

  await ensureDbInitialized();

  try {
    await client.execute({
      sql: `DELETE FROM interaction_events WHERE submission_id = ?`,
      args: [id],
    });

    await client.execute({
      sql: `DELETE FROM submissions WHERE id = ?`,
      args: [id],
    });

    return NextResponse.json({ success: true, message: "Record deleted" });
  } catch (err: any) {
    console.error("[Delete Submission Error]:", err);
    return NextResponse.json({ error: "Failed to delete submission" }, { status: 500 });
  }
}

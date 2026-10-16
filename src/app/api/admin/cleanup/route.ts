import { NextRequest, NextResponse } from "next/server";
import { isAuthenticatedAdmin } from "@/lib/admin/auth";
import { client, ensureDbInitialized } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const isAuth = await isAuthenticatedAdmin(request);
  if (!isAuth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await ensureDbInitialized();

  try {
    const body = await request.json();
    const days = Math.max(1, parseInt(body?.days || process.env.ANALYTICS_RETENTION_DAYS || "90", 10));
    const cutoffTimestamp = Date.now() - days * 24 * 60 * 60 * 1000;

    // Delete associated interaction events first
    await client.execute({
      sql: `
        DELETE FROM interaction_events
        WHERE timestamp < ? OR submission_id IN (
          SELECT id FROM submissions WHERE created_at < ?
        )
      `,
      args: [cutoffTimestamp, cutoffTimestamp],
    });

    // Delete submissions
    const deleteSubmissionsResult = await client.execute({
      sql: `DELETE FROM submissions WHERE created_at < ?`,
      args: [cutoffTimestamp],
    });

    return NextResponse.json({
      success: true,
      message: `Cleaned up records older than ${days} days.`,
      deletedCount: deleteSubmissionsResult.rowsAffected || 0,
    });
  } catch (err: any) {
    console.error("[Admin Cleanup Error]:", err);
    return NextResponse.json({ error: "Failed to perform database cleanup" }, { status: 500 });
  }
}

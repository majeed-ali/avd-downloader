import { NextRequest, NextResponse } from "next/server";
import { isAuthenticatedAdmin } from "@/lib/admin/auth";
import { client, ensureDbInitialized } from "@/lib/db";

export const dynamic = "force-dynamic";

function escapeCsvValue(val: unknown): string {
  if (val === null || val === undefined) return "";
  const str = String(val);
  if (str.includes(",") || str.includes('"') || str.includes("\n") || str.includes("\r")) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

export async function GET(request: NextRequest) {
  const isAuth = await isAuthenticatedAdmin(request);
  if (!isAuth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await ensureDbInitialized();

  const searchParams = request.nextUrl.searchParams;
  const platform = searchParams.get("platform");
  const status = searchParams.get("status");
  const country = searchParams.get("country");

  const whereClauses: string[] = [];
  const args: any[] = [];

  if (platform && platform !== "all") {
    whereClauses.push("platform = ?");
    args.push(platform);
  }
  if (status && status !== "all") {
    whereClauses.push("status = ?");
    args.push(status);
  }
  if (country && country !== "all") {
    whereClauses.push("country = ?");
    args.push(country);
  }

  const whereSql = whereClauses.length > 0 ? `WHERE ${whereClauses.join(" AND ")}` : "";

  try {
    const query = `
      SELECT
        id,
        datetime(created_at / 1000, 'unixepoch') as submission_time_utc,
        platform,
        tool,
        status,
        video_title,
        original_url,
        normalized_url,
        country,
        city,
        ip_address,
        device_type,
        browser,
        os,
        locale,
        processing_duration_ms,
        error_category,
        error_message
      FROM submissions
      ${whereSql}
      ORDER BY created_at DESC
      LIMIT 10000
    `;

    const result = await client.execute({ sql: query, args });

    const headers = [
      "ID",
      "Submission Time (UTC)",
      "Platform",
      "Tool",
      "Status",
      "Video Title",
      "Original URL",
      "Normalized URL",
      "Country",
      "City",
      "IP Address",
      "Device",
      "Browser",
      "OS",
      "Locale",
      "Duration (ms)",
      "Error Category",
      "Error Message",
    ];

    const rows = [headers.join(",")];

    for (const r of result.rows) {
      const row = [
        escapeCsvValue(r.id),
        escapeCsvValue(r.submission_time_utc),
        escapeCsvValue(r.platform),
        escapeCsvValue(r.tool),
        escapeCsvValue(r.status),
        escapeCsvValue(r.video_title),
        escapeCsvValue(r.original_url),
        escapeCsvValue(r.normalized_url),
        escapeCsvValue(r.country),
        escapeCsvValue(r.city),
        escapeCsvValue(r.ip_address),
        escapeCsvValue(r.device_type),
        escapeCsvValue(r.browser),
        escapeCsvValue(r.os),
        escapeCsvValue(r.locale),
        escapeCsvValue(r.processing_duration_ms),
        escapeCsvValue(r.error_category),
        escapeCsvValue(r.error_message),
      ];
      rows.push(row.join(","));
    }

    const csvContent = rows.join("\r\n");
    const filename = `avd-submissions-${new Date().toISOString().split("T")[0]}.csv`;

    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (err: any) {
    console.error("[Export CSV Error]:", err);
    return NextResponse.json({ error: "Failed to export CSV" }, { status: 500 });
  }
}

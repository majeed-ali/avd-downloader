import { NextRequest, NextResponse } from "next/server";
import { isAuthenticatedAdmin } from "@/lib/admin/auth";
import { client, ensureDbInitialized } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const isAuth = await isAuthenticatedAdmin(request);
  if (!isAuth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await ensureDbInitialized();

  const searchParams = request.nextUrl.searchParams;
  const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
  const limit = Math.min(100, Math.max(10, parseInt(searchParams.get("limit") || "25", 10)));
  const offset = (page - 1) * limit;

  const platform = searchParams.get("platform");
  const status = searchParams.get("status");
  const country = searchParams.get("country");
  const device = searchParams.get("device");
  const language = searchParams.get("language");
  const search = searchParams.get("search");

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

  if (device && device !== "all") {
    whereClauses.push("device_type = ?");
    args.push(device);
  }

  if (language && language !== "all") {
    whereClauses.push("locale = ?");
    args.push(language);
  }

  if (search && search.trim()) {
    whereClauses.push("(original_url LIKE ? OR video_title LIKE ?)");
    const searchTerm = `%${search.trim()}%`;
    args.push(searchTerm, searchTerm);
  }

  const whereSql = whereClauses.length > 0 ? `WHERE ${whereClauses.join(" AND ")}` : "";

  try {
    // 1. Total count
    const countSql = `SELECT COUNT(*) as total FROM submissions ${whereSql}`;
    const countResult = await client.execute({ sql: countSql, args });
    const totalCount = Number(countResult.rows[0]?.total || 0);

    // 2. Fetch page records
    const selectSql = `
      SELECT
        id,
        original_url,
        normalized_url,
        platform,
        tool,
        status,
        error_category,
        error_message,
        processing_duration_ms,
        video_title,
        thumbnail,
        duration,
        file_size,
        resolution,
        ip_address,
        country,
        region,
        city,
        browser,
        browser_version,
        os,
        device_type,
        locale,
        referrer,
        landing_page,
        user_agent,
        session_id,
        created_at
      FROM submissions
      ${whereSql}
      ORDER BY created_at DESC
      LIMIT ? OFFSET ?
    `;

    const recordsResult = await client.execute({
      sql: selectSql,
      args: [...args, limit, offset],
    });

    return NextResponse.json({
      records: recordsResult.rows,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages: Math.ceil(totalCount / limit),
      },
    });
  } catch (err: any) {
    console.error("[Admin Submissions Query Error]:", err);
    return NextResponse.json({ error: "Failed to query submissions" }, { status: 500 });
  }
}

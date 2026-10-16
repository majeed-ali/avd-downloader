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
  const range = searchParams.get("range") || "30d";
  const customStart = searchParams.get("startDate");
  const customEnd = searchParams.get("endDate");

  const now = Date.now();
  let startTime = now - 30 * 24 * 60 * 60 * 1000; // default 30d
  let endTime = now;

  if (range === "today") {
    const todayStart = new Date();
    todayStart.setUTCHours(0, 0, 0, 0);
    startTime = todayStart.getTime();
  } else if (range === "yesterday") {
    const yStart = new Date();
    yStart.setUTCDate(yStart.getUTCDate() - 1);
    yStart.setUTCHours(0, 0, 0, 0);
    const yEnd = new Date(yStart);
    yEnd.setUTCHours(23, 59, 59, 999);
    startTime = yStart.getTime();
    endTime = yEnd.getTime();
  } else if (range === "7d") {
    startTime = now - 7 * 24 * 60 * 60 * 1000;
  } else if (range === "30d") {
    startTime = now - 30 * 24 * 60 * 60 * 1000;
  } else if (range === "90d") {
    startTime = now - 90 * 24 * 60 * 60 * 1000;
  } else if (range === "custom" && customStart && customEnd) {
    startTime = new Date(customStart).getTime() || startTime;
    endTime = new Date(customEnd).getTime() || endTime;
  }

  try {
    // 1. Overall KPIs
    const kpiResult = await client.execute({
      sql: `
        SELECT
          COUNT(*) as total,
          SUM(CASE WHEN status = 'success' THEN 1 ELSE 0 END) as success_count,
          SUM(CASE WHEN status = 'failed' THEN 1 ELSE 0 END) as failed_count,
          COUNT(DISTINCT COALESCE(session_id, ip_address)) as unique_visitors,
          AVG(processing_duration_ms) as avg_duration
        FROM submissions
        WHERE created_at >= ? AND created_at <= ?
      `,
      args: [startTime, endTime],
    });

    const kpiRow = kpiResult.rows[0] || {};
    const total = Number(kpiRow.total || 0);
    const successCount = Number(kpiRow.success_count || 0);
    const failedCount = Number(kpiRow.failed_count || 0);
    const uniqueVisitors = Number(kpiRow.unique_visitors || 0);
    const avgDuration = Math.round(Number(kpiRow.avg_duration || 0));
    const successRate = total > 0 ? parseFloat(((successCount / total) * 100).toFixed(1)) : 0;

    // 2. Interaction Events (Play events & Download clicks)
    const eventsResult = await client.execute({
      sql: `
        SELECT
          event_type,
          COUNT(*) as count
        FROM interaction_events
        WHERE timestamp >= ? AND timestamp <= ?
        GROUP BY event_type
      `,
      args: [startTime, endTime],
    });

    let videoPlays = 0;
    let downloadClicks = 0;
    for (const row of eventsResult.rows) {
      if (row.event_type === "video_played") videoPlays = Number(row.count);
      if (row.event_type === "download_clicked") downloadClicks = Number(row.count);
    }

    // 3. Top Platform
    const topPlatformResult = await client.execute({
      sql: `
        SELECT platform, COUNT(*) as count
        FROM submissions
        WHERE created_at >= ? AND created_at <= ?
        GROUP BY platform
        ORDER BY count DESC
        LIMIT 1
      `,
      args: [startTime, endTime],
    });
    const topPlatform = String(topPlatformResult.rows[0]?.platform || "N/A");

    // 4. Top Country
    const topCountryResult = await client.execute({
      sql: `
        SELECT country, COUNT(*) as count
        FROM submissions
        WHERE created_at >= ? AND created_at <= ? AND country != 'Unknown'
        GROUP BY country
        ORDER BY count DESC
        LIMIT 1
      `,
      args: [startTime, endTime],
    });
    const topCountry = String(topCountryResult.rows[0]?.country || "N/A");

    // 5. Daily trend chart
    const dailyTrendResult = await client.execute({
      sql: `
        SELECT
          date(created_at / 1000, 'unixepoch') as day,
          COUNT(*) as total,
          SUM(CASE WHEN status = 'success' THEN 1 ELSE 0 END) as success,
          SUM(CASE WHEN status = 'failed' THEN 1 ELSE 0 END) as failed
        FROM submissions
        WHERE created_at >= ? AND created_at <= ?
        GROUP BY day
        ORDER BY day ASC
      `,
      args: [startTime, endTime],
    });

    const dailyTrend = dailyTrendResult.rows.map((r) => ({
      date: String(r.day || ""),
      total: Number(r.total || 0),
      success: Number(r.success || 0),
      failed: Number(r.failed || 0),
    }));

    // 6. Platform distribution
    const platformDistResult = await client.execute({
      sql: `
        SELECT platform as name, COUNT(*) as value
        FROM submissions
        WHERE created_at >= ? AND created_at <= ?
        GROUP BY platform
        ORDER BY value DESC
        LIMIT 8
      `,
      args: [startTime, endTime],
    });
    const platformDistribution = platformDistResult.rows.map((r) => ({
      name: String(r.name || "Unknown"),
      value: Number(r.value || 0),
    }));

    // 7. Device distribution
    const deviceDistResult = await client.execute({
      sql: `
        SELECT device_type as name, COUNT(*) as value
        FROM submissions
        WHERE created_at >= ? AND created_at <= ?
        GROUP BY device_type
        ORDER BY value DESC
      `,
      args: [startTime, endTime],
    });
    const deviceDistribution = deviceDistResult.rows.map((r) => ({
      name: String(r.name || "Unknown"),
      value: Number(r.value || 0),
    }));

    // 8. Top countries
    const countriesResult = await client.execute({
      sql: `
        SELECT country, COUNT(*) as count
        FROM submissions
        WHERE created_at >= ? AND created_at <= ?
        GROUP BY country
        ORDER BY count DESC
        LIMIT 10
      `,
      args: [startTime, endTime],
    });
    const countries = countriesResult.rows.map((r) => ({
      country: String(r.country || "Unknown"),
      count: Number(r.count || 0),
    }));

    // 9. Top tools
    const toolsResult = await client.execute({
      sql: `
        SELECT tool as name, COUNT(*) as count
        FROM submissions
        WHERE created_at >= ? AND created_at <= ?
        GROUP BY tool
        ORDER BY count DESC
        LIMIT 10
      `,
      args: [startTime, endTime],
    });
    const tools = toolsResult.rows.map((r) => ({
      name: String(r.name || "Unknown"),
      count: Number(r.count || 0),
    }));

    // 10. Browser distribution
    const browserDistResult = await client.execute({
      sql: `
        SELECT browser as name, COUNT(*) as value
        FROM submissions
        WHERE created_at >= ? AND created_at <= ?
        GROUP BY browser
        ORDER BY value DESC
        LIMIT 6
      `,
      args: [startTime, endTime],
    });
    const browserDistribution = browserDistResult.rows.map((r) => ({
      name: String(r.name || "Unknown"),
      value: Number(r.value || 0),
    }));

    return NextResponse.json({
      kpis: {
        total,
        successCount,
        failedCount,
        uniqueVisitors,
        videoPlays,
        downloadClicks,
        successRate,
        topPlatform,
        topCountry,
        avgDuration,
      },
      charts: {
        dailyTrend,
        platformDistribution,
        deviceDistribution,
        browserDistribution,
        countries,
        tools,
      },
    });
  } catch (err: any) {
    console.error("[Admin Stats Error]:", err);
    return NextResponse.json({ error: "Failed to query analytics stats" }, { status: 500 });
  }
}

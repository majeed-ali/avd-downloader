import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const uk = searchParams.get("uk");
  const shareid = searchParams.get("shareid");
  const sign = searchParams.get("sign");
  const timestamp = searchParams.get("timestamp");
  const randsk = searchParams.get("randsk");
  const fid = searchParams.get("fid");
  const type = searchParams.get("type") || "M3U8_FLV_264_480";

  if (!uk || !shareid || !sign || !timestamp || !fid) {
    return NextResponse.json({ error: "Missing required stream parameters" }, { status: 400 });
  }

  try {
    const upstreamUrl = `https://www.terabox.app/share/streaming?app_id=250528&channel=dubox&clienttype=0&web=1&uk=${encodeURIComponent(
      uk
    )}&shareid=${encodeURIComponent(shareid)}&sign=${encodeURIComponent(sign)}&timestamp=${encodeURIComponent(
      timestamp
    )}&type=${encodeURIComponent(type)}&fid=${encodeURIComponent(fid)}`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    const headers: Record<string, string> = {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      Referer: "https://www.terabox.app/",
    };

    if (randsk) {
      headers["Cookie"] = `BDCLND=${randsk}`;
    }

    const response = await fetch(upstreamUrl, {
      method: "GET",
      headers,
      signal: controller.signal,
      cache: "no-store",
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      return NextResponse.json(
        { error: `Upstream streaming error (status ${response.status})` },
        { status: response.status }
      );
    }

    const m3u8Content = await response.text();

    if (!m3u8Content.startsWith("#EXTM3U")) {
      return NextResponse.json(
        { error: "Stream unavailable or restricted by source" },
        { status: 502 }
      );
    }

    // Rewrite all segment URLs to our CORS-compliant segment proxy
    const rewrittenM3u8 = m3u8Content
      .split("\n")
      .map((line) => {
        const trimmed = line.trim();
        if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
          return `/api/player/segment?url=${encodeURIComponent(trimmed)}`;
        }
        return line;
      })
      .join("\n");

    return new NextResponse(rewrittenM3u8, {
      status: 200,
      headers: {
        "Content-Type": "application/vnd.apple.mpegurl; charset=utf-8",
        "Cache-Control": "public, max-age=1800, s-maxage=1800",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, HEAD, OPTIONS",
        "Access-Control-Allow-Headers": "Range, Accept, Origin, Content-Type",
      },
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Failed to retrieve streaming manifest" },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, HEAD, OPTIONS",
      "Access-Control-Allow-Headers": "Range, Accept, Origin, Content-Type",
      "Access-Control-Max-Age": "86400",
    },
  });
}

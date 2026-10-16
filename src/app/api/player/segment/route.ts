import { NextRequest, NextResponse } from "next/server";
import { validatePublicUrl, isPermittedMediaHost } from "@/lib/player/ssrf";

export const dynamic = "force-dynamic";

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

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const targetUrl = searchParams.get("url");

  if (!targetUrl) {
    return NextResponse.json({ error: "Missing segment url" }, { status: 400 });
  }

  // 1. SSRF validation
  const ssrfValidation = validatePublicUrl(targetUrl);
  if (!ssrfValidation.valid || !ssrfValidation.url) {
    return NextResponse.json(
      { error: ssrfValidation.error || "Forbidden media URL" },
      { status: 403 }
    );
  }

  // 2. Permitted Media Host check
  if (!isPermittedMediaHost(ssrfValidation.url.hostname)) {
    return NextResponse.json(
      { error: "Domain not permitted for media proxying" },
      { status: 403 }
    );
  }

  try {
    const upstreamHeaders: Record<string, string> = {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      Referer: "https://www.terabox.app/",
    };

    // Forward Range header if client requested byte range
    const rangeHeader = request.headers.get("range");
    if (rangeHeader) {
      upstreamHeaders["Range"] = rangeHeader;
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 12000);

    const upstreamRes = await fetch(targetUrl, {
      method: "GET",
      headers: upstreamHeaders,
      signal: controller.signal,
      cache: "force-cache",
    });

    clearTimeout(timeout);

    if (!upstreamRes.ok && upstreamRes.status !== 206) {
      return NextResponse.json(
        { error: `Upstream media segment error (${upstreamRes.status})` },
        { status: upstreamRes.status }
      );
    }

    const contentType =
      upstreamRes.headers.get("content-type") || "video/mp2t";
    const contentLength = upstreamRes.headers.get("content-length");
    const contentRange = upstreamRes.headers.get("content-range");
    const acceptRanges = upstreamRes.headers.get("accept-ranges") || "bytes";

    const responseHeaders: Record<string, string> = {
      "Content-Type": contentType.includes("application/octet-stream")
        ? "video/mp2t"
        : contentType,
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, HEAD, OPTIONS",
      "Access-Control-Allow-Headers": "Range, Accept, Origin, Content-Type",
      "Access-Control-Expose-Headers": "Content-Length, Content-Range, Accept-Ranges",
      "Cache-Control": "public, max-age=86400, immutable",
      "Accept-Ranges": acceptRanges,
    };

    if (contentLength) {
      responseHeaders["Content-Length"] = contentLength;
    }
    if (contentRange) {
      responseHeaders["Content-Range"] = contentRange;
    }

    // Stream response body directly to client
    return new NextResponse(upstreamRes.body as any, {
      status: upstreamRes.status,
      headers: responseHeaders,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Failed to proxy media segment" },
      { status: 502 }
    );
  }
}

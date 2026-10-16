import { NextRequest, NextResponse } from "next/server";
import { resolvePlayerUrl } from "@/lib/player/registry";
import { recordSubmission } from "@/lib/tracking/tracker";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const startTime = Date.now();
  let requestedUrl = "";
  let locale = "en";

  try {
    const body = await request.json();
    requestedUrl = typeof body?.url === "string" ? body.url.trim() : "";
    locale = typeof body?.locale === "string" ? body.locale : "en";

    if (!requestedUrl) {
      await recordSubmission({
        originalUrl: "",
        tool: "terabox-downloader",
        headers: request.headers,
        status: "failed",
        errorCategory: "validation_error",
        errorMessage: "No video URL was provided",
        processingDurationMs: Date.now() - startTime,
        locale,
      });

      return NextResponse.json(
        {
          success: false,
          error: "A valid video URL is required",
          errorCategory: "invalid_url",
        },
        { status: 400 }
      );
    }

    // Resolve URL through domain adapters
    const result = await resolvePlayerUrl(requestedUrl);
    const durationMs = Date.now() - startTime;

    // Track submission in centralized SQLite database
    const submissionId = await recordSubmission({
      originalUrl: requestedUrl,
      tool: "terabox-downloader",
      headers: request.headers,
      status: result.success ? "success" : "failed",
      errorCategory: result.errorCategory,
      errorMessage: result.error,
      processingDurationMs: durationMs,
      videoTitle: result.title || undefined,
      thumbnail: result.thumbnail,
      duration: result.durationFormatted,
      fileSize: result.fileSizeFormatted,
      resolution: result.resolution,
      locale,
    });

    result.submissionId = submissionId;

    const responsePayload = {
      ...result,
      code: result.success ? 200 : 400,
      status: result.success,
      message: result.success ? "done" : (result.error || "failed"),
      // FlowVideoPlayer compatible payload format
      response: result.success
        ? [
            {
              file_name: result.title,
              thumbnail: result.thumbnail || "",
              download_url: result.downloadUrl || "",
              stream_url: result.streamUrl || "",
              fast_stream_url: result.streamUrl || "",
              file_size: result.fileSizeFormatted || "",
              file_size_bytes: result.fileSize || 0,
              share_url: requestedUrl,
              extension: ".mp4",
            },
          ]
        : [],
    };

    return NextResponse.json(responsePayload, {
      status: 200,
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (err: any) {
    const durationMs = Date.now() - startTime;
    await recordSubmission({
      originalUrl: requestedUrl,
      tool: "terabox-downloader",
      headers: request.headers,
      status: "failed",
      errorCategory: "server_error",
      errorMessage: err.message || "An unexpected error occurred",
      processingDurationMs: durationMs,
      locale,
    });

    return NextResponse.json(
      {
        success: false,
        error: "An internal server error occurred while resolving the video",
        errorCategory: "server_error",
      },
      { status: 500 }
    );
  }
}

import { NextResponse } from "next/server";
import { debugLog } from "@/lib/debug-log";
import { recordSubmission } from "@/lib/tracking/tracker";

export const dynamic = "force-dynamic";

const ALLOWED_FORMATS = new Set([
  "mp3",
  "m4a",
  "360",
  "720",
  "1080",
  "1440",
  "mp44k",
  "mp48k",
  "4k",
  "8k",
]);

type UpstreamResponse = {
  success?: boolean | number;
  message?: string;
  text?: string;
  status?: string;
  progress?: number | string;
  content?: string;
  progress_url?: string | null;
  download_url?: string | null;
  url?: string | null;
  submissionId?: string;
  [key: string]: unknown;
};

export async function GET(request: Request) {
  const startTime = Date.now();
  const requestUrl = new URL(request.url);
  const videoUrl = requestUrl.searchParams.get("url") || "";
  const requestedFormat = requestUrl.searchParams.get("format") || "720";
  const toolName = requestUrl.searchParams.get("tool") || "downloader";

  try {
    if (!videoUrl) {
      await debugLog("download.validation-error", {
        reason: "missing-video-url",
      });

      await recordSubmission({
        originalUrl: videoUrl,
        tool: toolName,
        headers: request.headers,
        status: "failed",
        errorCategory: "validation_error",
        errorMessage: "A video URL is required",
        processingDurationMs: Date.now() - startTime,
      });

      return NextResponse.json(
        {
          success: false,
          message: "A video URL is required",
        },
        {
          status: 400,
        }
      );
    }

    if (!ALLOWED_FORMATS.has(requestedFormat)) {
      await debugLog("download.validation-error", {
        reason: "unsupported-format",
        requestedFormat,
      });

      await recordSubmission({
        originalUrl: videoUrl,
        tool: toolName,
        headers: request.headers,
        status: "failed",
        errorCategory: "validation_error",
        errorMessage: "The selected format is not supported",
        processingDurationMs: Date.now() - startTime,
      });

      return NextResponse.json(
        {
          success: false,
          message: "The selected format is not supported",
        },
        {
          status: 400,
        }
      );
    }

    try {
      const parsedVideoUrl = new URL(videoUrl);

      if (
        parsedVideoUrl.protocol !== "https:" &&
        parsedVideoUrl.protocol !== "http:"
      ) {
        throw new Error("Unsupported URL protocol");
      }
    } catch {
      await debugLog("download.validation-error", {
        reason: "invalid-video-url",
      });

      await recordSubmission({
        originalUrl: videoUrl,
        tool: toolName,
        headers: request.headers,
        status: "failed",
        errorCategory: "validation_error",
        errorMessage: "The supplied video URL is invalid",
        processingDurationMs: Date.now() - startTime,
      });

      return NextResponse.json(
        {
          success: false,
          message: "The supplied video URL is invalid",
        },
        {
          status: 400,
        }
      );
    }

    const apiKey = process.env.SAVENOW_API_KEY;

    if (!apiKey) {
      await debugLog("download.configuration-error", {
        reason: "missing-api-key",
      });

      await recordSubmission({
        originalUrl: videoUrl,
        tool: toolName,
        headers: request.headers,
        status: "failed",
        errorCategory: "configuration_error",
        errorMessage: "SAVENOW_API_KEY is not configured",
        processingDurationMs: Date.now() - startTime,
      });

      return NextResponse.json(
        {
          success: false,
          message: "SAVENOW_API_KEY is not configured",
        },
        {
          status: 500,
        }
      );
    }

    const params = new URLSearchParams({
      url: videoUrl,
      format: requestedFormat,
      apikey: apiKey,
      add_info: "1",
      allow_extended_duration: "1",
      no_merge: "0",
    });

    const upstreamResponse = await fetch(
      `https://p.savenow.to/ajax/download.php?${params.toString()}`,
      {
        cache: "no-store",
        headers: {
          Accept: "application/json",
        },
      }
    );

    const responseText = await upstreamResponse.text();

    let data: UpstreamResponse;

    try {
      data = JSON.parse(responseText) as UpstreamResponse;
    } catch {
      await debugLog("download.invalid-upstream-response", {
        httpStatus: upstreamResponse.status,
        responseLength: responseText.length,
        responsePreview: responseText.slice(0, 200),
      });

      await recordSubmission({
        originalUrl: videoUrl,
        tool: toolName,
        headers: request.headers,
        status: "failed",
        errorCategory: "upstream_error",
        errorMessage: "The download service returned an invalid response",
        processingDurationMs: Date.now() - startTime,
      });

      return NextResponse.json(
        {
          success: false,
          message: "The download service returned an invalid response",
        },
        {
          status: 502,
        }
      );
    }

    const isSuccessful = Boolean(data.success && data.success !== 0);
    const durationMs = Date.now() - startTime;

    // Record submission in centralized SQLite tracking
    const submissionId = await recordSubmission({
      originalUrl: videoUrl,
      tool: toolName,
      headers: request.headers,
      status: isSuccessful ? "success" : "failed",
      errorCategory: isSuccessful ? undefined : "upstream_rejected",
      errorMessage: isSuccessful ? undefined : (data.message || data.text || undefined),
      processingDurationMs: durationMs,
      videoTitle: typeof data.title === "string" ? data.title : undefined,
      resolution: requestedFormat,
    });

    data.submissionId = submissionId;

    await debugLog("download.initial-response", {
      requestedFormat,
      httpStatus: upstreamResponse.status,
      success: data.success,
      progress: data.progress,
      status: data.status,
      text: data.text,
      message: data.message,
      hasContent: Boolean(data.content),
      hasProgressUrl: Boolean(data.progress_url),
      hasDownloadUrl: Boolean(data.download_url || data.url),
    });

    return NextResponse.json(data, {
      status: upstreamResponse.ok ? 200 : upstreamResponse.status,
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate",
      },
    });
  } catch (error) {
    await debugLog("download.initial-error", {
      error,
    });

    await recordSubmission({
      originalUrl: videoUrl,
      tool: toolName,
      headers: request.headers,
      status: "failed",
      errorCategory: "server_error",
      errorMessage: error instanceof Error ? error.message : "An unexpected server error occurred",
      processingDurationMs: Date.now() - startTime,
    });

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "An unexpected server error occurred",
      },
      {
        status: 500,
      }
    );
  }
}
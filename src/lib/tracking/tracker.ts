import { client, ensureDbInitialized } from "@/lib/db";
import {
  extractClientIp,
  processIpAddress,
  resolveGeoLocation,
  parseUserAgent,
  detectPlatform,
  normalizeSubmittedUrl,
} from "./visitor";
import crypto from "node:crypto";

export interface RecordSubmissionInput {
  originalUrl: string;
  tool: string;
  headers: Headers;
  status: "success" | "failed" | "processing";
  errorCategory?: string;
  errorMessage?: string;
  processingDurationMs?: number;
  videoTitle?: string;
  thumbnail?: string;
  duration?: string;
  fileSize?: string;
  resolution?: string;
  locale?: string;
  referrer?: string;
  landingPage?: string;
  sessionId?: string;
}

/**
 * Records submission to the database.
 * If the database is down or connection times out, it gracefully skips
 * saving and never blocks or errors in front of the user.
 */
export async function recordSubmission(input: RecordSubmissionInput): Promise<string> {
  const eventId = crypto.randomUUID();

  // Non-blocking try/catch: errors never bubble up to affect video playback
  try {
    await ensureDbInitialized();

    const rawIp = extractClientIp(input.headers);
    const processedIp = processIpAddress(rawIp);
    const { country, region, city } = await resolveGeoLocation(rawIp, input.headers);
    const uaString = input.headers.get("user-agent");
    const { browser, browserVersion, os, deviceType } = parseUserAgent(uaString);
    const platform = detectPlatform(input.originalUrl);
    const normalizedUrl = normalizeSubmittedUrl(input.originalUrl);

    await client.execute({
      sql: `
        INSERT INTO submissions (
          id, original_url, normalized_url, platform, tool, status,
          error_category, error_message, processing_duration_ms, video_title,
          thumbnail, duration, file_size, resolution, ip_address, country,
          region, city, browser, browser_version, os, device_type, locale,
          referrer, landing_page, user_agent, session_id, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      args: [
        eventId,
        input.originalUrl || "",
        normalizedUrl || "",
        platform,
        input.tool || "downloader",
        input.status,
        input.errorCategory || null,
        input.errorMessage || null,
        input.processingDurationMs || 0,
        input.videoTitle || null,
        input.thumbnail || null,
        input.duration || null,
        input.fileSize || null,
        input.resolution || null,
        processedIp,
        country,
        region,
        city,
        browser,
        browserVersion,
        os,
        deviceType,
        input.locale || "en",
        input.referrer || input.headers.get("referer") || null,
        input.landingPage || null,
        uaString ? uaString.slice(0, 300) : null,
        input.sessionId || null,
        Date.now(),
      ],
    });
  } catch (err: any) {
    // Gracefully skip saving and continue without blocking user
    console.warn("[Tracking Skipped - DB unavailable]:", err.message || err);
  }

  return eventId;
}

export async function recordInteractionEvent(
  submissionId: string,
  eventType: "video_played" | "download_clicked" | "download_started" | "processing_failed",
  metadata?: Record<string, unknown>
): Promise<void> {
  try {
    await ensureDbInitialized();

    await client.execute({
      sql: `
        INSERT INTO interaction_events (
          id, submission_id, event_type, timestamp, metadata
        ) VALUES (?, ?, ?, ?, ?)
      `,
      args: [
        crypto.randomUUID(),
        submissionId,
        eventType,
        Date.now(),
        metadata ? JSON.stringify(metadata) : null,
      ],
    });
  } catch (err: any) {
    console.warn("[Interaction Event Skipped - DB unavailable]:", err.message || err);
  }
}

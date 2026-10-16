import { sqliteTable, text, integer, index } from "drizzle-orm/sqlite-core";

export const submissions = sqliteTable(
  "submissions",
  {
    id: text("id").primaryKey(),
    originalUrl: text("original_url").notNull(),
    normalizedUrl: text("normalized_url").notNull(),
    platform: text("platform").notNull(),
    tool: text("tool").notNull(),
    status: text("status").notNull(), // 'success' | 'failed' | 'processing'
    errorCategory: text("error_category"),
    errorMessage: text("error_message"),
    processingDurationMs: integer("processing_duration_ms"),
    videoTitle: text("video_title"),
    thumbnail: text("thumbnail"),
    duration: text("duration"),
    fileSize: text("file_size"),
    resolution: text("resolution"),
    ipAddress: text("ip_address"),
    country: text("country"),
    region: text("region"),
    city: text("city"),
    browser: text("browser"),
    browserVersion: text("browser_version"),
    os: text("os"),
    deviceType: text("device_type"), // 'desktop' | 'mobile' | 'tablet' | 'unknown'
    locale: text("locale"),
    referrer: text("referrer"),
    landingPage: text("landing_page"),
    userAgent: text("user_agent"),
    sessionId: text("session_id"),
    createdAt: integer("created_at").notNull(),
  },
  (table) => ({
    createdAtIdx: index("idx_submissions_created_at").on(table.createdAt),
    platformIdx: index("idx_submissions_platform").on(table.platform),
    statusIdx: index("idx_submissions_status").on(table.status),
    toolIdx: index("idx_submissions_tool").on(table.tool),
    countryIdx: index("idx_submissions_country").on(table.country),
    deviceIdx: index("idx_submissions_device").on(table.deviceType),
  })
);

export const interactionEvents = sqliteTable(
  "interaction_events",
  {
    id: text("id").primaryKey(),
    submissionId: text("submission_id").notNull(),
    eventType: text("event_type").notNull(), // 'video_played' | 'download_clicked' | 'download_started' | 'processing_failed'
    timestamp: integer("timestamp").notNull(),
    metadata: text("metadata"), // JSON string
  },
  (table) => ({
    submissionIdIdx: index("idx_events_submission_id").on(table.submissionId),
    eventTypeIdx: index("idx_events_type").on(table.eventType),
    timestampIdx: index("idx_events_timestamp").on(table.timestamp),
  })
);

export type Submission = typeof submissions.$inferSelect;
export type NewSubmission = typeof submissions.$inferInsert;
export type InteractionEvent = typeof interactionEvents.$inferSelect;
export type NewInteractionEvent = typeof interactionEvents.$inferInsert;

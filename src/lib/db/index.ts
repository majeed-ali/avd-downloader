import mysql from "mysql2/promise";
import { createClient as createLibSqlClient, Client as LibSqlClient } from "@libsql/client";
import fs from "node:fs";
import path from "node:path";

export interface QueryResult {
  rows: any[];
  rowsAffected?: number;
  insertId?: any;
}

const dbUrl =
  process.env.DATABASE_URL ||
  "mysql://mariadb:f7lQixFTVHL0GjH2rSqUaT2R1DkRU3YInu1yCLgJq4eoiGaDQpawQ8Xj9P9lftSE@185.203.216.245:3307/default";

const isMysql = dbUrl.startsWith("mysql://") || dbUrl.startsWith("mariadb://");

let mysqlPool: mysql.Pool | null = null;
let sqliteClient: LibSqlClient | null = null;
let isInitialized = false;

// Initialize MySQL pool or SQLite client
if (isMysql) {
  try {
    mysqlPool = mysql.createPool({
      uri: dbUrl,
      ssl: { rejectUnauthorized: false },
      waitForConnections: true,
      connectionLimit: 10,
      connectTimeout: 3000, // 3s timeout to never hang
    });
  } catch (err) {
    console.warn("[Database] Failed to create MySQL pool:", err);
  }
} else {
  // Local SQLite fallback
  const filePath = dbUrl.replace(/^file:/, "");
  const resolvedPath = path.isAbsolute(filePath) ? filePath : path.resolve(process.cwd(), filePath);
  const dirName = path.dirname(resolvedPath);
  try {
    if (!fs.existsSync(dirName)) {
      fs.mkdirSync(dirName, { recursive: true });
    }
  } catch {}

  sqliteClient = createLibSqlClient({ url: dbUrl });
}

/**
 * Execute query safely with timeout and error fallback.
 * If database is unavailable, logs a warning and returns empty results
 * without throwing errors or blocking the user request.
 */
export async function executeQuery(sql: string, args: any[] = []): Promise<QueryResult> {
  // Adapt SQL dialect if needed
  let adaptedSql = sql;
  if (isMysql) {
    adaptedSql = adaptedSql
      .replace(/date\s*\(\s*([a-zA-Z0-9_]+)\s*\/\s*1000\s*,\s*'unixepoch'\s*\)/gi, "DATE(FROM_UNIXTIME($1 / 1000))")
      .replace(/datetime\s*\(\s*([a-zA-Z0-9_]+)\s*\/\s*1000\s*,\s*'unixepoch'\s*\)/gi, "FROM_UNIXTIME($1 / 1000)");
  } else {
    adaptedSql = adaptedSql
      .replace(/DATE\s*\(\s*FROM_UNIXTIME\s*\(\s*([a-zA-Z0-9_]+)\s*\/\s*1000\s*\)\s*\)/gi, "date($1 / 1000, 'unixepoch')")
      .replace(/FROM_UNIXTIME\s*\(\s*([a-zA-Z0-9_]+)\s*\/\s*1000\s*\)/gi, "datetime($1 / 1000, 'unixepoch')");
  }

  const timeoutPromise = new Promise<QueryResult>((_, reject) =>
    setTimeout(() => reject(new Error("Database operation timed out")), 2500)
  );

  const queryPromise = (async (): Promise<QueryResult> => {
    if (isMysql && mysqlPool) {
      const [rows, fields] = await mysqlPool.query(adaptedSql, args);
      if (Array.isArray(rows)) {
        return { rows, rowsAffected: (fields as any)?.affectedRows || 0 };
      }
      return { rows: [], rowsAffected: (rows as any)?.affectedRows || 0 };
    } else if (sqliteClient) {
      const res = await sqliteClient.execute({ sql: adaptedSql, args });
      return { rows: res.rows as any[], rowsAffected: res.rowsAffected };
    }
    return { rows: [], rowsAffected: 0 };
  })();

  try {
    return await Promise.race([queryPromise, timeoutPromise]);
  } catch (err: any) {
    // Graceful degradation: never crash or hang the user
    console.warn(`[Database Warning] Query skipped: ${err.message || err}`);
    return { rows: [], rowsAffected: 0 };
  }
}

export const client = {
  execute: async ({ sql, args }: { sql: string; args?: any[] }) => {
    return await executeQuery(sql, args || []);
  },
};

export async function ensureDbInitialized() {
  if (isInitialized) return;

  try {
    if (isMysql && mysqlPool) {
      await executeQuery(`
        CREATE TABLE IF NOT EXISTS submissions (
          id VARCHAR(64) PRIMARY KEY,
          original_url TEXT NOT NULL,
          normalized_url TEXT NOT NULL,
          platform VARCHAR(64) NOT NULL,
          tool VARCHAR(64) NOT NULL,
          status VARCHAR(32) NOT NULL,
          error_category VARCHAR(64),
          error_message TEXT,
          processing_duration_ms INT,
          video_title TEXT,
          thumbnail TEXT,
          duration VARCHAR(32),
          file_size VARCHAR(32),
          resolution VARCHAR(32),
          ip_address VARCHAR(128),
          country VARCHAR(64),
          region VARCHAR(128),
          city VARCHAR(128),
          browser VARCHAR(64),
          browser_version VARCHAR(32),
          os VARCHAR(64),
          device_type VARCHAR(32),
          locale VARCHAR(32),
          referrer TEXT,
          landing_page TEXT,
          user_agent TEXT,
          session_id VARCHAR(128),
          created_at BIGINT NOT NULL,
          INDEX idx_sub_created_at (created_at),
          INDEX idx_sub_platform (platform),
          INDEX idx_sub_status (status),
          INDEX idx_sub_tool (tool),
          INDEX idx_sub_country (country)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
      `);

      await executeQuery(`
        CREATE TABLE IF NOT EXISTS interaction_events (
          id VARCHAR(64) PRIMARY KEY,
          submission_id VARCHAR(64) NOT NULL,
          event_type VARCHAR(64) NOT NULL,
          timestamp BIGINT NOT NULL,
          metadata TEXT,
          INDEX idx_ev_sub_id (submission_id),
          INDEX idx_ev_type (event_type),
          INDEX idx_ev_time (timestamp)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
      `);
    } else if (sqliteClient) {
      await sqliteClient.execute(`
        CREATE TABLE IF NOT EXISTS submissions (
          id TEXT PRIMARY KEY,
          original_url TEXT NOT NULL,
          normalized_url TEXT NOT NULL,
          platform TEXT NOT NULL,
          tool TEXT NOT NULL,
          status TEXT NOT NULL,
          error_category TEXT,
          error_message TEXT,
          processing_duration_ms INTEGER,
          video_title TEXT,
          thumbnail TEXT,
          duration TEXT,
          file_size TEXT,
          resolution TEXT,
          ip_address TEXT,
          country TEXT,
          region TEXT,
          city TEXT,
          browser TEXT,
          browser_version TEXT,
          os TEXT,
          device_type TEXT,
          locale TEXT,
          referrer TEXT,
          landing_page TEXT,
          user_agent TEXT,
          session_id TEXT,
          created_at INTEGER NOT NULL
        );
      `);

      await sqliteClient.execute(`
        CREATE TABLE IF NOT EXISTS interaction_events (
          id TEXT PRIMARY KEY,
          submission_id TEXT NOT NULL,
          event_type TEXT NOT NULL,
          timestamp INTEGER NOT NULL,
          metadata TEXT
        );
      `);

      await sqliteClient.execute(`CREATE INDEX IF NOT EXISTS idx_submissions_created_at ON submissions(created_at);`);
      await sqliteClient.execute(`CREATE INDEX IF NOT EXISTS idx_submissions_platform ON submissions(platform);`);
      await sqliteClient.execute(`CREATE INDEX IF NOT EXISTS idx_submissions_status ON submissions(status);`);
      await sqliteClient.execute(`CREATE INDEX IF NOT EXISTS idx_submissions_tool ON submissions(tool);`);
    }

    isInitialized = true;
  } catch (err: any) {
    console.warn("[Database Warning] Failed to initialize tables:", err.message);
  }
}

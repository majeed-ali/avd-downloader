import mysql from "mysql2/promise";

const connectionUrl = "mysql://mariadb:f7lQixFTVHL0GjH2rSqUaT2R1DkRU3YInu1yCLgJq4eoiGaDQpawQ8Xj9P9lftSE@185.203.216.245:3307/default";

async function setupTables() {
  console.log("Setting up tables on MariaDB...");
  const pool = mysql.createPool({
    uri: connectionUrl,
    ssl: { rejectUnauthorized: false },
    waitForConnections: true,
    connectionLimit: 5,
    connectTimeout: 5000,
  });

  try {
    await pool.query(`
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

    await pool.query(`
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

    console.log("[SUCCESS] MariaDB tables and indexes created successfully!");
    const [tables] = await pool.query("SHOW TABLES;");
    console.log("Tables in database:", tables);
  } catch (err) {
    console.error("[ERROR] Setup failed:", err);
  } finally {
    await pool.end();
  }
}

setupTables();

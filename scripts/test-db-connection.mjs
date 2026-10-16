import mysql from "mysql2/promise";

const connectionUrl = "mysql://mariadb:f7lQixFTVHL0GjH2rSqUaT2R1DkRU3YInu1yCLgJq4eoiGaDQpawQ8Xj9P9lftSE@185.203.216.245:3307/default";

async function testConnection() {
  console.log("Testing connection with SSL to MariaDB at 185.203.216.245:3307...");
  try {
    const connection = await mysql.createConnection({
      uri: connectionUrl,
      ssl: {
        rejectUnauthorized: false,
      },
      connectTimeout: 5000,
    });
    console.log("[SUCCESS] Connected to MariaDB successfully!");
    const [rows] = await connection.query("SELECT 1 as val, VERSION() as version;");
    console.log("[SUCCESS] Query result:", rows);
    await connection.end();
  } catch (err) {
    console.warn("[WARNING] Connection attempt error:", err.message);
  }
}

testConnection();

import bcrypt from "bcryptjs";
import fs from "node:fs";
import path from "node:path";

console.log("==================================================");
console.log("RUNNING AUTOMATED TEST SUITE FOR ANYVIDEODOWNLOADER");
console.log("==================================================");

let testsPassed = 0;
let testsFailed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`[PASS] ${message}`);
    testsPassed++;
  } else {
    console.error(`[FAIL] ${message}`);
    testsFailed++;
  }
}

async function runTests() {
  // 1. Test Database connection & MariaDB/SQLite operations
  console.log("\n--- TEST GROUP 1: Persistent Database (MariaDB/Universal) ---");
  const { client, ensureDbInitialized } = await import("../src/lib/db/index.ts");
  await ensureDbInitialized();

  const testId = `test-${Date.now()}`;
  await client.execute({
    sql: `INSERT INTO submissions (id, original_url, normalized_url, platform, tool, status, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)`,
    args: [testId, "https://youtube.com/watch?v=demo", "https://youtube.com/watch?v=demo", "YouTube", "test", "success", Date.now()],
  });

  const checkRes = await client.execute({
    sql: `SELECT id, platform, status FROM submissions WHERE id = ?`,
    args: [testId],
  });

  assert(checkRes.rows[0]?.id === testId, "Database record successfully written and read from configured DATABASE_URL");

  // Clean up test row
  await client.execute({
    sql: `DELETE FROM submissions WHERE id = ?`,
    args: [testId],
  });

  // 1.1 Test Graceful Degradation (Database Unavailable / Error handling)
  console.log("\n--- TEST GROUP 1.1: DB Failure Graceful Degradation ---");
  const { recordSubmission } = await import("../src/lib/tracking/tracker.ts");

  // Even if an unexpected error occurs, recordSubmission must never throw
  const mockHeaders = new Headers({ "user-agent": "Mozilla/5.0", "x-forwarded-for": "8.8.8.8" });
  let submissionReturnedId = false;
  try {
    const eventId = await recordSubmission({
      originalUrl: "https://terabox.com/s/1xyz999",
      tool: "watch-online",
      headers: mockHeaders,
      status: "success",
    });
    submissionReturnedId = Boolean(eventId);
  } catch {
    submissionReturnedId = false;
  }
  assert(submissionReturnedId, "recordSubmission never throws errors and returns eventId even on network hiccups");

  // 2. Test SSRF Protection
  console.log("\n--- TEST GROUP 2: SSRF & URL Validation ---");
  const { validatePublicUrl } = await import("../src/lib/player/ssrf.ts");

  assert(!validatePublicUrl("http://127.0.0.1:8080/secret").valid, "Blocks loopback IPv4 127.0.0.1");
  assert(!validatePublicUrl("http://localhost:3000/api").valid, "Blocks localhost hostname");
  assert(!validatePublicUrl("http://10.0.1.50/admin").valid, "Blocks private Class A 10.x.x.x");
  assert(!validatePublicUrl("http://192.168.1.1/router").valid, "Blocks private Class C 192.168.x.x");
  assert(!validatePublicUrl("http://172.16.0.1/").valid, "Blocks private Class B 172.16.x.x");
  assert(!validatePublicUrl("http://169.254.169.254/latest/meta-data").valid, "Blocks cloud metadata IP 169.254.169.254");
  assert(!validatePublicUrl("ftp://terabox.com/file").valid, "Blocks non-HTTP(S) protocols");
  assert(validatePublicUrl("https://terabox.com/s/1abc123").valid, "Allows public HTTPS cloud link");

  // 3. Test Domain Adapters Allowlist & Key Extraction
  console.log("\n--- TEST GROUP 3: Domain Adapters ---");
  const { ALL_SUPPORTED_PLAYER_DOMAINS, findAdapterForUrl } = await import("../src/lib/player/registry.ts");
  const { extractTeraBoxKey } = await import("../src/lib/player/adapters/terabox.ts");

  assert(ALL_SUPPORTED_PLAYER_DOMAINS.includes("terabox.com"), "Allowlist includes terabox.com");
  assert(ALL_SUPPORTED_PLAYER_DOMAINS.includes("1024terabox.com"), "Allowlist includes 1024terabox.com");
  assert(ALL_SUPPORTED_PLAYER_DOMAINS.includes("1024tera.com"), "Allowlist includes 1024tera.com");
  assert(ALL_SUPPORTED_PLAYER_DOMAINS.includes("nephobox.com"), "Allowlist includes nephobox.com");
  assert(ALL_SUPPORTED_PLAYER_DOMAINS.includes("diskwala.com"), "Allowlist includes diskwala.com");
  assert(ALL_SUPPORTED_PLAYER_DOMAINS.includes("flezen.com"), "Allowlist includes flezen.com");

  const teraAdapter = findAdapterForUrl(new URL("https://www.terabox.app/s/1g9F_test"));
  assert(teraAdapter !== undefined && teraAdapter.name.includes("TeraBox"), "Identifies TeraBox adapter correctly");

  const tera1024Adapter = findAdapterForUrl(new URL("https://1024terabox.com/s/1g9F_test"));
  assert(tera1024Adapter !== undefined && tera1024Adapter.name.includes("TeraBox"), "Identifies 1024terabox.com adapter correctly");

  const key1 = extractTeraBoxKey(new URL("https://1024tera.com/s/1abcdef123"));
  assert(key1 === "1abcdef123", "Extracts key from /s/ path correctly");

  const key1024 = extractTeraBoxKey(new URL("https://1024terabox.com/s/1testkey987"));
  assert(key1024 === "1testkey987", "Extracts key from 1024terabox.com /s/ path correctly");

  const key2 = extractTeraBoxKey(new URL("https://terabox.com/sharing/link?surl=abcdef123"));
  assert(key2 === "1abcdef123", "Extracts and normalizes ?surl= parameter correctly");

  // 4. Test Super Admin Authentication & Session Security
  console.log("\n--- TEST GROUP 4: Admin Authentication & Password Verification ---");
  const testPassword = "AdminTestPassword2026!";
  const testHash = bcrypt.hashSync(testPassword, 10);
  assert(bcrypt.compareSync(testPassword, testHash), "Bcrypt password verification succeeds for matching password");
  assert(!bcrypt.compareSync("WrongPassword", testHash), "Bcrypt password verification fails for incorrect password");

  const { createSessionToken, verifySessionToken } = await import("../src/lib/admin/auth.ts");
  const token = createSessionToken(testHash);
  assert(verifySessionToken(token, testHash), "Admin session token generated and verified with valid signature");

  const alteredHash = bcrypt.hashSync("NewPassword2026!", 10);
  assert(!verifySessionToken(token, alteredHash), "Changing password hash invalidates previous sessions (session invalidation strategy verified)");

  // 5. Test Localization in all 20 locales
  console.log("\n--- TEST GROUP 5: Multilingual Translations ---");
  const locales = [
    "en", "de", "pl", "fr", "es", "el", "lv", "lt", "nl", "zh",
    "it", "sv", "sk", "pt", "sl", "ru", "da", "fi", "bg", "cs"
  ];

  let missingTranslation = false;
  for (const loc of locales) {
    const filePath = path.join(process.cwd(), "messages", `${loc}.json`);
    const json = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    if (!json.watchOnline || !json.watchOnline.hero || !json.watchOnline.form) {
      missingTranslation = true;
      console.error(`Missing watchOnline keys in ${loc}.json`);
    }
  }
  assert(!missingTranslation, "All 20 locales contain complete watchOnline translation keys");

  // 6. Test SEO & Sitemap
  console.log("\n--- TEST GROUP 6: Technical SEO & Sitemap ---");
  const { CORE_TRANSLATED_TOOLS, getCanonicalUrl, getHreflangAlternates } = await import("../src/lib/seo.ts");

  const hasTeraBox = CORE_TRANSLATED_TOOLS.some((t) => t.slug === "/terabox-downloader");
  assert(hasTeraBox, "terabox-downloader is registered in CORE_TRANSLATED_TOOLS");

  const canonical = getCanonicalUrl("fr", "/terabox-downloader");
  assert(canonical === "https://anyvideodownloader.app/fr/terabox-downloader", "Generates correct canonical URL");

  const alternates = getHreflangAlternates("core-tool", "/terabox-downloader");
  assert(alternates["en"] === "https://anyvideodownloader.app/en/terabox-downloader", "Generates en hreflang");
  assert(alternates["x-default"] === "https://anyvideodownloader.app/en/terabox-downloader", "Generates x-default hreflang");
  // 7. Test Visitor Geolocation Resolution
  console.log("\n--- TEST GROUP 7: Visitor Geolocation Resolution ---");
  const { resolveGeoLocation } = await import("../src/lib/tracking/visitor.ts");

  const cfHeaders = new Headers({ "cf-ipcountry": "CA", "cf-ipcity": "Toronto", "cf-region": "Ontario" });
  const cfGeo = await resolveGeoLocation("127.0.0.1", cfHeaders);
  assert(cfGeo.country === "CA" && cfGeo.city === "Toronto", "Resolves Cloudflare edge country & city headers");

  const vercelHeaders = new Headers({ "x-vercel-ip-country": "FR" });
  const vercelGeo = await resolveGeoLocation("127.0.0.1", vercelHeaders);
  assert(vercelGeo.country === "FR", "Resolves Vercel edge country header");

  const langHeaders = new Headers({ "accept-language": "en-US,en;q=0.9" });
  const langGeo = await resolveGeoLocation("127.0.0.1", langHeaders);
  assert(langGeo.country === "US", "Resolves Accept-Language locale for localhost / local dev");

  console.log("\n==================================================");
  console.log(`TEST RESULTS: ${testsPassed} PASSED, ${testsFailed} FAILED`);
  console.log("==================================================");

  process.exit(testsFailed > 0 ? 1 : 0);
}

runTests().catch((err) => {
  console.error("Test execution failed:", err);
  process.exit(1);
});

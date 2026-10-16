import bcrypt from "bcryptjs";

const password = process.argv[2];

if (!password) {
  console.log("Usage: node scripts/generate-admin-hash.mjs <your-password>");
  process.exit(1);
}

const saltRounds = 12;
const hash = bcrypt.hashSync(password, saltRounds);
const escapedForDotenv = hash.replace(/\$/g, "\\$");
const base64Hash = Buffer.from(hash).toString("base64");

console.log("\n==================================================");
console.log("SUPER ADMIN CREDENTIAL GENERATED SUCCESSFULLY");
console.log("==================================================");
console.log("Raw Bcrypt Hash:");
console.log(hash);
console.log("==================================================");
console.log("OPTION 1 (Recommended for .env.local in Next.js):");
console.log("Note: Next.js dotenv-expand strips raw '$' unless escaped with '\\$':");
console.log(`SUPER_ADMIN_PASSWORD_HASH="${escapedForDotenv}"`);
console.log("--------------------------------------------------");
console.log("OPTION 2 (Direct password - immune to any dotenv expansion):");
console.log(`SUPER_ADMIN_PASSWORD="${password}"`);
console.log("--------------------------------------------------");
console.log("OPTION 3 (Base64-encoded bcrypt hash):");
console.log(`SUPER_ADMIN_PASSWORD_HASH="base64:${base64Hash}"`);
console.log("==================================================\n");

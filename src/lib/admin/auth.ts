import bcrypt from "bcryptjs";
import crypto from "node:crypto";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";

const SESSION_COOKIE_NAME = "avd_admin_session";
const SESSION_DURATION_HOURS = 24;

// Default fallback secret for development if ADMIN_SESSION_SECRET not provided
const SESSION_SECRET = process.env.ADMIN_SESSION_SECRET || "avd_default_super_admin_secret_key_2026_xyz";

// In-memory rate limiting for brute-force protection
interface RateLimitEntry {
  attempts: number;
  lockedUntil: number;
}
const loginAttempts = new Map<string, RateLimitEntry>();

export function checkLoginRateLimit(ip: string): { allowed: boolean; waitSeconds?: number } {
  const now = Date.now();
  const entry = loginAttempts.get(ip);

  if (!entry) return { allowed: true };

  if (entry.lockedUntil > now) {
    const waitSeconds = Math.ceil((entry.lockedUntil - now) / 1000);
    return { allowed: false, waitSeconds };
  }

  // Lock expired
  if (entry.lockedUntil <= now && entry.attempts >= 5) {
    loginAttempts.delete(ip);
    return { allowed: true };
  }

  return { allowed: true };
}

export function recordFailedLogin(ip: string): void {
  const now = Date.now();
  const entry = loginAttempts.get(ip) || { attempts: 0, lockedUntil: 0 };
  entry.attempts += 1;

  if (entry.attempts >= 5) {
    // Lock for 15 minutes
    entry.lockedUntil = now + 15 * 60 * 1000;
  }

  loginAttempts.set(ip, entry);
}

export function resetLoginAttempts(ip: string): void {
  loginAttempts.delete(ip);
}

function getPasswordHashFingerprint(hash: string): string {
  return crypto.createHmac("sha256", SESSION_SECRET).update(hash).digest("hex").slice(0, 16);
}

export function createSessionToken(configuredHash: string): string {
  const payload = {
    iat: Date.now(),
    exp: Date.now() + SESSION_DURATION_HOURS * 60 * 60 * 1000,
    fp: getPasswordHashFingerprint(configuredHash),
  };

  const payloadStr = JSON.stringify(payload);
  const base64Payload = Buffer.from(payloadStr).toString("base64url");
  const signature = crypto.createHmac("sha256", SESSION_SECRET).update(base64Payload).digest("base64url");

  return `${base64Payload}.${signature}`;
}

export function verifySessionToken(token: string | undefined, configuredHash: string): boolean {
  if (!token) return false;

  const parts = token.split(".");
  if (parts.length !== 2) return false;

  const [base64Payload, signature] = parts;
  const expectedSig = crypto.createHmac("sha256", SESSION_SECRET).update(base64Payload).digest("base64url");

  if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSig))) {
    return false;
  }

  try {
    const payloadStr = Buffer.from(base64Payload, "base64url").toString("utf-8");
    const payload = JSON.parse(payloadStr);

    if (Date.now() > payload.exp) {
      return false;
    }

    // Changing password hash invalidates all active sessions automatically!
    const currentFp = getPasswordHashFingerprint(configuredHash);
    if (payload.fp !== currentFp) {
      return false;
    }

    return true;
  } catch {
    return false;
  }
}

export function getConfiguredAdminSecret(): string | null {
  // Option 1: Direct plaintext password (immune to any dotenv expansion issues)
  const directPassword = process.env.SUPER_ADMIN_PASSWORD?.trim();
  if (directPassword) {
    return directPassword;
  }

  // Option 2: SUPER_ADMIN_PASSWORD_HASH
  let hash = process.env.SUPER_ADMIN_PASSWORD_HASH?.trim();
  if (!hash) return null;

  // Next.js dotenv-expand strips unescaped $ signs, leaving only "." or short string
  if (hash.length < 20 && !hash.startsWith("$2")) {
    console.warn(
      `[Admin Auth Warning] SUPER_ADMIN_PASSWORD_HASH appears corrupted ("${hash}"). Next.js requires '$' to be escaped as '\\$' in .env files, e.g. SUPER_ADMIN_PASSWORD_HASH="\\$2b\\$12\\$..." or use SUPER_ADMIN_PASSWORD="your-password".`
    );
    return null;
  }

  // If saved with backslashes in .env, unescape them
  if (hash.includes("\\$")) {
    hash = hash.replace(/\\\$/g, "$");
  }

  // If base64 encoded
  if (hash.startsWith("base64:")) {
    try {
      hash = Buffer.from(hash.slice(7), "base64").toString("utf-8");
    } catch {
      // ignore
    }
  }

  return hash;
}

export async function verifyAdminPassword(password: string): Promise<boolean> {
  const directPassword = process.env.SUPER_ADMIN_PASSWORD?.trim();
  if (directPassword && password === directPassword) {
    return true;
  }

  const hash = getConfiguredAdminSecret();
  if (!hash) {
    console.error("[Admin Auth] Neither SUPER_ADMIN_PASSWORD nor SUPER_ADMIN_PASSWORD_HASH is properly configured!");
    return false;
  }

  try {
    if (hash.startsWith("$2a$") || hash.startsWith("$2b$") || hash.startsWith("$2y$")) {
      return await bcrypt.compare(password, hash);
    }
    // Fallback constant-time check if configured as string
    return crypto.timingSafeEqual(Buffer.from(password), Buffer.from(hash));
  } catch (err) {
    console.error("[Admin Auth] Password comparison error:", err);
    return false;
  }
}

export async function isAuthenticatedAdmin(request?: NextRequest): Promise<boolean> {
  const secret = getConfiguredAdminSecret();
  if (!secret) return false;

  let token: string | undefined;

  if (request) {
    token = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  } else {
    try {
      const cookieStore = await cookies();
      token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
    } catch {
      return false;
    }
  }

  return verifySessionToken(token, secret);
}

export { SESSION_COOKIE_NAME, SESSION_DURATION_HOURS };

import { NextRequest, NextResponse } from "next/server";
import {
  verifyAdminPassword,
  createSessionToken,
  getConfiguredAdminSecret,
  SESSION_COOKIE_NAME,
  SESSION_DURATION_HOURS,
  checkLoginRateLimit,
  recordFailedLogin,
  resetLoginAttempts,
} from "@/lib/admin/auth";
import { extractClientIp } from "@/lib/tracking/visitor";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const ip = extractClientIp(request.headers);
  const rateLimit = checkLoginRateLimit(ip);

  if (!rateLimit.allowed) {
    return NextResponse.json(
      {
        error: `Too many failed login attempts. Please wait ${rateLimit.waitSeconds} seconds before trying again.`,
      },
      { status: 429 }
    );
  }

  try {
    const body = await request.json();
    const password = typeof body?.password === "string" ? body.password : "";

    if (!password) {
      return NextResponse.json({ error: "Password is required" }, { status: 400 });
    }

    const isValid = await verifyAdminPassword(password);

    if (!isValid) {
      recordFailedLogin(ip);
      return NextResponse.json({ error: "Invalid super admin password" }, { status: 401 });
    }

    // Reset rate limiting on successful login
    resetLoginAttempts(ip);

    const configuredSecret = getConfiguredAdminSecret()!;
    const sessionToken = createSessionToken(configuredSecret);

    const isSecure = process.env.NODE_ENV === "production";
    const response = NextResponse.json({ success: true, message: "Authentication successful" });

    response.cookies.set({
      name: SESSION_COOKIE_NAME,
      value: sessionToken,
      httpOnly: true,
      secure: isSecure,
      sameSite: "strict",
      path: "/",
      maxAge: SESSION_DURATION_HOURS * 60 * 60,
    });

    return response;
  } catch (err: any) {
    console.error("[Admin Login Error]:", err);
    return NextResponse.json({ error: "Server error during login" }, { status: 500 });
  }
}

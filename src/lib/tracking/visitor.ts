import crypto from "node:crypto";

export interface VisitorInfo {
  ip: string;
  country: string;
  region: string;
  city: string;
  browser: string;
  browserVersion: string;
  os: string;
  deviceType: "desktop" | "mobile" | "tablet" | "unknown";
  userAgent: string;
}

export function extractClientIp(headers: Headers): string {
  const forwarded = headers.get("x-forwarded-for");
  if (forwarded) {
    const list = forwarded.split(",");
    const client = list[0]?.trim();
    if (client) return client;
  }

  const cf = headers.get("cf-connecting-ip");
  if (cf) return cf.trim();

  const real = headers.get("x-real-ip");
  if (real) return real.trim();

  const vercel = headers.get("x-vercel-forwarded-for");
  if (vercel) return vercel.split(",")[0].trim();

  return "127.0.0.1";
}

export function processIpAddress(ip: string, mode: string = process.env.ANALYTICS_IP_STORAGE_MODE || "full"): string {
  if (!ip) return "unknown";

  if (mode === "hash") {
    return crypto.createHash("sha256").update(ip + "avd_ip_salt").digest("hex").slice(0, 16);
  }

  if (mode === "anonymize") {
    // IPv4: mask last octet
    if (ip.includes(".")) {
      const parts = ip.split(".");
      if (parts.length === 4) {
        return `${parts[0]}.${parts[1]}.${parts[2]}.xxx`;
      }
    }
    // IPv6: mask interface ID
    if (ip.includes(":")) {
      const parts = ip.split(":");
      return parts.slice(0, 3).join(":") + ":xxxx:xxxx";
    }
  }

  return ip;
}

interface GeoLocationResult {
  country: string;
  region: string;
  city: string;
}

const geoCache = new Map<string, GeoLocationResult>();

export function extractCountry(headers: Headers): string {
  const cfCountry = headers.get("cf-ipcountry");
  if (cfCountry && cfCountry !== "XX" && cfCountry !== "T1") {
    return cfCountry.toUpperCase();
  }

  const vercelCountry = headers.get("x-vercel-ip-country");
  if (vercelCountry) {
    return vercelCountry.toUpperCase();
  }

  const geoCountry = headers.get("x-country-code");
  if (geoCountry) {
    return geoCountry.toUpperCase();
  }

  return "Unknown";
}

export function extractRegionAndCity(headers: Headers): { region: string; city: string } {
  const city = headers.get("cf-ipcity") || headers.get("x-vercel-ip-city") || "";
  const region = headers.get("cf-region") || headers.get("x-vercel-ip-country-region") || "";
  return {
    region: region || "Unknown",
    city: city ? decodeURIComponent(city) : "Unknown",
  };
}

export async function resolveGeoLocation(
  ip: string,
  headers: Headers
): Promise<GeoLocationResult> {
  // 1. Direct Edge Headers (Cloudflare, Vercel, Proxies)
  const edgeCountry = extractCountry(headers);
  const { region: edgeRegion, city: edgeCity } = extractRegionAndCity(headers);

  if (edgeCountry !== "Unknown") {
    return {
      country: edgeCountry,
      region: edgeRegion,
      city: edgeCity,
    };
  }

  // 2. Check memory cache for IP
  if (geoCache.has(ip)) {
    return geoCache.get(ip)!;
  }

  // 3. Fallback for private / localhost IPs
  const isPrivateIp =
    !ip ||
    ip === "127.0.0.1" ||
    ip === "::1" ||
    ip.startsWith("192.168.") ||
    ip.startsWith("10.") ||
    ip.startsWith("172.");

  if (isPrivateIp) {
    // Try Accept-Language header first (e.g. en-US -> US, en-IN -> IN, de-DE -> DE)
    const acceptLang = headers.get("accept-language") || "";
    const langMatch = acceptLang.match(/[a-z]{2}-([A-Z]{2})/);
    if (langMatch && langMatch[1]) {
      const result: GeoLocationResult = {
        country: langMatch[1].toUpperCase(),
        region: "Local Development",
        city: "Localhost",
      };
      geoCache.set(ip, result);
      return result;
    }

    // Try fast self IP lookup for local development machine
    try {
      const selfRes = await fetch("https://api.country.is/", {
        signal: AbortSignal.timeout(2000),
      });
      if (selfRes.ok) {
        const data = await selfRes.json();
        if (data.country) {
          const result: GeoLocationResult = {
            country: String(data.country).toUpperCase(),
            region: "Local Development",
            city: "Localhost",
          };
          geoCache.set(ip, result);
          return result;
        }
      }
    } catch {
      // Ignore
    }

    return { country: "Local", region: "Local", city: "Localhost" };
  }

  // 4. Public IP Geo-Resolution via fast free APIs with cache
  try {
    const res = await fetch(
      `http://ip-api.com/json/${encodeURIComponent(ip)}?fields=countryCode,regionName,city`,
      {
        signal: AbortSignal.timeout(2000),
      }
    );
    if (res.ok) {
      const data = await res.json();
      if (data.countryCode) {
        const result: GeoLocationResult = {
          country: String(data.countryCode).toUpperCase(),
          region: data.regionName || "Unknown",
          city: data.city || "Unknown",
        };
        geoCache.set(ip, result);
        return result;
      }
    }
  } catch {
    // Fallback to secondary country.is API
    try {
      const backupRes = await fetch(`https://api.country.is/${encodeURIComponent(ip)}`, {
        signal: AbortSignal.timeout(2000),
      });
      if (backupRes.ok) {
        const data = await backupRes.json();
        if (data.country) {
          const result: GeoLocationResult = {
            country: String(data.country).toUpperCase(),
            region: "Unknown",
            city: "Unknown",
          };
          geoCache.set(ip, result);
          return result;
        }
      }
    } catch {
      // Ignore
    }
  }

  const fallback: GeoLocationResult = { country: "Unknown", region: "Unknown", city: "Unknown" };
  geoCache.set(ip, fallback);
  return fallback;
}

export function parseUserAgent(uaString: string | null): {
  browser: string;
  browserVersion: string;
  os: string;
  deviceType: "desktop" | "mobile" | "tablet" | "unknown";
} {
  if (!uaString) {
    return {
      browser: "Unknown",
      browserVersion: "",
      os: "Unknown",
      deviceType: "unknown",
    };
  }

  const ua = uaString.toLowerCase();

  // Device detection
  let deviceType: "desktop" | "mobile" | "tablet" | "unknown" = "desktop";
  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
    deviceType = "tablet";
  } else if (
    /mobile|iphone|ipod|blackberry|opera mini|iemobile|mobile/i.test(ua)
  ) {
    deviceType = "mobile";
  }

  // OS detection
  let os = "Other";
  if (ua.includes("windows")) os = "Windows";
  else if (ua.includes("iphone") || ua.includes("ipad") || ua.includes("ipod")) os = "iOS";
  else if (ua.includes("mac os") || ua.includes("macintosh")) os = "macOS";
  else if (ua.includes("android")) os = "Android";
  else if (ua.includes("linux")) os = "Linux";
  else if (ua.includes("cros")) os = "ChromeOS";

  // Browser detection
  let browser = "Other";
  let browserVersion = "";

  if (ua.includes("edg/")) {
    browser = "Edge";
    browserVersion = ua.split("edg/")[1]?.split(" ")[0] || "";
  } else if (ua.includes("chrome/") && !ua.includes("edg/")) {
    browser = "Chrome";
    browserVersion = ua.split("chrome/")[1]?.split(" ")[0] || "";
  } else if (ua.includes("safari/") && !ua.includes("chrome/")) {
    browser = "Safari";
    browserVersion = ua.split("version/")[1]?.split(" ")[0] || "";
  } else if (ua.includes("firefox/")) {
    browser = "Firefox";
    browserVersion = ua.split("firefox/")[1]?.split(" ")[0] || "";
  } else if (ua.includes("opr/") || ua.includes("opera/")) {
    browser = "Opera";
    browserVersion = ua.split("opr/")[1]?.split(" ")[0] || "";
  }

  return {
    browser,
    browserVersion: browserVersion.split(".")[0] || "",
    os,
    deviceType,
  };
}

export function detectPlatform(urlStr: string): string {
  try {
    const url = new URL(urlStr);
    const host = url.hostname.toLowerCase();

    if (host.includes("youtube.com") || host.includes("youtu.be")) return "YouTube";
    if (host.includes("facebook.com") || host.includes("fb.watch")) return "Facebook";
    if (host.includes("instagram.com")) return "Instagram";
    if (host.includes("vimeo.com")) return "Vimeo";
    if (host.includes("dailymotion.com") || host.includes("dai.ly")) return "Dailymotion";
    if (host.includes("twitch.tv")) return "Twitch";
    if (host.includes("pinterest.com") || host.includes("pin.it")) return "Pinterest";
    if (
      host.includes("terabox") ||
      host.includes("1024tera") ||
      host.includes("nephobox") ||
      host.includes("4funbox") ||
      host.includes("mirrobox") ||
      host.includes("momerybox") ||
      host.includes("tibibox") ||
      host.includes("freeterabox")
    ) {
      return "TeraBox";
    }
    if (host.includes("diskwala")) return "Diskwala";
    if (host.includes("flezen")) return "Flezen";

    return host.replace(/^www\./, "");
  } catch {
    return "Unknown";
  }
}

export function normalizeSubmittedUrl(urlStr: string): string {
  try {
    const parsed = new URL(urlStr.trim());
    // Strip common tracking and session parameters
    const paramsToStrip = [
      "utm_source",
      "utm_medium",
      "utm_campaign",
      "utm_term",
      "utm_content",
      "fbclid",
      "gclid",
      "si",
      "feature",
    ];
    for (const p of paramsToStrip) {
      parsed.searchParams.delete(p);
    }
    return parsed.toString();
  } catch {
    return urlStr.trim();
  }
}

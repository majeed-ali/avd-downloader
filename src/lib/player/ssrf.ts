export function validatePublicUrl(rawUrl: string): { valid: boolean; url?: URL; error?: string } {
  try {
    const url = new URL(rawUrl.trim());

    if (url.protocol !== "https:" && url.protocol !== "http:") {
      return { valid: false, error: "Only HTTP and HTTPS protocols are supported" };
    }

    const hostname = url.hostname.toLowerCase();

    // Check for loopback, localhost, and local domain names
    if (
      hostname === "localhost" ||
      hostname.endsWith(".localhost") ||
      hostname.endsWith(".local") ||
      hostname.endsWith(".internal") ||
      hostname === "0.0.0.0"
    ) {
      return { valid: false, error: "Access to local network resources is restricted" };
    }

    // Check for private IPv4 addresses
    const ipv4Match = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/.exec(hostname);
    if (ipv4Match) {
      const octet1 = parseInt(ipv4Match[1], 10);
      const octet2 = parseInt(ipv4Match[2], 10);

      // 127.0.0.0/8 (Loopback)
      if (octet1 === 127) return { valid: false, error: "Access to loopback IP is forbidden" };
      // 10.0.0.0/8 (Private)
      if (octet1 === 10) return { valid: false, error: "Access to private network IP is forbidden" };
      // 172.16.0.0/12 (Private)
      if (octet1 === 172 && octet2 >= 16 && octet2 <= 31) {
        return { valid: false, error: "Access to private network IP is forbidden" };
      }
      // 192.168.0.0/16 (Private)
      if (octet1 === 192 && octet2 === 168) {
        return { valid: false, error: "Access to private network IP is forbidden" };
      }
      // 169.254.0.0/16 (Link-local / cloud metadata)
      if (octet1 === 169 && octet2 === 254) {
        return { valid: false, error: "Access to link-local/cloud metadata IP is forbidden" };
      }
      // 0.0.0.0/8
      if (octet1 === 0) return { valid: false, error: "Access to zero network is forbidden" };
    }

    // Check for IPv6 addresses
    if (hostname.startsWith("[") || hostname.includes(":")) {
      const cleanIp = hostname.replace(/^\[|\]$/g, "");
      if (
        cleanIp === "::1" ||
        cleanIp === "::" ||
        cleanIp.startsWith("fe80:") ||
        cleanIp.startsWith("fc") ||
        cleanIp.startsWith("fd")
      ) {
        return { valid: false, error: "Access to private/loopback IPv6 is forbidden" };
      }
    }

    return { valid: true, url };
  } catch {
    return { valid: false, error: "The provided string is not a valid URL" };
  }
}

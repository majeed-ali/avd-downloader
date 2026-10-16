import { DomainAdapter, PlayerResolutionResult } from "../types";

export const diskwalaAdapter: DomainAdapter = {
  name: "Diskwala Adapter",
  supportedDomains: ["diskwala.com"],

  canHandle(url: URL): boolean {
    const hostname = url.hostname.toLowerCase().replace(/^www\./, "");
    return hostname === "diskwala.com" || hostname.endsWith(".diskwala.com");
  },

  async resolve(url: URL): Promise<PlayerResolutionResult> {
    const domain = "diskwala.com";
    const path = url.pathname;

    // Diskwala links typically have format /p/xxxx or /v/xxxx or /s/xxxx
    const match = /\/(p|v|s|d)\/([a-zA-Z0-9_-]+)/i.exec(path);
    const slug = match ? match[2] : path.replace(/^\//, "");

    if (!slug) {
      return {
        success: false,
        platform: "Diskwala",
        domain,
        title: "",
        errorCategory: "invalid_url",
        error: "Invalid Diskwala URL format. Please provide a valid file or video link.",
      };
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 9000);

      const targetUrl = `https://diskwala.com/api/file/${encodeURIComponent(slug)}`;
      const response = await fetch(targetUrl, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          Accept: "application/json, text/html, */*",
        },
        signal: controller.signal,
        cache: "no-store",
      });

      clearTimeout(timeoutId);

      if (response.status === 404) {
        return {
          success: false,
          platform: "Diskwala",
          domain,
          title: "File Not Found",
          errorCategory: "expired_or_deleted",
          error: "The requested Diskwala file does not exist or has been deleted.",
        };
      }

      if (response.ok) {
        const text = await response.text();
        let data: any = {};
        try {
          data = JSON.parse(text);
        } catch {
          // If HTML returned, check for video tags or title
          const titleMatch = /<title>(.*?)<\/title>/i.exec(text);
          const videoMatch = /<source[^>]+src=["']([^"']+)["']/i.exec(text);
          if (videoMatch && videoMatch[1]) {
            return {
              success: true,
              platform: "Diskwala",
              domain,
              title: titleMatch ? titleMatch[1].replace(/ - Diskwala$/i, "") : "Diskwala Video",
              streamUrl: videoMatch[1],
              downloadUrl: videoMatch[1],
              mediaType: "video/mp4",
            };
          }
        }

        if (data.download_url || data.stream_url) {
          const directUrl = data.stream_url || data.download_url;
          return {
            success: true,
            platform: "Diskwala",
            domain,
            title: data.filename || data.title || "Diskwala Video",
            thumbnail: data.thumbnail || undefined,
            fileSizeFormatted: data.size || undefined,
            streamUrl: directUrl,
            downloadUrl: directUrl,
            mediaType: "video/mp4",
          };
        }
      }

      return {
        success: false,
        platform: "Diskwala",
        domain,
        title: "",
        errorCategory: "not_playable",
        error: "Diskwala file is currently restricted or requires direct web authorization.",
      };
    } catch (err: any) {
      return {
        success: false,
        platform: "Diskwala",
        domain,
        title: "",
        errorCategory: "network_error",
        error: `Could not reach Diskwala service: ${err.message || "Timeout"}`,
      };
    }
  },
};

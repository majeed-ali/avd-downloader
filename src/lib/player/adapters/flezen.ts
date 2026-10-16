import { DomainAdapter, PlayerResolutionResult } from "../types";

export const flezenAdapter: DomainAdapter = {
  name: "Flezen Adapter",
  supportedDomains: ["flezen.com"],

  canHandle(url: URL): boolean {
    const hostname = url.hostname.toLowerCase().replace(/^www\./, "");
    return hostname === "flezen.com" || hostname.endsWith(".flezen.com");
  },

  async resolve(url: URL): Promise<PlayerResolutionResult> {
    const domain = "flezen.com";
    const path = url.pathname;

    const match = /\/(f|v|p|d|s)\/([a-zA-Z0-9_-]+)/i.exec(path);
    const slug = match ? match[2] : path.replace(/^\//, "");

    if (!slug) {
      return {
        success: false,
        platform: "Flezen",
        domain,
        title: "",
        errorCategory: "invalid_url",
        error: "Invalid Flezen URL format. Please provide a valid file or video link.",
      };
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 9000);

      const targetUrl = `https://flezen.com/api/file/${encodeURIComponent(slug)}`;
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
          platform: "Flezen",
          domain,
          title: "File Not Found",
          errorCategory: "expired_or_deleted",
          error: "The requested Flezen file does not exist or has expired.",
        };
      }

      if (response.ok) {
        const text = await response.text();
        let data: any = {};
        try {
          data = JSON.parse(text);
        } catch {
          const titleMatch = /<title>(.*?)<\/title>/i.exec(text);
          const videoMatch = /<source[^>]+src=["']([^"']+)["']/i.exec(text);
          if (videoMatch && videoMatch[1]) {
            return {
              success: true,
              platform: "Flezen",
              domain,
              title: titleMatch ? titleMatch[1].replace(/ - Flezen$/i, "") : "Flezen Video",
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
            platform: "Flezen",
            domain,
            title: data.filename || data.title || "Flezen Video",
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
        platform: "Flezen",
        domain,
        title: "",
        errorCategory: "not_playable",
        error: "Flezen file is currently inaccessible or requires account login.",
      };
    } catch (err: any) {
      return {
        success: false,
        platform: "Flezen",
        domain,
        title: "",
        errorCategory: "network_error",
        error: `Could not reach Flezen service: ${err.message || "Timeout"}`,
      };
    }
  },
};

import { DomainAdapter, PlayerResolutionResult } from "../types";

const TERABOX_DOMAINS = [
  "terabox.com",
  "1024terabox.com",
  "1024tera.com",
  "terabox.app",
  "teraboxapp.com",
  "terasharelink.com",
  "teraboxshare.com",
  "teraboxlink.com",
  "teraboxurl.com",
  "terafileshare.com",
  "nephobox.com",
  "4funbox.com",
  "mirrobox.com",
  "momerybox.com",
  "tibibox.com",
  "freeterabox.com",
];

function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

export function extractTeraBoxKey(url: URL): string | null {
  // Pattern 1: Query parameter ?surl=xxxx
  const surlParam = url.searchParams.get("surl");
  if (surlParam) {
    return surlParam.startsWith("1") ? surlParam : `1${surlParam}`;
  }

  // Pattern 2: /s/1xxxx or /s/xxxx
  const pathParts = url.pathname.split("/").filter(Boolean);
  const sIndex = pathParts.indexOf("s");
  if (sIndex !== -1 && pathParts[sIndex + 1]) {
    const rawKey = pathParts[sIndex + 1];
    return rawKey.startsWith("1") ? rawKey : `1${rawKey}`;
  }

  // Pattern 3: /sharing/link?surl=xxxx or any path ending with /s/key
  const path = url.pathname;
  const match = /\/s\/([a-zA-Z0-9_-]+)/.exec(path);
  if (match && match[1]) {
    const rawKey = match[1];
    return rawKey.startsWith("1") ? rawKey : `1${rawKey}`;
  }

  // Pattern 4: Last segment of pathname if long alphanumeric key (e.g. 1xxxx)
  if (pathParts.length > 0) {
    const lastPart = pathParts[pathParts.length - 1];
    if (lastPart.length >= 15 && /^[a-zA-Z0-9_-]+$/.test(lastPart)) {
      return lastPart.startsWith("1") ? lastPart : `1${lastPart}`;
    }
  }

  return null;
}

export const teraboxAdapter: DomainAdapter = {
  name: "TeraBox Family Adapter",
  supportedDomains: TERABOX_DOMAINS,

  canHandle(url: URL): boolean {
    const hostname = url.hostname.toLowerCase().replace(/^www\./, "");
    if (hostname.includes("terabox") || hostname.includes("1024tera")) {
      return true;
    }
    return TERABOX_DOMAINS.some(
      (domain) => hostname === domain || hostname.endsWith(`.${domain}`)
    );
  },

  async resolve(url: URL): Promise<PlayerResolutionResult> {
    const domain = url.hostname.toLowerCase().replace(/^www\./, "");
    const shortKey = extractTeraBoxKey(url);

    if (!shortKey) {
      return {
        success: false,
        platform: "TeraBox",
        domain,
        title: "",
        errorCategory: "invalid_url",
        error: `Could not locate a valid TeraBox share key in the URL. Links should look like terabox.com/s/1xxxx, 1024terabox.com/s/1xxxx, or contain a ?surl= parameter.`,
      };
    }

    const cleanKey = shortKey.replace(/^1/, "");
    let lastError = "Could not resolve stream from TeraBox link";

    // ============================================================
    // PIPELINE 1: Direct Native TeraBox HLS Streaming & Folder Resolution
    // ============================================================
    try {
      const initController = new AbortController();
      const initTimeout = setTimeout(() => initController.abort(), 6000);

      // 1. Establish session cookies with TeraBox
      const initRes = await fetch(`https://www.terabox.app/sharing/link?surl=${cleanKey}`, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        },
        signal: initController.signal,
        cache: "no-store",
      });

      clearTimeout(initTimeout);

      const cookies = initRes.headers.getSetCookie
        ? initRes.headers.getSetCookie().join("; ")
        : initRes.headers.get("set-cookie") || "";

      // 2. Query shorturlinfo using valid session headers
      const infoController = new AbortController();
      const infoTimeout = setTimeout(() => infoController.abort(), 6000);

      const infoRes = await fetch(
        `https://www.terabox.app/api/shorturlinfo?shorturl=1${cleanKey}&root=1`,
        {
          headers: {
            "User-Agent":
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            Cookie: cookies,
            Referer: `https://www.terabox.app/sharing/link?surl=${cleanKey}`,
          },
          signal: infoController.signal,
          cache: "no-store",
        }
      );

      clearTimeout(infoTimeout);

      if (infoRes.ok) {
        const meta = await infoRes.json();

        // Check if password protected
        if (meta.errno === -9 || meta.need_password === 1) {
          return {
            success: false,
            platform: "TeraBox",
            domain,
            title: "Password Protected File",
            errorCategory: "password_protected",
            error:
              "This cloud video is password-protected by the owner. Password-protected files cannot be accessed without owner credentials.",
          };
        }

        // Check if expired or cancelled
        if (meta.errno === 100004 || meta.errno === 100002) {
          return {
            success: false,
            platform: "TeraBox",
            domain,
            title: "Expired or Removed File",
            errorCategory: "expired_or_deleted",
            error: "This share link has expired or was cancelled by the uploader.",
          };
        }

        if (meta.errno === 0 && meta.uk && meta.shareid) {
          let allFiles: any[] = [];

          // If the share root is a folder/directory (e.g. /2026-01-03 09-07)
          if (
            Array.isArray(meta.list) &&
            meta.list.length > 0 &&
            (meta.list[0].isdir === "1" || meta.list[0].isdir === 1)
          ) {
            try {
              const folderPath = meta.list[0].path;
              const listRes = await fetch(
                `https://www.terabox.com/share/list?app_id=250528&web=1&channel=dubox&clienttype=0&shorturl=${encodeURIComponent(
                  cleanKey
                )}&dir=${encodeURIComponent(folderPath)}&root=0`,
                {
                  headers: {
                    "User-Agent":
                      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
                    Referer: "https://www.terabox.com/",
                  },
                  cache: "no-store",
                }
              );

              if (listRes.ok) {
                const listData = await listRes.json();
                allFiles = listData.list || [];
              }
            } catch {
              allFiles = meta.list;
            }
          } else {
            allFiles = meta.list || [];
          }

          // Filter for playable video items
          const videoItems = allFiles.filter((f) => {
            const name = String(f.server_filename || f.filename || "").toLowerCase();
            return (
              name.endsWith(".mp4") ||
              name.endsWith(".mkv") ||
              name.endsWith(".webm") ||
              name.endsWith(".mov") ||
              name.endsWith(".avi") ||
              f.category === 1 ||
              f.category === "1"
            );
          });

          const primaryFile = videoItems[0] || allFiles[0];

          if (primaryFile && primaryFile.fs_id) {
            const title =
              primaryFile.server_filename ||
              primaryFile.filename ||
              meta.title ||
              "TeraBox Cloud Video";
            const sizeBytes = Number(primaryFile.size || 0);

            const thumbnail =
              primaryFile.thumbs?.url3 ||
              primaryFile.thumbs?.url2 ||
              primaryFile.thumbs?.url1 ||
              primaryFile.thumbs?.icon ||
              undefined;

            const streamUrl = `/api/player/stream?uk=${encodeURIComponent(
              meta.uk
            )}&shareid=${encodeURIComponent(meta.shareid)}&sign=${encodeURIComponent(
              meta.sign
            )}&timestamp=${encodeURIComponent(
              meta.timestamp
            )}&randsk=${encodeURIComponent(meta.randsk || "")}&fid=${encodeURIComponent(
              primaryFile.fs_id
            )}&type=M3U8_FLV_264_480`;

            const qualities = videoItems.slice(0, 15).map((vf, idx) => ({
              label: vf.server_filename || vf.filename || `Video ${idx + 1}`,
              url: `/api/player/stream?uk=${encodeURIComponent(
                meta.uk
              )}&shareid=${encodeURIComponent(meta.shareid)}&sign=${encodeURIComponent(
                meta.sign
              )}&timestamp=${encodeURIComponent(
                meta.timestamp
              )}&randsk=${encodeURIComponent(meta.randsk || "")}&fid=${encodeURIComponent(
                vf.fs_id
              )}&type=M3U8_FLV_264_480`,
              sizeBytes: Number(vf.size || 0),
            }));

            return {
              success: true,
              platform: "TeraBox",
              domain,
              title,
              thumbnail,
              fileSize: sizeBytes > 0 ? sizeBytes : undefined,
              fileSizeFormatted: sizeBytes > 0 ? formatBytes(sizeBytes) : undefined,
              resolution: "480p",
              streamUrl,
              downloadUrl: streamUrl,
              mediaType: "application/x-mpegURL",
              qualities: qualities.length > 1 ? qualities : undefined,
            };
          }
        }
      }
    } catch (err: any) {
      lastError = err.message || "Direct stream resolution error";
    }

    // ============================================================
    // PIPELINE 2: Fallback to Candidate API Endpoints
    // ============================================================
    const candidateEndpoints = [
      `https://www.terabox.com/share/list?app_id=250528&web=1&channel=dubox&clienttype=0&shorturl=${encodeURIComponent(
        cleanKey
      )}&root=1`,
      `https://www.terabox.app/api/shorturlinfo?shorturl=${encodeURIComponent(
        shortKey
      )}&root=1`,
      `https://www.1024terabox.com/api/shorturlinfo?shorturl=${encodeURIComponent(
        shortKey
      )}&root=1`,
    ];

    for (const targetApi of candidateEndpoints) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 6000);

        const response = await fetch(targetApi, {
          method: "GET",
          headers: {
            "User-Agent":
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            Accept: "application/json, text/plain, */*",
            Referer: "https://www.terabox.com/",
          },
          signal: controller.signal,
          cache: "no-store",
        });

        clearTimeout(timeoutId);

        if (!response.ok) continue;

        const data = await response.json();
        const fileList = data.list || data.data?.list || [];

        if (Array.isArray(fileList) && fileList.length > 0) {
          const primaryFile =
            fileList.find((f: any) => {
              const name = String(f.server_filename || "").toLowerCase();
              return (
                name.endsWith(".mp4") ||
                name.endsWith(".mkv") ||
                name.endsWith(".webm") ||
                f.category === 1
              );
            }) || fileList[0];

          const title =
            primaryFile.server_filename || primaryFile.filename || "TeraBox Shared Video";
          const sizeBytes = Number(primaryFile.size || 0);
          const thumbnail =
            primaryFile.thumbs?.url3 ||
            primaryFile.thumbs?.url2 ||
            primaryFile.thumbs?.url1 ||
            undefined;
          const directUrl = primaryFile.dlink || primaryFile.download_url || undefined;

          if (directUrl) {
            return {
              success: true,
              platform: "TeraBox",
              domain,
              title,
              thumbnail,
              fileSize: sizeBytes > 0 ? sizeBytes : undefined,
              fileSizeFormatted: sizeBytes > 0 ? formatBytes(sizeBytes) : undefined,
              streamUrl: directUrl,
              downloadUrl: directUrl,
              mediaType: "video/mp4",
            };
          }
        }
      } catch (err: any) {
        lastError = err.message || "Candidate query error";
      }
    }

    return {
      success: false,
      platform: "TeraBox",
      domain,
      title: "",
      errorCategory: "not_playable",
      error: `Could not retrieve a playable stream for this link. It may be restricted by the uploader, expired, or temporarily inaccessible. (${lastError})`,
    };
  },
};

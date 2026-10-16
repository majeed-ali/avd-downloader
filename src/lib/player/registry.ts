import { DomainAdapter, PlayerResolutionResult } from "./types";
import { validatePublicUrl } from "./ssrf";
import { teraboxAdapter } from "./adapters/terabox";
import { diskwalaAdapter } from "./adapters/diskwala";
import { flezenAdapter } from "./adapters/flezen";

export const REGISTERED_ADAPTERS: DomainAdapter[] = [
  teraboxAdapter,
  diskwalaAdapter,
  flezenAdapter,
];

export const ALL_SUPPORTED_PLAYER_DOMAINS = REGISTERED_ADAPTERS.flatMap(
  (a) => a.supportedDomains
);

export function findAdapterForUrl(url: URL): DomainAdapter | undefined {
  return REGISTERED_ADAPTERS.find((adapter) => adapter.canHandle(url));
}

export function isDomainSupportedForPlayer(urlStr: string): boolean {
  try {
    const url = new URL(urlStr.trim());
    return Boolean(findAdapterForUrl(url));
  } catch {
    return false;
  }
}

export async function resolvePlayerUrl(rawUrl: string): Promise<PlayerResolutionResult> {
  const ssrfCheck = validatePublicUrl(rawUrl);
  if (!ssrfCheck.valid || !ssrfCheck.url) {
    return {
      success: false,
      platform: "Unknown",
      domain: "",
      title: "",
      errorCategory: "invalid_url",
      error: ssrfCheck.error || "Invalid or restricted URL provided",
    };
  }

  const url = ssrfCheck.url;
  const domain = url.hostname.toLowerCase().replace(/^www\./, "");
  const adapter = findAdapterForUrl(url);

  if (!adapter) {
    return {
      success: false,
      platform: "Unsupported",
      domain,
      title: "",
      errorCategory: "unsupported_domain",
      error: `Domain "${domain}" is not in the supported list for TeraBox Downloader. Supported domains: ${ALL_SUPPORTED_PLAYER_DOMAINS.join(", ")}`,
    };
  }

  return await adapter.resolve(url);
}

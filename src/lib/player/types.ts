export interface VideoQualityOption {
  label: string;
  url: string;
  resolution?: string;
  sizeBytes?: number;
}

export interface PlayerResolutionResult {
  success: boolean;
  platform: string;
  domain: string;
  title: string;
  thumbnail?: string;
  duration?: number;
  durationFormatted?: string;
  fileSize?: number;
  fileSizeFormatted?: string;
  resolution?: string;
  streamUrl?: string;
  downloadUrl?: string;
  mediaType?: "video/mp4" | "application/x-mpegURL" | "video/webm" | "unknown";
  qualities?: VideoQualityOption[];
  error?: string;
  errorCategory?:
    | "unsupported_domain"
    | "password_protected"
    | "expired_or_deleted"
    | "rate_limited"
    | "not_playable"
    | "invalid_url"
    | "network_error"
    | "access_denied";
  submissionId?: string;
}

export interface DomainAdapter {
  name: string;
  supportedDomains: string[];
  canHandle(url: URL): boolean;
  resolve(url: URL): Promise<PlayerResolutionResult>;
}

"use client";

import { useState, useRef, useEffect } from "react";
import { PlayerResolutionResult } from "@/lib/player/types";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Download,
  Copy,
  Check,
  RotateCcw,
  AlertCircle,
  Loader2,
  Film,
  ExternalLink,
  ClipboardPaste,
} from "lucide-react";

interface OnlinePlayerProps {
  locale: string;
  translations?: {
    placeholder?: string;
    paste?: string;
    clear?: string;
    watch?: string;
    analyzing?: string;
    supportedDomains?: string;
    download?: string;
    copyLink?: string;
    copied?: string;
    previewTitle?: string;
    fileSize?: string;
    errorTitle?: string;
  };
}

const SUPPORTED_CLOUD_DOMAINS = [
  "terabox.com",
  "1024terabox.com",
  "1024tera.com",
  "terabox.app",
  "teraboxapp.com",
  "nephobox.com",
  "4funbox.com",
  "mirrobox.com",
  "momerybox.com",
  "tibibox.com",
  "freeterabox.com",
  "diskwala.com",
  "flezen.com",
];

export function OnlineVideoPlayer({ locale, translations }: OnlinePlayerProps) {
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<PlayerResolutionResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [selectedQuality, setSelectedQuality] = useState<string>("");

  // Video playback state
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const playTrackedRef = useRef(false);

  // Initialize and attach HLS stream or native stream
  useEffect(() => {
    const video = videoRef.current;
    const currentStream = selectedQuality || result?.streamUrl;
    if (!video || !currentStream) return;

    let hlsInstance: any = null;

    if (currentStream.includes(".m3u8") || currentStream.includes("/api/player/stream")) {
      if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = currentStream;
      } else {
        import("hls.js")
          .then(({ default: Hls }) => {
            if (Hls.isSupported()) {
              hlsInstance = new Hls({
                enableWorker: true,
                lowLatencyMode: false,
                backBufferLength: 90,
              });
              hlsInstance.loadSource(currentStream);
              hlsInstance.attachMedia(video);

              hlsInstance.on(Hls.Events.ERROR, (_event: any, data: any) => {
                if (data.fatal) {
                  switch (data.type) {
                    case Hls.ErrorTypes.NETWORK_ERROR:
                      hlsInstance.startLoad();
                      break;
                    case Hls.ErrorTypes.MEDIA_ERROR:
                      hlsInstance.recoverMediaError();
                      break;
                    default:
                      hlsInstance.destroy();
                      break;
                  }
                }
              });
            } else {
              video.src = currentStream;
            }
          })
          .catch(() => {
            video.src = currentStream;
          });
      }
    } else {
      video.src = currentStream;
    }

    return () => {
      if (hlsInstance) {
        hlsInstance.destroy();
      }
    };
  }, [selectedQuality, result?.streamUrl]);

  const t = {
    placeholder: translations?.placeholder || "Paste TeraBox link (e.g. 1024terabox.com/s/1... or terabox.com/s/1...)",
    paste: translations?.paste || "Paste",
    clear: translations?.clear || "Clear",
    watch: translations?.watch || "Watch & Download",
    analyzing: translations?.analyzing || "Analyzing video link…",
    supportedDomains: translations?.supportedDomains || "Supported Platforms",
    download: translations?.download || "Download Video",
    copyLink: translations?.copyLink || "Copy Link",
    copied: translations?.copied || "Copied!",
    previewTitle: translations?.previewTitle || "Video Ready to Stream",
    fileSize: translations?.fileSize || "File Size",
    errorTitle: translations?.errorTitle || "Playback Notice",
  };

  const handlePaste = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.readText) {
        const text = await navigator.clipboard.readText();
        if (text) {
          setUrl(text.trim());
          setError(null);
        }
      }
    } catch {
      // Browser permission prompt declined or unsupported
    }
  };

  const handleClear = () => {
    setUrl("");
    setResult(null);
    setError(null);
    setIsPlaying(false);
    playTrackedRef.current = false;
  };

  const handleAnalyze = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const targetUrl = url.trim();
    if (!targetUrl) return;

    setIsLoading(true);
    setError(null);
    setResult(null);
    setIsPlaying(false);
    playTrackedRef.current = false;

    try {
      const res = await fetch("/api/player/resolve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: targetUrl, locale }),
      });

      const data: PlayerResolutionResult = await res.json();

      if (!data.success) {
        setError(data.error || "Could not resolve a playable stream from this link.");
      } else {
        setResult(data);
        if (data.qualities && data.qualities.length > 0) {
          setSelectedQuality(data.qualities[0].url);
        }
      }
    } catch (err: any) {
      setError("An unexpected network error occurred. Please check your connection and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePlayToggle = () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      video.play().catch(() => {});
      setIsPlaying(true);

      // Track play event once per resolved submission
      if (!playTrackedRef.current && result?.submissionId) {
        playTrackedRef.current = true;
        fetch("/api/track/event", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            submissionId: result.submissionId,
            eventType: "video_played",
          }),
        }).catch(() => {});
      }
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  const handleMuteToggle = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setIsMuted(video.muted);
  };

  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (!video || !video.duration) return;
    setProgress((video.currentTime / video.duration) * 100);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current;
    if (!video || !video.duration) return;
    const seekTime = (parseFloat(e.target.value) / 100) * video.duration;
    video.currentTime = seekTime;
    setProgress(parseFloat(e.target.value));
  };

  const handleFullscreen = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.requestFullscreen) {
      video.requestFullscreen();
    }
  };

  const handleSpeedChange = (speed: number) => {
    const video = videoRef.current;
    if (!video) return;
    video.playbackRate = speed;
    setPlaybackSpeed(speed);
  };

  const handleCopyLink = () => {
    if (url) {
      navigator.clipboard.writeText(url).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    }
  };

  const handleDownloadClick = () => {
    if (result?.submissionId) {
      fetch("/api/track/event", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          submissionId: result.submissionId,
          eventType: "download_clicked",
        }),
      }).catch(() => {});
    }
  };

  const formatSeconds = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const secs = Math.floor(sec % 60);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8">
      {/* INPUT FORM */}
      <form
        onSubmit={handleAnalyze}
        className="rounded-3xl bg-white dark:bg-[#0b101e] border border-slate-200 dark:border-slate-800/80 p-4 sm:p-6 shadow-[0_15px_40px_rgba(0,0,0,0.06)] dark:shadow-[0_15px_40px_rgba(0,0,0,0.3)] transition-all"
      >
        <div className="relative flex flex-col md:flex-row items-stretch gap-3">
          <div className="relative flex-1">
            <input
              type="url"
              value={url}
              onChange={(e) => {
                setUrl(e.target.value);
                if (error) setError(null);
              }}
              placeholder={t.placeholder}
              className="w-full h-14 pl-4 pr-24 rounded-2xl bg-slate-50 dark:bg-[#070b14] border border-slate-200 dark:border-slate-700/80 text-slate-900 dark:text-slate-100 placeholder-slate-400 font-normal text-sm sm:text-base outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all"
            />
            <div className="absolute right-2 top-2 bottom-2 flex items-center gap-1">
              {url && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="px-2.5 py-1.5 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                >
                  {t.clear}
                </button>
              )}
              <button
                type="button"
                onClick={handlePaste}
                title="Paste from clipboard"
                className="px-2.5 py-1.5 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors flex items-center gap-1"
              >
                <ClipboardPaste className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{t.paste}</span>
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={!url.trim() || isLoading}
            className="h-14 px-8 rounded-2xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-sm sm:text-base shadow-lg shadow-cyan-600/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 whitespace-nowrap"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>{t.analyzing}</span>
              </>
            ) : (
              <>
                <Play className="w-5 h-5 fill-current" />
                <span>{t.watch}</span>
              </>
            )}
          </button>
        </div>

        {/* SUPPORTED DOMAINS PILLS */}
        <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800/80">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
            {t.supportedDomains}:
          </p>
          <div className="flex flex-wrap gap-1.5">
            {SUPPORTED_CLOUD_DOMAINS.map((dom) => (
              <span
                key={dom}
                className="inline-flex items-center text-[11px] px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 font-mono"
              >
                {dom}
              </span>
            ))}
          </div>
        </div>
      </form>

      {/* ERROR NOTICE */}
      {error && (
        <div className="rounded-2xl border border-amber-500/40 bg-amber-50/80 dark:bg-amber-950/20 p-5 text-amber-900 dark:text-amber-200 shadow-sm flex items-start gap-3.5 animate-fadeIn">
          <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="font-bold text-sm">{t.errorTitle}</h4>
            <p className="text-xs sm:text-sm font-light leading-relaxed">{error}</p>
          </div>
        </div>
      )}

      {/* RESOLUTION RESULT / VIDEO PLAYER */}
      {result && result.success && (
        <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0a0e1a] overflow-hidden shadow-xl shadow-slate-900/5 animate-fadeIn">
          {/* PLAYER CONTAINER */}
          <div className="relative aspect-video w-full bg-black flex items-center justify-center overflow-hidden group">
            {result.streamUrl ? (
              <>
                <video
                  ref={videoRef}
                  poster={result.thumbnail}
                  onTimeUpdate={handleTimeUpdate}
                  onLoadedMetadata={() => {
                    if (videoRef.current) setDuration(videoRef.current.duration);
                  }}
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                  className="w-full h-full object-contain cursor-pointer"
                  onClick={handlePlayToggle}
                  playsInline
                />

                {/* OVERLAY PLAY BUTTON WHEN PAUSED */}
                {!isPlaying && (
                  <button
                    onClick={handlePlayToggle}
                    aria-label="Play Video"
                    className="absolute inset-0 m-auto w-16 h-16 rounded-full bg-cyan-600/90 text-white flex items-center justify-center shadow-2xl hover:scale-110 transition-transform"
                  >
                    <Play className="w-8 h-8 fill-current ml-1" />
                  </button>
                )}

                {/* BOTTOM CONTROLS BAR */}
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                  {/* SEEK BAR */}
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={progress}
                    onChange={handleSeek}
                    className="w-full h-1.5 mb-3 bg-white/20 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                  />

                  <div className="flex items-center justify-between text-white text-xs sm:text-sm">
                    <div className="flex items-center gap-3">
                      <button onClick={handlePlayToggle} className="hover:text-cyan-400 transition-colors">
                        {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current" />}
                      </button>

                      <button onClick={handleMuteToggle} className="hover:text-cyan-400 transition-colors">
                        {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                      </button>

                      <span className="font-mono text-xs text-slate-300">
                        {formatSeconds(videoRef.current?.currentTime || 0)} / {formatSeconds(duration || 0)}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      {/* SPEED SELECTOR */}
                      <div className="flex items-center gap-1 text-[11px] font-semibold">
                        {[1, 1.25, 1.5, 2].map((sp) => (
                          <button
                            key={sp}
                            onClick={() => handleSpeedChange(sp)}
                            className={`px-1.5 py-0.5 rounded ${
                              playbackSpeed === sp ? "bg-cyan-500 text-black font-bold" : "text-white/70 hover:text-white"
                            }`}
                          >
                            {sp}x
                          </button>
                        ))}
                      </div>

                      <button onClick={handleFullscreen} className="hover:text-cyan-400 transition-colors">
                        <Maximize className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="p-8 text-center text-slate-300 space-y-3">
                <Film className="w-12 h-12 mx-auto text-slate-500" />
                <p className="text-sm font-medium">Direct in-browser stream preview is not permitted by this host.</p>
                <p className="text-xs text-slate-400 max-w-md mx-auto">
                  Use the verified direct download button below to access the file safely.
                </p>
              </div>
            )}
          </div>

          {/* META & ACTIONS BAR */}
          <div className="p-6 space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-cyan-100 dark:bg-cyan-950 text-cyan-800 dark:text-cyan-300 uppercase tracking-wide">
                    {result.platform}
                  </span>
                  {result.fileSizeFormatted && (
                    <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                      {result.fileSizeFormatted}
                    </span>
                  )}
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-100 line-clamp-2">
                  {result.title}
                </h3>
              </div>

              <div className="flex flex-wrap items-center gap-2.5">
                {/* COPY LINK */}
                <button
                  onClick={handleCopyLink}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-green-500" />
                      <span>{t.copied}</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>{t.copyLink}</span>
                    </>
                  )}
                </button>

                {/* DOWNLOAD BUTTON */}
                {result.downloadUrl && (
                  <a
                    href={result.downloadUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={handleDownloadClick}
                    className="px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold flex items-center gap-2 shadow-md shadow-cyan-600/20 transition-all"
                  >
                    <Download className="w-4 h-4" />
                    <span>{t.download}</span>
                  </a>
                )}
              </div>
            </div>

            {/* QUALITY SELECTOR IF MULTIPLE */}
            {result.qualities && result.qualities.length > 1 && (
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-3">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Select Stream Quality:</span>
                <div className="flex gap-2">
                  {result.qualities.map((q) => (
                    <button
                      key={q.url}
                      onClick={() => setSelectedQuality(q.url)}
                      className={`text-xs px-3 py-1 rounded-lg border transition-all ${
                        selectedQuality === q.url
                          ? "bg-cyan-500 text-black border-cyan-500 font-bold"
                          : "border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300"
                      }`}
                    >
                      {q.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

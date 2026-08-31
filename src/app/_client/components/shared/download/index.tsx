"use client";
import { AdBanner } from "../ad-banner";

import {
  useEffect,
  useId,
  useRef,
  useState,
} from "react";
import { useTranslations } from "next-intl";
import { DownloadIcon } from "../../svgs/icons/download";

type DownloadFormat =
  | "mp3"
  | "m4a"
  | "360"
  | "720"
  | "1080"
  | "1440"
  | "mp44k"
  | "mp48k"
  | "4k"
  | "8k";

type DownloadableRequest = {
  id: string;
  url: string;
  format: DownloadFormat;
};

const FORMAT_OPTIONS: Array<{
  value: DownloadFormat;
  label: string;
}> = [
  { value: "mp3", label: "MP3 Audio" },
  { value: "m4a", label: "M4A Audio" },
  { value: "360", label: "MP4 360p" },
  { value: "720", label: "MP4 720p" },
  { value: "1080", label: "MP4 1080p" },
  { value: "1440", label: "MP4 1440p" },
  { value: "mp44k", label: "MP4 4K" },
  { value: "mp48k", label: "MP4 8K" },
  { value: "4k", label: "WEBM 4K" },
  { value: "8k", label: "WEBM 8K" },
];

type DownloadApiResponse = {
  success?: boolean | number;
  content?: string;
  message?: string;
  error?: string;
  text?: string;
  status?: string;

  progress?: number | string;

  url?: string | null;
  download_url?: string | null;
  progress_url?: string | null;
};

function decodeBase64Utf8(base64: string): string {
  const binary = window.atob(base64);

  const bytes = Uint8Array.from(binary, (character) =>
    character.charCodeAt(0)
  );

  return new TextDecoder("utf-8").decode(bytes);
}

function createIframeDocument(
  encodedContent: string,
  frameId: string
): string {
  const decodedContent = decodeBase64Utf8(encodedContent);
  const serializedFrameId = JSON.stringify(frameId);

  /*
   * Remove third-party scripts and inline JavaScript before placing the
   * provider's HTML inside the iframe.
   */
  const parser = new DOMParser();
  const parsedDocument = parser.parseFromString(
    decodedContent,
    "text/html"
  );

  parsedDocument
    .querySelectorAll("script, iframe, object, embed")
    .forEach((element) => element.remove());

  parsedDocument.querySelectorAll("*").forEach((element) => {
    Array.from(element.attributes).forEach((attribute) => {
      const attributeName = attribute.name.toLowerCase();
      const attributeValue = attribute.value.trim().toLowerCase();

      if (attributeName.startsWith("on")) {
        element.removeAttribute(attribute.name);
      }

      if (
        (attributeName === "href" ||
          attributeName === "src") &&
        attributeValue.startsWith("javascript:")
      ) {
        element.removeAttribute(attribute.name);
      }
    });
  });

  parsedDocument
    .querySelectorAll<HTMLAnchorElement>('a[target="_blank"]')
    .forEach((link) => {
      link.rel = "noopener noreferrer nofollow";
    });

  const sanitizedContent = parsedDocument.body.innerHTML;

  const isDarkMode =
    document.documentElement.classList.contains("dark");

  return `
    <!doctype html>

    <html class="${isDarkMode ? "dark" : ""}">
      <head>
        <meta charset="utf-8" />

        <meta
          name="viewport"
          content="width=device-width, initial-scale=1"
        />

        <base href="https://p.savenow.to/" />

        <style>
          :root {
            --card-background: #ffffff;
            --card-text: #111827;
            --card-muted: #6b7280;
            --card-border: #e5e7eb;
            --progress-background: #e5e7eb;
            --accent: #7c3aed;
            --accent-hover: #6d28d9;
          }

          html.dark {
            --card-background: #1f2937;
            --card-text: #f9fafb;
            --card-muted: #d1d5db;
            --card-border: #374151;
            --progress-background: #374151;
          }

          * {
            box-sizing: border-box;
          }

          html,
          body {
            width: 100%;
            min-height: 0;
            margin: 0;
            padding: 0;
            overflow: hidden;
            background: transparent !important;
          }

          html {
            color-scheme: light;
          }

          html.dark {
            color-scheme: dark;
          }

          body {
            color: var(--card-text);
            font-family:
              Inter,
              ui-sans-serif,
              system-ui,
              -apple-system,
              BlinkMacSystemFont,
              "Segoe UI",
              sans-serif;
          }

          .download-card {
            display: flex;
            width: 100%;
            max-width: 650px;
            margin: 0 auto;
            overflow: hidden;
            border: 1px solid var(--card-border);
            border-radius: 1rem;
            background: var(--card-background);
            box-shadow:
              0 10px 15px -3px rgb(0 0 0 / 0.1),
              0 4px 6px -4px rgb(0 0 0 / 0.1);
          }

          .download-card > div {
            display: flex;
            width: 100%;
          }

          .download-card img {
            display: block;
            width: 12rem;
            height: 12rem;
            flex: 0 0 12rem;
            object-fit: cover;
          }

          .download-card .p-8 {
            display: flex;
            min-width: 0;
            flex: 1;
            flex-direction: column;
            justify-content: center;
            gap: 1rem;
            padding: 2rem;
          }

          .download-card .uppercase {
            overflow-wrap: anywhere;
            color: var(--accent);
            font-size: 0.875rem;
            font-weight: 600;
            line-height: 1.5;
            letter-spacing: 0.025em;
            text-transform: uppercase;
          }

          .download-card small {
            display: block;
            margin-top: 0.4rem;
            color: var(--card-muted);
            font-size: 0.75rem;
            font-weight: 400;
            line-height: 1.5;
            text-transform: none;
          }

          .download-card a {
            color: var(--accent);
            text-decoration: none;
          }

          .download-card a:hover {
            text-decoration: underline;
          }

          .download-card .progress {
            width: 100%;
            height: 0.75rem;
            overflow: hidden;
            border-radius: 9999px;
            background: var(--progress-background);
          }

          .download-card .progress-bar {
            display: flex;
            height: 100%;
            align-items: center;
            justify-content: center;
            border-radius: inherit;
            background: var(--accent);
            color: white;
            font-size: 0.625rem;
            font-weight: 700;
            transition: width 300ms ease;
          }

          .download-card a[id$="_downloadLink"] {
            display: block;
            width: 100%;
            text-decoration: none;
          }

          .download-card button.strong {
            display: flex;
            width: 100%;
            min-height: 3.25rem;
            align-items: center;
            justify-content: center;
            gap: 0.625rem;
            border: 0;
            border-radius: 0.75rem;
            background: var(--accent);
            padding: 0.75rem 1.25rem;
            color: white;
            font: inherit;
            font-weight: 700;
            transition:
              background-color 150ms ease,
              opacity 150ms ease,
              transform 150ms ease;
          }

          .download-card button.strong:disabled {
            cursor: wait;
            opacity: 0.65;
          }

          .download-card button.strong:not(:disabled) {
            cursor: pointer;
          }

          .download-card button.strong:not(:disabled):hover {
            background: var(--accent-hover);
          }

          .download-card button.strong svg {
            width: 1.25rem;
            height: 1.25rem;
          }

          .download-card .loader {
            width: 1.25rem;
            height: 1.25rem;
            flex: 0 0 1.25rem;
            border: 2px solid rgb(255 255 255 / 0.4);
            border-top-color: white;
            border-radius: 9999px;
            animation: loader-spin 700ms linear infinite;
          }

          /*
           * Applied only after the final download URL is received.
           */
          .download-card button.strong.download-ready {
            opacity: 1;
            animation: download-ready-pulse 1.2s ease-in-out infinite;
            will-change: transform;
          }

          .download-card button.strong.download-ready:hover {
            animation-play-state: paused;
            transform: scale(1.04);
          }

          /*
           * Hide the provider's promotional link.
           * Remove this rule when you want it displayed.
           */
          .download-card a[id^="veed-"] {
            display: none;
          }

          @keyframes loader-spin {
            to {
              transform: rotate(360deg);
            }
          }

          @keyframes download-ready-pulse {
            0%,
            100% {
              transform: scale(1);
            }

            50% {
              transform: scale(1.045);
            }
          }

          @media (prefers-reduced-motion: reduce) {
            .download-card button.strong.download-ready {
              animation: none;
            }
          }

          @media (max-width: 640px) {
            .download-card > div {
              flex-direction: column;
            }

            .download-card img {
              width: 100%;
              height: auto;
              aspect-ratio: 16 / 9;
              flex-basis: auto;
            }

            .download-card .p-8 {
              padding: 1.25rem;
            }
          }
        </style>
      </head>

      <body>
        ${sanitizedContent}

        <script>
          (function () {
            "use strict";

            var FRAME_ID = ${serializedFrameId};

            function getDownloadElements() {
              return {
                link: document.querySelector(
                  '[id$="_downloadLink"]'
                ),
                button: document.querySelector(
                  '[id$="_downloadButton"]'
                ),
                loadingIcon: document.querySelector(
                  '[id$="_loadingIcon"]'
                ),
                downloadIcon: document.querySelector(
                  '[id$="_downloadIcon"]'
                )
              };
            }

            function getButtonLabel(button) {
              if (!button) {
                return null;
              }

              var existingLabel = button.querySelector(
                ".download-button-label"
              );

              if (existingLabel) {
                return existingLabel;
              }

              var label = document.createElement("span");
              label.className = "download-button-label";

              /*
              * Find the provider's plain "Download" text node.
              */
              for (
                var index = 0;
                index < button.childNodes.length;
                index += 1
              ) {
                var node = button.childNodes[index];

                if (
                  node.nodeType === 3 &&
                  node.nodeValue &&
                  node.nodeValue.trim()
                ) {
                  button.replaceChild(label, node);
                  return label;
                }
              }

              button.appendChild(label);

              return label;
            }

            function sendHeight() {
              window.requestAnimationFrame(function () {
                var card = document.querySelector(
                  ".download-card"
                );

                if (!card) {
                  return;
                }

                var rectangle = card.getBoundingClientRect();

                var measuredHeight = Math.ceil(
                  Math.max(
                    rectangle.height,
                    card.scrollHeight || 0,
                    card.offsetHeight || 0
                  )
                );

                if (measuredHeight < 100) {
                  return;
                }

                window.parent.postMessage(
                  {
                    type: "download-card-height",
                    frameId: FRAME_ID,
                    height: measuredHeight
                  },
                  "*"
                );
              });
            }

            function applyPreparingState() {
              var elements = getDownloadElements();
              var label = getButtonLabel(elements.button);

              if (elements.link) {
                elements.link.href = "#";
                elements.link.setAttribute(
                  "aria-disabled",
                  "true"
                );
                elements.link.style.pointerEvents = "none";
              }

              if (elements.button) {
                elements.button.disabled = true;
                elements.button.setAttribute("disabled", "");
                elements.button.setAttribute(
                  "aria-busy",
                  "true"
                );
                elements.button.classList.remove(
                  "download-ready"
                );
              }

              if (elements.loadingIcon) {
                elements.loadingIcon.style.display = "";
              }

              if (elements.downloadIcon) {
                elements.downloadIcon.style.display = "none";
              }

              if (label) {
                label.textContent = "Preparing download...";
              }

              sendHeight();
            }

            function applyDownloadUrl(url) {
              var elements = getDownloadElements();
              var label = getButtonLabel(elements.button);

              if (elements.link) {
                elements.link.href = url;
                // Open the download in the same browsing context instead
                // of forcing a new tab/window via "_blank".
                elements.link.target = "_self";
                elements.link.rel =
                  "noopener noreferrer nofollow";

                elements.link.removeAttribute("disabled");
                elements.link.removeAttribute(
                  "aria-disabled"
                );

                elements.link.style.pointerEvents = "auto";
              }

              if (elements.button) {
                elements.button.disabled = false;
                elements.button.removeAttribute("disabled");
                elements.button.setAttribute(
                  "aria-busy",
                  "false"
                );
                elements.button.classList.add(
                  "download-ready"
                );
              }

              if (elements.loadingIcon) {
                elements.loadingIcon.style.display = "none";
              }

              if (elements.downloadIcon) {
                elements.downloadIcon.style.display =
                  "inline-block";
              }

              if (label) {
                label.textContent = "Download now";
              }

              // console.log(
              //   "[iframe] Download button enabled:",
              //   url
              // );

              sendHeight();
            }

            /*
            * Register this before initializing the button.
            */
            window.addEventListener(
              "message",
              function (event) {
                var message = event.data;

                if (!message) {
                  return;
                }

                if (
                  message.type !== "download-card-url" ||
                  message.frameId !== FRAME_ID ||
                  !message.url
                ) {
                  return;
                }

                // console.log(
                //   "[iframe] Ready message received",
                //   message
                // );

                applyDownloadUrl(message.url);
              }
            );

            applyPreparingState();

            window.addEventListener("load", sendHeight);

            var card = document.querySelector(
              ".download-card"
            );

            if (
              card &&
              typeof ResizeObserver !== "undefined"
            ) {
              var observer = new ResizeObserver(
                function () {
                  sendHeight();
                }
              );

              observer.observe(card);
            }

            var images = document.querySelectorAll("img");

            for (
              var imageIndex = 0;
              imageIndex < images.length;
              imageIndex += 1
            ) {
              if (!images[imageIndex].complete) {
                images[imageIndex].addEventListener(
                  "load",
                  sendHeight
                );

                images[imageIndex].addEventListener(
                  "error",
                  sendHeight
                );
              }
            }

            setTimeout(sendHeight, 100);
            setTimeout(sendHeight, 500);
            setTimeout(sendHeight, 1500);
          }());
        </script>
      </body>
    </html>
  `;
}

function getProgressId(progressUrl?: string | null): string | null {
  if (!progressUrl) {
    return null;
  }

  try {
    return new URL(progressUrl).searchParams.get("id");
  } catch {
    return null;
  }
}

function extractDownloadUrlFromContent(
  encodedContent?: string | null
): string | null {
  if (!encodedContent) {
    return null;
  }

  try {
    const decodedContent = decodeBase64Utf8(encodedContent);
    const parser = new DOMParser();
    const parsedDocument = parser.parseFromString(
      decodedContent,
      "text/html"
    );

    const downloadLink = parsedDocument.querySelector<HTMLAnchorElement>(
      'a[id$="_downloadLink"]'
    );
    const href = downloadLink?.getAttribute("href")?.trim();

    if (!href || href === "#" || href.startsWith("javascript:")) {
      return null;
    }

    return new URL(href, "https://p.savenow.to/").toString();
  } catch {
    return null;
  }
}

function DownloadCard({
  downloadable,
  format,
  index,
}: {
  downloadable: string;
  format: DownloadFormat;
  index: number;
}) {
  const frameId = useId();
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const [cardHtml, setCardHtml] = useState("");
  const [downloadUrl, setDownloadUrl] = useState("");
  const [iframeHeight, setIframeHeight] = useState(360);
  const [status, setStatus] = useState("Preparing download…");
  const [error, setError] = useState("");

  function sendDownloadUrlToIframe(url: string) {
    iframeRef.current?.contentWindow?.postMessage(
      {
        type: "download-card-url",
        frameId,
        url,
      },
      "*"
    );
  }

  // Attach a click handler inside the iframe to intercept the
  // provider's download link. We try to fetch the file as a blob
  // in the parent context and trigger a download there to avoid
  // opening a new tab. If fetch fails (CORS), we fall back to a
  // normal anchor click.
  function attachIframeDownloadHandler(url: string) {
    try {
      const doc = iframeRef.current?.contentDocument;

      if (!doc) return;

      const link = doc.querySelector<HTMLAnchorElement>(
        '[id$="_downloadLink"]'
      );

      if (!link) return;

      // Ensure link opens in same context inside iframe
      link.target = "_self";
      link.rel = "noopener noreferrer nofollow";

      // Avoid attaching multiple handlers
      (link as any).__downloadHandlerAttached =
        (link as any).__downloadHandlerAttached || false;

      if ((link as any).__downloadHandlerAttached) return;

      const handler = (e: MouseEvent) => {
        e.preventDefault();

        try {
          // First attempt: create and click an anchor in the parent
          // context immediately. This starts the browser download
          // without fetching the full file into memory.
          const a = document.createElement("a");
          // Use same-origin proxy to start downloads immediately and avoid
          // cross-origin delays or popup behavior.
          const proxied = `/api/proxy-download?url=${encodeURIComponent(
            url
          )}`;
          a.href = proxied;
          a.rel = "noopener noreferrer nofollow";
          a.target = "_self";

          try {
            a.download = decodeURIComponent(
              new URL(url).pathname.split("/").pop() || "download"
            );
          } catch {}

          a.style.display = "none";
          document.body.appendChild(a);
          a.click();
          a.remove();

          return;
        } catch {
          // If the immediate anchor click fails, fall back to fetching
          // the file as a blob and creating an object URL.
          void (async () => {
            try {
              const response = await fetch(url, { cache: "no-store" });

              if (!response.ok) {
                throw new Error("Download fetch failed");
              }

              const blob = await response.blob();
              const objectUrl = URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = objectUrl;
              // Try to infer filename from response or URL
              const contentDisposition = response.headers.get(
                "content-disposition"
              );

              let filename = "download";

              if (contentDisposition) {
                const match = /filename\*=UTF-8''([^;\n\r]+)/i.exec(
                  contentDisposition
                );

                if (match && match[1]) {
                  filename = decodeURIComponent(match[1]);
                } else {
                  const match2 = /filename="?([^";]+)"?/i.exec(
                    contentDisposition
                  );

                  if (match2 && match2[1]) {
                    filename = match2[1];
                  }
                }
              } else {
                try {
                  filename = decodeURIComponent(
                    new URL(url).pathname.split("/").pop() || "download"
                  );
                } catch {}
              }

              a.download = filename;
              a.style.display = "none";
              document.body.appendChild(a);
              a.click();
              a.remove();
              URL.revokeObjectURL(objectUrl);
            } catch {
              // Final fallback: navigate by creating an anchor in parent
              const a = document.createElement("a");
              a.href = url;
              a.rel = "noopener noreferrer nofollow";
              a.style.display = "none";
              document.body.appendChild(a);
              a.click();
              a.remove();
            }
          })();
        }
      };

      link.addEventListener("click", handler);
      (link as any).__downloadHandlerAttached = true;
    } catch {
      // ignore errors attaching handler
    }
  }

  useEffect(() => {
    function handleIframeMessage(event: MessageEvent) {
      if (
        event.source !== iframeRef.current?.contentWindow ||
        event.data?.type !== "download-card-height" ||
        event.data?.frameId !== frameId
      ) {
        return;
      }

      const height = Number(event.data.height);

      if (Number.isFinite(height) && height > 0) {
        setIframeHeight(Math.ceil(height));
      }
    }

    window.addEventListener("message", handleIframeMessage);

    return () => {
      window.removeEventListener(
        "message",
        handleIframeMessage
      );
    };
  }, [frameId]);

    useEffect(() => {
      if (!downloadUrl) {
        return;
      }

      function sendReadyMessage() {
        iframeRef.current?.contentWindow?.postMessage(
          {
            type: "download-card-url",
            frameId,
            url: downloadUrl,
          },
          "*"
        );
      }

      sendReadyMessage();
      // Also attempt to attach a parent-side download handler into the iframe
      attachIframeDownloadHandler(downloadUrl);

      const firstRetry = setTimeout(sendReadyMessage, 100);
      const secondRetry = setTimeout(sendReadyMessage, 500);

      return () => {
        clearTimeout(firstRetry);
        clearTimeout(secondRetry);
      };
    }, [downloadUrl, frameId]);

  useEffect(() => {
    const controller = new AbortController();

    let cancelled = false;
    let pollTimeout: ReturnType<typeof setTimeout> | undefined;

    async function fetchJson(
      endpoint: string
    ): Promise<DownloadApiResponse> {
      const response = await fetch(endpoint, {
        signal: controller.signal,
        cache: "no-store",
      });

      const data = (await response.json()) as DownloadApiResponse;

      if (!response.ok) {
        throw new Error(
          data.message || "The download request failed"
        );
      }

      if (data.success === false) {
        throw new Error(
          data.message || "The download service returned an error"
        );
      }

      return data;
    }

    function updateCard(
      data: DownloadApiResponse
    ): string | null {
      if (data.text) {
        setStatus(data.text);
      }

      if (data.content) {
        setCardHtml(
          createIframeDocument(data.content, frameId)
        );
      }

      const progress = Number(data.progress ?? 0);

      const finalUrl =
        data.download_url ||
        data.url ||
        extractDownloadUrlFromContent(data.content) ||
        null;

      if (finalUrl) {
        setDownloadUrl(finalUrl);
        setStatus("Download ready");

        return finalUrl;
      }

      if (progress >= 1000) {
        throw new Error(
          "The API reported completion but did not provide a download URL"
        );
      }

      return null;
    }

    async function pollProgress(
      progressId: string,
      attempt = 0
    ): Promise<void> {
      if (cancelled) {
        return;
      }

      /*
      * 360 requests at five-second intervals is approximately
      * a 30-minute maximum.
      */
      if (attempt >= 360) {
        throw new Error(
          "The download service took longer than 30 minutes"
        );
      }

      const progressData = await fetchJson(
        `/api/download-card/progress?id=${encodeURIComponent(
          progressId
        )}`
      );

      const progress = Number(
        progressData.progress ?? 0
      );

      if (Number.isFinite(progress) && progress > 0) {
        const percentage = Math.min(
          100,
          Math.round(progress / 10)
        );

        setStatus(
          `Preparing download… ${percentage}%`
        );
      } else {
        setStatus(
          progressData.text || "Preparing download…"
        );
      }

      const finalUrl = updateCard(progressData);

      if (finalUrl || cancelled) {
        return;
      }

      pollTimeout = setTimeout(() => {
        void pollProgress(
          progressId,
          attempt + 1
        ).catch(handleError);
      }, 5000);
    }

    function handleError(requestError: unknown) {
      if (
        requestError instanceof DOMException &&
        requestError.name === "AbortError"
      ) {
        return;
      }

      setError(
        requestError instanceof Error
          ? requestError.message
          : "An unexpected error occurred"
      );
    }

    async function loadCard() {
      setError("");
      setCardHtml("");
      setDownloadUrl("");
      setStatus("Preparing download…");

      const initialData = await fetchJson(
        `/api/download-card?url=${encodeURIComponent(
          downloadable
        )}&format=${encodeURIComponent(format)}`
      );

      const finalUrl = updateCard(initialData);

      if (finalUrl) {
        return;
      }

      const progressId = getProgressId(
        initialData.progress_url
      );

      if (progressId) {
        await pollProgress(progressId);
        return;
      }

      if (!initialData.content) {
        throw new Error(
          initialData.message ||
            "The service did not return a download card"
        );
      }
    }

    void loadCard().catch(handleError);

    return () => {
      cancelled = true;
      controller.abort();

      if (pollTimeout) {
        clearTimeout(pollTimeout);
      }
    };
  }, [downloadable, format, frameId]);

  if (error) {
    return (
      <div className="w-full rounded-lg bg-red-50 p-4 text-red-700 lg:w-[650px]">
        {error}
      </div>
    );
  }

  if (!cardHtml) {
    return (
      <div className="w-full p-8 text-center lg:w-[650px]">
        {status}
      </div>
    );
  }

  return (
    <iframe
      ref={iframeRef}
      title={`Download ${index + 1} — ${format}`}
      className="block w-full bg-transparent lg:w-[650px]"
      width="100%"
      height={iframeHeight}
      style={{
        border: "none",
        height: `${iframeHeight}px`,
        backgroundColor: "transparent",
      }}
      srcDoc={cardHtml}
      sandbox="allow-scripts allow-forms allow-popups allow-downloads"
      onLoad={() => {
        if (downloadUrl) {
          sendDownloadUrlToIframe(downloadUrl);
          attachIframeDownloadHandler(downloadUrl);
        }
      }}
    />
  );
}

export const Download = () => {
  const translate = useTranslations("general");

  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [selectedFormat, setSelectedFormat] =
  useState<DownloadFormat>("720");

  const [downloadables, setDownloadables] =
  useState<DownloadableRequest[]>([]);

  const scrollRef = useRef<HTMLDivElement>(null);

  function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    const trimmedUrl = youtubeUrl.trim();

    if (!trimmedUrl) {
      return;
    }

    setDownloadables((previous) => [
      ...previous,
      {
        id: crypto.randomUUID(),
        url: trimmedUrl,
        format: selectedFormat,
      },
    ]);

    setYoutubeUrl("");

    setTimeout(() => {
      scrollRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 100);
  }

  return (
    <>
      {/* First banner: above the form (Adsterra native banner) */}
      <div className="mb-8">
        <AdBanner type="adsterra-native" />
      </div>
      <form id="downloadform"
        className="mb-20 lg:flex lg:items-center lg:rounded-3xl lg:bg-white lg:py-4 lg:pl-2 lg:pr-4 lg:shadow-md lg:dark:bg-dark_heading"
        onSubmit={handleSubmit}
      >
        <div className="mb-4 lg:mb-0 lg:w-full">
          <input
            type="url"
            className="block h-16 w-full rounded-3xl bg-white px-6 font-light shadow-md outline-none dark:bg-dark_heading lg:shadow-none"
            placeholder="Paste your YouTube URL"
            value={youtubeUrl}
            onChange={(event) =>
              setYoutubeUrl(event.target.value)
            }
          />
        </div>

        <div className="flex w-full lg:w-auto">
          <label
            htmlFor="download-format"
            className="sr-only"
          >
            Download format
          </label>

          <select
            id="download-format"
            value={selectedFormat}
            onChange={(event) =>
              setSelectedFormat(
                event.target.value as DownloadFormat
              )
            }
            className="
              h-16 min-w-0 flex-1 cursor-pointer
              rounded-l-2xl border border-r-0 border-slate-200
              bg-white px-4 font-semibold text-slate-800 outline-none
              focus:border-purple_main focus:ring-2 focus:ring-purple_main/20
              dark:border-slate-700 dark:bg-dark_heading dark:text-white
              lg:min-w-[150px] lg:flex-none
            "
          >
            {FORMAT_OPTIONS.map((option) => (
              <option
                key={option.value}
                value={option.value}
              >
                {option.label}
              </option>
            ))}
          </select>

          <button
            className="
              flex h-16 flex-1 items-center justify-center gap-x-2
              rounded-r-2xl bg-purple_main px-6 font-bold text-white
              hover:bg-opacity-80
              disabled:cursor-not-allowed disabled:opacity-50
              lg:flex-none lg:px-10
            "
            type="submit"
            disabled={!youtubeUrl.trim()}
          >
            <div className="h-7 w-6">
              <DownloadIcon />
            </div>

            {translate("download")}
          </button>
        </div>
      </form>

      {downloadables.length > 0 && (
        <div
          ref={scrollRef}
          className="mb-8 lg:px-20"
        >
          <div className="mx-auto max-w-max rounded-2xl bg-white p-8 dark:bg-dark_heading">
            {downloadables.map((downloadable, index) => (
              <div
                key={downloadable.id}
                className="mb-10 flex w-full flex-col items-center last:mb-0"
              >
                <div className="mb-3 text-sm font-semibold text-slate-500 dark:text-slate-400">
                  {
                    FORMAT_OPTIONS.find(
                      (option) =>
                        option.value === downloadable.format
                    )?.label
                  }
                </div>

                <DownloadCard
                  downloadable={downloadable.url}
                  format={downloadable.format}
                  index={index}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
};
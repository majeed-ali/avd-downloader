import { NextRequest, NextResponse } from "next/server"

export const runtime = "edge"

const LOADER_BASE = "https://loader.fo"
const LOADER_HOME = "https://loader.fo/en/"
const IFRAME_RESIZER_CONTENT_WINDOW = "https://cdnjs.cloudflare.com/ajax/libs/iframe-resizer/4.3.9/iframeResizer.contentWindow.min.js"
const UPSTREAM_TIMEOUT_MS = 8000

const REDIRECT_BLOCKER_SCRIPT = `<script>
(() => {
  const blockedHosts = [
    "p.savenow.to",
    "p.lbserver.xyz"
  ]

  const isBlocked = (value) => {
    try {
      const url = new URL(value, window.location.href)
      return blockedHosts.some((host) => url.hostname === host || url.hostname.endsWith('.' + host))
    } catch {
      return false
    }
  }

  const originalOpen = window.open
  window.open = function patchedOpen(url, target, features) {
    if (typeof url === "string" && isBlocked(url)) {
      return null
    }

    if (target === "_blank") {
      return null
    }

    return originalOpen.call(window, url, target, features)
  }

  const blockEventNavigation = (event) => {
    const target = event.target

    if (!(target instanceof Element)) {
      return
    }

    const link = target.closest("a")
    if (link instanceof HTMLAnchorElement) {
      if (link.target === "_blank" || isBlocked(link.href)) {
        event.preventDefault()
        event.stopImmediatePropagation()
      }
    }

    const form = target.closest("form")
    if (form instanceof HTMLFormElement && isBlocked(form.action)) {
      event.preventDefault()
      event.stopImmediatePropagation()
    }
  }

  document.addEventListener("click", blockEventNavigation, true)
  document.addEventListener("submit", blockEventNavigation, true)

  // Proxy fetch for CORS
  const originalFetch = window.fetch
  window.fetch = function(url, options) {
    if (typeof url === "string" && (url.includes("p.savenow.to") || url.includes("p.lbserver.xyz") || url.includes("loader.fo"))) {
      const proxyUrl = new URL("/api/proxy", window.location.origin)
      proxyUrl.searchParams.set("url", url)
      return originalFetch(proxyUrl, options)
    }
    return originalFetch(url, options)
  }

  // Proxy XMLHttpRequest for CORS
  const originalXMLHttpRequest = window.XMLHttpRequest
  window.XMLHttpRequest = class extends originalXMLHttpRequest {
    open(method, url, async = true, user = null, password = null) {
      if (typeof url === "string" && (url.includes("p.savenow.to") || url.includes("p.lbserver.xyz") || url.includes("loader.fo"))) {
        const proxyUrl = new URL("/api/proxy", window.location.origin)
        proxyUrl.searchParams.set("url", url)
        super.open(method, proxyUrl, async, user, password)
      } else {
        super.open(method, url, async, user, password)
      }
    }
  }
})()
</script>`

const buildPrefillScript = (url: string | null, format: string | null) => {
  const serializedUrl = JSON.stringify(url ?? "")
  const serializedFormat = JSON.stringify(format ?? "")

  return `<script>
(() => {
  const prefillUrl = ${serializedUrl}
  const prefillFormat = ${serializedFormat}

  const applyPrefill = () => {
    const input = document.getElementById("download-url")
    const select = document.getElementById("download-format")

    if (input instanceof HTMLInputElement && prefillUrl) {
      input.value = prefillUrl
      input.dispatchEvent(new Event("input", { bubbles: true }))
      input.dispatchEvent(new Event("change", { bubbles: true }))
    }

    if (select instanceof HTMLSelectElement && prefillFormat) {
      select.value = prefillFormat
      select.dataset.quality = prefillFormat
      select.dispatchEvent(new Event("change", { bubbles: true }))
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", applyPrefill, { once: true })
  } else {
    applyPrefill()
  }
})()
</script>`
}

const rewriteHtmlForIframe = (html: string, url: string | null, format: string | null) => {
  const resizerScript = `<script src="${IFRAME_RESIZER_CONTENT_WINDOW}"></script>`
  const prefillScript = buildPrefillScript(url, format)

  if (html.includes("<head>")) {
    return html.replace("<head>", `<head><base href=\"${LOADER_HOME}\">${REDIRECT_BLOCKER_SCRIPT}${resizerScript}${prefillScript}`)
  }

  return `<base href=\"${LOADER_HOME}\">${REDIRECT_BLOCKER_SCRIPT}${resizerScript}${prefillScript}${html}`
}

const buildFallbackHtml = () => {
  const resizerScript = `<script src="${IFRAME_RESIZER_CONTENT_WINDOW}"></script>`

  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Preview unavailable</title>${resizerScript}<style>body{font-family:system-ui,sans-serif;margin:0;min-height:100vh;display:grid;place-items:center;background:#f8fafc;color:#0f172a}.card{max-width:32rem;margin:2rem;padding:1.5rem 1.75rem;border:1px solid #cbd5e1;border-radius:1rem;background:#fff;box-shadow:0 10px 30px rgba(15,23,42,.08)}h1{font-size:1.125rem;margin:0 0 .5rem}p{margin:0;line-height:1.5;color:#475569}</style></head><body><div class="card"><h1>Preview unavailable</h1><p>The download preview could not be loaded right now. Please try again in a moment.</p></div></body></html>`
}

const sanitizeHeaders = (source: Headers) => {
  const headers = new Headers(source)

  headers.delete("x-frame-options")
  headers.delete("content-security-policy")
  headers.delete("content-security-policy-report-only")
  headers.delete("content-encoding")
  headers.delete("content-length")
  headers.delete("transfer-encoding")
  headers.delete("connection")
  headers.set("cache-control", "no-store")

  return headers
}

export async function GET(request: NextRequest) {
  const target = new URL("/en/", LOADER_BASE)
  try {
    const url = request.nextUrl.searchParams.get("url")
    const adUrl = request.nextUrl.searchParams.get("adUrl")
    const format = request.nextUrl.searchParams.get("format")

    if (adUrl) {
      target.searchParams.set("adUrl", adUrl)
    }

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), UPSTREAM_TIMEOUT_MS)

    const upstream = await fetch(target.toString(), {
      method: "GET",
      redirect: "follow",
      headers: {
        "User-Agent": "Mozilla/5.0",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8"
      },
      cache: "no-store",
      signal: controller.signal
    })

    clearTimeout(timeoutId)

    const contentType = upstream.headers.get("content-type") ?? "text/html; charset=utf-8"
    const headers = sanitizeHeaders(upstream.headers)

    if (contentType.includes("text/html")) {
      const html = await upstream.text()
      const rewritten = rewriteHtmlForIframe(html, url, format)

      headers.set("content-type", "text/html; charset=utf-8")
      return new NextResponse(rewritten, {
        status: upstream.status,
        headers
      })
    }

    const body = await upstream.arrayBuffer()

    return new NextResponse(body, {
      status: upstream.status,
      headers
    })
  } catch (error) {
    console.error("loader-card error:", error)

    return new NextResponse(
      buildFallbackHtml(),
      {
        status: 200,
        headers: {
          "content-type": "text/html; charset=utf-8",
          "cache-control": "no-store"
        }
      }
    )
  }
}

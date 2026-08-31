import { NextRequest, NextResponse } from "next/server"

export const runtime = "edge"

const WIDGET_BASE = "https://p.savenow.to"

const TRANSPARENT_STYLE = `<style>
html, body {
  background: transparent !important;
  min-height: 100vh !important;
}

body {
  margin: 0 !important;
  display: grid !important;
  place-items: center !important;
  padding: 24px !important;
  box-sizing: border-box !important;
}
</style>`

const BLOCK_AD_REDIRECT_SCRIPT = `<script>
(() => {
  const blockedHosts = ["p.savenow.to", "p.lbserver.xyz"]

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

  document.addEventListener("click", (event) => {
    const target = event.target

    if (!(target instanceof Element)) {
      return
    }

    const link = target.closest("a")
    if (link instanceof HTMLAnchorElement && (link.target === "_blank" || isBlocked(link.href))) {
      event.preventDefault()
      event.stopImmediatePropagation()
    }
  }, true)
})()
</script>`

const rewriteHtmlForWidget = (html: string) => {
  if (html.includes("<head>")) {
    return html.replace("<head>", `<head><base href="${WIDGET_BASE}/">${TRANSPARENT_STYLE}${BLOCK_AD_REDIRECT_SCRIPT}`)
  }

  return `<base href="${WIDGET_BASE}/">${TRANSPARENT_STYLE}${BLOCK_AD_REDIRECT_SCRIPT}${html}`
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
  try {
    const upstreamUrl = new URL("/api/widget", WIDGET_BASE)

    request.nextUrl.searchParams.forEach((value, key) => {
      if (key === "adUrl") {
        return
      }

      upstreamUrl.searchParams.set(key, value)
    })

    const upstream = await fetch(upstreamUrl.toString(), {
      method: "GET",
      redirect: "follow",
      headers: {
        "User-Agent": "Mozilla/5.0",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8"
      },
      cache: "no-store"
    })

    const contentType = upstream.headers.get("content-type") ?? "text/html; charset=utf-8"
    const headers = sanitizeHeaders(upstream.headers)

    if (contentType.includes("text/html")) {
      const html = await upstream.text()
      const rewritten = rewriteHtmlForWidget(html)

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
    console.error("widget proxy error:", error)

    return NextResponse.json({ error: "Widget proxy failed" }, { status: 500 })
  }
}
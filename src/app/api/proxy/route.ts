import { NextRequest, NextResponse } from "next/server"

export const runtime = "edge"

const ALLOWED_HOSTS = ["p.savenow.to", "p.lbserver.xyz", "loader.fo"]

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get("url")

  if (!url) {
    return NextResponse.json({ error: "Missing url query param" }, { status: 400 })
  }

  try {
    const targetUrl = new URL(url)

    if (!ALLOWED_HOSTS.some(host => targetUrl.hostname === host || targetUrl.hostname.endsWith('.' + host))) {
      return NextResponse.json({ error: "Host not allowed" }, { status: 403 })
    }

    const upstream = await fetch(targetUrl.toString(), {
      method: "GET",
      headers: {
        "User-Agent": "Mozilla/5.0",
        "Accept": "*/*"
      },
      cache: "no-store"
    })

    const responseHeaders = new Headers(upstream.headers)
    responseHeaders.delete("content-encoding")
    responseHeaders.delete("content-length")
    responseHeaders.delete("transfer-encoding")
    responseHeaders.delete("connection")
    responseHeaders.set("cache-control", "no-store")

    const body = await upstream.arrayBuffer()

    return new NextResponse(body, {
      status: upstream.status,
      headers: responseHeaders
    })
  } catch (error) {
    console.error("Proxy error:", error)
    return NextResponse.json({ error: "Proxy failed" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const url = request.nextUrl.searchParams.get("url")

  if (!url) {
    return NextResponse.json({ error: "Missing url query param" }, { status: 400 })
  }

  try {
    const targetUrl = new URL(url)

    if (!ALLOWED_HOSTS.some(host => targetUrl.hostname === host || targetUrl.hostname.endsWith('.' + host))) {
      return NextResponse.json({ error: "Host not allowed" }, { status: 403 })
    }

    const body = await request.arrayBuffer()

    const upstream = await fetch(targetUrl.toString(), {
      method: "POST",
      headers: {
        "User-Agent": "Mozilla/5.0",
        "Content-Type": request.headers.get("content-type") || "application/x-www-form-urlencoded",
        "Accept": "*/*"
      },
      body: body,
      cache: "no-store"
    })

    const responseHeaders = new Headers(upstream.headers)
    responseHeaders.delete("content-encoding")
    responseHeaders.delete("content-length")
    responseHeaders.delete("transfer-encoding")
    responseHeaders.delete("connection")
    responseHeaders.set("cache-control", "no-store")

    const responseBody = await upstream.arrayBuffer()

    return new NextResponse(responseBody, {
      status: upstream.status,
      headers: responseHeaders
    })
  } catch (error) {
    console.error("Proxy error:", error)
    return NextResponse.json({ error: "Proxy failed" }, { status: 500 })
  }
}
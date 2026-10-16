import { teraboxAdapter } from "../src/lib/player/adapters/terabox.ts";

async function testSegmentCORS() {
  const url = new URL("https://teraboxapp.com/s/1AkybvHWaSYNkmpbe2FPaBQ");
  const result = await teraboxAdapter.resolve(url);
  const u = new URL(result.streamUrl, "http://localhost:3000");
  const upstreamUrl = `https://www.terabox.app/share/streaming?app_id=250528&channel=dubox&clienttype=0&web=1&uk=${encodeURIComponent(
    u.searchParams.get("uk")
  )}&shareid=${encodeURIComponent(u.searchParams.get("shareid"))}&sign=${encodeURIComponent(
    u.searchParams.get("sign")
  )}&timestamp=${encodeURIComponent(
    u.searchParams.get("timestamp")
  )}&type=${encodeURIComponent(u.searchParams.get("type"))}&fid=${encodeURIComponent(
    u.searchParams.get("fid")
  )}`;

  const res = await fetch(upstreamUrl, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      Referer: "https://www.terabox.app/",
      Cookie: `BDCLND=${u.searchParams.get("randsk") || ""}`,
    },
  });

  const m3u8 = await res.text();
  const lines = m3u8.split("\n");
  const segmentUrl = lines.find((l) => l.startsWith("http"));

  console.log("Testing Segment URL:", segmentUrl);

  // Test 1: Fetching segment directly with browser-like headers (Origin, no Referer or different Origin)
  const segRes = await fetch(segmentUrl, {
    method: "GET",
    headers: {
      Origin: "https://anyvideodownloader.app",
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
    },
  });

  console.log("Segment Response Status:", segRes.status);
  console.log("Segment CORS Access-Control-Allow-Origin:", segRes.headers.get("access-control-allow-origin"));
  console.log("Segment Content-Type:", segRes.headers.get("content-type"));
  console.log("Segment Content-Length:", segRes.headers.get("content-length"));
}

testSegmentCORS().catch(console.error);

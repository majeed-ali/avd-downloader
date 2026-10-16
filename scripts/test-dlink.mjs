async function testShareDownload() {
  const cleanKey = "AkybvHWaSYNkmpbe2FPaBQ";

  const initRes = await fetch(`https://www.terabox.app/sharing/link?surl=${cleanKey}`, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    },
  });

  const cookies = initRes.headers.getSetCookie
    ? initRes.headers.getSetCookie().join("; ")
    : initRes.headers.get("set-cookie") || "";

  const infoRes = await fetch(`https://www.terabox.app/api/shorturlinfo?shorturl=1${cleanKey}&root=1`, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      Cookie: cookies,
      Referer: `https://www.terabox.app/sharing/link?surl=${cleanKey}`,
    },
  });

  const meta = await infoRes.json();
  const file = meta.list?.[0];

  // Try calling /api/sharedownload
  const dlRes = await fetch(
    `https://www.terabox.app/api/sharedownload?app_id=250528&web=1&channel=dubox&clienttype=0&jsToken=&sign=${encodeURIComponent(
      meta.sign
    )}&timestamp=${encodeURIComponent(meta.timestamp)}&shareid=${encodeURIComponent(
      meta.shareid
    )}&uk=${encodeURIComponent(meta.uk)}&primaryid=${encodeURIComponent(
      meta.shareid
    )}&fid_list=%5B${encodeURIComponent(file.fs_id)}%5D`,
    {
      method: "POST",
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Cookie: `BDCLND=${meta.randsk || ""}; ${cookies}`,
        Referer: `https://www.terabox.app/sharing/link?surl=${cleanKey}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: `product=share&nozip=0&fid_list=%5B${encodeURIComponent(file.fs_id)}%5D`,
    }
  );

  console.log("Sharedownload HTTP status:", dlRes.status);
  const dlData = await dlRes.json();
  console.log("Sharedownload JSON:", dlData);
}

testShareDownload().catch(console.error);

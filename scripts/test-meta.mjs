async function inspectTeraBoxMeta() {
  const cleanKey = "AkybvHWaSYNkmpbe2FPaBQ";

  // 1. Establish session
  const initRes = await fetch(`https://www.terabox.app/sharing/link?surl=${cleanKey}`, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    },
  });

  const cookies = initRes.headers.getSetCookie
    ? initRes.headers.getSetCookie().join("; ")
    : initRes.headers.get("set-cookie") || "";

  // 2. Query shorturlinfo
  const infoRes = await fetch(`https://www.terabox.app/api/shorturlinfo?shorturl=1${cleanKey}&root=1`, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      Cookie: cookies,
      Referer: `https://www.terabox.app/sharing/link?surl=${cleanKey}`,
    },
  });

  const meta = await infoRes.json();
  console.log("Meta keys:", Object.keys(meta));
  console.log("List length:", meta.list?.length);
  if (meta.list?.[0]) {
    console.log("File 0 fields:", Object.keys(meta.list[0]));
    console.log("dlink present in file 0:", meta.list[0].dlink);
  }
}

inspectTeraBoxMeta().catch(console.error);

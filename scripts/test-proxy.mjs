import { validatePublicUrl } from "../src/lib/player/ssrf.ts";

async function testProxyLogic() {
  const sampleSegmentUrl =
    "https://v4.freeterabox.com/video/netdisk-videotran-tky/bad079225dbb2286aa4cc2189fe6e536_1138_3_ts/c767bc89c874448c7a7f9800cdc08907?ts_size=6772888&region=tky&ccn=IN&from_type=3&fsid=715580444970943&iv=0&ouk=4399149067382&sta_cs=107&to=any&vuk=&app_id=250528&dp-logid=9005290395131823930&fn=Ashwitha+Nri+Video+%282%29.mp4&hit_sl=0&logid=9005290395131823930&r=447243092&raw_appid=0&ref=0&size=71556744&sta_dt=video&sta_dx=68&start_ply=0&time=1792182986&tot=ctp4N&ts_sl=0&uo=any&uva=2508900437&csl=0&dtime=10&etag=c767bc89c874448c7a7f9800cdc08907&fid=bf5333f7443998c4892fcee1e830228d-&len=628484&range=3662616-4291099&resv4=&sign=BOUTHNFRQ-F3530edecde9cd71b79378b290804a96-uApF0xKk5zHexhaw7UVYQF4h9q0%253D&xcode=036ea7b94572afcfe7a78dfe57d364feefa71c97288cc1cf0a6f2e81584e0783c7a653ee6c0028d536baa8f59315ec2f0b2977702d3e6764&xv=6&ogr=0&rrg=XVVi&need_suf=&pmk=1400c767bc89c874448c7a7f9800cdc089079363829a000000675898&by=my-streaming";

  const ssrfCheck = validatePublicUrl(sampleSegmentUrl);
  console.log("SSRF check valid:", ssrfCheck.valid);

  const upstreamRes = await fetch(sampleSegmentUrl, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      Referer: "https://www.terabox.app/",
    },
  });

  console.log("Upstream segment fetch status:", upstreamRes.status);
  const buffer = await upstreamRes.arrayBuffer();
  console.log("Fetched segment bytes:", buffer.byteLength);
  console.log("First byte (MPEG-TS sync byte 0x47 = 71):", new Uint8Array(buffer)[0]);
}

testProxyLogic().catch(console.error);

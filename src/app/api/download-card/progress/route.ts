import { NextResponse } from "next/server";

export const runtime = "edge";
export const dynamic = "force-dynamic";

type ProgressResponse = {
  success?: boolean | number;
  progress?: number | string;
  download_url?: string | null;
  url?: string | null;
  status?: string;
  text?: string;
  message?: string;
  error?: string;
};

export async function GET(request: Request) {
  try {
    const requestUrl = new URL(request.url);
    const progressId = requestUrl.searchParams.get("id");

    if (
      !progressId ||
      !/^[a-zA-Z0-9_-]+$/.test(progressId)
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "A valid progress ID is required",
        },
        {
          status: 400,
        }
      );
    }

    const progressUrl =
      `https://p.savenow.to/ajax/progress.php?id=${encodeURIComponent(
        progressId
      )}`;

    const upstreamResponse = await fetch(progressUrl, {
      cache: "no-store",
      headers: {
        Accept: "application/json",
      },
    });

    const responseText = await upstreamResponse.text();

    /*
     * This log appears in the Next.js server terminal,
     * not in the browser console.
     */
    // console.log(
    //   "[download progress]",
    //   upstreamResponse.status,
    //   responseText
    // );

    let data: ProgressResponse;

    try {
      data = JSON.parse(responseText) as ProgressResponse;
    } catch {
      return NextResponse.json(
        {
          success: false,
          message:
            "The progress endpoint returned invalid JSON",
          response: responseText.slice(0, 500),
        },
        {
          status: 502,
        }
      );
    }

    return NextResponse.json(data, {
      status: upstreamResponse.ok
        ? 200
        : upstreamResponse.status,
      headers: {
        "Cache-Control":
          "no-store, no-cache, must-revalidate",
      },
    });
  } catch (error) {
    console.error("[download progress error]", error);

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Unable to check download progress",
      },
      {
        status: 500,
      }
    );
  }
}
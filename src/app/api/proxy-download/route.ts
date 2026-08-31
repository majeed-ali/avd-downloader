import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const url = searchParams.get('url');

    if (!url) {
      return NextResponse.json({ error: 'Missing url' }, { status: 400 });
    }

    const remote = await fetch(url);

    if (!remote.ok) {
      return NextResponse.json({ error: 'Failed to fetch remote file' }, { status: 502 });
    }

    const headers = new Headers();

    // Copy a small set of safe headers to preserve filename/type
    const contentType = remote.headers.get('content-type');
    const contentDisposition = remote.headers.get('content-disposition');

    if (contentType) headers.set('Content-Type', contentType);
    if (contentDisposition) headers.set('Content-Disposition', contentDisposition);

    // Stream the response body directly
    return new NextResponse(remote.body, { headers });
  } catch (err) {
    return NextResponse.json({ error: 'Proxy error' }, { status: 500 });
  }
}

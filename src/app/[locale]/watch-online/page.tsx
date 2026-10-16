import { permanentRedirect } from "next/navigation";

type PageProps = {
  params: Promise<{
    locale: string;
  }>;
};

export async function generateMetadata({ params }: PageProps) {
  const { locale } = await params;
  permanentRedirect(`/${locale}/terabox-downloader`);
}

export default async function WatchOnlinePage({ params }: PageProps) {
  const { locale } = await params;
  permanentRedirect(`/${locale}/terabox-downloader`);
}

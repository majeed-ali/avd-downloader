import type { Metadata } from "next";
import "@/app/globals.css";
import { inter_sans } from "../_client/libs/fonts";

export const metadata: Metadata = {
  title: "Super Admin Dashboard | AnyVideoDownloader",
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter_sans} font-inter bg-[#060a14] text-slate-100 min-h-screen antialiased`}>
        {children}
      </body>
    </html>
  );
}

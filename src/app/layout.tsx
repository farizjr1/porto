import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Portofolio Akuntansi Fariz",
  description:
    "Website portofolio akuntansi dengan dashboard untuk upload blog, edit konten, dan tambah pengalaman kerja.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}

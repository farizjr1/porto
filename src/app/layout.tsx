import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import BottomNav from "@/components/BottomNav";

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
      <body>
        <Navbar />
        <main style={{ paddingBottom: "calc(var(--nav-height) + 1rem)" }}>
          {children}
        </main>
        <BottomNav />
      </body>
    </html>
  );
}

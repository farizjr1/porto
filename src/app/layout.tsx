import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import BottomNav from "@/components/BottomNav";

export const metadata: Metadata = {
  title: "Portfolio Akuntansi",
  description:
    "Website portfolio akuntansi dengan dashboard tersembunyi untuk update biodata, CV, pengalaman, dan skill menggunakan Supabase.",
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
        <main>{children}</main>
        <BottomNav />
      </body>
    </html>
  );
}

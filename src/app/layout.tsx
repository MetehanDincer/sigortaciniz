import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

import { WhatsAppButton } from "@/components/whatsapp-button";

export const metadata: Metadata = {
  title: "Sigortacınız.com | Hızlı ve Güvenilir Sigorta Çözümleri",
  description: "Aracınız, sağlığınız ve eviniz için en uygun sigorta tekliflerini saniyeler içinde alın.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <WhatsAppButton />
      </body>
    </html>
  );
}

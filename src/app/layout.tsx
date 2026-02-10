import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { getAgencyConfig } from "@/lib/agency";
import { WhatsAppButton } from "@/components/whatsapp-button";
import { GoogleAnalytics } from "@/components/google-analytics";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  const agency = await getAgencyConfig();
  const name = agency?.name || "UygunSigortaci.com";
  const description = agency?.name
    ? `${agency.name} ile aracınız, sağlığınız ve eviniz için en uygun sigorta tekliflerini saniyeler içinde alın.`
    : "Aracınız, sağlığınız ve eviniz için en uygun sigorta tekliflerini saniyeler içinde alın.";

  return {
    title: {
      default: `${name} | Hızlı ve Güvenilir Sigorta Çözümleri`,
      template: `%s | ${name}`
    },
    description: description,
    keywords: ["sigorta", "kasko", "trafik sigortası", "dask", "sağlık sigortası", "en uygun sigorta"],
    authors: [{ name: name }],
    creator: name,
    publisher: name,
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    openGraph: {
      type: "website",
      locale: "tr_TR",
      url: `https://${agency?.domain || "uygunsigortaci.com"}`,
      siteName: name,
      title: `${name} | Sigorta Teklifleri`,
      description: description,
      images: [
        {
          url: agency?.logo_url || "/logo.jpg",
          width: 1200,
          height: 630,
          alt: name,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${name} | Sigorta Teklifleri`,
      description: description,
      images: [agency?.logo_url || "/logo.jpg"],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const agency = await getAgencyConfig();
  const name = agency?.name || "UygunSigortaci.com";

  return (
    <html lang="tr">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": name,
              "url": `https://${agency?.domain || "uygunsigortaci.com"}`,
              "logo": agency?.logo_url || "https://uygunsigortaci.com/logo.jpg",
              "contactPoint": {
                "@type": "ContactPoint",
                "telephone": agency?.whatsapp_number,
                "contactType": "customer service"
              }
            })
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        style={{
          // @ts-ignore
          "--primary": agency?.primary_color || "#4f46e5",
          "--primary-foreground": "#ffffff",
          "--ring": agency?.primary_color || "#4f46e5",
        }}
      >
        <GoogleAnalytics id={process.env.NEXT_PUBLIC_GA_ID || ""} />
        {children}
        <WhatsAppButton agency={agency} />
        <Toaster />
      </body>
    </html>
  );
}

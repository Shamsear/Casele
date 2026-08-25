import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import { SITE } from "@/lib/seo";
import { LocalBusinessSchema, WebsiteSchema, OrganizationSchema } from "@/components/seo/local-business-schema";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#FAFAFA",
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.title} — Luxury Phone Protection`,
    template: `%s | ${SITE.name} Qatar`,
  },
  description: SITE.description,
  keywords: SITE.keywords,
  authors: [{ name: SITE.name }],
  creator: SITE.name,
  publisher: SITE.name,
  icons: {
    icon: "/icon.svg",
    apple: "/apple-icon.png",
  },

  // Open Graph
  openGraph: {
    type: "website",
    locale: SITE.locale,
    url: SITE.url,
    siteName: SITE.name,
    title: `${SITE.name} — Refined Protection. Uncompromised Design.`,
    description: SITE.description,
    images: [
      {
        url: `${SITE.url}/og-home.png`,
        width: 1200,
        height: 630,
        alt: `${SITE.name} — Premium Luxury Phone Cases in Qatar`,
      },
    ],
  },

  // Twitter
  twitter: {
    card: "summary_large_image",
    title: SITE.title,
    description: SITE.description,
    images: [`${SITE.url}/og-home.png`],
    creator: SITE.twitter,
  },

  // Robots
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  alternates: {
    canonical: SITE.url,
  },

  // Geo targeting for Qatar
  other: {
    "geo.region": "QA",
    "geo.placename": "Doha",
    "geo.position": `${SITE.geo.latitude};${SITE.geo.longitude}`,
    ICBM: `${SITE.geo.latitude}, ${SITE.geo.longitude}`,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${cormorant.variable} ${inter.variable}`} suppressHydrationWarning>
      <head>
        <LocalBusinessSchema />
        <WebsiteSchema />
        <OrganizationSchema />
      </head>
      <body className="min-h-screen bg-neutral-50 text-neutral-950 font-body antialiased selection:bg-neutral-900 selection:text-white">
        {children}
      </body>
    </html>
  );
}

import type { Metadata, Viewport } from "next";
import { Space_Grotesk, Inter, Playfair_Display, Great_Vibes } from "next/font/google";
import localFont from "next/font/local";
import ClientProviders from "@/components/providers/ClientProviders";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["400", "500", "600"],
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const greatVibes = Great_Vibes({
  subsets: ["latin"],
  variable: "--font-script",
  weight: ["400"],
  display: "swap",
});

const blenny = localFont({
  src: "../../public/TrialStaticFonts/Blenny_Trial_Blk.woff2",
  variable: "--font-blenny",
  weight: "900",
  display: "swap",
});

const SITE_URL = "https://kulffi.com";

export const metadata: Metadata = {
  title: "Kulffi — Handcrafted Ice Cream",
  description:
    "Real ice cream, made with ingredients from India and beyond. Saffron Pistachio, Alphonso Mango, Dark Chocolate, and more. Even if you think you don't like ice cream.",
  keywords: [
    "kulfi",
    "ice cream",
    "handcrafted ice cream",
    "indian ice cream",
    "saffron pistachio",
    "alphonso mango",
    "dark chocolate",
    "artisan ice cream",
    "natural ingredients",
  ],
  authors: [{ name: "Kulffi" }],
  creator: "Kulffi",
  metadataBase: new URL(SITE_URL),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Kulffi — Handcrafted Ice Cream",
    description:
      "Real ice cream, made with ingredients from India and beyond. Saffron Pistachio, Alphonso Mango, Dark Chocolate, and more.",
    url: SITE_URL,
    siteName: "Kulffi",
    images: [
      {
        url: "/images/hero.webp",
        width: 1200,
        height: 630,
        alt: "Kulffi — Handcrafted Ice Cream",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Kulffi — Handcrafted Ice Cream",
    description:
      "Real ice cream, made with ingredients from India and beyond. Saffron Pistachio, Alphonso Mango, Dark Chocolate, and more.",
    images: ["/images/hero.webp"],
  },
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
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.webp",
  },
  manifest: "/site.webmanifest",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#F5E6D3",
  colorScheme: "light",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${inter.variable} ${playfair.variable} ${greatVibes.variable} ${blenny.variable}`}>
      <head>
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.googleapis.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preload" as="image" href="/images/hero.webp" type="image/webp" fetchPriority="high" />
      </head>
      <body className="min-h-full bg-[#F5E6D3] text-[#2A1810]">
        <ClientProviders>
          {children}
        </ClientProviders>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FoodEstablishment",
              name: "Kulffi",
              description:
                "Handcrafted ice cream made with ingredients from India and beyond.",
              url: SITE_URL,
              image: `${SITE_URL}/images/hero.webp`,
              servesCuisine: "Ice Cream",
              priceRange: "$$",
              address: {
                "@type": "PostalAddress",
                addressCountry: "US",
              },
            }),
          }}
        />
      </body>
    </html>
  );
}

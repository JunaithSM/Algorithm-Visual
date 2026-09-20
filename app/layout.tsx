import type { Metadata, Viewport } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-poppins",
});

const SITE_URL = "https://dsa.junaith.dev";
const SITE_TITLE = "DSA Visualizer — Interactive Algorithm Learning";
const SITE_DESCRIPTION =
  "Learn sorting and searching algorithms through interactive visualizations, multi-language code editor, and step-by-step execution. Supports 16+ algorithms in 18 programming languages.";

export const metadata: Metadata = {
  title: {
    default: SITE_TITLE,
    template: "%s | DSA Visualizer",
  },
  description: SITE_DESCRIPTION,
  metadataBase: new URL(SITE_URL),

  keywords: [
    "algorithm visualizer",
    "DSA",
    "data structures",
    "sorting algorithms",
    "searching algorithms",
    "bubble sort",
    "quick sort",
    "merge sort",
    "binary search",
    "linear search",
    "interactive learning",
    "code editor",
    "algorithm animation",
  ],

  authors: [{ name: "Junaith", url: SITE_URL }],
  creator: "Junaith",
  publisher: "Junaith",

  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },

  manifest: "/site.webmanifest",

  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: "DSA Visualizer",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "DSA Visualizer — Interactive Algorithm Learning",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: ["/og-image.png"],
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

  alternates: {
    canonical: SITE_URL,
  },
};

export const viewport: Viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${poppins.variable} h-full antialiased`}>
      <body className={`${poppins.className} min-h-full flex flex-col relative`}>
        {children}
      </body>
    </html>
  );
}

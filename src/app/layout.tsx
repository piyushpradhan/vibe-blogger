import "@/styles/globals.css";

import { type Metadata } from "next";
import { Geist } from "next/font/google";
import { Providers } from "@/components/providers";
import { Toaster } from "@/components/ui/toaster";
import { ErrorBoundary } from "@/components/error-boundary";
import { Analytics } from "@vercel/analytics/react";
import Script from "next/script";

const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID;

export const metadata: Metadata = {
  title: "VibeBlogger - AI-Powered Microblogging Platform",
  description:
    "Transform your fleeting thoughts into polished blog posts with AI. Capture ideas instantly, organize them into sessions, and let AI help you create engaging content. Perfect for writers, content creators, and anyone who wants to turn thoughts into stories.",
  keywords: [
    "AI blogging",
    "microblogging",
    "content creation",
    "AI writing assistant",
    "thought capture",
    "blog generator",
    "writing tool",
    "content management",
    "AI-powered writing",
    "note-taking app",
    "blog platform",
    "content creator tools",
  ],
  authors: [{ name: "VibeBlogger Team" }],
  creator: "VibeBlogger",
  publisher: "VibeBlogger",
  applicationName: "VibeBlogger",
  category: "Productivity",
  classification: "Blogging Tool",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL ?? "https://vibeblogger.com",
  ),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "VibeBlogger - AI-Powered Microblogging Platform",
    description:
      "Transform your fleeting thoughts into polished blog posts with AI. Capture ideas instantly and create engaging content.",
    url: process.env.NEXT_PUBLIC_APP_URL ?? "https://vibeblogger.com",
    siteName: "VibeBlogger",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "VibeBlogger - AI-Powered Microblogging Platform",
        type: "image/png",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "VibeBlogger - AI-Powered Microblogging Platform",
    description:
      "Transform your fleeting thoughts into polished blog posts with AI. Perfect for content creators and writers.",
    images: ["/og-image.png"],
    creator: "@vibeblogger",
    site: "@vibeblogger",
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
  },
  manifest: "/site.webmanifest",
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
  },
};

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geist.variable}`}>
      <body>
        <ErrorBoundary>
          <Providers>{children}</Providers>
          <Toaster />
          <Analytics />
          {GA_TRACKING_ID && (
            <>
              <Script
                strategy="afterInteractive"
                src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
              />
              <Script
                id="google-analytics"
                strategy="afterInteractive"
                dangerouslySetInnerHTML={{
                  __html: `
                    window.dataLayer = window.dataLayer || [];
                    function gtag(){dataLayer.push(arguments);}
                    gtag('js', new Date());
                    gtag('config', '${GA_TRACKING_ID}', {
                      page_path: window.location.pathname,
                    });
                  `,
                }}
              />
            </>
          )}
        </ErrorBoundary>
      </body>
    </html>
  );
}

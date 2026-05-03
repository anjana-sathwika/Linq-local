import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "LinQ – Link your commute",
  description: "Smart commute matching platform. Find people traveling on overlapping daily routes, split costs, and save money on your daily travel. No exact same pickup needed.",
  keywords: "ride sharing, carpool, commute, split costs, daily travel, route matching, telangana, hyderabad",
  authors: [{ name: "LinQ Team" }],
  openGraph: {
    title: "LinQ – Link your commute",
    description: "Smart route matching for daily commuters. Split costs and save money.",
    type: "website",
    locale: "en_IN",
    url: "https://linq.app",
    siteName: "LinQ",
  },
  twitter: {
    card: "summary_large_image",
    title: "LinQ – Link your commute",
    description: "Smart route matching for daily commuters. Split costs and save money.",
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
};

/* 🔴 THIS FIXES ZOOMED-OUT MOBILE */
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className={inter.className}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}

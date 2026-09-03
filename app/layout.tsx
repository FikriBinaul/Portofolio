import type { Metadata, Viewport } from "next";
import "./globals.css";
import Wallpaper from "@/components/Wallpaper";

export const metadata: Metadata = {
  title: "Fikri Binaul Umah — Portfolio OS",
  description:
    "Portfolio of Fikri Binaul Umah — Embedded Systems, IoT, AI & Research Engineer, presented as a macOS-style desktop. Built with Next.js and Framer Motion.",
  keywords: [
    "Fikri Binaul Umah",
    "Embedded Systems",
    "IoT",
    "Computer Vision",
    "Research Engineer",
    "BRIN",
    "IPB University",
    "Portfolio",
  ],
  authors: [{ name: "Fikri Binaul Umah" }],
  openGraph: {
    title: "Fikri Binaul Umah — Portfolio OS",
    description:
      "Embedded systems, IoT, and applied computer vision — from ESP32 firmware to research deployed with BRIN and IPB University.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Fikri Binaul Umah — Portfolio OS",
    description: "Embedded systems, IoT, and applied computer vision.",
  },
};

export const viewport: Viewport = {
  themeColor: "#06060a",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,500;0,9..144,600;0,9..144,700;1,9..144,500;1,9..144,600&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <Wallpaper />
        {children}
      </body>
    </html>
  );
}
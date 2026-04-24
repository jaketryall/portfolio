import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ViewTransitions } from "next-view-transitions";
import "./globals.css";
import { SmoothScroll } from "@/components/motion/SmoothScroll";
import { Cursor } from "@/components/motion/Cursor";
import { Nav } from "@/components/nav/Nav";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://jakeryall.com"),
  title: {
    default: "Jake Ryall — Web Designer",
    template: "%s · Jake Ryall",
  },
  description:
    "Jake Ryall is a web designer building interfaces that move. Selected work, case studies, and a little about me.",
  openGraph: {
    title: "Jake Ryall — Web Designer",
    description:
      "Web designer building interfaces that move. Selected work and case studies.",
    type: "website",
    siteName: "Jake Ryall",
  },
  twitter: {
    card: "summary_large_image",
    title: "Jake Ryall — Web Designer",
    description: "Web designer building interfaces that move.",
  },
};

export const viewport: Viewport = {
  themeColor: "#EBE5D1",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ViewTransitions>
      <html
        lang="en"
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <body className="min-h-screen">
          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:rounded-md focus:bg-ink focus:px-4 focus:py-2 focus:text-canvas"
          >
            Skip to content
          </a>
          <SmoothScroll>
            <Cursor />
            <Nav />
            <main id="main">{children}</main>
          </SmoothScroll>
        </body>
      </html>
    </ViewTransitions>
  );
}

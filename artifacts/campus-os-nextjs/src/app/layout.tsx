import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import OmniCommand from "@/components/OmniCommand";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CampusOS | Frictionless Student Life",
  description: "Your university survival app. Built for speed.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#050505",
};

import { ThemeProvider } from "next-themes";
import SmoothScroll from "@/components/SmoothScroll";
import AnimatedBackground from "@/components/AnimatedBackground";
import AIAssistant from "@/components/AIAssistant";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} antialiased`} suppressHydrationWarning>
      <body 
        className="overflow-x-hidden selection:bg-brand-500/30 bg-transparent"
        vaul-drawer-wrapper=""
      >
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <AnimatedBackground />
          <SmoothScroll>
            <div className="relative min-h-screen">
              {children}
            </div>
          </SmoothScroll>
          <OmniCommand />
          <AIAssistant />
        </ThemeProvider>
      </body>
    </html>
  );
}

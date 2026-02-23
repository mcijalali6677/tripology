import type React from "react"
import type { Metadata } from "next"
import { Inter, Playfair_Display, Vazirmatn } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { RootLayoutWrapper } from "@/components/root-layout-wrapper"
import { BottomNav } from "@/components/bottom-nav"
import "./globals.css"

// Primary sans-serif — Inter: the #1 most popular Google Font,
// used by Linear, Vercel, GitHub, Figma, etc.
const inter = Inter({
  subsets: ["latin", "latin-ext"],
  variable: "--font-inter",
  display: "swap",
})

// Serif / Display — Playfair Display: elegant headlines,
// used by travel & luxury brands worldwide
const playfair = Playfair_Display({
  subsets: ["latin", "latin-ext"],
  variable: "--font-playfair",
  display: "swap",
})

// Arabic/Persian — Vazirmatn: modern, clean Persian/Arabic font
// designed for excellent screen readability
const vazirmatn = Vazirmatn({
  subsets: ["arabic"],
  variable: "--font-vazirmatn",
  display: "swap",
  weight: ["400", "500", "700"],
})

export const metadata: Metadata = {
  title: "Tripology | Travel Itinerary Marketplace",
  description:
    "Discover and purchase real travel itineraries from experienced travelers. Get authentic trip plans with tested routes, budgets, and hidden gems - all in CAD.",
  generator: "v0.app",
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable} ${vazirmatn.variable}`}>
      <body className="antialiased">
        <RootLayoutWrapper>
          {children}
          <BottomNav />
        </RootLayoutWrapper>
        <Analytics />
      </body>
    </html>
  )
}

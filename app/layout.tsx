import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"

import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"

import { Toaster } from "@/components/ui/sonner"

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
})

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export const metadata: Metadata = {
  title: {
    default: "RentNest — Find your next home",
    template: "%s | RentNest",
  },
  description:
    "Discover verified rental properties, send rental requests, and pay securely with RentNest.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geist.variable} ${fontMono.variable}`}
    >
      <body className="antialiased">
        <ThemeProvider>
          {children}
           <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}

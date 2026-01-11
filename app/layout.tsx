import type React from "react"
import type { Metadata } from "next"
import { Instrument_Serif } from "next/font/google"
import "./globals.css"

const instrumentSerif = Instrument_Serif({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-instrument-serif",
})

export const metadata: Metadata = {
  title: "Autopay Tracker",
  description: "Monitor and manage your API credit subscriptions and spending",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${instrumentSerif.className} antialiased`}>
        {children}
      </body>
    </html>
  )
}

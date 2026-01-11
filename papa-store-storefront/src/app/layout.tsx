import { getBaseURL } from "@lib/util/env"
import { Metadata } from "next"
import { Shantell_Sans, Comfortaa, Nunito } from "next/font/google"
import "styles/globals.css"

// Display font - Logo & Big Titles (high energy, fun, child-like)
const shantellSans = Shantell_Sans({
  subsets: ["latin", "cyrillic", "cyrillic-ext"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-display",
  display: "swap",
})

// Heading font - Product Names (soft, rounded, easy to scan)
const comfortaa = Comfortaa({
  subsets: ["latin", "cyrillic"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-heading",
  display: "swap",
})

// Body font - Descriptions & Prices (clean, trustworthy, mobile-friendly)
const nunito = Nunito({
  subsets: ["latin", "cyrillic", "cyrillic-ext"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body",
  display: "swap",
})

export const metadata: Metadata = {
  metadataBase: new URL(getBaseURL()),
}

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html lang="bg" data-mode="light" className={`${shantellSans.variable} ${comfortaa.variable} ${nunito.variable}`}>
      <body className="font-body antialiased">
        <main className="relative">{props.children}</main>
      </body>
    </html>
  )
}

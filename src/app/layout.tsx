import type { Metadata } from "next"
import { Space_Grotesk } from 'next/font/google'
import "./globals.css"

const spaceGrotesk = Space_Grotesk({ 
  subsets: ["latin"],
  variable: '--font-grotesk',
})

export const metadata: Metadata = {
  title: "Kenya Events Gallery",
  description: "Discover amazing events happening in Kenya",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`dark ${spaceGrotesk.variable}`}>
      <body>{children}</body>
    </html>
  )
}


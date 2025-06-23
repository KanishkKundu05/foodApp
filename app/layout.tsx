import { Geist, Geist_Mono, Montserrat } from "next/font/google"
import type { ReactNode } from "react"
import { cn } from "@/lib/utils"
import { Navigation } from "@/components/navigation"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/sonner"

import "@/app/tokens.css"
import "@/app/globals.css"

const GeistSans = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
})

const GeistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

const MontserratSerif = Montserrat({
  subsets: ["latin"],
  variable: "--font-serif",
})

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode
}>) {
  return (
    <html
      lang="en"
      className={cn(GeistSans.variable, GeistMono.variable, MontserratSerif.variable, "bg-background text-foreground")}
      suppressHydrationWarning
    >
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Navigation />
          <main className="min-h-screen">{children}</main>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}

export const metadata = {
      generator: 'v0.dev'
    };

import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "./contexts/auth-context"
import { Toaster } from "@/components/ui/toaster"
import { Header } from "./components/header"
import { Footer } from "./components/footer"
import SupabaseProvider from "./supabase-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "TracoIt",
  description: "Find and book amazing travel experiences",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <link rel="icon" href="/greenfav.png" sizes="any" />
      <body className={inter.className} suppressHydrationWarning>
        <SupabaseProvider>
          <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
            <AuthProvider>
              <div className="flex min-h-screen flex-col font-sans">
                <Header />
                <main className="flex-1">{children}</main>
                <Toaster />
                <Footer />
              </div>
            </AuthProvider>
          </ThemeProvider>
        </SupabaseProvider>
      </body>
    </html >
  )
}

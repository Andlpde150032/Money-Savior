import type { ReactNode } from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

import { ThemeProvider } from "@/components/theme-provider"
import { AppLayout } from "@/components/app-layout"
import { Toaster } from "@/components/ui/toaster"
import { ExpenseProvider } from "@/lib/expense-context"
import { LanguageProvider } from "@/lib/language-context"
import { ProfileProvider } from "@/lib/profile-context"

const inter = Inter({ subsets: ["latin"], display: "swap" })

export const metadata: Metadata = {
  title: "Money Savior",
  description: "Simple and effective personal expense management application",
  generator: 'v0.dev',
  icons: {
    icon: '/apple-touch-icon.png',
    shortcut: '/apple-touch-icon.png',
    apple: '/apple-touch-icon.png',
  },
}

export default function RootLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <LanguageProvider>
            <ExpenseProvider>
              <ProfileProvider>
                <AppLayout>{children}</AppLayout>
                <Toaster />
              </ProfileProvider>
            </ExpenseProvider>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}

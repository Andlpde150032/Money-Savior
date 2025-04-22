"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"

import { MobileNav } from "@/components/mobile-nav"
import { MobileHeader } from "@/components/mobile-header"
import { Sidebar } from "@/components/sidebar"
import { useIsMobile } from "@/hooks/use-mobile"

export function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isMobile = useIsMobile()
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return (
      <div className="flex min-h-screen flex-col">
        <div className="flex flex-1 flex-col md:pl-64">
          <main className="flex-1">
            <div className="container py-6 md:py-8">
              {/* Loading placeholder */}
              <div className="h-8 w-48 animate-pulse rounded bg-muted"></div>
              <div className="mt-2 h-4 w-64 animate-pulse rounded bg-muted"></div>
            </div>
          </main>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      {!isMobile && <Sidebar />}
      <div className="flex flex-1 flex-col md:pl-64">
        {isMobile && <MobileHeader />}
        <main className="flex-1">
          <div className="container pb-20 py-6 md:py-8 md:pb-8">{children}</div>
        </main>
      </div>
      {isMobile && <MobileNav />}
    </div>
  )
}

"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { BarChart3, CreditCard, Home, LayoutGrid, Settings } from "lucide-react"

import { cn } from "@/lib/utils"
import { useLanguage } from "@/lib/language-context"
import { useEffect, useState } from "react"

export function MobileNav() {
  const pathname = usePathname()
  const { t } = useLanguage()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const routes = [
    {
      href: "/",
      label: t("dashboard"),
      icon: Home,
      active: pathname === "/",
    },
    {
      href: "/transactions",
      label: t("transactions"),
      icon: CreditCard,
      active: pathname.includes("/transactions"),
    },
    {
      href: "/categories",
      label: t("categories"),
      icon: LayoutGrid,
      active: pathname.includes("/categories"),
    },
    {
      href: "/reports",
      label: t("reports"),
      icon: BarChart3,
      active: pathname.includes("/reports"),
    },
    {
      href: "/settings",
      label: t("settings"),
      icon: Settings,
      active: pathname.includes("/settings"),
    },
  ]

  if (!mounted) {
    return null
  }

  return (
    <div className="fixed bottom-0 left-0 z-50 w-full border-t bg-background md:hidden">
      <div className="flex h-16 items-center justify-around">
        {routes.map((route) => (
          <Link
            key={route.href}
            href={route.href}
            className={cn(
              "flex flex-1 flex-col items-center justify-center text-muted-foreground",
              route.active && "text-primary",
            )}
          >
            <route.icon className="h-5 w-5" />
            <span className="text-xs">{route.label}</span>
          </Link>
        ))}
      </div>
    </div>
  )
}

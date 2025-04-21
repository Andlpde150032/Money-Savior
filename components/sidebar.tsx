"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { BarChart3, CreditCard, Home, LayoutGrid, Moon, Settings, Sun } from "lucide-react"

import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useTheme } from "next-themes"
import { useLanguage } from "@/lib/language-context"
import { LanguageSwitcher } from "@/components/language-switcher"
import { useEffect, useState } from "react"

export function Sidebar() {
  const pathname = usePathname()
  const { setTheme, theme } = useTheme()
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
    <div className="fixed inset-y-0 left-0 z-10 hidden w-64 border-r bg-background md:flex md:flex-col">
      <div className="flex h-16 items-center border-b px-6">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <CreditCard className="h-6 w-6 text-primary" />
          <span className="text-lg font-bold">{t("appName")}</span>
        </Link>
      </div>
      <ScrollArea className="flex-1 px-4 py-6">
        <nav className="flex flex-col gap-2">
          {routes.map((route) => (
            <Button key={route.href} variant={route.active ? "secondary" : "ghost"} className="justify-start" asChild>
              <Link href={route.href}>
                <route.icon className="mr-2 h-5 w-5" />
                {route.label}
              </Link>
            </Button>
          ))}
        </nav>
      </ScrollArea>
      <div className="border-t p-4">
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">{t("copyright")}</p>
          <div className="flex items-center">
            <LanguageSwitcher />
            <Button variant="ghost" size="icon" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
              <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

"use client"

import { CreditCard } from "lucide-react"
import { useProfile } from "@/lib/profile-context"
import { useEffect, useState } from "react"

export function MobileHeader() {
  const { currentProfile } = useProfile()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <div className="sticky top-0 z-30 flex h-16 items-center border-b bg-background px-4 md:hidden">
      <div className="flex items-center gap-2">
        <CreditCard className="h-6 w-6 text-primary" />
        <span className="text-lg font-bold">{currentProfile.name}</span>
      </div>
    </div>
  )
}

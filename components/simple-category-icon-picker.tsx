"use client"
import {
  BadgeDollarSign,
  Banknote,
  Bus,
  Coffee,
  CreditCard,
  Gift,
  Grape,
  Home,
  Landmark,
  Lightbulb,
  Pill,
  ShoppingBag,
  Smartphone,
  Utensils,
  Wallet,
  Wifi,
} from "lucide-react"

import { cn } from "@/lib/utils"

const icons = [
  { value: "banknote", label: "Banknote", icon: Banknote },
  { value: "badge-dollar-sign", label: "Dollar", icon: BadgeDollarSign },
  { value: "bus", label: "Bus", icon: Bus },
  { value: "coffee", label: "Coffee", icon: Coffee },
  { value: "credit-card", label: "Credit Card", icon: CreditCard },
  { value: "gift", label: "Gift", icon: Gift },
  { value: "grape", label: "Food", icon: Grape },
  { value: "home", label: "Home", icon: Home },
  { value: "landmark", label: "Bank", icon: Landmark },
  { value: "lightbulb", label: "Utilities", icon: Lightbulb },
  { value: "pill", label: "Health", icon: Pill },
  { value: "shopping-bag", label: "Shopping", icon: ShoppingBag },
  { value: "smartphone", label: "Phone", icon: Smartphone },
  { value: "utensils", label: "Restaurant", icon: Utensils },
  { value: "wallet", label: "Wallet", icon: Wallet },
  { value: "wifi", label: "Internet", icon: Wifi },
]

interface SimpleCategoryIconPickerProps {
  value: string
  onChange: (value: string) => void
}

export function SimpleCategoryIconPicker({ value, onChange }: SimpleCategoryIconPickerProps) {
  return (
    <div className="grid grid-cols-8 gap-2">
      {icons.map((icon) => {
        const Icon = icon.icon
        return (
          <button
            key={icon.value}
            type="button"
            onClick={() => onChange(icon.value)}
            className={cn(
              "flex h-10 w-10 items-center justify-center rounded-md border",
              value === icon.value ? "border-primary bg-primary/10" : "border-input hover:bg-accent",
            )}
          >
            <Icon className="h-5 w-5" />
            <span className="sr-only">{icon.label}</span>
          </button>
        )
      })}
    </div>
  )
}

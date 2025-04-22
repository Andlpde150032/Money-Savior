"use client"

import { useState } from "react"
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
  ChevronDown,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { useLanguage } from "@/lib/language-context"

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

interface IconPickerProps {
  value: string
  onChange: (value: string) => void
}

export function IconPicker({ value, onChange }: IconPickerProps) {
  const { t } = useLanguage()
  const [open, setOpen] = useState(false)

  const selectedIcon = icons.find((icon) => icon.value === value)
  const IconComponent = selectedIcon?.icon || ShoppingBag

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" role="combobox" aria-expanded={open} className="w-full justify-between">
          <div className="flex items-center">
            <IconComponent className="mr-2 h-4 w-4" />
            <span>{selectedIcon?.label || "Select icon"}</span>
          </div>
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder={t("searchIcon")} />
          <CommandList>
            <CommandEmpty>{t("noIconFound")}</CommandEmpty>
            <CommandGroup>
              {icons.map((icon) => {
                const Icon = icon.icon
                return (
                  <CommandItem
                    key={icon.value}
                    value={icon.value}
                    onSelect={(currentValue) => {
                      onChange(currentValue)
                      setOpen(false)
                    }}
                    className={cn("flex items-center gap-2", value === icon.value && "bg-accent")}
                  >
                    <Icon className="h-4 w-4" />
                    {icon.label}
                  </CommandItem>
                )
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

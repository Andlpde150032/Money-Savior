import type { LucideProps } from "lucide-react"
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

const icons = {
  banknote: Banknote,
  "badge-dollar-sign": BadgeDollarSign,
  bus: Bus,
  coffee: Coffee,
  "credit-card": CreditCard,
  gift: Gift,
  grape: Grape,
  home: Home,
  landmark: Landmark,
  lightbulb: Lightbulb,
  pill: Pill,
  "shopping-bag": ShoppingBag,
  smartphone: Smartphone,
  utensils: Utensils,
  wallet: Wallet,
  wifi: Wifi,
}

interface CategoryIconProps extends Omit<LucideProps, "ref"> {
  name: string
}

export function CategoryIcon({ name, ...props }: CategoryIconProps) {
  const Icon = icons[name as keyof typeof icons] || ShoppingBag
  return <Icon {...props} />
}

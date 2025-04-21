"use client"

import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

const colors = [
  { value: "#ef4444", label: "Red" },
  { value: "#f97316", label: "Orange" },
  { value: "#eab308", label: "Yellow" },
  { value: "#22c55e", label: "Green" },
  { value: "#14b8a6", label: "Teal" },
  { value: "#0ea5e9", label: "Blue" },
  { value: "#3b82f6", label: "Light Blue" },
  { value: "#6366f1", label: "Indigo" },
  { value: "#8b5cf6", label: "Purple" },
  { value: "#ec4899", label: "Pink" },
]

interface SimpleColorPickerProps {
  value: string
  onChange: (value: string) => void
}

export function SimpleColorPicker({ value, onChange }: SimpleColorPickerProps) {
  return (
    <div className="grid grid-cols-5 gap-2">
      {colors.map((color) => (
        <button
          key={color.value}
          type="button"
          className={cn(
            "flex h-10 w-10 items-center justify-center rounded-full",
            value === color.value && "ring-2 ring-offset-2",
          )}
          style={{ backgroundColor: color.value }}
          onClick={() => onChange(color.value)}
        >
          {value === color.value && <Check className="h-4 w-4 text-white" />}
          <span className="sr-only">{color.label}</span>
        </button>
      ))}
    </div>
  )
}

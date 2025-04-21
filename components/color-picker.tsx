"use client"

import { useState } from "react"
import { Check, ChevronDown } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { useLanguage } from "@/lib/language-context"

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

interface ColorPickerProps {
  value: string
  onChange: (value: string) => void
}

export function ColorPicker({ value, onChange }: ColorPickerProps) {
  const { t } = useLanguage()
  const [open, setOpen] = useState(false)

  const selectedColor = colors.find((color) => color.value === value)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" role="combobox" aria-expanded={open} className="w-full justify-between">
          <div className="flex items-center">
            <div className="mr-2 h-4 w-4 rounded-full" style={{ backgroundColor: value }} />
            <span>{selectedColor?.label || t("selectColor")}</span>
          </div>
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-3">
        <div className="grid grid-cols-5 gap-2">
          {colors.map((color) => (
            <button
              key={color.value}
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-full",
                value === color.value && "ring-2 ring-offset-2",
              )}
              style={{ backgroundColor: color.value }}
              onClick={() => {
                onChange(color.value)
                setOpen(false)
              }}
            >
              {value === color.value && <Check className="h-4 w-4 text-white" />}
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  )
}

"use client"

import { useState, useEffect } from "react"
import { format } from "date-fns"
import { vi } from "date-fns/locale"
import { CalendarIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { useLanguage } from "@/lib/language-context"

interface CalendarWrapperProps {
  value: Date | undefined
  onChange: (date: Date | undefined) => void
  placeholder?: string
}

export function CalendarWrapper({ value, onChange, placeholder }: CalendarWrapperProps) {
  const { language, t } = useLanguage()
  const [date, setDate] = useState<Date | undefined>(value)
  const [open, setOpen] = useState(false)

  // Update internal state when value prop changes
  useEffect(() => {
    setDate(value)
  }, [value])

  const handleSelect = (selectedDate: Date | undefined) => {
    setDate(selectedDate)
    onChange(selectedDate)
    setOpen(false)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn("w-full pl-3 text-left font-normal", !date && "text-muted-foreground")}
          type="button"
        >
          {date ? (
            format(date, "PPP", {
              locale: language === "vi" ? vi : undefined,
            })
          ) : (
            <span>{placeholder || t("pickDate")}</span>
          )}
          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={handleSelect}
          initialFocus
          locale={language === "vi" ? vi : undefined}
        />
      </PopoverContent>
    </Popover>
  )
}

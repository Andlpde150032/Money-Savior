"use client"

import { useState, useEffect } from "react"
import { format } from "date-fns"
import { vi } from "date-fns/locale"
import { CalendarIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useLanguage } from "@/lib/language-context"
import type { DateRange } from "react-day-picker"

interface DateRangePickerProps {
  dateRange: {
    from: Date
    to: Date
  }
  onDateRangeChange: (dateRange: { from: Date; to: Date }) => void
}

export function DateRangePicker({ dateRange, onDateRangeChange }: DateRangePickerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const { t, language } = useLanguage()
  const [mounted, setMounted] = useState(false)

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  const handleRangeSelect = (range: string) => {
    const now = new Date()
    let from = new Date()
    const to = now

    switch (range) {
      case "this-month":
        from = new Date(now.getFullYear(), now.getMonth(), 1)
        break
      case "last-month":
        from = new Date(now.getFullYear(), now.getMonth() - 1, 1)
        to.setDate(0) // Last day of previous month
        break
      case "this-year":
        from = new Date(now.getFullYear(), 0, 1)
        break
      case "last-30-days":
        from = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
        break
      case "last-90-days":
        from = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000)
        break
    }

    onDateRangeChange({ from, to })
  }

  const locale = language === "vi" ? vi : undefined

  if (!mounted) {
    return null // Prevent hydration mismatch
  }

  return (
    <div className="grid gap-2">
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn("w-full justify-start text-left sm:w-auto", !dateRange && "text-muted-foreground")}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {dateRange?.from ? (
              dateRange.to ? (
                <>
                  {format(dateRange.from, "P", { locale })} - {format(dateRange.to, "P", { locale })}
                </>
              ) : (
                format(dateRange.from, "P", { locale })
              )
            ) : (
              <span>{t("selectTimeRange")}</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto flex flex-col space-y-2 p-2" align="start">
          <Select onValueChange={handleRangeSelect} defaultValue="this-month">
            <SelectTrigger>
              <SelectValue placeholder={t("selectTimeRange")} />
            </SelectTrigger>
            <SelectContent position="popper">
              <SelectItem value="this-month">{t("thisMonth")}</SelectItem>
              <SelectItem value="last-month">{t("lastMonth")}</SelectItem>
              <SelectItem value="this-year">{t("thisYear")}</SelectItem>
              <SelectItem value="last-30-days">{t("last30Days")}</SelectItem>
              <SelectItem value="last-90-days">{t("last90Days")}</SelectItem>
            </SelectContent>
          </Select>
          <div className="border-t pt-2">
            <Calendar
              mode="range"
              defaultMonth={dateRange?.from}
              selected={{
                from: dateRange?.from,
                to: dateRange?.to,
              }}
              onSelect={(range: DateRange | undefined) => {
                if (range?.from && range?.to) {
                  onDateRangeChange({
                    from: range.from,
                    to: range.to,
                  })
                  setIsOpen(false)
                }
              }}
              numberOfMonths={2}
              locale={locale}
            />
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}

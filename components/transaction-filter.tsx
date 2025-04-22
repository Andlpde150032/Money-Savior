"use client"

import type React from "react"

import { useState } from "react"
import { format } from "date-fns"
import { vi } from "date-fns/locale"
import { CalendarIcon, Search, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { useLanguage } from "@/lib/language-context"

interface TransactionFilterProps {
  onFilterChange?: (filters: { search: string; date: Date | null }) => void
}

export function TransactionFilter({ onFilterChange }: TransactionFilterProps) {
  const { t, language } = useLanguage()
  const [search, setSearch] = useState("")
  const [date, setDate] = useState<Date | null>(null)
  const locale = language === "vi" ? vi : undefined

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSearch = e.target.value
    setSearch(newSearch)
    if (onFilterChange) {
      onFilterChange({ search: newSearch, date })
    }
  }

  const handleDateChange = (newDate: Date | null) => {
    setDate(newDate)
    if (onFilterChange) {
      onFilterChange({ search, date: newDate })
    }
  }

  const handleClearDate = () => {
    setDate(null)
    if (onFilterChange) {
      onFilterChange({ search, date: null })
    }
  }

  return (
    <div className="flex flex-col gap-4 sm:flex-row">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder={t("searchTransactions")} value={search} onChange={handleSearchChange} className="pl-9" />
      </div>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn("w-full justify-start text-left sm:w-auto", !date && "text-muted-foreground")}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? format(date, "PPP", { locale }) : t("selectDate")}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="end">
          <Calendar
            mode="single"
            selected={date || undefined}
            onSelect={handleDateChange}
            initialFocus
            locale={locale}
          />
        </PopoverContent>
      </Popover>
      {date && (
        <Button variant="ghost" size="icon" onClick={handleClearDate} className="h-10 w-10">
          <X className="h-4 w-4" />
          <span className="sr-only">{t("clearDate")}</span>
        </Button>
      )}
    </div>
  )
}

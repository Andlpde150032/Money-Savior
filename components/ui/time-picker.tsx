"use client"

import { useState, useEffect } from "react"
import { Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { useLanguage } from "@/lib/language-context"

interface TimePickerProps {
  value: string | undefined
  onChange: (time: string | undefined) => void
  placeholder?: string
}

export function TimePicker({ value, onChange, placeholder }: TimePickerProps) {
  const { t } = useLanguage()
  const [time, setTime] = useState<string | undefined>(value)
  const [open, setOpen] = useState(false)

  // Update internal state when value prop changes
  useEffect(() => {
    setTime(value)
  }, [value])

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = e.target.value
    setTime(newTime)
    onChange(newTime)
  }

  const handleQuickTimeSelect = (selectedTime: string) => {
    setTime(selectedTime)
    onChange(selectedTime)
    setOpen(false)
  }

  // Common time presets
  const timePresets = [
    "08:00", "09:00", "10:00", "11:00", "12:00", 
    "13:00", "14:00", "15:00", "16:00", "17:00", 
    "18:00", "19:00", "20:00", "21:00", "22:00"
  ]

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn("w-full pl-3 text-left font-normal", !time && "text-muted-foreground")}
          type="button"
        >
          {time ? (
            time
          ) : (
            <span>{placeholder || t("pickTime")}</span>
          )}
          <Clock className="ml-auto h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-4" align="start">
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">{t("enterTime")}</label>
            <Input
              type="time"
              value={time}
              onChange={handleTimeChange}
              className="w-full"
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">{t("commonTimes")}</label>
            <div className="grid grid-cols-3 gap-2">
              {timePresets.map((preset) => (
                <Button 
                  key={preset} 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleQuickTimeSelect(preset)}
                  className={cn(
                    time === preset && "bg-primary text-primary-foreground"
                  )}
                >
                  {preset}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}

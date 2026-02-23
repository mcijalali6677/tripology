"use client"

import { useState, useMemo } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import {
  gregorianToJalali,
  jalaliToGregorian,
  jalaliMonthDays,
  jalaliDayOfWeek,
  PERSIAN_MONTHS,
  PERSIAN_WEEKDAYS_SHORT,
  toPersianDigits,
} from "@/lib/jalali"

interface JalaliDatePickerProps {
  value: string // Gregorian "YYYY-MM-DD"
  onChange: (value: string) => void
  label?: string
  className?: string
}

export function JalaliDatePicker({ value, onChange, label, className }: JalaliDatePickerProps) {
  const [open, setOpen] = useState(false)

  // Parse current value to Jalali
  const [valYear, valMonth, valDay] = useMemo(() => {
    if (!value) return [1405, 1, 1]
    const [gy, gm, gd] = value.split("-").map(Number)
    return gregorianToJalali(gy, gm, gd)
  }, [value])

  const [viewYear, setViewYear] = useState(valYear)
  const [viewMonth, setViewMonth] = useState(valMonth)

  const daysInMonth = jalaliMonthDays(viewYear, viewMonth)
  const firstDayOfWeek = jalaliDayOfWeek(viewYear, viewMonth, 1)

  const days = useMemo(() => {
    const arr: (number | null)[] = []
    // Fill blanks before first day
    for (let i = 0; i < firstDayOfWeek; i++) arr.push(null)
    for (let d = 1; d <= daysInMonth; d++) arr.push(d)
    return arr
  }, [firstDayOfWeek, daysInMonth])

  const handlePrevMonth = () => {
    if (viewMonth === 1) {
      setViewMonth(12)
      setViewYear(viewYear - 1)
    } else {
      setViewMonth(viewMonth - 1)
    }
  }

  const handleNextMonth = () => {
    if (viewMonth === 12) {
      setViewMonth(1)
      setViewYear(viewYear + 1)
    } else {
      setViewMonth(viewMonth + 1)
    }
  }

  const handleSelectDay = (day: number) => {
    const [gy, gm, gd] = jalaliToGregorian(viewYear, viewMonth, day)
    const str = `${gy}-${String(gm).padStart(2, "0")}-${String(gd).padStart(2, "0")}`
    onChange(str)
    setOpen(false)
  }

  const displayText = value
    ? `${toPersianDigits(valDay)} ${PERSIAN_MONTHS[valMonth - 1]} ${toPersianDigits(valYear)}`
    : "انتخاب تاریخ"

  return (
    <div className={cn("relative", className)}>
      <button
        type="button"
        onClick={() => {
          if (!open) {
            setViewYear(valYear)
            setViewMonth(valMonth)
          }
          setOpen(!open)
        }}
        className="w-full flex items-center gap-2 bg-background rounded-lg px-3 py-2.5 border h-10 text-sm font-medium hover:bg-secondary/30 transition-colors"
      >
        <span className="flex-1 text-start">{displayText}</span>
        <svg className="size-4 text-muted-foreground shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="4" width="18" height="18" rx="2" />
          <path d="M16 2v4M8 2v4M3 10h18" />
        </svg>
      </button>

      {open && (
        <div className="absolute top-full mt-1 z-50 bg-background border rounded-xl shadow-lg p-3 w-[280px] start-0">
          {/* Header: Month Year + nav */}
          <div className="flex items-center justify-between mb-3">
            <Button variant="ghost" size="icon" className="size-7" onClick={handleNextMonth}>
              <ChevronRight className="size-4" />
            </Button>
            <span className="font-semibold text-sm">
              {PERSIAN_MONTHS[viewMonth - 1]} {toPersianDigits(viewYear)}
            </span>
            <Button variant="ghost" size="icon" className="size-7" onClick={handlePrevMonth}>
              <ChevronLeft className="size-4" />
            </Button>
          </div>

          {/* Weekday headers */}
          <div className="grid grid-cols-7 gap-0.5 mb-1">
            {PERSIAN_WEEKDAYS_SHORT.map((d) => (
              <div key={d} className="text-center text-[10px] text-muted-foreground font-medium py-1">
                {d}
              </div>
            ))}
          </div>

          {/* Days grid */}
          <div className="grid grid-cols-7 gap-0.5">
            {days.map((day, i) => {
              if (day === null) return <div key={`blank-${i}`} />
              const isSelected = day === valDay && viewMonth === valMonth && viewYear === valYear
              return (
                <button
                  key={day}
                  type="button"
                  onClick={() => handleSelectDay(day)}
                  className={cn(
                    "size-8 rounded-lg text-xs font-medium flex items-center justify-center transition-colors",
                    isSelected
                      ? "bg-forest text-white"
                      : "hover:bg-secondary/50"
                  )}
                >
                  {toPersianDigits(day)}
                </button>
              )
            })}
          </div>

          {/* Today button */}
          <div className="mt-2 pt-2 border-t">
            <button
              type="button"
              className="w-full text-center text-xs text-forest font-medium py-1 hover:underline"
              onClick={() => {
                const now = new Date()
                const [jy, jm, jd] = gregorianToJalali(now.getFullYear(), now.getMonth() + 1, now.getDate())
                setViewYear(jy)
                setViewMonth(jm)
                handleSelectDay(jd)
              }}
            >
              امروز
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

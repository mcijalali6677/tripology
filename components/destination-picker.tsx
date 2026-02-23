"use client"

import { useState, useRef, useEffect, useMemo } from "react"
import { MapPin, Search, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { iranDestinations, type IranDestination } from "@/lib/data/iran-destinations"

interface DestinationPickerProps {
  value: string
  onChange: (value: string) => void
  locale: string
  label?: string
  className?: string
}

export function DestinationPicker({ value, onChange, locale, className }: DestinationPickerProps) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const isFa = locale === "fa"

  // Get display name based on locale
  const getDisplayName = (dest: IranDestination) =>
    isFa ? dest.nameFa : dest.nameEn

  const getProvinceName = (dest: IranDestination) =>
    isFa ? dest.provinceFa : dest.province

  // Current display value
  const displayValue = useMemo(() => {
    const found = iranDestinations.find(
      (d) => d.nameEn === value || d.nameFa === value || d.id === value
    )
    if (found) return getDisplayName(found)
    return value || (isFa ? "انتخاب مقصد" : "Select destination")
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, locale])

  // Filter by search
  const filtered = useMemo(() => {
    if (!search.trim()) return iranDestinations
    const q = search.toLowerCase().trim()
    return iranDestinations.filter(
      (d) =>
        d.nameEn.toLowerCase().includes(q) ||
        d.nameFa.includes(q) ||
        d.province.toLowerCase().includes(q) ||
        d.provinceFa.includes(q)
    )
  }, [search])

  // Group by province
  const grouped = useMemo(() => {
    const map = new Map<string, IranDestination[]>()
    for (const dest of filtered) {
      const prov = isFa ? dest.provinceFa : dest.province
      if (!map.has(prov)) map.set(prov, [])
      map.get(prov)!.push(dest)
    }
    return map
  }, [filtered, isFa])

  // Close on outside click
  useEffect(() => {
    if (!open) return
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
        setSearch("")
      }
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [open])

  // Focus input when opened
  useEffect(() => {
    if (open && inputRef.current) inputRef.current.focus()
  }, [open])

  const typeIcons: Record<string, string> = {
    city: "🏙️",
    island: "🏝️",
    village: "🏘️",
    nature: "🏔️",
  }

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      <button
        type="button"
        onClick={() => { setOpen(!open); setSearch("") }}
        className="w-full flex items-center gap-2 bg-background rounded-lg px-3 py-2.5 border h-10 hover:bg-secondary/30 transition-colors"
      >
        <MapPin className="size-4 text-forest shrink-0" />
        <span className="font-medium text-sm flex-1 text-start truncate">{displayValue}</span>
        <svg className={cn("size-4 text-muted-foreground transition-transform", open && "rotate-180")} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>

      {open && (
        <div className="absolute top-full mt-1 z-50 bg-background border rounded-xl shadow-lg w-full min-w-[280px] max-h-[350px] flex flex-col start-0">
          {/* Search input */}
          <div className="p-2 border-b">
            <div className="relative">
              <Search className="absolute start-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
              <input
                ref={inputRef}
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={isFa ? "جستجوی شهر یا استان..." : "Search city or province..."}
                className="w-full ps-8 pe-8 py-2 text-sm rounded-lg border bg-secondary/30 focus:outline-none focus:ring-1 focus:ring-forest"
              />
              {search && (
                <button
                  type="button"
                  className="absolute end-2 top-1/2 -translate-y-1/2"
                  onClick={() => setSearch("")}
                >
                  <X className="size-3.5 text-muted-foreground" />
                </button>
              )}
            </div>
          </div>

          {/* Results */}
          <div className="overflow-y-auto flex-1 p-1">
            {filtered.length === 0 ? (
              <div className="text-center text-sm text-muted-foreground py-6">
                {isFa ? "نتیجه‌ای یافت نشد" : "No results found"}
              </div>
            ) : (
              Array.from(grouped.entries()).map(([province, cities]) => (
                <div key={province}>
                  <div className="px-2 py-1.5 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider sticky top-0 bg-background">
                    {province}
                  </div>
                  {cities.map((dest) => {
                    const name = getDisplayName(dest)
                    const isSelected = value === dest.nameEn || value === dest.nameFa || value === dest.id
                    return (
                      <button
                        key={dest.id}
                        type="button"
                        onClick={() => {
                          onChange(dest.nameEn)
                          setOpen(false)
                          setSearch("")
                        }}
                        className={cn(
                          "w-full flex items-center gap-2 px-2 py-2 rounded-lg text-sm text-start transition-colors",
                          isSelected
                            ? "bg-forest/10 text-forest font-medium"
                            : "hover:bg-secondary/50"
                        )}
                      >
                        <span className="text-base shrink-0">{typeIcons[dest.type] || "📍"}</span>
                        <span className="flex-1 truncate">{name}</span>
                        {isSelected && (
                          <svg className="size-4 text-forest shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                            <path d="m5 12 5 5L20 7" />
                          </svg>
                        )}
                      </button>
                    )
                  })}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}

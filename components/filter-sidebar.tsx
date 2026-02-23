"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { X, CalendarIcon, MapPin, Building2, Home, Hotel, Bed, Star, Wifi, Car, Coffee, Utensils, Waves, Dumbbell, PawPrint, Cigarette, Wind, Bath, Tv, Sparkles } from "lucide-react"
import { format, addDays } from "date-fns"
import type { DateRange } from "react-day-picker"
import { useI18n } from "@/lib/i18n/context"
import { formatJalali, toPersianDigits } from "@/lib/jalali"
import { formatPrice } from "@/lib/utils"

const travelStyles = ["Adventure", "Relaxing", "Budget", "Luxury", "Backpacking", "Nature", "Party", "Cultural", "Romantic", "Culinary"]

const tripLevels = ["Budget", "Mid-range", "Luxury"]

const suitableFor = ["Solo", "Couple", "Friends", "Family"]

const accommodationTypes = [
  { id: "hotel", label: "Hotel", icon: Hotel },
  { id: "airbnb", label: "Airbnb", icon: Home },
  { id: "hostel", label: "Hostel", icon: Bed },
  { id: "boutique", label: "Boutique", icon: Building2 },
]

const amenities = [
  { id: "wifi", label: "Wifi", icon: Wifi },
  { id: "parking", label: "Parking", icon: Car },
  { id: "breakfast", label: "Breakfast", icon: Coffee },
  { id: "restaurant", label: "Restaurant", icon: Utensils },
  { id: "pool", label: "Pool", icon: Waves },
  { id: "gym", label: "Gym", icon: Dumbbell },
  { id: "petFriendly", label: "Pet Friendly", icon: PawPrint },
  { id: "smokingAllowed", label: "Smoking Area", icon: Cigarette },
  { id: "airConditioning", label: "A/C", icon: Wind },
  { id: "bathtub", label: "Bathtub", icon: Bath },
  { id: "tv", label: "TV", icon: Tv },
]

interface FilterSidebarProps {
  onClose?: () => void
}

export function FilterSidebar({ onClose }: FilterSidebarProps) {
  const { t, locale } = useI18n()
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(),
    to: addDays(new Date(), 7),
  })
  const [duration, setDuration] = useState([1, 30])
  const isFa = locale === "fa"
  const budgetMax = isFa ? 50_000_000 : 10_000
  const budgetStep = isFa ? 500_000 : 100
  const accBudgetMax = isFa ? 15_000_000 : 500
  const accBudgetStep = isFa ? 200_000 : 10
  const [budget, setBudget] = useState([0, budgetMax])
  const [minRating, setMinRating] = useState(0)
  const [accommodationBudget, setAccommodationBudget] = useState([0, accBudgetMax])
  const [selectedAccommodationTypes, setSelectedAccommodationTypes] = useState<string[]>([])
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([])
  const [accommodationRating, setAccommodationRating] = useState(0)
  const [accommodationFilterMode, setAccommodationFilterMode] = useState<"budget" | "advanced">("budget")
  const [instantBook, setInstantBook] = useState(false)
  const [superhost, setSuperhost] = useState(false)
  const [selectedStyles, setSelectedStyles] = useState<string[]>([])
  const [selectedLevels, setSelectedLevels] = useState<string[]>([])
  const [selectedSuitableFor, setSelectedSuitableFor] = useState<string[]>([])

  const clearAllFilters = () => {
    setDuration([1, 30])
    setBudget([0, budgetMax])
    setMinRating(0)
    setAccommodationBudget([0, accBudgetMax])
    setSelectedAccommodationTypes([])
    setSelectedAmenities([])
    setAccommodationRating(0)
    setInstantBook(false)
    setSuperhost(false)
    setSelectedStyles([])
    setSelectedLevels([])
    setSelectedSuitableFor([])
  }

  const toggleAccommodationType = (id: string) => {
    setSelectedAccommodationTypes(prev => 
      prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]
    )
  }

  const toggleAmenity = (id: string) => {
    setSelectedAmenities(prev => 
      prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]
    )
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b p-4">
        <h2 className="font-serif text-lg font-semibold">{t("common.filters")}</h2>
        {onClose && (
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="size-4" />
          </Button>
        )}
      </div>

      <ScrollArea className="flex-1">
        <div className="space-y-6 p-4">
          {/* Destination - Pre-selected Paris */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <MapPin className="size-4 text-primary" />
              {t("filterSidebar.destination")}
            </Label>
            <div className="relative">
              <Input value={locale === "fa" ? "ایران" : "Paris, France"} readOnly className="bg-primary/5 border-primary/30 font-medium" />
              <div className="absolute end-3 top-1/2 -translate-y-1/2">
                <Sparkles className="size-4 text-primary" />
              </div>
            </div>
            <p className="text-xs text-muted-foreground">{t("filterSidebar.showingPlans")}</p>
          </div>

          <Separator />

          {/* Travel Dates - Airbnb Style */}
          <div className="space-y-3">
            <Label className="flex items-center gap-2">
              <CalendarIcon className="size-4 text-primary" />
              {t("filterSidebar.travelDates")}
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start text-start font-normal bg-transparent">
                  {dateRange?.from ? (
                    dateRange.to ? (
                      locale === "fa" ? (
                        <>{formatJalali(dateRange.from, "short")} - {formatJalali(dateRange.to, "long")}</>
                      ) : (
                        <>{format(dateRange.from, "MMM d")} - {format(dateRange.to, "MMM d, yyyy")}</>
                      )
                    ) : (
                      locale === "fa" ? formatJalali(dateRange.from, "long") : format(dateRange.from, "MMM d, yyyy")
                    )
                  ) : (
                    <span className="text-muted-foreground">{t("filterSidebar.selectDates")}</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={dateRange?.from}
                  selected={dateRange}
                  onSelect={setDateRange}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>
            {dateRange?.from && dateRange?.to && (
              <p className="text-xs text-muted-foreground">
                {locale === "fa"
                  ? `${toPersianDigits(Math.ceil((dateRange.to.getTime() - dateRange.from.getTime()) / (1000 * 60 * 60 * 24)))} ${t("filterSidebar.nights")}`
                  : `${Math.ceil((dateRange.to.getTime() - dateRange.from.getTime()) / (1000 * 60 * 60 * 24))} nights`
                }
              </p>
            )}
          </div>

          {/* Trip Duration */}
          <div className="space-y-3">
            
            
          </div>

          {/* Budget Range */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>{t("filterSidebar.totalBudget")}</Label>
              <span className="text-sm text-muted-foreground">
                {formatPrice(budget[0], locale)} - {formatPrice(budget[1], locale)}
              </span>
            </div>
            <Slider value={budget} onValueChange={setBudget} min={0} max={budgetMax} step={budgetStep} className="w-full" />
          </div>

          <Separator />

          {/* Accommodation Filters Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="flex items-center gap-2 text-base font-semibold">
                <Building2 className="size-4 text-primary" />
                {t("filterSidebar.accommodationFilters")}
              </Label>
            </div>
            
            <Tabs value={accommodationFilterMode} onValueChange={(v) => setAccommodationFilterMode(v as "budget" | "advanced")} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="budget">{t("filterSidebar.budgetOnly")}</TabsTrigger>
                <TabsTrigger value="advanced">{t("filterSidebar.advanced")}</TabsTrigger>
              </TabsList>
              
              <TabsContent value="budget" className="space-y-4 pt-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm">{t("filterSidebar.nightlyBudget")}</Label>
                    <span className="text-sm text-muted-foreground">
                      {formatPrice(accommodationBudget[0], locale)} - {formatPrice(accommodationBudget[1], locale)}/{isFa ? "شب" : "night"}
                    </span>
                  </div>
                  <Slider 
                    value={accommodationBudget} 
                    onValueChange={setAccommodationBudget} 
                    min={0} 
                    max={accBudgetMax} 
                    step={accBudgetStep} 
                    className="w-full" 
                  />
                </div>
              </TabsContent>
              
              <TabsContent value="advanced" className="space-y-5 pt-4">
                {/* Accommodation Types */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium">{t("filterSidebar.accommodationType")}</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {accommodationTypes.map((type) => (
                      <Button
                        key={type.id}
                        variant={selectedAccommodationTypes.includes(type.id) ? "default" : "outline"}
                        size="sm"
                        onClick={() => toggleAccommodationType(type.id)}
                        className={`justify-start gap-2 ${!selectedAccommodationTypes.includes(type.id) ? 'bg-transparent' : ''}`}
                      >
                        <type.icon className="size-4" />
                        {type.label}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Nightly Budget */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm">{t("filterSidebar.nightlyBudget")}</Label>
                    <span className="text-sm text-muted-foreground">
                      {formatPrice(accommodationBudget[0], locale)} - {formatPrice(accommodationBudget[1], locale)}/{isFa ? "شب" : "night"}
                    </span>
                  </div>
                  <Slider 
                    value={accommodationBudget} 
                    onValueChange={setAccommodationBudget} 
                    min={0} 
                    max={accBudgetMax} 
                    step={accBudgetStep} 
                    className="w-full" 
                  />
                </div>

                {/* Accommodation Rating */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium">{t("filterSidebar.minimumRating")}</Label>
                  <div className="flex gap-2">
                    {[0, 3, 4, 4.5].map((rating) => (
                      <Button
                        key={rating}
                        variant={accommodationRating === rating ? "default" : "outline"}
                        size="sm"
                        onClick={() => setAccommodationRating(rating)}
                        className={`flex-1 gap-1 ${accommodationRating !== rating ? 'bg-transparent' : ''}`}
                      >
                        {rating === 0 ? t("filterSidebar.any") : (
                          <>
                            <Star className="size-3 fill-current" />
                            {rating}+
                          </>
                        )}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Quick Toggles */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="instant-book" className="text-sm">{t("filterSidebar.instantBook")}</Label>
                    <Switch id="instant-book" checked={instantBook} onCheckedChange={setInstantBook} />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="superhost" className="text-sm">{t("filterSidebar.superhostOnly")}</Label>
                    <Switch id="superhost" checked={superhost} onCheckedChange={setSuperhost} />
                  </div>
                </div>

                {/* Amenities */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium">{t("filterSidebar.amenities")}</Label>
                  <div className="grid grid-cols-3 gap-2">
                    {amenities.map((amenity) => (
                      <Button
                        key={amenity.id}
                        variant={selectedAmenities.includes(amenity.id) ? "default" : "outline"}
                        size="sm"
                        onClick={() => toggleAmenity(amenity.id)}
                        className={`flex-col gap-1 h-auto py-2 text-xs ${!selectedAmenities.includes(amenity.id) ? 'bg-transparent' : ''}`}
                      >
                        <amenity.icon className="size-4" />
                        {amenity.label}
                      </Button>
                    ))}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          <Separator />

          {/* Travel Style */}
          <div className="space-y-3">
            <Label>{t("filterSidebar.travelStyle")}</Label>
            <div className="flex flex-wrap gap-2">
              {travelStyles.map((style) => (
                <div key={style} className="flex items-center space-x-2">
                  <Checkbox 
                    id={style}
                    checked={selectedStyles.includes(style)}
                    onCheckedChange={(checked) => {
                      setSelectedStyles(prev => checked ? [...prev, style] : prev.filter(s => s !== style))
                    }}
                  />
                  <label
                    htmlFor={style}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {style}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Trip Level */}
          <div className="space-y-3">
            <Label>{t("filterSidebar.tripLevel")}</Label>
            <div className="space-y-2">
              {tripLevels.map((level) => (
                <div key={level} className="flex items-center space-x-2">
                  <Checkbox 
                    id={level} 
                    checked={selectedLevels.includes(level)}
                    onCheckedChange={(checked) => {
                      setSelectedLevels(prev => checked ? [...prev, level] : prev.filter(l => l !== level))
                    }}
                  />
                  <label
                    htmlFor={level}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {level}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Suitable For */}
          <div className="space-y-3">
            <Label>{t("filterSidebar.suitableFor")}</Label>
            <div className="space-y-2">
              {suitableFor.map((option) => (
                <div key={option} className="flex items-center space-x-2">
                  <Checkbox 
                    id={option}
                    checked={selectedSuitableFor.includes(option)}
                    onCheckedChange={(checked) => {
                      setSelectedSuitableFor(prev => checked ? [...prev, option] : prev.filter(o => o !== option))
                    }}
                  />
                  <label
                    htmlFor={option}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {option}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Minimum Rating */}
          <div className="space-y-3">
            <Label>{t("filterSidebar.minimumPlanRating")}</Label>
            <div className="flex gap-2">
              {[0, 3, 4, 4.5].map((rating) => (
                <Button
                  key={rating}
                  variant={minRating === rating ? "default" : "outline"}
                  size="sm"
                  onClick={() => setMinRating(rating)}
                  className={`flex-1 ${minRating !== rating ? 'bg-transparent' : ''}`}
                >
                  {rating === 0 ? t("filterSidebar.any") : `${rating}+`}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </ScrollArea>

      <div className="border-t p-4 space-y-2">
        <Button variant="outline" className="w-full bg-transparent" onClick={clearAllFilters}>{t("filterSidebar.clearAll")}</Button>
        <Button className="w-full" onClick={() => onClose?.()}>{t("filterSidebar.applyFilters")}</Button>
      </div>
    </div>
  )
}

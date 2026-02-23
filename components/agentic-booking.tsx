"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Plane, Hotel, Car, UtensilsCrossed, Ticket, MapPin,
  Sparkles, Send, Loader2, Check, ChevronDown, ChevronRight,
  Calendar, DollarSign, Star, ExternalLink, ArrowRight,
  CreditCard, Shield, Clock, Users, Briefcase, X
} from "lucide-react"
import { cn, formatPrice } from "@/lib/utils"
import { useI18n } from "@/lib/i18n/context"

/* ─── Types ─── */
interface BookingOption {
  id: string
  provider: string
  name: string
  price: number
  rating: number
  details: string
  image?: string
  url?: string
  tags?: string[]
}

interface BookingStep {
  id: string
  type: "flight" | "hotel" | "car" | "restaurant" | "activity"
  status: "pending" | "searching" | "found" | "selected" | "booked"
  title: string
  options: BookingOption[]
  selectedOption?: BookingOption
}

interface AgentMessage {
  id: string
  role: "agent" | "user"
  content: string
  timestamp: Date
  bookingSteps?: BookingStep[]
}

const typeIcons: Record<string, React.ReactNode> = {
  flight: <Plane className="size-4" />,
  hotel: <Hotel className="size-4" />,
  car: <Car className="size-4" />,
  restaurant: <UtensilsCrossed className="size-4" />,
  activity: <Ticket className="size-4" />,
}

const typeLabels: Record<string, string> = {
  flight: "Flights",
  hotel: "Hotels",
  car: "Car Rental",
  restaurant: "Restaurants",
  activity: "Activities",
}

/* ─── Demo Data Generator ─── */
function generateDemoSteps(destination: string): BookingStep[] {
  return [
    {
      id: "flight", type: "flight", status: "found",
      title: `Flights to ${destination}`,
      options: [
        { id: "f1", provider: "SkyScanner", name: `Direct to ${destination}`, price: 489, rating: 4.5, details: "Non-stop • 8h 30m • Economy", tags: ["Best Price"] },
        { id: "f2", provider: "Google Flights", name: `Via Istanbul to ${destination}`, price: 425, rating: 4.2, details: "1 stop • 12h 15m • Economy", tags: ["Cheapest"] },
        { id: "f3", provider: "Kayak", name: `Premium to ${destination}`, price: 1120, rating: 4.8, details: "Non-stop • 8h 30m • Business", tags: ["Premium"] },
      ],
    },
    {
      id: "hotel", type: "hotel", status: "found",
      title: `Hotels in ${destination}`,
      options: [
        { id: "h1", provider: "Booking.com", name: "Le Marais Boutique Hotel", price: 185, rating: 4.7, details: "4-star • Central • Free cancellation", tags: ["Popular"] },
        { id: "h2", provider: "Hotels.com", name: "The Artisan Quarter", price: 142, rating: 4.4, details: "3-star • Near metro • Breakfast included", tags: ["Value"] },
        { id: "h3", provider: "Airbnb", name: "Charming Studio with View", price: 98, rating: 4.9, details: "Entire home • Self check-in • Wifi", tags: ["Top Rated"] },
      ],
    },
    {
      id: "car", type: "car", status: "found",
      title: "Car Rental (Optional)",
      options: [
        { id: "c1", provider: "Europcar", name: "Compact – Peugeot 208", price: 35, rating: 4.3, details: "Per day • Automatic • Unlimited km" },
        { id: "c2", provider: "Sixt", name: "SUV – Renault Captur", price: 58, rating: 4.5, details: "Per day • Automatic • GPS included" },
      ],
    },
  ]
}

/* ─── BookingOptionCard ─── */
function BookingOptionCard({
  option,
  isSelected,
  onSelect,
}: {
  option: BookingOption
  isSelected: boolean
  onSelect: () => void
}) {
  const { locale } = useI18n()
  return (
    <button
      onClick={onSelect}
      className={cn(
        "w-full text-start rounded-xl border p-3 transition-all",
        isSelected
          ? "border-forest bg-forest/5 ring-1 ring-forest/20"
          : "hover:border-forest/30 hover:bg-secondary/30"
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <span className="text-sm font-semibold">{option.name}</span>
            {isSelected && <Check className="size-3.5 text-forest shrink-0" />}
          </div>
          <p className="text-[11px] text-muted-foreground">{option.details}</p>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-[10px] text-muted-foreground">{option.provider}</span>
            <span className="flex items-center gap-0.5 text-[10px]">
              <Star className="size-2.5 fill-amber-400 text-amber-400" />{option.rating}
            </span>
            {option.tags?.map(t => (
              <Badge key={t} variant="secondary" className="text-[9px] px-1.5 py-0">{t}</Badge>
            ))}
          </div>
        </div>
        <div className="text-end shrink-0">
          <span className="text-base font-bold text-forest">{formatPrice(option.price, locale)}</span>
          {option.url && (
            <span className="flex items-center gap-0.5 text-[10px] text-muted-foreground mt-0.5">
              View <ExternalLink className="size-2.5" />
            </span>
          )}
        </div>
      </div>
    </button>
  )
}

/* ─── BookingStepPanel ─── */
function BookingStepPanel({
  step,
  onSelectOption,
}: {
  step: BookingStep
  onSelectOption: (stepId: string, option: BookingOption) => void
}) {
  const [isExpanded, setIsExpanded] = useState(step.status === "found")
  const { locale } = useI18n()

  return (
    <div className="rounded-xl border bg-card overflow-hidden">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center gap-3 p-3 hover:bg-secondary/30 transition-colors text-start"
      >
        <div className={cn(
          "size-8 rounded-lg flex items-center justify-center shrink-0",
          step.selectedOption ? "bg-forest text-white" :
          step.status === "searching" ? "bg-amber-100 text-amber-600" :
          "bg-secondary text-muted-foreground"
        )}>
          {step.status === "searching" ? <Loader2 className="size-4 animate-spin" /> :
           step.selectedOption ? <Check className="size-4" /> :
           typeIcons[step.type]}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">{step.title}</span>
            {step.selectedOption && (
              <Badge variant="secondary" className="text-[10px]">{formatPrice(step.selectedOption.price, locale)}</Badge>
            )}
          </div>
          {step.selectedOption ? (
            <p className="text-[11px] text-muted-foreground truncate">{step.selectedOption.name} via {step.selectedOption.provider}</p>
          ) : step.status === "searching" ? (
            <p className="text-[11px] text-amber-600">Searching best options...</p>
          ) : (
            <p className="text-[11px] text-muted-foreground">{step.options.length} options found</p>
          )}
        </div>
        <ChevronDown className={cn("size-4 text-muted-foreground transition-transform", isExpanded && "rotate-180")} />
      </button>

      <AnimatePresence>
        {isExpanded && step.options.length > 0 && (
          <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} className="overflow-hidden">
            <div className="px-3 pb-3 space-y-2">
              {step.options.map(opt => (
                <BookingOptionCard
                  key={opt.id}
                  option={opt}
                  isSelected={step.selectedOption?.id === opt.id}
                  onSelect={() => onSelectOption(step.id, opt)}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/* ─── Main Component ─── */
export function AgenticBooking({
  destination = "Paris",
  isOpen,
  onClose,
}: {
  destination?: string
  isOpen: boolean
  onClose: () => void
}) {
  const [messages, setMessages] = useState<AgentMessage[]>([])
  const [bookingSteps, setBookingSteps] = useState<BookingStep[]>([])
  const [input, setInput] = useState("")
  const [isAgentThinking, setIsAgentThinking] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const { locale } = useI18n()

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      // Initial agent message
      setIsAgentThinking(true)
      const timer = setTimeout(() => {
        const steps = generateDemoSteps(destination)
        setBookingSteps(steps)
        setMessages([{
          id: "1",
          role: "agent",
          content: `I've found the best options for your trip to ${destination}! Here's what I've gathered from multiple providers. Select your preferences and I'll handle the rest.`,
          timestamp: new Date(),
          bookingSteps: steps,
        }])
        setIsAgentThinking(false)
      }, 1500)
      return () => clearTimeout(timer)
    }
  }, [isOpen, destination, messages.length])

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" })
  }, [messages, isAgentThinking])

  const handleSelectOption = (stepId: string, option: BookingOption) => {
    setBookingSteps(prev => prev.map(s =>
      s.id === stepId ? { ...s, selectedOption: option, status: "selected" } : s
    ))
  }

  const handleSend = () => {
    if (!input.trim()) return
    const userMsg: AgentMessage = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    }
    setMessages(prev => [...prev, userMsg])
    setInput("")
    setIsAgentThinking(true)

    // Simulate agent response
    setTimeout(() => {
      const agentMsg: AgentMessage = {
        id: (Date.now() + 1).toString(),
        role: "agent",
        content: "I've updated the options based on your preferences. Let me know if you'd like me to adjust anything else or proceed with booking!",
        timestamp: new Date(),
      }
      setMessages(prev => [...prev, agentMsg])
      setIsAgentThinking(false)
    }, 2000)
  }

  const selectedTotal = bookingSteps
    .filter(s => s.selectedOption)
    .reduce((sum, s) => sum + (s.selectedOption?.price || 0), 0)

  const allSelected = bookingSteps.filter(s => s.type !== "car").every(s => s.selectedOption)

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-end sm:items-center justify-center">
      <motion.div
        initial={{ y: "100%", opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: "100%", opacity: 0 }}
        className="w-full sm:max-w-lg bg-card rounded-t-2xl sm:rounded-2xl shadow-2xl flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-2">
            <div className="size-8 rounded-lg bg-forest text-white flex items-center justify-center">
              <Briefcase className="size-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold">Agentic Booking</h3>
              <p className="text-[11px] text-muted-foreground">AI finds, compares & books for you</p>
            </div>
          </div>
          <button onClick={onClose} className="size-8 rounded-lg hover:bg-secondary flex items-center justify-center">
            <X className="size-4" />
          </button>
        </div>

        {/* Chat + Steps Area */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map(msg => (
            <div key={msg.id} className={cn("flex gap-2", msg.role === "user" && "justify-end")}>
              {msg.role === "agent" && (
                <div className="size-7 rounded-full bg-forest/10 flex items-center justify-center shrink-0 mt-0.5">
                  <Sparkles className="size-3.5 text-forest" />
                </div>
              )}
              <div className={cn(
                "max-w-[85%] rounded-xl px-3.5 py-2.5",
                msg.role === "agent" ? "bg-secondary/60" : "bg-forest text-white"
              )}>
                <p className="text-sm">{msg.content}</p>
              </div>
            </div>
          ))}

          {/* Booking Steps */}
          {bookingSteps.length > 0 && (
            <div className="space-y-2">
              {bookingSteps.map(step => (
                <BookingStepPanel key={step.id} step={step} onSelectOption={handleSelectOption} />
              ))}
            </div>
          )}

          {/* Agent Thinking */}
          {isAgentThinking && (
            <div className="flex gap-2">
              <div className="size-7 rounded-full bg-forest/10 flex items-center justify-center shrink-0">
                <Sparkles className="size-3.5 text-forest" />
              </div>
              <div className="bg-secondary/60 rounded-xl px-3.5 py-2.5">
                <div className="flex gap-1.5">
                  <span className="size-2 rounded-full bg-forest/40 animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="size-2 rounded-full bg-forest/40 animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="size-2 rounded-full bg-forest/40 animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Summary Bar */}
        {selectedTotal > 0 && (
          <div className="px-4 py-2 border-t bg-forest/5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">
                  {bookingSteps.filter(s => s.selectedOption).length}/{bookingSteps.length} selected
                </p>
                <p className="text-sm font-bold text-forest">{locale === "fa" ? "جمع کل" : "Total"}: {formatPrice(selectedTotal, locale)}</p>
              </div>
              {allSelected && (
                <Button size="sm" className="bg-forest hover:bg-forest/90 rounded-lg">
                  <CreditCard className="size-3.5 me-1.5" />
                  Book All
                </Button>
              )}
            </div>
          </div>
        )}

        {/* Input */}
        <div className="p-3 border-t">
          <div className="flex gap-2">
            <Input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleSend()}
              placeholder="Adjust preferences, ask about options..."
              className="text-sm"
            />
            <Button
              size="icon"
              onClick={handleSend}
              disabled={!input.trim() || isAgentThinking}
              className="bg-forest hover:bg-forest/90 shrink-0"
            >
              <Send className="size-4" />
            </Button>
          </div>
          <div className="flex items-center justify-center gap-3 mt-2 text-[10px] text-muted-foreground">
            <span className="flex items-center gap-0.5"><Shield className="size-2.5" /> Secure</span>
            <span className="flex items-center gap-0.5"><Clock className="size-2.5" /> Real-time prices</span>
            <span className="flex items-center gap-0.5"><DollarSign className="size-2.5" /> Best price guaranteed</span>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

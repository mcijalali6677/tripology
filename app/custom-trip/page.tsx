"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import Image from "next/image"
import Link from "next/link"
import { useI18n } from "@/lib/i18n/context"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { motion, AnimatePresence } from "framer-motion"
import {
  MapPin, Calendar, Check, Plus, X, ShoppingBag,
  Landmark, Camera, Music, Utensils, Coffee, Bike,
  Train, Car, Footprints, Bus, Ship, Theater,
  Palette, Trees, ShoppingCart, Wine, ChefHat,
  Sparkles, Star, Clock, Users, Heart, Filter,
  ChevronDown, ChevronUp, Search, Trash2, ArrowLeft,
  SlidersHorizontal, Euro, Tag, ExternalLink, Wallet,
  UserCircle, CalendarDays, Hotel, Home, Building2, HelpCircle,
  CheckCircle, CalendarCheck, Navigation2,
  Bot, Send, Loader2, Globe, Package, Share2, User,
  Minus, DollarSign, BadgeCheck, BadgeAlert,
  Compass, Dumbbell, PartyPopper, Gem
} from "lucide-react"
import type { LucideIcon } from "lucide-react"
import { parisData } from "@/lib/paris-data"
import { cn } from "@/lib/utils"

// Icon map
const iconMap: Record<string, LucideIcon> = {
  Camera, Music, Utensils, Coffee, Train, Heart,
  ShoppingBag, Wine, Dumbbell, Compass,
}

const parisDataWithIcons = {
  ...parisData,
  categories: Object.fromEntries(
    Object.entries(parisData.categories).map(([key, cat]) => [
      key,
      { ...cat, icon: iconMap[cat.icon] || Camera },
    ])
  ) as Record<CategoryKey, Omit<typeof parisData.categories[CategoryKey], "icon"> & { icon: LucideIcon }>,
}

type CategoryKey = keyof typeof parisData.categories
type Item = {
  id: string
  title: string
  description: string
  image: string
  duration: string
  cost: number
  rating: number
  reviews: number
  popular?: boolean
  cuisine?: string
  date?: string
  dayNum?: number
  tags?: string[]
  officialSite?: string
  category?: string
}

// AI Basket Item
interface AIBasketItem {
  id: string
  type: string
  title: string
  description: string
  location: string
  duration: string
  cost: string
  image_hint: string
  purchase_url: string
  purchase_methods: string
  price_source: string
}

function parseBasketItems(text: string): AIBasketItem[] {
  const items: AIBasketItem[] = []
  const pattern = /\[BASKET_ITEM\]([\s\S]*?)\[\/BASKET_ITEM\]/g
  let match
  while ((match = pattern.exec(text)) !== null) {
    const block = match[1]
    const item: Record<string, string> = {}
    for (const line of block.split("\n")) {
      const kv = line.match(/^\s*(\w[\w_]*):\s*(.+)$/)
      if (kv) item[kv[1].trim()] = kv[2].trim()
    }
    if (item.title) {
      items.push({
        id: "ai-basket-" + Date.now() + "-" + items.length,
        type: item.type || "activity",
        title: item.title,
        description: item.description || "",
        location: item.location || "",
        duration: item.duration || "",
        cost: item.cost || "",
        image_hint: item.image_hint || item.title,
        purchase_url: item.purchase_url || "",
        purchase_methods: item.purchase_methods || "",
        price_source: item.price_source || "",
      })
    }
  }
  return items
}

function formatMarkdown(text: string): string {
  if (!text) return ""
  const cleaned = text
    .replace(/```basket[\s\S]*?```/g, "")
    .replace(/\[BASKET_ITEM\][\s\S]*?\[\/BASKET_ITEM\]/g, "")
  return cleaned
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/^### (.+)$/gm, "<h4 class='font-semibold mt-2 mb-1'>$1</h4>")
    .replace(/^## (.+)$/gm, "<h3 class='font-semibold text-base mt-3 mb-1'>$1</h3>")
    .replace(/^# (.+)$/gm, "<h3 class='font-bold text-base mt-3 mb-1'>$1</h3>")
    .replace(/^[-\u2022] (.+)$/gm, "<li class='ms-4 list-disc'>$1</li>")
    .replace(/^(\d+)\. (.+)$/gm, "<li class='ms-4 list-decimal'>$1. $2</li>")
    .replace(/\n/g, "<br/>")
}

function getItemIcon(type: string) {
  switch (type.toLowerCase()) {
    case "hotel": return <Hotel className="size-4" />
    case "restaurant": return <Utensils className="size-4" />
    case "transport": return <Train className="size-4" />
    case "experience": return <Camera className="size-4" />
    default: return <MapPin className="size-4" />
  }
}

function getItemColor(type: string) {
  switch (type.toLowerCase()) {
    case "hotel": return "border-purple-200 bg-purple-50"
    case "restaurant": return "border-orange-200 bg-orange-50"
    case "transport": return "border-blue-200 bg-blue-50"
    case "experience": return "border-amber-200 bg-amber-50"
    default: return "border-emerald-200 bg-emerald-50"
  }
}

// Message type
interface ChatMessage {
  id: string
  role: "user" | "assistant"
  content: string
  isStreaming?: boolean
  basketItems?: AIBasketItem[]
}

// MAIN PAGE COMPONENT
export default function CustomTripPage() {
  const { t, locale } = useI18n()

  const categoryLabelMap: Record<CategoryKey, string> = {
    activities: t("customTrip.categories.activities"),
    liveEvents: t("customTrip.categories.liveEvents"),
    restaurants: t("customTrip.categories.restaurants"),
    cafes: t("customTrip.categories.cafes"),
    transport: t("customTrip.categories.transport"),
    experiences: t("customTrip.categories.experiences"),
    shopping: t("customTrip.categories.shopping"),
    nightlife: t("customTrip.categories.nightlife"),
    wellness: t("customTrip.categories.wellness"),
    tours: t("customTrip.categories.tours"),
  }

  // Trip Settings State
  const [destination, setDestination] = useState("Paris")
  const [startDate, setStartDate] = useState("2026-03-15")
  const [endDate, setEndDate] = useState("2026-03-25")
  const [travelers, setTravelers] = useState(2)
  const [budget, setBudget] = useState<"budget" | "mid" | "luxury">("mid")
  const [accommodationStatus, setAccommodationStatus] = useState<"booked" | "planning" | "undecided">("undecided")

  // UI State
  const [aiExpanded, setAiExpanded] = useState(true)
  const [browseExpanded, setBrowseExpanded] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [showBasketSidebar, setShowBasketSidebar] = useState(false)

  // AI Chat State
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [chatInput, setChatInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [aiBasket, setAiBasket] = useState<AIBasketItem[]>([])
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const abortControllerRef = useRef<AbortController | null>(null)

  // Manual Browse State
  const [selectedCategory, setSelectedCategory] = useState<CategoryKey>("activities")
  const [manualBasket, setManualBasket] = useState<Item[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [showFilters, setShowFilters] = useState(false)
  const [priceFilter, setPriceFilter] = useState<"all" | "free" | "budget" | "mid" | "high">("all")
  const [popularOnly, setPopularOnly] = useState(false)

  // Persist session & baskets
  useEffect(() => {
    try {
      const saved = localStorage.getItem("tripology_planner_session")
      if (saved) setSessionId(saved)
      const savedAi = localStorage.getItem("tripology_ai_basket")
      if (savedAi) setAiBasket(JSON.parse(savedAi))
      const savedManual = localStorage.getItem("tripology_manual_basket")
      if (savedManual) setManualBasket(JSON.parse(savedManual))
    } catch { /* SSR or storage unavailable */ }
  }, [])

  useEffect(() => {
    if (sessionId) {
      try { localStorage.setItem("tripology_planner_session", sessionId) } catch {}
    }
  }, [sessionId])

  useEffect(() => {
    try { localStorage.setItem("tripology_ai_basket", JSON.stringify(aiBasket)) } catch {}
  }, [aiBasket])

  useEffect(() => {
    try { localStorage.setItem("tripology_manual_basket", JSON.stringify(manualBasket)) } catch {}
  }, [manualBasket])

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [])
  useEffect(() => { scrollToBottom() }, [messages, scrollToBottom])

  // Trip duration
  const start = new Date(startDate)
  const end = new Date(endDate)
  const tripDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
  }

  // AI Basket helpers
  const addToAiBasket = (item: AIBasketItem) => {
    if (!aiBasket.find(b => b.title === item.title)) {
      setAiBasket(prev => [...prev, item])
    }
  }
  const removeFromAiBasket = (itemId: string) => {
    setAiBasket(prev => prev.filter(b => b.id !== itemId))
  }
  const isInAiBasket = (title: string) => aiBasket.some(b => b.title === title)
  const totalBasketCount = aiBasket.length + manualBasket.length

  // Manual basket helpers
  const isInManualBasket = (id: string) => manualBasket.some(item => item.id === id)
  const toggleManualBasket = (item: Item) => {
    if (isInManualBasket(item.id)) {
      setManualBasket(manualBasket.filter(i => i.id !== item.id))
    } else {
      setManualBasket([...manualBasket, { ...item, category: selectedCategory }])
    }
  }
  const manualTotalCost = manualBasket.reduce((sum, item) => sum + item.cost, 0)

  // AI Chat send
  const sendMessage = async (content?: string) => {
    const messageContent = content || chatInput.trim()
    if (!messageContent || isLoading) return
    setChatInput("")
    setIsLoading(true)

    const userMessage: ChatMessage = {
      id: "user-" + Date.now(),
      role: "user",
      content: messageContent,
    }
    const assistantMessage: ChatMessage = {
      id: "assistant-" + Date.now(),
      role: "assistant",
      content: "",
      isStreaming: true,
    }
    setMessages(prev => [...prev, userMessage, assistantMessage])

    try {
      abortControllerRef.current = new AbortController()
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: messageContent,
          sessionId,
          locale,
        }),
        signal: abortControllerRef.current.signal,
      })

      if (!response.ok) {
        const errData = await response.json().catch(() => null)
        throw new Error(errData?.content || errData?.error || "Failed to send message")
      }

      const contentType = response.headers.get("content-type") || ""

      // Handle JSON response (fallback)
      if (contentType.includes("application/json")) {
        const data = await response.json()
        const respContent = data.content || t("chatPlanner.fallbackHelp")
        const basketItems = parseBasketItems(respContent)
        setMessages(prev =>
          prev.map(msg =>
            msg.id === assistantMessage.id
              ? { ...msg, content: respContent, isStreaming: false, basketItems }
              : msg
          )
        )
        return
      }

      // Handle SSE stream
      const reader = response.body?.getReader()
      const decoder = new TextDecoder()
      let fullContent = ""
      let buffer = ""
      let currentSessionId = sessionId

      const headerSessionId = response.headers.get("x-session-id")
      if (headerSessionId && !currentSessionId) {
        currentSessionId = headerSessionId
        setSessionId(headerSessionId)
      }

      if (reader) {
        while (true) {
          const { done, value } = await reader.read()
          if (done) break
          buffer += decoder.decode(value, { stream: true })
          const lines = buffer.split("\n")
          buffer = lines.pop() || ""

          for (const line of lines) {
            if (line.startsWith("data: ")) {
              const jsonStr = line.slice(6).trim()
              if (!jsonStr) continue
              try {
                const data = JSON.parse(jsonStr)
                if (data.sessionId && !currentSessionId) {
                  currentSessionId = data.sessionId
                  setSessionId(data.sessionId)
                }
                if (data.token) {
                  fullContent += data.token
                  setMessages(prev =>
                    prev.map(msg =>
                      msg.id === assistantMessage.id
                        ? { ...msg, content: fullContent }
                        : msg
                    )
                  )
                }
                if (data.done) {
                  const basketItems = parseBasketItems(fullContent)
                  setMessages(prev =>
                    prev.map(msg =>
                      msg.id === assistantMessage.id
                        ? { ...msg, content: fullContent || data.content || "", isStreaming: false, basketItems }
                        : msg
                    )
                  )
                }
                if (data.error) throw new Error(data.error)
              } catch (e) {
                if (jsonStr && !(e instanceof SyntaxError)) throw e
              }
            }
          }
        }
      }

      // Finalize
      const basketItems = parseBasketItems(fullContent)
      setMessages(prev =>
        prev.map(msg =>
          msg.id === assistantMessage.id && msg.isStreaming
            ? { ...msg, content: fullContent || "", isStreaming: false, basketItems: basketItems.length > 0 ? basketItems : undefined }
            : msg
        )
      )
    } catch {
      setMessages(prev =>
        prev.map(msg =>
          msg.id === assistantMessage.id
            ? { ...msg, content: t("chatPlanner.fallbackError"), isStreaming: false }
            : msg
        )
      )
    } finally {
      setIsLoading(false)
    }
  }

  const resetChat = () => {
    if (abortControllerRef.current) abortControllerRef.current.abort()
    setMessages([])
    setSessionId(null)
    setChatInput("")
    try { localStorage.removeItem("tripology_planner_session") } catch {}
  }

  // Filtered items for manual browse
  const currentCategory = parisDataWithIcons.categories[selectedCategory]
  const categories = Object.entries(parisDataWithIcons.categories) as [CategoryKey, typeof parisDataWithIcons.categories[CategoryKey]][]
  const filteredItems = (currentCategory.items as Item[]).filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesPopular = !popularOnly || item.popular
    let matchesPrice = true
    if (priceFilter === "free") matchesPrice = item.cost === 0
    else if (priceFilter === "budget") matchesPrice = item.cost > 0 && item.cost <= 20
    else if (priceFilter === "mid") matchesPrice = item.cost > 20 && item.cost <= 50
    else if (priceFilter === "high") matchesPrice = item.cost > 50
    return matchesSearch && matchesPopular && matchesPrice
  })

  // Suggestion chips
  const aiSuggestions = [
    t("customTrip.aiChip1") || "Cheap " + destination + " trip for 3 days",
    t("customTrip.aiChip2") || "Best museums & culture",
    t("customTrip.aiChip3") || "Romantic weekend plan",
    t("customTrip.aiChip4") || "Family-friendly activities",
  ]

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <Link href="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-3">
            <ArrowLeft className="size-4" />
            <span className="text-sm">{t("customTrip.backToPlans")}</span>
          </Link>
          <h1 className="text-2xl sm:text-3xl font-bold">
            {destination} {t("customTrip.trip")}
          </h1>
        </div>
      </div>

      <div className="container mx-auto px-4 py-4 space-y-4">

        {/* SECTION 1: AI Plans It For Me */}
        <div className="rounded-xl border bg-card overflow-hidden">
          <button
            className="w-full flex items-center justify-between p-4 hover:bg-secondary/30 transition-colors"
            onClick={() => { setAiExpanded(!aiExpanded); if (!aiExpanded) setBrowseExpanded(false) }}
          >
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-xl bg-forest/10 flex items-center justify-center">
                <Sparkles className="size-5 text-forest" />
              </div>
              <div className="text-start">
                <h2 className="font-semibold text-sm sm:text-base">
                  {t("customTrip.aiPlansTitle") || "AI Plans It For Me"}
                </h2>
                <p className="text-xs text-muted-foreground">
                  {t("customTrip.aiPlansDesc") || "Tell me what you want and AI picks the best activities for your basket"}
                </p>
              </div>
            </div>
            <ChevronDown className={cn("size-5 text-muted-foreground transition-transform", aiExpanded && "rotate-180")} />
          </button>

          <AnimatePresence>
            {aiExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="px-4 pb-4 space-y-4">
                  {messages.length === 0 ? (
                    <div className="space-y-4">
                      <div className="flex gap-3">
                        <div className="size-8 rounded-full bg-forest/10 flex items-center justify-center shrink-0">
                          <Sparkles className="size-4 text-forest" />
                        </div>
                        <div className="border rounded-2xl rounded-tl-sm px-4 py-3 bg-secondary/30 text-sm">
                          {t("customTrip.aiGreeting") || "Tell me what kind of trip you want and I will pick the best activities for your basket!"}
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2 ms-11">
                        {aiSuggestions.map((suggestion, i) => (
                          <button
                            key={i}
                            onClick={() => sendMessage(suggestion)}
                            className="rounded-full border border-forest/20 bg-forest/5 px-3.5 py-2 text-xs text-forest hover:bg-forest/10 transition-colors"
                          >
                            {suggestion}
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4 max-h-[400px] overflow-y-auto">
                      {messages.map(message => (
                        <div key={message.id}>
                          <div className={cn("flex gap-3", message.role === "user" ? "flex-row-reverse" : "flex-row")}>
                            <div className={cn(
                              "size-8 rounded-full flex items-center justify-center shrink-0",
                              message.role === "user" ? "bg-forest text-white" : "bg-forest/10"
                            )}>
                              {message.role === "user" ? <User className="size-4" /> : <Bot className="size-4 text-forest" />}
                            </div>
                            <div className={cn(
                              "rounded-2xl px-4 py-3 max-w-[85%] text-sm leading-relaxed",
                              message.role === "user"
                                ? "bg-forest text-white rounded-tr-sm"
                                : "bg-secondary/50 text-foreground rounded-tl-sm"
                            )}>
                              <div
                                className="prose prose-sm max-w-none [&_strong]:font-semibold [&_li]:my-0.5"
                                dangerouslySetInnerHTML={{ __html: formatMarkdown(message.content) }}
                              />
                              {message.isStreaming && (
                                <span className="inline-block w-1.5 h-4 bg-forest/50 animate-pulse ms-0.5 rounded-sm" />
                              )}
                            </div>
                          </div>
                          {message.basketItems && message.basketItems.length > 0 && !message.isStreaming && (
                            <div className="mt-3 ms-11 space-y-2">
                              <div className="flex items-center gap-2 text-xs font-semibold text-forest">
                                <ShoppingCart className="size-3.5" />
                                <span>{t("chatPlanner.recommendedItems") || "Travel Recommendations"}</span>
                              </div>
                              <div className="space-y-2">
                                {message.basketItems.map(item => (
                                  <div
                                    key={item.id}
                                    className={cn("rounded-xl border p-3 transition-all hover:shadow-md", getItemColor(item.type))}
                                  >
                                    <div className="flex items-start justify-between gap-2">
                                      <div className="flex items-start gap-2 min-w-0 flex-1">
                                        <div className="mt-0.5">{getItemIcon(item.type)}</div>
                                        <div className="min-w-0">
                                          <div className="font-medium text-xs">{item.title}</div>
                                          <div className="text-[11px] text-muted-foreground mt-0.5">{item.description}</div>
                                          <div className="flex items-center gap-3 mt-1.5 text-[10px] text-muted-foreground">
                                            {item.location && (
                                              <span className="flex items-center gap-0.5">
                                                <MapPin className="size-2.5" /> {item.location}
                                              </span>
                                            )}
                                            {item.duration && (
                                              <span className="flex items-center gap-0.5">
                                                <Clock className="size-2.5" /> {item.duration}
                                              </span>
                                            )}
                                          </div>
                                          {item.cost && (
                                            <div className="flex items-center gap-1.5 mt-1.5">
                                              <span className="flex items-center gap-0.5 text-[11px] font-semibold text-forest">
                                                <DollarSign className="size-2.5" /> {item.cost}
                                              </span>
                                              {item.price_source && (
                                                <span className={cn(
                                                  "text-[9px] px-1.5 py-0.5 rounded-full flex items-center gap-0.5",
                                                  item.cost.includes("\u26A1") ? "bg-emerald-100 text-emerald-700"
                                                    : "bg-amber-100 text-amber-700"
                                                )}>
                                                  {item.cost.includes("\u26A1") ? <BadgeCheck className="size-2.5" /> : <BadgeAlert className="size-2.5" />}
                                                  {item.price_source}
                                                </span>
                                              )}
                                            </div>
                                          )}
                                          {item.purchase_methods && (
                                            <div className="text-[10px] text-muted-foreground mt-1">
                                              {item.purchase_methods}
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                      <div className="flex flex-col gap-1 shrink-0">
                                        <Button
                                          size="sm"
                                          variant={isInAiBasket(item.title) ? "outline" : "default"}
                                          className={cn(
                                            "h-7 text-[10px]",
                                            isInAiBasket(item.title) ? "border-green-300 bg-green-50 text-green-700" : "bg-forest hover:bg-forest/90"
                                          )}
                                          onClick={() => isInAiBasket(item.title) ? removeFromAiBasket(item.id) : addToAiBasket(item)}
                                        >
                                          {isInAiBasket(item.title) ? (
                                            <><Minus className="size-3 me-1" /> {t("chatPlanner.added") || "Added"}</>
                                          ) : (
                                            <><Plus className="size-3 me-1" /> {t("chatPlanner.addToBasket") || "Add"}</>
                                          )}
                                        </Button>
                                        {item.purchase_url && item.purchase_url.startsWith("http") && (
                                          <a
                                            href={item.purchase_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center justify-center gap-1 h-6 text-[9px] font-medium rounded-md border border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors px-2"
                                          >
                                            <ExternalLink className="size-2.5" />
                                            {t("chatPlanner.buyOnline") || "Buy Online"}
                                          </a>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                      <div ref={messagesEndRef} />
                    </div>
                  )}

                  <div className="flex items-end gap-2">
                    <div className="flex-1 relative">
                      <textarea
                        value={chatInput}
                        onChange={(e) => {
                          setChatInput(e.target.value)
                          e.target.style.height = "auto"
                          e.target.style.height = Math.min(e.target.scrollHeight, 100) + "px"
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault()
                            sendMessage()
                          }
                        }}
                        placeholder={t("customTrip.aiInputPlaceholder") || "Tell me about your trip..."}
                        className="w-full resize-none rounded-xl border bg-secondary/30 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-forest/30 min-h-[44px] max-h-[100px]"
                        rows={1}
                      />
                    </div>
                    <Button
                      onClick={() => sendMessage()}
                      disabled={!chatInput.trim() || isLoading}
                      className="rounded-xl bg-forest hover:bg-forest/90 size-11 shrink-0"
                    >
                      {isLoading ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
                    </Button>
                  </div>

                  <div className="flex items-start gap-2 text-[11px] text-muted-foreground bg-secondary/30 rounded-lg px-3 py-2">
                    <Package className="size-4 shrink-0 mt-0.5" />
                    <span>{t("customTrip.aiNote") || "AI adds activities to your basket automatically. Review and proceed from there."}</span>
                  </div>

                  {messages.length > 0 && (
                    <button onClick={resetChat} className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1 mx-auto">
                      <Trash2 className="size-3" /> {t("customTrip.resetChat") || "Reset conversation"}
                    </button>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* OR Divider */}
        <div className="flex items-center gap-4 px-4">
          <div className="flex-1 h-px bg-border" />
          <span className="text-xs font-bold text-muted-foreground tracking-widest">
            {t("customTrip.orDivider") || "OR"}
          </span>
          <div className="flex-1 h-px bg-border" />
        </div>

        {/* SECTION 2: I will Pick Myself — static header */}
        <div className="rounded-xl border bg-card p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-xl bg-secondary flex items-center justify-center">
                <Search className="size-5 text-muted-foreground" />
              </div>
              <div>
                <h2 className="font-semibold text-sm sm:text-base">
                  {t("customTrip.pickMyselfTitle") || "I will Pick Myself"}
                </h2>
                <p className="text-xs text-muted-foreground">
                  {t("customTrip.pickMyselfDesc") || "Browse activities and add them to your basket"}
                </p>
              </div>
            </div>
          </div>

          {/* Step Indicator */}
          <div className="flex items-center gap-2 text-xs text-muted-foreground mt-3 pt-3 border-t">
            <span className="flex items-center gap-1.5">
              <span className="size-5 rounded-full bg-forest text-white text-[10px] font-bold flex items-center justify-center">1</span>
              <span className="font-medium text-foreground">{t("customTrip.stepBrowse") || "Browse & pick"}</span>
            </span>
            <ChevronDown className="size-3 -rotate-90 rtl:rotate-90" />
            <span className="flex items-center gap-1.5">
              <span className="size-5 rounded-full bg-muted text-muted-foreground text-[10px] font-bold flex items-center justify-center">2</span>
              <span>{t("customTrip.stepReview") || "Review basket"}</span>
            </span>
            <ChevronDown className="size-3 -rotate-90 rtl:rotate-90" />
            <span className="flex items-center gap-1.5">
              <span className="size-5 rounded-full bg-muted text-muted-foreground text-[10px] font-bold flex items-center justify-center">3</span>
              <span>{t("customTrip.stepBuild") || "Build trip"}</span>
            </span>
          </div>
        </div>

        {/* Settings — separate card, always visible */}
        <div className="rounded-xl border bg-secondary/20 overflow-hidden">
              <button
                className="w-full flex items-center justify-between px-4 py-3 hover:bg-secondary/30 transition-colors"
                onClick={() => setShowSettings(!showSettings)}
              >
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="size-4 text-muted-foreground" />
                  <span className="font-semibold text-sm">{t("customTrip.tripSettings")}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs text-muted-foreground">{showSettings ? t("customTrip.hide") : t("customTrip.edit")}</span>
                  <ChevronDown className={cn("size-4 text-muted-foreground transition-transform", showSettings && "rotate-180")} />
                </div>
              </button>

              {/* Settings summary (collapsed) */}
              {!showSettings && (
                <div className="px-4 pb-3 space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex items-center gap-2 bg-background rounded-lg px-3 py-2.5">
                      <MapPin className="size-4 text-muted-foreground shrink-0" />
                      <span className="text-sm">{destination}</span>
                    </div>
                    <div className="flex items-center gap-2 bg-background rounded-lg px-3 py-2.5">
                      <CalendarDays className="size-4 text-muted-foreground shrink-0" />
                      <span className="text-sm">{tripDays} {t("common.days")}</span>
                    </div>
                    <div className="flex items-center gap-2 bg-background rounded-lg px-3 py-2.5">
                      <Users className="size-4 text-muted-foreground shrink-0" />
                      <span className="text-sm">{travelers} {t("common.people")}</span>
                    </div>
                    <div className="flex items-center gap-2 bg-background rounded-lg px-3 py-2.5">
                      <Wallet className="size-4 text-muted-foreground shrink-0" />
                      <span className="text-sm">{budget === "budget" ? t("customTrip.budgetLabel") : budget === "mid" ? t("customTrip.midRange") : t("customTrip.luxury")}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 bg-background rounded-lg px-3 py-2.5">
                    <HelpCircle className="size-4 text-muted-foreground shrink-0" />
                    <span className="text-sm text-muted-foreground">{t("customTrip.accommodationTBD")}</span>
                  </div>
                </div>
              )}

              {/* Settings edit (expanded) */}
              <AnimatePresence>
                {showSettings && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="px-4 pb-4 space-y-5">
                      {/* Row 1: Destination | Start Date | End Date | Travelers — all in one row */}
                      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                        <div className="space-y-1.5">
                          <Label className="text-xs text-muted-foreground">{t("customTrip.destination")}</Label>
                          <div className="flex items-center gap-2 bg-background rounded-lg px-3 py-2.5 border h-10">
                            <MapPin className="size-4 text-forest shrink-0" />
                            <span className="font-medium text-sm flex-1">{destination}</span>
                            <ChevronDown className="size-4 text-muted-foreground" />
                          </div>
                        </div>
                        <div className="space-y-1.5">
                          <Label className="text-xs text-muted-foreground">{t("customTrip.startDate")}</Label>
                          <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="h-10" />
                        </div>
                        <div className="space-y-1.5">
                          <Label className="text-xs text-muted-foreground">{t("customTrip.endDate")}</Label>
                          <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="h-10" />
                        </div>
                        <div className="space-y-1.5">
                          <Label className="text-xs text-muted-foreground">{t("customTrip.travelers")}</Label>
                          <div className="flex items-center gap-2 h-10">
                            <Button variant="outline" size="icon" className="size-10 shrink-0" onClick={() => setTravelers(Math.max(1, travelers - 1))}>-</Button>
                            <span className="w-10 text-center font-semibold text-lg">{travelers}</span>
                            <Button variant="outline" size="icon" className="size-10 shrink-0" onClick={() => setTravelers(Math.min(10, travelers + 1))}>+</Button>
                          </div>
                        </div>
                      </div>

                      {/* Row 2: Budget Level — 3 large cards */}
                      <div className="space-y-2">
                        <Label className="text-xs text-muted-foreground">{t("customTrip.budget")}</Label>
                        <div className="grid grid-cols-3 gap-3">
                          {(["budget", "mid", "luxury"] as const).map(val => {
                            const labels: Record<string, string> = {
                              budget: t("customTrip.budgetLabel"),
                              mid: t("customTrip.midRange"),
                              luxury: t("customTrip.luxury"),
                            }
                            const descs: Record<string, string> = {
                              budget: t("customTrip.budgetUnder100"),
                              mid: t("customTrip.budgetMidRange"),
                              luxury: t("customTrip.budgetOver250"),
                            }
                            const isActive = budget === val
                            return (
                              <button
                                key={val}
                                className={cn(
                                  "rounded-xl border p-4 text-start transition-all",
                                  isActive
                                    ? "bg-forest text-white border-forest shadow-md"
                                    : "bg-background hover:bg-secondary/30 border-border"
                                )}
                                onClick={() => setBudget(val)}
                              >
                                <div className="font-semibold text-sm">{labels[val]}</div>
                                <div className={cn("text-xs mt-0.5", isActive ? "text-white/80" : "text-muted-foreground")}>
                                  {descs[val]}
                                </div>
                              </button>
                            )
                          })}
                        </div>
                      </div>

                      {/* Row 3: Accommodation */}
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <Hotel className="size-4 text-muted-foreground" />
                          <span className="font-semibold text-sm">{t("customTrip.accommodation")}</span>
                          <span className="text-xs text-muted-foreground">{t("customTrip.addStays")}</span>
                        </div>

                        <p className="text-sm text-muted-foreground">{t("customTrip.haveYouBooked")}</p>

                        <div className="grid grid-cols-3 gap-3">
                          <button
                            className={cn(
                              "rounded-xl border p-4 flex flex-col items-center gap-2 text-center transition-all",
                              accommodationStatus === "booked"
                                ? "bg-forest text-white border-forest shadow-md"
                                : "bg-background hover:bg-secondary/30"
                            )}
                            onClick={() => setAccommodationStatus("booked")}
                          >
                            <CheckCircle className={cn("size-6", accommodationStatus === "booked" ? "text-white" : "text-forest")} />
                            <div className="font-semibold text-sm">{t("customTrip.alreadyBooked")}</div>
                            <div className={cn("text-[11px]", accommodationStatus === "booked" ? "text-white/80" : "text-muted-foreground")}>
                              {t("customTrip.bookedDesc")}
                            </div>
                          </button>
                          <button
                            className={cn(
                              "rounded-xl border p-4 flex flex-col items-center gap-2 text-center transition-all",
                              accommodationStatus === "planning"
                                ? "bg-forest text-white border-forest shadow-md"
                                : "bg-background hover:bg-secondary/30"
                            )}
                            onClick={() => setAccommodationStatus("planning")}
                          >
                            <CalendarCheck className={cn("size-6", accommodationStatus === "planning" ? "text-white" : "text-blue-500")} />
                            <div className="font-semibold text-sm">{t("customTrip.planningToBook")}</div>
                            <div className={cn("text-[11px]", accommodationStatus === "planning" ? "text-white/80" : "text-muted-foreground")}>
                              {t("customTrip.planningDesc")}
                            </div>
                          </button>
                          <button
                            className={cn(
                              "rounded-xl border p-4 flex flex-col items-center gap-2 text-center transition-all",
                              accommodationStatus === "undecided"
                                ? "bg-amber-500 text-white border-amber-500 shadow-md"
                                : "bg-background hover:bg-secondary/30"
                            )}
                            onClick={() => setAccommodationStatus("undecided")}
                          >
                            <HelpCircle className={cn("size-6", accommodationStatus === "undecided" ? "text-white" : "text-amber-500")} />
                            <div className="font-semibold text-sm">{t("customTrip.decideLater")}</div>
                            <div className={cn("text-[11px]", accommodationStatus === "undecided" ? "text-white/80" : "text-muted-foreground")}>
                              {t("customTrip.undecidedDesc")}
                            </div>
                          </button>
                        </div>

                        {/* AI will help info box */}
                        {accommodationStatus === "undecided" && (
                          <div className="flex items-start gap-3 bg-forest/5 border border-forest/20 rounded-xl p-4">
                            <Sparkles className="size-5 text-forest shrink-0 mt-0.5" />
                            <div>
                              <p className="text-sm font-medium text-forest">{t("customTrip.aiWillHelp")}</p>
                              <p className="text-xs text-muted-foreground mt-0.5">{t("customTrip.aiWillHelpDesc")}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Category Icons — large colorful grid */}
            <div className="flex gap-3 overflow-x-auto pt-2 pb-2 scrollbar-hide px-1">
              {categories.map(([key, category]) => {
                const Icon = category.icon
                const basketCount = manualBasket.filter(item =>
                  category.items.some(catItem => catItem.id === item.id)
                ).length
                const colorMap: Record<CategoryKey, { bg: string; activeBg: string; icon: string; activeIcon: string }> = {
                  activities:  { bg: "bg-blue-50",    activeBg: "bg-blue-600",    icon: "text-blue-600",    activeIcon: "text-white" },
                  liveEvents:  { bg: "bg-rose-50",    activeBg: "bg-rose-500",    icon: "text-rose-500",    activeIcon: "text-white" },
                  restaurants: { bg: "bg-emerald-50",  activeBg: "bg-emerald-600",  icon: "text-emerald-600", activeIcon: "text-white" },
                  cafes:       { bg: "bg-orange-50",   activeBg: "bg-orange-500",   icon: "text-orange-500",  activeIcon: "text-white" },
                  transport:   { bg: "bg-teal-50",     activeBg: "bg-teal-600",     icon: "text-teal-600",    activeIcon: "text-white" },
                  experiences: { bg: "bg-pink-50",     activeBg: "bg-pink-500",     icon: "text-pink-500",    activeIcon: "text-white" },
                  shopping:    { bg: "bg-violet-50",   activeBg: "bg-violet-600",   icon: "text-violet-600",  activeIcon: "text-white" },
                  nightlife:   { bg: "bg-fuchsia-50",  activeBg: "bg-fuchsia-600",  icon: "text-fuchsia-600", activeIcon: "text-white" },
                  wellness:    { bg: "bg-cyan-50",     activeBg: "bg-cyan-600",     icon: "text-cyan-600",    activeIcon: "text-white" },
                  tours:       { bg: "bg-indigo-50",   activeBg: "bg-indigo-600",   icon: "text-indigo-600",  activeIcon: "text-white" },
                }
                const colors = colorMap[key] || colorMap.activities
                const isActive = selectedCategory === key
                return (
                  <button
                    key={key}
                    className="flex flex-col items-center gap-1.5 shrink-0 relative group"
                    onClick={() => setSelectedCategory(key)}
                  >
                    <div className={cn(
                      "size-14 rounded-2xl flex items-center justify-center transition-all duration-200 shadow-sm",
                      isActive ? colors.activeBg + " shadow-md scale-105" : colors.bg + " hover:shadow-md hover:scale-105"
                    )}>
                      <Icon className={cn("size-7", isActive ? colors.activeIcon : colors.icon)} />
                    </div>
                    <span className={cn(
                      "text-[10px] font-medium leading-tight text-center max-w-[60px] truncate",
                      isActive ? "text-foreground" : "text-muted-foreground"
                    )}>
                      {categoryLabelMap[key]}
                    </span>
                    {basketCount > 0 && (
                      <span className="absolute -top-1 -end-1 size-5 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center shadow-sm">
                        {basketCount}
                      </span>
                    )}
                  </button>
                )
              })}
            </div>

            {/* Search + Filter + Popular — single row */}
            <div className="flex items-center gap-2">
              <div className="relative flex-1 min-w-0">
                <Search className="absolute start-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input
                  placeholder={t("customTrip.searchCategory", { category: categoryLabelMap[selectedCategory] })}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="ps-10 h-10"
                />
              </div>
              <Button
                variant={showFilters ? "secondary" : "outline"}
                size="icon"
                className="size-10 shrink-0"
                onClick={() => setShowFilters(!showFilters)}
              >
                <SlidersHorizontal className="size-4" />
              </Button>
              <Button
                variant={popularOnly ? "default" : "outline"}
                size="sm"
                className="h-10 shrink-0 gap-1.5 px-3"
                onClick={() => setPopularOnly(!popularOnly)}
              >
                <Star className={cn("size-4", popularOnly && "fill-current")} />
                <span className="text-xs">{t("customTrip.popular")}</span>
              </Button>
            </div>

            {/* Price Filters */}
            {showFilters && (
              <div className="flex flex-wrap items-center gap-2 bg-secondary/20 rounded-lg p-3">
                <span className="text-xs text-muted-foreground me-1">{t("customTrip.price")}:</span>
                {[
                  { value: "all", label: t("customTrip.all") },
                  { value: "free", label: t("customTrip.free") },
                  { value: "budget", label: t("customTrip.under20") },
                  { value: "mid", label: t("customTrip.range20to50") },
                  { value: "high", label: t("customTrip.over50") },
                ].map(opt => (
                  <Button
                    key={opt.value}
                    variant={priceFilter === opt.value ? "default" : "outline"}
                    size="sm"
                    className="h-7 text-xs"
                    onClick={() => setPriceFilter(opt.value as typeof priceFilter)}
                  >
                    {opt.label}
                  </Button>
                ))}
              </div>
            )}

            {/* Category Title + Count */}
            <div className="flex items-center gap-3">
              {(() => {
                const Icon = currentCategory.icon
                const colorMap: Record<CategoryKey, string> = {
                  activities: "bg-blue-600", liveEvents: "bg-rose-500",
                  restaurants: "bg-emerald-600", cafes: "bg-orange-500",
                  transport: "bg-teal-600", experiences: "bg-pink-500",
                  shopping: "bg-violet-600", nightlife: "bg-fuchsia-600",
                  wellness: "bg-cyan-600", tours: "bg-indigo-600",
                }
                return (
                  <div className={cn("size-9 rounded-xl flex items-center justify-center", colorMap[selectedCategory])}>
                    <Icon className="size-5 text-white" />
                  </div>
                )
              })()}
              <div>
                <h3 className="font-bold text-base sm:text-lg">{categoryLabelMap[selectedCategory]}</h3>
                <p className="text-xs text-muted-foreground">
                  {t("customTrip.optionsAvailable", { count: String(filteredItems.length) })}
                </p>
              </div>
            </div>

            {/* Activity Cards — responsive grid like reference */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {filteredItems.map(item => (
                <div
                  key={item.id}
                  className={cn(
                    "relative rounded-xl overflow-hidden border transition-all hover:shadow-lg group",
                    isInManualBasket(item.id) ? "ring-2 ring-forest" : ""
                  )}
                >
                  {/* Image */}
                  <div className="relative h-[180px] sm:h-[200px]">
                    <Image
                      src={item.image || "/paris-eiffel-tower-sunset.jpg"}
                      alt={item.title}
                      fill
                      sizes="280px"
                      className="object-cover"
                    />
                    {/* MUST DO / Free badge */}
                    {item.popular && (
                      <Badge className="absolute top-2.5 start-2.5 bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 shadow-md">
                        {t("customTrip.mustDo")}
                      </Badge>
                    )}
                    {item.cost === 0 && !item.popular && (
                      <Badge className="absolute top-2.5 start-2.5 bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 shadow-md">
                        {t("customTrip.free")}
                      </Badge>
                    )}
                    {/* + button overlay */}
                    <button
                      onClick={() => toggleManualBasket(item as Item)}
                      className={cn(
                        "absolute top-2.5 end-2.5 size-9 rounded-full flex items-center justify-center shadow-lg transition-all",
                        isInManualBasket(item.id)
                          ? "bg-forest text-white"
                          : "bg-white/80 backdrop-blur text-foreground hover:bg-white"
                      )}
                    >
                      {isInManualBasket(item.id) ? <Check className="size-5" /> : <Plus className="size-5" />}
                    </button>
                    {/* Price at bottom-right */}
                    <div className="absolute bottom-2.5 end-2.5 bg-white/90 backdrop-blur rounded-lg px-2.5 py-1 shadow-sm">
                      <span className="font-bold text-sm">
                        {item.cost === 0 ? t("customTrip.free") : "$" + item.cost}
                      </span>
                    </div>
                  </div>
                  {/* Card info */}
                  <div className="p-3">
                    <h4 className="font-semibold text-sm line-clamp-1">{item.title}</h4>
                    <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">{item.description}</p>
                    <div className="flex items-center justify-between mt-2 text-[10px] text-muted-foreground">
                      <span className="flex items-center gap-0.5"><Clock className="size-2.5" />{item.duration}</span>
                      <span className="flex items-center gap-0.5"><Star className="size-2.5 fill-amber-400 text-amber-400" />{item.rating} <span className="text-muted-foreground">({item.reviews?.toLocaleString()})</span></span>
                    </div>
                    {item.officialSite && (
                      <div className="flex items-center gap-1 mt-2 text-[10px] text-muted-foreground">
                        <ExternalLink className="size-2.5 shrink-0" />
                        <span>{t("customTrip.buyFromSite")} {item.officialSite}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {filteredItems.length === 0 && (
                <p className="text-center text-sm text-muted-foreground py-6 w-full">{t("customTrip.noResults")}</p>
              )}
            </div>
      </div>

      {/* Floating My Basket Button — bottom right */}
      <button
        className="fixed bottom-20 sm:bottom-6 end-4 z-40 flex items-center gap-2 bg-forest text-white rounded-full px-5 py-3 shadow-xl hover:bg-forest/90 transition-all hover:shadow-2xl"
        onClick={() => setShowBasketSidebar(true)}
      >
        <ShoppingBag className="size-5" />
        <span className="font-semibold text-sm">{t("customTrip.myBasket")}</span>
        <span className="text-sm">({totalBasketCount})</span>
      </button>

      {/* Basket Sidebar */}
      {showBasketSidebar && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowBasketSidebar(false)} />
          <div className="relative w-full sm:w-96 max-w-full bg-background h-full overflow-hidden flex flex-col animate-in slide-in-from-right">
            <div className="flex items-center justify-between p-4 border-b">
              <div>
                <h2 className="text-xl font-bold">{t("customTrip.myBasket")}</h2>
                <p className="text-sm text-muted-foreground">
                  {totalBasketCount} {t("customTrip.itemsSelected")}
                </p>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setShowBasketSidebar(false)}>
                <X className="size-5" />
              </Button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {totalBasketCount === 0 ? (
                <div className="text-center py-12">
                  <ShoppingBag className="size-12 text-muted-foreground/30 mx-auto mb-3" />
                  <p className="text-muted-foreground">{t("customTrip.basketEmpty")}</p>
                </div>
              ) : (
                <>
                  {aiBasket.length > 0 && (
                    <div>
                      <h3 className="text-xs font-semibold text-forest flex items-center gap-1.5 mb-3">
                        <Sparkles className="size-3.5" />
                        {t("customTrip.aiPlansTitle") || "AI Picks"}
                      </h3>
                      <div className="space-y-2">
                        {aiBasket.map(item => (
                          <div key={item.id} className="flex items-center justify-between rounded-lg border bg-card px-3 py-2 text-[11px]">
                            <div className="flex items-center gap-2 min-w-0">
                              {getItemIcon(item.type)}
                              <div className="min-w-0">
                                <span className="font-medium truncate block">{item.title}</span>
                                <span className="text-muted-foreground">{item.cost}</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-1 shrink-0 ms-2">
                              {item.purchase_url && item.purchase_url.startsWith("http") && (
                                <a href={item.purchase_url} target="_blank" rel="noopener noreferrer"
                                  className="text-blue-500 hover:text-blue-700">
                                  <ExternalLink className="size-3" />
                                </a>
                              )}
                              <button onClick={() => removeFromAiBasket(item.id)} className="text-red-400 hover:text-red-600">
                                <Trash2 className="size-3" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {manualBasket.length > 0 && (
                    <div>
                      <h3 className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5 mb-3">
                        <Search className="size-3.5" />
                        {t("customTrip.pickMyselfTitle") || "My Picks"}
                      </h3>
                      <div className="space-y-2">
                        {manualBasket.map(item => (
                          <div key={item.id} className="flex gap-3 p-2 rounded-lg bg-secondary/30">
                            <div className="relative size-14 rounded-lg overflow-hidden shrink-0">
                              <Image src={item.image || "/paris-eiffel-tower-sunset.jpg"} alt={item.title} fill sizes="56px" className="object-cover" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium text-sm line-clamp-1">{item.title}</h4>
                              <p className="text-xs text-muted-foreground">{item.duration}</p>
                              <p className="text-sm font-medium mt-0.5">
                                {item.cost === 0 ? t("customTrip.free") : "$" + item.cost}
                              </p>
                            </div>
                            <Button variant="ghost" size="icon" className="shrink-0 text-muted-foreground hover:text-destructive"
                              onClick={() => toggleManualBasket(item)}>
                              <Trash2 className="size-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>

            {totalBasketCount > 0 && (
              <div className="border-t p-4 space-y-3">
                {manualTotalCost > 0 && (
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground text-sm">{t("customTrip.estimatedTotal")}</span>
                    <span className="text-xl font-bold">${manualTotalCost}</span>
                  </div>
                )}
                <p className="text-[10px] text-muted-foreground">
                  {t("customTrip.priceDisclaimer")}
                </p>
                <Link href="/trip-basket" onClick={() => {
                  localStorage.setItem("tripBasket", JSON.stringify(manualBasket))
                  localStorage.setItem("tripAiBasket", JSON.stringify(aiBasket))
                  localStorage.setItem("tripDays", tripDays.toString())
                  localStorage.setItem("tripTravelers", travelers.toString())
                }}>
                  <Button className="w-full h-12 gap-2" size="lg">
                    <Sparkles className="size-4" />
                    {t("customTrip.generateTrip")}
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  className="w-full bg-transparent"
                  onClick={() => { setAiBasket([]); setManualBasket([]) }}
                >
                  {t("customTrip.clearBasket")}
                </Button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Bottom Nav */}
      <nav className="fixed bottom-0 inset-x-0 z-40 border-t bg-card/95 backdrop-blur pb-[env(safe-area-inset-bottom)] sm:hidden">
        <div className="flex items-center justify-around px-2 pt-2 pb-2">
          <Link href="/custom-trip" className="flex flex-col items-center gap-0.5 py-1 min-w-[60px]">
            <MapPin className="size-5 text-forest" />
            <span className="text-[10px] font-medium text-forest">{t("bottomNav.buildTrip")}</span>
          </Link>
          <Link href="/submit-trip" className="flex flex-col items-center gap-0.5 py-1 min-w-[60px]">
            <Share2 className="size-5 text-muted-foreground" />
            <span className="text-[10px] font-medium text-muted-foreground">{t("bottomNav.shareTrip")}</span>
          </Link>
          <Link href="/profile" className="flex flex-col items-center gap-0.5 py-1 min-w-[60px]">
            <User className="size-5 text-muted-foreground" />
            <span className="text-[10px] font-medium text-muted-foreground">{t("bottomNav.profile")}</span>
          </Link>
          <Link href="/explore" className="flex flex-col items-center gap-0.5 py-1 min-w-[60px]">
            <Globe className="size-5 text-muted-foreground" />
            <span className="text-[10px] font-medium text-muted-foreground">{t("bottomNav.destinations") || "Destinations"}</span>
          </Link>
        </div>
      </nav>
    </div>
  )
}

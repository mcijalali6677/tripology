"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Send, Bot, User, Sparkles, MapPin, Calendar, DollarSign,
  Plane, Hotel, Utensils, Camera, ChevronDown, X, Maximize2,
  Minimize2, RotateCcw, Star, Clock, ArrowRight, Loader2, Globe,
  ShoppingCart, Plus, Minus, Trash2, Package, ExternalLink, BadgeCheck, BadgeAlert
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useI18n } from "@/lib/i18n/context"

/** Lightweight Markdown→HTML for AI responses */
function formatMarkdown(text: string): string {
  if (!text) return ""
  // Strip basket item blocks before formatting
  const cleaned = text.replace(/```basket[\s\S]*?```/g, "").replace(/\[BASKET_ITEM\][\s\S]*?\[\/BASKET_ITEM\]/g, "")
  return cleaned
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/^### (.+)$/gm, "<h4 class='font-semibold mt-2 mb-1'>$1</h4>")
    .replace(/^## (.+)$/gm, "<h3 class='font-semibold text-base mt-3 mb-1'>$1</h3>")
    .replace(/^# (.+)$/gm, "<h3 class='font-bold text-base mt-3 mb-1'>$1</h3>")
    .replace(/^[-•] (.+)$/gm, "<li class='ms-4 list-disc'>$1</li>")
    .replace(/^(\d+)\. (.+)$/gm, "<li class='ms-4 list-decimal'>$1. $2</li>")
    .replace(/\n/g, "<br/>")
}

/** Parse [BASKET_ITEM]...[/BASKET_ITEM] blocks from AI response */
interface BasketItem {
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

function parseBasketItems(text: string): BasketItem[] {
  const items: BasketItem[] = []
  // Match both ```basket ... ``` and bare [BASKET_ITEM]...[/BASKET_ITEM]
  const patterns = [
    /\[BASKET_ITEM\]([\s\S]*?)\[\/BASKET_ITEM\]/g,
  ]
  for (const pattern of patterns) {
    let match
    while ((match = pattern.exec(text)) !== null) {
      const block = match[1]
      const item: Record<string, string> = {}
      for (const line of block.split("\n")) {
        const kv = line.match(/^\s*(\w[\w_]*):\s*(.+)$/)
        if (kv) {
          item[kv[1].trim()] = kv[2].trim()
        }
      }
      if (item.title) {
        items.push({
          id: `basket-${Date.now()}-${items.length}`,
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
  }
  return items
}

/** Get icon for basket item type */
function getItemIcon(type: string) {
  switch (type.toLowerCase()) {
    case "hotel": return <Hotel className="size-4" />
    case "restaurant": return <Utensils className="size-4" />
    case "transport": return <Plane className="size-4" />
    case "experience": return <Camera className="size-4" />
    default: return <MapPin className="size-4" />
  }
}

/** Get color for basket item type */
function getItemColor(type: string) {
  switch (type.toLowerCase()) {
    case "hotel": return "border-purple-200 bg-purple-50"
    case "restaurant": return "border-orange-200 bg-orange-50"
    case "transport": return "border-blue-200 bg-blue-50"
    case "experience": return "border-amber-200 bg-amber-50"
    default: return "border-emerald-200 bg-emerald-50"
  }
}

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
  isStreaming?: boolean
  suggestions?: string[]
  basketItems?: BasketItem[]
  cards?: TripCard[]
  mapPoints?: { lat: number; lng: number; label: string }[]
}

interface TripCard {
  type: "destination" | "activity" | "hotel" | "restaurant" | "flight"
  title: string
  subtitle: string
  image?: string
  rating?: number
  price?: string
  duration?: string
  tags?: string[]
}

const PROMPT_ICONS = [
  { icon: <Plane className="size-4" />, color: "bg-blue-50 text-blue-700 border-blue-200" },
  { icon: <MapPin className="size-4" />, color: "bg-rose-50 text-rose-700 border-rose-200" },
  { icon: <DollarSign className="size-4" />, color: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  { icon: <Camera className="size-4" />, color: "bg-amber-50 text-amber-700 border-amber-200" },
  { icon: <Utensils className="size-4" />, color: "bg-orange-50 text-orange-700 border-orange-200" },
  { icon: <Hotel className="size-4" />, color: "bg-purple-50 text-purple-700 border-purple-200" },
]

export function AIChatPlanner({
  isOpen,
  onClose,
  isFullPage = false
}: {
  isOpen?: boolean
  onClose?: () => void
  isFullPage?: boolean
}) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [basket, setBasket] = useState<BasketItem[]>([])
  const [showBasket, setShowBasket] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const abortControllerRef = useRef<AbortController | null>(null)
  const { t, locale } = useI18n()
  const [showInternational, setShowInternational] = useState(locale === "en")

  // Persist sessionId so chat continues across page navigations
  useEffect(() => {
    try {
      const saved = localStorage.getItem("tripology_planner_session")
      if (saved) setSessionId(saved)
      const savedBasket = localStorage.getItem("tripology_basket")
      if (savedBasket) setBasket(JSON.parse(savedBasket))
    } catch { /* SSR or storage unavailable */ }
  }, [])

  useEffect(() => {
    if (sessionId) {
      try { localStorage.setItem("tripology_planner_session", sessionId) } catch { /* ignore */ }
    }
  }, [sessionId])

  useEffect(() => {
    try { localStorage.setItem("tripology_basket", JSON.stringify(basket)) } catch { /* ignore */ }
  }, [basket])

  // Build prompt keys based on local vs international toggle
  const promptPrefix = showInternational ? "intlPrompt" : "prompt"
  const currentPrompts = PROMPT_ICONS.map((p, i) => ({
    ...p,
    textKey: `${promptPrefix}${i + 1}`,
  }))

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages, scrollToBottom])

  const addToBasket = (item: BasketItem) => {
    if (!basket.find(b => b.title === item.title)) {
      setBasket(prev => [...prev, item])
    }
  }

  const removeFromBasket = (itemId: string) => {
    setBasket(prev => prev.filter(b => b.id !== itemId))
  }

  const isInBasket = (title: string) => basket.some(b => b.title === title)

  const sendMessage = async (content?: string) => {
    const messageContent = content || input.trim()
    if (!messageContent || isLoading) return

    setInput("")
    setIsLoading(true)

    let currentSessionId = sessionId

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      content: messageContent,
      timestamp: new Date(),
    }

    const assistantMessage: Message = {
      id: `assistant-${Date.now()}`,
      role: "assistant",
      content: "",
      timestamp: new Date(),
      isStreaming: true,
    }

    setMessages((prev) => [...prev, userMessage, assistantMessage])

    try {
      abortControllerRef.current = new AbortController()
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: messageContent,
          sessionId: currentSessionId,
          locale: locale,
        }),
        signal: abortControllerRef.current.signal,
      })

      if (!response.ok) {
        const errData = await response.json().catch(() => null)
        throw new Error(errData?.content || errData?.error || "Failed to send message")
      }

      const contentType = response.headers.get("content-type") || ""

      // Handle JSON response (fallback mode)
      if (contentType.includes("application/json")) {
        const data = await response.json()
        const content = data.content || t("chatPlanner.fallbackHelp")
        const basketItems = parseBasketItems(content)
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantMessage.id
              ? {
                  ...msg,
                  content,
                  isStreaming: false,
                  suggestions: generateSuggestions(messageContent),
                  basketItems,
                }
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
                  setMessages((prev) =>
                    prev.map((msg) =>
                      msg.id === assistantMessage.id
                        ? { ...msg, content: fullContent }
                        : msg
                    )
                  )
                }
                if (data.done) {
                  const basketItems = parseBasketItems(fullContent)
                  setMessages((prev) =>
                    prev.map((msg) =>
                      msg.id === assistantMessage.id
                        ? {
                            ...msg,
                            content: fullContent || data.content || t("chatPlanner.fallbackHelp"),
                            isStreaming: false,
                            suggestions: generateSuggestions(messageContent),
                            basketItems,
                          }
                        : msg
                    )
                  )
                }
                if (data.error) {
                  throw new Error(data.error)
                }
              } catch (e) {
                if (jsonStr && !(e instanceof SyntaxError)) throw e
              }
            }
          }
        }
      }

      // Finalize
      const basketItems = parseBasketItems(fullContent)
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === assistantMessage.id && msg.isStreaming
            ? {
                ...msg,
                content: fullContent || t("chatPlanner.fallbackEmpty"),
                isStreaming: false,
                suggestions: fullContent ? generateSuggestions(messageContent) : undefined,
                basketItems: basketItems.length > 0 ? basketItems : undefined,
              }
            : msg
        )
      )
    } catch {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === assistantMessage.id
            ? {
                ...msg,
                content: t("chatPlanner.fallbackError"),
                isStreaming: false,
              }
            : msg
        )
      )
    } finally {
      setIsLoading(false)
    }
  }

  const generateSuggestions = (userMessage: string): string[] => {
    const lower = userMessage.toLowerCase()
    if (lower.includes("paris") || lower.includes("france") || lower.includes("پاریس") || lower.includes("فرانسه")) {
      return [t("chatPlanner.suggestParisRestaurants"), t("chatPlanner.suggestParisDayTrips"), t("chatPlanner.suggestParisBudget")]
    }
    if (lower.includes("budget") || lower.includes("cheap") || lower.includes("اقتصادی") || lower.includes("بودجه")) {
      return [t("chatPlanner.suggestBudgetHostels"), t("chatPlanner.suggestFreeActivities"), t("chatPlanner.suggestStreetFood")]
    }
    if (lower.includes("luxury") || lower.includes("resort") || lower.includes("لوکس") || lower.includes("ریزورت")) {
      return [t("chatPlanner.suggestSpa"), t("chatPlanner.suggestFineDining"), t("chatPlanner.suggestPrivateTour")]
    }
    return [t("chatPlanner.suggestMore"), t("chatPlanner.suggestBestTime"), t("chatPlanner.suggestDayPlan")]
  }

  const resetChat = () => {
    if (abortControllerRef.current) abortControllerRef.current.abort()
    setMessages([])
    setSessionId(null)
    setInput("")
    try { localStorage.removeItem("tripology_planner_session") } catch { /* ignore */ }
  }

  const containerClass = isFullPage
    ? "h-[calc(100vh-4rem)] flex flex-col"
    : cn(
        "fixed z-50 flex flex-col overflow-hidden rounded-2xl border bg-card shadow-2xl transition-all duration-300",
        isExpanded
          ? "bottom-4 end-4 start-4 top-4 sm:start-auto sm:w-[600px]"
          : "bottom-20 end-4 w-[380px] sm:w-[420px] h-[600px]"
      )

  if (!isFullPage && !isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={!isFullPage ? { opacity: 0, y: 20, scale: 0.95 } : undefined}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.95 }}
        className={containerClass}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b bg-gradient-to-r from-forest to-forest/90 px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center size-9 rounded-xl bg-white/20 backdrop-blur-sm">
              <Sparkles className="size-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-white text-sm">{t("chatPlanner.title")}</h3>
              <div className="flex items-center gap-1.5">
                <div className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[11px] text-white/70">
                  {isLoading ? t("chatPlanner.thinkingStatus") : t("chatPlanner.readyStatus")}
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1">
            {/* Basket button */}
            {basket.length > 0 && (
              <Button
                variant="ghost"
                size="icon"
                className="size-8 text-white/70 hover:text-white hover:bg-white/10 relative"
                onClick={() => setShowBasket(!showBasket)}
              >
                <ShoppingCart className="size-3.5" />
                <span className="absolute -top-0.5 -end-0.5 size-4 rounded-full bg-amber-400 text-[10px] font-bold text-amber-900 flex items-center justify-center">
                  {basket.length}
                </span>
              </Button>
            )}
            {messages.length > 0 && (
              <Button
                variant="ghost"
                size="icon"
                className="size-8 text-white/70 hover:text-white hover:bg-white/10"
                onClick={resetChat}
              >
                <RotateCcw className="size-3.5" />
              </Button>
            )}
            {!isFullPage && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-8 text-white/70 hover:text-white hover:bg-white/10"
                  onClick={() => setIsExpanded(!isExpanded)}
                >
                  {isExpanded ? <Minimize2 className="size-3.5" /> : <Maximize2 className="size-3.5" />}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-8 text-white/70 hover:text-white hover:bg-white/10"
                  onClick={onClose}
                >
                  <X className="size-3.5" />
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Basket Sidebar */}
        <AnimatePresence>
          {showBasket && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="border-b bg-amber-50/50 overflow-hidden"
            >
              <div className="p-3 max-h-[200px] overflow-y-auto">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xs font-semibold flex items-center gap-1.5">
                    <Package className="size-3.5" />
                    {t("chatPlanner.basketTitle") || "سبد سفر شما"}
                  </h4>
                  <button onClick={() => setShowBasket(false)} className="text-muted-foreground hover:text-foreground">
                    <X className="size-3.5" />
                  </button>
                </div>
                {basket.length === 0 ? (
                  <p className="text-[11px] text-muted-foreground">{t("chatPlanner.basketEmpty") || "سبد خالی است"}</p>
                ) : (
                  <div className="space-y-1.5">
                    {basket.map((item) => (
                      <div key={item.id} className="flex items-center justify-between rounded-lg border bg-white px-2.5 py-1.5 text-[11px]">
                        <div className="flex items-center gap-2 min-w-0">
                          {getItemIcon(item.type)}
                          <div className="min-w-0">
                            <span className="font-medium truncate block">{item.title}</span>
                            <span className="text-muted-foreground">{item.cost}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 shrink-0 ms-2">
                          {item.purchase_url && item.purchase_url.startsWith("http") && (
                            <a
                              href={item.purchase_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-500 hover:text-blue-700"
                              title={t("chatPlanner.buyOnline") || "خرید آنلاین"}
                            >
                              <ExternalLink className="size-3" />
                            </a>
                          )}
                          <button onClick={() => removeFromBasket(item.id)} className="text-red-400 hover:text-red-600">
                            <Trash2 className="size-3" />
                          </button>
                        </div>
                      </div>
                    ))}
                    <div className="flex items-center justify-between pt-1.5 border-t text-xs font-semibold">
                      <span>{t("chatPlanner.basketTotal") || "مجموع آیتم‌ها"}</span>
                      <span>{basket.length} {t("chatPlanner.basketItems") || "مورد"}</span>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center px-4">
              <div className="size-16 rounded-2xl bg-gradient-to-br from-forest/10 to-emerald-100 flex items-center justify-center mb-4">
                <Globe className="size-8 text-forest" />
              </div>
              <h4 className="font-serif text-lg font-semibold mb-2">{t("chatPlanner.heading")}</h4>
              <p className="text-sm text-muted-foreground mb-6 max-w-xs">
                {t("chatPlanner.description")}
              </p>

              {locale !== "en" && (
                <button
                  onClick={() => setShowInternational(!showInternational)}
                  className="flex items-center gap-1.5 text-xs text-forest hover:text-forest/80 mb-4 transition-colors"
                >
                  <Globe className="size-3.5" />
                  {showInternational ? t("chatPlanner.showLocal") : t("chatPlanner.showInternational")}
                </button>
              )}

              <div className="grid grid-cols-2 gap-2 w-full max-w-sm">
                {currentPrompts.map((prompt) => (
                  <button
                    key={prompt.textKey}
                    onClick={() => sendMessage(t(`chatPlanner.${prompt.textKey}`))}
                    className={cn(
                      "flex items-center gap-2 rounded-xl border px-3 py-2.5 text-xs text-start transition-all hover:shadow-md",
                      prompt.color
                    )}
                  >
                    {prompt.icon}
                    <span className="line-clamp-2">{t(`chatPlanner.${prompt.textKey}`)}</span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            messages.map((message) => (
              <div key={message.id}>
                <div
                  className={cn(
                    "flex gap-3",
                    message.role === "user" ? "flex-row-reverse" : "flex-row"
                  )}
                >
                  <div
                    className={cn(
                      "size-8 rounded-xl flex items-center justify-center shrink-0",
                      message.role === "user"
                        ? "bg-forest text-white"
                        : "bg-gradient-to-br from-amber-100 to-orange-100 text-amber-700"
                    )}
                  >
                    {message.role === "user" ? (
                      <User className="size-4" />
                    ) : (
                      <Bot className="size-4" />
                    )}
                  </div>
                  <div
                    className={cn(
                      "rounded-2xl px-4 py-3 max-w-[80%] text-sm leading-relaxed",
                      message.role === "user"
                        ? "bg-forest text-white rounded-tr-sm"
                        : "bg-secondary/50 text-foreground rounded-tl-sm"
                    )}
                  >
                    <div
                      className="prose prose-sm max-w-none [&_strong]:font-semibold [&_li]:my-0.5"
                      dangerouslySetInnerHTML={{ __html: formatMarkdown(message.content) }}
                    />
                    {message.isStreaming && (
                      <span className="inline-block w-1.5 h-4 bg-forest/50 animate-pulse ms-0.5 rounded-sm" />
                    )}
                  </div>
                </div>

                {/* Basket Items from AI */}
                {message.basketItems && message.basketItems.length > 0 && !message.isStreaming && (
                  <div className="mt-3 ms-11 space-y-2">
                    <div className="flex items-center gap-2 text-xs font-semibold text-forest">
                      <ShoppingCart className="size-3.5" />
                      <span>{t("chatPlanner.recommendedItems") || "پیشنهادات سفر"}</span>
                    </div>
                    <div className="grid grid-cols-1 gap-2">
                      {message.basketItems.map((item) => (
                        <motion.div
                          key={item.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={cn(
                            "rounded-xl border p-3 transition-all hover:shadow-md",
                            getItemColor(item.type)
                          )}
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
                                {/* Price with verification badge */}
                                {item.cost && (
                                  <div className="flex items-center gap-1.5 mt-1.5">
                                    <span className="flex items-center gap-0.5 text-[11px] font-semibold text-forest">
                                      <DollarSign className="size-2.5" /> {item.cost}
                                    </span>
                                    {item.price_source && (
                                      <span className={cn(
                                        "text-[9px] px-1.5 py-0.5 rounded-full flex items-center gap-0.5",
                                        item.cost.includes("⚡") || item.cost.includes("verified")
                                          ? "bg-emerald-100 text-emerald-700"
                                          : item.cost.includes("تخمینی") || item.cost.includes("~")
                                          ? "bg-amber-100 text-amber-700"
                                          : "bg-gray-100 text-gray-600"
                                      )}>
                                        {item.cost.includes("⚡") ? <BadgeCheck className="size-2.5" /> : <BadgeAlert className="size-2.5" />}
                                        {item.price_source}
                                      </span>
                                    )}
                                  </div>
                                )}
                                {/* Purchase methods */}
                                {item.purchase_methods && (
                                  <div className="text-[10px] text-muted-foreground mt-1">
                                    🛒 {item.purchase_methods}
                                  </div>
                                )}
                              </div>
                            </div>
                            <div className="flex flex-col gap-1 shrink-0">
                              <Button
                                size="sm"
                                variant={isInBasket(item.title) ? "outline" : "default"}
                                className={cn(
                                  "h-7 text-[10px]",
                                  isInBasket(item.title)
                                    ? "border-green-300 bg-green-50 text-green-700"
                                    : "bg-forest hover:bg-forest/90"
                                )}
                                onClick={() => isInBasket(item.title) ? removeFromBasket(item.id) : addToBasket(item)}
                              >
                                {isInBasket(item.title) ? (
                                  <><Minus className="size-3 me-1" /> {t("chatPlanner.added") || "اضافه شد"}</>
                                ) : (
                                  <><Plus className="size-3 me-1" /> {t("chatPlanner.addToBasket") || "افزودن"}</>
                                )}
                              </Button>
                              {/* Purchase link button */}
                              {item.purchase_url && item.purchase_url.startsWith("http") && (
                                <a
                                  href={item.purchase_url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center justify-center gap-1 h-6 text-[9px] font-medium rounded-md border border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors px-2"
                                >
                                  <ExternalLink className="size-2.5" />
                                  {t("chatPlanner.buyOnline") || "خرید آنلاین"}
                                </a>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Suggestion Chips */}
                {message.suggestions && message.suggestions.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2 ms-11">
                    {message.suggestions.map((suggestion) => (
                      <button
                        key={suggestion}
                        onClick={() => sendMessage(suggestion)}
                        className="rounded-full border border-forest/20 bg-forest/5 px-3 py-1 text-xs text-forest hover:bg-forest/10 transition-colors"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                )}

                {/* Trip Cards */}
                {message.cards && message.cards.length > 0 && (
                  <div className="flex gap-2 mt-2 ms-11 overflow-x-auto pb-1">
                    {message.cards.map((card, i) => (
                      <div
                        key={i}
                        className="min-w-[200px] rounded-xl border bg-card p-3 shadow-sm"
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <MapPin className="size-3.5 text-forest" />
                          <span className="text-xs font-medium">{card.title}</span>
                        </div>
                        <p className="text-[11px] text-muted-foreground">{card.subtitle}</p>
                        {card.rating && (
                          <div className="flex items-center gap-1 mt-1.5">
                            <Star className="size-3 text-amber-500 fill-amber-500" />
                            <span className="text-[11px] font-medium">{card.rating}</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="border-t bg-card p-3">
          <div className="flex items-end gap-2">
            <div className="flex-1 relative">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => {
                  setInput(e.target.value)
                  e.target.style.height = "auto"
                  e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px"
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault()
                    sendMessage()
                  }
                }}
                placeholder={t("chatPlanner.placeholder")}
                className="w-full resize-none rounded-xl border bg-secondary/30 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-forest/30 min-h-[44px] max-h-[120px]"
                rows={1}
              />
            </div>
            <Button
              onClick={() => sendMessage()}
              disabled={!input.trim() || isLoading}
              className="rounded-xl bg-forest hover:bg-forest/90 size-11 shrink-0"
            >
              {isLoading ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Send className="size-4" />
              )}
            </Button>
          </div>
          <p className="text-[10px] text-muted-foreground/60 mt-1.5 text-center">
            {t("chatPlanner.disclaimer")}
          </p>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}

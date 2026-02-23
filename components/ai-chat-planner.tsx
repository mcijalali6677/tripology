"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Send, Bot, User, Sparkles, MapPin, Calendar, DollarSign,
  Plane, Hotel, Utensils, Camera, ChevronDown, X, Maximize2,
  Minimize2, RotateCcw, Star, Clock, ArrowRight, Loader2, Globe
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useI18n } from "@/lib/i18n/context"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
  isStreaming?: boolean
  suggestions?: string[]
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
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const { t, locale } = useI18n()
  const [showInternational, setShowInternational] = useState(locale === "en")

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
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: messageContent,
          sessionId: currentSessionId,
          locale: locale,
        }),
      })

      if (!response.ok) {
        // Try to parse JSON error
        const errData = await response.json().catch(() => null)
        throw new Error(errData?.content || errData?.error || "Failed to send message")
      }

      const contentType = response.headers.get("content-type") || ""

      // Handle JSON response (fallback mode)
      if (contentType.includes("application/json")) {
        const data = await response.json()
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantMessage.id
              ? {
                  ...msg,
                  content: data.content || t("chatPlanner.fallbackHelp"),
                  isStreaming: false,
                  suggestions: generateSuggestions(messageContent),
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

      if (reader) {
        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          buffer += decoder.decode(value, { stream: true })
          const lines = buffer.split("\n")
          buffer = lines.pop() || "" // keep incomplete line in buffer

          for (const line of lines) {
            if (line.startsWith("data: ")) {
              const jsonStr = line.slice(6).trim()
              if (!jsonStr) continue
              try {
                const data = JSON.parse(jsonStr)
                // Capture sessionId from first event
                if (data.sessionId && !currentSessionId) {
                  currentSessionId = data.sessionId
                  setSessionId(data.sessionId)
                }
                // Accumulate tokens
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
                // Stream complete
                if (data.done) {
                  setMessages((prev) =>
                    prev.map((msg) =>
                      msg.id === assistantMessage.id
                        ? {
                            ...msg,
                            content: fullContent || data.content || t("chatPlanner.fallbackHelp"),
                            isStreaming: false,
                            suggestions: generateSuggestions(messageContent),
                          }
                        : msg
                    )
                  )
                }
                // Handle error from backend
                if (data.error) {
                  throw new Error(data.error)
                }
              } catch (e) {
                // If JSON parse fails, treat as plain text token
                if (jsonStr && !(e instanceof SyntaxError)) throw e
              }
            }
          }
        }
      }

      // Finalize: mark streaming done if not already
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === assistantMessage.id && msg.isStreaming
            ? {
                ...msg,
                content: fullContent || t("chatPlanner.fallbackEmpty"),
                isStreaming: false,
                suggestions: fullContent ? generateSuggestions(messageContent) : undefined,
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
    setMessages([])
    setSessionId(null)
    setInput("")
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

              {/* Local/International toggle — only for non-English locales */}
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
                    {message.content}
                    {message.isStreaming && (
                      <span className="inline-block w-1.5 h-4 bg-forest/50 animate-pulse ms-0.5 rounded-sm" />
                    )}
                  </div>
                </div>

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

"use client"

import type React from "react"

import { useState, useRef, useEffect, forwardRef, useImperativeHandle } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { MessageCircle, X, Send, Sparkles, RotateCcw } from "lucide-react"
import { cn } from "@/lib/utils"
import { useI18n } from "@/lib/i18n/context"

/** Lightweight Markdown→HTML for AI responses (bold, italic, lists, headers, emoji) */
function formatMarkdown(text: string): string {
  if (!text) return ""
  return text
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/^### (.+)$/gm, "<h4 class='font-semibold mt-2 mb-1'>$1</h4>")
    .replace(/^## (.+)$/gm, "<h3 class='font-semibold text-base mt-2 mb-1'>$1</h3>")
    .replace(/^# (.+)$/gm, "<h3 class='font-bold text-base mt-2 mb-1'>$1</h3>")
    .replace(/^[-•] (.+)$/gm, "<li class='ms-4 list-disc'>$1</li>")
    .replace(/^(\d+)\. (.+)$/gm, "<li class='ms-4 list-decimal'>$1. $2</li>")
    .replace(/\n/g, "<br/>")
}

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  isStreaming?: boolean
}

interface AIAssistantChatProps {
  showFloatingButton?: boolean
}

export const AIAssistantChat = forwardRef<{ openChat: () => void }, AIAssistantChatProps>(({ showFloatingButton = true }, ref) => {
  const [isOpen, setIsOpen] = useState(false)
  const [input, setInput] = useState("")
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [sessionId, setSessionId] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const abortControllerRef = useRef<AbortController | null>(null)
  const { t, locale } = useI18n()

  useImperativeHandle(ref, () => ({
    openChat: () => setIsOpen(true),
  }))

  // Persist sessionId in localStorage so chat continues across page navigations
  useEffect(() => {
    try {
      const saved = localStorage.getItem("tripology_chat_session")
      if (saved) setSessionId(saved)
    } catch { /* SSR or storage unavailable */ }
  }, [])

  useEffect(() => {
    if (sessionId) {
      try { localStorage.setItem("tripology_chat_session", sessionId) } catch { /* ignore */ }
    }
  }, [sessionId])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const resetChat = () => {
    if (abortControllerRef.current) abortControllerRef.current.abort()
    setMessages([])
    setSessionId(null)
    setInput("")
    try { localStorage.removeItem("tripology_chat_session") } catch { /* ignore */ }
  }

  const sendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: text.trim(),
    }
    setMessages(prev => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    const assistantId = (Date.now() + 1).toString()
    setMessages(prev => [...prev, { id: assistantId, role: "assistant", content: "", isStreaming: true }])

    try {
      abortControllerRef.current = new AbortController()
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text.trim(),
          sessionId,
          locale: locale,
        }),
        signal: abortControllerRef.current.signal,
      })

      const contentType = response.headers.get("content-type") || ""

      // Capture sessionId from header
      const headerSessionId = response.headers.get("x-session-id")
      if (headerSessionId && !sessionId) {
        setSessionId(headerSessionId)
      }

      if (contentType.includes("text/event-stream") && response.body) {
        const reader = response.body.getReader()
        const decoder = new TextDecoder()
        let fullContent = ""
        let buffer = ""

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
                // Capture sessionId from SSE event
                if (data.sessionId && !sessionId) {
                  setSessionId(data.sessionId)
                }
                // Handle token (backend sends {token: "..."})
                if (data.token) {
                  fullContent += data.token
                  setMessages(prev =>
                    prev.map(m => (m.id === assistantId ? { ...m, content: fullContent } : m))
                  )
                }
                // Stream complete
                if (data.done) {
                  setMessages(prev =>
                    prev.map(m => (m.id === assistantId
                      ? { ...m, content: fullContent || data.content || t("aiAssistant.fallback"), isStreaming: false }
                      : m))
                  )
                }
                // Skip heartbeats
                if (data.heartbeat || data.status === "thinking") continue
              } catch {
                // ignore parse errors for partial chunks
              }
            }
          }
        }

        // Finalize
        setMessages(prev =>
          prev.map(m =>
            m.id === assistantId && m.isStreaming
              ? { ...m, content: fullContent || t("aiAssistant.fallback"), isStreaming: false }
              : m
          )
        )
      } else {
        const data = await response.json()
        const content = data.content || data.response || t("aiAssistant.fallback")
        setMessages(prev =>
          prev.map(m => (m.id === assistantId ? { ...m, content, isStreaming: false } : m))
        )
      }
    } catch (error) {
      console.error("Chat error:", error)
      setMessages(prev =>
        prev.map(m =>
          m.id === assistantId
            ? { ...m, content: t("aiAssistant.errorMsg"), isStreaming: false }
            : m
        )
      )
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    sendMessage(input)
  }

  return (
    <>
      {/* Floating Chat Button - only show if showFloatingButton is true */}
      {!isOpen && showFloatingButton && (
        <Button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 end-6 h-14 w-14 rounded-full bg-forest shadow-lg hover:bg-forest/90 hover:shadow-xl transition-all z-50 md:h-16 md:w-16"
        >
          <MessageCircle className="h-6 w-6 md:h-7 md:w-7" />
        </Button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <Card className="fixed bottom-4 end-4 start-4 sm:start-auto sm:bottom-6 sm:end-6 sm:w-[400px] h-[500px] sm:h-[600px] flex flex-col shadow-2xl z-50 overflow-hidden">
          {/* Header */}
          <div className="bg-forest text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5" />
              <div>
                <h3 className="font-semibold">{t("aiAssistant.title")}</h3>
                <div className="flex items-center gap-1.5">
                  <div className={cn("size-1.5 rounded-full", isLoading ? "bg-amber-400 animate-pulse" : "bg-emerald-400")} />
                  <p className="text-xs text-white/80">
                    {isLoading ? t("aiAssistant.thinking") : t("aiAssistant.subtitle")}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1">
              {messages.length > 0 && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={resetChat}
                  className="text-white hover:bg-white/20 h-8 w-8"
                >
                  <RotateCcw className="h-4 w-4" />
                </Button>
              )}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
                className="text-white hover:bg-white/20"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-cream">
            {messages.length === 0 && (
              <div className="text-center text-muted-foreground py-8 space-y-2">
                <Sparkles className="h-12 w-12 mx-auto text-forest/50" />
                <p className="font-medium">{t("aiAssistant.greeting")}</p>
                <p className="text-sm px-4">
                  {t("aiAssistant.greetingDesc")}
                </p>
                <div className="pt-4 space-y-2">
                  <button
                    onClick={() => sendMessage(t("aiAssistant.suggestion1"))}
                    className="block w-full text-start p-3 rounded-lg bg-white hover:bg-sand/20 transition-colors text-sm"
                  >
                    {t("aiAssistant.suggestion1")}
                  </button>
                  <button
                    onClick={() => sendMessage(t("aiAssistant.suggestion2"))}
                    className="block w-full text-start p-3 rounded-lg bg-white hover:bg-sand/20 transition-colors text-sm"
                  >
                    {t("aiAssistant.suggestion2")}
                  </button>
                  <button
                    onClick={() => sendMessage(t("aiAssistant.suggestion3"))}
                    className="block w-full text-start p-3 rounded-lg bg-white hover:bg-sand/20 transition-colors text-sm"
                  >
                    {t("aiAssistant.suggestion3")}
                  </button>
                </div>
              </div>
            )}
            {messages.map((message) => (
              <div key={message.id} className={cn("flex", message.role === "user" ? "justify-end" : "justify-start")}>
                <div
                  className={cn(
                    "max-w-[85%] rounded-2xl px-4 py-2.5",
                    message.role === "user" ? "bg-forest text-white" : "bg-white text-gray-900 shadow-sm",
                  )}
                >
                  <div className="text-sm whitespace-pre-wrap leading-relaxed prose prose-sm max-w-none"
                    dangerouslySetInnerHTML={{ __html: formatMarkdown(message.content) }}
                  />
                  {message.isStreaming && (
                    <span className="inline-block w-1.5 h-4 bg-forest/50 animate-pulse ms-0.5 rounded-sm" />
                  )}
                </div>
              </div>
            ))}
            {isLoading && messages[messages.length - 1]?.content === "" && (
              <div className="flex justify-start">
                <div className="bg-white rounded-2xl px-4 py-3 shadow-sm">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-forest/40 rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-forest/40 rounded-full animate-bounce [animation-delay:0.2s]" />
                    <div className="w-2 h-2 bg-forest/40 rounded-full animate-bounce [animation-delay:0.4s]" />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form id="chat-form" onSubmit={handleSubmit} className="p-4 bg-white border-t">
            <div className="flex gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={t("aiAssistant.placeholder")}
                disabled={isLoading}
                className="flex-1 px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-forest focus:border-transparent disabled:bg-gray-100 text-sm"
              />
              <Button
                type="submit"
                size="icon"
                disabled={!input.trim() || isLoading}
                className="rounded-full bg-forest hover:bg-forest/90 h-10 w-10 flex-shrink-0"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </form>
        </Card>
      )}
    </>
  )
})

AIAssistantChat.displayName = "AIAssistantChat"

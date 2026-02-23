"use client"

import type React from "react"

import { useState, useRef, useEffect, forwardRef, useImperativeHandle } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { MessageCircle, X, Send, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"
import { useI18n } from "@/lib/i18n/context"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
}

interface AIAssistantChatProps {
  showFloatingButton?: boolean
}

export const AIAssistantChat = forwardRef<{ openChat: () => void }, AIAssistantChatProps>(({ showFloatingButton = true }, ref) => {
  const [isOpen, setIsOpen] = useState(false)
  const [input, setInput] = useState("")
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { t } = useI18n()

  useImperativeHandle(ref, () => ({
    openChat: () => setIsOpen(true),
  }))

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

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

    // Add a placeholder assistant message for streaming
    const assistantId = (Date.now() + 1).toString()
    setMessages(prev => [...prev, { id: assistantId, role: "assistant", content: "" }])

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMessage].map(m => ({
            role: m.role,
            content: m.content,
          })),
        }),
      })

      const contentType = response.headers.get("content-type") || ""

      if (contentType.includes("text/event-stream") && response.body) {
        // Handle SSE streaming
        const reader = response.body.getReader()
        const decoder = new TextDecoder()
        let fullContent = ""

        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          const chunk = decoder.decode(value)
          const lines = chunk.split("\n")
          for (const line of lines) {
            if (line.startsWith("data: ")) {
              try {
                const data = JSON.parse(line.slice(6))
                if (data.type === "token") {
                  fullContent += data.content
                  setMessages(prev =>
                    prev.map(m => (m.id === assistantId ? { ...m, content: fullContent } : m))
                  )
                }
              } catch {
                // ignore parse errors for partial chunks
              }
            }
          }
        }

        if (!fullContent) {
          setMessages(prev =>
            prev.map(m =>
              m.id === assistantId
                ? { ...m, content: "I'm here to help! Ask me about travel destinations, itineraries, or your trip preferences." }
                : m
            )
          )
        }
      } else {
        // Handle JSON response
        const data = await response.json()
        const content = data.content || data.response || "I'm here to help with your travel plans!"
        setMessages(prev =>
          prev.map(m => (m.id === assistantId ? { ...m, content } : m))
        )
      }
    } catch (error) {
      console.error("Chat error:", error)
      setMessages(prev =>
        prev.map(m =>
          m.id === assistantId
            ? { ...m, content: "Sorry, I'm having trouble connecting. Please make sure the backend server is running." }
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
                <p className="text-xs text-white/80">{t("aiAssistant.subtitle")}</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
              className="text-white hover:bg-white/20"
            >
              <X className="h-5 w-5" />
            </Button>
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
                  <p className="text-sm whitespace-pre-wrap leading-relaxed">{message.content}</p>
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

"use client"

import { Navbar } from "@/components/navbar"
import { AIChatPlanner } from "@/components/ai-chat-planner"

export default function TripCompanionPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <div className="flex-1">
        <AIChatPlanner isFullPage />
      </div>
    </div>
  )
}
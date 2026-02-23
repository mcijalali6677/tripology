"use client"

import { useState } from "react"
import { useI18n } from "@/lib/i18n/context"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import {
  ArrowLeft,
  ArrowRight,
  MapPin,
  Calendar,
  Users,
  DollarSign,
  Plus,
  Trash2,
  Clock,
  Camera,
  X,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Upload,
  Smile,
  Meh,
  Frown,
  Zap,
  Battery,
  BatteryLow,
  Lightbulb,
  AlertTriangle,
  Star,
  Save,
  MessageCircle,
  Mic,
  Send,
  Bot,
  Handshake,
  TrendingUp,
  Keyboard,
  ChevronDown,
  ChevronUp
} from "lucide-react"

// Types
type TravelStyle = "budget" | "midrange" | "luxury" | "backpacker"
type TravelerType = "solo" | "couple" | "friends" | "family"
type Mood = "very_bad" | "bad" | "neutral" | "good" | "great"
type EnergyLevel = "low" | "medium" | "high"

type TimeBlock = {
  id: string
  startTime: string
  endTime: string
  location: string
  description: string
  activityType?: string
  transportation?: string
  cost?: number
  costDescription?: string
  isCheapWin?: boolean
  isExpensiveMistake?: boolean
  photos: string[]
}

type DayEntry = {
  id: string
  dayNumber: number
  date?: string
  timeBlocks: TimeBlock[]
  mistake?: string
  tip?: string
  unexpected?: string
  mood?: Mood
  energyLevel?: EnergyLevel
}

type TripSetup = {
  destination: string
  country: string
  tripLength: number
  travelStyle: TravelStyle | ""
  travelerType: TravelerType | ""
  totalBudget?: number
}

// Activity type options
const activityTypes = [
  "Sightseeing",
  "Museum",
  "Food & Dining",
  "Cafe",
  "Walking",
  "Shopping",
  "Nature",
  "Beach",
  "Nightlife",
  "Culture",
  "Adventure",
  "Relaxation",
  "Transport",
  "Rest",
  "Other"
]

const transportOptions = [
  "Walking",
  "Metro/Subway",
  "Bus",
  "Taxi/Uber",
  "Train",
  "Tram",
  "Bicycle",
  "Scooter",
  "Car",
  "Ferry/Boat",
  "None"
]

export default function SubmitTripPage() {
  const { t } = useI18n()
  const [currentStep, setCurrentStep] = useState(1)
  const [tripSetup, setTripSetup] = useState<TripSetup>({
    destination: "",
    country: "",
    tripLength: 1,
    travelStyle: "",
    travelerType: "",
  })
  const [days, setDays] = useState<DayEntry[]>([])
  const [currentDayIndex, setCurrentDayIndex] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [showAIChat, setShowAIChat] = useState(false) // Declared showAIChat
  
  // AI Chat Assistant state
  const [aiChatExpanded, setAiChatExpanded] = useState(true)
  const [aiChatMessage, setAiChatMessage] = useState("")
  const [isRecording, setIsRecording] = useState(false)
  const [isAiTyping, setIsAiTyping] = useState(false)
  const [aiChatHistory, setAiChatHistory] = useState<{role: "user" | "assistant"; message: string}[]>([])
  
  // Context-aware AI prompts for each step/day
  const getAIPrompt = () => {
    if (currentStep === 1) {
      return t("submitTrip.aiPromptSetup")
    }
    if (currentStep === 2 && currentDay) {
      const dayNum = currentDay.dayNumber
      if (dayNum === 1) {
        return t("submitTrip.aiPromptDay1")
      }
      if (dayNum === days.length) {
        return t("submitTrip.aiPromptLastDay")
      }
      return t("submitTrip.aiPromptDay", { number: String(dayNum) })
    }
    if (currentStep === 3) {
      return t("submitTrip.aiPromptReview")
    }
    return t("submitTrip.aiPromptDefault")
  }
  
  // Quick question suggestions based on context
  const getQuickQuestions = () => {
    if (currentStep === 1) {
      return [
        t("submitTrip.quickSetup1"),
        t("submitTrip.quickSetup2"),
        t("submitTrip.quickSetup3")
      ]
    }
    if (currentStep === 2 && currentDay) {
      const dayNum = currentDay.dayNumber
      if (dayNum === 1) {
        return [
          t("submitTrip.quickDay1a"),
          t("submitTrip.quickDay1b"),
          t("submitTrip.quickDay1c")
        ]
      }
      return [
        t("submitTrip.quickDayNa"),
        t("submitTrip.quickDayNb"),
        t("submitTrip.quickDayNc"),
        t("submitTrip.quickDayNd")
      ]
    }
    return []
  }

  const totalSteps = 3 + (tripSetup.tripLength || 1) // Setup + Days + Review
  const progress = (currentStep / totalSteps) * 100

  // Initialize days when trip length changes
  const initializeDays = () => {
    const newDays: DayEntry[] = []
    for (let i = 1; i <= tripSetup.tripLength; i++) {
      newDays.push({
        id: `day-${i}`,
        dayNumber: i,
        timeBlocks: [],
      })
    }
    setDays(newDays)
    setCurrentStep(2)
  }

  // Add time block to current day
  const addTimeBlock = () => {
    const newBlock: TimeBlock = {
      id: `block-${Date.now()}`,
      startTime: "",
      endTime: "",
      location: "",
      description: "",
      photos: [],
    }
    setDays(prev => prev.map((day, idx) => 
      idx === currentDayIndex 
        ? { ...day, timeBlocks: [...day.timeBlocks, newBlock] }
        : day
    ))
  }

  // Update time block
  const updateTimeBlock = (blockId: string, updates: Partial<TimeBlock>) => {
    setDays(prev => prev.map((day, idx) => 
      idx === currentDayIndex 
        ? { 
            ...day, 
            timeBlocks: day.timeBlocks.map(block => 
              block.id === blockId ? { ...block, ...updates } : block
            )
          }
        : day
    ))
  }

  // Remove time block
  const removeTimeBlock = (blockId: string) => {
    setDays(prev => prev.map((day, idx) => 
      idx === currentDayIndex 
        ? { ...day, timeBlocks: day.timeBlocks.filter(block => block.id !== blockId) }
        : day
    ))
  }

  // Update day insights
  const updateDayInsights = (updates: Partial<DayEntry>) => {
    setDays(prev => prev.map((day, idx) => 
      idx === currentDayIndex ? { ...day, ...updates } : day
    ))
  }

  // Handle photo upload (simulated)
  const handlePhotoUpload = (blockId: string, files: FileList | null) => {
    if (!files) return
    const newPhotos = Array.from(files).map(file => URL.createObjectURL(file))
    setDays(prev => prev.map((day, idx) => 
      idx === currentDayIndex 
        ? { 
            ...day, 
            timeBlocks: day.timeBlocks.map(block => 
              block.id === blockId 
                ? { ...block, photos: [...block.photos, ...newPhotos] }
                : block
            )
          }
        : day
    ))
  }

  // Remove photo
  const removePhoto = (blockId: string, photoIndex: number) => {
    setDays(prev => prev.map((day, idx) => 
      idx === currentDayIndex 
        ? { 
            ...day, 
            timeBlocks: day.timeBlocks.map(block => 
              block.id === blockId 
                ? { ...block, photos: block.photos.filter((_, i) => i !== photoIndex) }
                : block
            )
          }
        : day
    ))
  }

  // Navigate days
  const goToNextDay = () => {
    if (currentDayIndex < days.length - 1) {
      setCurrentDayIndex(currentDayIndex + 1)
    } else {
      setCurrentStep(3) // Go to review
    }
  }

  const goToPreviousDay = () => {
    if (currentDayIndex > 0) {
      setCurrentDayIndex(currentDayIndex - 1)
    } else {
      setCurrentStep(1) // Go back to setup
    }
  }

  // Submit trip
  const handleSubmit = async () => {
    setIsSubmitting(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    setIsSubmitting(false)
    setShowSuccess(true)
  }
  
  // AI Chat functions
  const sendAIChatMessage = (message?: string) => {
    const msg = message || aiChatMessage
    if (!msg.trim()) return
    
    setAiChatHistory(prev => [...prev, { role: "user", message: msg }])
    setAiChatMessage("")
    setIsAiTyping(true)
    
    // Simulate AI response with context-aware reply
    setTimeout(() => {
      setIsAiTyping(false)
      let response = ""
      
      if (currentStep === 1) {
        response = t("submitTrip.aiResponseSetup")
      } else if (currentStep === 2) {
        const dayNum = currentDay?.dayNumber || 1
        response = t("submitTrip.aiResponseDay", { number: String(dayNum) })
      } else {
        response = t("submitTrip.aiResponseReview")
      }
      
      setAiChatHistory(prev => [...prev, { role: "assistant", message: response }])
    }, 800)
  }
  
  const toggleVoiceRecording = () => {
    setIsRecording(!isRecording)
    if (!isRecording) {
      // Start recording - in real app, use Web Speech API
      setTimeout(() => {
        setIsRecording(false)
        sendAIChatMessage("Visited the Eiffel Tower in the morning, amazing views!")
      }, 2000)
    }
  }

  const currentDay = days[currentDayIndex]

  // Mood icons
  const moodIcons = {
    very_bad: { icon: Frown, color: "text-red-500", label: t("submitTrip.moodVeryBad") },
    bad: { icon: Frown, color: "text-orange-500", label: t("submitTrip.moodBad") },
    neutral: { icon: Meh, color: "text-yellow-500", label: t("submitTrip.moodNeutral") },
    good: { icon: Smile, color: "text-green-500", label: t("submitTrip.moodGood") },
    great: { icon: Smile, color: "text-emerald-500", label: t("submitTrip.moodGreat") },
  }

  const energyIcons = {
    low: { icon: BatteryLow, color: "text-red-500", label: t("submitTrip.energyLow") },
    medium: { icon: Battery, color: "text-yellow-500", label: t("submitTrip.energyMedium") },
    high: { icon: Zap, color: "text-green-500", label: t("submitTrip.energyHigh") },
  }

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-lg w-full p-8 text-center">
          <div className="size-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="size-8 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold mb-2">{t("submitTrip.submitted")}</h1>
          <p className="text-muted-foreground mb-6">
            {t("submitTrip.underReview")}
          </p>
          
          {/* What happens next */}
          <div className="bg-muted/50 rounded-xl p-4 mb-6 text-start space-y-3">
            <h3 className="font-semibold text-sm">{t("submitTrip.whatsNext")}</h3>
            <div className="flex gap-3 text-sm">
              <div className="size-6 rounded-full bg-forest/10 flex items-center justify-center shrink-0 mt-0.5">
                <span className="text-xs font-bold text-forest">1</span>
              </div>
              <p className="text-muted-foreground">{t("submitTrip.reviewAuth")}</p>
            </div>
            <div className="flex gap-3 text-sm">
              <div className="size-6 rounded-full bg-forest/10 flex items-center justify-center shrink-0 mt-0.5">
                <span className="text-xs font-bold text-forest">2</span>
              </div>
              <p className="text-muted-foreground">{t("submitTrip.earnRange")}</p>
            </div>
            <div className="flex gap-3 text-sm">
              <div className="size-6 rounded-full bg-forest/10 flex items-center justify-center shrink-0 mt-0.5">
                <span className="text-xs font-bold text-forest">3</span>
              </div>
              <p className="text-muted-foreground">{t("submitTrip.listedRange")}</p>
            </div>
          </div>
          
          <div className="space-y-3">
            <Button asChild className="w-full">
              <Link href="/">{t("common.back")}</Link>
            </Button>
            <Button variant="outline" asChild className="w-full bg-transparent">
              <Link href="/submit-trip">{t("submitTrip.submitAnother")}</Link>
            </Button>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" asChild>
                <Link href="/">
                  <ArrowLeft className="size-5" />
                </Link>
              </Button>
              <div>
                <h1 className="font-semibold">{t("submitTrip.title")}</h1>
                <p className="text-sm text-muted-foreground">
                  {currentStep === 1 && t("submitTrip.basicInfo")}
                  {currentStep === 2 && t("submitTrip.dayOfDays", { current: String(currentDayIndex + 1), total: String(days.length) })}
                  {currentStep === 3 && t("submitTrip.pricing")}
                </p>
              </div>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              className="hidden sm:flex bg-transparent"
              onClick={() => {
                try {
                  localStorage.setItem("tripDraft", JSON.stringify({ tripSetup, days, currentStep }))
                  alert(t("submitTrip.saveDraft") + " ✓")
                } catch {}
              }}
            >
              <Save className="size-3 me-1" />
              {t("submitTrip.saveDraft")}
            </Button>
          </div>
          
          {/* Progress bar */}
          <div className="mt-4">
            <Progress value={progress} className="h-2" />
            <p className="text-xs text-muted-foreground mt-1 text-end">
              {t("submitTrip.percentComplete", { percent: String(Math.round(progress)) })}
            </p>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-3xl">
        {/* Inline AI Assistant - Minimal & Active */}
        <Card className="mb-6 overflow-hidden border-forest/30">
          {/* Header - Always visible */}
          <button 
            className="w-full flex items-center justify-between p-3 bg-forest/5 hover:bg-forest/10 transition-colors"
            onClick={() => setAiChatExpanded(!aiChatExpanded)}
          >
            <div className="flex items-center gap-2">
              <div className="size-8 rounded-full bg-forest flex items-center justify-center">
                <Bot className="size-4 text-white" />
              </div>
              <div className="text-start">
                <p className="text-sm font-medium">{t("submitTrip.aiAssistant")}</p>
                <p className="text-xs text-muted-foreground">{t("submitTrip.typeOrSpeak")}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {isRecording && (
                <Badge className="bg-red-500 text-white animate-pulse">{t("submitTrip.recording")}</Badge>
              )}
              {aiChatExpanded ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
            </div>
          </button>
          
          {/* Expanded Chat Area */}
          {aiChatExpanded && (
            <div className="border-t">
              {/* AI Prompt for current context */}
              <div className="p-3 bg-muted/30">
                <p className="text-sm text-muted-foreground">{getAIPrompt()}</p>
              </div>
              
              {/* Chat History - only show if there are messages */}
              {aiChatHistory.length > 0 && (
                <div className="max-h-32 overflow-y-auto p-3 space-y-2 border-t border-b">
                  {aiChatHistory.slice(-4).map((msg, idx) => (
                    <div key={idx} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                      <div className={`max-w-[85%] rounded-lg px-3 py-1.5 text-sm ${
                        msg.role === "user" 
                          ? "bg-forest text-white" 
                          : "bg-muted"
                      }`}>
                        {msg.message}
                      </div>
                    </div>
                  ))}
                  {isAiTyping && (
                    <div className="flex justify-start">
                      <div className="bg-muted rounded-lg px-3 py-1.5 text-sm text-muted-foreground">
                        {t("submitTrip.typing")}
                      </div>
                    </div>
                  )}
                </div>
              )}
              
              {/* Quick Suggestions */}
              <div className="p-2 flex flex-wrap gap-1.5 border-b">
                {getQuickQuestions().map((q, idx) => (
                  <button
                    key={idx}
                    className="text-xs px-2.5 py-1 rounded-full bg-muted hover:bg-forest/10 hover:text-forest transition-colors"
                    onClick={() => sendAIChatMessage(q)}
                  >
                    {q}
                  </button>
                ))}
              </div>
              
              {/* Input Area */}
              <div className="p-2 flex gap-2">
                <Button 
                  variant="outline" 
                  size="icon" 
                  className={`shrink-0 size-9 bg-transparent ${isRecording ? "bg-red-100 text-red-500 border-red-300 animate-pulse" : ""}`}
                  onClick={toggleVoiceRecording}
                >
                  <Mic className="size-4" />
                </Button>
                <Input
                  placeholder={t("submitTrip.describeExperience")}
                  value={aiChatMessage}
                  onChange={(e) => setAiChatMessage(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && sendAIChatMessage()}
                  className="flex-1 h-9"
                />
                <Button size="icon" className="size-9" onClick={() => sendAIChatMessage()} disabled={!aiChatMessage.trim()}>
                  <Send className="size-4" />
                </Button>
              </div>
            </div>
          )}
        </Card>

        {/* Earning Info - Compact */}
        <div className="flex flex-wrap items-center justify-center gap-4 mb-6 py-3 px-4 dark:bg-amber-950/30 rounded-lg border border-amber-200 dark:border-amber-800 text-sm bg-lime-100">
          <div className="flex items-center gap-1.5">
            <DollarSign className="size-4 text-amber-600" />
            <span className="dark:text-amber-200 text-foreground" dangerouslySetInnerHTML={{ __html: t("submitTrip.earnForData") }} />
          </div>
          <span className="text-amber-400">|</span>
          <div className="flex items-center gap-1.5">
            <TrendingUp className="size-4 text-amber-600" />
            <span className="dark:text-amber-200 text-foreground" dangerouslySetInnerHTML={{ __html: t("submitTrip.revenueShare") }} />
          </div>
          <span className="text-amber-400 hidden sm:inline">|</span>
          <div className="flex items-center gap-1.5">
            <Sparkles className="size-4 text-amber-600" />
            <span className="dark:text-amber-200 text-foreground">{t("submitTrip.helpsTrainAI")}</span>
          </div>
        </div>

        {/* Step 1: Trip Setup */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold mb-2">{t("submitTrip.tellUsAboutTrip")}</h2>
              <p className="text-muted-foreground">
                {t("submitTrip.basicInfoDesc")}
              </p>
            </div>

            <Card className="p-6 space-y-6">
              {/* Destination */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="destination">{t("submitTrip.cityDestination")}</Label>
                  <div className="relative">
                    <MapPin className="absolute start-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                    <Input
                      id="destination"
                      placeholder={t("submitTrip.placeholderParis")}
                      className="ps-10"
                      value={tripSetup.destination}
                      onChange={(e) => setTripSetup({ ...tripSetup, destination: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="country">{t("submitTrip.country")}</Label>
                  <Input
                    id="country"
                    placeholder={t("submitTrip.placeholderFrance")}
                    value={tripSetup.country}
                    onChange={(e) => setTripSetup({ ...tripSetup, country: e.target.value })}
                  />
                </div>
              </div>

              {/* Trip Length */}
              <div className="space-y-2">
                <Label htmlFor="tripLength">{t("submitTrip.tripLengthDays")}</Label>
                <div className="relative">
                  <Calendar className="absolute start-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  <Input
                    id="tripLength"
                    type="number"
                    min={1}
                    max={30}
                    className="ps-10"
                    value={tripSetup.tripLength}
                    onChange={(e) => setTripSetup({ ...tripSetup, tripLength: parseInt(e.target.value) || 1 })}
                  />
                </div>
              </div>

              {/* Travel Style */}
              <div className="space-y-2">
                <Label>{t("submitTrip.travelStyleLabel")}</Label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {(["budget", "midrange", "luxury", "backpacker"] as TravelStyle[]).map((style) => {
                    const styleLabels: Record<TravelStyle, string> = {
                      budget: t("submitTrip.styleBudget"),
                      midrange: t("submitTrip.styleMidrange"),
                      luxury: t("submitTrip.styleLuxury"),
                      backpacker: t("submitTrip.styleBackpacker"),
                    }
                    return (
                    <button
                      key={style}
                      type="button"
                      className={`p-3 rounded-lg border text-sm font-medium transition-colors ${
                        tripSetup.travelStyle === style
                          ? "border-forest bg-forest/10 text-forest"
                          : "border-input hover:bg-secondary"
                      }`}
                      onClick={() => setTripSetup({ ...tripSetup, travelStyle: style })}
                    >
                      {styleLabels[style]}
                    </button>
                    )
                  })}
                </div>
              </div>

              {/* Traveler Type */}
              <div className="space-y-2">
                <Label>{t("submitTrip.whoWasTrip")}</Label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {(["solo", "couple", "friends", "family"] as TravelerType[]).map((type) => {
                    const typeLabels: Record<TravelerType, string> = {
                      solo: t("submitTrip.typeSolo"),
                      couple: t("submitTrip.typeCouple"),
                      friends: t("submitTrip.typeFriends"),
                      family: t("submitTrip.typeFamily"),
                    }
                    return (
                    <button
                      key={type}
                      type="button"
                      className={`p-3 rounded-lg border text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
                        tripSetup.travelerType === type
                          ? "border-forest bg-forest/10"
                          : "border-input hover:bg-secondary"
                      }`}
                      onClick={() => setTripSetup({ ...tripSetup, travelerType: type })}
                    >
                      <Users className="size-4" />
                      {typeLabels[type]}
                    </button>
                    )
                  })}
                </div>
              </div>

              {/* Total Budget (Optional) */}
              <div className="space-y-2">
                <Label htmlFor="budget">{t("submitTrip.approxBudget")}</Label>
                <div className="relative">
                  <DollarSign className="absolute start-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  <Input
                    id="budget"
                    type="number"
                    placeholder={t("submitTrip.placeholderBudget")}
                    className="ps-10"
                    value={tripSetup.totalBudget || ""}
                    onChange={(e) => setTripSetup({ ...tripSetup, totalBudget: parseInt(e.target.value) || undefined })}
                  />
                </div>
                <p className="text-xs text-muted-foreground">{t("submitTrip.budgetNote")}</p>
              </div>
            </Card>

            {/* Info Notice */}
            <Card className="p-4 bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800">
              <div className="flex gap-3">
                <AlertCircle className="size-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-amber-800 dark:text-amber-200">{t("submitTrip.realExperiencesOnly")}</p>
                  <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">
                    {t("submitTrip.realExperiencesDesc")}
                  </p>
                </div>
              </div>
            </Card>

            {/* Continue Button */}
            <div className="flex justify-end">
              <Button 
                size="lg"
                disabled={!tripSetup.destination || !tripSetup.travelStyle || !tripSetup.travelerType}
                onClick={initializeDays}
              >
                {t("submitTrip.continueToDay")}
                <ArrowRight className="ms-2 size-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Step 2: Day Builder */}
        {currentStep === 2 && currentDay && (
          <div className="space-y-6">
            {/* Day Header */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">{t("submitTrip.dayTitle", { number: String(currentDay.dayNumber) })}</h2>
                <p className="text-muted-foreground">
                  {tripSetup.destination}, {tripSetup.country}
                </p>
              </div>
              <div className="flex gap-2">
                {days.map((day, idx) => (
                  <button
                    key={day.id}
                    onClick={() => setCurrentDayIndex(idx)}
                    className={`size-8 rounded-full text-sm font-medium transition-colors ${
                      idx === currentDayIndex
                        ? "bg-forest text-white"
                        : day.timeBlocks.length > 0
                        ? "bg-green-100 text-green-700"
                        : "bg-secondary text-muted-foreground"
                    }`}
                  >
                    {day.dayNumber}
                  </button>
                ))}
              </div>
            </div>

            {/* Optional Date */}
            <Card className="p-4">
              <div className="flex items-center gap-4">
                <Calendar className="size-5 text-muted-foreground" />
                <div className="flex-1">
                  <Label htmlFor="dayDate">{t("submitTrip.dateOptional")}</Label>
                  <Input
                    id="dayDate"
                    type="date"
                    value={currentDay.date || ""}
                    onChange={(e) => updateDayInsights({ date: e.target.value })}
                    className="mt-1"
                  />
                </div>
              </div>
            </Card>

            {/* Time Blocks */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">{t("submitTrip.timeBlocks")}</h3>
                <Button variant="outline" size="sm" onClick={addTimeBlock} className="bg-transparent">
                  <Plus className="size-4 me-1" />
                  {t("submitTrip.addTimeBlock")}
                </Button>
              </div>

              {currentDay.timeBlocks.length === 0 ? (
                <Card className="p-8 text-center border-dashed">
                  <Clock className="size-12 text-muted-foreground mx-auto mb-4" />
                  <h4 className="font-medium mb-2">{t("submitTrip.noTimeBlocks")}</h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    {t("submitTrip.noTimeBlocksDesc")}
                  </p>
                  <Button onClick={addTimeBlock}>
                    <Plus className="size-4 me-2" />
                    {t("submitTrip.addFirstBlock")}
                  </Button>
                </Card>
              ) : (
                <div className="space-y-4">
                  {currentDay.timeBlocks.map((block, index) => (
                    <Card key={block.id} className="p-4 space-y-4">
                      <div className="flex items-start justify-between">
                        <Badge variant="secondary">{t("submitTrip.blockNumber", { number: String(index + 1) })}</Badge>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="size-8 text-muted-foreground hover:text-destructive"
                          onClick={() => removeTimeBlock(block.id)}
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </div>

                      {/* Time Range */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>{t("submitTrip.startTime")}</Label>
                          <Input
                            type="time"
                            value={block.startTime}
                            onChange={(e) => updateTimeBlock(block.id, { startTime: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>{t("submitTrip.endTime")}</Label>
                          <Input
                            type="time"
                            value={block.endTime}
                            onChange={(e) => updateTimeBlock(block.id, { endTime: e.target.value })}
                          />
                        </div>
                      </div>

                      {/* Location */}
                      <div className="space-y-2">
                        <Label>{t("submitTrip.locationArea")}</Label>
                        <div className="relative">
                          <MapPin className="absolute start-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                          <Input
                            placeholder={t("submitTrip.placeholderLocation")}
                            className="ps-10"
                            value={block.location}
                            onChange={(e) => updateTimeBlock(block.id, { location: e.target.value })}
                          />
                        </div>
                      </div>

                      {/* What you did */}
                      <div className="space-y-2">
                        <Label>{t("submitTrip.whatDidYouDo")}</Label>
                        <Textarea
                          placeholder={t("submitTrip.placeholderWhatDid")}
                          rows={3}
                          value={block.description}
                          onChange={(e) => updateTimeBlock(block.id, { description: e.target.value })}
                        />
                      </div>

                      {/* Activity Type & Transportation */}
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>{t("submitTrip.activityTypeOptional")}</Label>
                          <Select
                            value={block.activityType || ""}
                            onValueChange={(value) => updateTimeBlock(block.id, { activityType: value })}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder={t("submitTrip.selectType")} />
                            </SelectTrigger>
                            <SelectContent>
                              {activityTypes.map(type => (
                                <SelectItem key={type} value={type}>{type}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>{t("submitTrip.transportOptional")}</Label>
                          <Select
                            value={block.transportation || ""}
                            onValueChange={(value) => updateTimeBlock(block.id, { transportation: value })}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder={t("submitTrip.howDidYouGet")} />
                            </SelectTrigger>
                            <SelectContent>
                              {transportOptions.map(type => (
                                <SelectItem key={type} value={type}>{type}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      {/* Cost */}
                      <div className="space-y-2">
                        <Label>{t("submitTrip.costOptional")}</Label>
                        <div className="flex gap-2">
                          <div className="relative flex-1">
                            <DollarSign className="absolute start-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                            <Input
                              type="number"
                              placeholder="0"
                              className="ps-10"
                              value={block.cost || ""}
                              onChange={(e) => updateTimeBlock(block.id, { cost: parseFloat(e.target.value) || undefined })}
                            />
                          </div>
                          <Input
                            placeholder={t("submitTrip.whatWasItFor")}
                            className="flex-1"
                            value={block.costDescription || ""}
                            onChange={(e) => updateTimeBlock(block.id, { costDescription: e.target.value })}
                          />
                        </div>
                        <div className="flex gap-2 mt-2">
                          <button
                            type="button"
                            className={`flex-1 p-2 rounded-lg border text-xs font-medium transition-colors ${
                              block.isCheapWin
                                ? "border-green-500 bg-green-50 text-green-700"
                                : "border-input hover:bg-secondary"
                            }`}
                            onClick={() => updateTimeBlock(block.id, { isCheapWin: !block.isCheapWin, isExpensiveMistake: false })}
                          >
                            <Star className="size-3 inline me-1" />
                            {t("submitTrip.cheapWin")}
                          </button>
                          <button
                            type="button"
                            className={`flex-1 p-2 rounded-lg border text-xs font-medium transition-colors ${
                              block.isExpensiveMistake
                                ? "border-red-500 bg-red-50 text-red-700"
                                : "border-input hover:bg-secondary"
                            }`}
                            onClick={() => updateTimeBlock(block.id, { isExpensiveMistake: !block.isExpensiveMistake, isCheapWin: false })}
                          >
                            <AlertTriangle className="size-3 inline me-1" />
                            {t("submitTrip.expensiveMistake")}
                          </button>
                        </div>
                      </div>

                      {/* Photos */}
                      <div className="space-y-2">
                        <Label>{t("submitTrip.photos")}</Label>
                        <div className="flex flex-wrap gap-2">
                          {block.photos.map((photo, photoIdx) => (
                            <div key={photoIdx} className="relative size-20 rounded-lg overflow-hidden group">
                              <Image
                                src={photo || "/placeholder.svg"}
                                alt={`Photo ${photoIdx + 1}`}
                                fill
                                sizes="80px"
                                className="object-cover"
                              />
                              <button
                                type="button"
                                className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                                onClick={() => removePhoto(block.id, photoIdx)}
                              >
                                <X className="size-5 text-white" />
                              </button>
                            </div>
                          ))}
                          <label className="size-20 rounded-lg border-2 border-dashed border-input hover:border-forest cursor-pointer flex flex-col items-center justify-center text-muted-foreground hover:text-forest transition-colors">
                            <Camera className="size-5" />
                            <span className="text-xs mt-1">{t("submitTrip.add")}</span>
                            <input
                              type="file"
                              accept="image/*"
                              multiple
                              className="hidden"
                              onChange={(e) => handlePhotoUpload(block.id, e.target.files)}
                            />
                          </label>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>

            {/* Daily Insights */}
            {currentDay.timeBlocks.length > 0 && (
              <Card className="p-6 space-y-4">
                <h3 className="font-semibold flex items-center gap-2">
                  <Lightbulb className="size-5 text-amber-500" />
                  {t("submitTrip.dailyInsights")}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {t("submitTrip.dailyInsightsDesc")}
                </p>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>{t("submitTrip.oneMistake")}</Label>
                    <Input
                      placeholder={t("submitTrip.placeholderMistake")}
                      value={currentDay.mistake || ""}
                      onChange={(e) => updateDayInsights({ mistake: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>{t("submitTrip.oneUsefulTip")}</Label>
                    <Input
                      placeholder={t("submitTrip.placeholderTip")}
                      value={currentDay.tip || ""}
                      onChange={(e) => updateDayInsights({ tip: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>{t("submitTrip.oneUnexpected")}</Label>
                    <Input
                      placeholder={t("submitTrip.placeholderUnexpected")}
                      value={currentDay.unexpected || ""}
                      onChange={(e) => updateDayInsights({ unexpected: e.target.value })}
                    />
                  </div>
                </div>

                {/* Mood & Energy */}
                <div className="grid sm:grid-cols-2 gap-4 pt-4 border-t">
                  <div className="space-y-2">
                    <Label>{t("submitTrip.howDidYouFeel")}</Label>
                    <div className="flex gap-1">
                      {(Object.keys(moodIcons) as Mood[]).map((mood) => {
                        const { icon: Icon, color, label } = moodIcons[mood]
                        return (
                          <button
                            key={mood}
                            type="button"
                            title={label}
                            className={`flex-1 p-2 rounded-lg border transition-colors ${
                              currentDay.mood === mood
                                ? "border-forest bg-forest/10"
                                : "border-input hover:bg-secondary"
                            }`}
                            onClick={() => updateDayInsights({ mood })}
                          >
                            <Icon className={`size-5 mx-auto ${currentDay.mood === mood ? color : "text-muted-foreground"}`} />
                          </button>
                        )
                      })}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>{t("submitTrip.energyLevel")}</Label>
                    <div className="flex gap-1">
                      {(Object.keys(energyIcons) as EnergyLevel[]).map((level) => {
                        const { icon: Icon, color, label } = energyIcons[level]
                        return (
                          <button
                            key={level}
                            type="button"
                            title={label}
                            className={`flex-1 p-2 rounded-lg border transition-colors ${
                              currentDay.energyLevel === level
                                ? "border-forest bg-forest/10"
                                : "border-input hover:bg-secondary"
                            }`}
                            onClick={() => updateDayInsights({ energyLevel: level })}
                          >
                            <Icon className={`size-5 mx-auto ${currentDay.energyLevel === level ? color : "text-muted-foreground"}`} />
                          </button>
                        )
                      })}
                    </div>
                  </div>
                </div>
              </Card>
            )}

            {/* Navigation */}
            <div className="flex justify-between">
              <Button variant="outline" onClick={goToPreviousDay} className="bg-transparent">
                <ArrowLeft className="me-2 size-4" />
                {currentDayIndex === 0 ? t("submitTrip.backToSetup") : t("submitTrip.dayTitle", { number: String(currentDayIndex) })}
              </Button>
              <Button onClick={goToNextDay}>
                {currentDayIndex === days.length - 1 ? t("submitTrip.reviewTrip") : t("submitTrip.dayTitle", { number: String(currentDayIndex + 2) })}
                <ArrowRight className="ms-2 size-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Review & Submit */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold mb-2">{t("submitTrip.reviewYourTrip")}</h2>
              <p className="text-muted-foreground">
                {t("submitTrip.reviewDesc")}
              </p>
            </div>

            {/* Trip Summary */}
            <Card className="p-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <MapPin className="size-5 text-forest" />
                {t("submitTrip.tripOverview")}
              </h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">{t("submitTrip.destinationLabel")}</p>
                  <p className="font-medium">{tripSetup.destination}, {tripSetup.country}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{t("submitTrip.durationLabel")}</p>
                  <p className="font-medium">{t("submitTrip.nDays", { count: String(tripSetup.tripLength) })}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{t("submitTrip.travelStyleReview")}</p>
                  <p className="font-medium capitalize">{tripSetup.travelStyle}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{t("submitTrip.travelersLabel")}</p>
                  <p className="font-medium capitalize">{tripSetup.travelerType}</p>
                </div>
                {tripSetup.totalBudget && (
                  <div>
                    <p className="text-sm text-muted-foreground">{t("submitTrip.budgetLabel")}</p>
                    <p className="font-medium">{t("submitTrip.cadBudget", { amount: String(tripSetup.totalBudget) })}</p>
                  </div>
                )}
              </div>
            </Card>

            {/* Days Summary */}
            <Card className="p-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Calendar className="size-5 text-forest" />
                {t("submitTrip.daysBreakdown")}
              </h3>
              <div className="space-y-3">
                {days.map((day) => {
                  const totalPhotos = day.timeBlocks.reduce((sum, block) => sum + block.photos.length, 0)
                  const totalCost = day.timeBlocks.reduce((sum, block) => sum + (block.cost || 0), 0)
                  
                  return (
                    <div 
                      key={day.id} 
                      className="flex items-center justify-between p-3 rounded-lg bg-secondary/50 cursor-pointer hover:bg-secondary"
                      onClick={() => {
                        setCurrentDayIndex(day.dayNumber - 1)
                        setCurrentStep(2)
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`size-8 rounded-full flex items-center justify-center text-sm font-medium ${
                          day.timeBlocks.length > 0 ? "bg-green-100 text-green-700" : "bg-muted text-muted-foreground"
                        }`}>
                          {day.dayNumber}
                        </div>
                        <div>
                          <p className="font-medium">{t("submitTrip.dayTitle", { number: String(day.dayNumber) })}</p>
                          <p className="text-xs text-muted-foreground">
                            {t("submitTrip.timeBlocksCount", { blocks: String(day.timeBlocks.length), photos: String(totalPhotos) })}
                            {totalCost > 0 && ` · $${totalCost}`}
                          </p>
                        </div>
                      </div>
                      {day.timeBlocks.length > 0 ? (
                        <CheckCircle2 className="size-5 text-green-500" />
                      ) : (
                        <AlertCircle className="size-5 text-muted-foreground" />
                      )}
                    </div>
                  )
                })}
              </div>
            </Card>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
              <Card className="p-4 text-center">
                <Clock className="size-6 text-forest mx-auto mb-2" />
                <p className="text-2xl font-bold">
                  {days.reduce((sum, day) => sum + day.timeBlocks.length, 0)}
                </p>
                <p className="text-xs text-muted-foreground">{t("submitTrip.timeBlocksLabel")}</p>
              </Card>
              <Card className="p-4 text-center">
                <Camera className="size-6 text-forest mx-auto mb-2" />
                <p className="text-2xl font-bold">
                  {days.reduce((sum, day) => sum + day.timeBlocks.reduce((s, b) => s + b.photos.length, 0), 0)}
                </p>
                <p className="text-xs text-muted-foreground">{t("submitTrip.photosLabel")}</p>
              </Card>
              <Card className="p-4 text-center">
                <DollarSign className="size-6 text-forest mx-auto mb-2" />
                <p className="text-2xl font-bold">
                  ${days.reduce((sum, day) => sum + day.timeBlocks.reduce((s, b) => s + (b.cost || 0), 0), 0)}
                </p>
                <p className="text-xs text-muted-foreground">{t("submitTrip.trackedLabel")}</p>
              </Card>
            </div>

            {/* Submission Notice */}
            <Card className="p-4 bg-forest/5 border-forest/20">
              <div className="flex gap-3">
                <Sparkles className="size-5 text-forest shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-forest">{t("submitTrip.whatsNext")}</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {t("submitTrip.whatsNextDesc")}
                  </p>
                </div>
              </div>
            </Card>

            {/* Navigation */}
            <div className="flex justify-between">
              <Button 
                variant="outline" 
                onClick={() => {
                  setCurrentDayIndex(days.length - 1)
                  setCurrentStep(2)
                }}
                className="bg-transparent"
              >
                <ArrowLeft className="me-2 size-4" />
                {t("submitTrip.backToDay", { number: String(days.length) })}
              </Button>
              <Button 
                size="lg"
                onClick={handleSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Upload className="me-2 size-4 animate-pulse" />
                    {t("submitTrip.submitting")}
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="me-2 size-4" />
                    {t("submitTrip.submitTrip")}
                  </>
                )}
              </Button>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

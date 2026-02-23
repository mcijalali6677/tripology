"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { 
  quizQuestions, 
  calculateResults, 
  personalityArchetypes,
  type QuizResult,
  type PersonalityType
} from "@/lib/personality-quiz"
import { ArrowLeft, ArrowRight, Sparkles, RotateCcw, Home, Share2, Check } from "lucide-react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/lib/auth-context"
import type { PersonalityScores } from "@/lib/api-client"
import { useI18n } from "@/lib/i18n/context"

export default function QuizPage() {
  const router = useRouter()
  const { isAuthenticated, savePersonality } = useAuth()
  const { t } = useI18n()
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<number, number>>({})
  const [selectedOption, setSelectedOption] = useState<number | null>(null)
  const [showResults, setShowResults] = useState(false)
  const [results, setResults] = useState<QuizResult | null>(null)
  const [isTransitioning, setIsTransitioning] = useState(false)

  const question = quizQuestions[currentQuestion]
  const progress = ((currentQuestion + 1) / quizQuestions.length) * 100
  const isLastQuestion = currentQuestion === quizQuestions.length - 1

  useEffect(() => {
    // Check if there's a saved answer for current question
    if (answers[question?.id] !== undefined) {
      setSelectedOption(answers[question.id])
    } else {
      setSelectedOption(null)
    }
  }, [currentQuestion, answers, question?.id])

  const handleSelectOption = (optionIndex: number) => {
    setSelectedOption(optionIndex)
    setAnswers(prev => ({ ...prev, [question.id]: optionIndex }))
    
    // Auto-advance after short delay
    setTimeout(() => {
      if (!isLastQuestion) {
        handleNext()
      }
    }, 400)
  }

  const handleNext = () => {
    if (selectedOption === null) return
    
    if (isLastQuestion) {
      // Calculate and show results
      const quizResults = calculateResults(answers)
      setResults(quizResults)
      setShowResults(true)

      // Persist personality to backend if authenticated
      if (isAuthenticated) {
        const toLevel = (score: number, max: number): "high" | "medium" | "low" => {
          const pct = score / max
          if (pct >= 0.6) return "high"
          if (pct >= 0.3) return "medium"
          return "low"
        }
        const maxScore = Math.max(...Object.values(quizResults.allScores), 1)
        const scores: PersonalityScores = {
          adventure: toLevel(quizResults.allScores.ActionTripy, maxScore),
          culinary: toLevel(quizResults.allScores.FoodTripy, maxScore),
          budget: toLevel(quizResults.allScores.BookTripy, maxScore),
          relaxation: toLevel(quizResults.allScores.FlowTripy, maxScore),
          cultural: toLevel(quizResults.allScores.CultureTripy, maxScore),
          nature: toLevel(quizResults.allScores.ViewTripy, maxScore),
        }
        savePersonality(scores).catch(console.error)
      }
      
      // Trigger confetti (dynamically imported — only loaded when quiz completes)
      setTimeout(async () => {
        const confetti = (await import("canvas-confetti")).default
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        })
      }, 300)
    } else {
      setIsTransitioning(true)
      setTimeout(() => {
        setCurrentQuestion(prev => prev + 1)
        setIsTransitioning(false)
      }, 200)
    }
  }

  const handleBack = () => {
    if (currentQuestion > 0) {
      setIsTransitioning(true)
      setTimeout(() => {
        setCurrentQuestion(prev => prev - 1)
        setIsTransitioning(false)
      }, 200)
    }
  }

  const handleRestart = () => {
    setCurrentQuestion(0)
    setAnswers({})
    setSelectedOption(null)
    setShowResults(false)
    setResults(null)
  }

  if (showResults && results) {
    const primaryArchetype = personalityArchetypes[results.primary]
    const secondaryArchetype = personalityArchetypes[results.secondary]

    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-background pb-24">
        {/* Header */}
        <header className="sticky top-0 z-50 border-b bg-card/80 backdrop-blur">
          <div className="container mx-auto px-4 h-16 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <div className="size-8 rounded-full bg-forest flex items-center justify-center">
                <span className="text-white font-bold text-sm">T</span>
              </div>
              <span className="font-serif text-xl font-semibold">Tripology</span>
            </Link>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8 sm:py-12">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="max-w-2xl mx-auto"
          >
            {/* Results Header */}
            <div className="text-center mb-8">
              <Badge className="mb-4 bg-forest/10 text-forest border-forest/20">
                <Sparkles className="size-3 me-1" />
                {t("quiz.yourTravelPersonality")}
              </Badge>
              <h1 className="font-serif text-3xl sm:text-4xl font-bold mb-2">
                {t("quiz.youreA")}{" "}
                <span className={`bg-gradient-to-r ${primaryArchetype.color} bg-clip-text text-transparent`}>
                  {primaryArchetype.name}
                </span>
              </h1>
              <p className="text-muted-foreground">{primaryArchetype.description}</p>
            </div>

            {/* Primary Result Card */}
            <Card className="mb-6 overflow-hidden">
              <div className={`h-2 bg-gradient-to-r ${primaryArchetype.color}`} />
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="text-5xl">{primaryArchetype.emoji}</div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h2 className="text-2xl font-bold">{primaryArchetype.name}</h2>
                      <Badge variant="secondary" className="text-lg font-bold">
                        {results.primaryPercentage}%
                      </Badge>
                    </div>
                    <p className="text-muted-foreground mb-4">{primaryArchetype.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {primaryArchetype.traits.map((trait, i) => (
                        <Badge key={i} variant="outline" className="bg-transparent">
                          {trait}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Secondary Result */}
            <Card className="mb-8">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="text-3xl">{secondaryArchetype.emoji}</div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="font-medium">
                        Also <span className="font-bold">{secondaryArchetype.name}</span>
                      </p>
                      <Badge variant="secondary">{results.secondaryPercentage}%</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{secondaryArchetype.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* All Scores */}
            <Card className="mb-8">
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4">{t("quiz.fullTravelProfile")}</h3>
                <div className="space-y-3">
                  {Object.entries(results.allScores)
                    .sort(([, a], [, b]) => b - a)
                    .map(([type, score]) => {
                      const archetype = personalityArchetypes[type as PersonalityType]
                      const total = Object.values(results.allScores).reduce((a, b) => a + b, 0)
                      const percentage = Math.round((score / total) * 100)
                      return (
                        <div key={type} className="flex items-center gap-3">
                          <span className="text-xl w-8">{archetype.emoji}</span>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-sm font-medium">{archetype.name}</span>
                              <span className="text-sm text-muted-foreground">{percentage}%</span>
                            </div>
                            <div className="h-2 bg-muted rounded-full overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${percentage}%` }}
                                transition={{ duration: 0.8, delay: 0.2 }}
                                className={`h-full bg-gradient-to-r ${archetype.color}`}
                              />
                            </div>
                          </div>
                        </div>
                      )
                    })}
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button asChild className="flex-1 bg-forest hover:bg-forest/90">
                <Link href="/">
                  <Sparkles className="size-4 me-2" />
                  {t("quiz.findMatchingTrips")}
                </Link>
              </Button>
              <Button variant="outline" className="flex-1 bg-transparent" onClick={handleRestart}>
                <RotateCcw className="size-4 me-2" />
                {t("quiz.retakeQuiz")}
              </Button>
              <Button 
                variant="outline" 
                size="icon" 
                className="bg-transparent"
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({ title: "My Travel Personality", url: window.location.href })
                  } else {
                    navigator.clipboard.writeText(window.location.href)
                  }
                }}
              >
                <Share2 className="size-4" />
              </Button>
            </div>
          </motion.div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-background flex flex-col pb-24">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-card/80 backdrop-blur">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="size-8 rounded-full bg-forest flex items-center justify-center">
              <span className="text-white font-bold text-sm">T</span>
            </div>
            <span className="font-serif text-xl font-semibold">Tripology</span>
          </Link>
          <Button variant="ghost" size="sm" asChild className="text-muted-foreground">
            <Link href="/">
              <Home className="size-4 me-2" />
              {t("quiz.exit")}
            </Link>
          </Button>
        </div>
      </header>

      {/* Progress */}
      <div className="container mx-auto px-4 pt-6">
        <div className="max-w-xl mx-auto">
          <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
            <span>{t("quiz.question")} {currentQuestion + 1} {t("quiz.of")} {quizQuestions.length}</span>
            <span>{Math.round(progress)}% {t("quiz.complete")}</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </div>

      {/* Question */}
      <main className="flex-1 container mx-auto px-4 py-8 flex items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="w-full max-w-xl"
          >
            {/* Question Header */}
            <div className="text-center mb-8">
              <Badge variant="secondary" className="mb-4">
                {question.title}
              </Badge>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-balance">
                {question.scenario}
              </h2>
            </div>

            {/* Options */}
            <div className="space-y-3">
              {question.options.map((option, index) => {
                const isSelected = selectedOption === index
                return (
                  <motion.button
                    key={index}
                    type="button"
                    onClick={() => handleSelectOption(index)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`w-full p-4 rounded-xl border-2 text-start transition-all flex items-center gap-4 ${
                      isSelected
                        ? "border-forest bg-forest/5 shadow-md"
                        : "border-border bg-card hover:border-forest/50 hover:bg-muted/50"
                    }`}
                  >
                    <span className="text-3xl">{option.emoji}</span>
                    <span className="flex-1 font-medium">{option.text}</span>
                    {isSelected && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="size-6 rounded-full bg-forest flex items-center justify-center"
                      >
                        <Check className="size-4 text-white" />
                      </motion.div>
                    )}
                  </motion.button>
                )
              })}
            </div>
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Navigation */}
      <footer className="border-t bg-card/80 backdrop-blur">
        <div className="container mx-auto px-4 py-4">
          <div className="max-w-xl mx-auto flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={handleBack}
              disabled={currentQuestion === 0}
              className="gap-2"
            >
              <ArrowLeft className="size-4" />
              {t("quiz.back")}
            </Button>
            
            {isLastQuestion && selectedOption !== null && (
              <Button onClick={handleNext} className="gap-2 bg-forest hover:bg-forest/90">
                {t("quiz.seeMyResults")}
                <Sparkles className="size-4" />
              </Button>
            )}
          </div>
        </div>
      </footer>
    </div>
  )
}

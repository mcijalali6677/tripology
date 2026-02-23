"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  ArrowLeft, CreditCard, Lock, Shield, Check, Sparkles,
  MapPin, Calendar, Star, Download, MessageSquare,
  ChevronRight, Users, Mail, User, Phone, Globe,
  Loader2, CheckCircle2, PartyPopper, DollarSign
} from "lucide-react"
import { cn, formatPrice, cadToToman } from "@/lib/utils"
import type { Itinerary } from "@/lib/types"
import { useI18n } from "@/lib/i18n/context"

type CheckoutStep = "review" | "details" | "payment" | "confirmation"

export default function CheckoutPage() {
  const { t, locale } = useI18n()
  const isFa = locale === "fa"
  const searchParams = useSearchParams()
  const router = useRouter()
  const planId = searchParams.get("plan") || ""
  const tier = searchParams.get("tier") || "explorer"

  const [step, setStep] = useState<CheckoutStep>("review")
  const [itinerary, setItinerary] = useState<Itinerary | null>(null)
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState(false)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    country: "",
  })

  // Pricing tiers
  const tiers: Record<string, { name: string; price: number; features: string[] }> = {
    explorer: {
      name: "Explorer",
      price: 0,
      features: ["Basic itinerary view", "5 AI questions/day", "Community tips"],
    },
    voyager: {
      name: "Voyager",
      price: 9.99,
      features: ["Full day-by-day itinerary", "Interactive map", "Packing checklist", "Unlimited AI questions", "PDF download", "Email support"],
    },
    navigator: {
      name: "Navigator",
      price: 24.99,
      features: ["Everything in Voyager", "Real-time AI companion", "Activity swap AI", "Booking assistance", "Priority support", "Offline access"],
    },
  }

  const selectedTier = tiers[tier] || tiers.voyager

  useEffect(() => {
    async function loadPlan() {
      if (!planId) { setLoading(false); return }
      try {
        const res = await fetch("/api/itineraries")
        const data = await res.json()
        const found = data.find((it: Itinerary) => it.id === planId)
        if (found) setItinerary(found)
      } catch { /* fallback */ }
      finally { setLoading(false) }
    }
    loadPlan()
  }, [planId])

  const handleSubmit = async () => {
    setProcessing(true)
    // Simulate payment processing
    await new Promise(r => setTimeout(r, 2500))
    setStep("confirmation")
    setProcessing(false)
  }

  const steps: { id: CheckoutStep; label: string }[] = [
    { id: "review", label: t("checkout.stepReview") },
    { id: "details", label: t("checkout.stepDetails") },
    { id: "payment", label: t("checkout.stepPayment") },
    { id: "confirmation", label: t("checkout.stepDone") },
  ]

  const currentStepIndex = steps.findIndex(s => s.id === step)

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container max-w-3xl mx-auto px-4 py-16 text-center">
          <Loader2 className="size-8 animate-spin text-forest mx-auto" />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container max-w-3xl mx-auto px-4 py-6">
        {/* Back */}
        {step !== "confirmation" && (
          <Button variant="ghost" size="sm" className="mb-4 -ms-2" onClick={() => {
            if (step === "review") router.back()
            else setStep(steps[currentStepIndex - 1].id)
          }}>
            <ArrowLeft className="size-4 me-1.5" />{t("checkout.back")}
          </Button>
        )}

        {/* Progress Steps */}
        {step !== "confirmation" && (
          <div className="flex items-center gap-2 mb-8">
            {steps.slice(0, -1).map((s, i) => (
              <div key={s.id} className="flex items-center gap-2 flex-1">
                <div className={cn(
                  "size-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors shrink-0",
                  i < currentStepIndex ? "bg-forest text-white" :
                  i === currentStepIndex ? "bg-forest text-white ring-4 ring-forest/20" :
                  "bg-secondary text-muted-foreground"
                )}>
                  {i < currentStepIndex ? <Check className="size-4" /> : i + 1}
                </div>
                <span className={cn("text-xs font-medium hidden sm:block", i <= currentStepIndex ? "text-forest" : "text-muted-foreground")}>{s.label}</span>
                {i < steps.length - 2 && <div className={cn("h-0.5 flex-1 rounded-full", i < currentStepIndex ? "bg-forest" : "bg-secondary")} />}
              </div>
            ))}
          </div>
        )}

        {/* ─── STEP: Review ─── */}
        <AnimatePresence mode="wait">
          {step === "review" && (
            <motion.div key="review" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <h1 className="font-serif text-2xl font-bold mb-6">{t("checkout.reviewOrder")}</h1>

              {/* Plan Summary */}
              {itinerary && (
                <Card className="p-4 mb-4">
                  <div className="flex gap-4">
                    <div className="relative size-20 rounded-xl overflow-hidden shrink-0">
                      <Image src={itinerary.coverImage || "/placeholder.svg"} alt={itinerary.title} fill className="object-cover" sizes="80px" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold truncate">{itinerary.title}</h3>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                        <span className="flex items-center gap-0.5"><MapPin className="size-3" />{itinerary.destination}</span>
                        <span>•</span>
                        <span className="flex items-center gap-0.5"><Calendar className="size-3" />{itinerary.duration} days</span>
                        <span>•</span>
                        <span className="flex items-center gap-0.5"><Star className="size-3 fill-amber-400 text-amber-400" />{itinerary.rating}</span>
                      </div>
                    </div>
                  </div>
                </Card>
              )}

              {/* Selected Tier */}
              <Card className="p-5 mb-4 border-forest/20 bg-forest/5">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <Badge className="bg-forest text-white mb-1">{selectedTier.name} Plan</Badge>
                    <p className="text-2xl font-bold">{selectedTier.price === 0 ? (isFa ? "رایگان" : "Free") : isFa ? formatPrice(cadToToman(selectedTier.price), locale) + "/ماه" : `$${selectedTier.price}/mo`}</p>
                  </div>
                  <Sparkles className="size-8 text-forest" />
                </div>
                <div className="space-y-1.5">
                  {selectedTier.features.map((f, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm">
                      <Check className="size-3.5 text-forest shrink-0" />{f}
                    </div>
                  ))}
                </div>
              </Card>

              {/* Order Total */}
              <Card className="p-4 mb-6">
                <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-muted-foreground">{selectedTier.name} {t("checkout.planMonthly")}</span>
                  <span>{isFa ? formatPrice(cadToToman(selectedTier.price), locale) : `$${selectedTier.price.toFixed(2)}`}</span>
                </div>
                {itinerary && itinerary.price && itinerary.price > 0 && (
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-muted-foreground">Trip plan: {itinerary.title}</span>
                    <span>{isFa ? formatPrice(cadToToman(itinerary.price), locale) : `$${itinerary.price.toFixed(2)}`}</span>
                  </div>
                )}
                <div className="border-t pt-2 flex items-center justify-between font-bold">
                  <span>{t("checkout.total")}</span>
                  <span className="text-forest text-lg">
                    {isFa ? formatPrice(cadToToman((itinerary?.price || 0) + selectedTier.price), locale) : `$${((itinerary?.price || 0) + selectedTier.price).toFixed(2)}`}
                  </span>
                </div>
              </Card>

              <Button onClick={() => setStep("details")} className="w-full bg-forest hover:bg-forest/90 rounded-xl h-12">
                {t("checkout.continueDetails")} <ChevronRight className="size-4 ms-1" />
              </Button>
            </motion.div>
          )}

          {/* ─── STEP: Details ─── */}
          {step === "details" && (
            <motion.div key="details" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <h1 className="font-serif text-2xl font-bold mb-6">{t("checkout.yourDetails")}</h1>

              <Card className="p-5 mb-6">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-xs mb-1.5 block">{t("checkout.firstName")}</Label>
                    <div className="relative">
                      <User className="absolute start-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                      <Input
                        placeholder="John"
                        className="ps-10"
                        value={formData.firstName}
                        onChange={e => setFormData(p => ({ ...p, firstName: e.target.value }))}
                      />
                    </div>
                  </div>
                  <div>
                    <Label className="text-xs mb-1.5 block">{t("checkout.lastName")}</Label>
                    <div className="relative">
                      <User className="absolute start-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                      <Input
                        placeholder="Doe"
                        className="ps-10"
                        value={formData.lastName}
                        onChange={e => setFormData(p => ({ ...p, lastName: e.target.value }))}
                      />
                    </div>
                  </div>
                  <div className="sm:col-span-2">
                    <Label className="text-xs mb-1.5 block">{t("checkout.email")}</Label>
                    <div className="relative">
                      <Mail className="absolute start-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                      <Input
                        type="email"
                        placeholder="john@example.com"
                        className="ps-10"
                        value={formData.email}
                        onChange={e => setFormData(p => ({ ...p, email: e.target.value }))}
                      />
                    </div>
                  </div>
                  <div>
                    <Label className="text-xs mb-1.5 block">{t("checkout.phone")}</Label>
                    <div className="relative">
                      <Phone className="absolute start-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                      <Input
                        placeholder="+1 (555) 000-0000"
                        className="ps-10"
                        value={formData.phone}
                        onChange={e => setFormData(p => ({ ...p, phone: e.target.value }))}
                      />
                    </div>
                  </div>
                  <div>
                    <Label className="text-xs mb-1.5 block">{t("checkout.country")}</Label>
                    <div className="relative">
                      <Globe className="absolute start-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                      <Input
                        placeholder="United States"
                        className="ps-10"
                        value={formData.country}
                        onChange={e => setFormData(p => ({ ...p, country: e.target.value }))}
                      />
                    </div>
                  </div>
                </div>
              </Card>

              <Button
                onClick={() => setStep("payment")}
                disabled={!formData.firstName || !formData.lastName || !formData.email}
                className="w-full bg-forest hover:bg-forest/90 rounded-xl h-12"
              >
                {t("checkout.continuePayment")} <ChevronRight className="size-4 ms-1" />
              </Button>
            </motion.div>
          )}

          {/* ─── STEP: Payment ─── */}
          {step === "payment" && (
            <motion.div key="payment" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <h1 className="font-serif text-2xl font-bold mb-6">{t("checkout.payment")}</h1>

              <Card className="p-5 mb-4">
                <div className="flex items-center gap-2 mb-4">
                  <CreditCard className="size-5 text-forest" />
                  <h3 className="font-semibold">{t("checkout.cardDetails")}</h3>
                  <Badge variant="secondary" className="ms-auto text-[10px]">
                    <Lock className="size-2.5 me-1" />{t("checkout.secure")}
                  </Badge>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label className="text-xs mb-1.5 block">{t("checkout.cardNumber")}</Label>
                    <Input placeholder="4242 4242 4242 4242" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-xs mb-1.5 block">{t("checkout.expiry")}</Label>
                      <Input placeholder="MM / YY" />
                    </div>
                    <div>
                      <Label className="text-xs mb-1.5 block">CVC</Label>
                      <Input placeholder="123" />
                    </div>
                  </div>
                  <div>
                    <Label className="text-xs mb-1.5 block">{t("checkout.nameOnCard")}</Label>
                    <Input placeholder="John Doe" defaultValue={`${formData.firstName} ${formData.lastName}`} />
                  </div>
                </div>
              </Card>

              {/* Trust Badges */}
              <div className="flex items-center justify-center gap-4 mb-6 text-xs text-muted-foreground">
                <span className="flex items-center gap-1"><Shield className="size-3 text-forest" /> {t("checkout.sslEncrypted")}</span>
                <span className="flex items-center gap-1"><Lock className="size-3 text-forest" /> {t("checkout.pciCompliant")}</span>
                <span className="flex items-center gap-1"><CheckCircle2 className="size-3 text-forest" /> {t("checkout.moneyBack")}</span>
              </div>

              {/* Total */}
              <Card className="p-4 mb-6 bg-forest/5 border-forest/20">
                <div className="flex items-center justify-between font-bold">
                  <span>{t("checkout.totalCharge")}</span>
                  <span className="text-forest text-xl">{isFa ? formatPrice(cadToToman((itinerary?.price || 0) + selectedTier.price), locale) : `$${((itinerary?.price || 0) + selectedTier.price).toFixed(2)}`}</span>
                </div>
                <p className="text-[11px] text-muted-foreground mt-1">
                  {selectedTier.price > 0 ? t("checkout.billedMonthly") : t("checkout.oneTime")}
                </p>
              </Card>

              <Button
                onClick={handleSubmit}
                disabled={processing}
                className="w-full bg-forest hover:bg-forest/90 rounded-xl h-12"
              >
                {processing ? (
                  <><Loader2 className="size-4 animate-spin me-2" />{t("checkout.processing")}</>
                ) : (
                  <><Lock className="size-4 me-2" />Pay ${((itinerary?.price || 0) + selectedTier.price).toFixed(2)}</>
                )}
              </Button>
            </motion.div>
          )}

          {/* ─── STEP: Confirmation ─── */}
          {step === "confirmation" && (
            <motion.div key="confirm" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
              <div className="text-center py-8">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", damping: 10, stiffness: 150 }}
                  className="size-20 rounded-full bg-forest/10 flex items-center justify-center mx-auto mb-6"
                >
                  <PartyPopper className="size-10 text-forest" />
                </motion.div>

                <h1 className="font-serif text-3xl font-bold mb-2">{t("checkout.allSet")}</h1>
                <p className="text-muted-foreground mb-8 max-w-sm mx-auto">
                  {t("checkout.confirmDesc")}
                </p>

                {/* What You Got */}
                <Card className="p-5 mb-6 text-start max-w-md mx-auto">
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <Sparkles className="size-4 text-forest" /> {t("checkout.whatsIncluded")}
                  </h3>
                  <div className="space-y-2">
                    {selectedTier.features.map((f, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm">
                        <CheckCircle2 className="size-3.5 text-forest shrink-0" />{f}
                      </div>
                    ))}
                  </div>
                </Card>

                {/* Receipt */}
                <Card className="p-4 mb-6 text-start max-w-md mx-auto bg-secondary/30">
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-muted-foreground">{t("checkout.orderNum")}</span>
                    <span className="font-mono text-xs">TRP-{Date.now().toString(36).toUpperCase()}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-muted-foreground">Email</span>
                    <span>{formData.email || "user@example.com"}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm font-bold pt-2 border-t mt-2">
                    <span>{t("checkout.totalPaid")}</span>
                    <span className="text-forest">${((itinerary?.price || 0) + selectedTier.price).toFixed(2)}</span>
                  </div>
                </Card>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto">
                  {itinerary ? (
                    <Button className="w-full bg-forest hover:bg-forest/90 rounded-xl" asChild>
                      <Link href={`/itinerary/${itinerary.id}`}>{t("checkout.viewTrip")}</Link>
                    </Button>
                  ) : (
                    <Button className="w-full bg-forest hover:bg-forest/90 rounded-xl" asChild>
                      <Link href="/explore">{t("checkout.startExploring")}</Link>
                    </Button>
                  )}
                  <Button variant="outline" className="w-full bg-transparent rounded-xl" asChild>
                    <Link href="/trip-companion">
                      <MessageSquare className="size-4 me-1.5" />{t("checkout.openAI")}
                    </Link>
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

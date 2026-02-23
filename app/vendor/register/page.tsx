"use client"

import { useState } from "react"
import Link from "next/link"
import { useI18n } from "@/lib/i18n/context"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import {
  Building2, Plane, Bus, Car, Hotel, Utensils, Home, Shield,
  Map, FileText, Phone, Globe, MapPin, User, CheckCircle,
  ChevronLeft, ChevronRight, ArrowLeft, BadgeCheck, Loader2,
  Briefcase, CreditCard, ClipboardCheck, Sparkles, Store,
  HeartHandshake, Umbrella, Eye, Star, TrendingUp, Users,
  Clock, Award, Percent,
} from "lucide-react"

const VENDOR_TYPES = [
  { id: "hotel", icon: Hotel, color: "bg-blue-50 text-blue-600 border-blue-200", activeColor: "bg-blue-600 text-white border-blue-600" },
  { id: "airline", icon: Plane, color: "bg-sky-50 text-sky-600 border-sky-200", activeColor: "bg-sky-600 text-white border-sky-600" },
  { id: "tour_agency", icon: Map, color: "bg-emerald-50 text-emerald-600 border-emerald-200", activeColor: "bg-emerald-600 text-white border-emerald-600" },
  { id: "car_rental", icon: Car, color: "bg-orange-50 text-orange-600 border-orange-200", activeColor: "bg-orange-600 text-white border-orange-600" },
  { id: "restaurant", icon: Utensils, color: "bg-red-50 text-red-600 border-red-200", activeColor: "bg-red-600 text-white border-red-600" },
  { id: "homestay", icon: Home, color: "bg-pink-50 text-pink-600 border-pink-200", activeColor: "bg-pink-600 text-white border-pink-600" },
  { id: "travel_insurance", icon: Umbrella, color: "bg-violet-50 text-violet-600 border-violet-200", activeColor: "bg-violet-600 text-white border-violet-600" },
  { id: "visa_service", icon: FileText, color: "bg-amber-50 text-amber-600 border-amber-200", activeColor: "bg-amber-600 text-white border-amber-600" },
  { id: "local_guide", icon: Users, color: "bg-teal-50 text-teal-600 border-teal-200", activeColor: "bg-teal-600 text-white border-teal-600" },
  { id: "transport", icon: Bus, color: "bg-indigo-50 text-indigo-600 border-indigo-200", activeColor: "bg-indigo-600 text-white border-indigo-600" },
]

const BENEFITS = [
  { icon: TrendingUp, key: "reachMillions" },
  { icon: CreditCard, key: "securePayments" },
  { icon: Sparkles, key: "aiRecommendations" },
  { icon: Award, key: "verifiedBadge" },
]

const STEPS = [
  { icon: Store, key: "businessType" },
  { icon: Building2, key: "businessInfo" },
  { icon: FileText, key: "documents" },
  { icon: CheckCircle, key: "review" },
]

export default function VendorRegisterPage() {
  const { t, locale } = useI18n()
  const { isAuthenticated } = useAuth()
  const isFa = locale === "fa"

  const [step, setStep] = useState(0)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  // Form state
  const [vendorType, setVendorType] = useState("")
  const [businessName, setBusinessName] = useState("")
  const [businessNameFa, setBusinessNameFa] = useState("")
  const [description, setDescription] = useState("")
  const [descriptionFa, setDescriptionFa] = useState("")
  const [phone, setPhone] = useState("")
  const [website, setWebsite] = useState("")
  const [address, setAddress] = useState("")
  const [city, setCity] = useState("")
  const [province, setProvince] = useState("")
  const [licenseNumber, setLicenseNumber] = useState("")
  const [nationalId, setNationalId] = useState("")
  const [taxId, setTaxId] = useState("")

  const canProceedStep0 = vendorType !== ""
  const canProceedStep1 = businessName.length >= 2 && phone.length >= 8
  const canProceedStep2 = true // Documents are optional at registration, admin can request later

  const handleSubmit = async () => {
    if (!isAuthenticated) return
    setSubmitting(true)
    try {
      const API = process.env.NEXT_PUBLIC_API_URL || ""
      const token = localStorage.getItem("access_token")
      const res = await fetch(`${API}/api/v1/vendors/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          business_name: businessName,
          business_name_fa: businessNameFa || null,
          vendor_type: vendorType,
          description: description || null,
          description_fa: descriptionFa || null,
          phone,
          website: website || null,
          address: address || null,
          city: city || null,
          province: province || null,
          license_number: licenseNumber || null,
          national_id: nationalId || null,
          tax_id: taxId || null,
        }),
      })
      if (res.ok) {
        setSubmitted(true)
      } else {
        const err = await res.json().catch(() => ({}))
        alert(err.detail || "Registration failed. Please try again.")
      }
    } catch {
      alert("Network error. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  // ===== SUCCESS STATE =====
  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-forest/5 to-background flex items-center justify-center px-4 py-20">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center max-w-md"
        >
          <div className="size-20 rounded-full bg-forest/10 flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="size-10 text-forest" />
          </div>
          <h1 className="font-serif text-2xl font-bold mb-3">{t("vendor.successTitle")}</h1>
          <p className="text-muted-foreground mb-6">{t("vendor.successDesc")}</p>
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
            <div className="flex items-start gap-3">
              <Clock className="size-5 text-amber-600 shrink-0 mt-0.5" />
              <div className="text-start">
                <p className="font-medium text-amber-800 text-sm">{t("vendor.reviewTime")}</p>
                <p className="text-xs text-amber-600 mt-0.5">{t("vendor.reviewTimeDesc")}</p>
              </div>
            </div>
          </div>
          <Link href="/">
            <Button className="bg-forest hover:bg-forest/90">{t("vendor.backToHome")}</Button>
          </Link>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-forest/5 to-background">
      {/* Header */}
      <div className="border-b bg-card/80 backdrop-blur sticky top-0 z-40">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="size-4" />
            <span className="text-sm">{t("vendor.backToHome")}</span>
          </Link>
          <div className="flex items-center gap-2">
            <div className="size-7 rounded-full bg-forest flex items-center justify-center">
              <span className="text-white font-bold text-xs">T</span>
            </div>
            <span className="font-serif font-semibold text-sm">{t("common.appName")}</span>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      {step === 0 && !vendorType && (
        <div className="container mx-auto px-4 py-10 lg:py-16 text-center">
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
            <div className="inline-flex items-center gap-2 bg-forest/10 text-forest rounded-full px-4 py-1.5 text-sm font-medium mb-6">
              <HeartHandshake className="size-4" />
              {t("vendor.heroTag")}
            </div>
            <h1 className="font-serif text-3xl lg:text-4xl font-bold mb-4">{t("vendor.heroTitle")}</h1>
            <p className="text-muted-foreground max-w-xl mx-auto mb-10 text-base lg:text-lg">{t("vendor.heroDesc")}</p>

            {/* Benefits */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-3xl mx-auto mb-12">
              {BENEFITS.map(({ icon: Icon, key }) => (
                <div key={key} className="bg-card rounded-xl border p-4 text-center">
                  <Icon className="size-6 text-forest mx-auto mb-2" />
                  <p className="text-sm font-medium">{t(`vendor.benefits.${key}`)}</p>
                </div>
              ))}
            </div>

            {/* Stats */}
            <div className="flex items-center justify-center gap-8 lg:gap-12 text-center mb-10">
              <div>
                <p className="text-2xl lg:text-3xl font-bold text-forest">{isFa ? "۵۰۰+" : "500+"}</p>
                <p className="text-xs text-muted-foreground">{t("vendor.stats.vendors")}</p>
              </div>
              <div className="h-8 w-px bg-border" />
              <div>
                <p className="text-2xl lg:text-3xl font-bold text-forest">{isFa ? "۱۰K+" : "10K+"}</p>
                <p className="text-xs text-muted-foreground">{t("vendor.stats.travelers")}</p>
              </div>
              <div className="h-8 w-px bg-border" />
              <div>
                <p className="text-2xl lg:text-3xl font-bold text-forest">{isFa ? "۹۸٪" : "98%"}</p>
                <p className="text-xs text-muted-foreground">{t("vendor.stats.satisfaction")}</p>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Step Indicator */}
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="flex items-center justify-between mb-8 lg:mb-10">
          {STEPS.map((s, i) => {
            const Icon = s.icon
            const isActive = step === i
            const isDone = step > i
            return (
              <div key={s.key} className="flex items-center gap-3 flex-1">
                <div className={cn(
                  "flex items-center gap-2 shrink-0",
                )}>
                  <div className={cn(
                    "size-9 rounded-full flex items-center justify-center border-2 transition-colors",
                    isDone ? "bg-forest border-forest text-white" :
                    isActive ? "border-forest text-forest bg-forest/10" :
                    "border-muted-foreground/30 text-muted-foreground"
                  )}>
                    {isDone ? <CheckCircle className="size-5" /> : <Icon className="size-4" />}
                  </div>
                  <span className={cn(
                    "text-xs font-medium hidden sm:block",
                    isActive ? "text-forest" : isDone ? "text-foreground" : "text-muted-foreground"
                  )}>
                    {t(`vendor.steps.${s.key}`)}
                  </span>
                </div>
                {i < STEPS.length - 1 && (
                  <div className={cn(
                    "flex-1 h-0.5 rounded-full",
                    isDone ? "bg-forest" : "bg-muted-foreground/20"
                  )} />
                )}
              </div>
            )
          })}
        </div>

        {/* Step Content */}
        <AnimatePresence mode="wait">
          {/* STEP 0: Business Type */}
          {step === 0 && (
            <motion.div
              key="step0"
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -50, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <div className="bg-card rounded-2xl border shadow-sm p-6 lg:p-8 mb-6">
                <h2 className="font-serif text-xl font-bold mb-2">{t("vendor.step0Title")}</h2>
                <p className="text-sm text-muted-foreground mb-6">{t("vendor.step0Desc")}</p>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                  {VENDOR_TYPES.map(({ id, icon: Icon, color, activeColor }) => {
                    const isSelected = vendorType === id
                    return (
                      <button
                        key={id}
                        onClick={() => setVendorType(id)}
                        className={cn(
                          "rounded-xl border-2 p-4 flex flex-col items-center gap-2.5 text-center transition-all hover:shadow-md",
                          isSelected ? activeColor : color
                        )}
                      >
                        <Icon className="size-7" />
                        <span className="text-xs font-semibold leading-tight">{t(`vendor.types.${id}`)}</span>
                      </button>
                    )
                  })}
                </div>

                {/* Commission info */}
                <div className="mt-6 flex items-start gap-3 bg-forest/5 border border-forest/20 rounded-xl p-4">
                  <Percent className="size-5 text-forest shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-forest">{t("vendor.commissionTitle")}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{t("vendor.commissionDesc")}</p>
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <Button
                  disabled={!canProceedStep0}
                  className="bg-forest hover:bg-forest/90 gap-2"
                  onClick={() => setStep(1)}
                >
                  {t("vendor.next")}
                  <ChevronRight className="size-4" />
                </Button>
              </div>
            </motion.div>
          )}

          {/* STEP 1: Business Info */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -50, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <div className="bg-card rounded-2xl border shadow-sm p-6 lg:p-8 mb-6">
                <h2 className="font-serif text-xl font-bold mb-2">{t("vendor.step1Title")}</h2>
                <p className="text-sm text-muted-foreground mb-6">{t("vendor.step1Desc")}</p>

                <div className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label className="text-sm">{t("vendor.businessName")} <span className="text-red-500">*</span></Label>
                      <Input
                        value={businessName}
                        onChange={(e) => setBusinessName(e.target.value)}
                        placeholder={t("vendor.businessNamePlaceholder")}
                        className="h-11"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-sm">{t("vendor.businessNameFa")}</Label>
                      <Input
                        value={businessNameFa}
                        onChange={(e) => setBusinessNameFa(e.target.value)}
                        placeholder={t("vendor.businessNameFaPlaceholder")}
                        className="h-11"
                        dir="rtl"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-sm">{t("vendor.description")}</Label>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder={t("vendor.descriptionPlaceholder")}
                      className="w-full rounded-lg border bg-background px-3 py-2.5 text-sm min-h-[80px] resize-none focus:outline-none focus:ring-2 focus:ring-forest/30"
                    />
                  </div>

                  {isFa && (
                    <div className="space-y-1.5">
                      <Label className="text-sm">{t("vendor.descriptionFa")}</Label>
                      <textarea
                        value={descriptionFa}
                        onChange={(e) => setDescriptionFa(e.target.value)}
                        placeholder={t("vendor.descriptionFaPlaceholder")}
                        className="w-full rounded-lg border bg-background px-3 py-2.5 text-sm min-h-[80px] resize-none focus:outline-none focus:ring-2 focus:ring-forest/30"
                        dir="rtl"
                      />
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label className="text-sm">{t("vendor.phone")} <span className="text-red-500">*</span></Label>
                      <div className="relative">
                        <Phone className="absolute start-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                        <Input
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="09123456789"
                          className="h-11 ps-10"
                          dir="ltr"
                        />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-sm">{t("vendor.website")}</Label>
                      <div className="relative">
                        <Globe className="absolute start-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                        <Input
                          value={website}
                          onChange={(e) => setWebsite(e.target.value)}
                          placeholder="https://example.com"
                          className="h-11 ps-10"
                          dir="ltr"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-sm">{t("vendor.address")}</Label>
                    <div className="relative">
                      <MapPin className="absolute start-3 top-3 size-4 text-muted-foreground" />
                      <Input
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder={t("vendor.addressPlaceholder")}
                        className="h-11 ps-10"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label className="text-sm">{t("vendor.city")}</Label>
                      <Input
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder={t("vendor.cityPlaceholder")}
                        className="h-11"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-sm">{t("vendor.province")}</Label>
                      <Input
                        value={province}
                        onChange={(e) => setProvince(e.target.value)}
                        placeholder={t("vendor.provincePlaceholder")}
                        className="h-11"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setStep(0)} className="gap-2">
                  <ChevronLeft className="size-4" />
                  {t("vendor.previous")}
                </Button>
                <Button
                  disabled={!canProceedStep1}
                  className="bg-forest hover:bg-forest/90 gap-2"
                  onClick={() => setStep(2)}
                >
                  {t("vendor.next")}
                  <ChevronRight className="size-4" />
                </Button>
              </div>
            </motion.div>
          )}

          {/* STEP 2: Documents */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -50, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <div className="bg-card rounded-2xl border shadow-sm p-6 lg:p-8 mb-6">
                <h2 className="font-serif text-xl font-bold mb-2">{t("vendor.step2Title")}</h2>
                <p className="text-sm text-muted-foreground mb-6">{t("vendor.step2Desc")}</p>

                <div className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label className="text-sm">{t("vendor.licenseNumber")}</Label>
                      <div className="relative">
                        <ClipboardCheck className="absolute start-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                        <Input
                          value={licenseNumber}
                          onChange={(e) => setLicenseNumber(e.target.value)}
                          placeholder={t("vendor.licenseNumberPlaceholder")}
                          className="h-11 ps-10"
                          dir="ltr"
                        />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-sm">{t("vendor.nationalId")}</Label>
                      <div className="relative">
                        <User className="absolute start-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                        <Input
                          value={nationalId}
                          onChange={(e) => setNationalId(e.target.value)}
                          placeholder={t("vendor.nationalIdPlaceholder")}
                          className="h-11 ps-10"
                          dir="ltr"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-sm">{t("vendor.taxId")}</Label>
                    <div className="relative">
                      <Briefcase className="absolute start-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                      <Input
                        value={taxId}
                        onChange={(e) => setTaxId(e.target.value)}
                        placeholder={t("vendor.taxIdPlaceholder")}
                        className="h-11 ps-10"
                        dir="ltr"
                      />
                    </div>
                  </div>

                  {/* Required documents info */}
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 space-y-3">
                    <div className="flex items-center gap-2">
                      <FileText className="size-5 text-blue-600" />
                      <p className="font-medium text-blue-800 text-sm">{t("vendor.requiredDocs")}</p>
                    </div>
                    <ul className="space-y-2 text-sm text-blue-700">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="size-4 shrink-0 mt-0.5 text-blue-500" />
                        <span>{t("vendor.doc1")}</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="size-4 shrink-0 mt-0.5 text-blue-500" />
                        <span>{t("vendor.doc2")}</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="size-4 shrink-0 mt-0.5 text-blue-500" />
                        <span>{t("vendor.doc3")}</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="size-4 shrink-0 mt-0.5 text-blue-500" />
                        <span>{t("vendor.doc4")}</span>
                      </li>
                    </ul>
                    <p className="text-xs text-blue-600">{t("vendor.docsNote")}</p>
                  </div>
                </div>
              </div>

              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setStep(1)} className="gap-2">
                  <ChevronLeft className="size-4" />
                  {t("vendor.previous")}
                </Button>
                <Button
                  disabled={!canProceedStep2}
                  className="bg-forest hover:bg-forest/90 gap-2"
                  onClick={() => setStep(3)}
                >
                  {t("vendor.next")}
                  <ChevronRight className="size-4" />
                </Button>
              </div>
            </motion.div>
          )}

          {/* STEP 3: Review & Submit */}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -50, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <div className="bg-card rounded-2xl border shadow-sm p-6 lg:p-8 mb-6">
                <h2 className="font-serif text-xl font-bold mb-2">{t("vendor.step3Title")}</h2>
                <p className="text-sm text-muted-foreground mb-6">{t("vendor.step3Desc")}</p>

                {/* Summary cards */}
                <div className="space-y-4">
                  {/* Business Type */}
                  <div className="bg-secondary/30 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{t("vendor.steps.businessType")}</span>
                      <button onClick={() => setStep(0)} className="text-xs text-forest font-medium hover:underline">{t("vendor.edit")}</button>
                    </div>
                    <div className="flex items-center gap-2">
                      <Store className="size-5 text-forest" />
                      <span className="font-semibold">{t(`vendor.types.${vendorType}`)}</span>
                    </div>
                  </div>

                  {/* Business Info */}
                  <div className="bg-secondary/30 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{t("vendor.steps.businessInfo")}</span>
                      <button onClick={() => setStep(1)} className="text-xs text-forest font-medium hover:underline">{t("vendor.edit")}</button>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div><span className="text-muted-foreground">{t("vendor.businessName")}:</span> <span className="font-medium">{businessName}</span></div>
                      {businessNameFa && <div><span className="text-muted-foreground">{t("vendor.businessNameFa")}:</span> <span className="font-medium">{businessNameFa}</span></div>}
                      <div><span className="text-muted-foreground">{t("vendor.phone")}:</span> <span className="font-medium" dir="ltr">{phone}</span></div>
                      {website && <div><span className="text-muted-foreground">{t("vendor.website")}:</span> <span className="font-medium">{website}</span></div>}
                      {city && <div><span className="text-muted-foreground">{t("vendor.city")}:</span> <span className="font-medium">{city}</span></div>}
                      {province && <div><span className="text-muted-foreground">{t("vendor.province")}:</span> <span className="font-medium">{province}</span></div>}
                    </div>
                  </div>

                  {/* Documents */}
                  <div className="bg-secondary/30 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{t("vendor.steps.documents")}</span>
                      <button onClick={() => setStep(2)} className="text-xs text-forest font-medium hover:underline">{t("vendor.edit")}</button>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      {licenseNumber && <div><span className="text-muted-foreground">{t("vendor.licenseNumber")}:</span> <span className="font-medium" dir="ltr">{licenseNumber}</span></div>}
                      {nationalId && <div><span className="text-muted-foreground">{t("vendor.nationalId")}:</span> <span className="font-medium" dir="ltr">{nationalId}</span></div>}
                      {taxId && <div><span className="text-muted-foreground">{t("vendor.taxId")}:</span> <span className="font-medium" dir="ltr">{taxId}</span></div>}
                      {!licenseNumber && !nationalId && !taxId && (
                        <p className="text-muted-foreground text-xs col-span-2">{t("vendor.noDocsYet")}</p>
                      )}
                    </div>
                  </div>

                  {/* Terms */}
                  <div className="bg-forest/5 border border-forest/20 rounded-xl p-4">
                    <div className="flex items-start gap-3">
                      <Shield className="size-5 text-forest shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-forest">{t("vendor.termsTitle")}</p>
                        <p className="text-xs text-muted-foreground mt-1">{t("vendor.termsDesc")}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setStep(2)} className="gap-2">
                  <ChevronLeft className="size-4" />
                  {t("vendor.previous")}
                </Button>
                {isAuthenticated ? (
                  <Button
                    className="bg-forest hover:bg-forest/90 gap-2"
                    onClick={handleSubmit}
                    disabled={submitting}
                  >
                    {submitting ? <Loader2 className="size-4 animate-spin" /> : <BadgeCheck className="size-4" />}
                    {submitting ? t("vendor.submitting") : t("vendor.submitApplication")}
                  </Button>
                ) : (
                  <Link href="/login">
                    <Button className="bg-forest hover:bg-forest/90 gap-2">
                      <User className="size-4" />
                      {t("vendor.loginToSubmit")}
                    </Button>
                  </Link>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="h-16" />
      </div>
    </div>
  )
}

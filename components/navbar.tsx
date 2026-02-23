"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Search, Menu, User, Heart, Sparkles, Compass, Upload, Navigation, LogOut, Shield } from "lucide-react"
import { useState } from "react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useAuth } from "@/lib/auth-context"
import { useI18n } from "@/lib/i18n/context"
import { LanguageSwitcher } from "@/components/language-switcher"

export function Navbar({ onOpenAIChat }: { onOpenAIChat?: () => void }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { user, isAuthenticated, logout } = useAuth()
  const { t } = useI18n()

  return (
    <nav className="sticky top-0 z-50 border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex h-16 lg:h-16 items-center justify-between">
          <div className="flex items-center gap-8 lg:gap-10">
            <Link href="/" className="flex items-center gap-2">
              <div className="size-8 lg:size-9 rounded-full bg-forest flex items-center justify-center">
                <span className="text-white font-bold text-sm">T</span>
              </div>
              <span className="font-serif text-xl lg:text-xl font-semibold tracking-tight text-foreground">{t("common.appName")}</span>
            </Link>
            <div className="hidden items-center gap-6 lg:gap-7 md:flex">
              <Link
                href="/explore"
                className="text-sm lg:text-[15px] font-medium text-muted-foreground transition-colors hover:text-foreground relative after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-forest after:transition-all hover:after:w-full"
              >
                {t("navbar.explore")}
              </Link>
              <Link
                href="/quiz"
                className="text-sm lg:text-[15px] font-medium text-muted-foreground transition-colors hover:text-foreground flex items-center gap-1.5 relative after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-forest after:transition-all hover:after:w-full"
              >
                <Compass className="size-3.5 lg:size-4" />
                {t("navbar.travelQuiz")}
              </Link>
              <Link
                href="/custom-trip"
                className="text-sm lg:text-[15px] font-medium text-muted-foreground transition-colors hover:text-foreground flex items-center gap-1.5 relative after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-forest after:transition-all hover:after:w-full"
              >
                <Sparkles className="size-3.5 lg:size-4" />
                {t("navbar.buildMyTrip")}
              </Link>
              
              <Link
                href="/submit-trip"
                className="text-sm lg:text-[15px] font-medium text-muted-foreground transition-colors hover:text-foreground flex items-center gap-1.5 relative after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-forest after:transition-all hover:after:w-full"
              >
                <Upload className="size-3.5 lg:size-4" />
                {t("navbar.shareYourTrip")}
              </Link>
            </div>
          </div>

          <div className="flex items-center gap-3 lg:gap-4">
            <Link href="/trip-companion">
              <Button size="sm" variant="outline" className="hidden md:flex bg-transparent border-forest/30 text-forest hover:bg-forest/10 lg:h-9 lg:px-4 lg:text-sm">
                <Navigation className="me-2 size-4" />
                {t("navbar.duringTrip")}
              </Button>
            </Link>
            <Link href="/#itineraries">
              <Button variant="ghost" size="icon" className="hidden md:flex lg:size-10">
                <Search className="size-4 lg:size-[18px]" />
              </Button>
            </Link>
            <Link href="/profile">
              <Button variant="ghost" size="icon" className="hidden md:flex lg:size-10">
                <Heart className="size-4 lg:size-[18px]" />
              </Button>
            </Link>
            <LanguageSwitcher />
            <Link href="/profile">
              <Button variant="ghost" size="icon" className="hidden md:flex lg:size-10">
                <User className="size-4 lg:size-[18px]" />
              </Button>
            </Link>
            {isAuthenticated ? (
              <>
                {user?.role === "admin" && (
                  <Link href="/admin">
                    <Button size="sm" variant="ghost" className="hidden md:flex lg:h-10 lg:text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                      <Shield className="size-4 me-1" />
                      {t("admin.nav.panel")}
                    </Button>
                  </Link>
                )}
                <Button size="sm" variant="ghost" className="hidden md:flex lg:h-10 lg:text-sm" onClick={logout}>
                  <LogOut className="size-4 me-1" />
                  {t("common.signOut")}
                </Button>
              </>
            ) : (
              <Link href="/login">
                <Button size="sm" className="hidden md:flex lg:h-10 lg:px-6 lg:text-sm">
                  {t("common.signIn")}
                </Button>
              </Link>
            )}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="size-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[280px] sm:w-[320px]">
                <div className="flex flex-col gap-6 pt-6">
                  <Link href="/" className="flex items-center gap-2" onClick={() => setMobileMenuOpen(false)}>
                    <div className="size-8 rounded-full bg-forest flex items-center justify-center">
                      <span className="text-white font-bold text-sm">T</span>
                    </div>
                    <span className="font-serif text-xl font-semibold">{t("common.appName")}</span>
                  </Link>
                  <div className="flex flex-col gap-4">
                    <Link href="/explore" className="text-base font-medium" onClick={() => setMobileMenuOpen(false)}>
                      {t("navbar.explore")}
                    </Link>
                    <Link
                      href="/quiz"
                      className="text-base font-medium flex items-center gap-2"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Compass className="size-4" />
                      {t("navbar.travelQuiz")}
                    </Link>
                    <Link
                      href="/custom-trip"
                      className="text-base font-medium flex items-center gap-2"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Sparkles className="size-4" />
                      {t("navbar.buildMyTrip")}
                    </Link>
                    <Link
                      href="/#how-it-works"
                      className="text-base font-medium"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {t("navbar.howItWorks")}
                    </Link>
                    <Link 
                      href="/submit-trip" 
                      className="text-base font-medium flex items-center gap-2" 
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Upload className="size-4" />
                      {t("navbar.shareYourTrip")}
                    </Link>
                    <Link 
                      href="/trip-companion" 
                      className="text-base font-medium flex items-center gap-2" 
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Navigation className="size-4" />
                      {t("navbar.duringTrip")}
                    </Link>
                    <Link 
                      href="/profile" 
                      className="text-base font-medium flex items-center gap-2" 
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <User className="size-4" />
                      {t("navbar.myProfile")}
                    </Link>
                  </div>
                  <div className="flex items-center justify-between">
                    <LanguageSwitcher variant="full" />
                  </div>
                  <div className="flex flex-col gap-3">
                    {isAuthenticated ? (
                      <>
                        {user?.role === "admin" && (
                          <Link href="/admin" onClick={() => setMobileMenuOpen(false)}>
                            <Button variant="outline" className="w-full bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100">
                              <Shield className="size-4 me-2" />
                              {t("admin.nav.panel")}
                            </Button>
                          </Link>
                        )}
                        <Button variant="outline" className="w-full bg-transparent" onClick={() => { logout(); setMobileMenuOpen(false); }}>
                          <LogOut className="size-4 me-2" />
                          {t("common.signOut")}
                        </Button>
                      </>
                    ) : (
                      <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                        <Button variant="outline" className="w-full bg-transparent">
                          {t("common.signIn")}
                        </Button>
                      </Link>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  )
}

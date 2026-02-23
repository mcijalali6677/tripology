"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Loader2, Globe, Sparkles } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { useI18n } from "@/lib/i18n/context"

export default function LoginPage() {
  const router = useRouter()
  const { login, register, isAuthenticated } = useAuth()
  const { t } = useI18n()
  
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  // Login form
  const [loginEmail, setLoginEmail] = useState("")
  const [loginPassword, setLoginPassword] = useState("")
  
  // Register form
  const [regEmail, setRegEmail] = useState("")
  const [regUsername, setRegUsername] = useState("")
  const [regPassword, setRegPassword] = useState("")
  const [regFullName, setRegFullName] = useState("")
  
  // Redirect if already authenticated
  if (isAuthenticated) {
    router.push("/profile")
    return null
  }
  
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    
    try {
      await login(loginEmail, loginPassword)
      router.push("/profile")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed. Please check your credentials.")
    } finally {
      setIsLoading(false)
    }
  }
  
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    
    try {
      await register(regEmail, regUsername, regPassword, regFullName || undefined)
      router.push("/profile")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }
  
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6">
            <ArrowLeft className="size-4" />
            {t("login.backToHome")}
          </Link>
          <div className="flex items-center justify-center gap-2 mb-2">
            <Globe className="size-6 text-forest" />
            <h1 className="text-2xl font-bold">Tripology</h1>
          </div>
          <p className="text-muted-foreground text-sm">
            <Sparkles className="inline size-3.5 me-1" />
            {t("login.tagline")}
          </p>
        </div>
        
        <Card className="p-6">
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="login">{t("login.signIn")}</TabsTrigger>
              <TabsTrigger value="register">{t("login.signUp")}</TabsTrigger>
            </TabsList>
            
            {error && (
              <div className="mb-4 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
                {error}
              </div>
            )}
            
            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-email">{t("login.emailOrUsername")}</Label>
                  <Input
                    id="login-email"
                    type="text"
                    placeholder="you@example.com or username"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="login-password">{t("login.password")}</Label>
                  <Input
                    id="login-password"
                    type="password"
                    placeholder="••••••••"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full bg-forest hover:bg-forest/90" disabled={isLoading}>
                  {isLoading ? <Loader2 className="size-4 me-2 animate-spin" /> : null}
                  {t("login.signIn")}
                </Button>
              </form>
              
              <div className="mt-4 text-center">
                <p className="text-xs text-muted-foreground">
                  Demo: admin@tripology.com / admin123
                </p>
              </div>
            </TabsContent>
            
            <TabsContent value="register">
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="reg-name">{t("login.fullName")}</Label>
                  <Input
                    id="reg-name"
                    type="text"
                    placeholder="Your name"
                    value={regFullName}
                    onChange={(e) => setRegFullName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reg-email">{t("login.email")}</Label>
                  <Input
                    id="reg-email"
                    type="email"
                    placeholder="you@example.com"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reg-username">{t("login.username")}</Label>
                  <Input
                    id="reg-username"
                    type="text"
                    placeholder="Choose a username"
                    value={regUsername}
                    onChange={(e) => setRegUsername(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reg-password">{t("login.password")}</Label>
                  <Input
                    id="reg-password"
                    type="password"
                    placeholder="Min 8 characters"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    required
                    minLength={8}
                  />
                </div>
                <Button type="submit" className="w-full bg-forest hover:bg-forest/90" disabled={isLoading}>
                  {isLoading ? <Loader2 className="size-4 me-2 animate-spin" /> : null}
                  {t("login.createAccount")}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </Card>
        
        <p className="text-center text-xs text-muted-foreground mt-6">
          {t("login.privacyNote")}
        </p>
      </div>
    </div>
  )
}

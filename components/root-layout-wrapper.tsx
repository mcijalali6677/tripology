"use client"

import type React from "react"
import { AuthProvider } from "@/lib/auth-context"
import { I18nProvider } from "@/lib/i18n/context"

export function RootLayoutWrapper({ children }: { children: React.ReactNode }) {
  return (
    <I18nProvider>
      <AuthProvider>
        {children}
      </AuthProvider>
    </I18nProvider>
  )
}

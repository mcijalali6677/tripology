"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Map, Sparkles, Share2, User } from "lucide-react"
import { cn } from "@/lib/utils"
import { useI18n } from "@/lib/i18n/context"

export function BottomNav() {
  const pathname = usePathname()
  const { t } = useI18n()

  const navItems = [
    {
      label: t("bottomNav.home"),
      href: "/",
      icon: Home,
    },
    {
      label: t("bottomNav.buildTrip"),
      href: "/custom-trip",
      icon: Map,
    },
    {
      label: t("bottomNav.travelAI"),
      href: "/trip-companion",
      icon: Sparkles,
      isCenter: true,
    },
    {
      label: t("bottomNav.shareTrip"),
      href: "/submit-trip",
      icon: Share2,
    },
    {
      label: t("bottomNav.profile"),
      href: "/profile",
      icon: User,
    },
  ]

  return (
    <nav className="fixed bottom-0 inset-x-0 z-50 border-t bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80 pb-[env(safe-area-inset-bottom)] md:hidden">
      <div className="flex items-end justify-around px-2 pt-1 pb-2">
        {navItems.map((item) => {
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href)

          if (item.isCenter) {
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex flex-col items-center -mt-5"
              >
                <div
                  className={cn(
                    "flex items-center justify-center size-14 rounded-full shadow-lg transition-all",
                    isActive
                      ? "bg-forest text-primary-foreground scale-105"
                      : "bg-forest/90 text-primary-foreground"
                  )}
                >
                  <item.icon className="size-6" />
                </div>
                <span
                  className={cn(
                    "text-[10px] mt-1 font-medium",
                    isActive ? "text-forest" : "text-muted-foreground"
                  )}
                >
                  {item.label}
                </span>
              </Link>
            )
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex flex-col items-center gap-0.5 py-1 px-2 min-w-[60px]"
            >
              <item.icon
                className={cn(
                  "size-5 transition-colors",
                  isActive ? "text-forest" : "text-muted-foreground"
                )}
              />
              <span
                className={cn(
                  "text-[10px] font-medium transition-colors",
                  isActive ? "text-forest" : "text-muted-foreground"
                )}
              >
                {item.label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}

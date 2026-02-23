"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { useI18n } from "@/lib/i18n/context";
import {
  LayoutDashboard,
  Users,
  Map,
  ShoppingCart,
  Star,
  Settings,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  LogOut,
  Shield,
  Bell,
  Search,
  Home,
} from "lucide-react";

const ADMIN_NAV = [
  { key: "dashboard", href: "/admin", icon: LayoutDashboard },
  { key: "users", href: "/admin/users", icon: Users },
  { key: "trips", href: "/admin/trips", icon: Map },
  { key: "bookings", href: "/admin/bookings", icon: ShoppingCart },
  { key: "reviews", href: "/admin/reviews", icon: Star },
  { key: "settings", href: "/admin/settings", icon: Settings },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading, logout } = useAuth();
  const { t, locale, dir } = useI18n();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isRtl = dir === "rtl";

  // Auth guard — redirect non-admin users
  useEffect(() => {
    if (!isLoading && (!user || user.role !== "admin")) {
      router.push("/login");
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
          <p className="text-sm text-slate-500">{t("common.loading")}</p>
        </div>
      </div>
    );
  }

  if (!user || user.role !== "admin") return null;

  const getNavLabel = (key: string) => t(`admin.nav.${key}`);

  const isActive = (href: string) => {
    if (href === "/admin") return pathname === "/admin";
    return pathname.startsWith(href);
  };

  return (
    <div className="flex h-screen bg-[#f0f4f8] overflow-hidden" dir={dir}>
      {/* Mobile overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed z-50 lg:relative lg:z-auto
          flex flex-col h-full bg-white border-e border-slate-200 shadow-sm
          transition-all duration-300 ease-in-out
          ${sidebarOpen ? "w-64" : "w-20"}
          ${mobileMenuOpen ? "translate-x-0" : isRtl ? "translate-x-full lg:translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        {/* Logo area */}
        <div className="flex items-center justify-between px-4 h-16 border-b border-slate-100">
          {sidebarOpen && (
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-md shadow-blue-200">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-sm font-bold text-slate-800">
                  {t("admin.title")}
                </h1>
                <p className="text-[10px] text-slate-400">{t("admin.subtitle")}</p>
              </div>
            </div>
          )}
          {!sidebarOpen && (
            <div className="mx-auto flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-md shadow-blue-200">
              <Shield className="w-5 h-5 text-white" />
            </div>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="hidden lg:flex items-center justify-center w-7 h-7 rounded-lg
                       hover:bg-slate-100 text-slate-400 transition-colors"
          >
            {isRtl ? (
              sidebarOpen ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />
            ) : (
              sidebarOpen ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          {ADMIN_NAV.map((item) => {
            const active = isActive(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.key}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`
                  group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium
                  transition-all duration-200
                  ${
                    active
                      ? "bg-blue-50 text-blue-700 shadow-sm shadow-blue-100"
                      : "text-slate-500 hover:bg-slate-50 hover:text-slate-700"
                  }
                  ${!sidebarOpen ? "justify-center px-0" : ""}
                `}
                title={!sidebarOpen ? getNavLabel(item.key) : undefined}
              >
                <Icon
                  className={`w-5 h-5 flex-shrink-0 transition-colors ${
                    active ? "text-blue-600" : "text-slate-400 group-hover:text-slate-600"
                  }`}
                />
                {sidebarOpen && <span>{getNavLabel(item.key)}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Bottom: Back to site + user */}
        <div className="border-t border-slate-100 p-3 space-y-2">
          <Link
            href="/"
            className={`flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-slate-500
                       hover:bg-slate-50 hover:text-slate-700 transition-colors
                       ${!sidebarOpen ? "justify-center px-0" : ""}`}
          >
            <Home className="w-5 h-5 flex-shrink-0" />
            {sidebarOpen && <span>{t("admin.backToSite")}</span>}
          </Link>

          {sidebarOpen && (
            <div className="flex items-center gap-3 px-3 py-2 rounded-xl bg-slate-50">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold">
                {user.username?.[0]?.toUpperCase() || "A"}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-slate-700 truncate">
                  {user.full_name || user.username}
                </p>
                <p className="text-[10px] text-slate-400 truncate">{user.email}</p>
              </div>
              <button
                onClick={logout}
                className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-400 hover:text-red-500 transition-colors"
                title={t("common.signOut")}
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top bar */}
        <header className="flex items-center justify-between px-4 lg:px-6 h-16 bg-white border-b border-slate-200 shadow-sm">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 rounded-lg hover:bg-slate-100 text-slate-500"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div>
              <h2 className="text-lg font-bold text-slate-800">
                {getNavLabel(
                  ADMIN_NAV.find((n) => isActive(n.href))?.key || "dashboard"
                )}
              </h2>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 rounded-lg hover:bg-slate-100 text-slate-400 relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
            </button>
            <div className="hidden sm:flex items-center gap-2 ms-2 px-3 py-1.5 bg-green-50 rounded-full">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-xs font-medium text-green-700">{t("admin.systemOnline")}</span>
            </div>
          </div>
        </header>

        {/* Page content */}
        <div className="flex-1 overflow-y-auto p-4 lg:p-6">
          {children}
        </div>
      </main>
    </div>
  );
}

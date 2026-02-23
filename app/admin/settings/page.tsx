"use client";

import { useState } from "react";
import { useI18n } from "@/lib/i18n/context";
import { useAuth } from "@/lib/auth-context";
import {
  Shield,
  Globe,
  Bell,
  Database,
  Server,
  Key,
  Save,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  Cpu,
  HardDrive,
} from "lucide-react";

export default function AdminSettingsPage() {
  const { t } = useI18n();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("general");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }, 1000);
  };

  const tabs = [
    { key: "general", icon: Globe, label: t("admin.settings.general") },
    { key: "security", icon: Shield, label: t("admin.settings.security") },
    { key: "notifications", icon: Bell, label: t("admin.settings.notifications") },
    { key: "system", icon: Server, label: t("admin.settings.system") },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-slate-800">{t("admin.settings.title")}</h1>
        <p className="text-sm text-slate-500">{t("admin.settings.description")}</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Tab navigation */}
        <div className="lg:w-56 flex-shrink-0">
          <nav className="flex lg:flex-col gap-1 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-colors
                    ${activeTab === tab.key
                      ? "bg-blue-50 text-blue-700 shadow-sm"
                      : "text-slate-500 hover:bg-slate-50 hover:text-slate-700"
                    }`}
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab content */}
        <div className="flex-1 min-w-0">
          {activeTab === "general" && (
            <div className="space-y-5">
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                <h3 className="text-sm font-semibold text-slate-700 mb-4">{t("admin.settings.siteConfig")}</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1.5">{t("admin.settings.siteName")}</label>
                    <input
                      type="text"
                      defaultValue="Tripology"
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-700
                                 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1.5">{t("admin.settings.siteUrl")}</label>
                    <input
                      type="text"
                      defaultValue="https://tripology7.shop"
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-700
                                 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1.5">{t("admin.settings.defaultLang")}</label>
                    <select
                      defaultValue="fa"
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-700
                                 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    >
                      <option value="en">English</option>
                      <option value="fa">فارسی</option>
                      <option value="ar">العربية</option>
                      <option value="fr">Français</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1.5">{t("admin.settings.currency")}</label>
                    <select
                      defaultValue="USD"
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-700
                                 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    >
                      <option value="USD">USD ($)</option>
                      <option value="EUR">EUR (€)</option>
                      <option value="IRR">IRR (﷼)</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                <h3 className="text-sm font-semibold text-slate-700 mb-4">{t("admin.settings.features")}</h3>
                <div className="space-y-3">
                  {[
                    { key: "aiChat", label: t("admin.settings.featureAiChat"), desc: t("admin.settings.featureAiChatDesc") },
                    { key: "bookings", label: t("admin.settings.featureBookings"), desc: t("admin.settings.featureBookingsDesc") },
                    { key: "reviews", label: t("admin.settings.featureReviews"), desc: t("admin.settings.featureReviewsDesc") },
                    { key: "registration", label: t("admin.settings.featureRegistration"), desc: t("admin.settings.featureRegistrationDesc") },
                  ].map((feature) => (
                    <label key={feature.key} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer">
                      <div>
                        <p className="text-sm font-medium text-slate-700">{feature.label}</p>
                        <p className="text-xs text-slate-400">{feature.desc}</p>
                      </div>
                      <div className="relative">
                        <input type="checkbox" defaultChecked className="sr-only peer" />
                        <div className="w-11 h-6 bg-slate-200 peer-checked:bg-blue-500 rounded-full transition-colors" />
                        <div className="absolute top-0.5 start-0.5 w-5 h-5 bg-white rounded-full shadow-sm peer-checked:translate-x-5 rtl:peer-checked:-translate-x-5 transition-transform" />
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "security" && (
            <div className="space-y-5">
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                <h3 className="text-sm font-semibold text-slate-700 mb-4">{t("admin.settings.authConfig")}</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1.5">{t("admin.settings.jwtExpiry")}</label>
                    <input
                      type="text"
                      defaultValue="30 minutes"
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-700
                                 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1.5">{t("admin.settings.refreshExpiry")}</label>
                    <input
                      type="text"
                      defaultValue="7 days"
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-700
                                 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1.5">{t("admin.settings.maxLoginAttempts")}</label>
                    <input
                      type="number"
                      defaultValue={5}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-700
                                 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                <h3 className="text-sm font-semibold text-slate-700 mb-4">{t("admin.settings.apiKeys")}</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50">
                    <div className="flex items-center gap-3">
                      <Key className="w-4 h-4 text-slate-400" />
                      <div>
                        <p className="text-sm font-medium text-slate-700">JWT Secret</p>
                        <p className="text-xs text-slate-400">••••••••••••••••</p>
                      </div>
                    </div>
                    <button className="px-3 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                      {t("admin.settings.regenerate")}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "notifications" && (
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
              <h3 className="text-sm font-semibold text-slate-700 mb-4">{t("admin.settings.emailNotifications")}</h3>
              <div className="space-y-3">
                {[
                  { key: "newUser", label: t("admin.settings.notifyNewUser") },
                  { key: "newBooking", label: t("admin.settings.notifyNewBooking") },
                  { key: "newReview", label: t("admin.settings.notifyNewReview") },
                  { key: "newItinerary", label: t("admin.settings.notifyNewItinerary") },
                ].map((n) => (
                  <label key={n.key} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer">
                    <span className="text-sm text-slate-700">{n.label}</span>
                    <div className="relative">
                      <input type="checkbox" defaultChecked className="sr-only peer" />
                      <div className="w-11 h-6 bg-slate-200 peer-checked:bg-blue-500 rounded-full transition-colors" />
                      <div className="absolute top-0.5 start-0.5 w-5 h-5 bg-white rounded-full shadow-sm peer-checked:translate-x-5 rtl:peer-checked:-translate-x-5 transition-transform" />
                    </div>
                  </label>
                ))}
              </div>
            </div>
          )}

          {activeTab === "system" && (
            <div className="space-y-5">
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                <h3 className="text-sm font-semibold text-slate-700 mb-4">{t("admin.settings.systemStatus")}</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { label: "Next.js Frontend", status: "online", icon: Globe, version: "16.0.10" },
                    { label: "FastAPI Backend", status: "online", icon: Server, version: "0.115" },
                    { label: "PostgreSQL", status: "online", icon: Database, version: "16" },
                    { label: "Redis", status: "online", icon: HardDrive, version: "7 Alpine" },
                  ].map((service) => {
                    const Icon = service.icon;
                    return (
                      <div key={service.label} className="flex items-center justify-between p-3 rounded-xl bg-slate-50">
                        <div className="flex items-center gap-3">
                          <Icon className="w-4 h-4 text-slate-400" />
                          <div>
                            <p className="text-sm font-medium text-slate-700">{service.label}</p>
                            <p className="text-xs text-slate-400">v{service.version}</p>
                          </div>
                        </div>
                        <span className="flex items-center gap-1.5 text-xs font-medium text-green-600">
                          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                          {t("admin.settings.online")}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                <h3 className="text-sm font-semibold text-slate-700 mb-4">{t("admin.settings.serverInfo")}</h3>
                <div className="space-y-3">
                  <div className="flex justify-between p-3 rounded-xl bg-slate-50">
                    <span className="text-sm text-slate-500 flex items-center gap-2"><Cpu className="w-4 h-4" /> CPU</span>
                    <span className="text-sm font-medium text-slate-700">6 Cores</span>
                  </div>
                  <div className="flex justify-between p-3 rounded-xl bg-slate-50">
                    <span className="text-sm text-slate-500 flex items-center gap-2"><HardDrive className="w-4 h-4" /> RAM</span>
                    <span className="text-sm font-medium text-slate-700">16 GB</span>
                  </div>
                  <div className="flex justify-between p-3 rounded-xl bg-slate-50">
                    <span className="text-sm text-slate-500 flex items-center gap-2"><Database className="w-4 h-4" /> {t("admin.settings.disk")}</span>
                    <span className="text-sm font-medium text-slate-700">69 GB</span>
                  </div>
                  <div className="flex justify-between p-3 rounded-xl bg-slate-50">
                    <span className="text-sm text-slate-500 flex items-center gap-2"><Globe className="w-4 h-4" /> OS</span>
                    <span className="text-sm font-medium text-slate-700">Ubuntu 22.04.5 LTS</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                <h3 className="text-sm font-semibold text-slate-700 mb-4">{t("admin.settings.maintenance")}</h3>
                <div className="flex flex-wrap gap-3">
                  <button className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-medium text-slate-700 hover:bg-slate-100 transition-colors">
                    <RefreshCw className="w-4 h-4" />
                    {t("admin.settings.clearCache")}
                  </button>
                  <button className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-medium text-slate-700 hover:bg-slate-100 transition-colors">
                    <Database className="w-4 h-4" />
                    {t("admin.settings.dbBackup")}
                  </button>
                  <button className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-50 border border-red-200 text-sm font-medium text-red-700 hover:bg-red-100 transition-colors">
                    <AlertTriangle className="w-4 h-4" />
                    {t("admin.settings.maintenanceMode")}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Save button */}
          <div className="flex justify-end mt-6">
            <button
              onClick={handleSave}
              disabled={saving}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-500 text-white text-sm font-medium
                         hover:bg-blue-600 disabled:opacity-50 transition-colors shadow-sm shadow-blue-200"
            >
              {saved ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  {t("admin.settings.saved")}
                </>
              ) : saving ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  {t("admin.settings.saving")}
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  {t("admin.settings.saveChanges")}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

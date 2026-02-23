"use client";

import { useEffect, useState, useCallback } from "react";
import { useI18n } from "@/lib/i18n/context";
import {
  adminApi,
  type AdminDashboardStats,
  type AdminRecentActivity,
  type AdminMonthlyStats,
} from "@/lib/api-client";
import {
  Users,
  Map,
  ShoppingCart,
  DollarSign,
  TrendingUp,
  UserPlus,
  Eye,
  Star,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const STAT_CARDS = [
  { key: "totalUsers", icon: Users, color: "blue", field: "total_users" as const },
  { key: "totalTrips", icon: Map, color: "emerald", field: "total_itineraries" as const },
  { key: "totalBookings", icon: ShoppingCart, color: "violet", field: "total_bookings" as const },
  { key: "totalRevenue", icon: DollarSign, color: "amber", field: "total_revenue" as const },
];

const COLORS = {
  blue: { bg: "bg-blue-50", icon: "bg-blue-500", text: "text-blue-700", badge: "bg-blue-100 text-blue-600" },
  emerald: { bg: "bg-emerald-50", icon: "bg-emerald-500", text: "text-emerald-700", badge: "bg-emerald-100 text-emerald-600" },
  violet: { bg: "bg-violet-50", icon: "bg-violet-500", text: "text-violet-700", badge: "bg-violet-100 text-violet-600" },
  amber: { bg: "bg-amber-50", icon: "bg-amber-500", text: "text-amber-700", badge: "bg-amber-100 text-amber-600" },
};

const ACTIVITY_ICONS: Record<string, typeof Users> = {
  user_registered: UserPlus,
  itinerary_created: Map,
  booking: ShoppingCart,
  review: Star,
};

const ACTIVITY_COLORS: Record<string, string> = {
  user_registered: "bg-blue-100 text-blue-600",
  itinerary_created: "bg-emerald-100 text-emerald-600",
  booking: "bg-violet-100 text-violet-600",
  review: "bg-amber-100 text-amber-600",
};

const CHART_COLORS = ["#3b82f6", "#10b981", "#8b5cf6", "#f59e0b"];

export default function AdminDashboard() {
  const { t } = useI18n();
  const [stats, setStats] = useState<AdminDashboardStats | null>(null);
  const [activity, setActivity] = useState<AdminRecentActivity[]>([]);
  const [monthly, setMonthly] = useState<AdminMonthlyStats[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [s, a, m] = await Promise.all([
        adminApi.getDashboardStats(),
        adminApi.getRecentActivity(8),
        adminApi.getMonthlyStats(6),
      ]);
      setStats(s);
      setActivity(a);
      setMonthly(m);
    } catch (err) {
      console.error("Failed to load dashboard:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  if (loading || !stats) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 bg-white rounded-2xl" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 h-80 bg-white rounded-2xl" />
          <div className="h-80 bg-white rounded-2xl" />
        </div>
      </div>
    );
  }

  const secondaryStats = [
    { label: t("admin.dashboard.activeUsers"), value: stats.active_users, icon: Activity },
    { label: t("admin.dashboard.publishedTrips"), value: stats.published_itineraries, icon: Eye },
    { label: t("admin.dashboard.newUsersToday"), value: stats.new_users_today, icon: UserPlus },
    { label: t("admin.dashboard.pendingReviews"), value: stats.pending_reviews, icon: Star },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 p-6 text-white">
        <div className="relative z-10">
          <h1 className="text-2xl font-bold">{t("admin.dashboard.welcome")}</h1>
          <p className="mt-1 text-blue-100 text-sm">{t("admin.dashboard.welcomeDesc")}</p>
        </div>
        <div className="absolute top-0 end-0 w-64 h-64 opacity-10">
          <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <path
              fill="currentColor"
              d="M44.7,-76.4C58.8,-69.2,71.8,-58.7,79.6,-45.2C87.4,-31.7,90.1,-15.8,88.5,-0.9C86.9,14,81,28.1,72.5,39.7C64,51.3,52.8,60.5,40.3,67.5C27.7,74.5,13.9,79.3,-0.7,80.5C-15.3,81.7,-30.6,79.3,-43.8,72.7C-57,66.1,-68.2,55.3,-75.3,42.2C-82.4,29.1,-85.4,14.5,-84.6,0.5C-83.8,-13.6,-79.2,-27.2,-71.4,-38.5C-63.5,-49.8,-52.5,-58.8,-40,-65.3C-27.5,-71.9,-13.8,-76,1.1,-77.9C16,-79.8,30.6,-83.6,44.7,-76.4Z"
              transform="translate(100 100)"
            />
          </svg>
        </div>
      </div>

      {/* Main stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {STAT_CARDS.map((card) => {
          const Icon = card.icon;
          const c = COLORS[card.color as keyof typeof COLORS];
          const value = stats[card.field];
          return (
            <div
              key={card.key}
              className="relative overflow-hidden bg-white rounded-2xl p-5 shadow-sm border border-slate-100 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                    {t(`admin.dashboard.${card.key}`)}
                  </p>
                  <p className="mt-2 text-2xl font-bold text-slate-800">
                    {card.field === "total_revenue"
                      ? `$${value.toLocaleString()}`
                      : value.toLocaleString()}
                  </p>
                </div>
                <div className={`flex items-center justify-center w-11 h-11 rounded-xl ${c.icon} shadow-lg`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
              </div>
              <div className="mt-3 flex items-center gap-1">
                <span className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-xs font-medium ${c.badge}`}>
                  <ArrowUpRight className="w-3 h-3" />
                  {card.field === "total_revenue" ? `$${stats.revenue_this_month.toLocaleString()}` : 
                   card.field === "total_users" ? stats.new_users_this_month :
                   card.field === "total_bookings" ? stats.bookings_this_month :
                   stats.published_itineraries}
                </span>
                <span className="text-xs text-slate-400">{t("admin.dashboard.thisMonth")}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Secondary stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {secondaryStats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="flex items-center gap-3 bg-white rounded-xl px-4 py-3 border border-slate-100 shadow-sm"
            >
              <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-slate-50">
                <Icon className="w-4 h-4 text-slate-500" />
              </div>
              <div>
                <p className="text-lg font-bold text-slate-800">{stat.value}</p>
                <p className="text-[10px] text-slate-400 leading-tight">{stat.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Area chart — users & bookings growth */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
          <h3 className="text-sm font-semibold text-slate-700 mb-4">
            {t("admin.dashboard.growthChart")}
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthly}>
                <defs>
                  <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorBookings" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#94a3b8" }} />
                <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} />
                <Tooltip
                  contentStyle={{
                    borderRadius: "12px",
                    border: "1px solid #e2e8f0",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                    fontSize: "12px",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="users"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  fill="url(#colorUsers)"
                  name={t("admin.dashboard.users")}
                />
                <Area
                  type="monotone"
                  dataKey="bookings"
                  stroke="#8b5cf6"
                  strokeWidth={2}
                  fill="url(#colorBookings)"
                  name={t("admin.dashboard.bookings")}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bar chart — revenue */}
        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
          <h3 className="text-sm font-semibold text-slate-700 mb-4">
            {t("admin.dashboard.revenueChart")}
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthly}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 10, fill: "#94a3b8" }} />
                <YAxis tick={{ fontSize: 10, fill: "#94a3b8" }} />
                <Tooltip
                  contentStyle={{
                    borderRadius: "12px",
                    border: "1px solid #e2e8f0",
                    fontSize: "12px",
                  }}
                />
                <Bar
                  dataKey="revenue"
                  fill="#f59e0b"
                  radius={[6, 6, 0, 0]}
                  name={t("admin.dashboard.revenue")}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent activity */}
      <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
        <h3 className="text-sm font-semibold text-slate-700 mb-4 flex items-center gap-2">
          <Clock className="w-4 h-4 text-slate-400" />
          {t("admin.dashboard.recentActivity")}
        </h3>
        {activity.length === 0 ? (
          <p className="text-sm text-slate-400 text-center py-8">
            {t("admin.dashboard.noActivity")}
          </p>
        ) : (
          <div className="space-y-3">
            {activity.map((item) => {
              const Icon = ACTIVITY_ICONS[item.type] || Activity;
              const colorClass = ACTIVITY_COLORS[item.type] || "bg-slate-100 text-slate-600";
              return (
                <div
                  key={item.id + item.timestamp}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors"
                >
                  <div className={`flex items-center justify-center w-9 h-9 rounded-lg ${colorClass}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-slate-700 truncate">{item.description}</p>
                    <p className="text-xs text-slate-400">
                      {new Date(item.timestamp).toLocaleDateString(undefined, {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

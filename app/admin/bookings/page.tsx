"use client";

import { useEffect, useState, useCallback } from "react";
import { useI18n } from "@/lib/i18n/context";
import { adminApi, type AdminBooking, type PaginatedBookings } from "@/lib/api-client";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  DollarSign,
  CreditCard,
  CheckCircle2,
  Clock,
  XCircle,
  RotateCcw,
  ShoppingCart,
} from "lucide-react";

const STATUS_CONFIG: Record<string, { icon: typeof CheckCircle2; color: string; bg: string }> = {
  completed: { icon: CheckCircle2, color: "text-green-600", bg: "bg-green-50 text-green-700 border-green-200" },
  pending: { icon: Clock, color: "text-amber-600", bg: "bg-amber-50 text-amber-700 border-amber-200" },
  cancelled: { icon: XCircle, color: "text-red-600", bg: "bg-red-50 text-red-700 border-red-200" },
  refunded: { icon: RotateCcw, color: "text-slate-600", bg: "bg-slate-50 text-slate-700 border-slate-200" },
};

export default function AdminBookingsPage() {
  const { t } = useI18n();
  const [data, setData] = useState<PaginatedBookings | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string>("");

  const loadBookings = useCallback(async () => {
    setLoading(true);
    try {
      const params: Record<string, unknown> = { page, per_page: 15 };
      if (statusFilter) params.status = statusFilter;
      const result = await adminApi.listBookings(params as any);
      setData(result);
    } catch (err) {
      console.error("Failed to load bookings:", err);
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter]);

  useEffect(() => {
    loadBookings();
  }, [loadBookings]);

  // Summary cards
  const completed = data?.bookings.filter((b) => b.status === "completed").length || 0;
  const pending = data?.bookings.filter((b) => b.status === "pending").length || 0;
  const totalAmount = data?.bookings.reduce((sum, b) => sum + b.amount, 0) || 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-800">{t("admin.bookings.title")}</h1>
          <p className="text-sm text-slate-500">{t("admin.bookings.description")}</p>
        </div>
        <span className="px-3 py-1.5 bg-violet-50 text-violet-700 rounded-full text-xs font-medium">
          {data?.total ?? 0} {t("admin.bookings.total")}
        </span>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="flex items-center gap-4 bg-white rounded-2xl p-4 border border-slate-100 shadow-sm">
          <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-green-500 shadow-lg shadow-green-200">
            <CheckCircle2 className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-xl font-bold text-slate-800">{completed}</p>
            <p className="text-xs text-slate-400">{t("admin.bookings.completed")}</p>
          </div>
        </div>
        <div className="flex items-center gap-4 bg-white rounded-2xl p-4 border border-slate-100 shadow-sm">
          <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-amber-500 shadow-lg shadow-amber-200">
            <Clock className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-xl font-bold text-slate-800">{pending}</p>
            <p className="text-xs text-slate-400">{t("admin.bookings.pending")}</p>
          </div>
        </div>
        <div className="flex items-center gap-4 bg-white rounded-2xl p-4 border border-slate-100 shadow-sm">
          <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-violet-500 shadow-lg shadow-violet-200">
            <DollarSign className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-xl font-bold text-slate-800">${totalAmount.toLocaleString()}</p>
            <p className="text-xs text-slate-400">{t("admin.bookings.totalAmount")}</p>
          </div>
        </div>
      </div>

      {/* Filter */}
      <div className="flex gap-3">
        <select
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
          className="px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-sm text-slate-700
                     focus:outline-none focus:ring-2 focus:ring-blue-500/20 min-w-[160px]"
        >
          <option value="">{t("admin.bookings.allStatuses")}</option>
          <option value="completed">{t("admin.bookings.completed")}</option>
          <option value="pending">{t("admin.bookings.pending")}</option>
          <option value="cancelled">{t("admin.bookings.cancelled")}</option>
          <option value="refunded">{t("admin.bookings.refunded")}</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-100">
                <th className="text-start px-5 py-3.5 font-semibold text-slate-500 text-xs uppercase tracking-wider">
                  {t("admin.bookings.customer")}
                </th>
                <th className="text-start px-5 py-3.5 font-semibold text-slate-500 text-xs uppercase tracking-wider">
                  {t("admin.bookings.itinerary")}
                </th>
                <th className="text-start px-5 py-3.5 font-semibold text-slate-500 text-xs uppercase tracking-wider">
                  {t("admin.bookings.statusCol")}
                </th>
                <th className="text-start px-5 py-3.5 font-semibold text-slate-500 text-xs uppercase tracking-wider hidden md:table-cell">
                  {t("admin.bookings.amount")}
                </th>
                <th className="text-start px-5 py-3.5 font-semibold text-slate-500 text-xs uppercase tracking-wider hidden lg:table-cell">
                  {t("admin.bookings.payment")}
                </th>
                <th className="text-start px-5 py-3.5 font-semibold text-slate-500 text-xs uppercase tracking-wider hidden lg:table-cell">
                  {t("admin.bookings.date")}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    {[1, 2, 3, 4, 5, 6].map((j) => (
                      <td key={j} className={`px-5 py-4 ${j > 3 ? "hidden md:table-cell" : ""}`}>
                        <div className="h-4 w-20 bg-slate-100 rounded" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : data && data.bookings.length > 0 ? (
                data.bookings.map((booking) => {
                  const sc = STATUS_CONFIG[booking.status] || STATUS_CONFIG.pending;
                  const Icon = sc.icon;
                  return (
                    <tr key={booking.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-5 py-4">
                        <span className="text-sm text-slate-700">{booking.user_email}</span>
                      </td>
                      <td className="px-5 py-4">
                        <span className="text-sm text-slate-700 truncate block max-w-[200px]">
                          {booking.itinerary_title}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border ${sc.bg}`}>
                          <Icon className="w-3 h-3" />
                          {booking.status}
                        </span>
                      </td>
                      <td className="px-5 py-4 hidden md:table-cell">
                        <span className="text-sm font-medium text-slate-800">
                          ${booking.amount.toLocaleString()} {booking.currency}
                        </span>
                      </td>
                      <td className="px-5 py-4 hidden lg:table-cell">
                        <div className="flex items-center gap-1.5">
                          <CreditCard className="w-3.5 h-3.5 text-slate-400" />
                          <span className="text-xs text-slate-500">{booking.payment_method || "—"}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4 hidden lg:table-cell">
                        <span className="text-xs text-slate-500">
                          {new Date(booking.created_at).toLocaleDateString()}
                        </span>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-sm text-slate-400">
                    <ShoppingCart className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                    {t("admin.bookings.noBookings")}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {data && data.total_pages > 1 && (
          <div className="flex items-center justify-between px-5 py-3.5 border-t border-slate-100 bg-slate-50/50">
            <p className="text-xs text-slate-500">
              {t("admin.users.showing")} {((page - 1) * 15) + 1}–{Math.min(page * 15, data.total)} {t("admin.users.of")} {data.total}
            </p>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page <= 1}
                className="p-1.5 rounded-lg hover:bg-white text-slate-400 disabled:opacity-40 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              {Array.from({ length: Math.min(5, data.total_pages) }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`w-8 h-8 rounded-lg text-xs font-medium transition-colors
                    ${p === page ? "bg-blue-500 text-white shadow-sm" : "hover:bg-white text-slate-500"}`}
                >
                  {p}
                </button>
              ))}
              <button
                onClick={() => setPage(Math.min(data.total_pages, page + 1))}
                disabled={page >= data.total_pages}
                className="p-1.5 rounded-lg hover:bg-white text-slate-400 disabled:opacity-40 transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

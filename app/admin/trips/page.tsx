"use client";

import { useEffect, useState, useCallback } from "react";
import { useI18n } from "@/lib/i18n/context";
import { adminApi, type AdminItinerary, type PaginatedItineraries } from "@/lib/api-client";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  Eye,
  EyeOff,
  BadgeCheck,
  Trash2,
  MapPin,
  Clock,
  Star,
  ShoppingCart,
  Globe,
} from "lucide-react";

export default function AdminTripsPage() {
  const { t, dir } = useI18n();
  const [data, setData] = useState<PaginatedItineraries | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [publishedFilter, setPublishedFilter] = useState<string>("");
  const [verifiedFilter, setVerifiedFilter] = useState<string>("");
  const [actionMenuId, setActionMenuId] = useState<string | null>(null);

  const loadTrips = useCallback(async () => {
    setLoading(true);
    try {
      const params: Record<string, unknown> = { page, per_page: 15 };
      if (search) params.search = search;
      if (publishedFilter) params.is_published = publishedFilter === "published";
      if (verifiedFilter) params.is_verified = verifiedFilter === "verified";
      const result = await adminApi.listItineraries(params as any);
      setData(result);
    } catch (err) {
      console.error("Failed to load trips:", err);
    } finally {
      setLoading(false);
    }
  }, [page, search, publishedFilter, verifiedFilter]);

  useEffect(() => {
    loadTrips();
  }, [loadTrips]);

  const [searchInput, setSearchInput] = useState("");
  useEffect(() => {
    const timer = setTimeout(() => { setSearch(searchInput); setPage(1); }, 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const handleTogglePublish = async (trip: AdminItinerary) => {
    try {
      await adminApi.updateItinerary(trip.id, { is_published: !trip.is_published });
      loadTrips();
    } catch (err) { console.error(err); }
    setActionMenuId(null);
  };

  const handleToggleVerify = async (trip: AdminItinerary) => {
    try {
      await adminApi.updateItinerary(trip.id, { is_verified: !trip.is_verified });
      loadTrips();
    } catch (err) { console.error(err); }
    setActionMenuId(null);
  };

  const handleDelete = async (trip: AdminItinerary) => {
    if (!confirm(t("admin.trips.confirmDelete"))) return;
    try {
      await adminApi.deleteItinerary(trip.id);
      loadTrips();
    } catch (err) { console.error(err); }
    setActionMenuId(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-800">{t("admin.trips.title")}</h1>
          <p className="text-sm text-slate-500">{t("admin.trips.description")}</p>
        </div>
        <span className="px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-full text-xs font-medium">
          {data?.total ?? 0} {t("admin.trips.total")}
        </span>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder={t("admin.trips.searchPlaceholder")}
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="w-full ps-10 pe-4 py-2.5 rounded-xl bg-white border border-slate-200
                       text-sm text-slate-700 placeholder:text-slate-400
                       focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
          />
        </div>
        <select
          value={publishedFilter}
          onChange={(e) => { setPublishedFilter(e.target.value); setPage(1); }}
          className="px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-sm text-slate-700
                     focus:outline-none focus:ring-2 focus:ring-blue-500/20 min-w-[140px]"
        >
          <option value="">{t("admin.trips.allPublishStatus")}</option>
          <option value="published">{t("admin.trips.published")}</option>
          <option value="draft">{t("admin.trips.draft")}</option>
        </select>
        <select
          value={verifiedFilter}
          onChange={(e) => { setVerifiedFilter(e.target.value); setPage(1); }}
          className="px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-sm text-slate-700
                     focus:outline-none focus:ring-2 focus:ring-blue-500/20 min-w-[140px]"
        >
          <option value="">{t("admin.trips.allVerifyStatus")}</option>
          <option value="verified">{t("admin.trips.verified")}</option>
          <option value="unverified">{t("admin.trips.unverified")}</option>
        </select>
      </div>

      {/* Cards Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-48 bg-white rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : data && data.itineraries.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {data.itineraries.map((trip) => (
            <div
              key={trip.id}
              className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow"
            >
              {/* Card header with gradient */}
              <div className="h-2 bg-gradient-to-r from-blue-500 via-indigo-500 to-violet-500" />
              <div className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-bold text-slate-800 truncate">{trip.title}</h3>
                    <div className="flex items-center gap-1.5 mt-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span className="text-xs text-slate-500">{trip.destination}, {trip.country}</span>
                    </div>
                  </div>
                  <div className="relative">
                    <button
                      onClick={() => setActionMenuId(actionMenuId === trip.id ? null : trip.id)}
                      className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400"
                    >
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                    {actionMenuId === trip.id && (
                      <div className={`absolute z-20 top-full mt-1 ${dir === "rtl" ? "start-0" : "end-0"} w-44 bg-white rounded-xl border border-slate-200 shadow-lg py-1`}>
                        <button
                          onClick={() => handleTogglePublish(trip)}
                          className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
                        >
                          {trip.is_published ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          {trip.is_published ? t("admin.trips.unpublish") : t("admin.trips.publish")}
                        </button>
                        <button
                          onClick={() => handleToggleVerify(trip)}
                          className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
                        >
                          <BadgeCheck className="w-4 h-4" />
                          {trip.is_verified ? t("admin.trips.unverify") : t("admin.trips.verifyTrip")}
                        </button>
                        <hr className="my-1 border-slate-100" />
                        <button
                          onClick={() => handleDelete(trip)}
                          className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                          {t("common.delete")}
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Stats row */}
                <div className="grid grid-cols-3 gap-3 mb-3">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span className="text-xs text-slate-500">{trip.duration} {t("admin.trips.days")}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Star className="w-3.5 h-3.5 text-amber-400" />
                    <span className="text-xs text-slate-500">{trip.rating.toFixed(1)} ({trip.review_count})</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Eye className="w-3.5 h-3.5 text-slate-400" />
                    <span className="text-xs text-slate-500">{trip.views_count}</span>
                  </div>
                </div>

                {/* Badges */}
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium
                    ${trip.is_published ? "bg-green-50 text-green-700" : "bg-slate-100 text-slate-500"}`}>
                    {trip.is_published ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                    {trip.is_published ? t("admin.trips.published") : t("admin.trips.draft")}
                  </span>
                  {trip.is_verified && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                      <BadgeCheck className="w-3 h-3" />
                      {t("admin.trips.verified")}
                    </span>
                  )}
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-violet-50 text-violet-700">
                    ${trip.price}
                  </span>
                  {trip.creator_username && (
                    <span className="text-xs text-slate-400">
                      {t("admin.trips.by")} {trip.creator_username}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-2xl border border-slate-100">
          <Globe className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <p className="text-sm text-slate-400">{t("admin.trips.noTrips")}</p>
        </div>
      )}

      {/* Pagination */}
      {data && data.total_pages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => setPage(Math.max(1, page - 1))}
            disabled={page <= 1}
            className="p-2 rounded-lg bg-white border border-slate-200 text-slate-400 hover:bg-slate-50 disabled:opacity-40 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          {Array.from({ length: Math.min(5, data.total_pages) }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors
                ${p === page ? "bg-blue-500 text-white shadow-sm" : "bg-white border border-slate-200 text-slate-500 hover:bg-slate-50"}`}
            >
              {p}
            </button>
          ))}
          <button
            onClick={() => setPage(Math.min(data.total_pages, page + 1))}
            disabled={page >= data.total_pages}
            className="p-2 rounded-lg bg-white border border-slate-200 text-slate-400 hover:bg-slate-50 disabled:opacity-40 transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {actionMenuId && (
        <div className="fixed inset-0 z-10" onClick={() => setActionMenuId(null)} />
      )}
    </div>
  );
}

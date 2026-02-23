"use client";

import { useEffect, useState, useCallback } from "react";
import { useI18n } from "@/lib/i18n/context";
import { adminApi, type AdminReview, type PaginatedReviews } from "@/lib/api-client";
import {
  ChevronLeft,
  ChevronRight,
  Star,
  BadgeCheck,
  Trash2,
  MessageSquare,
  ThumbsUp,
} from "lucide-react";

export default function AdminReviewsPage() {
  const { t } = useI18n();
  const [data, setData] = useState<PaginatedReviews | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [verifiedFilter, setVerifiedFilter] = useState<string>("");

  const loadReviews = useCallback(async () => {
    setLoading(true);
    try {
      const params: Record<string, unknown> = { page, per_page: 15 };
      if (verifiedFilter) params.is_verified = verifiedFilter === "verified";
      const result = await adminApi.listReviews(params as any);
      setData(result);
    } catch (err) {
      console.error("Failed to load reviews:", err);
    } finally {
      setLoading(false);
    }
  }, [page, verifiedFilter]);

  useEffect(() => {
    loadReviews();
  }, [loadReviews]);

  const handleVerify = async (review: AdminReview) => {
    try {
      await adminApi.verifyReview(review.id);
      loadReviews();
    } catch (err) { console.error(err); }
  };

  const handleDelete = async (review: AdminReview) => {
    if (!confirm(t("admin.reviews.confirmDelete"))) return;
    try {
      await adminApi.deleteReview(review.id);
      loadReviews();
    } catch (err) { console.error(err); }
  };

  const renderStars = (rating: number) => (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          className={`w-3.5 h-3.5 ${s <= rating ? "text-amber-400 fill-amber-400" : "text-slate-200"}`}
        />
      ))}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-800">{t("admin.reviews.title")}</h1>
          <p className="text-sm text-slate-500">{t("admin.reviews.description")}</p>
        </div>
        <span className="px-3 py-1.5 bg-amber-50 text-amber-700 rounded-full text-xs font-medium">
          {data?.total ?? 0} {t("admin.reviews.total")}
        </span>
      </div>

      {/* Filter */}
      <div className="flex gap-3">
        <select
          value={verifiedFilter}
          onChange={(e) => { setVerifiedFilter(e.target.value); setPage(1); }}
          className="px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-sm text-slate-700
                     focus:outline-none focus:ring-2 focus:ring-blue-500/20 min-w-[160px]"
        >
          <option value="">{t("admin.reviews.allReviews")}</option>
          <option value="verified">{t("admin.reviews.verified")}</option>
          <option value="unverified">{t("admin.reviews.unverified")}</option>
        </select>
      </div>

      {/* Reviews list */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-28 bg-white rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : data && data.reviews.length > 0 ? (
        <div className="space-y-3">
          {data.reviews.map((review) => (
            <div
              key={review.id}
              className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    {renderStars(review.rating)}
                    {review.is_verified && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-blue-50 text-blue-700">
                        <BadgeCheck className="w-3 h-3" />
                        {t("admin.reviews.verified")}
                      </span>
                    )}
                  </div>
                  {review.title && (
                    <h3 className="text-sm font-semibold text-slate-800 mb-1">{review.title}</h3>
                  )}
                  {review.comment && (
                    <p className="text-sm text-slate-600 leading-relaxed line-clamp-2">{review.comment}</p>
                  )}
                  <div className="flex items-center gap-4 mt-3">
                    <span className="text-xs text-slate-400">{review.user_email}</span>
                    <span className="text-xs text-slate-300">|</span>
                    <span className="text-xs text-slate-400 truncate">{review.itinerary_title}</span>
                    <span className="text-xs text-slate-300">|</span>
                    <span className="text-xs text-slate-400">
                      {new Date(review.created_at).toLocaleDateString()}
                    </span>
                    {review.helpful_count > 0 && (
                      <>
                        <span className="text-xs text-slate-300">|</span>
                        <span className="inline-flex items-center gap-1 text-xs text-slate-400">
                          <ThumbsUp className="w-3 h-3" /> {review.helpful_count}
                        </span>
                      </>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <button
                    onClick={() => handleVerify(review)}
                    className={`p-2 rounded-lg transition-colors ${
                      review.is_verified
                        ? "bg-blue-50 text-blue-600 hover:bg-blue-100"
                        : "bg-slate-50 text-slate-400 hover:bg-slate-100 hover:text-blue-600"
                    }`}
                    title={review.is_verified ? t("admin.reviews.unverify") : t("admin.reviews.verifyReview")}
                  >
                    <BadgeCheck className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(review)}
                    className="p-2 rounded-lg bg-slate-50 text-slate-400 hover:bg-red-50 hover:text-red-500 transition-colors"
                    title={t("common.delete")}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-2xl border border-slate-100">
          <MessageSquare className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <p className="text-sm text-slate-400">{t("admin.reviews.noReviews")}</p>
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
    </div>
  );
}

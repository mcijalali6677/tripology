"use client"

import { useEffect, useState, useCallback } from "react"
import { useI18n } from "@/lib/i18n/context"
import {
  Store, Search, Filter, CheckCircle, XCircle, Clock, Eye,
  ChevronDown, AlertTriangle, Ban, Building2, Phone, Globe,
  MapPin, FileText, TrendingUp, Users, Star, Loader2, RefreshCw,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

interface Vendor {
  id: number
  user_id: number
  business_name: string
  business_name_fa?: string
  vendor_type: string
  status: string
  phone: string
  website?: string
  city?: string
  province?: string
  license_number?: string
  national_id?: string
  commission_rate: number
  total_sales: number
  total_revenue: number
  rating: number
  review_count: number
  created_at: string
}

const STATUS_CONFIG: Record<string, { icon: typeof Clock; color: string; bg: string }> = {
  pending: { icon: Clock, color: "text-amber-600", bg: "bg-amber-50 border-amber-200" },
  documents_required: { icon: FileText, color: "text-orange-600", bg: "bg-orange-50 border-orange-200" },
  under_review: { icon: Eye, color: "text-blue-600", bg: "bg-blue-50 border-blue-200" },
  approved: { icon: CheckCircle, color: "text-emerald-600", bg: "bg-emerald-50 border-emerald-200" },
  rejected: { icon: XCircle, color: "text-red-600", bg: "bg-red-50 border-red-200" },
  suspended: { icon: Ban, color: "text-slate-600", bg: "bg-slate-50 border-slate-200" },
}

const TYPE_LABELS: Record<string, string> = {
  hotel: "🏨", airline: "✈️", tour_agency: "🗺️", car_rental: "🚗",
  restaurant: "🍽️", homestay: "🏠", travel_insurance: "☂️",
  visa_service: "📄", local_guide: "👤", transport: "🚌",
}

export default function AdminVendorsPage() {
  const { t } = useI18n()
  const [vendors, setVendors] = useState<Vendor[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null)
  const [actionLoading, setActionLoading] = useState(false)
  const [rejectionReason, setRejectionReason] = useState("")

  const API = process.env.NEXT_PUBLIC_API_URL || ""
  const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : null

  const fetchVendors = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (statusFilter !== "all") params.set("status", statusFilter)
      const res = await fetch(`${API}/api/v1/vendors/admin/all?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (res.ok) {
        const data = await res.json()
        setVendors(data)
      }
    } catch {
      // silent
    } finally {
      setLoading(false)
    }
  }, [API, token, statusFilter])

  useEffect(() => { fetchVendors() }, [fetchVendors])

  const handleAction = async (vendorId: number, status: string) => {
    setActionLoading(true)
    try {
      const body: Record<string, unknown> = { status }
      if (status === "rejected" && rejectionReason) {
        body.rejection_reason = rejectionReason
      }
      const res = await fetch(`${API}/api/v1/vendors/admin/${vendorId}/action`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      })
      if (res.ok) {
        setSelectedVendor(null)
        setRejectionReason("")
        await fetchVendors()
      }
    } catch {
      // silent
    } finally {
      setActionLoading(false)
    }
  }

  const filtered = vendors.filter((v) => {
    if (search) {
      const q = search.toLowerCase()
      return (
        v.business_name.toLowerCase().includes(q) ||
        (v.business_name_fa || "").includes(q) ||
        v.vendor_type.includes(q) ||
        (v.city || "").toLowerCase().includes(q)
      )
    }
    return true
  })

  const counts = {
    all: vendors.length,
    pending: vendors.filter((v) => v.status === "pending").length,
    approved: vendors.filter((v) => v.status === "approved").length,
    rejected: vendors.filter((v) => v.status === "rejected").length,
    suspended: vendors.filter((v) => v.status === "suspended").length,
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Store className="size-6 text-forest" />
            {t("admin.nav.vendors")}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage vendor applications, approvals, and performance
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={fetchVendors} className="gap-2">
          <RefreshCw className="size-4" />
          Refresh
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        {(["all", "pending", "approved", "rejected", "suspended"] as const).map((s) => {
          const isActive = statusFilter === s
          const config = s === "all"
            ? { icon: Store, color: "text-slate-700", bg: "bg-white border-slate-200" }
            : STATUS_CONFIG[s]
          const Icon = config.icon
          return (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={cn(
                "rounded-xl border p-3.5 text-start transition-all",
                isActive ? "ring-2 ring-forest shadow-sm" : "hover:shadow-sm",
                config.bg
              )}
            >
              <div className="flex items-center justify-between mb-1">
                <Icon className={cn("size-4", config.color)} />
                <span className="text-lg font-bold">{counts[s] || 0}</span>
              </div>
              <span className="text-xs font-medium capitalize">{s === "all" ? "All Vendors" : s.replace("_", " ")}</span>
            </button>
          )
        })}
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute start-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search vendors by name, type, or city..."
          className="ps-10 h-10"
        />
      </div>

      {/* Vendor List */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="size-8 animate-spin text-forest" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16">
          <Store className="size-12 text-muted-foreground/30 mx-auto mb-3" />
          <p className="text-muted-foreground">No vendors found</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((vendor) => {
            const sc = STATUS_CONFIG[vendor.status] || STATUS_CONFIG.pending
            const StatusIcon = sc.icon
            const isExpanded = selectedVendor?.id === vendor.id

            return (
              <div
                key={vendor.id}
                className="bg-card border rounded-xl overflow-hidden transition-all hover:shadow-sm"
              >
                {/* Row */}
                <button
                  className="w-full p-4 flex items-center gap-4 text-start"
                  onClick={() => setSelectedVendor(isExpanded ? null : vendor)}
                >
                  {/* Type emoji */}
                  <div className="size-10 rounded-lg bg-secondary flex items-center justify-center text-lg shrink-0">
                    {TYPE_LABELS[vendor.vendor_type] || "🏢"}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold truncate">{vendor.business_name}</span>
                      {vendor.business_name_fa && (
                        <span className="text-sm text-muted-foreground" dir="rtl">({vendor.business_name_fa})</span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                      <span className="capitalize">{vendor.vendor_type.replace("_", " ")}</span>
                      {vendor.city && <span className="flex items-center gap-1"><MapPin className="size-3" />{vendor.city}</span>}
                      <span className="flex items-center gap-1"><Phone className="size-3" />{vendor.phone}</span>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="hidden md:flex items-center gap-4 text-sm">
                    {vendor.rating > 0 && (
                      <span className="flex items-center gap-1 text-amber-600">
                        <Star className="size-3.5 fill-current" /> {vendor.rating.toFixed(1)}
                      </span>
                    )}
                    <span className="flex items-center gap-1 text-emerald-600">
                      <TrendingUp className="size-3.5" /> {vendor.total_sales}
                    </span>
                  </div>

                  {/* Status badge */}
                  <span className={cn(
                    "flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full border shrink-0",
                    sc.bg, sc.color
                  )}>
                    <StatusIcon className="size-3.5" />
                    <span className="capitalize">{vendor.status.replace("_", " ")}</span>
                  </span>

                  <ChevronDown className={cn(
                    "size-4 text-muted-foreground transition-transform shrink-0",
                    isExpanded && "rotate-180"
                  )} />
                </button>

                {/* Expanded Detail */}
                {isExpanded && (
                  <div className="border-t px-4 py-4 bg-secondary/20 space-y-4">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
                      <div>
                        <span className="text-xs text-muted-foreground">License #</span>
                        <p className="font-medium" dir="ltr">{vendor.license_number || "—"}</p>
                      </div>
                      <div>
                        <span className="text-xs text-muted-foreground">National ID</span>
                        <p className="font-medium" dir="ltr">{vendor.national_id || "—"}</p>
                      </div>
                      <div>
                        <span className="text-xs text-muted-foreground">Commission</span>
                        <p className="font-medium">{vendor.commission_rate}%</p>
                      </div>
                      <div>
                        <span className="text-xs text-muted-foreground">Registered</span>
                        <p className="font-medium">{new Date(vendor.created_at).toLocaleDateString()}</p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-wrap items-center gap-2">
                      {(vendor.status === "pending" || vendor.status === "under_review") && (
                        <>
                          <Button
                            size="sm"
                            className="bg-emerald-600 hover:bg-emerald-700 gap-1.5"
                            onClick={() => handleAction(vendor.id, "approved")}
                            disabled={actionLoading}
                          >
                            <CheckCircle className="size-3.5" /> Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-blue-600 border-blue-200 hover:bg-blue-50 gap-1.5"
                            onClick={() => handleAction(vendor.id, "under_review")}
                            disabled={actionLoading}
                          >
                            <Eye className="size-3.5" /> Mark Under Review
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-orange-600 border-orange-200 hover:bg-orange-50 gap-1.5"
                            onClick={() => handleAction(vendor.id, "documents_required")}
                            disabled={actionLoading}
                          >
                            <FileText className="size-3.5" /> Request Docs
                          </Button>
                        </>
                      )}
                      {vendor.status === "approved" && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-red-600 border-red-200 hover:bg-red-50 gap-1.5"
                          onClick={() => handleAction(vendor.id, "suspended")}
                          disabled={actionLoading}
                        >
                          <Ban className="size-3.5" /> Suspend
                        </Button>
                      )}
                      {vendor.status === "suspended" && (
                        <Button
                          size="sm"
                          className="bg-emerald-600 hover:bg-emerald-700 gap-1.5"
                          onClick={() => handleAction(vendor.id, "approved")}
                          disabled={actionLoading}
                        >
                          <CheckCircle className="size-3.5" /> Reactivate
                        </Button>
                      )}
                      {vendor.status !== "rejected" && (
                        <div className="flex items-center gap-2 ms-auto">
                          <Input
                            value={rejectionReason}
                            onChange={(e) => setRejectionReason(e.target.value)}
                            placeholder="Rejection reason..."
                            className="h-8 text-xs w-48"
                          />
                          <Button
                            size="sm"
                            variant="destructive"
                            className="gap-1.5"
                            onClick={() => handleAction(vendor.id, "rejected")}
                            disabled={actionLoading}
                          >
                            <XCircle className="size-3.5" /> Reject
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

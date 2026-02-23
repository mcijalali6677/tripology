"use client";

import { useEffect, useState, useCallback } from "react";
import { useI18n } from "@/lib/i18n/context";
import { adminApi, type AdminUser, type PaginatedUsers } from "@/lib/api-client";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  Shield,
  UserCheck,
  UserX,
  Trash2,
  Edit,
  Filter,
  Download,
  UserPlus,
} from "lucide-react";

const ROLE_COLORS: Record<string, string> = {
  admin: "bg-red-50 text-red-700 border-red-200",
  creator: "bg-violet-50 text-violet-700 border-violet-200",
  traveler: "bg-blue-50 text-blue-700 border-blue-200",
};

const ROLE_LABELS: Record<string, string> = {
  admin: "Admin",
  creator: "Creator",
  traveler: "Traveler",
};

export default function AdminUsersPage() {
  const { t, dir } = useI18n();
  const [data, setData] = useState<PaginatedUsers | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("");
  const [activeFilter, setActiveFilter] = useState<string>("");
  const [actionMenuId, setActionMenuId] = useState<string | null>(null);
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
  const [editRole, setEditRole] = useState("");
  const [saving, setSaving] = useState(false);

  const loadUsers = useCallback(async () => {
    setLoading(true);
    try {
      const params: Record<string, unknown> = { page, per_page: 15 };
      if (search) params.search = search;
      if (roleFilter) params.role = roleFilter;
      if (activeFilter) params.is_active = activeFilter === "active";
      const result = await adminApi.listUsers(params as any);
      setData(result);
    } catch (err) {
      console.error("Failed to load users:", err);
    } finally {
      setLoading(false);
    }
  }, [page, search, roleFilter, activeFilter]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  // Debounced search
  const [searchInput, setSearchInput] = useState("");
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput);
      setPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const handleToggleActive = async (user: AdminUser) => {
    try {
      await adminApi.updateUser(user.id, { is_active: !user.is_active });
      loadUsers();
    } catch (err) {
      console.error(err);
    }
    setActionMenuId(null);
  };

  const handleToggleVerified = async (user: AdminUser) => {
    try {
      await adminApi.updateUser(user.id, { is_verified: !user.is_verified });
      loadUsers();
    } catch (err) {
      console.error(err);
    }
    setActionMenuId(null);
  };

  const handleDeleteUser = async (user: AdminUser) => {
    if (!confirm(t("admin.users.confirmDelete"))) return;
    try {
      await adminApi.deleteUser(user.id);
      loadUsers();
    } catch (err) {
      console.error(err);
    }
    setActionMenuId(null);
  };

  const handleSaveRole = async () => {
    if (!editingUser) return;
    setSaving(true);
    try {
      await adminApi.updateUser(editingUser.id, { role: editRole });
      setEditingUser(null);
      loadUsers();
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-800">{t("admin.users.title")}</h1>
          <p className="text-sm text-slate-500">{t("admin.users.description")}</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full text-xs font-medium">
            {data?.total ?? 0} {t("admin.users.total")}
          </span>
        </div>
      </div>

      {/* Filters bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder={t("admin.users.searchPlaceholder")}
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="w-full ps-10 pe-4 py-2.5 rounded-xl bg-white border border-slate-200
                       text-sm text-slate-700 placeholder:text-slate-400
                       focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400
                       transition-all"
          />
        </div>
        <select
          value={roleFilter}
          onChange={(e) => { setRoleFilter(e.target.value); setPage(1); }}
          className="px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-sm text-slate-700
                     focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 min-w-[130px]"
        >
          <option value="">{t("admin.users.allRoles")}</option>
          <option value="admin">{t("admin.users.roleAdmin")}</option>
          <option value="creator">{t("admin.users.roleCreator")}</option>
          <option value="traveler">{t("admin.users.roleTraveler")}</option>
        </select>
        <select
          value={activeFilter}
          onChange={(e) => { setActiveFilter(e.target.value); setPage(1); }}
          className="px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-sm text-slate-700
                     focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 min-w-[130px]"
        >
          <option value="">{t("admin.users.allStatus")}</option>
          <option value="active">{t("admin.users.active")}</option>
          <option value="inactive">{t("admin.users.inactive")}</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-100">
                <th className="text-start px-5 py-3.5 font-semibold text-slate-500 text-xs uppercase tracking-wider">
                  {t("admin.users.user")}
                </th>
                <th className="text-start px-5 py-3.5 font-semibold text-slate-500 text-xs uppercase tracking-wider">
                  {t("admin.users.role")}
                </th>
                <th className="text-start px-5 py-3.5 font-semibold text-slate-500 text-xs uppercase tracking-wider hidden md:table-cell">
                  {t("admin.users.status")}
                </th>
                <th className="text-start px-5 py-3.5 font-semibold text-slate-500 text-xs uppercase tracking-wider hidden lg:table-cell">
                  {t("admin.users.joined")}
                </th>
                <th className="text-start px-5 py-3.5 font-semibold text-slate-500 text-xs uppercase tracking-wider hidden lg:table-cell">
                  {t("admin.users.trips")}
                </th>
                <th className="text-end px-5 py-3.5 font-semibold text-slate-500 text-xs uppercase tracking-wider">
                  {t("admin.users.actions")}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                Array.from({ length: 8 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-5 py-4"><div className="h-4 w-40 bg-slate-100 rounded" /></td>
                    <td className="px-5 py-4"><div className="h-4 w-16 bg-slate-100 rounded" /></td>
                    <td className="px-5 py-4 hidden md:table-cell"><div className="h-4 w-14 bg-slate-100 rounded" /></td>
                    <td className="px-5 py-4 hidden lg:table-cell"><div className="h-4 w-20 bg-slate-100 rounded" /></td>
                    <td className="px-5 py-4 hidden lg:table-cell"><div className="h-4 w-8 bg-slate-100 rounded" /></td>
                    <td className="px-5 py-4"><div className="h-4 w-6 bg-slate-100 rounded ms-auto" /></td>
                  </tr>
                ))
              ) : data && data.users.length > 0 ? (
                data.users.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                          {user.username?.[0]?.toUpperCase() || "?"}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-slate-800 truncate">
                            {user.full_name || user.username}
                          </p>
                          <p className="text-xs text-slate-400 truncate">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${ROLE_COLORS[user.role] || ROLE_COLORS.traveler}`}>
                        {user.role === "admin" && <Shield className="w-3 h-3 me-1" />}
                        {ROLE_LABELS[user.role] || user.role}
                      </span>
                    </td>
                    <td className="px-5 py-4 hidden md:table-cell">
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${user.is_active ? "bg-green-500" : "bg-slate-300"}`} />
                        <span className={`text-xs ${user.is_active ? "text-green-700" : "text-slate-400"}`}>
                          {user.is_active ? t("admin.users.active") : t("admin.users.inactive")}
                        </span>
                        {user.is_verified && (
                          <UserCheck className="w-3.5 h-3.5 text-blue-500" />
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-4 hidden lg:table-cell">
                      <span className="text-xs text-slate-500">
                        {new Date(user.created_at).toLocaleDateString()}
                      </span>
                    </td>
                    <td className="px-5 py-4 hidden lg:table-cell">
                      <span className="text-xs text-slate-500">{user.trips_shared}</span>
                    </td>
                    <td className="px-5 py-4 text-end">
                      <div className="relative inline-block">
                        <button
                          onClick={() => setActionMenuId(actionMenuId === user.id ? null : user.id)}
                          className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
                        >
                          <MoreHorizontal className="w-4 h-4" />
                        </button>
                        {actionMenuId === user.id && (
                          <div className={`absolute z-20 top-full mt-1 ${dir === "rtl" ? "start-0" : "end-0"} w-48 bg-white rounded-xl border border-slate-200 shadow-lg py-1`}>
                            <button
                              onClick={() => {
                                setEditingUser(user);
                                setEditRole(user.role);
                                setActionMenuId(null);
                              }}
                              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
                            >
                              <Edit className="w-4 h-4" />
                              {t("admin.users.changeRole")}
                            </button>
                            <button
                              onClick={() => handleToggleActive(user)}
                              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
                            >
                              {user.is_active ? <UserX className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                              {user.is_active ? t("admin.users.deactivate") : t("admin.users.activate")}
                            </button>
                            <button
                              onClick={() => handleToggleVerified(user)}
                              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
                            >
                              <Shield className="w-4 h-4" />
                              {user.is_verified ? t("admin.users.unverify") : t("admin.users.verify")}
                            </button>
                            <hr className="my-1 border-slate-100" />
                            <button
                              onClick={() => handleDeleteUser(user)}
                              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                            >
                              <Trash2 className="w-4 h-4" />
                              {t("common.delete")}
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-sm text-slate-400">
                    {t("admin.users.noUsers")}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {data && data.total_pages > 1 && (
          <div className="flex items-center justify-between px-5 py-3.5 border-t border-slate-100 bg-slate-50/50">
            <p className="text-xs text-slate-500">
              {t("admin.users.showing")} {((page - 1) * 15) + 1}–{Math.min(page * 15, data.total)} {t("admin.users.of")} {data.total}
            </p>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page <= 1}
                className="p-1.5 rounded-lg hover:bg-white text-slate-400 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              {Array.from({ length: Math.min(5, data.total_pages) }, (_, i) => {
                const p = i + 1;
                return (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`w-8 h-8 rounded-lg text-xs font-medium transition-colors
                      ${p === page ? "bg-blue-500 text-white shadow-sm" : "hover:bg-white text-slate-500"}`}
                  >
                    {p}
                  </button>
                );
              })}
              <button
                onClick={() => setPage(Math.min(data.total_pages, page + 1))}
                disabled={page >= data.total_pages}
                className="p-1.5 rounded-lg hover:bg-white text-slate-400 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Edit Role Modal */}
      {editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl mx-4">
            <h3 className="text-lg font-bold text-slate-800 mb-1">{t("admin.users.changeRole")}</h3>
            <p className="text-sm text-slate-500 mb-4">
              {editingUser.full_name || editingUser.username} ({editingUser.email})
            </p>
            <div className="space-y-2">
              {["traveler", "creator", "admin"].map((role) => (
                <label
                  key={role}
                  className={`flex items-center gap-3 p-3 rounded-xl border-2 transition-colors cursor-pointer
                    ${editRole === role ? "border-blue-500 bg-blue-50" : "border-slate-100 hover:border-slate-200"}`}
                >
                  <input
                    type="radio"
                    name="role"
                    value={role}
                    checked={editRole === role}
                    onChange={(e) => setEditRole(e.target.value)}
                    className="accent-blue-500"
                  />
                  <div>
                    <p className="text-sm font-medium text-slate-700">{ROLE_LABELS[role]}</p>
                    <p className="text-xs text-slate-400">{t(`admin.users.roleDesc_${role}`)}</p>
                  </div>
                </label>
              ))}
            </div>
            <div className="flex gap-2 mt-5">
              <button
                onClick={() => setEditingUser(null)}
                className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
              >
                {t("common.cancel")}
              </button>
              <button
                onClick={handleSaveRole}
                disabled={saving || editRole === editingUser.role}
                className="flex-1 px-4 py-2.5 rounded-xl bg-blue-500 text-white text-sm font-medium
                           hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {saving ? t("common.loading") : t("common.save")}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Click outside to close action menu */}
      {actionMenuId && (
        <div className="fixed inset-0 z-10" onClick={() => setActionMenuId(null)} />
      )}
    </div>
  );
}

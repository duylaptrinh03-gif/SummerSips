"use client";

import { useState, useEffect, useCallback } from "react";
import { adminService, AdminStats } from "@/services/adminService";
import { ORDER_STATUS_LABEL, OrderStatus } from "@/types/order";
import { formatGia } from "@/utils/formatter";
import { useToastStore } from "@/store/useToastStore";

// ── Status badge ──────────────────────────────────────────────────────────────
const STATUS_COLORS: Record<OrderStatus, string> = {
  pending:    "bg-yellow-100 text-yellow-700",
  preparing:  "bg-blue-100 text-blue-700",
  delivering: "bg-purple-100 text-purple-700",
  completed:  "bg-green-100 text-green-700",
  cancelled:  "bg-red-100 text-red-700",
};

const STATUS_OPTIONS: OrderStatus[] = ["pending", "preparing", "delivering", "completed", "cancelled"];

function StatusBadge({ status }: { status: OrderStatus }) {
  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${STATUS_COLORS[status]}`}>
      {ORDER_STATUS_LABEL[status]}
    </span>
  );
}

// ── Stat card ─────────────────────────────────────────────────────────────────
function StatCard({ label, value, icon, color }: {
  label: string; value: string | number; icon: string; color: string;
}) {
  return (
    <div className="rounded-2xl border p-5 flex items-center gap-4"
      style={{ background: "var(--bg-card)", borderColor: "var(--border-color)" }}>
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${color}`}>
        {icon}
      </div>
      <div>
        <p className="text-xs font-semibold" style={{ color: "var(--text-muted)" }}>{label}</p>
        <p className="text-2xl font-black mt-0.5" style={{ color: "var(--text-primary)" }}>{value}</p>
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function AdminPage() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const addToast = useToastStore((s) => s.addToast);

  const fetchStats = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await adminService.getStats();
      if (res?.data) setStats(res.data);
    } catch {
      addToast("Không thể tải dữ liệu admin", "error");
    } finally {
      setIsLoading(false);
    }
  }, [addToast]);

  useEffect(() => { fetchStats(); }, [fetchStats]);

  const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    setUpdatingId(orderId);
    try {
      await adminService.updateOrderStatus(orderId, newStatus);
      addToast("Đã cập nhật trạng thái đơn hàng", "success");
      await fetchStats();
    } catch {
      addToast("Cập nhật thất bại", "error");
    } finally {
      setUpdatingId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--bg-secondary)" }}>
        <div className="flex flex-col items-center gap-3">
          <span className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-medium" style={{ color: "var(--text-muted)" }}>Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  if (!stats) return null;

  const { overview, recentOrders, topProducts } = stats;

  return (
    <div className="min-h-screen py-10" style={{ background: "var(--bg-secondary)" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        {/* Header */}
        <div className="mb-8 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black" style={{ color: "var(--text-primary)" }}>
              Admin Dashboard
            </h1>
            <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>
              Tổng quan hoạt động cửa hàng
            </p>
          </div>
          <button
            onClick={fetchStats}
            className="px-4 py-2 rounded-xl text-sm font-bold border transition-colors hover:bg-orange-50 hover:border-orange-300 flex items-center gap-1.5"
            style={{ borderColor: "var(--border-color)", color: "var(--text-secondary)" }}
          >
            🔄 Làm mới
          </button>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard label="Tổng đơn hàng" value={overview.totalOrders} icon="📦" color="bg-blue-50" />
          <StatCard label="Chờ xử lý" value={overview.pendingOrders} icon="⏳" color="bg-yellow-50" />
          <StatCard label="Hoàn thành" value={overview.completedOrders} icon="✅" color="bg-green-50" />
          <StatCard label="Doanh thu" value={formatGia(overview.totalRevenue)} icon="💰" color="bg-orange-50" />
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          <StatCard label="Sản phẩm" value={overview.totalProducts} icon="🧋" color="bg-pink-50" />
          <StatCard label="Người dùng" value={overview.totalUsers} icon="👥" color="bg-purple-50" />
          <StatCard label="Đã hủy" value={overview.cancelledOrders} icon="❌" color="bg-red-50" />
          <StatCard label="Đang giao" value={overview.totalOrders - overview.completedOrders - overview.cancelledOrders - overview.pendingOrders} icon="🚚" color="bg-indigo-50" />
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Recent orders */}
          <div className="lg:col-span-2 rounded-2xl border overflow-hidden"
            style={{ background: "var(--bg-card)", borderColor: "var(--border-color)" }}>
            <div className="px-6 py-4 border-b" style={{ borderColor: "var(--border-color)" }}>
              <h2 className="font-black text-lg" style={{ color: "var(--text-primary)" }}>
                Đơn hàng gần nhất
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-xs font-semibold" style={{ color: "var(--text-muted)", background: "var(--bg-secondary)" }}>
                    <th className="px-4 py-3 text-left">Mã đơn</th>
                    <th className="px-4 py-3 text-left">Khách hàng</th>
                    <th className="px-4 py-3 text-left">Tổng tiền</th>
                    <th className="px-4 py-3 text-left">Trạng thái</th>
                    <th className="px-4 py-3 text-left">Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order) => (
                    <tr key={order._id} className="border-t hover:bg-gray-50/50 transition-colors"
                      style={{ borderColor: "var(--border-light)" }}>
                      <td className="px-4 py-3 font-mono text-xs font-semibold" style={{ color: "var(--text-primary)" }}>
                        {order.orderId}
                      </td>
                      <td className="px-4 py-3" style={{ color: "var(--text-secondary)" }}>
                        {order.recipientInfo.fullName}
                      </td>
                      <td className="px-4 py-3 font-bold" style={{ color: "var(--text-primary)" }}>
                        {formatGia(order.totalPrice)}
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge status={order.status} />
                      </td>
                      <td className="px-4 py-3">
                        <select
                          value={order.status}
                          disabled={updatingId === order._id}
                          onChange={(e) => handleStatusChange(order._id, e.target.value as OrderStatus)}
                          className="text-xs px-2 py-1.5 rounded-lg border outline-none cursor-pointer disabled:opacity-50"
                          style={{
                            background: "var(--bg-secondary)",
                            borderColor: "var(--border-color)",
                            color: "var(--text-primary)",
                          }}
                        >
                          {STATUS_OPTIONS.map((s) => (
                            <option key={s} value={s}>{ORDER_STATUS_LABEL[s]}</option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Top products */}
          <div className="rounded-2xl border overflow-hidden"
            style={{ background: "var(--bg-card)", borderColor: "var(--border-color)" }}>
            <div className="px-6 py-4 border-b" style={{ borderColor: "var(--border-color)" }}>
              <h2 className="font-black text-lg" style={{ color: "var(--text-primary)" }}>
                Bán chạy nhất
              </h2>
            </div>
            <div className="p-4 space-y-3">
              {topProducts.map((product, i) => (
                <div key={product._id} className="flex items-center gap-3 p-3 rounded-xl"
                  style={{ background: "var(--bg-secondary)" }}>
                  <span className="w-7 h-7 rounded-full bg-orange-100 text-orange-600 text-xs font-black flex items-center justify-center shrink-0">
                    {i + 1}
                  </span>
                  {product.image ? (
                    <img src={product.image} alt={product.name}
                      className="w-10 h-10 rounded-xl object-cover shrink-0" />
                  ) : (
                    <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-xl shrink-0">
                      🧋
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold truncate" style={{ color: "var(--text-primary)" }}>
                      {product.name}
                    </p>
                    <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                      {product.soldCount} lượt · {formatGia(product.basePrice)}
                    </p>
                  </div>
                </div>
              ))}
              {topProducts.length === 0 && (
                <p className="text-sm text-center py-6" style={{ color: "var(--text-muted)" }}>
                  Chưa có dữ liệu bán hàng
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

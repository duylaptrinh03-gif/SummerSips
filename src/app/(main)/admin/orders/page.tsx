"use client";

import { useState, useEffect, useCallback, Fragment } from "react";
import { orderService } from "@/services/orderService";
import { Order, OrderStatus, ORDER_STATUS_LABEL } from "@/types/order";
import { useToastStore } from "@/store/useToastStore";
import { formatGia } from "@/utils/formatter";
import { calculateItemPrice } from "@/types/cart";

// ── Constants ─────────────────────────────────────────────────────────────────

const STATUS_OPTIONS: OrderStatus[] = [
  "pending", "preparing", "delivering", "completed", "cancelled",
];

const FILTER_OPTIONS: (OrderStatus | "all")[] = ["all", ...STATUS_OPTIONS];

const FILTER_LABELS: Record<OrderStatus | "all", string> = {
  all:        "Tất cả",
  pending:    "Chờ xác nhận",
  preparing:  "Đang pha chế",
  delivering: "Đang giao",
  completed:  "Hoàn thành",
  cancelled:  "Đã hủy",
};

const STATUS_COLORS: Record<OrderStatus, string> = {
  pending:    "bg-yellow-100 text-yellow-700",
  preparing:  "bg-blue-100   text-blue-700",
  delivering: "bg-purple-100 text-purple-700",
  completed:  "bg-green-100  text-green-700",
  cancelled:  "bg-red-100    text-red-700",
};

const STATUS_DOT: Record<OrderStatus, string> = {
  pending:    "bg-yellow-400",
  preparing:  "bg-blue-400",
  delivering: "bg-purple-400",
  completed:  "bg-green-400",
  cancelled:  "bg-red-400",
};

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatDate(iso: string) {
  if (!iso) return "—";
  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit", month: "2-digit", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  }).format(new Date(iso));
}

// ── Sub-components ────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: OrderStatus }) {
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${STATUS_COLORS[status]}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${STATUS_DOT[status]}`} />
      {ORDER_STATUS_LABEL[status]}
    </span>
  );
}

function OrderDetailRow({ order }: { order: Order }) {
  return (
    <tr style={{ background: "var(--bg-secondary)" }}>
      <td colSpan={9} className="px-6 py-5">
        <div className="max-w-2xl space-y-3">
          {/* Recipient */}
          <div className="text-xs font-semibold mb-3 flex flex-wrap gap-x-5 gap-y-1" style={{ color: "var(--text-muted)" }}>
            <span>📍 {order.recipientInfo.address}</span>
            <span>📞 {order.recipientInfo.phoneNumber}</span>
          </div>

          {/* Items */}
          {order.items.map((item, i) => (
            <div
              key={i}
              className="flex items-center gap-3 p-3 rounded-xl"
              style={{ background: "var(--bg-card)", border: "1px solid var(--border-light)" }}
            >
              {item.image ? (
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-10 h-10 rounded-xl object-cover shrink-0"
                />
              ) : (
                <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-lg shrink-0">
                  🧋
                </div>
              )}

              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>
                  {item.name}
                  <span className="ml-2 font-normal text-xs" style={{ color: "var(--text-muted)" }}>
                    ×{item.quantity}
                  </span>
                </p>
                <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
                  Size {item.size}
                  {item.toppings?.length > 0 && (
                    <> · {item.toppings.map((t) => t.name).join(", ")}</>
                  )}
                  {item.iceLevel !== undefined && <> · Đá {item.iceLevel}%</>}
                  {item.sugarLevel !== undefined && <> · Ngọt {item.sugarLevel}%</>}
                  {item.note && <> · "{item.note}"</>}
                </p>
              </div>

              <span className="text-sm font-bold shrink-0" style={{ color: "var(--text-primary)" }}>
                {formatGia(calculateItemPrice(item))}
              </span>
            </div>
          ))}

          {/* Total */}
          <div className="flex justify-end pt-2 pr-1">
            <div className="text-sm font-black" style={{ color: "var(--text-primary)" }}>
              Tổng: {formatGia(order.totalAmount)}
            </div>
          </div>
        </div>
      </td>
    </tr>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function AdminOrdersPage() {
  const addToast = useToastStore((s) => s.addToast);

  const [orders, setOrders]         = useState<Order[]>([]);
  const [loading, setLoading]       = useState(true);
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "all">("all");
  const [search, setSearch]         = useState("");
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const res = await orderService.getAllOrders();
      if (res.statusCode === 200) setOrders(res.data);
    } catch {
      addToast("Không thể tải danh sách đơn hàng", "error");
    } finally {
      setLoading(false);
    }
  }, [addToast]);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  const handleStatusChange = async (order: Order, newStatus: OrderStatus) => {
    if (order.status === newStatus) return;
    setUpdatingId(order._id);
    try {
      await orderService.updateOrderStatus(order._id, { status: newStatus });
      addToast("Đã cập nhật trạng thái đơn hàng", "success");
      setOrders((prev) =>
        prev.map((o) => (o._id === order._id ? { ...o, status: newStatus } : o))
      );
    } catch {
      addToast("Cập nhật thất bại, vui lòng thử lại", "error");
    } finally {
      setUpdatingId(null);
    }
  };

  // Filtered list
  const filtered = orders.filter((order) => {
    if (statusFilter !== "all" && order.status !== statusFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        order.id.toLowerCase().includes(q) ||
        order.recipientInfo.fullName.toLowerCase().includes(q) ||
        order.recipientInfo.phoneNumber.includes(q)
      );
    }
    return true;
  });

  // Count per status
  const counts = STATUS_OPTIONS.reduce<Record<string, number>>((acc, s) => {
    acc[s] = orders.filter((o) => o.status === s).length;
    return acc;
  }, { all: orders.length });

  return (
    <div className="min-h-screen py-8" style={{ background: "var(--bg-secondary)" }}>
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6">

        {/* Header */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black" style={{ color: "var(--text-primary)" }}>
              Quản Lý Đơn Hàng
            </h1>
            <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>
              {orders.length} đơn tổng · {counts.pending ?? 0} chờ xử lý · {counts.delivering ?? 0} đang giao
            </p>
          </div>
          <button
            onClick={fetchOrders}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold border transition-colors hover:bg-orange-50 disabled:opacity-50"
            style={{ borderColor: "var(--border-color)", color: "var(--text-secondary)" }}
          >
            <span className={loading ? "animate-spin" : ""}>🔄</span>
            Làm mới
          </button>
        </div>

        {/* Status filter tabs */}
        <div className="flex gap-2 flex-wrap mb-4">
          {FILTER_OPTIONS.map((f) => {
            const active = statusFilter === f;
            return (
              <button
                key={f}
                onClick={() => setStatusFilter(f)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                  active
                    ? "bg-orange-500 border-orange-500 text-white"
                    : "border-transparent hover:border-orange-200 hover:bg-orange-50"
                }`}
                style={active ? {} : { color: "var(--text-secondary)" }}
              >
                {FILTER_LABELS[f]}
                <span
                  className={`px-1.5 py-0.5 rounded-full text-[10px] font-black ${
                    active ? "bg-white/25 text-white" : "bg-gray-100"
                  }`}
                  style={active ? {} : { color: "var(--text-muted)" }}
                >
                  {counts[f] ?? 0}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search */}
        <div className="mb-6">
          <input
            className="w-full sm:w-80 px-4 py-2.5 rounded-xl border text-sm outline-none focus:border-orange-400 transition-colors"
            style={{
              background: "var(--bg-card)",
              borderColor: "var(--border-color)",
              color: "var(--text-primary)",
            }}
            placeholder="Tìm theo mã đơn, tên KH, SĐT..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Table */}
        <div
          className="rounded-2xl border overflow-hidden"
          style={{ background: "var(--bg-card)", borderColor: "var(--border-color)" }}
        >
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <span className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
              <p className="text-sm font-medium" style={{ color: "var(--text-muted)" }}>Đang tải đơn hàng...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-5xl mb-3">📭</p>
              <p className="font-bold text-lg mb-1" style={{ color: "var(--text-primary)" }}>
                {search || statusFilter !== "all" ? "Không tìm thấy đơn hàng" : "Chưa có đơn hàng nào"}
              </p>
              {(search || statusFilter !== "all") && (
                <button
                  onClick={() => { setSearch(""); setStatusFilter("all"); }}
                  className="mt-3 text-sm font-bold text-orange-500 hover:text-orange-600"
                >
                  Xóa bộ lọc →
                </button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm min-w-[900px]">
                <thead>
                  <tr
                    className="text-[11px] font-bold uppercase tracking-wide"
                    style={{ color: "var(--text-muted)", background: "var(--bg-secondary)" }}
                  >
                    <th className="px-4 py-3 text-left">Mã đơn</th>
                    <th className="px-4 py-3 text-left">Khách hàng</th>
                    <th className="px-4 py-3 text-left">SĐT</th>
                    <th className="px-4 py-3 text-center">Số món</th>
                    <th className="px-4 py-3 text-right">Tổng tiền</th>
                    <th className="px-4 py-3 text-left">Ngày đặt</th>
                    <th className="px-4 py-3 text-left">Trạng thái</th>
                    <th className="px-4 py-3 text-left">Cập nhật</th>
                    <th className="px-4 py-3 text-center">Chi tiết</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((order) => (
                    <Fragment key={order._id}>
                      <tr
                        className="border-t hover:bg-orange-50/30 dark:hover:bg-white/[0.03] transition-colors"
                        style={{ borderColor: "var(--border-light)" }}
                      >
                        {/* Order ID */}
                        <td className="px-4 py-3">
                          <span
                            className="font-mono text-xs font-black"
                            style={{ color: "var(--text-primary)" }}
                          >
                            {order.id}
                          </span>
                        </td>

                        {/* Customer */}
                        <td className="px-4 py-3">
                          <p className="font-semibold" style={{ color: "var(--text-primary)" }}>
                            {order.recipientInfo.fullName}
                          </p>
                          <p
                            className="text-xs mt-0.5 max-w-[140px] truncate"
                            style={{ color: "var(--text-muted)" }}
                            title={order.recipientInfo.address}
                          >
                            {order.recipientInfo.address}
                          </p>
                        </td>

                        {/* Phone */}
                        <td className="px-4 py-3 text-sm" style={{ color: "var(--text-secondary)" }}>
                          {order.recipientInfo.phoneNumber}
                        </td>

                        {/* Items count */}
                        <td className="px-4 py-3 text-center">
                          <span
                            className="inline-block px-2 py-0.5 rounded-full text-xs font-bold bg-orange-50 text-orange-600"
                          >
                            {order.items.length} món
                          </span>
                        </td>

                        {/* Total */}
                        <td className="px-4 py-3 text-right font-black" style={{ color: "var(--text-primary)" }}>
                          {formatGia(order.totalAmount)}
                        </td>

                        {/* Date */}
                        <td className="px-4 py-3 text-xs whitespace-nowrap" style={{ color: "var(--text-muted)" }}>
                          {formatDate(order.createdAt)}
                        </td>

                        {/* Status badge */}
                        <td className="px-4 py-3">
                          <StatusBadge status={order.status} />
                        </td>

                        {/* Status selector */}
                        <td className="px-4 py-3">
                          <select
                            value={order.status}
                            disabled={updatingId === order._id}
                            onChange={(e) => handleStatusChange(order, e.target.value as OrderStatus)}
                            className="text-xs px-2 py-1.5 rounded-lg border outline-none cursor-pointer disabled:opacity-40 transition-colors focus:border-orange-400"
                            style={{
                              background: "var(--bg-secondary)",
                              borderColor: "var(--border-color)",
                              color: "var(--text-primary)",
                            }}
                          >
                            {STATUS_OPTIONS.map((s) => (
                              <option key={s} value={s}>
                                {ORDER_STATUS_LABEL[s]}
                              </option>
                            ))}
                          </select>
                          {updatingId === order._id && (
                            <span className="ml-2 inline-block w-3 h-3 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
                          )}
                        </td>

                        {/* Toggle detail */}
                        <td className="px-4 py-3 text-center">
                          <button
                            onClick={() =>
                              setExpandedId(expandedId === order._id ? null : order._id)
                            }
                            className="px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors hover:bg-blue-50 hover:border-blue-200 hover:text-blue-600"
                            style={{
                              borderColor: "var(--border-color)",
                              color: "var(--text-secondary)",
                            }}
                          >
                            {expandedId === order._id ? "▲ Ẩn" : "▼ Xem"}
                          </button>
                        </td>
                      </tr>

                      {/* Expandable detail row */}
                      {expandedId === order._id && (
                        <OrderDetailRow order={order} />
                      )}
                    </Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Footer count */}
        {!loading && filtered.length > 0 && (
          <p className="text-xs text-center mt-4" style={{ color: "var(--text-muted)" }}>
            Hiển thị {filtered.length} / {orders.length} đơn hàng
          </p>
        )}
      </div>
    </div>
  );
}

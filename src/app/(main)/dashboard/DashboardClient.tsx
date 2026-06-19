"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { LazyStatCard } from "@/components/three";
import { orderService } from "@/services/orderService";
import { userService } from "@/services/userService";
import { Order } from "@/types/order";

const STATUS_VI: Record<string, { label: string; cls: string }> = {
  pending:    { label: "Chờ xác nhận", cls: "bg-yellow-100 text-yellow-700" },
  confirmed:  { label: "Đã xác nhận",  cls: "bg-blue-100 text-blue-700"   },
  processing: { label: "Đang pha chế", cls: "bg-indigo-100 text-indigo-700"},
  delivering: { label: "Đang giao",    cls: "bg-purple-100 text-purple-700"},
  completed:  { label: "Hoàn thành",   cls: "bg-green-100 text-green-700" },
  cancelled:  { label: "Đã hủy",       cls: "bg-red-100 text-red-700"     },
};

function formatDate(iso: string) {
  if (!iso) return "";
  const d = new Date(iso);
  return d.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" });
}

interface Props {
  sessionName: string | null | undefined;
}

export default function DashboardClient({ sessionName }: Props) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [profileName, setProfileName] = useState<string | null>(sessionName ?? null);
  const [loadingOrders, setLoadingOrders] = useState(true);

  useEffect(() => {
    // Fetch real orders
    orderService.getMyOrders()
      .then((res) => { if (res.statusCode === 200) setOrders(res.data); })
      .catch(() => {})
      .finally(() => setLoadingOrders(false));

    // Fetch real profile (may have more up-to-date name than session)
    userService.getMe()
      .then((res) => { if (res?.data?.name) setProfileName(res.data.name); })
      .catch(() => {});
  }, []);

  const recentOrders = orders.slice(0, 5);
  const totalAmount = orders.reduce((s, o) => s + o.totalAmount, 0);

  return (
    <div className="min-h-screen py-10" style={{ background: "var(--bg-secondary)" }}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black mb-2" style={{ color: "var(--text-primary)" }}>
              Chào mừng, {profileName || "Bạn"} 👋
            </h1>
            <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
              Đây là tổng quan tài khoản của bạn hôm nay.
            </p>
          </div>
          <Link
            href="/thuc-don"
            className="px-6 py-2.5 rounded-xl font-bold text-white shadow-lg shadow-orange-200 hover:-translate-y-0.5 transition-all w-fit"
            style={{ background: "linear-gradient(135deg, #f97316, #ec4899)" }}
          >
            Đặt Nước Ngay 🍹
          </Link>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="relative rounded-3xl overflow-hidden border bg-white dark:bg-gray-800 shadow-sm" style={{ borderColor: "var(--border-color)" }}>
            <LazyStatCard
              color="#f97316"
              label="Tổng Đơn Hàng"
              value={loadingOrders ? "…" : String(orders.length)}
            />
          </div>
          <div className="relative rounded-3xl overflow-hidden border bg-white dark:bg-gray-800 shadow-sm" style={{ borderColor: "var(--border-color)" }}>
            <LazyStatCard
              color="#ec4899"
              label="Tổng Chi Tiêu"
              value={loadingOrders ? "…" : `${(totalAmount / 1000).toFixed(0)}k`}
            />
          </div>
          <div className="relative rounded-3xl overflow-hidden border bg-white dark:bg-gray-800 shadow-sm" style={{ borderColor: "var(--border-color)" }}>
            <LazyStatCard
              color="#8b5cf6"
              label="Hoàn Thành"
              value={loadingOrders ? "…" : String(orders.filter(o => o.status === "completed").length)}
            />
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Orders */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 border shadow-sm" style={{ borderColor: "var(--border-color)" }}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold" style={{ color: "var(--text-primary)" }}>Đơn Hàng Gần Đây</h2>
                <Link href="/don-hang" className="text-sm font-semibold text-orange-500 hover:text-orange-600">
                  Xem tất cả
                </Link>
              </div>

              {loadingOrders ? (
                <div className="flex justify-center py-12">
                  <span className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
                </div>
              ) : recentOrders.length === 0 ? (
                <div className="text-center py-10">
                  <p className="text-4xl mb-3">📭</p>
                  <p className="text-sm" style={{ color: "var(--text-secondary)" }}>Bạn chưa có đơn hàng nào.</p>
                  <Link href="/thuc-don" className="inline-block mt-4 text-sm font-bold text-orange-500 hover:text-orange-600">
                    Đặt ngay →
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {recentOrders.map((order) => {
                    const statusInfo = STATUS_VI[order.status] ?? { label: order.status, cls: "bg-gray-100 text-gray-600" };
                    return (
                      <div key={order._id} className="flex items-center justify-between p-4 rounded-2xl bg-gray-50 dark:bg-gray-900 border border-transparent hover:border-orange-100 transition-colors">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center text-xl shrink-0">
                            🥤
                          </div>
                          <div>
                            <p className="font-bold text-sm" style={{ color: "var(--text-primary)" }}>{order.id}</p>
                            <p className="text-xs mt-0.5" style={{ color: "var(--text-secondary)" }}>
                              {formatDate(order.createdAt)} • {order.items.reduce((s, i) => s + i.quantity, 0)} món
                            </p>
                          </div>
                        </div>
                        <div className="text-right shrink-0 ml-4">
                          <p className="font-bold text-sm" style={{ color: "var(--text-primary)" }}>
                            {order.totalAmount.toLocaleString("vi-VN")}đ
                          </p>
                          <span className={`inline-block mt-1 px-2 py-0.5 text-[10px] font-bold rounded-full ${statusInfo.cls}`}>
                            {statusInfo.label}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Quick Stats summary */}
            <div className="bg-gradient-to-br from-orange-500 to-pink-500 rounded-3xl p-6 text-white shadow-lg">
              <h3 className="font-bold mb-2">Thống Kê Chi Tiêu 📊</h3>
              <p className="text-3xl font-black mb-1">
                {loadingOrders ? "…" : `${(totalAmount / 1000).toFixed(0)}k`}đ
              </p>
              <p className="text-sm text-white/80">
                Trên {orders.length} đơn hàng
              </p>
            </div>

            {/* Quick Actions */}
            <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 border shadow-sm" style={{ borderColor: "var(--border-color)" }}>
              <h3 className="font-bold mb-4" style={{ color: "var(--text-primary)" }}>Thao Tác Nhanh</h3>
              <div className="grid grid-cols-2 gap-3">
                <Link href="/thuc-don?category=tra-sua" className="p-3 rounded-2xl bg-gray-50 dark:bg-gray-900 flex flex-col items-center justify-center gap-2 hover:bg-orange-50 transition-colors group">
                  <span className="text-2xl group-hover:scale-110 transition-transform">🧋</span>
                  <span className="text-xs font-semibold" style={{ color: "var(--text-secondary)" }}>Trà Sữa</span>
                </Link>
                <Link href="/thuc-don?category=tra-trai-cay" className="p-3 rounded-2xl bg-gray-50 dark:bg-gray-900 flex flex-col items-center justify-center gap-2 hover:bg-orange-50 transition-colors group">
                  <span className="text-2xl group-hover:scale-110 transition-transform">🍹</span>
                  <span className="text-xs font-semibold" style={{ color: "var(--text-secondary)" }}>Trà Trái Cây</span>
                </Link>
                <Link href="/cai-dat" className="p-3 rounded-2xl bg-gray-50 dark:bg-gray-900 flex flex-col items-center justify-center gap-2 hover:bg-orange-50 transition-colors group">
                  <span className="text-2xl group-hover:scale-110 transition-transform">⚙️</span>
                  <span className="text-xs font-semibold" style={{ color: "var(--text-secondary)" }}>Cài Đặt</span>
                </Link>
                <Link href="/don-hang" className="p-3 rounded-2xl bg-gray-50 dark:bg-gray-900 flex flex-col items-center justify-center gap-2 hover:bg-orange-50 transition-colors group">
                  <span className="text-2xl group-hover:scale-110 transition-transform">📦</span>
                  <span className="text-xs font-semibold" style={{ color: "var(--text-secondary)" }}>Theo Dõi</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

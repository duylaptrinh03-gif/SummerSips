import type { Metadata } from "next";
import Link from "next/link";
import { LazyStatCard } from "@/components/three";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Dashboard | SummerSips",
  description: "Tổng quan tài khoản, thống kê đơn hàng và thao tác nhanh.",
};

// ── Mock Data ─────────────────────────────────────────────────────────────────
const RECENT_ORDERS = [
  { id: "ORD-1713161234567", date: "15/04/2026", items: 3, total: 125000, status: "completed" },
  { id: "ORD-1713161239999", date: "10/04/2026", items: 1, total: 45000, status: "completed" },
];

export default async function DashboardPage() {
  const session = await auth();
  
  if (!session) {
    redirect("/dang-nhap");
  }

  const user = session.user;

  return (
    <div className="min-h-screen py-10" style={{ background: "var(--bg-secondary)" }}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black mb-2" style={{ color: "var(--text-primary)" }}>
              Chào mừng, {user.name || "Bạn"} 👋
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

        {/* 3D Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="relative rounded-3xl overflow-hidden border bg-white dark:bg-gray-800 shadow-sm" style={{ borderColor: "var(--border-color)" }}>
            <LazyStatCard color="#f97316" label="Tổng Đơn Hàng" value="24" />
          </div>
          <div className="relative rounded-3xl overflow-hidden border bg-white dark:bg-gray-800 shadow-sm" style={{ borderColor: "var(--border-color)" }}>
            <LazyStatCard color="#ec4899" label="Điểm Tích Lũy" value="1,250" />
          </div>
          <div className="relative rounded-3xl overflow-hidden border bg-white dark:bg-gray-800 shadow-sm" style={{ borderColor: "var(--border-color)" }}>
            <LazyStatCard color="#8b5cf6" label="Voucher Của Bạn" value="3" />
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Recent Orders */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 border shadow-sm" style={{ borderColor: "var(--border-color)" }}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold" style={{ color: "var(--text-primary)" }}>Đơn Hàng Gần Đây</h2>
                <Link href="/don-hang" className="text-sm font-semibold text-orange-500 hover:text-orange-600">
                  Xem tất cả
                </Link>
              </div>

              {RECENT_ORDERS.length > 0 ? (
                <div className="space-y-4">
                  {RECENT_ORDERS.map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-4 rounded-2xl bg-gray-50 dark:bg-gray-900 border border-transparent hover:border-orange-100 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center text-xl">
                          🥤
                        </div>
                        <div>
                          <p className="font-bold text-sm" style={{ color: "var(--text-primary)" }}>{order.id}</p>
                          <p className="text-xs mt-0.5" style={{ color: "var(--text-secondary)" }}>
                            {order.date} • {order.items} món
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-sm" style={{ color: "var(--text-primary)" }}>
                          {order.total.toLocaleString("vi-VN")}đ
                        </p>
                        <span className="inline-block mt-1 px-2 py-0.5 text-[10px] font-bold rounded-full bg-green-100 text-green-700">
                          Hoàn thành
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10">
                  <p className="text-4xl mb-3">📭</p>
                  <p className="text-sm" style={{ color: "var(--text-secondary)" }}>Bạn chưa có đơn hàng nào.</p>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Quick Actions & Rewards */}
          <div className="space-y-6">
            {/* Rewards Card */}
            <div className="bg-gradient-to-br from-orange-500 to-pink-500 rounded-3xl p-6 text-white shadow-lg">
              <h3 className="font-bold mb-2">Thẻ Thành Viên Vàng 👑</h3>
              <p className="text-sm text-white/80 mb-4">Còn 250 điểm để thăng hạng Bạch Kim!</p>
              
              <div className="w-full h-2 bg-black/20 rounded-full overflow-hidden mb-2">
                <div className="h-full bg-white rounded-full" style={{ width: "80%" }} />
              </div>
              <div className="flex justify-between text-xs font-bold">
                <span>1,250</span>
                <span>1,500</span>
              </div>
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

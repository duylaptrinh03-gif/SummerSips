"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { getOrders } from "@/utils/localStorage";
import { Order } from "@/types/order";
import { Suspense } from "react";

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function OrdersContent() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [mounted, setMounted] = useState(false);
  const searchParams = useSearchParams();
  const newOrderId = searchParams.get("new");

  useEffect(() => {
    setOrders(getOrders());
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="w-8 h-8 border-4 border-orange-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="text-center py-24 px-4">
        <div className="text-7xl mb-6 animate-[float_3s_ease-in-out_infinite]">📋</div>
        <h2 className="text-2xl font-black text-gray-900 mb-3">Chưa có đơn hàng nào</h2>
        <p className="text-gray-500 mb-8 max-w-sm mx-auto">
          Hãy đặt hàng để bắt đầu lịch sử đặt hàng của bạn nhé!
        </p>
        <Link
          href="/shop"
          id="orders-empty-shop-link"
          className="px-8 py-4 bg-gradient-to-r from-orange-500 to-pink-500 text-white font-bold rounded-2xl hover:shadow-lg hover:shadow-orange-300/50 hover:-translate-y-0.5 transition-all"
        >
          Đặt Hàng Ngay 🍹
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-5 max-w-3xl mx-auto">
      {/* Success banner for new order */}
      {newOrderId && (
        <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-2xl animate-[fadeInDown_0.5s_ease-out]">
          <span className="text-2xl">🎉</span>
          <div>
            <p className="font-bold text-green-700">Đặt hàng thành công!</p>
            <p className="text-sm text-green-600">Mã đơn hàng: <span className="font-mono font-semibold">{newOrderId}</span></p>
          </div>
        </div>
      )}

      {orders.map((order, idx) => (
        <div
          key={order.id}
          id={`order-card-${order.id}`}
          className={`bg-white rounded-3xl overflow-hidden shadow-sm border ${
            order.id === newOrderId ? "border-orange-300 shadow-orange-100" : "border-gray-100"
          }`}
        >
          {/* Order header */}
          <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 bg-gradient-to-r from-orange-50 to-pink-50 border-b border-gray-100">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-gray-400">{order.id}</span>
                {idx === 0 && (
                  <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-orange-100 text-orange-600">
                    Mới nhất
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-500 mt-0.5">{formatDate(order.createdAt)}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-400">Tổng tiền</p>
              <p className="font-black text-lg bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">
                {order.total.toLocaleString("vi-VN")}đ
              </p>
            </div>
          </div>

          {/* Customer info */}
          <div className="px-5 py-4 border-b border-gray-50">
            <div className="flex flex-wrap gap-4 text-sm">
              <div className="flex items-center gap-1.5 text-gray-600">
                <span>👤</span>
                <span className="font-semibold">{order.customerName}</span>
              </div>
              <div className="flex items-center gap-1.5 text-gray-600">
                <span>📞</span>
                <span>{order.phone}</span>
              </div>
            </div>
          </div>

          {/* Items */}
          <div className="px-5 py-4">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">
              Sản phẩm đã đặt
            </p>
            <div className="space-y-2">
              {order.items.map((item) => (
                <div key={item.id} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 flex items-center justify-center rounded-full bg-orange-100 text-orange-600 text-xs font-bold shrink-0">
                      {item.quantity}
                    </span>
                    <span className="text-gray-700">{item.name}</span>
                  </div>
                  <span className="font-semibold text-gray-600 shrink-0">
                    {(item.price * item.quantity).toLocaleString("vi-VN")}đ
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Status */}
          <div className="px-5 pb-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-100 text-green-600 text-xs font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              Đang xử lý
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function OrdersPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-pink-50">
      <Navbar />

      <main className="pt-16 pb-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-black text-gray-900">Lịch Sử Đơn Hàng</h1>
              <p className="text-gray-400 text-sm mt-1">Tất cả đơn hàng của bạn</p>
            </div>
            <Link
              href="/shop"
              id="orders-new-order-btn"
              className="px-5 py-2.5 bg-gradient-to-r from-orange-500 to-pink-500 text-white font-bold text-sm rounded-full hover:shadow-lg hover:shadow-orange-300/50 hover:-translate-y-0.5 transition-all"
            >
              + Đặt hàng mới
            </Link>
          </div>

          <Suspense fallback={
            <div className="flex justify-center py-24">
              <div className="w-8 h-8 border-4 border-orange-400 border-t-transparent rounded-full animate-spin" />
            </div>
          }>
            <OrdersContent />
          </Suspense>
        </div>
      </main>
    </div>
  );
}

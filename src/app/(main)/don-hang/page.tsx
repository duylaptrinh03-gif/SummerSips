"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import Link from "next/link";
import { orderService } from "@/services/orderService";
import { Order } from "@/types/order";
import { OrderCard } from "@/components/order/OrderCard";
import { SuccessAnimation } from "@/components/order/SuccessAnimation";

// ── Orders content (needs Suspense for useSearchParams) ────────────────────
function OrdersContent() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  
  const searchParams = useSearchParams();
  const newOrderId = searchParams.get("new");

  const fetchOrders = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await orderService.getAllOrders();
      if (res.statusCode === 200) {
        setOrders(res.data);
      } else {
        setOrders([]);
      }
    } catch (err) {
      setOrders([]);
      setError(err instanceof Error ? err.message : "Có lỗi xảy ra khi kết nối đến máy chủ.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Show success animation when redirected from checkout
  useEffect(() => {
    if (newOrderId) {
      setShowSuccess(true);
      const timer = setTimeout(() => setShowSuccess(false), 4500);
      return () => clearTimeout(timer);
    }
  }, [newOrderId]);

  // ── Loading ──────────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="flex justify-center p-20">
        <div className="flex flex-col items-center gap-4">
          <span className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-medium" style={{ color: "var(--text-muted)" }}>
            Đang tải đơn hàng...
          </p>
        </div>
      </div>
    );
  }

  // ── Error ────────────────────────────────────────────────────────────────
  if (error) {
    return (
      <div
        className="text-center py-16 rounded-3xl border mt-8"
        style={{ background: "var(--bg-card)", borderColor: "var(--border-color)" }}
      >
        <span className="text-5xl mb-4 inline-block">⚠️</span>
        <h2 className="text-xl font-black mb-2" style={{ color: "var(--text-primary)" }}>
          Không thể tải đơn hàng
        </h2>
        <p className="mb-6 max-w-sm mx-auto text-sm" style={{ color: "var(--text-secondary)" }}>
          {error}
        </p>
        <button
          onClick={fetchOrders}
          className="px-6 py-3 rounded-xl font-bold text-sm bg-orange-500 text-white hover:bg-orange-600 transition-colors"
        >
          Thử lại
        </button>
      </div>
    );
  }

  // ── Empty ────────────────────────────────────────────────────────────────
  if (orders.length === 0) {
    return (
      <div
        className="text-center py-20 rounded-3xl border mt-8"
        style={{ background: "var(--bg-card)", borderColor: "var(--border-color)" }}
      >
        <span className="text-6xl mb-6 opacity-80 inline-block grayscale">📝</span>
        <h2 className="text-2xl font-black mb-2" style={{ color: "var(--text-primary)" }}>
          Chưa có đơn hàng nào!
        </h2>
        <p className="mb-8 max-w-sm mx-auto" style={{ color: "var(--text-secondary)" }}>
          Cùng bắt đầu hành trình hương vị cùng SummerSips ngày hôm nay nhé.
        </p>
        <Link
          href="/thuc-don"
          className="inline-flex px-8 py-3.5 bg-orange-50 text-orange-600 font-bold rounded-xl hover:bg-orange-100 transition-colors"
        >
          Xem Thực Đơn
        </Link>
      </div>
    );
  }

  // ── List ─────────────────────────────────────────────────────────────────
  return (
    <>
      <SuccessAnimation show={showSuccess} orderId={newOrderId ?? undefined} />

      <div className="space-y-5">
        {orders.map((order) => (
          <OrderCard key={order._id} order={order} isNew={order.id === newOrderId} />
        ))}
      </div>

      <div className="mt-8 flex justify-center">
        <button
          onClick={fetchOrders}
          className="px-6 py-2.5 rounded-xl text-sm font-semibold border transition-colors hover:bg-orange-50 hover:border-orange-300"
          style={{ borderColor: "var(--border-color)", color: "var(--text-secondary)" }}
        >
          🔄 Làm mới danh sách
        </button>
      </div>
    </>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────
export default function PageOrder() {
  return (
    <div className="min-h-screen py-10" style={{ background: "var(--bg-secondary)" }}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black" style={{ color: "var(--text-primary)" }}>
              Lịch Sử Đơn Hàng
            </h1>
            <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>
              Theo dõi và quản lý các đơn hàng của bạn
            </p>
          </div>
          <Link
            href="/thuc-don"
            className="text-sm font-bold text-orange-500 hover:text-orange-600 transition-colors"
          >
            + Đặt thêm món
          </Link>
        </div>

        <Suspense
          fallback={
            <div className="flex justify-center p-20">
              <span className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
            </div>
          }
        >
          <OrdersContent />
        </Suspense>
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import Link from "next/link";
import { AnimatePresence } from "framer-motion";
import { orderService } from "@/services/orderService";
import { Order } from "@/types/order";
import { OrderCard } from "@/components/order/OrderCard";
import { OrderListSkeleton } from "@/components/ui/Skeleton";
import { SuccessAnimation } from "@/components/order/SuccessAnimation";
import { RatingDialog } from "@/components/order/RatingDialog";
import { useReviewStore } from "@/store/useReviewStore";
import { useOrderSocket, OrderStatusUpdatedEvent } from "@/hooks/useOrderSocket";

// ── Orders content (needs Suspense for useSearchParams) ────────────────────
function OrdersContent() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [ratingOrder, setRatingOrder] = useState<Order | null>(null);
  const [pendingRatingId, setPendingRatingId] = useState<string | null>(null);
  const hasReviewed = useReviewStore((s) => s.hasReviewed);

  const searchParams = useSearchParams();
  const newOrderId = searchParams.get("new");

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const PAGE_LIMIT = 10;

  const fetchOrders = useCallback(async (p = 1) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await orderService.getMyOrders(p, PAGE_LIMIT);
      setOrders(res.orders);
      setTotalPages(res.totalPages);
    } catch (err) {
      setOrders([]);
      setError(err instanceof Error ? err.message : "Có lỗi xảy ra khi kết nối đến máy chủ.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders(page);
  }, [page, fetchOrders]);

  // Show success animation when redirected from checkout
  useEffect(() => {
    if (newOrderId) {
      setShowSuccess(true);
      const timer = setTimeout(() => setShowSuccess(false), 4500);
      return () => clearTimeout(timer);
    }
  }, [newOrderId]);

  // Khi pendingRatingId có giá trị, tìm order tương ứng và show dialog
  useEffect(() => {
    if (!pendingRatingId) return;
    const order = orders.find((o) => o.id === pendingRatingId || o._id === pendingRatingId);
    if (order && !hasReviewed(order._id)) {
      setRatingOrder(order);
    }
    setPendingRatingId(null);
  }, [orders, pendingRatingId, hasReviewed]);

  // Cập nhật status order trong state khi nhận WebSocket event
  const handleOrderStatusUpdated = useCallback((event: OrderStatusUpdatedEvent) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === event.orderId
          ? { ...order, status: event.newStatus }
          : order,
      ),
    );
    // Trigger rating dialog khi đơn hoàn thành
    if (event.newStatus === "completed") {
      setPendingRatingId(event.orderId);
    }
  }, []);

  useOrderSocket(handleOrderStatusUpdated);

  // ── Loading ──────────────────────────────────────────────────────────────
  if (isLoading) {
    return <OrderListSkeleton count={4} />;
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
          onClick={() => fetchOrders(page)}
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
          <OrderCard
            key={order._id}
            order={order}
            isNew={order.id === newOrderId}
            onCancelled={(id) =>
              setOrders((prev) =>
                prev.map((o) => (o._id === id ? { ...o, status: "cancelled" } : o))
              )
            }
            onRate={(o) => setRatingOrder(o)}
          />
        ))}
      </div>

      {/* Rating dialog */}
      <AnimatePresence>
        {ratingOrder && (
          <RatingDialog
            key={ratingOrder._id}
            orderId={ratingOrder._id}
            orderCode={ratingOrder.id}
            items={ratingOrder.items}
            onClose={() => setRatingOrder(null)}
          />
        )}
      </AnimatePresence>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-8 flex items-center justify-center gap-3">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-4 py-2 rounded-xl text-sm font-bold border transition-colors disabled:opacity-40 hover:bg-orange-50"
            style={{ borderColor: "var(--border-color)", color: "var(--text-secondary)" }}
          >
            ← Trước
          </button>
          <span className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
            Trang {page} / {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-4 py-2 rounded-xl text-sm font-bold border transition-colors disabled:opacity-40 hover:bg-orange-50"
            style={{ borderColor: "var(--border-color)", color: "var(--text-secondary)" }}
          >
            Sau →
          </button>
        </div>
      )}

      {/* Refresh */}
      <div className="mt-4 flex justify-center">
        <button
          onClick={() => fetchOrders(page)}
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

"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { orderService } from "@/services/orderService";
import { Order, ORDER_STATUS_LABEL } from "@/types/order";
import { formatGia } from "@/utils/formatter";
import { calculateItemPrice } from "@/types/cart";

function formatDate(iso: string) {
  if (!iso) return "—";
  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso));
}

const STATUS_COLORS: Record<string, string> = {
  pending:    "bg-amber-100 text-amber-700",
  preparing:  "bg-blue-100 text-blue-700",
  delivering: "bg-violet-100 text-violet-700",
  completed:  "bg-emerald-100 text-emerald-700",
  cancelled:  "bg-red-100 text-red-700",
};

export default function InvoicePage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    orderService
      .getOrderById(id)
      .then((res) => setOrder(res.data))
      .catch(() => setError("Không tìm thấy đơn hàng"))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--bg-secondary)" }}>
        <span className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4" style={{ background: "var(--bg-secondary)" }}>
        <p className="text-4xl">😕</p>
        <p className="font-bold" style={{ color: "var(--text-primary)" }}>{error ?? "Đơn hàng không tồn tại"}</p>
        <Link href="/don-hang" className="text-sm font-bold text-orange-500 hover:text-orange-600">
          ← Quay lại đơn hàng
        </Link>
      </div>
    );
  }

  const statusColor = STATUS_COLORS[order.status] ?? "bg-gray-100 text-gray-700";

  return (
    <>
      {/* ── Print styles ─────────────────────────────────────────────────── */}
      <style>{`
        @media print {
          body * { visibility: hidden; }
          #invoice-print, #invoice-print * { visibility: visible; }
          #invoice-print { position: absolute; inset: 0; }
          .no-print { display: none !important; }
          @page { margin: 1cm; size: A4; }
        }
      `}</style>

      <div className="min-h-screen py-10" style={{ background: "var(--bg-secondary)" }}>
        <div className="max-w-2xl mx-auto px-4 sm:px-6">

          {/* Toolbar (hidden when printing) */}
          <div className="no-print mb-6 flex items-center justify-between gap-4">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-sm font-bold transition-colors hover:opacity-70"
              style={{ color: "var(--text-secondary)" }}
            >
              ← Quay lại
            </button>
            <button
              onClick={() => window.print()}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold text-white transition-all hover:-translate-y-0.5"
              style={{ background: "linear-gradient(135deg, #f97316, #ec4899)" }}
            >
              🖨️ In hóa đơn
            </button>
          </div>

          {/* Invoice card */}
          <div
            id="invoice-print"
            className="rounded-3xl border overflow-hidden"
            style={{ background: "var(--bg-card)", borderColor: "var(--border-color)" }}
          >
            {/* Header */}
            <div
              className="px-8 py-6 text-center border-b"
              style={{ background: "linear-gradient(135deg, #fff7ed, #fdf2f8)", borderColor: "var(--border-color)" }}
            >
              <p className="text-2xl font-black bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent mb-1">
                ☀️ SummerSips
              </p>
              <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                Thức uống tươi mát cho mọi khoảnh khắc
              </p>
              <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>
                summersips.vn · support@summersips.vn
              </p>
            </div>

            {/* Order meta */}
            <div className="px-8 py-5 border-b" style={{ borderColor: "var(--border-color)" }}>
              <div className="flex flex-col sm:flex-row justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-widest font-bold mb-1" style={{ color: "var(--text-muted)" }}>
                    Hóa đơn
                  </p>
                  <p className="font-mono text-lg font-black" style={{ color: "var(--text-primary)" }}>
                    {order.id}
                  </p>
                  <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>
                    {formatDate(order.createdAt)}
                  </p>
                </div>
                <div className="sm:text-right">
                  <p className="text-xs uppercase tracking-widest font-bold mb-1" style={{ color: "var(--text-muted)" }}>
                    Trạng thái
                  </p>
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${statusColor}`}>
                    {ORDER_STATUS_LABEL[order.status]}
                  </span>
                </div>
              </div>
            </div>

            {/* Recipient */}
            <div className="px-8 py-5 border-b" style={{ borderColor: "var(--border-color)" }}>
              <p className="text-xs uppercase tracking-widest font-bold mb-3" style={{ color: "var(--text-muted)" }}>
                Thông tin giao hàng
              </p>
              <div className="space-y-1.5 text-sm" style={{ color: "var(--text-secondary)" }}>
                <p><span className="font-semibold">Người nhận:</span> {order.recipientInfo.fullName}</p>
                <p><span className="font-semibold">Điện thoại:</span> {order.recipientInfo.phoneNumber}</p>
                <p><span className="font-semibold">Địa chỉ:</span> {order.recipientInfo.address}</p>
              </div>
            </div>

            {/* Items */}
            <div className="px-8 py-5 border-b" style={{ borderColor: "var(--border-color)" }}>
              <p className="text-xs uppercase tracking-widest font-bold mb-4" style={{ color: "var(--text-muted)" }}>
                Chi tiết đơn hàng
              </p>

              {/* Table header */}
              <div
                className="grid grid-cols-12 text-[11px] font-bold uppercase tracking-wide pb-2 border-b"
                style={{ color: "var(--text-muted)", borderColor: "var(--border-light)" }}
              >
                <span className="col-span-6">Sản phẩm</span>
                <span className="col-span-2 text-center">SL</span>
                <span className="col-span-2 text-right">Đơn giá</span>
                <span className="col-span-2 text-right">Thành tiền</span>
              </div>

              {/* Rows */}
              <div className="divide-y" style={{ borderColor: "var(--border-light)" }}>
                {order.items.map((item, i) => (
                  <div key={i} className="grid grid-cols-12 py-3 items-center gap-2">
                    <div className="col-span-6 flex items-center gap-3">
                      <div
                        className="relative w-10 h-10 rounded-xl overflow-hidden shrink-0 border"
                        style={{ borderColor: "var(--border-color)" }}
                      >
                        {item.image ? (
                          <Image src={item.image} alt={item.name} fill className="object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-lg" style={{ background: "var(--bg-secondary)" }}>
                            🧋
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>{item.name}</p>
                        <p className="text-[11px]" style={{ color: "var(--text-muted)" }}>
                          Size {item.size}
                          {item.toppings?.length > 0 && ` · ${item.toppings.map((t) => t.name).join(", ")}`}
                          {item.sugarLevel !== 100 && ` · Ngọt ${item.sugarLevel}%`}
                          {item.iceLevel !== 100 && ` · Đá ${item.iceLevel}%`}
                        </p>
                      </div>
                    </div>
                    <div className="col-span-2 text-center text-sm font-semibold" style={{ color: "var(--text-secondary)" }}>
                      ×{item.quantity}
                    </div>
                    <div className="col-span-2 text-right text-sm" style={{ color: "var(--text-secondary)" }}>
                      {formatGia(item.basePrice + item.sizeExtraPrice + (item.toppings?.reduce((s, t) => s + t.price, 0) ?? 0))}
                    </div>
                    <div className="col-span-2 text-right text-sm font-bold" style={{ color: "var(--text-primary)" }}>
                      {formatGia(calculateItemPrice(item))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Price summary */}
            <div className="px-8 py-5 border-b" style={{ borderColor: "var(--border-color)" }}>
              <div className="space-y-2 text-sm max-w-xs ml-auto">
                <div className="flex justify-between">
                  <span style={{ color: "var(--text-muted)" }}>Tạm tính</span>
                  <span style={{ color: "var(--text-secondary)" }}>{formatGia(order.totalAmount)}</span>
                </div>
                <div className="flex justify-between">
                  <span style={{ color: "var(--text-muted)" }}>Phí giao hàng</span>
                  <span style={{ color: order.deliveryFee === 0 ? "#10b981" : "var(--text-secondary)" }}>
                    {order.deliveryFee === 0 ? "Miễn phí" : formatGia(order.deliveryFee)}
                  </span>
                </div>
                {order.discountAmount > 0 && (
                  <div className="flex justify-between">
                    <span style={{ color: "var(--text-muted)" }}>
                      Giảm giá{order.couponCode ? ` (${order.couponCode})` : ""}
                    </span>
                    <span className="text-emerald-600 font-semibold">−{formatGia(order.discountAmount)}</span>
                  </div>
                )}
                <div
                  className="flex justify-between pt-3 border-t font-black text-base"
                  style={{ borderColor: "var(--border-color)" }}
                >
                  <span style={{ color: "var(--text-primary)" }}>Tổng thanh toán</span>
                  <span className="bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">
                    {formatGia(order.finalAmount ?? order.totalAmount)}
                  </span>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-8 py-5 text-center" style={{ background: "var(--bg-secondary)" }}>
              <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                Cảm ơn bạn đã tin tưởng SummerSips! 🧡
              </p>
              <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>
                Mọi thắc mắc vui lòng liên hệ support@summersips.vn
              </p>
            </div>
          </div>

          {/* Back button */}
          <div className="no-print mt-6 flex justify-center">
            <Link
              href="/don-hang"
              className="px-6 py-2.5 rounded-xl text-sm font-semibold border transition-colors hover:bg-orange-50 hover:border-orange-300"
              style={{ borderColor: "var(--border-color)", color: "var(--text-secondary)" }}
            >
              ← Về lịch sử đơn hàng
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

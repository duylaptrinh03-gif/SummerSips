"use client";

import { Order, ORDER_STATUS_LABEL } from "@/types/order";
import { formatNgayGio, formatGia } from "@/utils/formatter";
import { calculateItemPrice } from "@/types/cart";
import Image from "next/image";
import { OrderTimeline } from "./OrderTimeline";

interface OrderCardProps {
  order: Order;
  isNew?: boolean;
}

export function OrderCard({ order, isNew }: OrderCardProps) {
  const statusConfig: Record<string, { cls: string; dot: string }> = {
    pending:    { cls: "bg-amber-100 text-amber-700 border-amber-200",      dot: "bg-amber-400" },
    preparing:  { cls: "bg-blue-100 text-blue-700 border-blue-200",         dot: "bg-blue-400" },
    delivering: { cls: "bg-violet-100 text-violet-700 border-violet-200",   dot: "bg-violet-400" },
    completed:  { cls: "bg-emerald-100 text-emerald-700 border-emerald-200", dot: "bg-emerald-400" },
    cancelled:  { cls: "bg-red-100 text-red-700 border-red-200",            dot: "bg-red-400" },
  };

  const cfg = statusConfig[order.status] ?? {
    cls: "bg-gray-100 text-gray-700 border-gray-200",
    dot: "bg-gray-400",
  };
  const isPending =
    order.status === "pending" || order.status === "preparing";

  return (
    <div
      className="rounded-3xl overflow-hidden border transition-all"
      style={{
        background: "var(--bg-card)",
        borderColor: isNew ? "#f97316" : "var(--border-color)",
        boxShadow: isNew
          ? "0 0 0 2px rgba(249,115,22,0.15), var(--shadow-md)"
          : "var(--shadow-sm)",
      }}
    >
      {/* Header */}
      <div
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-4 border-b"
        style={{ background: "var(--bg-secondary)", borderColor: "var(--border-color)" }}
      >
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono font-bold" style={{ color: "var(--text-muted)" }}>
              {order.id}
            </span>
            {isNew && (
              <span className="px-2 py-0.5 text-[10px] font-black rounded-full bg-gradient-to-r from-orange-500 to-pink-500 text-white animate-pulse">
                MỚI
              </span>
            )}
          </div>
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
            {formatNgayGio(order.createdAt)}
          </p>
        </div>

        <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center">
          <span className="text-xs hidden sm:block" style={{ color: "var(--text-muted)" }}>
            Tổng cộng
          </span>
          <span className="font-black text-xl bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">
            {formatGia(order.totalAmount)}
          </span>
        </div>
      </div>

      {/* Timeline */}
      {order.status !== "cancelled" && (
        <div className="px-5 py-4 border-b" style={{ borderColor: "var(--border-color)" }}>
          <p
            className="text-[11px] font-black uppercase tracking-widest mb-4"
            style={{ color: "var(--text-muted)" }}
          >
            Trạng thái đơn hàng
          </p>
          <OrderTimeline currentStatus={order.status} />
        </div>
      )}

      {/* Delivery info */}
      <div className="px-5 py-4 border-b" style={{ borderColor: "var(--border-color)" }}>
        <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
          {[
            { icon: "👤", value: order.recipientInfo.fullName },
            { icon: "📞", value: order.recipientInfo.phoneNumber },
            { icon: "📍", value: order.recipientInfo.address },
          ].map((info, i) => (
            <div key={i} className="flex items-center gap-2">
              <span
                className="w-6 h-6 flex items-center justify-center rounded-full text-sm"
                style={{ background: "var(--bg-secondary)" }}
              >
                {info.icon}
              </span>
              <span className="font-medium" style={{ color: "var(--text-secondary)" }}>
                {info.value}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Items */}
      <div className="px-5 py-4">
        <p
          className="text-[11px] font-black uppercase tracking-widest mb-4"
          style={{ color: "var(--text-muted)" }}
        >
          Chi tiết đơn ({order.items.length} sản phẩm)
        </p>
        <div className="space-y-4">
          {order.items.map((item) => (
            <div key={item.cartId} className="flex gap-3">
              <div
                className="relative w-12 h-12 rounded-xl overflow-hidden shrink-0 border"
                style={{ borderColor: "var(--border-color)", background: "var(--bg-secondary)" }}
              >
                <Image src={item.image} alt={item.name} fill className="object-cover" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <p className="font-bold text-sm" style={{ color: "var(--text-primary)" }}>
                    <span className="text-orange-500 mr-1">{item.quantity}x</span>
                    {item.name}
                  </p>
                  <span className="font-bold text-sm" style={{ color: "var(--text-primary)" }}>
                    {formatGia(calculateItemPrice(item))}
                  </span>
                </div>
                <p className="text-xs mt-0.5 line-clamp-1" style={{ color: "var(--text-muted)" }}>
                  Size {item.size}, Đá {item.iceLevel}%, Đường {item.sugarLevel}%
                  {item.toppings.length > 0 && `, ${item.toppings.map((t) => t.name).join(", ")}`}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Status footer */}
      <div
        className="px-5 py-4 border-t flex items-center justify-between"
        style={{ background: "var(--bg-secondary)", borderColor: "var(--border-color)" }}
      >
        <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold border ${cfg.cls}`}>
          {isPending && (
            <span className="relative flex h-2 w-2">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${cfg.dot} opacity-75`} />
              <span className={`relative inline-flex rounded-full h-2 w-2 ${cfg.dot}`} />
            </span>
          )}
          {ORDER_STATUS_LABEL[order.status]}
        </div>

        {order.status === "pending" && (
          <button className="text-xs font-bold text-gray-400 hover:text-red-500 transition-colors">
            Hủy đơn
          </button>
        )}
      </div>
    </div>
  );
}

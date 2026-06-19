"use client";

import { useEffect } from "react";
import { useSocket } from "@/components/providers/SocketProvider";
import { useToastStore } from "@/store/useToastStore";
import { OrderStatus } from "@/types/order";
import { OrderStatusUpdatedEvent } from "@/hooks/useOrderSocket";

const STATUS_TOAST: Record<
  OrderStatus,
  { text: string; variant: "success" | "error" | "info" | "warning" }
> = {
  pending:    { text: "Đơn hàng đang chờ xác nhận",            variant: "info" },
  preparing:  { text: "🧋 Đơn hàng của bạn đang được pha chế", variant: "info" },
  delivering: { text: "🛵 Đơn hàng của bạn đang được giao",    variant: "info" },
  completed:  { text: "✅ Đơn hàng đã hoàn thành!",             variant: "success" },
  cancelled:  { text: "❌ Đơn hàng của bạn đã bị hủy",         variant: "error" },
};

/**
 * Đặt trong layout để lắng nghe order_status_updated toàn app.
 * Chỉ hiện toast — không cập nhật state trang nào cả.
 * Trang /don-hang tự cập nhật state riêng qua useOrderSocket.
 */
export function GlobalOrderNotifications() {
  const socket = useSocket();
  const addToast = useToastStore((s) => s.addToast);

  useEffect(() => {
    if (!socket) return;

    const handler = (event: OrderStatusUpdatedEvent) => {
      const toast = STATUS_TOAST[event.newStatus];
      if (toast) {
        addToast(toast.text, toast.variant, 5000);
      }
    };

    socket.on("order_status_updated", handler);
    return () => {
      socket.off("order_status_updated", handler);
    };
  }, [socket, addToast]);

  return null;
}

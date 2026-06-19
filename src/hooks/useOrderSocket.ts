"use client";

import { useEffect, useRef } from "react";
import { useSocket } from "@/components/providers/SocketProvider";
import { OrderStatus } from "@/types/order";

// Phải khớp với OrderStatusUpdatedPayload ở backend
export interface OrderStatusUpdatedEvent {
  orderId: string;
  userId: string;
  oldStatus: OrderStatus;
  newStatus: OrderStatus;
  message: string;
  updatedAt: string;
}

/**
 * Chỉ dùng để cập nhật state trang /don-hang khi nhận order_status_updated.
 * Toast được xử lý tập trung bởi GlobalOrderNotifications (trong layout).
 */
export function useOrderSocket(
  onStatusUpdated: (event: OrderStatusUpdatedEvent) => void,
) {
  const socket = useSocket();

  const callbackRef = useRef(onStatusUpdated);
  useEffect(() => {
    callbackRef.current = onStatusUpdated;
  }, [onStatusUpdated]);

  useEffect(() => {
    if (!socket) return;

    const handler = (event: OrderStatusUpdatedEvent) => {
      callbackRef.current(event);
    };

    socket.on("order_status_updated", handler);
    return () => {
      socket.off("order_status_updated", handler);
    };
  }, [socket]);
}

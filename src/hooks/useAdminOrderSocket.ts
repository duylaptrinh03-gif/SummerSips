"use client";

import { useEffect, useRef } from "react";
import { useSocket } from "@/components/providers/SocketProvider";
import { OrderStatusUpdatedEvent } from "./useOrderSocket";

export interface NewOrderEvent {
  orderId: string;
  customerName: string;
  totalPrice: number;
  itemCount: number;
  createdAt: string;
}

/**
 * Hook cho admin pages: lắng nghe new_order và order_status_updated.
 * new_order → khi có user đặt đơn hàng mới.
 * order_status_updated → khi trạng thái đơn thay đổi (dù admin tự update).
 */
export function useAdminOrderSocket({
  onNewOrder,
  onStatusUpdated,
}: {
  onNewOrder?: (event: NewOrderEvent) => void;
  onStatusUpdated?: (event: OrderStatusUpdatedEvent) => void;
} = {}) {
  const socket = useSocket();

  const newOrderRef = useRef(onNewOrder);
  const statusRef = useRef(onStatusUpdated);
  useEffect(() => { newOrderRef.current = onNewOrder; }, [onNewOrder]);
  useEffect(() => { statusRef.current = onStatusUpdated; }, [onStatusUpdated]);

  useEffect(() => {
    if (!socket) return;

    const handleNewOrder = (event: NewOrderEvent) => newOrderRef.current?.(event);
    const handleStatusUpdated = (event: OrderStatusUpdatedEvent) =>
      statusRef.current?.(event);

    socket.on("new_order", handleNewOrder);
    socket.on("order_status_updated", handleStatusUpdated);

    return () => {
      socket.off("new_order", handleNewOrder);
      socket.off("order_status_updated", handleStatusUpdated);
    };
  }, [socket]);
}

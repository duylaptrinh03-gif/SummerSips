import { CartItem } from "./cart";

// ── Order status — matches backend OrderStatus enum ───────────────────────
export type OrderStatus =
  | "pending"     // Chờ xác nhận
  | "preparing"   // Đang pha chế
  | "delivering"  // Đang giao hàng
  | "completed"   // Hoàn thành
  | "cancelled";  // Đã hủy

// ── Recipient / delivery info ─────────────────────────────────────────────
export interface RecipientInfo {
  fullName: string;
  phoneNumber: string;
  address: string;
}

// ── Order (matches backend Order schema) ──────────────────────────────────
export interface Order {
  _id: string;
  id: string;               // Readable code — mapped from backend orderId
  items: CartItem[];
  recipientInfo: RecipientInfo;
  totalAmount: number;      // Mapped from backend totalPrice (items only)
  deliveryFee: number;      // Phí giao hàng
  discountAmount: number;   // Số tiền được giảm
  couponCode: string | null; // Mã coupon đã áp dụng
  finalAmount: number;      // totalAmount + deliveryFee - discountAmount
  status: OrderStatus;
  createdAt: string;        // Mapped from backend orderedAt
  updatedAt?: string;
}

// ── Payload to create an order (POST /orders) ─────────────────────────────
export interface CreateOrderPayload {
  recipientInfo: RecipientInfo;
  items: CartItem[];
  deliveryFee?: number;
  couponCode?: string;
  discountAmount?: number;
}

// ── Payload to update order status (Admin — PATCH /orders/:id/status) ─────
export interface UpdateOrderStatusPayload {
  status: OrderStatus;
}

// ── Display labels for each status value ─────────────────────────────────
export const ORDER_STATUS_LABEL: Record<OrderStatus, string> = {
  pending:    "Chờ xác nhận",
  preparing:  "Đang pha chế",
  delivering: "Đang giao hàng",
  completed:  "Hoàn thành",
  cancelled:  "Đã hủy",
};

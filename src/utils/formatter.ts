// ── Formatter Utilities ────────────────────────────────────────────────────
import type { OrderStatus } from "@/types/order";

/**
 * Format số tiền sang định dạng tiền Việt Nam
 * Ví dụ: 35000 → "35.000đ"
 */
export function formatGia(amount: number): string {
  return `${amount?.toLocaleString("vi-VN")}đ`;
}

/**
 * Format ISO date string sang định dạng ngày giờ tiếng Việt
 * Ví dụ: "2024-04-15T14:30:00Z" → "15/04/2024, 21:30"
 */
export function formatNgayGio(iso: string): string {
  return new Date(iso).toLocaleString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/**
 * Tạo ID đơn hàng duy nhất
 * Ví dụ: "ORD-1713161234567"
 */
export function taoMaDonHang(): string {
  return `ORD-${Date.now()}`;
}

/**
 * Tạo UUID ngắn cho cart item
 */
export function taoCartId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

/**
 * Format ISO date sang ngày giờ ngắn (dùng chung cho admin + đơn hàng)
 * Ví dụ: "2024-04-15T14:30:00Z" → "15/04/2024, 21:30"
 */
export function formatDate(iso: string | undefined | null): string {
  if (!iso) return "—";
  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso));
}

// Shared status badge colors — dùng chung cho admin dashboard + orders page
export const STATUS_COLORS: Record<OrderStatus, string> = {
  pending:    "bg-yellow-100 text-yellow-700",
  preparing:  "bg-blue-100 text-blue-700",
  delivering: "bg-purple-100 text-purple-700",
  completed:  "bg-green-100 text-green-700",
  cancelled:  "bg-red-100 text-red-700",
};

export const STATUS_DOT: Record<OrderStatus, string> = {
  pending:    "bg-yellow-400",
  preparing:  "bg-blue-400",
  delivering: "bg-purple-400",
  completed:  "bg-green-400",
  cancelled:  "bg-red-400",
};

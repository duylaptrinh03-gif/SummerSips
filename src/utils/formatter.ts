// ── Formatter Utilities ────────────────────────────────────────────────────

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

import { SizeName, ToppingOption } from "./drink";

// ── 1 item trong giỏ hàng ─────────────────────────────────────────────────
// Lưu đầy đủ thông tin tùy chọn để hiển thị chính xác trong giỏ & đơn hàng
export interface CartItem {
  cartId: string;         // UUID riêng cho mỗi lần thêm (vì cùng sp có thể khác size/topping)
  drinkId: string;       // MongoDB _id (string) do backend trả về
  name: string;
  image: string;
  basePrice: number;      // Giá gốc (size S)
  size: SizeName;
  sizeExtraPrice: number; // Giá cộng thêm của size đã chọn
  toppings: ToppingOption[];  // Danh sách topping đã chọn
  iceLevel: 0 | 50 | 100;    // Mức đá: 0%, 50%, 100%
  sugarLevel: 0 | 50 | 100; // Mức đường: 0%, 50%, 100%
  note: string;         // Ghi chú riêng
  quantity: number;
}

// Tổng giá của 1 CartItem (bao gồm tất cả options)
export function calculateItemPrice(item: CartItem): number {
  const toppingTotal = item.toppings.reduce((sum, t) => sum + t.price, 0);
  return (item.basePrice + item.sizeExtraPrice + toppingTotal) * item.quantity;
}

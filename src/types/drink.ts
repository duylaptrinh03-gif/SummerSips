// ── Danh mục sản phẩm ──────────────────────────────────────────────────────
export type Category =
  | "Tất cả"
  | "Cà Phê"
  | "Trà Sữa"
  | "Trà Trái Cây"
  | "Sinh Tố"
  | "Nước Ép";

// ── Size (kích cỡ) ─────────────────────────────────────────────────────────
export type SizeName = "S" | "M" | "L";

export interface SizeOption {
  name: SizeName;
  label: string;        // "Nhỏ", "Vừa", "Lớn"
  extraPrice: number;   // Giá cộng thêm so với giá gốc (VNĐ)
}

// ── Topping (thêm vào) ─────────────────────────────────────────────────────
export interface ToppingOption {
  id: string;
  name: string;         // "Trân châu đen", "Thạch đào"…
  price: number;        // Giá của topping (VNĐ)
}

// ── Sản phẩm chính ────────────────────────────────────────────────────────
export interface Drink {
  id: number;
  name: string;
  basePrice: number;    // Giá cơ bản (size S)
  image: string;
  description: string;
  category: Category;
  tag?: string;         // "Bán Chạy", "Mới", "Yêu Thích"…
  isAvailable: boolean;
  sizeOptions: SizeOption[];
  toppingOptions: ToppingOption[];
}

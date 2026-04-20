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

// ── Sản phẩm chính (khớp backend Product schema) ───────────────────────────
export interface Drink {
  _id: string;          // MongoDB ObjectId (string) — dùng làm key chính
  name: string;
  basePrice: number;    // Giá cơ bản (size S)
  image: string;
  description: string;
  category: Category;
  tag?: string;         // "Bán Chạy", "Mới", "Yêu Thích"…
  isAvailable: boolean;
  rating?: number;      // 1–5 (tùy chọn)
  soldCount?: number;   // Số lượng đã bán (tùy chọn)
  sizeOptions: SizeOption[];
  toppingOptions: ToppingOption[];
  createdAt?: string;
  updatedAt?: string;
}

// ── Payload tạo / cập nhật sản phẩm (Admin) ──────────────────────────────
export interface CreateDrinkPayload {
  name: string;
  basePrice: number;
  image?: string;
  description?: string;
  category: string;
  tag?: string;
  isAvailable?: boolean;
  rating?: number;
  soldCount?: number;
  sizeOptions?: SizeOption[];
  toppingOptions?: ToppingOption[];
}

export type UpdateDrinkPayload = Partial<CreateDrinkPayload>;

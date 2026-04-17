// ── Toast Notification ──────────────────────────────────────────────────────
export type ToastVariant = "success" | "error" | "info" | "warning";

export interface Toast {
  id: string;
  message: string;
  variant: ToastVariant;
  duration?: number; // ms, default 3000
}

// ── Search & Filter ─────────────────────────────────────────────────────────
export interface SearchFilters {
  query: string;
  minPrice: number;
  maxPrice: number;
}

// ── Sort ────────────────────────────────────────────────────────────────────
export type SortKey =
  | "default"
  | "price_asc"
  | "price_desc"
  | "name_asc"
  | "popular";

export interface SortOption {
  key: SortKey;
  label: string;
}

export const SORT_OPTIONS: SortOption[] = [
  { key: "default", label: "Mặc định" },
  { key: "popular", label: "Phổ biến nhất" },
  { key: "price_asc", label: "Giá thấp nhất" },
  { key: "price_desc", label: "Giá cao nhất" },
  { key: "name_asc", label: "Tên A → Z" },
];

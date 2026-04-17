import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { CartItem, calculateItemPrice } from "@/types/cart";

// ── Mock coupon codes ─────────────────────────────────────────────────────
const COUPON_CODES: Record<string, { discount: number; type: "percent" | "freeship" }> = {
  SUMMER20: { discount: 20, type: "percent" },
  SIPS10:   { discount: 10, type: "percent" },
  FREESHIP: { discount: 0,  type: "freeship" },
  HELLO15:  { discount: 15, type: "percent" },
};

export const DELIVERY_FEE = 20_000;       // 20.000đ phí ship bình thường
export const FREE_SHIP_THRESHOLD = 150_000; // Miễn ship khi tổng >= 150K

interface CartState {
  items: CartItem[];
  couponCode: string | null;
  discountPercent: number;       // 0–100
  isFreeShip: boolean;
  // Actions
  addItem: (item: CartItem) => void;
  removeItem: (cartId: string) => void;
  updateQuantity: (cartId: string, quantity: number) => void;
  clearCart: () => void;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  // Computed values getters
  getTotalCount: () => number;
  getTotalPrice: () => number;      // Tổng trước coupon
  getSubtotal: () => number;        // Sau giảm giá
  getDeliveryFee: () => number;     // Phí ship thực tế
  getFinalTotal: () => number;      // Cuối cùng
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      couponCode: null,
      discountPercent: 0,
      isFreeShip: false,

      addItem: (newItem) => {
        set((state) => ({ items: [...state.items, newItem] }));
      },

      removeItem: (cartId) => {
        set((state) => ({
          items: state.items.filter((item) => item.cartId !== cartId),
        }));
      },

      updateQuantity: (cartId, quantity) => {
        set((state) => ({
          items: state.items.map((item) =>
            item.cartId === cartId ? { ...item, quantity: Math.max(1, quantity) } : item
          ),
        }));
      },

      clearCart: () => set({ items: [], couponCode: null, discountPercent: 0, isFreeShip: false }),

      applyCoupon: (code) => {
        const normalized = code.trim().toUpperCase();
        const coupon = COUPON_CODES[normalized];
        if (!coupon) {
          return { success: false, message: "Mã không hợp lệ hoặc đã hết hạn!" };
        }
        if (get().couponCode === normalized) {
          return { success: false, message: "Mã này đã được áp dụng!" };
        }
        set({
          couponCode: normalized,
          discountPercent: coupon.type === "percent" ? coupon.discount : 0,
          isFreeShip: coupon.type === "freeship",
        });
        return {
          success: true,
          message: coupon.type === "freeship"
            ? "🎉 Miễn phí vận chuyển đã được áp dụng!"
            : `🎉 Giảm ${coupon.discount}% đã được áp dụng!`,
        };
      },

      removeCoupon: () => set({ couponCode: null, discountPercent: 0, isFreeShip: false }),

      getTotalCount: () => get().items.reduce((total, item) => total + item.quantity, 0),

      getTotalPrice: () =>
        get().items.reduce((total, item) => total + calculateItemPrice(item), 0),

      getSubtotal: () => {
        const raw = get().getTotalPrice();
        const { discountPercent } = get();
        return discountPercent > 0
          ? Math.round(raw * (1 - discountPercent / 100))
          : raw;
      },

      getDeliveryFee: () => {
        const { isFreeShip, getTotalPrice } = get();
        if (isFreeShip) return 0;
        if (getTotalPrice() >= FREE_SHIP_THRESHOLD) return 0;
        return DELIVERY_FEE;
      },

      getFinalTotal: () => get().getSubtotal() + get().getDeliveryFee(),
    }),
    {
      name: "summersips-cart-storage-v3",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

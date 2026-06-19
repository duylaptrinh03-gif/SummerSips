import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { CartItem, calculateItemPrice } from "@/types/cart";

export const DELIVERY_FEE = 20_000;
export const FREE_SHIP_THRESHOLD = 150_000;

interface CartState {
  items: CartItem[];
  couponCode: string | null;
  discountAmount: number;  // số tiền giảm cố định (từ server)
  isFreeShip: boolean;
  // Actions
  addItem: (item: CartItem) => void;
  removeItem: (cartId: string) => void;
  updateQuantity: (cartId: string, quantity: number) => void;
  clearCart: () => void;
  setServerCoupon: (code: string, discountAmount: number, isFreeShip: boolean) => void;
  removeCoupon: () => void;
  // Computed values getters
  getTotalCount: () => number;
  getTotalPrice: () => number;
  getSubtotal: () => number;
  getDeliveryFee: () => number;
  getFinalTotal: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      couponCode: null,
      discountAmount: 0,
      isFreeShip: false,

      addItem: (newItem) =>
        set((state) => ({ items: [...state.items, newItem] })),

      removeItem: (cartId) =>
        set((state) => ({
          items: state.items.filter((item) => item.cartId !== cartId),
        })),

      updateQuantity: (cartId, quantity) =>
        set((state) => ({
          items: state.items.map((item) =>
            item.cartId === cartId ? { ...item, quantity: Math.max(1, quantity) } : item
          ),
        })),

      clearCart: () =>
        set({ items: [], couponCode: null, discountAmount: 0, isFreeShip: false }),

      setServerCoupon: (code, discountAmount, isFreeShip) =>
        set({ couponCode: code.toUpperCase(), discountAmount, isFreeShip }),

      removeCoupon: () =>
        set({ couponCode: null, discountAmount: 0, isFreeShip: false }),

      getTotalCount: () =>
        get().items.reduce((total, item) => total + item.quantity, 0),

      getTotalPrice: () =>
        get().items.reduce((total, item) => total + calculateItemPrice(item), 0),

      getSubtotal: () => {
        const raw = get().getTotalPrice();
        const { discountAmount } = get();
        return discountAmount > 0 ? Math.max(0, raw - discountAmount) : raw;
      },

      getDeliveryFee: () => {
        if (get().isFreeShip) return 0;
        if (get().getTotalPrice() >= FREE_SHIP_THRESHOLD) return 0;
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

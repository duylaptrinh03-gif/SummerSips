import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { CartItem, calculateItemPrice } from "@/types/cart";

interface CartState {
  items: CartItem[];
  // Actions
  addItem: (item: CartItem) => void;
  removeItem: (cartId: string) => void;
  updateQuantity: (cartId: string, quantity: number) => void;
  clearCart: () => void;
  // Computed values getters
  getTotalCount: () => number;
  getTotalPrice: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (newItem) => {
        set((state) => {
          // Note: Vì mỗi lần chọn size/topping thì cartId sinh random nên ở đây 
          // ta cứ push vào danh sách. Nếu muốn gom nhóm các item *y hệt* nhau, 
          // có thể so sánh drinkId + size + toppings + đá + đường thay vì cartId.
          // Để linh hoạt và đơn giản (nhất là khi có ghi chú), ta thêm vào như 1 line riêng.
          return { items: [...state.items, newItem] };
        });
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

      clearCart: () => set({ items: [] }),

      getTotalCount: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      getTotalPrice: () => {
        return get().items.reduce((total, item) => total + calculateItemPrice(item), 0);
      },
    }),
    {
      name: "summersips-cart-storage-v2", // Đổi tên để tránh conflict với data cũ
      storage: createJSONStorage(() => localStorage),
    }
  )
);

import { CartItem } from "@/types/cart";
import { Order } from "@/types/order";

const CART_KEY = "summersips_cart_v2";
const ORDERS_KEY = "summersips_orders_v2";

// ── CART ──────────────────────────────────────────────────────────────────────

export function getCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(CART_KEY);
    return raw ? (JSON.parse(raw) as CartItem[]) : [];
  } catch {
    return [];
  }
}

export function saveCart(cart: CartItem[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

export function clearCartStorage(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(CART_KEY);
}

// ── ORDERS ────────────────────────────────────────────────────────────────────

export function getOrders(): Order[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(ORDERS_KEY);
    return raw ? (JSON.parse(raw) as Order[]) : [];
  } catch {
    return [];
  }
}

export function saveOrder(order: Order): void {
  if (typeof window === "undefined") return;
  const orders = getOrders();
  orders.unshift(order); // Mới nhất lên đầu
  localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
}

export function clearAllOrders(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(ORDERS_KEY);
}

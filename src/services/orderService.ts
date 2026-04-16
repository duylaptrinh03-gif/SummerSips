import { Order, TrangThaiDonHang } from "@/types/order";
import { getOrders, saveOrder } from "@/utils/localStorage";

/**
 * Service quản lý đơn hàng.
 * Hiện tại sử dụng localStorage thông qua `utils/localStorage.ts`.
 * Tương lai sẽ thay bằng các lệnh gọi API thực tế.
 */

const DELAY = 1000; // Giả lập call API (ms)

export const orderService = {
  /**
   * Tạo đơn hàng mới
   */
  async createOrder(order: Order): Promise<Order> {
    return new Promise((resolve) => {
      setTimeout(() => {
        saveOrder(order);
        resolve(order);
      }, DELAY);
    });
  },

  /**
   * Lấy danh sách toàn bộ đơn hàng
   */
  async getAllOrders(): Promise<Order[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(getOrders());
      }, DELAY);
    });
  },

  /**
   * Lấy chi tiết một đơn hàng theo ID
   */
  async getOrderById(id: string): Promise<Order | undefined> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const orders = getOrders();
        resolve(orders.find(o => o.id === id));
      }, DELAY);
    });
  },

   /**
   * (Tuỳ chọn) Update trạng thái đơn hàng (Ví dụ cho admin panel tương lai)
   */
   async updateOrderStatus(id: string, status: TrangThaiDonHang): Promise<boolean> {
     return new Promise((resolve) => {
       setTimeout(() => {
         // Logic update local storage sẽ phức tạp hơn chút, tạm thời bỏ qua phần logic update chi tiết
         resolve(true); 
       }, DELAY);
     });
   }
};

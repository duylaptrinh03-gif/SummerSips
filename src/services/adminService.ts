import axiosInstance from "@/lib/axiosInstance";
import type { ApiResponse } from "@/types/api";
import type { OrderStatus } from "@/types/order";

export interface AdminStats {
  overview: {
    totalOrders: number;
    pendingOrders: number;
    completedOrders: number;
    cancelledOrders: number;
    totalProducts: number;
    totalUsers: number;
    totalRevenue: number;
  };
  recentOrders: {
    _id: string;
    orderId: string;
    status: OrderStatus;
    totalPrice: number;
    orderedAt: string;
    recipientInfo: { fullName: string };
  }[];
  topProducts: {
    _id: string;
    name: string;
    soldCount: number;
    basePrice: number;
    image: string;
    category: string;
  }[];
}

export const adminService = {
  async getStats(): Promise<ApiResponse<AdminStats>> {
    return axiosInstance.get<unknown, ApiResponse<AdminStats>>("/admin/stats");
  },

  async updateOrderStatus(id: string, status: OrderStatus): Promise<ApiResponse<unknown>> {
    return axiosInstance.patch<unknown, ApiResponse<unknown>>(
      `/orders/${id}/status`,
      { status }
    );
  },
};

import axiosInstance from "@/lib/axiosInstance";
import {
  Order,
  CreateOrderPayload,
  UpdateOrderStatusPayload,
} from "@/types/order";
import { ApiResponse } from "@/types/api";

// ── Raw backend response shape (matches current backend schema) ───────────
interface RawOrderResponse {
  _id: string;
  orderId: string;            // e.g. "ORD-1713161234567"
  items: Order["items"];
  recipientInfo: {
    fullName: string;
    phoneNumber: string;
    address: string;
  };
  totalPrice: number;         // Backend field name (items total)
  deliveryFee: number;
  discountAmount: number;
  couponCode: string | null;
  status: Order["status"];    // Backend field name (English enum values)
  orderedAt: string;          // Backend field name (ISO string)
  createdAt?: string;
  updatedAt?: string;
}

// ── Paginated response shape from BE ─────────────────────────────────────
interface PaginatedRawOrders {
  data: RawOrderResponse[];
  total: number;
  page: number;
  totalPages: number;
  limit: number;
}

export interface PaginatedOrders {
  orders: Order[];
  total: number;
  page: number;
  totalPages: number;
  limit: number;
}

// ── Map backend response → FE Order shape ────────────────────────────────
function mapOrder(raw: RawOrderResponse): Order {
  const deliveryFee = raw.deliveryFee ?? 0;
  const discountAmount = raw.discountAmount ?? 0;
  const totalAmount = raw.totalPrice ?? 0;
  return {
    _id: raw._id,
    id: raw.orderId,
    items: raw.items,
    recipientInfo: {
      fullName: raw.recipientInfo?.fullName,
      phoneNumber: raw.recipientInfo?.phoneNumber,
      address: raw.recipientInfo?.address,
    },
    totalAmount,
    deliveryFee,
    discountAmount,
    couponCode: raw.couponCode ?? null,
    finalAmount: totalAmount + deliveryFee - discountAmount,
    status: raw.status,
    createdAt: raw.orderedAt ?? raw.createdAt ?? "",
    updatedAt: raw.updatedAt,
  };
}

/**
 * Service layer for the Orders resource.
 * All API calls go through axiosInstance — never call directly from components.
 */
export const orderService = {
  /**
   * POST /orders
   * Create a new order.
   */
  async createOrder(payload: CreateOrderPayload): Promise<ApiResponse<Order>> {
    const response = await axiosInstance.post<unknown, ApiResponse<RawOrderResponse>>(
      "/orders",
      payload
    );
    return {
      ...response, // Giữ lại statusCode, message, totalResult...
      data: mapOrder(response.data), // Ghi đè data đã được map
    };
  },

  /**
   * GET /orders/my?page=1&limit=10
   * Lịch sử đơn hàng của user hiện tại (yêu cầu đăng nhập).
   */
  async getMyOrders(page = 1, limit = 10): Promise<PaginatedOrders> {
    const response = await axiosInstance.get<unknown, ApiResponse<PaginatedRawOrders>>(
      `/orders/my?page=${page}&limit=${limit}`
    );
    const raw = response.data;
    return {
      orders: raw.data.map(mapOrder),
      total: raw.total,
      page: raw.page,
      totalPages: raw.totalPages,
      limit: raw.limit,
    };
  },

  /**
   * GET /orders?page=1&limit=20 — Admin only
   */
  async getAllOrders(page = 1, limit = 50): Promise<PaginatedOrders> {
    const response = await axiosInstance.get<unknown, ApiResponse<PaginatedRawOrders>>(
      `/orders?page=${page}&limit=${limit}`
    );
    const raw = response.data;
    return {
      orders: raw.data.map(mapOrder),
      total: raw.total,
      page: raw.page,
      totalPages: raw.totalPages,
      limit: raw.limit,
    };
  },

  /**
   * GET /orders/:id
   * Fetch a single order.
   */
  async getOrderById(id: string): Promise<ApiResponse<Order>> {
    const response = await axiosInstance.get<unknown, ApiResponse<RawOrderResponse>>(
      `/orders/${id}`
    );
    return {
      ...response,
      data: mapOrder(response.data),
    };
  },

  /**
   * PATCH /orders/:id/status
   * Update order status — Admin only.
   */
  async updateOrderStatus(
    id: string,
    payload: UpdateOrderStatusPayload
  ): Promise<ApiResponse<Order>> {
    const response = await axiosInstance.patch<unknown, ApiResponse<RawOrderResponse>>(
      `/orders/${id}/status`,
      { status: payload.status }
    );
    return {
      ...response,
      data: mapOrder(response.data),
    };
  },

  /**
   * PATCH /orders/:id/cancel
   * Hủy đơn hàng — chỉ owner, chỉ khi status là pending.
   */
  async cancelOrder(id: string): Promise<ApiResponse<Order>> {
    const response = await axiosInstance.patch<unknown, ApiResponse<RawOrderResponse>>(
      `/orders/${id}/cancel`
    );
    return {
      ...response,
      data: mapOrder(response.data),
    };
  },
};
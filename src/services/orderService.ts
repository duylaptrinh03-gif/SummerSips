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
  totalPrice: number;         // Backend field name
  status: Order["status"];    // Backend field name (English enum values)
  orderedAt: string;          // Backend field name (ISO string)
  createdAt?: string;
  updatedAt?: string;
}

// ── Map backend response → FE Order shape ────────────────────────────────
function mapOrder(raw: RawOrderResponse): Order {
  return {
    _id: raw._id,
    id: raw.orderId,
    items: raw.items,
    recipientInfo: {
      fullName: raw.recipientInfo?.fullName,
      phoneNumber: raw.recipientInfo?.phoneNumber,
      address: raw.recipientInfo?.address,
    },
    totalAmount: raw.totalPrice,
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
   * GET /orders
   * Fetch all orders.
   */
  async getAllOrders(): Promise<ApiResponse<Order[]>> {
    const response = await axiosInstance.get<unknown, ApiResponse<RawOrderResponse[]>>(
      "/orders"
    );
    return {
      ...response,
      data: response.data.map(mapOrder),
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
};
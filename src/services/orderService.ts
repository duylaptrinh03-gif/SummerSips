import axiosInstance from "@/lib/axiosInstance";
import {
  Order,
  CreateOrderPayload,
  UpdateOrderStatusPayload,
} from "@/types/order";

// ── Raw backend response shape (matches current backend schema) ───────────
// Backend now uses English field names throughout
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
  async createOrder(payload: CreateOrderPayload): Promise<Order> {
    const { data } = await axiosInstance.post<RawOrderResponse>("/orders", payload);
    return mapOrder(data);
  },

  /**
   * GET /orders
   * Fetch all orders.
   */
  async getAllOrders(): Promise<Order[]> {
    const { data } = await axiosInstance.get<RawOrderResponse[]>("/orders");
    return data.map(mapOrder);
  },

  /**
   * GET /orders/:id
   * Fetch a single order (supports both MongoDB _id and orderId "ORD-xxx").
   */
  async getOrderById(id: string): Promise<Order> {
    const { data } = await axiosInstance.get<RawOrderResponse>(`/orders/${id}`);
    return mapOrder(data);
  },

  /**
   * PATCH /orders/:id/status
   * Update order status — Admin only.
   */
  async updateOrderStatus(
    id: string,
    payload: UpdateOrderStatusPayload
  ): Promise<Order> {
    const { data } = await axiosInstance.patch<RawOrderResponse>(
      `/orders/${id}/status`,
      { status: payload.status }
    );
    return mapOrder(data);
  },
};

import {
  useQuery,
  useMutation,
  useQueryClient,
  UseQueryOptions,
} from "@tanstack/react-query";
import { orderService } from "@/services/orderService";
import { Order, CreateOrderPayload, UpdateOrderStatusPayload } from "@/types/order";

// ── Query Keys ────────────────────────────────────────────────────────────
export const orderKeys = {
  all: ["orders"] as const,
  lists: () => [...orderKeys.all, "list"] as const,
  detail: (id: string) => [...orderKeys.all, "detail", id] as const,
};

// ── useOrders ─────────────────────────────────────────────────────────────
/**
 * Fetch the full order list.
 * - refetchOnWindowFocus: true — auto-refresh when user returns to tab
 * - staleTime: 30s — orders change more frequently than drinks
 */
export function useOrders(
  options?: Omit<UseQueryOptions<Order[], Error>, "queryKey" | "queryFn">
) {
  return useQuery<Order[], Error>({
    queryKey: orderKeys.lists(),
    queryFn: () => orderService.getAllOrders(),
    staleTime: 30 * 1000,
    refetchOnWindowFocus: true,
    ...options,
  });
}

// ── useOrderById ──────────────────────────────────────────────────────────
/**
 * Fetch a single order by id. Only runs when `id` is truthy.
 */
export function useOrderById(
  id: string | null | undefined,
  options?: Omit<UseQueryOptions<Order, Error>, "queryKey" | "queryFn">
) {
  return useQuery<Order, Error>({
    queryKey: orderKeys.detail(id ?? ""),
    queryFn: () => orderService.getOrderById(id!),
    enabled: !!id,
    staleTime: 30 * 1000,
    ...options,
  });
}

// ── useCreateOrder ────────────────────────────────────────────────────────
/**
 * Mutation to place a new order.
 * - onSuccess: invalidates the orders list cache to trigger a refetch.
 */
export function useCreateOrder() {
  const queryClient = useQueryClient();

  return useMutation<Order, Error, CreateOrderPayload>({
    mutationFn: (payload) => orderService.createOrder(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: orderKeys.lists() });
    },
  });
}

// ── useUpdateOrderStatus ──────────────────────────────────────────────────
/**
 * Mutation to update an order's status — Admin only.
 * - onSuccess: invalidates both the list and the specific order detail.
 */
export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();

  return useMutation<
    Order,
    Error,
    { id: string; payload: UpdateOrderStatusPayload }
  >({
    mutationFn: ({ id, payload }) => orderService.updateOrderStatus(id, payload),
    onSuccess: (updatedOrder) => {
      queryClient.invalidateQueries({ queryKey: orderKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: orderKeys.detail(updatedOrder._id),
      });
    },
  });
}

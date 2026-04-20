import {
  useQuery,
  UseQueryOptions,
} from "@tanstack/react-query";
import { drinkService } from "@/services/drinkService";
import { Drink } from "@/types/drink";
import { DrinkQueryParams } from "@/types/api";

// ── Query Keys ────────────────────────────────────────────────────────────
export const drinkKeys = {
  all: ["drinks"] as const,
  lists: () => [...drinkKeys.all, "list"] as const,
  list: (params?: DrinkQueryParams) => [...drinkKeys.lists(), params] as const,
  details: () => [...drinkKeys.all, "detail"] as const,
  detail: (id: string) => [...drinkKeys.details(), id] as const,
  featured: (limit?: number) => [...drinkKeys.all, "featured", limit] as const,
};

// ── useDrinks ─────────────────────────────────────────────────────────────
/**
 * Lấy danh sách drinks, hỗ trợ filter/search/sort.
 * - Cache 5 phút, stale sau 2 phút
 * - Dữ liệu được giữ khi refetch (placeholderData: keepPreviousData)
 */
export function useDrinks(
  params?: DrinkQueryParams,
  options?: Omit<UseQueryOptions<Drink[], Error>, "queryKey" | "queryFn">
) {
  return useQuery<Drink[], Error>({
    queryKey: drinkKeys.list(params),
    queryFn: () => drinkService.getDrinks(params),
    staleTime: 2 * 60 * 1000,   // 2 min
    gcTime: 5 * 60 * 1000,      // 5 min
    ...options,
  });
}

// ── useDrinkById ──────────────────────────────────────────────────────────
/**
 * Lấy chi tiết 1 drink theo MongoDB _id.
 * Chỉ fetch khi `id` có giá trị.
 */
export function useDrinkById(
  id: string | null | undefined,
  options?: Omit<UseQueryOptions<Drink, Error>, "queryKey" | "queryFn">
) {
  return useQuery<Drink, Error>({
    queryKey: drinkKeys.detail(id ?? ""),
    queryFn: () => drinkService.getDrinkById(id!),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    ...options,
  });
}

// ── useFeaturedDrinks ─────────────────────────────────────────────────────
/**
 * Lấy drinks nổi bật (tag=Bán Chạy + Yêu Thích), deduped.
 */
export function useFeaturedDrinks(
  limit: number = 4,
  options?: Omit<UseQueryOptions<Drink[], Error>, "queryKey" | "queryFn">
) {
  return useQuery<Drink[], Error>({
    queryKey: drinkKeys.featured(limit),
    queryFn: () => drinkService.getFeaturedDrinks(limit),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    ...options,
  });
}

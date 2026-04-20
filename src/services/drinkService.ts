import axiosInstance from "@/lib/axiosInstance";
import {
  Drink,
  CreateDrinkPayload,
  UpdateDrinkPayload,
} from "@/types/drink";
import { DrinkQueryParams } from "@/types/api";

/**
 * Service layer cho resource Drinks.
 * Tất cả API calls đi qua axiosInstance — KHÔNG gọi trực tiếp trong component.
 */
export const drinkService = {
  /**
   * GET /drinks
   * Lấy danh sách đồ uống — hỗ trợ filter, search, sort, limit
   */
  async getDrinks(params?: DrinkQueryParams): Promise<Drink[]> {
    const { data } = await axiosInstance.get<Drink[]>("/drinks", { params });
    return data;
  },

  /**
   * GET /drinks?category=<category>
   * Lấy theo danh mục (convenience wrapper)
   */
  async getDrinksByCategory(category: string): Promise<Drink[]> {
    if (category === "Tất cả") {
      return drinkService.getDrinks();
    }
    return drinkService.getDrinks({ category });
  },

  /**
   * GET /drinks/:id
   * Lấy chi tiết 1 đồ uống theo MongoDB _id
   */
  async getDrinkById(id: string): Promise<Drink> {
    const { data } = await axiosInstance.get<Drink>(`/drinks/${id}`);
    return data;
  },

  /**
   * GET /drinks?tag=Bán Chạy&limit=n
   * Lấy sản phẩm nổi bật (Bán Chạy / Yêu Thích)
   */
  async getFeaturedDrinks(limit: number = 4): Promise<Drink[]> {
    const [banChay, yeuThich] = await Promise.allSettled([
      drinkService.getDrinks({ tag: "Bán Chạy", limit }),
      drinkService.getDrinks({ tag: "Yêu Thích", limit }),
    ]);

    const results: Drink[] = [];
    if (banChay.status === "fulfilled") results.push(...banChay.value);
    if (yeuThich.status === "fulfilled") results.push(...yeuThich.value);

    // Dedup và giới hạn
    const seen = new Set<string>();
    return results.filter((d) => {
      if (seen.has(d._id)) return false;
      seen.add(d._id);
      return true;
    }).slice(0, limit);
  },

  // ── Admin endpoints ─────────────────────────────────────────────────────

  /**
   * POST /drinks
   * Tạo sản phẩm mới (Admin)
   */
  async createDrink(payload: CreateDrinkPayload): Promise<Drink> {
    const { data } = await axiosInstance.post<Drink>("/drinks", payload);
    return data;
  },

  /**
   * PATCH /drinks/:id
   * Cập nhật sản phẩm (Admin)
   */
  async updateDrink(id: string, payload: UpdateDrinkPayload): Promise<Drink> {
    const { data } = await axiosInstance.patch<Drink>(`/drinks/${id}`, payload);
    return data;
  },

  /**
   * DELETE /drinks/:id
   * Xóa sản phẩm (Admin)
   */
  async deleteDrink(id: string): Promise<void> {
    await axiosInstance.delete(`/drinks/${id}`);
  },
};

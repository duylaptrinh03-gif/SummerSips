import axiosInstance from "@/lib/axiosInstance";
import {
  Drink,
  CreateDrinkPayload,
  UpdateDrinkPayload,
} from "@/types/drink";
import { DrinkQueryParams, ApiResponse } from "@/types/api";

/**
 * Service layer cho resource Drinks.
 * Trả về full object ApiResponse ({ statusCode, message, data })
 */
export const drinkService = {
  /**
   * GET /drinks
   */
  async getDrinks(params?: DrinkQueryParams): Promise<ApiResponse<Drink[]>> {
    // Return trực tiếp, truyền generic thứ 2 để ép kiểu Promise trả về ApiResponse
    return axiosInstance.get<unknown, ApiResponse<Drink[]>>("/drinks", { params });
  },

  /**
   * GET /drinks?category=<category>
   */
  async getDrinksByCategory(category: string): Promise<ApiResponse<Drink[]>> {
    if (category === "Tất cả") {
      return drinkService.getDrinks();
    }
    return drinkService.getDrinks({ category });
  },

  /**
   * GET /drinks/:id
   */
  async getDrinkById(id: string): Promise<ApiResponse<Drink>> {
    return axiosInstance.get<unknown, ApiResponse<Drink>>(`/drinks/${id}`);
  },

  /**
   * GET /drinks?tag=Bán Chạy&limit=n
   * Lưu ý: Hàm này bạn setup trả về mảng Drink[] chứ không phải ApiResponse
   */
  async getFeaturedDrinks(limit: number = 4): Promise<Drink[]> {
    const [banChayRes, yeuThichRes] = await Promise.allSettled([
      drinkService.getDrinks({ tag: "Bán Chạy", limit }),
      drinkService.getDrinks({ tag: "Yêu Thích", limit }),
    ]);

    const results: Drink[] = [];
    
    // Vì banChayRes.value lúc này là object 3 trường (ApiResponse), 
    // nên ta cần chọc vào .data để lấy mảng Drink[] add vào results
    if (banChayRes.status === "fulfilled") results.push(...banChayRes.value.data);
    if (yeuThichRes.status === "fulfilled") results.push(...yeuThichRes.value.data);

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
   */
  async createDrink(payload: CreateDrinkPayload): Promise<ApiResponse<Drink>> {
    return axiosInstance.post<unknown, ApiResponse<Drink>>("/drinks", payload);
  },

  /**
   * PATCH /drinks/:id
   */
  async updateDrink(id: string, payload: UpdateDrinkPayload): Promise<ApiResponse<Drink>> {
    return axiosInstance.patch<unknown, ApiResponse<Drink>>(`/drinks/${id}`, payload);
  },

  /**
   * DELETE /drinks/:id
   */
  async deleteDrink(id: string): Promise<ApiResponse<void>> {
    return axiosInstance.delete<unknown, ApiResponse<void>>(`/drinks/${id}`);
  },
};
import { Drink, Category } from "@/types/drink";
import { drinks } from "@/data/drinks";

/**
 * Service quản lý đồ uống.
 * Hiện tại đọc mock data tĩnh `drinks`.
 * Sau này thay bằng fetch()/axios.
 */

const DELAY = 100; // Giả lập call API (ms)

export const drinkService = {
  /**
   * Lấy danh sách đồ uống, có thể lọc theo danh mục
   */
  async getDrinks(category: Category = "Tất cả"): Promise<Drink[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (category === "Tất cả") {
          resolve(drinks);
        } else {
          resolve(drinks.filter((d) => d.category === category));
        }
      }, DELAY);
    });
  },

  /**
   * Lấy chi tiết đồ uống theo ID
   */
  async getDrinkById(id: number): Promise<Drink | undefined> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(drinks.find((d) => d.id === id));
      }, DELAY);
    });
  },

  /**
   * Lấy đồ uống nổi bật (ví dụ: Bán chạy nhất)
   */
  async getFeaturedDrinks(limit: number = 3): Promise<Drink[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(drinks.filter((d) => d.tag === "Bán Chạy" || d.tag === "Yêu Thích").slice(0, limit));
      }, DELAY);
    });
  }
};

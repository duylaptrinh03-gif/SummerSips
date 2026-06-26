import axiosInstance from "@/lib/axiosInstance";
import { Review, CreateReviewPayload } from "@/types/review";
import { ApiResponse } from "@/types/api";

export const reviewService = {
  async createReviews(payload: CreateReviewPayload): Promise<ApiResponse<Review[]>> {
    return axiosInstance.post<unknown, ApiResponse<Review[]>>("/reviews", payload);
  },

  async getDrinkReviews(drinkId: string): Promise<ApiResponse<Review[]>> {
    return axiosInstance.get<unknown, ApiResponse<Review[]>>(`/reviews/drink/${drinkId}`);
  },
};

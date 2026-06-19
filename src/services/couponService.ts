import axiosInstance from "@/lib/axiosInstance";
import type { ApiResponse } from "@/types/api";

export type CouponType = "percent" | "freeship";

export interface CouponValidateResult {
  valid: boolean;
  discountAmount: number;
  type: CouponType;
  message: string;
}

export interface Coupon {
  _id: string;
  code: string;
  discount_value: number;
  type: CouponType;
  is_active: boolean;
  createdAt?: string;
}

export const couponService = {
  /** POST /coupons/validate */
  async validate(code: string, orderTotal: number): Promise<ApiResponse<CouponValidateResult>> {
    return axiosInstance.post<unknown, ApiResponse<CouponValidateResult>>(
      "/coupons/validate",
      { code, orderTotal }
    );
  },

  /** GET /coupons — admin */
  async getAll(): Promise<ApiResponse<Coupon[]>> {
    return axiosInstance.get<unknown, ApiResponse<Coupon[]>>("/coupons");
  },

  /** POST /coupons — admin */
  async create(payload: { code: string; discount_value: number; type: CouponType; is_active?: boolean }): Promise<ApiResponse<Coupon>> {
    return axiosInstance.post<unknown, ApiResponse<Coupon>>("/coupons", payload);
  },

  /** PATCH /coupons/:id — admin */
  async update(id: string, payload: Partial<{ code: string; discount_value: number; type: CouponType; is_active: boolean }>): Promise<ApiResponse<Coupon>> {
    return axiosInstance.patch<unknown, ApiResponse<Coupon>>(`/coupons/${id}`, payload);
  },

  /** DELETE /coupons/:id — admin */
  async remove(id: string): Promise<void> {
    await axiosInstance.delete(`/coupons/${id}`);
  },
};

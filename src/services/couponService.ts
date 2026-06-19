import axiosInstance from "@/lib/axiosInstance";
import type { ApiResponse } from "@/types/api";

export interface CouponValidateResult {
  valid: boolean;
  discountAmount: number;
  type: "percent" | "freeship";
  message: string;
}

export const couponService = {
  /** POST /coupons/validate */
  async validate(
    code: string,
    orderTotal: number
  ): Promise<ApiResponse<CouponValidateResult>> {
    return axiosInstance.post<unknown, ApiResponse<CouponValidateResult>>(
      "/coupons/validate",
      { code, orderTotal }
    );
  },
};

import axiosInstance from "@/lib/axiosInstance";
import type { ApiResponse } from "@/types/api";

export interface UserProfile {
  _id: string;
  name: string;
  email: string;
  phone: string;
  defaultAddress: string;
  role: string;
}

export interface UpdateUserPayload {
  name?: string;
  phone?: string;
  defaultAddress?: string;
}

export const userService = {
  /** GET /users/me */
  async getMe(): Promise<ApiResponse<UserProfile>> {
    return axiosInstance.get<unknown, ApiResponse<UserProfile>>("/users/me");
  },

  /** PATCH /users/me */
  async updateMe(payload: UpdateUserPayload): Promise<ApiResponse<UserProfile>> {
    return axiosInstance.patch<unknown, ApiResponse<UserProfile>>("/users/me", payload);
  },
};

import axiosInstance from "@/lib/axiosInstance";
import type { ApiResponse } from "@/types/api";

export interface UserNotifications {
  orderUpdates: boolean;
  promotions: boolean;
  newsletter: boolean;
}

export interface UserProfile {
  _id: string;
  name: string;
  email: string;
  phone: string;
  defaultAddress: string;
  role: string;
  avatar?: string;
  notifications?: UserNotifications;
}

export interface UpdateUserPayload {
  name?: string;
  phone?: string;
  defaultAddress?: string;
  avatar?: string;
  notifications?: Partial<UserNotifications>;
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

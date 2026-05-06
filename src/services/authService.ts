import axiosInstance from "@/lib/axiosInstance";
import { ApiResponse } from "@/types/api";
import { LoginPayload, RegisterPayload, User } from "@/types/auth";

export const authService = {
  /**
   * POST /auth/login
   */
  async login(payload: LoginPayload): Promise<ApiResponse<User>> {
    // Return trực tiếp, truyền generic thứ 2 để ép kiểu Promise trả về ApiResponse
    return axiosInstance.post<unknown, ApiResponse<User>>("/auth/login", payload);
  },  
  /**
   * POST /auth/register
   */
  async register(payload: RegisterPayload): Promise<ApiResponse<User>> {
    // Return trực tiếp, truyền generic thứ 2 để ép kiểu Promise trả về ApiResponse
    return axiosInstance.post<unknown, ApiResponse<User>>("/auth/register", payload);
  },  
}
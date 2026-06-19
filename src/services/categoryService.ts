import axiosInstance from "@/lib/axiosInstance";
import { ApiResponse } from "@/types/api";

export interface Category {
  _id: string;
  name: string;
  createdAt?: string;
}

export const categoryService = {
  async getAll(): Promise<ApiResponse<Category[]>> {
    return axiosInstance.get<unknown, ApiResponse<Category[]>>("/categories");
  },
  async create(name: string): Promise<ApiResponse<Category>> {
    return axiosInstance.post<unknown, ApiResponse<Category>>("/categories", { name });
  },
  async update(id: string, name: string): Promise<ApiResponse<Category>> {
    return axiosInstance.patch<unknown, ApiResponse<Category>>(`/categories/${id}`, { name });
  },
  async remove(id: string): Promise<void> {
    await axiosInstance.delete(`/categories/${id}`);
  },
};

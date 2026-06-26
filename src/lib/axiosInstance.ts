import axios, { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from "axios";
import type { ApiResponse, ApiError } from "@/types/api";
import { getSession, signOut } from "next-auth/react";

// Re-export ApiResponse for backward-compat with any file that imports from here
export type { ApiResponse };

// Custom Error Class để giữ lại status code và data gốc
export class HttpError extends Error {
  status?: number;
  data?: unknown;

  constructor(message: string, status?: number, data?: unknown) {
    super(message);
    this.name = "HttpError";
    this.status = status;
    this.data = data;
  }
}

// ── Axios Instance ────────────────────────────────────────────────────────
const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 10_000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// ── Request Interceptor ───────────────────────────────────────────────────
axiosInstance.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    if (typeof window !== "undefined") {
      const session = await getSession();
      if (session?.accessToken) {
        config.headers.Authorization = `Bearer ${session.accessToken}`;
      }
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// ── Response Interceptor ──────────────────────────────────────────────────
// Success: unwrap ApiResponse<T> — services cast lại với generic cụ thể
axiosInstance.interceptors.response.use(
  (response: AxiosResponse<ApiResponse<unknown>>) => {
    if (response.data && response.data.statusCode) {
      return response.data as unknown as AxiosResponse<ApiResponse<unknown>>;
    }

    return response.data as unknown as AxiosResponse<ApiResponse<unknown>>;
  },
  // Error: backend gửi ApiError shape (có message field)
  async (error: AxiosError<ApiError>) => {
    const status = error.response?.status;
    const serverData = error.response?.data;
    const serverMessage = serverData?.message;

    const normalizedMessage = Array.isArray(serverMessage)
      ? serverMessage.join(", ")
      : serverMessage || error.message || "Có lỗi xảy ra. Vui lòng thử lại!";

    if (status === 401) {
      console.warn("[API 401] Unauthorized — session hết hạn, đang đăng xuất...");
      if (typeof window !== "undefined") {
        signOut({ callbackUrl: "/dang-nhap" });
      }
    } else if (status === 403) {
      console.warn("[API 403] Forbidden:", normalizedMessage);
    } else if (status === 404) {
      console.warn("[API 404] Not Found:", normalizedMessage);
    } else if (status && status >= 500) {
      console.error("[API 5xx] Server Error:", normalizedMessage);
    } else if (!error.response) {
      console.error("[API] Network Error hoặc Timeout:", error.message);
    }

    const enhancedError = new HttpError(normalizedMessage, status, serverData);

    return Promise.reject(enhancedError);
  }
);

export default axiosInstance;
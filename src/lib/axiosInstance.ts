import axios, { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from "axios";

// ── Định nghĩa Type ────────────────────────────────────────────────────────
// Giả định cấu trúc API của bạn trả về từ NestJS
export interface ApiResponse<T = unknown> {
  statusCode: number;
  message?: string | string[];
  data: T;
  totalResult?: number;
}

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
  (config: InternalAxiosRequestConfig) => {
    const token = null; 

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// ── Response Interceptor ──────────────────────────────────────────────────
axiosInstance.interceptors.response.use(
  (response: AxiosResponse<ApiResponse>) => {
    if (response.data && response.data.statusCode) {
      return response.data as unknown as AxiosResponse<ApiResponse>;
    }

    return response.data as unknown as AxiosResponse<ApiResponse>;
  },
  async (error: AxiosError<ApiResponse>) => {
    const status = error.response?.status;
    const serverData = error.response?.data;
    const serverMessage = serverData?.message;

    const normalizedMessage = Array.isArray(serverMessage)
      ? serverMessage.join(", ")
      : serverMessage || error.message || "Có lỗi xảy ra. Vui lòng thử lại!";

    if (status === 401) {
      console.warn("[API 401] Unauthorized:", normalizedMessage);
      
    
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
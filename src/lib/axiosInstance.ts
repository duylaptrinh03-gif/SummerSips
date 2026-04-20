import axios, { AxiosError, AxiosResponse } from "axios";
import { ApiError } from "@/types/api";

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
// Attach Bearer token nếu có (ví dụ: lưu trong cookie / memory)
axiosInstance.interceptors.request.use(
  (config) => {
    // Nếu app có auth, lấy token ở đây:
    // const token = getToken(); // e.g. từ cookie, memory store
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// ── Response Interceptor ──────────────────────────────────────────────────
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    // Nếu dữ liệu trả về có cấu trúc chuẩn { statusCode, data, totalResult }
    // thì bóc tách lớp bọc bằng cách ghi đè payload lên chính thuộc tính .data của đối tượng Response
    if (
      response.data &&
      typeof response.data === "object" &&
      "statusCode" in response.data &&
      "data" in response.data
    ) {
      response.data = response.data.data;
    }

    // Trả về response giúp các service vẫn gọi const { data } = ... bình thường
    return response;
  },
  (error: AxiosError<ApiError>) => {
    const status = error.response?.status;
    const serverMessage = error.response?.data?.message;

    // Chuẩn hóa message từ server (NestJS trả array hoặc string)
    const normalizedMessage = Array.isArray(serverMessage)
      ? serverMessage.join(", ")
      : serverMessage;

    if (status === 401) {
      // Unauthorized — nếu có auth, redirect về login ở đây
      console.warn("[API 401] Unauthorized:", normalizedMessage);
    } else if (status === 403) {
      console.warn("[API 403] Forbidden:", normalizedMessage);
    } else if (status && status >= 500) {
      console.error("[API 5xx] Server Error:", normalizedMessage ?? error.message);
    } else if (!error.response) {
      // Network error / timeout
      console.error("[API] Network Error hoặc Timeout:", error.message);
    }

    // Gán message chuẩn vào error để dễ display ở component
    const enhancedError = new Error(
      normalizedMessage ?? error.message ?? "Có lỗi xảy ra. Vui lòng thử lại!"
    );
    return Promise.reject(enhancedError);
  }
);

export default axiosInstance;

// ── API Response Wrappers ──────────────────────────────────────────────────

export interface ApiError {
  statusCode: number;
  message: string | string[];
  error?: string;
}

export interface ApiResponse<T> {
  statusCode: number;
  data: T;
  totalResult?: number;
}

// ── Query Params for /drinks ──────────────────────────────────────────────

export interface DrinkQueryParams {
  category?: string;
  tag?: string;
  limit?: number;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: string;
}

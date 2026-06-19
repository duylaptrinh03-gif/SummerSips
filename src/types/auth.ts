// ─────────── Request types ────────────────────────────────────────────────
export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  email: string;
  password: string;
  name?: string;
  phone?: string;
  role?: string;
}

// ─────────── Response types ──────────────────────────────────────────────
// Lưu ý: Đây là type nhận từ backend (đã có id)
export interface User {
  id: string;
  email: string;
  fullName: string;
  phoneNumber?: string;
  role?: string;
  createdAt?: string;
  updatedAt?: string;
}

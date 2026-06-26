// ── Review / Rating types ──────────────────────────────────────────────────

export interface Review {
  _id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  drinkId: string;
  orderId: string;
  rating: number;        // 1–5
  comment?: string;
  createdAt: string;
}

export interface CreateReviewPayload {
  orderId: string;
  items: Array<{
    drinkId: string;
    rating: number;
    comment?: string;
  }>;
}

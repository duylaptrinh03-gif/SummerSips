import { create } from "zustand";
import { persist } from "zustand/middleware";

interface ReviewStore {
  reviewedOrderIds: string[];
  markAsReviewed: (orderId: string) => void;
  hasReviewed: (orderId: string) => boolean;
}

export const useReviewStore = create<ReviewStore>()(
  persist(
    (set, get) => ({
      reviewedOrderIds: [],
      markAsReviewed: (orderId) =>
        set((state) => ({
          reviewedOrderIds: state.reviewedOrderIds.includes(orderId)
            ? state.reviewedOrderIds
            : [...state.reviewedOrderIds, orderId],
        })),
      hasReviewed: (orderId) => get().reviewedOrderIds.includes(orderId),
    }),
    { name: "review-store" }
  )
);

"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Star, X } from "lucide-react";
import { CartItem } from "@/types/cart";
import { reviewService } from "@/services/reviewService";
import { useReviewStore } from "@/store/useReviewStore";
import { useToastStore } from "@/store/useToastStore";

// ── Star rating input ─────────────────────────────────────────────────────────
function StarInput({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const [hovered, setHovered] = useState(0);
  const fill = hovered || value;

  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onMouseEnter={() => setHovered(star)}
          onMouseLeave={() => setHovered(0)}
          onClick={() => onChange(star)}
          className="transition-transform hover:scale-110 active:scale-95 outline-none"
        >
          <Star
            size={26}
            className={`transition-colors ${
              star <= fill ? "fill-orange-400 text-orange-400" : "text-gray-300"
            }`}
          />
        </button>
      ))}
    </div>
  );
}

const RATING_LABELS: Record<number, string> = {
  1: "Tệ 😞",
  2: "Không ổn 😕",
  3: "Bình thường 😐",
  4: "Tốt 😊",
  5: "Tuyệt vời! 🤩",
};

// ── Types ──────────────────────────────────────────────────────────────────────
interface RatingItem {
  drinkId: string;
  name: string;
  image: string;
  rating: number;
  comment: string;
}

interface RatingDialogProps {
  orderId: string;       // MongoDB _id của order
  orderCode: string;     // Mã đơn hàng hiển thị (order.id)
  items: CartItem[];
  onClose: () => void;
}

// ── Dialog ────────────────────────────────────────────────────────────────────
export function RatingDialog({ orderId, orderCode, items, onClose }: RatingDialogProps) {
  const addToast = useToastStore((s) => s.addToast);
  const markAsReviewed = useReviewStore((s) => s.markAsReviewed);

  // De-duplicate items by drinkId (same drink might appear in multiple cart entries)
  const uniqueItems = items.reduce<CartItem[]>((acc, item) => {
    if (!acc.find((a) => a.drinkId === item.drinkId)) acc.push(item);
    return acc;
  }, []);

  const [ratings, setRatings] = useState<RatingItem[]>(
    uniqueItems.map((item) => ({
      drinkId: item.drinkId,
      name: item.name,
      image: item.image,
      rating: 5,
      comment: "",
    }))
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const setRating = (drinkId: string, rating: number) =>
    setRatings((prev) => prev.map((r) => (r.drinkId === drinkId ? { ...r, rating } : r)));

  const setComment = (drinkId: string, comment: string) =>
    setRatings((prev) => prev.map((r) => (r.drinkId === drinkId ? { ...r, comment } : r)));

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await reviewService.createReviews({
        orderId,
        items: ratings.map((r) => ({
          drinkId: r.drinkId,
          rating: r.rating,
          comment: r.comment.trim() || undefined,
        })),
      });
      markAsReviewed(orderId);
      setSubmitted(true);
      setTimeout(onClose, 1800);
    } catch {
      addToast("Không thể gửi đánh giá. Vui lòng thử lại!", "error");
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[400] flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* Panel */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 24 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 24 }}
          transition={{ type: "spring", damping: 24, stiffness: 280 }}
          className="relative w-full max-w-lg rounded-3xl overflow-hidden flex flex-col max-h-[90vh]"
          style={{
            background: "var(--bg-card)",
            boxShadow: "0 32px 80px rgba(0,0,0,0.25)",
          }}
        >
          {/* Close btn */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 w-9 h-9 flex items-center justify-center rounded-full transition-colors hover:bg-black/10"
            style={{ color: "var(--text-muted)" }}
          >
            <X size={18} />
          </button>

          {/* Success screen */}
          {submitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center py-16 px-8 text-center"
            >
              <div className="text-6xl mb-5 animate-bounce">🌟</div>
              <h3 className="text-2xl font-black mb-2" style={{ color: "var(--text-primary)" }}>
                Cảm ơn bạn!
              </h3>
              <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                Đánh giá của bạn giúp ích rất nhiều cho cộng đồng.
              </p>
            </motion.div>
          ) : (
            <>
              {/* Header */}
              <div
                className="px-6 pt-7 pb-5 text-center border-b"
                style={{ borderColor: "var(--border-color)" }}
              >
                <div className="text-4xl mb-3">⭐</div>
                <h2 className="text-xl font-black" style={{ color: "var(--text-primary)" }}>
                  Đánh giá đơn hàng
                </h2>
                <p className="text-xs font-mono mt-1" style={{ color: "var(--text-muted)" }}>
                  {orderCode}
                </p>
                <p className="text-sm mt-1.5" style={{ color: "var(--text-secondary)" }}>
                  Chia sẻ trải nghiệm để giúp cộng đồng nhé!
                </p>
              </div>

              {/* Items */}
              <div className="flex-1 overflow-y-auto px-6 py-5 space-y-7">
                {ratings.map((item, idx) => (
                  <div key={item.drinkId}>
                    {idx > 0 && (
                      <div className="h-px mb-7" style={{ background: "var(--border-color)" }} />
                    )}
                    {/* Product row */}
                    <div className="flex items-center gap-3 mb-4">
                      <div
                        className="relative w-12 h-12 rounded-xl overflow-hidden shrink-0 border"
                        style={{ borderColor: "var(--border-color)", background: "var(--bg-secondary)" }}
                      >
                        {item.image ? (
                          <Image src={item.image} alt={item.name} fill className="object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-xl">🧋</div>
                        )}
                      </div>
                      <p className="font-bold flex-1 text-sm" style={{ color: "var(--text-primary)" }}>
                        {item.name}
                      </p>
                    </div>

                    {/* Stars */}
                    <div className="flex items-center gap-3 mb-3">
                      <StarInput value={item.rating} onChange={(r) => setRating(item.drinkId, r)} />
                      {item.rating > 0 && (
                        <span className="text-sm font-semibold" style={{ color: "var(--text-muted)" }}>
                          {RATING_LABELS[item.rating]}
                        </span>
                      )}
                    </div>

                    {/* Comment */}
                    <textarea
                      value={item.comment}
                      onChange={(e) => setComment(item.drinkId, e.target.value)}
                      placeholder="Nhận xét của bạn... (tùy chọn)"
                      rows={2}
                      maxLength={300}
                      className="w-full px-4 py-3 rounded-2xl border text-sm resize-none outline-none transition-all focus:ring-2 focus:ring-orange-200 focus:border-orange-400"
                      style={{
                        background: "var(--bg-secondary)",
                        borderColor: "var(--border-color)",
                        color: "var(--text-primary)",
                      }}
                    />
                    {item.comment && (
                      <p className="text-[11px] mt-1 text-right" style={{ color: "var(--text-muted)" }}>
                        {item.comment.length}/300
                      </p>
                    )}
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div
                className="px-6 py-4 border-t flex gap-3"
                style={{ borderColor: "var(--border-color)", background: "var(--bg-secondary)" }}
              >
                <button
                  onClick={onClose}
                  className="flex-1 py-3 rounded-2xl font-bold text-sm border transition-colors hover:bg-gray-50"
                  style={{ borderColor: "var(--border-color)", color: "var(--text-secondary)" }}
                >
                  Để sau
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="flex-1 py-3 rounded-2xl font-black text-white text-sm transition-all hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-60 disabled:cursor-not-allowed"
                  style={{
                    background: "linear-gradient(135deg, #f97316, #ec4899)",
                    boxShadow: "0 8px 24px rgba(249,115,22,0.3)",
                  }}
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Đang gửi...
                    </span>
                  ) : (
                    "Gửi đánh giá 🌟"
                  )}
                </button>
              </div>
            </>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

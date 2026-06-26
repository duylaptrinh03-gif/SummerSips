"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Star } from "lucide-react";
import { Drink, ToppingOption, SizeName } from "@/types/drink";
import { CartItem } from "@/types/cart";
import { Review } from "@/types/review";
import { formatGia, taoCartId, formatDate } from "@/utils/formatter";
import { reviewService } from "@/services/reviewService";
import { QuantityControl } from "../ui/QuantityControl";
import { useCartStore } from "@/store/useCartStore";
import { useToastStore } from "@/store/useToastStore";

// ── Star display (read-only) ──────────────────────────────────────────────────
function StarDisplay({ rating, size = 14 }: { rating: number; size?: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          size={size}
          className={s <= Math.round(rating) ? "fill-orange-400 text-orange-400" : "text-gray-300"}
        />
      ))}
    </div>
  );
}

// ── Single review row ─────────────────────────────────────────────────────────
function ReviewRow({ review }: { review: Review }) {
  const initial = review.userName?.[0]?.toUpperCase() ?? "?";
  return (
    <div className="flex gap-3">
      <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-black text-white"
        style={{ background: "linear-gradient(135deg, #f97316, #ec4899)" }}>
        {initial}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-bold" style={{ color: "var(--text-primary)" }}>
            {review.userName}
          </span>
          <StarDisplay rating={review.rating} size={12} />
          <span className="text-[10px]" style={{ color: "var(--text-muted)" }}>
            {formatDate(review.createdAt)}
          </span>
        </div>
        {review.comment && (
          <p className="text-xs mt-1 leading-relaxed" style={{ color: "var(--text-secondary)" }}>
            {review.comment}
          </p>
        )}
      </div>
    </div>
  );
}

interface ProductModalProps {
  drink: Drink;
  isOpen: boolean;
  onClose: () => void;
  /** Toàn bộ danh sách drinks để tính gợi ý cùng category */
  allDrinks?: Drink[];
  /** Callback khi user click sang món gợi ý */
  onSelectDrink?: (drink: Drink) => void;
}

export function ProductModal({ drink, isOpen, onClose, allDrinks = [], onSelectDrink }: ProductModalProps) {
  const addItem = useCartStore((state) => state.addItem);
  const addToast = useToastStore((s) => s.addToast);

  const defaultSize =
    drink?.sizeOptions?.find((s) => s.extraPrice === 0)?.name ||
    drink?.sizeOptions?.[0]?.name ||
    "S";

  const [selectedSize, setSelectedSize] = useState<SizeName>(defaultSize as SizeName);
  const [iceLevel, setIceLevel] = useState<0 | 50 | 100>(100);
  const [sugarLevel, setSugarLevel] = useState<0 | 50 | 100>(100);
  const [selectedToppings, setSelectedToppings] = useState<ToppingOption[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [note, setNote] = useState("");

  // Reviews
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoadingReviews, setIsLoadingReviews] = useState(false);

  useEffect(() => {
    if (!isOpen || !drink?._id) return;
    setIsLoadingReviews(true);
    reviewService
      .getDrinkReviews(drink._id)
      .then((res) => setReviews(Array.isArray(res?.data) ? res.data : []))
      .catch(() => setReviews([]))
      .finally(() => setIsLoadingReviews(false));
  }, [drink?._id, isOpen]);

  // Prevent background scroll when modal is open
  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "unset";
    return () => { document.body.style.overflow = "unset"; };
  }, [isOpen]);

  if (!isOpen) return null;

  // Gợi ý: cùng category, khác sản phẩm hiện tại, tối đa 4
  const relatedDrinks = allDrinks
    .filter((d) => d.category === drink.category && d._id !== drink._id && d.isAvailable)
    .slice(0, 4);

  // Price calculation
  const currentSizeObj = drink?.sizeOptions?.find((s) => s.name === selectedSize);
  const sizeExtra = currentSizeObj?.extraPrice ?? 0;
  const toppingTotal = selectedToppings.reduce((sum, t) => sum + t.price, 0);
  const unitPrice = (drink?.basePrice ?? 0) + sizeExtra + toppingTotal;
  const totalPrice = unitPrice * quantity;

  const handleToggleTopping = (topping: ToppingOption) => {
    const isSelected = selectedToppings.find((t) => t.id === topping.id);
    if (isSelected) {
      setSelectedToppings((prev) => prev.filter((t) => t.id !== topping.id));
    } else {
      setSelectedToppings((prev) => [...prev, topping]);
    }
  };

  const handleAddToCart = () => {
    const newItem: CartItem = {
      cartId: taoCartId(),
      drinkId: drink?._id ?? "",
      name: drink?.name ?? "",
      image: drink?.image ?? "",
      basePrice: drink?.basePrice ?? 0,
      size: selectedSize,
      sizeExtraPrice: sizeExtra,
      toppings: selectedToppings,
      iceLevel,
      sugarLevel,
      note: note.trim(),
      quantity,
    };

    addItem(newItem);
    addToast(`🛒 Đã thêm ${drink?.name} vào giỏ hàng!`, "success");
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* Modal content */}
        <motion.div
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="relative w-full max-w-2xl sm:rounded-3xl rounded-t-3xl h-[85vh] sm:h-auto max-h-[90vh] flex flex-col overflow-hidden"
          style={{ background: "var(--bg-modal)" }}
        >
          {/* Mobile drag handle */}
          <div className="w-full flex justify-center py-3 sm:hidden">
            <div className="w-12 h-1.5 bg-gray-200 rounded-full" />
          </div>

          {/* Close button — desktop */}
          <button
            onClick={onClose}
            className="hidden sm:flex absolute top-4 right-4 z-10 w-10 h-10 items-center justify-center backdrop-blur rounded-full shadow-sm transition-colors"
            style={{ background: "var(--bg-card)", color: "var(--text-secondary)" }}
          >
            ✕
          </button>

          <div className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-hide flex flex-col sm:flex-row">
            {/* Product image */}
            <div className="w-full sm:w-[280px] md:w-[320px] shrink-0 bg-orange-50 flex flex-col overflow-hidden relative">
              <div className="relative aspect-square sm:aspect-auto sm:h-full w-full">
                {drink?.image ? (
                  <Image
                    src={drink?.image ?? ""}
                    alt={drink?.name ?? ""}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-6xl">🧋</div>
                )}
              </div>
            </div>

            {/* Options form */}
            <div className="flex-1 p-6 flex flex-col gap-8">
              <div>
                <h2 className="text-2xl font-black mb-2" style={{ color: "var(--text-primary)" }}>{drink?.name}</h2>
                <p className="text-sm leading-relaxed mb-4" style={{ color: "var(--text-secondary)" }}>{drink?.description}</p>
                <div className="inline-flex px-3 py-1 bg-orange-100 text-orange-600 rounded-lg text-lg font-black">
                  {formatGia(drink?.basePrice ?? 0)}
                </div>
              </div>

              {/* 1. Size */}
              {(drink?.sizeOptions?.length ?? 0) > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold" style={{ color: "var(--text-primary)" }}>Kích cỡ</h3>
                    <span className="text-xs font-semibold px-2 py-1 rounded" style={{ color: "var(--text-muted)", background: "var(--bg-tertiary)" }}>
                      Bắt buộc
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    {drink?.sizeOptions?.map((sz) => (
                      <button
                        key={sz.name}
                        onClick={() => setSelectedSize(sz.name)}
                        className={`flex flex-col items-center p-3 rounded-2xl border-2 transition-all ${
                          selectedSize === sz.name
                            ? "border-orange-500 bg-orange-50 text-orange-600"
                            : "hover:border-orange-200"
                        }`}
                        style={selectedSize === sz.name ? {} : {
                          borderColor: "var(--border-color)",
                          color: "var(--text-secondary)",
                        }}
                      >
                        <span className="font-bold mb-1">{sz.label}</span>
                        <span className="text-xs opacity-80">
                          {sz.extraPrice > 0 ? `+${formatGia(sz.extraPrice)}` : "Miễn phí"}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* 2. Ice & Sugar */}
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h3 className="font-bold" style={{ color: "var(--text-primary)" }}>Đá</h3>
                  <div className="flex rounded-xl p-1" style={{ background: "var(--bg-tertiary)" }}>
                    {([0, 50, 100] as const).map((val) => (
                      <button
                        key={`ice-${val}`}
                        onClick={() => setIceLevel(val)}
                        className="flex-1 py-1.5 text-sm font-bold rounded-lg transition-all"
                        style={iceLevel === val
                          ? { background: "var(--bg-card)", color: "var(--text-primary)", boxShadow: "var(--shadow-sm)" }
                          : { color: "var(--text-muted)" }
                        }
                      >
                        {val}%
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="font-bold" style={{ color: "var(--text-primary)" }}>Đường</h3>
                  <div className="flex rounded-xl p-1" style={{ background: "var(--bg-tertiary)" }}>
                    {([0, 50, 100] as const).map((val) => (
                      <button
                        key={`sugar-${val}`}
                        onClick={() => setSugarLevel(val)}
                        className="flex-1 py-1.5 text-sm font-bold rounded-lg transition-all"
                        style={sugarLevel === val
                          ? { background: "var(--bg-card)", color: "var(--text-primary)", boxShadow: "var(--shadow-sm)" }
                          : { color: "var(--text-muted)" }
                        }
                      >
                        {val}%
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* 3. Toppings */}
              {(drink?.toppingOptions?.length ?? 0) > 0 && (
                <div className="space-y-3">
                  <h3 className="font-bold" style={{ color: "var(--text-primary)" }}>Topping thêm</h3>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {drink?.toppingOptions?.map((top) => {
                      const isSelected = selectedToppings.some((t) => t.id === top.id);
                      return (
                        <label
                          key={top.id}
                          className="flex items-center justify-between p-4 rounded-2xl border-2 cursor-pointer transition-all"
                          style={isSelected
                            ? { borderColor: "#ec4899", background: "rgba(236,72,153,0.06)" }
                            : { borderColor: "var(--border-color)", background: "transparent" }
                          }
                        >
                          <div className="flex items-center gap-3">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => handleToggleTopping(top)}
                              className="w-5 h-5 rounded text-pink-500 focus:ring-pink-500 accent-pink-500"
                            />
                            <span className="font-semibold" style={{ color: isSelected ? "#be185d" : "var(--text-primary)" }}>
                              {top.name}
                            </span>
                          </div>
                          <span className="text-sm font-bold" style={{ color: "var(--text-muted)" }}>+{formatGia(top.price)}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* 4. Note */}
              <div className="space-y-3">
                <h3 className="font-bold" style={{ color: "var(--text-primary)" }}>Ghi chú thêm</h3>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Ví dụ: Ít béo, không lấy ống hút..."
                  className="w-full p-4 rounded-2xl border focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all resize-none outline-none text-sm"
                  style={{
                    background: "var(--bg-secondary)",
                    borderColor: "var(--border-color)",
                    color: "var(--text-primary)",
                  }}
                  rows={2}
                />
              </div>

              {/* 5. Related drinks */}
              {relatedDrinks.length > 0 && (
                <div className="space-y-3">
                  <h3 className="font-bold" style={{ color: "var(--text-primary)" }}>
                    Món tương tự 👀
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    {relatedDrinks.map((related) => (
                      <button
                        key={related._id}
                        onClick={() => {
                          onClose();
                          setTimeout(() => onSelectDrink?.(related), 150);
                        }}
                        className="flex items-center gap-3 p-3 rounded-2xl text-left transition-all hover:scale-[1.02] active:scale-95"
                        style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-color)" }}
                      >
                        <div className="relative w-10 h-10 rounded-xl overflow-hidden shrink-0">
                          <Image src={related.image} alt={related.name} fill className="object-cover" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-bold truncate" style={{ color: "var(--text-primary)" }}>
                            {related.name}
                          </p>
                          <p className="text-xs font-black text-orange-500">
                            {formatGia(related.basePrice)}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* 6. Reviews */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold" style={{ color: "var(--text-primary)" }}>
                    Đánh giá khách hàng
                  </h3>
                  {reviews.length > 0 && (
                    <div className="flex items-center gap-1.5">
                      <StarDisplay rating={reviews.reduce((s, r) => s + r.rating, 0) / reviews.length} size={13} />
                      <span className="text-xs font-bold" style={{ color: "var(--text-primary)" }}>
                        {(reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)}
                      </span>
                      <span className="text-xs" style={{ color: "var(--text-muted)" }}>
                        ({reviews.length})
                      </span>
                    </div>
                  )}
                </div>

                {isLoadingReviews ? (
                  <div className="space-y-3">
                    {[1, 2].map((i) => (
                      <div key={i} className="flex gap-3 animate-pulse">
                        <div className="w-8 h-8 rounded-full bg-gray-200 shrink-0" />
                        <div className="flex-1 space-y-2">
                          <div className="h-3 w-24 bg-gray-200 rounded" />
                          <div className="h-3 w-48 bg-gray-200 rounded" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : reviews.length === 0 ? (
                  <p className="text-sm text-center py-5" style={{ color: "var(--text-muted)" }}>
                    Chưa có đánh giá. Hãy là người đầu tiên! 🌟
                  </p>
                ) : (
                  <div className="space-y-4 max-h-[260px] overflow-y-auto pr-1">
                    {reviews.slice(0, 10).map((review) => (
                      <ReviewRow key={review._id} review={review} />
                    ))}
                  </div>
                )}
              </div>

              <div className="h-4" />
            </div>
          </div>

          {/* Footer — Add to cart */}
          <div className="p-4 sm:p-6 pb-safe flex items-center justify-between gap-6 relative z-10 border-t" style={{ borderColor: "var(--border-color)", background: "var(--bg-modal)", boxShadow: "0 -10px 40px rgba(0,0,0,0.05)" }}>
            <QuantityControl
              quantity={quantity}
              onIncrease={() => setQuantity((q) => q + 1)}
              onDecrease={() => setQuantity((q) => q - 1)}
            />
            <button
              onClick={handleAddToCart}
              className="flex-1 max-w-[300px] h-14 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-2xl font-black text-lg flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-orange-300/50 hover:-translate-y-0.5 active:translate-y-0 transition-all"
            >
              <span className="opacity-90 font-medium hidden sm:inline mr-2">{formatGia(unitPrice)}</span>
              Thêm {formatGia(totalPrice)}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

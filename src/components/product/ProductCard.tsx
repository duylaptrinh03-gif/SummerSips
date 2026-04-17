"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { formatGia } from "@/utils/formatter";
import { Drink } from "@/types/drink";

interface ProductCardProps {
  drink: Drink;
  onClick: (drink: Drink) => void;
}

const TAG_COLORS: Record<string, string> = {
  "Bán Chạy": "bg-orange-100 text-orange-600 border-orange-200",
  "Phổ Biến": "bg-violet-100 text-violet-600 border-violet-200",
  "Lành Mạnh": "bg-green-100 text-green-600 border-green-200",
  "Mới": "bg-emerald-100 text-emerald-600 border-emerald-200",
  "Yêu Thích": "bg-pink-100 text-pink-600 border-pink-200",
};

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          className={`w-3 h-3 ${star <= Math.round(rating) ? "text-amber-400" : "text-gray-200"}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

export function ProductCard({ drink, onClick }: ProductCardProps) {
  const tagColor = drink.tag
    ? TAG_COLORS[drink.tag] ?? "bg-gray-100 text-gray-600 border-gray-200"
    : "";

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.92 }}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.25 }}
      onClick={() => drink.isAvailable && onClick(drink)}
      className={`group relative rounded-3xl overflow-hidden border flex flex-col cursor-pointer transition-shadow duration-300 hover:shadow-xl hover:shadow-orange-100/60 ${
        !drink.isAvailable ? "opacity-60 cursor-not-allowed" : ""
      }`}
      style={{ background: "var(--bg-card)", borderColor: "var(--border-color)" }}
    >
      {/* Image */}
      <div className="relative h-48 w-full overflow-hidden bg-orange-50/50">
        <Image
          src={drink.image}
          alt={drink.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Sold out overlay */}
        {!drink.isAvailable && (
          <div className="absolute inset-0 bg-white/50 backdrop-blur-[2px] flex items-center justify-center z-10">
            <span className="px-4 py-2 bg-gray-900 text-white rounded-full font-bold text-sm">
              Tạm hết hàng
            </span>
          </div>
        )}

        {/* Tag badge */}
        {drink.tag && drink.isAvailable && (
          <span className={`absolute top-3 left-3 px-3 py-1 text-[11px] font-black rounded-full border shadow-sm z-10 ${tagColor}`}>
            {drink.tag}
          </span>
        )}
      </div>

      {/* Info */}
      <div className="flex flex-col flex-1 p-5 gap-2">
        <h3
          className="font-bold text-lg line-clamp-1 group-hover:text-orange-500 transition-colors"
          style={{ color: "var(--text-primary)" }}
        >
          {drink.name}
        </h3>

        {/* Rating row */}
        <div className="flex items-center gap-2">
          {drink.rating !== undefined ? (
            <>
              <StarRating rating={drink.rating} />
              <span className="text-xs font-semibold text-amber-500">{drink.rating.toFixed(1)}</span>
            </>
          ) : null}
          {drink.soldCount !== undefined && (
            <span className="text-xs ml-auto" style={{ color: "var(--text-muted)" }}>
              {drink.soldCount.toLocaleString("vi-VN")} đã bán
            </span>
          )}
        </div>

        <p className="text-sm line-clamp-2 leading-relaxed flex-1" style={{ color: "var(--text-secondary)" }}>
          {drink.description}
        </p>

        <div className="flex items-center justify-between mt-3">
          <span className="text-xl font-black bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">
            {formatGia(drink.basePrice)}
          </span>
          <div className="w-10 h-10 rounded-full bg-orange-50 dark:bg-orange-900/30 flex items-center justify-center text-orange-500 group-hover:bg-orange-500 group-hover:text-white transition-colors duration-300">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

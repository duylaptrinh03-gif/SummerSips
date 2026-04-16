"use client";

import { useRef, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { formatGia } from "@/utils/formatter";
import { Drink } from "@/types/drink";

interface ProductCardProps {
  drink: Drink;
  onClick: (drink: Drink) => void;
}

export function ProductCard({ drink, onClick }: ProductCardProps) {
  // Map tag to colors
  const tagColors: Record<string, string> = {
    "Bán Chạy": "bg-orange-100 text-orange-600 border-orange-200",
    "Phổ Biến": "bg-violet-100 text-violet-600 border-violet-200",
    "Lành Mạnh": "bg-green-100 text-green-600 border-green-200",
    "Mới": "bg-emerald-100 text-emerald-600 border-emerald-200",
    "Yêu Thích": "bg-pink-100 text-pink-600 border-pink-200",
  };

  const tagColor = drink.tag
    ? tagColors[drink.tag] ?? "bg-gray-100 text-gray-600 border-gray-200"
    : "";

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ y: -5 }}
      onClick={() => drink.isAvailable && onClick(drink)}
      className={`group relative bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl hover:shadow-orange-100/60 border border-gray-100 flex flex-col cursor-pointer transition-all ${
        !drink.isAvailable ? "opacity-60 cursor-not-allowed" : ""
      }`}
    >
      {/* Hình ảnh */}
      <div className="relative h-48 w-full bg-orange-50/50 overflow-hidden">
        <Image
          src={drink.image}
          alt={drink.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
        
        {/* Label hết hàng */}
        {!drink.isAvailable && (
          <div className="absolute inset-0 bg-white/50 backdrop-blur-[2px] flex items-center justify-center z-10">
            <span className="px-4 py-2 bg-gray-900 text-white rounded-full font-bold text-sm">
              Tạm hết hàng 
            </span>
          </div>
        )}

        {/* Tag nổi bật */}
        {drink.tag && drink.isAvailable && (
          <span
            className={`absolute top-3 left-3 px-3 py-1 text-[11px] font-black rounded-full border shadow-sm ${tagColor}`}
          >
            {drink.tag}
          </span>
        )}
      </div>

      {/* Thông tin */}
      <div className="flex flex-col flex-1 p-5 gap-2">
        <h3 className="font-bold text-gray-900 text-lg group-hover:text-orange-500 transition-colors line-clamp-1">
          {drink.name}
        </h3>
        <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed flex-1">
          {drink.description}
        </p>

        <div className="flex items-center justify-between mt-4">
          <span className="text-xl font-black bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">
            {formatGia(drink.basePrice)}
          </span>
          <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center text-orange-500 group-hover:bg-orange-500 group-hover:text-white transition-colors duration-300">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

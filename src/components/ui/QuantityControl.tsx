"use client";

import { motion } from "framer-motion";

interface QuantityControlProps {
  quantity: number;
  onIncrease: () => void;
  onDecrease: () => void;
  min?: number;
}

export function QuantityControl({
  quantity,
  onIncrease,
  onDecrease,
  min = 1,
}: QuantityControlProps) {
  return (
    <div className="flex items-center gap-3 bg-gray-50 rounded-xl p-1.5 border border-gray-100">
      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={onDecrease}
        disabled={quantity <= min}
        className="w-8 h-8 flex items-center justify-center rounded-lg bg-white text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm border border-gray-100 hover:text-orange-500 transition-colors"
      >
        <span className="text-xl font-medium leading-none mb-1">-</span>
      </motion.button>
      
      <span className="w-6 text-center font-bold text-gray-900">{quantity}</span>
      
      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={onIncrease}
        className="w-8 h-8 flex items-center justify-center rounded-lg bg-white text-gray-600 shadow-sm border border-gray-100 hover:text-orange-500 transition-colors"
      >
        <span className="text-xl font-medium leading-none mb-1">+</span>
      </motion.button>
    </div>
  );
}

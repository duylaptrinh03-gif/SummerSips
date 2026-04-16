"use client";

import Image from "next/image";
import { Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { CartItem, calculateItemPrice } from "@/types/cart";
import { formatGia } from "@/utils/formatter";
import { QuantityControl } from "../ui/QuantityControl";
import { useCartStore } from "@/store/useCartStore";

interface CartItemCardProps {
  item: CartItem;
}

export function CartItemCard({ item }: CartItemCardProps) {
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);

  // Tạo string hiển thị options ngắn gọn
  const optionsDesc = [
    `Size ${item.size}`,
    `Đá ${item.iceLevel}%`,
    `Đường ${item.sugarLevel}%`,
    ...item.toppings.map((t) => t.name),
  ].join(", ");

  const totalItemPrice = calculateItemPrice(item);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="flex flex-col sm:flex-row gap-4 p-4 bg-white border border-gray-100 rounded-3xl shadow-sm relative group"
    >
      {/* Hình ảnh */}
      <div className="relative w-24 h-24 shrink-0 rounded-2xl overflow-hidden bg-orange-50 mx-auto sm:mx-0">
        <Image
          src={item.image}
          alt={item.name}
          fill
          className="object-cover"
        />
      </div>

      {/* Thông tin */}
      <div className="flex flex-col flex-1 gap-1">
        <div className="flex justify-between items-start gap-4">
          <h3 className="font-bold text-gray-900 text-lg leading-tight">
            {item.name}
          </h3>
          <button
            onClick={() => removeItem(item.cartId)}
            className="p-2 -mr-2 -mt-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all sm:opacity-0 sm:group-hover:opacity-100"
            title="Xóa"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-gray-500 leading-relaxed max-w-[90%]">
          {optionsDesc}
        </p>

        {item.note && (
          <p className="text-xs text-orange-600 bg-orange-50 p-2 rounded-lg mt-1 italic inline-block w-fit max-w-full">
            📝 {item.note}
          </p>
        )}

        <div className="flex items-center justify-between mt-auto pt-3">
          <span className="font-black text-lg bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">
            {formatGia(totalItemPrice)}
          </span>
          <QuantityControl
            quantity={item.quantity}
            onIncrease={() => updateQuantity(item.cartId, item.quantity + 1)}
            onDecrease={() => updateQuantity(item.cartId, item.quantity - 1)}
          />
        </div>
      </div>
    </motion.div>
  );
}

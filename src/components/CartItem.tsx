"use client";

import Image from "next/image";
import { CartItem as CartItemType } from "@/types/order";
import { useCart } from "@/context/CartContext";

interface CartItemProps {
  item: CartItemType;
}

export default function CartItem({ item }: CartItemProps) {
  const { increaseQty, decreaseQty, removeItem } = useCart();

  return (
    <div className="flex items-center gap-4 p-4 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
      {/* Image */}
      <div className="relative w-20 h-20 shrink-0 rounded-xl overflow-hidden bg-gradient-to-br from-orange-50 to-pink-50">
        <Image
          src={item.image}
          alt={item.name}
          fill
          className="object-cover"
          sizes="80px"
        />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <h4 className="font-bold text-gray-900 truncate">{item.name}</h4>
        <p className="text-sm text-orange-500 font-semibold mt-0.5">
          {item.price.toLocaleString("vi-VN")}đ / ly
        </p>
        <p className="text-xs text-gray-400 mt-0.5">
          Thành tiền:{" "}
          <span className="font-bold text-gray-600">
            {(item.price * item.quantity).toLocaleString("vi-VN")}đ
          </span>
        </p>
      </div>

      {/* Qty controls */}
      <div className="flex items-center gap-2 shrink-0">
        <button
          id={`cart-decrease-${item.id}`}
          onClick={() => decreaseQty(item.id)}
          className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:border-orange-400 hover:text-orange-500 hover:bg-orange-50 transition-all duration-150 font-bold text-lg"
          aria-label="Giảm số lượng"
        >
          −
        </button>
        <span className="w-8 text-center font-black text-gray-900 text-base select-none">
          {item.quantity}
        </span>
        <button
          id={`cart-increase-${item.id}`}
          onClick={() => increaseQty(item.id)}
          className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:border-orange-400 hover:text-orange-500 hover:bg-orange-50 transition-all duration-150 font-bold text-lg"
          aria-label="Tăng số lượng"
        >
          +
        </button>
      </div>

      {/* Remove */}
      <button
        id={`cart-remove-${item.id}`}
        onClick={() => removeItem(item.id)}
        className="w-8 h-8 rounded-full flex items-center justify-center text-gray-300 hover:text-red-400 hover:bg-red-50 transition-all duration-150 shrink-0"
        aria-label="Xóa sản phẩm"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}

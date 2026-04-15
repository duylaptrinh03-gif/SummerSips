"use client";

import Image from "next/image";
import { useState } from "react";
import { ShopDrink } from "@/data/shopDrinks";
import { useCart } from "@/context/CartContext";

interface ShopDrinkCardProps {
  drink: ShopDrink;
}

const tagColors: Record<string, string> = {
  "Bán Chạy": "bg-orange-100 text-orange-600 border-orange-200",
  "Phổ Biến": "bg-violet-100 text-violet-600 border-violet-200",
  "Lành Mạnh": "bg-green-100 text-green-600 border-green-200",
  "Mới": "bg-emerald-100 text-emerald-600 border-emerald-200",
  "Yêu Thích": "bg-pink-100 text-pink-600 border-pink-200",
};

export default function ShopDrinkCard({ drink }: ShopDrinkCardProps) {
  const { addItem, items } = useCart();
  const [added, setAdded] = useState(false);

  const inCart = items.find((i) => i.id === drink.id);
  const tagColor = drink.tag ? (tagColors[drink.tag] ?? "bg-gray-100 text-gray-600 border-gray-200") : "";

  const handleAdd = () => {
    addItem({ id: drink.id, name: drink.name, price: drink.price, image: drink.image });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl hover:shadow-orange-100/60 transition-all duration-400 hover:-translate-y-1.5 flex flex-col border border-gray-100">
      {/* Image */}
      <div className="relative h-48 overflow-hidden bg-gradient-to-br from-orange-50 to-pink-50">
        <Image
          src={drink.image}
          alt={drink.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        {drink.tag && (
          <span className={`absolute top-3 left-3 px-2.5 py-1 text-xs font-bold rounded-full border ${tagColor}`}>
            {drink.tag}
          </span>
        )}
        {inCart && (
          <span className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/90 text-xs font-bold text-orange-600 shadow-sm">
            🛒 ×{inCart.quantity}
          </span>
        )}
      </div>

      {/* Body */}
      <div className="flex flex-col flex-1 p-4 gap-2">
        <h3 className="font-bold text-gray-900 text-base group-hover:text-orange-500 transition-colors">
          {drink.name}
        </h3>
        <p className="text-xs text-gray-400 leading-relaxed flex-1">{drink.description}</p>

        <div className="flex items-center justify-between mt-2">
          <span className="text-lg font-black bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">
            {drink.price.toLocaleString("vi-VN")}đ
          </span>
          <button
            id={`add-to-cart-shop-${drink.id}`}
            onClick={handleAdd}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-bold transition-all duration-200 ${
              added
                ? "bg-green-500 text-white scale-95"
                : "bg-gradient-to-r from-orange-500 to-pink-500 text-white hover:shadow-lg hover:shadow-orange-300/50 hover:scale-105 active:scale-95"
            }`}
          >
            {added ? (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
                Đã thêm!
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Thêm vào giỏ
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

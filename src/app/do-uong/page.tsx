"use client";

import Navbar from "@/components/Navbar";
import ShopDrinkCard from "@/components/ShopDrinkCard";
import { shopDrinks } from "@/data/shopDrinks";
import Link from "next/link";
import { useCart } from "@/context/CartContext";

export default function ShopPage() {
  const { totalCount, totalPrice } = useCart();

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-pink-50">
      <Navbar />

      <main className="pt-16">
        {/* Hero */}
        <section className="py-14 px-4 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-100 text-orange-600 text-sm font-semibold mb-4">
            🌊 Thực Đơn Hôm Nay
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-gray-900 mb-3">
            Chọn Đồ Uống{" "}
            <span className="bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">
              Yêu Thích
            </span>
          </h1>
          <p className="text-gray-500 text-lg max-w-lg mx-auto">
            Pha chế tươi mới mỗi ngày — đặt hàng và nhận ngay trong 60 phút.
          </p>
        </section>

        {/* Drink grid */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 pb-40">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {shopDrinks.map((drink) => (
              <ShopDrinkCard key={drink.id} drink={drink} />
            ))}
          </div>
        </section>
      </main>

      {/* Floating cart bar */}
      {totalCount > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-full max-w-sm px-4 animate-[fadeInUp_0.3s_ease-out]">
          <Link
            href="/cart"
            id="shop-floating-cart"
            className="flex items-center justify-between w-full px-5 py-3.5 bg-gray-900 text-white rounded-2xl shadow-2xl shadow-gray-900/40 hover:bg-gray-800 transition-all duration-200"
          >
            <div className="flex items-center gap-3">
              <div className="relative">
                <span className="text-2xl">🛒</span>
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 flex items-center justify-center text-xs font-black bg-orange-500 rounded-full">
                  {totalCount}
                </span>
              </div>
              <span className="font-semibold text-sm">Xem giỏ hàng</span>
            </div>
            <span className="font-black text-orange-400">
              {totalPrice.toLocaleString("vi-VN")}đ
            </span>
          </Link>
        </div>
      )}
    </div>
  );
}

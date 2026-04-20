"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { drinkService } from "@/services/drinkService";
import { Drink } from "@/types/drink";

function BestSellerSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
      {[1, 2, 3].map((i) => (
        <div key={i} className="rounded-3xl overflow-hidden border border-gray-100 animate-pulse">
          <div className="h-52 bg-gray-100" />
          <div className="p-5 space-y-3">
            <div className="h-4 bg-gray-100 rounded-full w-3/4" />
            <div className="h-3 bg-gray-100 rounded-full w-full" />
            <div className="h-3 bg-gray-100 rounded-full w-2/3" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function BestSellerSection() {
  const [drinks, setDrinks] = useState<Drink[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    drinkService.getDrinks()
      .then((data) => setDrinks(data.slice(0, 3)))
      .catch(() => setDrinks([]))
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <section id="best-sellers" className="py-20 px-6 bg-gradient-to-b from-white to-orange-50/50">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-100 text-orange-600 text-sm font-semibold mb-4">
            🔥 Được Mua Nhiều Nhất
          </span>
          <h2 className="text-4xl sm:text-5xl font-black text-gray-900 mb-4">
            Top Đồ Uống{" "}
            <span className="bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">
              Yêu Thích
            </span>
          </h2>
          <p className="text-gray-500 text-lg max-w-lg mx-auto">
            Những ly đồ uống được khách hàng lựa chọn nhiều nhất — tươi ngon, đậm đà, không thể bỏ qua.
          </p>
        </div>

        {isLoading && <BestSellerSkeleton />}

        {!isLoading && drinks.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
            {drinks.map((drink, idx) => (
              <div
                key={drink._id}
                className="relative bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl hover:shadow-orange-100/60 transition-all duration-400 hover:-translate-y-1.5 border border-gray-100 group"
              >
                <div
                  className={`absolute top-3 left-3 z-10 w-8 h-8 rounded-full flex items-center justify-center text-sm font-black shadow-md ${
                    idx === 0 ? "bg-yellow-400 text-white" : idx === 1 ? "bg-gray-300 text-gray-700" : "bg-amber-600 text-white"
                  }`}
                >
                  #{idx + 1}
                </div>

                <div className="relative h-52 overflow-hidden bg-gradient-to-br from-orange-50 to-pink-50">
                  {drink.image ? (
                    <Image
                      src={drink.image}
                      alt={drink.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 640px) 100vw, 33vw"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-5xl">🧋</div>
                  )}
                  {drink.tag && (
                    <span className="absolute top-3 right-3 px-2.5 py-1 text-xs font-bold rounded-full bg-white/90 text-orange-600 shadow-sm">
                      {drink.tag}
                    </span>
                  )}
                </div>

                <div className="p-5">
                  <h3 className="font-bold text-gray-900 text-base mb-1 group-hover:text-orange-500 transition-colors">
                    {drink.name}
                  </h3>
                  <p className="text-xs text-gray-400 leading-relaxed mb-4 line-clamp-2">
                    {drink.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-black bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">
                      {drink.basePrice.toLocaleString("vi-VN")}đ
                    </span>
                    <div className="flex items-center gap-1 text-xs text-gray-400">
                      <div className="w-20 h-1.5 rounded-full bg-gray-100 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-orange-400 to-pink-400"
                          style={{ width: `${100 - idx * 15}%` }}
                        />
                      </div>
                      <span className="font-semibold text-orange-500">
                        {idx === 0 ? "98%" : idx === 1 ? "83%" : "71%"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="text-center">
          <p className="text-gray-400 text-sm mb-4">Muốn thử ngay những hương vị trên?</p>
          <Link
            href="/thuc-don"
            id="home-goto-shop"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-orange-500 to-pink-500 text-white font-bold text-base rounded-full hover:shadow-xl hover:shadow-orange-300/50 hover:-translate-y-1 active:translate-y-0 transition-all duration-300"
          >
            Xem Đầy Đủ Thực Đơn
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}

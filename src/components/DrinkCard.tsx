import Image from "next/image";
import { Drink } from "@/data/drinks";

interface DrinkCardProps {
  drink: Drink;
}

export default function DrinkCard({ drink }: DrinkCardProps) {
  const tagColors: Record<string, string> = {
    "Bán Chạy": "bg-orange-100 text-orange-600 border-orange-200",
    "Mới": "bg-emerald-100 text-emerald-600 border-emerald-200",
    "Theo Mùa": "bg-sky-100 text-sky-600 border-sky-200",
    "Phổ Biến": "bg-violet-100 text-violet-600 border-violet-200",
    "Cao Cấp": "bg-amber-100 text-amber-600 border-amber-200",
    "Lành Mạnh": "bg-green-100 text-green-600 border-green-200",
  };

  const tagColor = tagColors[drink.tag] ?? "bg-gray-100 text-gray-600 border-gray-200";

  return (
    <div className="group relative bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-2xl hover:shadow-orange-200/50 transition-all duration-500 hover:-translate-y-2 flex flex-col">
      {/* Image container */}
      <div className="relative h-56 overflow-hidden bg-gradient-to-br from-orange-50 to-pink-50">
        <Image
          src={drink.image}
          alt={drink.name}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-700"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        {/* Tag badge */}
        <span
          className={`absolute top-3 left-3 px-3 py-1 text-xs font-bold rounded-full border ${tagColor} backdrop-blur-sm`}
        >
          {drink.tag}
        </span>
        {/* Rating badge */}
        <span className="absolute top-3 right-3 flex items-center gap-1 px-3 py-1 rounded-full bg-white/90 backdrop-blur-sm text-xs font-bold text-gray-700 shadow-sm">
          ⭐ {drink.rating}
        </span>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-5">
        <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-orange-500 transition-colors duration-300">
          {drink.name}
        </h3>
        <p className="text-sm text-gray-500 leading-relaxed flex-1 mb-4">
          {drink.description}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between mt-auto">
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-black bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">
              {drink.price.toLocaleString("vi-VN")}đ
            </span>
          </div>
          <button
            id={`add-to-cart-${drink.id}`}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-pink-500 text-white text-sm font-bold rounded-full hover:shadow-lg hover:shadow-orange-300/50 hover:scale-105 active:scale-95 transition-all duration-200"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            Thêm Vào Giỏ
          </button>
        </div>
      </div>

      {/* Hover glow effect */}
      <div className="absolute inset-0 rounded-3xl ring-2 ring-transparent group-hover:ring-orange-300/50 transition-all duration-500 pointer-events-none" />
    </div>
  );
}

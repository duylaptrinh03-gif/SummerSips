import Image from "next/image";
import Link from "next/link";
import Hero from "@/components/Hero";
import FeatureSection from "@/components/FeatureSection";
import Testimonial from "@/components/Testimonial";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { shopDrinks } from "@/data/shopDrinks";

// Top 3 đồ uống bán chạy nhất (hiển thị tĩnh, không đặt được)
const bestSellers = shopDrinks.slice(0, 3);

// Số liệu thống kê tổng quan
const stats = [
  { value: "50K+", label: "Khách Hàng", icon: "👥" },
  { value: "20+", label: "Hương Vị", icon: "🌈" },
  { value: "4.9★", label: "Đánh Giá", icon: "⭐" },
  { value: "60 phút", label: "Giao Hàng", icon: "🚀" },
];

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-1 pt-[64px]">
        {/* Hero Section */}
        <Hero />

        {/* ── Stats Bar ─────────────────────────────────── */}
        <section className="bg-white border-b border-gray-100">
          <div className="max-w-5xl mx-auto px-6 py-10 grid grid-cols-2 sm:grid-cols-4 gap-6">
            {stats.map((s) => (
              <div
                key={s.label}
                className="flex flex-col items-center gap-1 text-center"
              >
                <span className="text-3xl">{s.icon}</span>
                <span className="text-2xl font-black bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">
                  {s.value}
                </span>
                <span className="text-sm text-gray-400 font-medium">{s.label}</span>
              </div>
            ))}
          </div>
        </section>

        {/* ── Top Bán Chạy ──────────────────────────────── */}
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

            {/* Top 3 cards — display only, no cart button */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
              {bestSellers.map((drink, idx) => (
                <div
                  key={drink.id}
                  className="relative bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl hover:shadow-orange-100/60 transition-all duration-400 hover:-translate-y-1.5 border border-gray-100 group"
                >
                  {/* Rank badge */}
                  <div
                    className={`absolute top-3 left-3 z-10 w-8 h-8 rounded-full flex items-center justify-center text-sm font-black shadow-md ${
                      idx === 0
                        ? "bg-yellow-400 text-white"
                        : idx === 1
                        ? "bg-gray-300 text-gray-700"
                        : "bg-amber-600 text-white"
                    }`}
                  >
                    #{idx + 1}
                  </div>

                  {/* Image */}
                  <div className="relative h-52 overflow-hidden bg-gradient-to-br from-orange-50 to-pink-50">
                    <Image
                      src={drink.image}
                      alt={drink.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 640px) 100vw, 33vw"
                    />
                    {drink.tag && (
                      <span className="absolute top-3 right-3 px-2.5 py-1 text-xs font-bold rounded-full bg-white/90 text-orange-600 shadow-sm">
                        {drink.tag}
                      </span>
                    )}
                  </div>

                  {/* Info */}
                  <div className="p-5">
                    <h3 className="font-bold text-gray-900 text-base mb-1 group-hover:text-orange-500 transition-colors">
                      {drink.name}
                    </h3>
                    <p className="text-xs text-gray-400 leading-relaxed mb-4">
                      {drink.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-black bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">
                        {drink.price.toLocaleString("vi-VN")}đ
                      </span>
                      {/* Popularity bar */}
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

            {/* CTA đến trang đặt hàng */}
            <div className="text-center">
              <p className="text-gray-400 text-sm mb-4">
                Muốn thử ngay những hương vị trên?
              </p>
              <Link
                href="/shop"
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

        {/* ── Tại Sao Chọn Chúng Tôi + Khuyến Mãi ─────── */}
        <FeatureSection />

        {/* ── Đánh Giá Khách Hàng ───────────────────────── */}
        <Testimonial />

        {/* ── Call To Action ────────────────────────────── */}
        <CTASection />
      </main>

      <Footer />
    </div>
  );
}

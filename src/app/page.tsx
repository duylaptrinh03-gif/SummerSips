import Hero from "@/components/Hero";
import FeatureSection from "@/components/FeatureSection";
import Testimonial from "@/components/Testimonial";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { BestSellerSection } from "@/components/product/BestSellerSection";

// Số liệu thống kê tổng quan (static UI data — không cần API)
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
              <div key={s.label} className="flex flex-col items-center gap-1 text-center">
                <span className="text-3xl">{s.icon}</span>
                <span className="text-2xl font-black bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">
                  {s.value}
                </span>
                <span className="text-sm text-gray-400 font-medium">{s.label}</span>
              </div>
            ))}
          </div>
        </section>

        {/* ── Top Bán Chạy — fetches từ API ──────────────── */}
        <BestSellerSection />

        {/* ── Tại Sao Chọn Chúng Tôi ─────────────────────── */}
        <FeatureSection />

        {/* ── Đánh Giá Khách Hàng ─────────────────────────── */}
        <Testimonial />

        {/* ── Call To Action ──────────────────────────────── */}
        <CTASection />
      </main>

      <Footer />
    </div>
  );
}

import Hero from "@/components/Hero";
import DrinkCard from "@/components/DrinkCard";
import FeatureSection from "@/components/FeatureSection";
import Testimonial from "@/components/Testimonial";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { drinks } from "@/data/drinks";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navigation */}
      <Navbar />

      {/* Main content */}
      <main className="flex-1 pt-[72px]">
        {/* Hero Section */}
        <Hero />

        {/* Drinks Grid Section */}
        <section id="drinks" className="py-24 px-6 bg-white">
          <div className="max-w-6xl mx-auto">
            {/* Section header */}
            <div className="text-center mb-14">
              <span className="inline-block px-4 py-1.5 rounded-full bg-orange-100 text-orange-600 text-sm font-semibold mb-4">
                🌊 Tuyển Chọn Tươi Mát
              </span>
              <h2 className="text-4xl sm:text-5xl font-black text-gray-900 mb-4">
                Yêu Thích{" "}
                <span className="bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">
                  Mùa Này
                </span>
              </h2>
              <p className="text-lg text-gray-500 max-w-xl mx-auto">
                Mỗi ly đều được pha chế tươi mới mỗi ngày từ những loại trái cây nhiệt đới thượng hạng. Chọn vị bạn thích nhé!
              </p>
            </div>

            {/* Drink cards grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {drinks.map((drink) => (
                <DrinkCard key={drink.id} drink={drink} />
              ))}
            </div>

            {/* View all */}
            <div className="text-center mt-12">
              <Link
                href="/shop"
                id="view-all-drinks"
                className="inline-block px-8 py-4 border-2 border-orange-400 text-orange-500 font-bold text-base rounded-full hover:bg-orange-500 hover:text-white hover:shadow-lg hover:shadow-orange-300/50 hover:-translate-y-1 transition-all duration-300"
              >
                Đặt Hàng Ngay 🛒
              </Link>
            </div>
          </div>
        </section>

        {/* Feature Section + Promotions */}
        <FeatureSection />

        {/* Testimonials */}
        <Testimonial />

        {/* CTA Section */}
        <CTASection />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}

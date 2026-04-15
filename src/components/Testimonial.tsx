import Image from "next/image";
import { testimonials } from "@/data/testimonials";

export default function Testimonial() {
  return (
    <section id="testimonials" className="py-24 px-6 bg-gradient-to-br from-orange-50 via-pink-50 to-yellow-50 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute -top-16 -left-16 w-80 h-80 rounded-full bg-orange-200/30 blur-3xl" />
      <div className="absolute -bottom-16 -right-16 w-80 h-80 rounded-full bg-pink-200/30 blur-3xl" />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Section header */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-pink-100 text-pink-600 text-sm font-semibold mb-4">
            💬 Khách Hàng Yêu Thích
          </span>
          <h2 className="text-4xl sm:text-5xl font-black text-gray-900 mb-4">
            Mọi Người{" "}
            <span className="bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">
              Nói Gì?
            </span>
          </h2>
          <p className="text-lg text-gray-500 max-w-xl mx-auto">
            Hàng ngàn khách hàng đã chọn Summer Sips làm thức uống yêu thích mỗi ngày.
          </p>
        </div>

        {/* Testimonial cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, index) => (
            <div
              key={t.id}
              className="relative bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl hover:shadow-pink-200/40 hover:-translate-y-2 transition-all duration-500 group"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              {/* Quote mark */}
              <div className="absolute top-6 right-6 text-6xl font-black text-orange-100 select-none leading-none group-hover:text-orange-200 transition-colors">
                &ldquo;
              </div>

              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <span key={i} className="text-yellow-400 text-lg">★</span>
                ))}
              </div>

              {/* Quote */}
              <p className="text-gray-600 leading-relaxed mb-6 relative z-10">
                &ldquo;{t.quote}&rdquo;
              </p>

              {/* Author */}
              <div className="flex items-center gap-3">
                <div className="relative w-12 h-12 rounded-full overflow-hidden ring-2 ring-orange-200 ring-offset-2">
                  <Image
                    src={t.avatar}
                    alt={t.name}
                    fill
                    className="object-cover"
                    sizes="48px"
                  />
                </div>
                <div>
                  <div className="font-bold text-gray-900">{t.name}</div>
                  <div className="text-sm text-gray-400">{t.role}</div>
                </div>
              </div>

              {/* Bottom gradient accent */}
              <div className="absolute bottom-0 left-0 right-0 h-1 rounded-b-3xl bg-gradient-to-r from-orange-400 to-pink-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

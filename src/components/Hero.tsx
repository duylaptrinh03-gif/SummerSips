import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-orange-50 via-yellow-50 to-pink-50">
      {/* Animated background blobs */}
      <div className="absolute top-[-10%] left-[-5%] w-96 h-96 rounded-full bg-gradient-to-br from-yellow-300/40 to-orange-300/40 blur-3xl animate-[blob_8s_ease-in-out_infinite]" />
      <div className="absolute bottom-[-10%] right-[-5%] w-96 h-96 rounded-full bg-gradient-to-br from-pink-300/40 to-rose-300/40 blur-3xl animate-[blob_8s_ease-in-out_infinite_2s]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 rounded-full bg-gradient-to-br from-cyan-200/30 to-teal-200/30 blur-3xl animate-[blob_8s_ease-in-out_infinite_4s]" />

      {/* Floating fruit emojis */}
      <span className="absolute top-16 left-12 text-5xl animate-[float_4s_ease-in-out_infinite] select-none">🍋</span>
      <span className="absolute top-24 right-16 text-4xl animate-[float_4s_ease-in-out_infinite_1s] select-none">🍓</span>
      <span className="absolute bottom-32 left-20 text-4xl animate-[float_4s_ease-in-out_infinite_2s] select-none">🍉</span>
      <span className="absolute bottom-24 right-24 text-5xl animate-[float_4s_ease-in-out_infinite_0.5s] select-none">🥭</span>
      <span className="absolute top-1/3 right-8 text-3xl animate-[float_4s_ease-in-out_infinite_1.5s] select-none">🍊</span>
      <span className="absolute top-2/3 left-8 text-3xl animate-[float_4s_ease-in-out_infinite_3s] select-none">🌴</span>

      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/70 backdrop-blur-sm border border-orange-200 shadow-sm mb-8 animate-[fadeInDown_0.6s_ease-out]">
          <span className="text-orange-500 font-semibold text-sm tracking-wide uppercase">☀️ Bộ Sưu Tập Hè 2026</span>
        </div>

        {/* Headline */}
        <h1 className="text-6xl sm:text-7xl md:text-8xl font-black leading-none tracking-tight mb-6 animate-[fadeInDown_0.8s_ease-out]">
          <span className="bg-gradient-to-r from-orange-500 via-pink-500 to-rose-500 bg-clip-text text-transparent">
            Thưởng Thức
          </span>
          <br />
          <span className="bg-gradient-to-r from-yellow-500 via-orange-400 to-pink-500 bg-clip-text text-transparent">
            Mùa Hè
          </span>
        </h1>

        {/* Subheadline */}
        <p className="text-xl sm:text-2xl text-gray-600 max-w-2xl mx-auto mb-10 leading-relaxed animate-[fadeInUp_0.8s_ease-out]">
          Khám phá những thức uống thủ công bùng nổ hương vị nhiệt đới. Mỗi ngụm là một kỳ nghỉ mini.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-[fadeInUp_1s_ease-out]">
          <Link
            href="#drinks"
            id="hero-cta-shop"
            className="group relative px-8 py-4 bg-gradient-to-r from-orange-500 to-pink-500 text-white font-bold text-lg rounded-full shadow-lg shadow-orange-300/50 hover:shadow-orange-400/60 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden"
          >
            <span className="relative z-10 flex items-center gap-2">
              Mua Ngay
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-orange-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </Link>
          <Link
            href="#features"
            id="hero-cta-learn"
            className="px-8 py-4 bg-white/80 backdrop-blur-sm text-gray-700 font-bold text-lg rounded-full border border-white shadow-md hover:bg-white hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
          >
            Khám Phá Thêm ✨
          </Link>
        </div>

        {/* Stats row */}
        <div className="mt-16 flex flex-wrap justify-center gap-8 animate-[fadeInUp_1.2s_ease-out]">
          {[
            { value: "50K+", label: "Khách Hàng Hài Lòng" },
            { value: "20+", label: "Hương Vị Độc Đáo" },
            { value: "4.9★", label: "Đánh Giá Trung Bình" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-3xl font-black bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">{stat.value}</div>
              <div className="text-sm text-gray-500 font-medium mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 80L60 72C120 64 240 48 360 48C480 48 600 64 720 64C840 64 960 48 1080 40C1200 32 1320 32 1380 32L1440 32V80H1380C1320 80 1200 80 1080 80C960 80 840 80 720 80C600 80 480 80 360 80C240 80 120 80 60 80H0Z" fill="white"/>
        </svg>
      </div>
    </section>
  );
}

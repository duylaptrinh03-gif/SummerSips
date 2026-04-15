"use client";

import { useState } from "react";
import Link from "next/link";

export default function CTASection() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
    }
  };

  return (
    <section
      id="cta"
      className="py-24 px-6 bg-gradient-to-br from-orange-500 via-pink-500 to-rose-500 relative overflow-hidden"
    >
      {/* Animated background shapes */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -left-20 w-80 h-80 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-20 -right-20 w-80 h-80 rounded-full bg-yellow-300/20 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-white/5 blur-3xl" />
      </div>

      {/* Floating elements */}
      <span className="absolute top-8 left-16 text-5xl animate-[float_4s_ease-in-out_infinite] select-none opacity-70">🍹</span>
      <span className="absolute top-12 right-20 text-4xl animate-[float_4s_ease-in-out_infinite_1s] select-none opacity-70">🌺</span>
      <span className="absolute bottom-12 left-24 text-4xl animate-[float_4s_ease-in-out_infinite_2s] select-none opacity-70">🏝️</span>
      <span className="absolute bottom-8 right-16 text-5xl animate-[float_4s_ease-in-out_infinite_0.5s] select-none opacity-70">☀️</span>

      <div className="max-w-3xl mx-auto text-center relative z-10">
        <span className="inline-block px-4 py-1.5 rounded-full bg-white/20 text-white text-sm font-semibold mb-6 backdrop-blur-sm">
          🎁 Cùng 50.000+ Khách Hàng Hạnh Phúc
        </span>

        <h2 className="text-4xl sm:text-5xl md:text-6xl font-black text-white mb-6 leading-tight">
          Sẵn Sàng Thưởng Thức{" "}
          <span className="text-yellow-300">Mùa Hè?</span>
        </h2>

        <p className="text-xl text-white/80 mb-10 leading-relaxed max-w-xl mx-auto">
          Đăng ký và nhận{" "}
          <span className="font-bold text-yellow-300">giảm 15%</span> cho đơn hàng đầu tiên cùng các ưu đãi mùa hè độc quyền gửi thẳng đến hộp thư của bạn.
        </p>

        {subscribed ? (
          <div className="flex flex-col items-center gap-4 animate-[fadeInUp_0.5s_ease-out]">
            <div className="inline-flex items-center gap-3 px-8 py-4 bg-white/20 backdrop-blur-sm rounded-2xl border border-white/30">
              <span className="text-3xl">🎉</span>
              <span className="text-white font-bold text-lg">
                Đăng ký thành công! Kiểm tra hộp thư để nhận mã giảm giá nhé.
              </span>
            </div>
          </div>
        ) : (
          <form
            onSubmit={handleSubscribe}
            className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
          >
            <input
              id="cta-email-input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Nhập email của bạn..."
              required
              className="flex-1 px-5 py-4 rounded-2xl bg-white/20 backdrop-blur-sm text-white placeholder-white/60 border border-white/30 focus:outline-none focus:border-white focus:bg-white/30 transition-all text-base"
            />
            <button
              id="cta-subscribe-btn"
              type="submit"
              className="px-6 py-4 bg-white text-orange-500 font-bold text-base rounded-2xl hover:bg-yellow-300 hover:text-orange-600 hover:scale-105 active:scale-95 transition-all duration-200 shadow-lg whitespace-nowrap"
            >
              Nhận Giảm 15% 🍊
            </button>
          </form>
        )}

        <p className="text-white/50 text-sm mt-4">
          Không spam. Hủy đăng ký bất cứ lúc nào. 🔒 Bảo mật thông tin.
        </p>

        <div className="mt-10">
          <Link
            href="#drinks"
            id="cta-order-now"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white/20 backdrop-blur-sm border border-white/40 text-white font-bold text-lg rounded-full hover:bg-white/30 hover:scale-105 active:scale-95 transition-all duration-200"
          >
            Đặt Ngay & Nhâm Nhi Thôi
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}

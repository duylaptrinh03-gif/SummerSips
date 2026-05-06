"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { LazyHeroParticles } from "@/components/three";

// ── Animated counter helper ──────────────────────────────────────────────────
const stats = [
  { value: "50K+", label: "Khách Hàng", icon: "👥" },
  { value: "20+", label: "Hương Vị", icon: "🌈" },
  { value: "4.9★", label: "Đánh Giá", icon: "⭐" },
  { value: "60'", label: "Giao Hàng", icon: "🚀" },
];

// ── Framer variants ──────────────────────────────────────────────────────────
const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] as const } },
};

// ── Hero ─────────────────────────────────────────────────────────────────────
export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* ── CSS gradient backdrop ─────────────────────────────────────────── */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-50 via-yellow-50/60 to-pink-50" />

      {/* ── Blob decorations ─────────────────────────────────────────────── */}
      <div className="absolute top-[-10%] left-[-5%] w-[500px] h-[500px] rounded-full bg-gradient-to-br from-yellow-300/30 to-orange-300/30 blur-3xl animate-[blob_8s_ease-in-out_infinite]" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-gradient-to-br from-pink-300/30 to-rose-300/30 blur-3xl animate-[blob_8s_ease-in-out_infinite_2s]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-gradient-to-br from-cyan-200/20 to-teal-200/20 blur-3xl animate-[blob_8s_ease-in-out_infinite_4s]" />

      {/* ── Three.js Particle Layer ───────────────────────────────────────── */}
      {/* Respects prefers-reduced-motion via CSS — particles are decorative */}
      <div className="absolute inset-0 motion-safe:block motion-reduce:hidden">
        <LazyHeroParticles primaryColor="#f97316" secondaryColor="#ec4899" />
      </div>

      {/* ── Floating emoji (CSS fallback for reduced-motion) ─────────────── */}
      <span className="motion-safe:hidden absolute top-16 left-12 text-5xl select-none animate-[float_4s_ease-in-out_infinite]">🍋</span>
      <span className="motion-safe:hidden absolute top-24 right-16 text-4xl select-none animate-[float_4s_ease-in-out_infinite_1s]">🍓</span>
      <span className="motion-safe:hidden absolute bottom-32 left-20 text-4xl select-none animate-[float_4s_ease-in-out_infinite_2s]">🍉</span>
      <span className="motion-safe:hidden absolute bottom-24 right-24 text-5xl select-none animate-[float_4s_ease-in-out_infinite_0.5s]">🥭</span>

      {/* ── Content ──────────────────────────────────────────────────────── */}
      <motion.div
        className="relative z-10 max-w-5xl mx-auto px-6 text-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Badge */}
        <motion.div variants={itemVariants}>
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/70 backdrop-blur-sm border border-orange-200 shadow-sm mb-8">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500" />
            </span>
            <span className="text-orange-600 font-semibold text-sm tracking-wide uppercase">
              ☀️ Bộ Sưu Tập Hè 2026
            </span>
          </div>
        </motion.div>

        {/* Headline */}
        <motion.h1
          className="text-6xl sm:text-7xl md:text-8xl font-black leading-none tracking-tight mb-6"
          variants={itemVariants}
        >
          <span className="bg-gradient-to-r from-orange-500 via-pink-500 to-rose-500 bg-clip-text text-transparent drop-shadow-sm">
            Thưởng Thức
          </span>
          <br />
          <span className="bg-gradient-to-r from-yellow-500 via-orange-400 to-pink-500 bg-clip-text text-transparent">
            Mùa Hè
          </span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          className="text-xl sm:text-2xl text-gray-600 max-w-2xl mx-auto mb-10 leading-relaxed"
          variants={itemVariants}
        >
          Khám phá những thức uống thủ công bùng nổ hương vị nhiệt đới.{" "}
          <span className="text-orange-500 font-semibold">Mỗi ngụm là một kỳ nghỉ mini.</span>
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          variants={itemVariants}
        >
          <Link
            href="/thuc-don"
            id="hero-cta-shop"
            className="group relative px-8 py-4 bg-gradient-to-r from-orange-500 to-pink-500 text-white font-bold text-lg rounded-full shadow-lg shadow-orange-300/50 hover:shadow-orange-400/60 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden"
          >
            <span className="relative z-10 flex items-center gap-2">
              Mua Ngay 🛒
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-orange-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </Link>

          <Link
            href="/dang-nhap"
            id="hero-cta-login"
            className="px-8 py-4 bg-white/80 backdrop-blur-sm text-gray-700 font-bold text-lg rounded-full border border-white shadow-md hover:bg-white hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
          >
            Đăng Nhập ✨
          </Link>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          className="mt-16 flex flex-col items-center gap-2 opacity-60"
          variants={itemVariants}
        >
          <p className="text-xs text-gray-500 font-medium">Cuộn để khám phá</p>
          <div style={{ animation: "scroll-indicator 1.5s ease-in-out infinite" }}>
            <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </motion.div>

        {/* Stats row */}
        <motion.div
          className="mt-16 flex flex-wrap justify-center gap-8"
          variants={itemVariants}
        >
          {stats.map((stat) => (
            <div key={stat.label} className="text-center group cursor-default">
              <div className="text-3xl mb-1 group-hover:scale-110 transition-transform duration-300">
                {stat.icon}
              </div>
              <div className="text-3xl font-black bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">
                {stat.value}
              </div>
              <div className="text-sm text-gray-500 font-medium mt-0.5">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </motion.div>

      {/* Bottom wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M0 80L60 72C120 64 240 48 360 48C480 48 600 64 720 64C840 64 960 48 1080 40C1200 32 1320 32 1380 32L1440 32V80H1380C1320 80 1200 80 1080 80C960 80 840 80 720 80C600 80 480 80 360 80C240 80 120 80 60 80H0Z"
            style={{ fill: "var(--bg-primary, white)" }}
          />
        </svg>
      </div>
    </section>
  );
}

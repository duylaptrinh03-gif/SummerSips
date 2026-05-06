import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "404 — Trang Không Tồn Tại | SummerSips",
  description: "Trang bạn tìm kiếm không tồn tại. Quay về trang chủ SummerSips.",
};

export default function NotFound() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-6 text-center"
      style={{ background: "var(--bg-secondary)" }}
    >
      {/* Big number */}
      <div className="relative mb-6">
        <span
          className="text-[10rem] font-black leading-none select-none"
          style={{
            background: "linear-gradient(135deg, #f97316 0%, #ec4899 100%)",
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          404
        </span>
        <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-6xl select-none pointer-events-none">
          😵
        </span>
      </div>

      <h1
        className="text-3xl font-black mb-3"
        style={{ color: "var(--text-primary)" }}
      >
        Trang Không Tồn Tại
      </h1>

      <p
        className="mb-8 max-w-sm leading-relaxed"
        style={{ color: "var(--text-secondary)" }}
      >
        Trang bạn đang tìm không tồn tại hoặc đã bị di chuyển. Thử kiểm tra lại
        đường dẫn hoặc quay về trang chủ nhé!
      </p>

      <div className="flex flex-col sm:flex-row items-center gap-3">
        <Link
          href="/"
          className="px-8 py-3.5 rounded-2xl font-bold text-white hover:scale-105 active:scale-95 transition-all shadow-lg"
          style={{
            background: "linear-gradient(135deg, #f97316, #ec4899)",
            boxShadow: "0 8px 30px rgba(249,115,22,0.30)",
          }}
        >
          🏠 Về Trang Chủ
        </Link>
        <Link
          href="/thuc-don"
          className="px-8 py-3.5 rounded-2xl font-bold border hover:bg-orange-50 hover:border-orange-300 transition-all"
          style={{
            borderColor: "var(--border-color)",
            color: "var(--text-secondary)",
          }}
        >
          🍹 Xem Thực Đơn
        </Link>
      </div>
    </div>
  );
}

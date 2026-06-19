// src/app/error.tsx
"use client";

import { useEffect } from "react";
import Link from "next/link";
import { LazyGlitchScene } from "@/components/three";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-[#0f0f13] text-white overflow-hidden">
      {/* 3D Glitch Background */}
      <div className="absolute inset-0 z-0 opacity-50">
        <LazyGlitchScene text="500" />
      </div>

      <div className="relative z-10 max-w-md">
        <h1 className="text-4xl font-black mb-4">Ối! Đã có lỗi xảy ra 💥</h1>
        <p className="text-gray-400 mb-8 leading-relaxed">
          Đội ngũ kỹ thuật của chúng tôi đã được thông báo. Vui lòng thử tải lại trang hoặc quay về trang chủ.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => reset()}
            className="px-8 py-3.5 rounded-2xl font-black bg-white text-black hover:bg-gray-200 transition-all shadow-xl"
          >
            Thử lại ngay
          </button>
          <Link
            href="/"
            className="px-8 py-3.5 rounded-2xl font-black border border-gray-800 hover:bg-gray-800 transition-all"
          >
            Về trang chủ
          </Link>
        </div>
      </div>
    </div>
  );
}

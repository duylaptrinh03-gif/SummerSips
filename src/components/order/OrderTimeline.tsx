"use client";

import { TrangThaiDonHang, TRANG_THAI_LABEL } from "@/types/order";

const STEPS: TrangThaiDonHang[] = [
  "cho_xac_nhan",
  "dang_pha_che",
  "dang_giao",
  "hoan_thanh",
];

const STEP_ICONS: Record<TrangThaiDonHang, string> = {
  cho_xac_nhan: "📋",
  dang_pha_che: "☕",
  dang_giao: "🛵",
  hoan_thanh: "✅",
  da_huy: "❌",
};

interface OrderTimelineProps {
  currentStatus: TrangThaiDonHang;
}

export function OrderTimeline({ currentStatus }: OrderTimelineProps) {
  if (currentStatus === "da_huy") {
    return (
      <div className="flex items-center gap-3 p-4 rounded-2xl"
           style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)" }}>
        <span className="text-2xl">❌</span>
        <div>
          <p className="font-bold text-red-600">Đơn hàng đã bị huỷ</p>
          <p className="text-sm text-red-400">Vui lòng liên hệ hỗ trợ nếu cần thêm thông tin</p>
        </div>
      </div>
    );
  }

  const currentIdx = STEPS.indexOf(currentStatus);

  return (
    <div className="relative">
      {/* Connector line */}
      <div
        className="absolute top-5 left-5 right-5 h-0.5"
        style={{ background: "var(--border-color)" }}
      />
      {/* Progress line */}
      <div
        className="absolute top-5 left-5 h-0.5 bg-gradient-to-r from-orange-500 to-pink-500 transition-all duration-700"
        style={{
          width: currentIdx === 0 ? "0%" : `${(currentIdx / (STEPS.length - 1)) * 100}%`,
          right: "auto",
        }}
      />

      <div className="relative flex justify-between">
        {STEPS.map((step, idx) => {
          const isDone = idx <= currentIdx;
          const isCurrent = idx === currentIdx;
          return (
            <div key={step} className="flex flex-col items-center gap-2 flex-1">
              {/* Circle */}
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-lg z-10 transition-all duration-500 ${
                  isDone
                    ? "bg-gradient-to-br from-orange-500 to-pink-500 shadow-lg shadow-orange-300/40"
                    : "bg-white dark:bg-gray-800 border-2"
                }`}
                style={isDone ? {} : { background: "var(--bg-card)", borderColor: "var(--border-color)" }}
              >
                {STEP_ICONS[step]}
                {isCurrent && (
                  <span
                    className="absolute w-10 h-10 rounded-full border-2 border-orange-400 opacity-60"
                    style={{ animation: "pulse-ring 1.5s ease-in-out infinite" }}
                  />
                )}
              </div>
              {/* Label */}
              <p
                className={`text-xs font-semibold text-center leading-tight ${
                  isDone ? "text-orange-600" : ""
                }`}
                style={isDone ? {} : { color: "var(--text-muted)" }}
              >
                {TRANG_THAI_LABEL[step]}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

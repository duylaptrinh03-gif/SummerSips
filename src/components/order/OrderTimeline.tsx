"use client";

import { OrderStatus, ORDER_STATUS_LABEL } from "@/types/order";

// Steps shown in the progress timeline (excludes "da_huy" / cancelled)
const TIMELINE_STEPS: OrderStatus[] = [
  "pending",
  "preparing",
  "delivering",
  "completed",
];

const STEP_ICONS: Record<OrderStatus, string> = {
  pending:    "📋",
  preparing:  "☕",
  delivering: "🛵",
  completed:  "✅",
  cancelled:  "❌",
};

interface OrderTimelineProps {
  currentStatus: OrderStatus;
}

export function OrderTimeline({ currentStatus }: OrderTimelineProps) {
  if (currentStatus === "cancelled") {
    return (
      <div
        className="flex items-center gap-3 p-4 rounded-2xl"
        style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)" }}
      >
        <span className="text-2xl">❌</span>
        <div>
          <p className="font-bold text-red-600">Đơn hàng đã bị huỷ</p>
          <p className="text-sm text-red-400">Vui lòng liên hệ hỗ trợ nếu cần thêm thông tin</p>
        </div>
      </div>
    );
  }

  const currentIdx = TIMELINE_STEPS.indexOf(currentStatus);

  return (
    <div className="relative">
      {/* Background connector line */}
      <div
        className="absolute top-5 left-5 right-5 h-0.5"
        style={{ background: "var(--border-color)" }}
      />
      {/* Progress fill */}
      <div
        className="absolute top-5 left-5 h-0.5 bg-gradient-to-r from-orange-500 to-pink-500 transition-all duration-700"
        style={{
          width: currentIdx === 0 ? "0%" : `${(currentIdx / (TIMELINE_STEPS.length - 1)) * 100}%`,
          right: "auto",
        }}
      />

      <div className="relative flex justify-between">
        {TIMELINE_STEPS.map((step, idx) => {
          const isDone = idx <= currentIdx;
          const isCurrent = idx === currentIdx;
          return (
            <div key={step} className="flex flex-col items-center gap-2 flex-1">
              {/* Step circle */}
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-lg z-10 transition-all duration-500 ${
                  isDone
                    ? "bg-gradient-to-br from-orange-500 to-pink-500 shadow-lg shadow-orange-300/40"
                    : "border-2"
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
              {/* Step label */}
              <p
                className={`text-xs font-semibold text-center leading-tight ${isDone ? "text-orange-600" : ""}`}
                style={isDone ? {} : { color: "var(--text-muted)" }}
              >
                {ORDER_STATUS_LABEL[step]}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

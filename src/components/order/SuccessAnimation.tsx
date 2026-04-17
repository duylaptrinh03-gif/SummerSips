"use client";

import { useEffect, useState, useMemo } from "react";

interface ConfettiPiece {
  id: number;
  left: string;
  color: string;
  delay: string;
  duration: string;
  size: string;
}

const COLORS = [
  "#f97316", "#ec4899", "#8b5cf6", "#06b6d4", "#10b981", "#f59e0b",
];

function generateConfetti(count = 50): ConfettiPiece[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    delay: `${Math.random() * 1.5}s`,
    duration: `${1.5 + Math.random() * 1.5}s`,
    size: `${6 + Math.random() * 8}px`,
  }));
}

interface SuccessAnimationProps {
  show: boolean;
  orderId?: string;
}

export function SuccessAnimation({ show, orderId }: SuccessAnimationProps) {
  // ✅ useMemo thay vì useState + setConfetti — không cần effect
  const confetti = useMemo(() => generateConfetti(50), [show]);

  // ✅ Chỉ track trạng thái "đã tự động ẩn" — chỉ set ASYNC qua setTimeout
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (!show) return;

    // ✅ Chỉ gọi setState bên trong callback async — không vi phạm rule
    const timer = setTimeout(() => setDismissed(true), 4500);

    // ✅ Cleanup function được phép reset state
    return () => {
      clearTimeout(timer);
      setDismissed(false);
    };
  }, [show]);

  // Derive visibility từ props + state — không cần setState để "bật"
  const visible = show && !dismissed;

  if (!visible) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[600] overflow-hidden">
      {/* Confetti pieces */}
      {confetti.map((piece) => (
        <div
          key={piece.id}
          className="absolute top-0 rounded-sm"
          style={{
            left: piece.left,
            width: piece.size,
            height: piece.size,
            backgroundColor: piece.color,
            animationName: "confetti-drop",
            animationDuration: piece.duration,
            animationDelay: piece.delay,
            animationTimingFunction: "ease-in",
            animationFillMode: "forwards",
          }}
        />
      ))}

      {/* Checkmark overlay */}
      <div
        className="absolute inset-0 flex items-start justify-center pt-[20vh]"
        style={{ animation: "fadeInDown 0.6s ease-out both" }}
      >
        <div
          className="rounded-3xl shadow-2xl p-8 flex flex-col items-center gap-4 text-center max-w-sm mx-4"
          style={{
            background: "var(--bg-card)",
            boxShadow: "var(--shadow-lg)",
            animation: "bounce-in 0.5s ease-out both",
          }}
        >
          <div
            className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-400 to-green-500 flex items-center justify-center shadow-lg shadow-emerald-300/50"
            style={{ animation: "bounce-in 0.6s 0.2s ease-out both" }}
          >
            <svg
              className="w-10 h-10 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
                style={{
                  strokeDasharray: 100,
                  strokeDashoffset: 0,
                  animation: "checkmark 0.5s 0.5s ease-out both",
                }}
              />
            </svg>
          </div>

          <h3 className="text-2xl font-black" style={{ color: "var(--text-primary)" }}>
            Đặt Hàng Thành Công! 🎉
          </h3>

          {orderId && (
            <p
              className="text-sm font-mono px-3 py-1.5 rounded-lg"
              style={{ background: "var(--bg-secondary)", color: "var(--text-secondary)" }}
            >
              #{orderId}
            </p>
          )}

          <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
            Chúng tôi đang xác nhận đơn hàng của bạn. Mong bạn thưởng thức!
          </p>
        </div>
      </div>
    </div>
  );
}

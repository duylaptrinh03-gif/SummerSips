"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useToastStore } from "@/store/useToastStore";
import { Toast, ToastVariant } from "@/types/ui";

const ICONS: Record<ToastVariant, string> = {
  success: "✓",
  error: "✕",
  info: "ℹ",
  warning: "⚠",
};

const COLORS: Record<ToastVariant, string> = {
  success: "from-emerald-500 to-green-500",
  error: "from-red-500 to-rose-500",
  info: "from-blue-500 to-cyan-500",
  warning: "from-amber-500 to-orange-500",
};

function ToastItem({ toast }: { toast: Toast }) {
  const removeToast = useToastStore((s) => s.removeToast);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 120, scale: 0.85 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 120, scale: 0.85 }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
      className="flex items-center gap-3 pl-1 pr-4 py-3 rounded-2xl shadow-xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 min-w-[260px] max-w-[340px] overflow-hidden"
      style={{ boxShadow: "0 8px 30px rgba(0,0,0,0.12)" }}
    >
      {/* Color stripe + icon */}
      <div
        className={`w-10 h-10 rounded-xl bg-gradient-to-br ${COLORS[toast.variant]} flex items-center justify-center text-white font-black text-lg shrink-0 shadow-md`}
      >
        {ICONS[toast.variant]}
      </div>

      {/* Message */}
      <p className="flex-1 text-sm font-semibold text-gray-800 dark:text-gray-100 leading-snug">
        {toast.message}
      </p>

      {/* Dismiss */}
      <button
        onClick={() => removeToast(toast.id)}
        className="w-6 h-6 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors shrink-0 text-xs"
        aria-label="Đóng thông báo"
      >
        ✕
      </button>
    </motion.div>
  );
}

export function ToastContainer() {
  const toasts = useToastStore((s) => s.toasts);

  return (
    <div
      role="region"
      aria-label="Thông báo"
      className="fixed top-20 right-4 z-[500] flex flex-col gap-3 pointer-events-none"
    >
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <div key={toast.id} className="pointer-events-auto">
            <ToastItem toast={toast} />
          </div>
        ))}
      </AnimatePresence>
    </div>
  );
}

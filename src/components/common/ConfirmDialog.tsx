"use client";

import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "danger" | "warning" | "default";
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = "Xác nhận",
  cancelLabel = "Hủy",
  variant = "danger",
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const cancelRef = useRef<HTMLButtonElement>(null);

  // Focus nút hủy khi mở — an toàn hơn khi Enter không vô tình xác nhận
  useEffect(() => {
    if (open) cancelRef.current?.focus();
  }, [open]);

  // Đóng khi nhấn Escape
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancel();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onCancel]);

  const confirmBg =
    variant === "danger"
      ? "linear-gradient(135deg,#ef4444,#dc2626)"
      : variant === "warning"
      ? "linear-gradient(135deg,#f97316,#ea580c)"
      : "linear-gradient(135deg,#f97316,#ec4899)";

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-50"
            style={{ background: "rgba(0,0,0,0.55)", backdropFilter: "blur(4px)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onCancel}
          />

          {/* Dialog */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              role="alertdialog"
              aria-modal="true"
              aria-labelledby="confirm-title"
              aria-describedby="confirm-desc"
              className="w-full max-w-sm rounded-3xl border p-6 shadow-2xl"
              style={{ background: "var(--bg-modal)", borderColor: "var(--border-color)" }}
              initial={{ scale: 0.9, opacity: 0, y: 16 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 16 }}
              transition={{ type: "spring", stiffness: 400, damping: 28 }}
              onClick={(e) => e.stopPropagation()}
            >
              <p id="confirm-title" className="text-base font-black mb-2" style={{ color: "var(--text-primary)" }}>
                {title}
              </p>
              <p id="confirm-desc" className="text-sm mb-6" style={{ color: "var(--text-secondary)" }}>
                {message}
              </p>

              <div className="flex gap-3 justify-end">
                <button
                  ref={cancelRef}
                  type="button"
                  onClick={onCancel}
                  className="px-5 py-2.5 rounded-xl text-sm font-bold border transition-colors hover:opacity-80"
                  style={{ borderColor: "var(--border-color)", color: "var(--text-secondary)", background: "var(--bg-secondary)" }}
                >
                  {cancelLabel}
                </button>
                <button
                  type="button"
                  onClick={onConfirm}
                  className="px-5 py-2.5 rounded-xl text-sm font-black text-white transition-all hover:-translate-y-0.5 active:translate-y-0"
                  style={{ background: confirmBg }}
                >
                  {confirmLabel}
                </button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}

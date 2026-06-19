"use client";

import { useChatStore } from "@/store/useChatStore";
import { motion, AnimatePresence } from "framer-motion";

export function ChatButton() {
  const { isOpen, toggleChat, messages } = useChatStore();
  const hasMessages = messages.length > 0;

  // Ẩn nút khi chat đang mở — người dùng đóng bằng nút X trong header
  if (isOpen) return null;

  return (
    <motion.button
      onClick={toggleChat}
      className="fixed bottom-6 right-6 z-[400] w-14 h-14 rounded-full shadow-2xl flex items-center justify-center focus:outline-none"
      style={{
        background: "linear-gradient(135deg, #f97316, #ea580c)",
        boxShadow: "0 4px 24px rgba(249,115,22,0.5)",
      }}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.94 }}
      aria-label="Mở chat với AI"
    >
      <motion.span
        initial={{ opacity: 0, scale: 0.6 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-2xl leading-none"
      >
        🧋
      </motion.span>

      {/* Unread indicator */}
      {hasMessages && (
        <span className="absolute top-0.5 right-0.5 w-3 h-3 rounded-full bg-green-400 border-2 border-white" />
      )}
    </motion.button>
  );
}

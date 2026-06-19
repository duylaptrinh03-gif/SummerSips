"use client";

import { useChatStore } from "@/store/useChatStore";
import { motion, AnimatePresence } from "framer-motion";

export function ChatButton() {
  const { isOpen, toggleChat, messages } = useChatStore();
  const hasMessages = messages.length > 0;

  return (
    <motion.button
      onClick={toggleChat}
      className="fixed bottom-6 right-6 z-[400] w-14 h-14 rounded-full shadow-2xl flex items-center justify-center transition-all focus:outline-none"
      style={{
        background: isOpen
          ? "var(--text-muted)"
          : "linear-gradient(135deg, #f97316, #ea580c)",
        boxShadow: isOpen
          ? "0 4px 20px rgba(0,0,0,0.2)"
          : "0 4px 24px rgba(249,115,22,0.5)",
      }}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.94 }}
      aria-label={isOpen ? "Đóng chat" : "Mở chat với AI"}
    >
      <AnimatePresence mode="wait">
        {isOpen ? (
          <motion.span
            key="close"
            initial={{ opacity: 0, rotate: -90 }}
            animate={{ opacity: 1, rotate: 0 }}
            exit={{ opacity: 0, rotate: 90 }}
            transition={{ duration: 0.15 }}
            className="text-white text-xl font-bold leading-none"
          >
            ✕
          </motion.span>
        ) : (
          <motion.span
            key="open"
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.6 }}
            transition={{ duration: 0.15 }}
            className="text-2xl leading-none"
          >
            🧋
          </motion.span>
        )}
      </AnimatePresence>

      {/* Unread indicator — hiện khi có tin nhắn và đang đóng */}
      {!isOpen && hasMessages && (
        <span className="absolute top-0.5 right-0.5 w-3 h-3 rounded-full bg-green-400 border-2 border-white" />
      )}
    </motion.button>
  );
}

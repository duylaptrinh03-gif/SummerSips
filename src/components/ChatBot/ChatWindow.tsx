"use client";

import { useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useChatStore } from "@/store/useChatStore";
import { chatService } from "@/services/chatService";
import { ChatMessage } from "@/types/chat";
import { MessageList } from "./MessageList";
import { MessageInput } from "./MessageInput";

function generateId() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export function ChatWindow() {
  const {
    isOpen,
    messages,
    isLoading,
    conversationId,
    addMessage,
    setConversationId,
    setLoading,
    clearChat,
    toggleChat,
  } = useChatStore();

  const handleSend = useCallback(
    async (text: string) => {
      const userMsg: ChatMessage = {
        id: generateId(),
        role: "user",
        content: text,
        createdAt: new Date().toISOString(),
      };
      addMessage(userMsg);
      setLoading(true);

      try {
        const res = await chatService.sendMessage({
          message: text,
          conversationId: conversationId ?? undefined,
        });

        if (res.statusCode === 200 || res.data) {
          if (!conversationId) {
            setConversationId(res.data.conversationId);
          }

          const botMsg: ChatMessage = {
            id: generateId(),
            role: "assistant",
            content: res.data.answer,
            createdAt: new Date().toISOString(),
          };
          addMessage(botMsg);
        }
      } catch {
        addMessage({
          id: generateId(),
          role: "assistant",
          content: "Xin lỗi, tôi đang gặp sự cố. Vui lòng thử lại sau.",
          createdAt: new Date().toISOString(),
        });
      } finally {
        setLoading(false);
      }
    },
    [addMessage, conversationId, setConversationId, setLoading]
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="chat-window"
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ type: "spring", stiffness: 380, damping: 30 }}
          className="fixed bottom-24 right-6 z-[399] w-[360px] max-w-[calc(100vw-48px)] rounded-2xl shadow-2xl flex flex-col overflow-hidden"
          style={{
            background: "var(--bg-card)",
            border: "1px solid var(--border-color)",
            height: "520px",
            maxHeight: "calc(100vh - 120px)",
          }}
        >
          {/* Header */}
          <div
            className="flex items-center gap-3 px-4 py-3 shrink-0"
            style={{
              background: "linear-gradient(135deg, #f97316, #ea580c)",
            }}
          >
            <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center text-xl shrink-0">
              🧋
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-black text-sm text-white leading-tight">
                SummerSips AI
              </p>
              <p className="text-[11px] text-white/80">Trả lời trong vài giây</p>
            </div>
            <div className="flex items-center gap-1.5">
              {/* Online dot */}
              <span className="w-2 h-2 rounded-full bg-green-300 animate-pulse" />

              {/* Clear chat */}
              {messages.length > 0 && (
                <button
                  onClick={clearChat}
                  className="w-7 h-7 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white text-xs transition-colors"
                  title="Xóa lịch sử chat"
                  aria-label="Xóa lịch sử chat"
                >
                  🗑
                </button>
              )}

              {/* Close button */}
              <button
                onClick={toggleChat}
                className="w-7 h-7 rounded-full bg-white/20 hover:bg-white/35 flex items-center justify-center text-white font-bold text-base transition-colors"
                title="Đóng chat"
                aria-label="Đóng chat"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Messages */}
          <MessageList messages={messages} isLoading={isLoading} onHintClick={handleSend} />

          {/* Input */}
          <MessageInput onSend={handleSend} disabled={isLoading} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

"use client";

import { useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { chatService } from "@/services/chatService";
import { useChatStore } from "@/store/useChatStore";

/**
 * Đồng bộ lịch sử chat từ server khi user login/logout.
 * - Login → fetch conversation mới nhất từ DB → load vào store
 * - Logout → clear store (xóa chat của account cũ)
 */
export function ChatHistorySync() {
  const { data: session, status } = useSession();
  const { setMessages, setConversationId, clearChat } = useChatStore();
  const prevUserIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (status === "loading") return;

    const currentUserId = (session?.user as { id?: string } | undefined)?.id ?? null;

    // Logout: user vừa đăng xuất → clear chat
    if (!currentUserId && prevUserIdRef.current) {
      clearChat();
      prevUserIdRef.current = null;
      return;
    }

    // Login: user vừa đăng nhập hoặc là user khác → sync từ server
    if (currentUserId && currentUserId !== prevUserIdRef.current) {
      prevUserIdRef.current = currentUserId;

      chatService
        .getMyHistory()
        .then((res) => {
          if (res.statusCode === 200 && res.data) {
            const { conversationId, messages } = res.data;

            if (conversationId) {
              setConversationId(conversationId);
            }

            if (messages.length > 0) {
              // Map sang ChatMessage shape (đảm bảo có id field)
              setMessages(
                messages.map((m) => ({
                  id: (m as { _id?: string } & typeof m)._id ?? m.id,
                  role: m.role,
                  content: m.content,
                  createdAt: m.createdAt,
                }))
              );
            }
          }
        })
        .catch(() => {
          // Không fail silently — giữ nguyên localStorage nếu server lỗi
        });
    }
  }, [session, status, setMessages, setConversationId, clearChat]);

  return null;
}

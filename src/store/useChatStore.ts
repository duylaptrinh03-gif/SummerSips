"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { ChatMessage } from "@/types/chat";

interface ChatState {
  isOpen: boolean;
  conversationId: string | null;
  messages: ChatMessage[];
  isLoading: boolean;

  // Actions
  openChat: () => void;
  closeChat: () => void;
  toggleChat: () => void;
  addMessage: (message: ChatMessage) => void;
  setMessages: (messages: ChatMessage[]) => void;
  setConversationId: (id: string) => void;
  setLoading: (loading: boolean) => void;
  clearChat: () => void;
}

export const useChatStore = create<ChatState>()(
  persist(
    (set) => ({
      isOpen: false,
      conversationId: null,
      messages: [],
      isLoading: false,

      openChat: () => set({ isOpen: true }),
      closeChat: () => set({ isOpen: false }),
      toggleChat: () => set((s) => ({ isOpen: !s.isOpen })),

      addMessage: (message) =>
        set((s) => ({ messages: [...s.messages, message] })),

      setMessages: (messages) => set({ messages }),

      setConversationId: (id) => set({ conversationId: id }),

      setLoading: (loading) => set({ isLoading: loading }),

      clearChat: () =>
        set({ messages: [], conversationId: null, isLoading: false }),
    }),
    {
      name: "summersips-chat-storage",
      storage: createJSONStorage(() => localStorage),
      // Chỉ persist messages và conversationId, không persist isLoading/isOpen
      partialize: (state) => ({
        conversationId: state.conversationId,
        messages: state.messages,
      }),
    }
  )
);

import axiosInstance from "@/lib/axiosInstance";
import {
  SendMessagePayload,
  SendMessageResponse,
  ChatMessage,
  ConversationSummary,
  ConversationDetail,
  Faq,
  CreateFaqPayload,
} from "@/types/chat";
import { ApiResponse } from "@/types/api";

export const chatService = {
  /**
   * POST /chat/message
   * Gửi tin nhắn và nhận phản hồi từ AI.
   */
  async sendMessage(
    payload: SendMessagePayload
  ): Promise<ApiResponse<SendMessageResponse>> {
    return axiosInstance.post<unknown, ApiResponse<SendMessageResponse>>(
      "/chat/message",
      payload
    );
  },

  /**
   * GET /chat/history/:conversationId
   * Tải lịch sử hội thoại.
   */
  async getMyHistory(): Promise<ApiResponse<{ conversationId: string | null; messages: ChatMessage[] }>> {
    return axiosInstance.get<unknown, ApiResponse<{ conversationId: string | null; messages: ChatMessage[] }>>(
      "/chat/my-history"
    );
  },

  async getHistory(conversationId: string): Promise<ApiResponse<ChatMessage[]>> {
    return axiosInstance.get<unknown, ApiResponse<ChatMessage[]>>(
      `/chat/history/${conversationId}`
    );
  },

  // ── Admin endpoints ─────────────────────────────────────────────────────────

  async getAllConversations(): Promise<ApiResponse<ConversationSummary[]>> {
    return axiosInstance.get<unknown, ApiResponse<ConversationSummary[]>>(
      "/chat/conversations"
    );
  },

  async getConversationDetail(
    id: string
  ): Promise<ApiResponse<ConversationDetail>> {
    return axiosInstance.get<unknown, ApiResponse<ConversationDetail>>(
      `/chat/conversations/${id}`
    );
  },

  // ── FAQ endpoints ───────────────────────────────────────────────────────────

  async getAllFaqs(): Promise<ApiResponse<Faq[]>> {
    return axiosInstance.get<unknown, ApiResponse<Faq[]>>("/chat/faq");
  },

  async createFaq(payload: CreateFaqPayload): Promise<ApiResponse<Faq>> {
    return axiosInstance.post<unknown, ApiResponse<Faq>>("/chat/faq", payload);
  },

  async updateFaq(
    id: string,
    payload: Partial<CreateFaqPayload>
  ): Promise<ApiResponse<Faq>> {
    return axiosInstance.patch<unknown, ApiResponse<Faq>>(
      `/chat/faq/${id}`,
      payload
    );
  },

  async deleteFaq(id: string): Promise<ApiResponse<{ message: string }>> {
    return axiosInstance.delete<unknown, ApiResponse<{ message: string }>>(
      `/chat/faq/${id}`
    );
  },
};

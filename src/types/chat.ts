// ── Chat message ──────────────────────────────────────────────────────────────

export type MessageRole = 'user' | 'assistant';

export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  createdAt: string;
}

// ── API shapes ────────────────────────────────────────────────────────────────

export interface SendMessagePayload {
  message: string;
  conversationId?: string;
}

export interface SendMessageResponse {
  answer: string;
  conversationId: string;
}

// ── Admin shapes ──────────────────────────────────────────────────────────────

export interface ConversationSummary {
  _id: string;
  userId: string | null;
  messageCount: number;
  lastMessage: string;
  createdAt: string;
  updatedAt: string;
}

export interface ConversationDetail {
  conversation: {
    _id: string;
    userId: string | null;
    createdAt: string;
  };
  messages: {
    _id: string;
    conversationId: string;
    role: MessageRole;
    content: string;
    createdAt: string;
  }[];
}

export interface Faq {
  _id: string;
  question: string;
  answer: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateFaqPayload {
  question: string;
  answer: string;
  isActive?: boolean;
}

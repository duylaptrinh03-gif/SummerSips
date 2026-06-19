"use client";

import { useEffect, useRef } from "react";
import { ChatMessage } from "@/types/chat";

interface Props {
  messages: ChatMessage[];
  isLoading: boolean;
  onHintClick?: (hint: string) => void;
}

function TypingIndicator() {
  return (
    <div className="flex items-end gap-2 mb-3">
      <div
        className="w-8 h-8 rounded-full flex items-center justify-center text-sm shrink-0"
        style={{ background: "linear-gradient(135deg, #f97316, #ea580c)" }}
      >
        🧋
      </div>
      <div
        className="px-4 py-3 rounded-2xl rounded-bl-sm max-w-[75%]"
        style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-light)" }}
      >
        <span className="flex gap-1 items-center h-4">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-bounce"
              style={{ animationDelay: `${i * 0.15}s` }}
            />
          ))}
        </span>
      </div>
    </div>
  );
}

function MessageBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === "user";

  return (
    <div
      className={`flex items-end gap-2 mb-3 ${isUser ? "flex-row-reverse" : "flex-row"}`}
    >
      {/* Avatar */}
      {!isUser && (
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center text-sm shrink-0"
          style={{ background: "linear-gradient(135deg, #f97316, #ea580c)" }}
        >
          🧋
        </div>
      )}

      {/* Bubble */}
      <div
        className={`px-4 py-2.5 rounded-2xl max-w-[75%] text-sm leading-relaxed whitespace-pre-wrap break-words ${
          isUser
            ? "rounded-br-sm text-white"
            : "rounded-bl-sm"
        }`}
        style={
          isUser
            ? { background: "linear-gradient(135deg, #f97316, #ea580c)" }
            : {
                background: "var(--bg-secondary)",
                color: "var(--text-primary)",
                border: "1px solid var(--border-light)",
              }
        }
      >
        {message.content}
      </div>
    </div>
  );
}

export function MessageList({ messages, isLoading, onHintClick }: Props) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  return (
    <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col">
      {messages.length === 0 && !isLoading && (
        <div className="flex flex-col items-center justify-center flex-1 gap-3 text-center">
          <div className="text-4xl">🧋</div>
          <p className="font-bold text-sm" style={{ color: "var(--text-primary)" }}>
            Xin chào! Tôi là trợ lý AI của SummerSips
          </p>
          <p className="text-xs max-w-[220px]" style={{ color: "var(--text-muted)" }}>
            Tôi có thể tư vấn đồ uống, tra cứu đơn hàng và giải đáp mọi thắc mắc.
          </p>
          <div className="flex flex-col gap-1.5 w-full mt-2">
            {[
              "Menu trà sữa có gì ngon?",
              "Phí giao hàng bao nhiêu?",
              "Đơn hàng của tôi đang ở đâu?",
            ].map((hint) => (
              <button
                key={hint}
                className="text-xs px-3 py-2 rounded-xl border text-left transition-colors hover:bg-orange-50"
                style={{
                  borderColor: "var(--border-color)",
                  color: "var(--text-secondary)",
                }}
                onClick={() => onHintClick?.(hint)}
              >
                {hint}
              </button>
            ))}
          </div>
        </div>
      )}

      {messages.map((msg) => (
        <MessageBubble key={msg.id} message={msg} />
      ))}

      {isLoading && <TypingIndicator />}

      <div ref={bottomRef} />
    </div>
  );
}

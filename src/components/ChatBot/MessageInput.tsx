"use client";

import { useState, useRef, KeyboardEvent } from "react";

interface Props {
  onSend: (message: string) => void;
  disabled?: boolean;
}

export function MessageInput({ onSend, disabled }: Props) {
  const [value, setValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSend = () => {
    const trimmed = value.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setValue("");
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div
      className="px-3 py-3 border-t flex items-center gap-2"
      style={{ borderColor: "var(--border-color)", background: "var(--bg-card)" }}
    >
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        placeholder="Nhập tin nhắn... (Enter để gửi)"
        className="flex-1 rounded-xl px-3 py-2.5 text-sm outline-none transition-colors"
        style={{
          background: "var(--bg-secondary)",
          border: "1px solid var(--border-color)",
          color: "var(--text-primary)",
          height: "40px",
        }}
        onFocus={(e) => (e.currentTarget.style.borderColor = "rgb(249,115,22)")}
        onBlur={(e) => (e.currentTarget.style.borderColor = "var(--border-color)")}
      />
      <button
        onClick={handleSend}
        disabled={!value.trim() || disabled}
        className="w-10 h-10 rounded-xl flex items-center justify-center text-white transition-all shrink-0 disabled:opacity-40 disabled:cursor-not-allowed"
        style={{
          background:
            !value.trim() || disabled
              ? "var(--text-muted)"
              : "linear-gradient(135deg, #f97316, #ea580c)",
        }}
        aria-label="Gửi tin nhắn"
      >
        {disabled ? (
          <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
        ) : (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="22" y1="2" x2="11" y2="13" />
            <polygon points="22 2 15 22 11 13 2 9 22 2" />
          </svg>
        )}
      </button>
    </div>
  );
}

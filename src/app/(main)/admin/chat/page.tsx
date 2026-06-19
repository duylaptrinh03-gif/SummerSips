"use client";

import { useState, useEffect, useCallback, Fragment } from "react";
import { chatService } from "@/services/chatService";
import {
  ConversationSummary,
  ConversationDetail,
  Faq,
  CreateFaqPayload,
} from "@/types/chat";
import { useToastStore } from "@/store/useToastStore";

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatDate(iso: string) {
  if (!iso) return "—";
  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso));
}

// ── Sub-components ────────────────────────────────────────────────────────────

function ConversationModal({
  id,
  onClose,
}: {
  id: string;
  onClose: () => void;
}) {
  const [detail, setDetail] = useState<ConversationDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    chatService
      .getConversationDetail(id)
      .then((res) => {
        if (res.statusCode === 200) setDetail(res.data);
      })
      .finally(() => setLoading(false));
  }, [id]);

  return (
    <div
      className="fixed inset-0 z-[600] flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.5)" }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg rounded-2xl shadow-2xl flex flex-col max-h-[80vh]"
        style={{ background: "var(--bg-card)", border: "1px solid var(--border-color)" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-5 py-4 border-b shrink-0"
          style={{ borderColor: "var(--border-color)" }}
        >
          <h3 className="font-black text-base" style={{ color: "var(--text-primary)" }}>
            Chi tiết hội thoại
          </h3>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-gray-100 text-sm transition-colors"
            style={{ color: "var(--text-muted)" }}
          >
            ✕
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
          {loading ? (
            <div className="flex justify-center py-10">
              <span className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : detail?.messages.length === 0 ? (
            <p className="text-center text-sm py-6" style={{ color: "var(--text-muted)" }}>
              Chưa có tin nhắn
            </p>
          ) : (
            detail?.messages.map((msg) => (
              <div
                key={msg._id}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className="max-w-[80%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap break-words"
                  style={
                    msg.role === "user"
                      ? { background: "linear-gradient(135deg,#f97316,#ea580c)", color: "#fff" }
                      : {
                          background: "var(--bg-secondary)",
                          color: "var(--text-primary)",
                          border: "1px solid var(--border-light)",
                        }
                  }
                >
                  {msg.content}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer info */}
        {detail && (
          <div
            className="px-5 py-3 border-t text-xs shrink-0"
            style={{ borderColor: "var(--border-color)", color: "var(--text-muted)" }}
          >
            {detail.conversation.userId
              ? `User ID: ${detail.conversation.userId}`
              : "Khách vãng lai"}{" "}
            · {detail.messages.length} tin nhắn
          </div>
        )}
      </div>
    </div>
  );
}

function FaqSection() {
  const addToast = useToastStore((s) => s.addToast);
  const [faqs, setFaqs] = useState<Faq[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editTarget, setEditTarget] = useState<Faq | null>(null);
  const [form, setForm] = useState<CreateFaqPayload>({
    question: "",
    answer: "",
    isActive: true,
  });
  const [saving, setSaving] = useState(false);

  const fetchFaqs = useCallback(async () => {
    setLoading(true);
    try {
      const res = await chatService.getAllFaqs();
      if (res.statusCode === 200) setFaqs(res.data);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFaqs();
  }, [fetchFaqs]);

  const openCreate = () => {
    setEditTarget(null);
    setForm({ question: "", answer: "", isActive: true });
    setShowForm(true);
  };

  const openEdit = (faq: Faq) => {
    setEditTarget(faq);
    setForm({ question: faq.question, answer: faq.answer, isActive: faq.isActive });
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!form.question.trim() || !form.answer.trim()) return;
    setSaving(true);
    try {
      if (editTarget) {
        await chatService.updateFaq(editTarget._id, form);
        addToast("Đã cập nhật FAQ", "success");
      } else {
        await chatService.createFaq(form);
        addToast("Đã tạo FAQ mới", "success");
      }
      setShowForm(false);
      fetchFaqs();
    } catch {
      addToast("Lưu FAQ thất bại", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await chatService.deleteFaq(id);
      setFaqs((prev) => prev.filter((f) => f._id !== id));
      addToast("Đã xóa FAQ", "success");
    } catch {
      addToast("Xóa FAQ thất bại", "error");
    }
  };

  const handleToggle = async (faq: Faq) => {
    try {
      await chatService.updateFaq(faq._id, { isActive: !faq.isActive });
      setFaqs((prev) =>
        prev.map((f) =>
          f._id === faq._id ? { ...f, isActive: !f.isActive } : f
        )
      );
    } catch {
      addToast("Cập nhật thất bại", "error");
    }
  };

  return (
    <div
      className="rounded-2xl border p-5"
      style={{ background: "var(--bg-card)", borderColor: "var(--border-color)" }}
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="font-black text-base" style={{ color: "var(--text-primary)" }}>
            Knowledge Base — FAQ
          </h2>
          <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
            AI chatbot sẽ sử dụng các FAQ này để trả lời khách hàng
          </p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-bold text-white transition-colors"
          style={{ background: "linear-gradient(135deg,#f97316,#ea580c)" }}
        >
          + Thêm FAQ
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div
          className="mb-4 p-4 rounded-xl border space-y-3"
          style={{ background: "var(--bg-secondary)", borderColor: "var(--border-light)" }}
        >
          <input
            className="w-full px-3 py-2 rounded-lg border text-sm outline-none focus:border-orange-400 transition-colors"
            style={{
              background: "var(--bg-card)",
              borderColor: "var(--border-color)",
              color: "var(--text-primary)",
            }}
            placeholder="Câu hỏi..."
            value={form.question}
            onChange={(e) => setForm((f) => ({ ...f, question: e.target.value }))}
          />
          <textarea
            rows={3}
            className="w-full px-3 py-2 rounded-lg border text-sm outline-none focus:border-orange-400 transition-colors resize-none"
            style={{
              background: "var(--bg-card)",
              borderColor: "var(--border-color)",
              color: "var(--text-primary)",
            }}
            placeholder="Câu trả lời..."
            value={form.answer}
            onChange={(e) => setForm((f) => ({ ...f, answer: e.target.value }))}
          />
          <div className="flex items-center gap-2">
            <label className="flex items-center gap-2 text-sm cursor-pointer" style={{ color: "var(--text-secondary)" }}>
              <input
                type="checkbox"
                checked={form.isActive}
                onChange={(e) => setForm((f) => ({ ...f, isActive: e.target.checked }))}
                className="accent-orange-500"
              />
              Kích hoạt
            </label>
            <div className="ml-auto flex gap-2">
              <button
                onClick={() => setShowForm(false)}
                className="px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors hover:bg-gray-100"
                style={{ borderColor: "var(--border-color)", color: "var(--text-secondary)" }}
              >
                Hủy
              </button>
              <button
                onClick={handleSave}
                disabled={saving || !form.question.trim() || !form.answer.trim()}
                className="px-3 py-1.5 rounded-lg text-xs font-bold text-white transition-colors disabled:opacity-50"
                style={{ background: "linear-gradient(135deg,#f97316,#ea580c)" }}
              >
                {saving ? "Đang lưu..." : editTarget ? "Cập nhật" : "Tạo mới"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* List */}
      {loading ? (
        <div className="text-center py-6">
          <span className="w-6 h-6 border-4 border-orange-500 border-t-transparent rounded-full animate-spin inline-block" />
        </div>
      ) : faqs.length === 0 ? (
        <p className="text-sm text-center py-6" style={{ color: "var(--text-muted)" }}>
          Chưa có FAQ nào. Thêm FAQ để chatbot trả lời chính xác hơn.
        </p>
      ) : (
        <div className="space-y-2">
          {faqs.map((faq) => (
            <div
              key={faq._id}
              className="p-3 rounded-xl border"
              style={{
                background: "var(--bg-secondary)",
                borderColor: "var(--border-light)",
                opacity: faq.isActive ? 1 : 0.55,
              }}
            >
              <div className="flex items-start gap-2">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>
                    Q: {faq.question}
                  </p>
                  <p className="text-xs mt-1 leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                    A: {faq.answer}
                  </p>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={() => handleToggle(faq)}
                    className={`px-2 py-1 rounded-lg text-[10px] font-bold transition-colors ${
                      faq.isActive
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {faq.isActive ? "Bật" : "Tắt"}
                  </button>
                  <button
                    onClick={() => openEdit(faq)}
                    className="px-2 py-1 rounded-lg text-[10px] font-bold bg-blue-50 text-blue-600 transition-colors hover:bg-blue-100"
                  >
                    Sửa
                  </button>
                  <button
                    onClick={() => handleDelete(faq._id)}
                    className="px-2 py-1 rounded-lg text-[10px] font-bold bg-red-50 text-red-600 transition-colors hover:bg-red-100"
                  >
                    Xóa
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function AdminChatPage() {
  const addToast = useToastStore((s) => s.addToast);
  const [conversations, setConversations] = useState<ConversationSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const fetchConversations = useCallback(async () => {
    setLoading(true);
    try {
      const res = await chatService.getAllConversations();
      if (res.statusCode === 200) setConversations(res.data);
    } catch {
      addToast("Không thể tải danh sách hội thoại", "error");
    } finally {
      setLoading(false);
    }
  }, [addToast]);

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  const filtered = conversations.filter((c) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      c._id.toLowerCase().includes(q) ||
      (c.userId ?? "").toLowerCase().includes(q) ||
      (c.lastMessage ?? "").toLowerCase().includes(q)
    );
  });

  return (
    <div className="min-h-screen py-8" style={{ background: "var(--bg-secondary)" }}>
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 space-y-6">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black" style={{ color: "var(--text-primary)" }}>
              Quản Lý Chat AI
            </h1>
            <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>
              {conversations.length} cuộc hội thoại · AI chatbot SummerSips
            </p>
          </div>
          <button
            onClick={fetchConversations}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold border transition-colors hover:bg-orange-50 disabled:opacity-50"
            style={{ borderColor: "var(--border-color)", color: "var(--text-secondary)" }}
          >
            <span className={loading ? "animate-spin" : ""}>🔄</span>
            Làm mới
          </button>
        </div>

        {/* Conversations */}
        <div
          className="rounded-2xl border overflow-hidden"
          style={{ background: "var(--bg-card)", borderColor: "var(--border-color)" }}
        >
          {/* Search */}
          <div
            className="px-5 py-4 border-b"
            style={{ borderColor: "var(--border-color)" }}
          >
            <input
              className="w-full sm:w-80 px-4 py-2.5 rounded-xl border text-sm outline-none focus:border-orange-400 transition-colors"
              style={{
                background: "var(--bg-secondary)",
                borderColor: "var(--border-color)",
                color: "var(--text-primary)",
              }}
              placeholder="Tìm theo ID, User ID, nội dung..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3">
              <span className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
              <p className="text-sm font-medium" style={{ color: "var(--text-muted)" }}>
                Đang tải...
              </p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-4xl mb-3">💬</p>
              <p className="font-bold" style={{ color: "var(--text-primary)" }}>
                {search ? "Không tìm thấy kết quả" : "Chưa có cuộc hội thoại nào"}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm min-w-[640px]">
                <thead>
                  <tr
                    className="text-[11px] font-bold uppercase tracking-wide"
                    style={{
                      color: "var(--text-muted)",
                      background: "var(--bg-secondary)",
                    }}
                  >
                    <th className="px-4 py-3 text-left">ID</th>
                    <th className="px-4 py-3 text-left">User</th>
                    <th className="px-4 py-3 text-center">Tin nhắn</th>
                    <th className="px-4 py-3 text-left">Tin nhắn gần nhất</th>
                    <th className="px-4 py-3 text-left">Thời gian</th>
                    <th className="px-4 py-3 text-center">Xem</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((c) => (
                    <Fragment key={c._id}>
                      <tr
                        className="border-t hover:bg-orange-50/30 dark:hover:bg-white/[0.03] transition-colors"
                        style={{ borderColor: "var(--border-light)" }}
                      >
                        <td className="px-4 py-3">
                          <span
                            className="font-mono text-[11px] font-bold"
                            style={{ color: "var(--text-muted)" }}
                          >
                            {c._id.slice(-8)}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          {c.userId ? (
                            <span
                              className="text-xs px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 font-semibold"
                            >
                              Đã đăng nhập
                            </span>
                          ) : (
                            <span
                              className="text-xs px-2 py-0.5 rounded-full bg-gray-100 font-semibold"
                              style={{ color: "var(--text-muted)" }}
                            >
                              Khách
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className="inline-block px-2 py-0.5 rounded-full text-xs font-bold bg-orange-50 text-orange-600">
                            {c.messageCount}
                          </span>
                        </td>
                        <td
                          className="px-4 py-3 text-xs max-w-[220px] truncate"
                          style={{ color: "var(--text-secondary)" }}
                          title={c.lastMessage}
                        >
                          {c.lastMessage || "—"}
                        </td>
                        <td
                          className="px-4 py-3 text-xs whitespace-nowrap"
                          style={{ color: "var(--text-muted)" }}
                        >
                          {formatDate(c.createdAt)}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <button
                            onClick={() => setSelectedId(c._id)}
                            className="px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors hover:bg-blue-50 hover:border-blue-200 hover:text-blue-600"
                            style={{
                              borderColor: "var(--border-color)",
                              color: "var(--text-secondary)",
                            }}
                          >
                            Xem
                          </button>
                        </td>
                      </tr>
                    </Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* FAQ Section */}
        <FaqSection />
      </div>

      {/* Modal */}
      {selectedId && (
        <ConversationModal
          id={selectedId}
          onClose={() => setSelectedId(null)}
        />
      )}
    </div>
  );
}

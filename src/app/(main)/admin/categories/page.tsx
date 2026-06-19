"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { categoryService, Category } from "@/services/categoryService";
import { useToastStore } from "@/store/useToastStore";

export default function AdminCategoriesPage() {
  const addToast = useToastStore((s) => s.addToast);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [newName, setNewName] = useState("");
  const [editId, setEditId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    try {
      const res = await categoryService.getAll();
      if (res.statusCode === 200) setCategories(res.data);
    } catch {
      addToast("Không thể tải danh mục", "error");
    } finally {
      setLoading(false);
    }
  }, [addToast]);

  useEffect(() => { fetch(); }, [fetch]);

  const handleCreate = async () => {
    if (!newName.trim()) return;
    setSaving(true);
    try {
      await categoryService.create(newName.trim());
      addToast("Đã thêm danh mục", "success");
      setNewName("");
      await fetch();
    } catch {
      addToast("Thêm thất bại", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleUpdate = async (id: string) => {
    if (!editName.trim()) return;
    setSaving(true);
    try {
      await categoryService.update(id, editName.trim());
      addToast("Đã cập nhật", "success");
      setEditId(null);
      await fetch();
    } catch {
      addToast("Cập nhật thất bại", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (cat: Category) => {
    if (!confirm(`Xóa danh mục "${cat.name}"?`)) return;
    setDeletingId(cat._id);
    try {
      await categoryService.remove(cat._id);
      addToast("Đã xóa danh mục", "success");
      await fetch();
    } catch {
      addToast("Xóa thất bại", "error");
    } finally {
      setDeletingId(null);
    }
  };

  const inputCls = "px-3 py-2 rounded-xl border text-sm outline-none focus:border-orange-400 transition-colors";
  const inputStyle = { background: "var(--bg-secondary)", borderColor: "var(--border-color)", color: "var(--text-primary)" };

  return (
    <div className="min-h-screen py-10" style={{ background: "var(--bg-secondary)" }}>
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="mb-6">
          <Link href="/admin" className="text-sm font-semibold text-orange-500 hover:text-orange-600">
            ← Dashboard
          </Link>
          <h1 className="text-3xl font-black mt-2" style={{ color: "var(--text-primary)" }}>
            Quản Lý Danh Mục
          </h1>
          <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>
            {categories.length} danh mục
          </p>
        </div>

        {/* Add new */}
        <div className="rounded-2xl border p-5 mb-6" style={{ background: "var(--bg-card)", borderColor: "var(--border-color)" }}>
          <h2 className="text-sm font-bold mb-3" style={{ color: "var(--text-secondary)" }}>Thêm danh mục mới</h2>
          <div className="flex gap-3">
            <input
              className={`${inputCls} flex-1`}
              style={inputStyle}
              placeholder="VD: Trà Hoa, Đá Xay..."
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleCreate()}
            />
            <button
              onClick={handleCreate}
              disabled={saving || !newName.trim()}
              className="px-5 py-2 rounded-xl text-sm font-bold text-white bg-orange-500 hover:bg-orange-600 disabled:opacity-50 transition-colors flex items-center gap-2"
            >
              {saving && <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
              Thêm
            </button>
          </div>
        </div>

        {/* List */}
        <div className="rounded-2xl border overflow-hidden" style={{ background: "var(--bg-card)", borderColor: "var(--border-color)" }}>
          {loading ? (
            <div className="flex justify-center py-16">
              <span className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : categories.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-4xl mb-3">📂</p>
              <p className="text-sm" style={{ color: "var(--text-muted)" }}>Chưa có danh mục nào</p>
            </div>
          ) : (
            <ul>
              {categories.map((cat, i) => (
                <li
                  key={cat._id}
                  className={`flex items-center gap-3 px-5 py-4 ${i > 0 ? "border-t" : ""}`}
                  style={{ borderColor: "var(--border-light)" }}
                >
                  <span className="w-8 h-8 rounded-lg bg-orange-100 text-orange-600 text-xs font-black flex items-center justify-center shrink-0">
                    {i + 1}
                  </span>

                  {editId === cat._id ? (
                    <input
                      autoFocus
                      className={`${inputCls} flex-1`}
                      style={inputStyle}
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleUpdate(cat._id);
                        if (e.key === "Escape") setEditId(null);
                      }}
                    />
                  ) : (
                    <span className="flex-1 text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                      {cat.name}
                    </span>
                  )}

                  <div className="flex items-center gap-2 shrink-0">
                    {editId === cat._id ? (
                      <>
                        <button
                          onClick={() => handleUpdate(cat._id)}
                          disabled={saving}
                          className="px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-green-500 hover:bg-green-600 disabled:opacity-50 transition-colors"
                        >
                          Lưu
                        </button>
                        <button
                          onClick={() => setEditId(null)}
                          className="px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors hover:bg-gray-50"
                          style={{ borderColor: "var(--border-color)", color: "var(--text-secondary)" }}
                        >
                          Hủy
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => { setEditId(cat._id); setEditName(cat.name); }}
                          className="px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors hover:bg-blue-50 hover:border-blue-200"
                          style={{ borderColor: "var(--border-color)", color: "var(--text-secondary)" }}
                        >
                          Sửa
                        </button>
                        <button
                          onClick={() => handleDelete(cat)}
                          disabled={deletingId === cat._id}
                          className="px-3 py-1.5 rounded-lg text-xs font-bold bg-red-50 text-red-600 hover:bg-red-100 transition-colors disabled:opacity-50"
                        >
                          {deletingId === cat._id ? "..." : "Xóa"}
                        </button>
                      </>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

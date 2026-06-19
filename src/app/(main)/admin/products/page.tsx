"use client";

import { useState, useEffect, useCallback } from "react";
import { drinkService } from "@/services/drinkService";
import { Drink, CreateDrinkPayload, SizeOption, ToppingOption } from "@/types/drink";
import { useToastStore } from "@/store/useToastStore";
import { formatGia } from "@/utils/formatter";
import Link from "next/link";

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

const CATEGORIES = ["Cà Phê", "Trà Sữa", "Trà Trái Cây", "Sinh Tố", "Nước Ép"] as const;
const TAGS = ["", "Bán Chạy", "Mới", "Yêu Thích"] as const;

const DEFAULT_SIZES: SizeOption[] = [
  { name: "S", label: "Nhỏ",  extraPrice: 0     },
  { name: "M", label: "Vừa",  extraPrice: 5000  },
  { name: "L", label: "Lớn",  extraPrice: 10000 },
];

type FormData = {
  name: string;
  basePrice: string;
  image: string;
  description: string;
  category: string;
  tag: string;
  isAvailable: boolean;
  sizeOptions: SizeOption[];
  toppingOptions: ToppingOption[];
};

const EMPTY_FORM: FormData = {
  name: "",
  basePrice: "",
  image: "",
  description: "",
  category: "Trà Sữa",
  tag: "",
  isAvailable: true,
  sizeOptions: DEFAULT_SIZES,
  toppingOptions: [],
};

// ─────────────────────────────────────────────────────────────────────────────
// ProductModal
// ─────────────────────────────────────────────────────────────────────────────

function ProductModal({
  drink,
  onClose,
  onSaved,
}: {
  drink: Drink | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const addToast = useToastStore((s) => s.addToast);
  const [form, setForm] = useState<FormData>(
    drink
      ? {
          name: drink.name,
          basePrice: String(drink.basePrice),
          image: drink.image ?? "",
          description: drink.description ?? "",
          category: drink.category,
          tag: drink.tag ?? "",
          isAvailable: drink.isAvailable,
          sizeOptions: drink.sizeOptions ?? DEFAULT_SIZES,
          toppingOptions: drink.toppingOptions ?? [],
        }
      : EMPTY_FORM
  );
  const [saving, setSaving] = useState(false);
  const [newTopping, setNewTopping] = useState({ name: "", price: "" });

  const set = (key: keyof FormData, value: unknown) =>
    setForm((f) => ({ ...f, [key]: value }));

  const handleSave = async () => {
    if (!form.name.trim() || !form.basePrice) {
      addToast("Vui lòng nhập tên và giá sản phẩm", "error");
      return;
    }
    setSaving(true);
    const payload: CreateDrinkPayload = {
      name: form.name.trim(),
      basePrice: Number(form.basePrice),
      image: form.image.trim() || undefined,
      description: form.description.trim() || undefined,
      category: form.category,
      tag: form.tag || undefined,
      isAvailable: form.isAvailable,
      sizeOptions: form.sizeOptions,
      toppingOptions: form.toppingOptions,
    };
    try {
      if (drink) {
        await drinkService.updateDrink(drink._id, payload);
        addToast("Đã cập nhật sản phẩm", "success");
      } else {
        await drinkService.createDrink(payload);
        addToast("Đã thêm sản phẩm mới", "success");
      }
      onSaved();
      onClose();
    } catch {
      addToast("Lưu thất bại, vui lòng thử lại", "error");
    } finally {
      setSaving(false);
    }
  };

  const addTopping = () => {
    if (!newTopping.name.trim() || !newTopping.price) return;
    set("toppingOptions", [
      ...form.toppingOptions,
      { id: Date.now().toString(), name: newTopping.name.trim(), price: Number(newTopping.price) },
    ]);
    setNewTopping({ name: "", price: "" });
  };

  const removeTopping = (id: string) =>
    set("toppingOptions", form.toppingOptions.filter((t) => t.id !== id));

  const updateSizePrice = (idx: number, price: number) =>
    set("sizeOptions", form.sizeOptions.map((s, i) => i === idx ? { ...s, extraPrice: price } : s));

  const inputCls = "w-full px-3 py-2 rounded-xl border text-sm outline-none focus:border-orange-400 transition-colors";
  const inputStyle = { background: "var(--bg-secondary)", borderColor: "var(--border-color)", color: "var(--text-primary)" };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.5)" }}>
      <div
        className="w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden flex flex-col"
        style={{ background: "var(--bg-card)", maxHeight: "90vh" }}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b flex items-center justify-between" style={{ borderColor: "var(--border-color)" }}>
          <h2 className="text-xl font-black" style={{ color: "var(--text-primary)" }}>
            {drink ? "Chỉnh sửa sản phẩm" : "Thêm sản phẩm mới"}
          </h2>
          <button onClick={onClose} className="text-2xl leading-none hover:opacity-60 transition-opacity" style={{ color: "var(--text-muted)" }}>
            ×
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto flex-1 p-6 space-y-5">
          {/* Name */}
          <div>
            <label className="block text-xs font-bold mb-1.5" style={{ color: "var(--text-secondary)" }}>Tên sản phẩm *</label>
            <input
              className={inputCls}
              style={inputStyle}
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
              placeholder="VD: Trà Sữa Trân Châu Hoàng Kim"
            />
          </div>

          {/* Price + Category */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold mb-1.5" style={{ color: "var(--text-secondary)" }}>Giá gốc (VNĐ) *</label>
              <input
                type="number"
                className={inputCls}
                style={inputStyle}
                value={form.basePrice}
                onChange={(e) => set("basePrice", e.target.value)}
                placeholder="45000"
                min={0}
              />
            </div>
            <div>
              <label className="block text-xs font-bold mb-1.5" style={{ color: "var(--text-secondary)" }}>Danh mục</label>
              <select className={inputCls} style={inputStyle} value={form.category} onChange={(e) => set("category", e.target.value)}>
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>

          {/* Tag + isAvailable */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold mb-1.5" style={{ color: "var(--text-secondary)" }}>Nhãn</label>
              <select className={inputCls} style={inputStyle} value={form.tag} onChange={(e) => set("tag", e.target.value)}>
                {TAGS.map((t) => <option key={t} value={t}>{t || "— Không có —"}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold mb-1.5" style={{ color: "var(--text-secondary)" }}>Trạng thái</label>
              <div className="flex items-center gap-3 h-[38px]">
                <button
                  type="button"
                  onClick={() => set("isAvailable", !form.isAvailable)}
                  className={`relative w-12 h-6 rounded-full transition-colors ${form.isAvailable ? "bg-green-500" : "bg-gray-300"}`}
                >
                  <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${form.isAvailable ? "translate-x-6" : ""}`} />
                </button>
                <span className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
                  {form.isAvailable ? "Đang bán" : "Tạm ngưng"}
                </span>
              </div>
            </div>
          </div>

          {/* Image */}
          <div>
            <label className="block text-xs font-bold mb-1.5" style={{ color: "var(--text-secondary)" }}>Hình ảnh (URL)</label>
            <input
              className={inputCls}
              style={inputStyle}
              value={form.image}
              onChange={(e) => set("image", e.target.value)}
              placeholder="https://..."
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold mb-1.5" style={{ color: "var(--text-secondary)" }}>Mô tả</label>
            <textarea
              className={`${inputCls} resize-none`}
              style={inputStyle}
              rows={3}
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              placeholder="Mô tả ngắn về sản phẩm..."
            />
          </div>

          {/* Size options */}
          <div>
            <label className="block text-xs font-bold mb-2" style={{ color: "var(--text-secondary)" }}>Phụ phí theo size (VNĐ)</label>
            <div className="grid grid-cols-3 gap-3">
              {form.sizeOptions.map((s, i) => (
                <div key={s.name} className="rounded-xl border p-3" style={{ borderColor: "var(--border-color)", background: "var(--bg-secondary)" }}>
                  <p className="text-xs font-bold mb-1" style={{ color: "var(--text-primary)" }}>
                    {s.name} — {s.label}
                  </p>
                  <input
                    type="number"
                    className="w-full text-sm px-2 py-1 rounded-lg border outline-none"
                    style={{ background: "var(--bg-card)", borderColor: "var(--border-color)", color: "var(--text-primary)" }}
                    value={s.extraPrice}
                    min={0}
                    onChange={(e) => updateSizePrice(i, Number(e.target.value))}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Toppings */}
          <div>
            <label className="block text-xs font-bold mb-2" style={{ color: "var(--text-secondary)" }}>Toppings</label>
            <div className="flex gap-2 mb-3">
              <input
                className={`${inputCls} flex-1`}
                style={inputStyle}
                value={newTopping.name}
                onChange={(e) => setNewTopping((t) => ({ ...t, name: e.target.value }))}
                placeholder="Tên topping"
                onKeyDown={(e) => e.key === "Enter" && addTopping()}
              />
              <input
                type="number"
                className={`${inputCls} w-28`}
                style={inputStyle}
                value={newTopping.price}
                onChange={(e) => setNewTopping((t) => ({ ...t, price: e.target.value }))}
                placeholder="Giá"
                min={0}
              />
              <button
                type="button"
                onClick={addTopping}
                className="px-4 py-2 rounded-xl bg-orange-500 text-white text-sm font-bold hover:bg-orange-600 transition-colors shrink-0"
              >
                +
              </button>
            </div>
            {form.toppingOptions.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {form.toppingOptions.map((t) => (
                  <span key={t.id} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold" style={{ background: "var(--bg-secondary)", color: "var(--text-primary)" }}>
                    {t.name} · {formatGia(t.price)}
                    <button onClick={() => removeTopping(t.id)} className="text-red-400 hover:text-red-600 font-black leading-none">×</button>
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-xs" style={{ color: "var(--text-muted)" }}>Chưa có topping nào</p>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t flex justify-end gap-3" style={{ borderColor: "var(--border-color)" }}>
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl text-sm font-bold border transition-colors hover:bg-gray-50"
            style={{ borderColor: "var(--border-color)", color: "var(--text-secondary)" }}
          >
            Hủy
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-2.5 rounded-xl text-sm font-bold text-white bg-orange-500 hover:bg-orange-600 disabled:opacity-60 transition-colors flex items-center gap-2"
          >
            {saving && <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
            {drink ? "Lưu thay đổi" : "Thêm sản phẩm"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Page
// ─────────────────────────────────────────────────────────────────────────────

export default function AdminProductsPage() {
  const addToast = useToastStore((s) => s.addToast);
  const [drinks, setDrinks] = useState<Drink[]>([]);
  const [filtered, setFiltered] = useState<Drink[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("Tất cả");
  const [modalDrink, setModalDrink] = useState<Drink | null | "new">(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchDrinks = useCallback(async () => {
    setLoading(true);
    try {
      const res = await drinkService.getDrinks();
      if (res.statusCode === 200) setDrinks(res.data);
    } catch {
      addToast("Không thể tải danh sách sản phẩm", "error");
    } finally {
      setLoading(false);
    }
  }, [addToast]);

  useEffect(() => { fetchDrinks(); }, [fetchDrinks]);

  useEffect(() => {
    let list = drinks;
    if (categoryFilter !== "Tất cả") list = list.filter((d) => d.category === categoryFilter);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((d) => d.name.toLowerCase().includes(q));
    }
    setFiltered(list);
  }, [drinks, search, categoryFilter]);

  const handleDelete = async (drink: Drink) => {
    if (!confirm(`Xóa sản phẩm "${drink.name}"? Thao tác không thể hoàn tác.`)) return;
    setDeletingId(drink._id);
    try {
      await drinkService.deleteDrink(drink._id);
      addToast("Đã xóa sản phẩm", "success");
      await fetchDrinks();
    } catch {
      addToast("Xóa thất bại", "error");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="min-h-screen py-10" style={{ background: "var(--bg-secondary)" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        {/* Header */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <Link href="/admin" className="text-sm font-semibold text-orange-500 hover:text-orange-600">
                ← Dashboard
              </Link>
            </div>
            <h1 className="text-3xl font-black" style={{ color: "var(--text-primary)" }}>
              Quản Lý Sản Phẩm
            </h1>
            <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>
              {drinks.length} sản phẩm · {drinks.filter(d => d.isAvailable).length} đang bán
            </p>
          </div>
          <button
            onClick={() => setModalDrink("new")}
            className="px-5 py-2.5 rounded-xl font-bold text-white bg-orange-500 hover:bg-orange-600 transition-colors shadow-lg shadow-orange-100 flex items-center gap-2 w-fit"
          >
            + Thêm sản phẩm
          </button>
        </div>

        {/* Filters */}
        <div className="mb-6 flex flex-col sm:flex-row gap-3">
          <input
            className="flex-1 px-4 py-2.5 rounded-xl border text-sm outline-none focus:border-orange-400 transition-colors"
            style={{ background: "var(--bg-card)", borderColor: "var(--border-color)", color: "var(--text-primary)" }}
            placeholder="Tìm kiếm theo tên..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <div className="flex gap-2 flex-wrap">
            {["Tất cả", ...CATEGORIES].map((c) => (
              <button
                key={c}
                onClick={() => setCategoryFilter(c)}
                className={`px-3 py-2 rounded-xl text-xs font-bold border transition-colors ${
                  categoryFilter === c
                    ? "bg-orange-500 border-orange-500 text-white"
                    : "border-transparent hover:border-orange-200 hover:bg-orange-50"
                }`}
                style={categoryFilter === c ? {} : { color: "var(--text-secondary)" }}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="rounded-2xl border overflow-hidden" style={{ background: "var(--bg-card)", borderColor: "var(--border-color)" }}>
          {loading ? (
            <div className="flex justify-center py-20">
              <span className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-4xl mb-3">🔍</p>
              <p className="font-bold" style={{ color: "var(--text-primary)" }}>
                {search || categoryFilter !== "Tất cả" ? "Không tìm thấy kết quả" : "Chưa có sản phẩm nào"}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-xs font-semibold" style={{ color: "var(--text-muted)", background: "var(--bg-secondary)" }}>
                    <th className="px-4 py-3 text-left">Sản phẩm</th>
                    <th className="px-4 py-3 text-left">Danh mục</th>
                    <th className="px-4 py-3 text-left">Giá</th>
                    <th className="px-4 py-3 text-left">Nhãn</th>
                    <th className="px-4 py-3 text-left">Đã bán</th>
                    <th className="px-4 py-3 text-left">Trạng thái</th>
                    <th className="px-4 py-3 text-right">Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((drink) => (
                    <tr
                      key={drink._id}
                      className="border-t hover:bg-gray-50/50 dark:hover:bg-white/5 transition-colors"
                      style={{ borderColor: "var(--border-light)" }}
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          {drink.image ? (
                            <img src={drink.image} alt={drink.name} className="w-10 h-10 rounded-xl object-cover shrink-0" />
                          ) : (
                            <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-lg shrink-0">🧋</div>
                          )}
                          <span className="font-semibold" style={{ color: "var(--text-primary)" }}>{drink.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3" style={{ color: "var(--text-secondary)" }}>{drink.category}</td>
                      <td className="px-4 py-3 font-bold" style={{ color: "var(--text-primary)" }}>
                        {formatGia(drink.basePrice)}
                      </td>
                      <td className="px-4 py-3">
                        {drink.tag ? (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-orange-100 text-orange-700">
                            {drink.tag}
                          </span>
                        ) : (
                          <span style={{ color: "var(--text-muted)" }}>—</span>
                        )}
                      </td>
                      <td className="px-4 py-3" style={{ color: "var(--text-secondary)" }}>
                        {drink.soldCount ?? 0}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${drink.isAvailable ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                          {drink.isAvailable ? "Đang bán" : "Tạm ngưng"}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setModalDrink(drink)}
                            className="px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors hover:bg-blue-50 hover:border-blue-200"
                            style={{ borderColor: "var(--border-color)", color: "var(--text-secondary)" }}
                          >
                            Sửa
                          </button>
                          <button
                            onClick={() => handleDelete(drink)}
                            disabled={deletingId === drink._id}
                            className="px-3 py-1.5 rounded-lg text-xs font-bold border border-transparent bg-red-50 text-red-600 hover:bg-red-100 transition-colors disabled:opacity-50"
                          >
                            {deletingId === drink._id ? "..." : "Xóa"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {modalDrink !== null && (
        <ProductModal
          drink={modalDrink === "new" ? null : modalDrink}
          onClose={() => setModalDrink(null)}
          onSaved={fetchDrinks}
        />
      )}
    </div>
  );
}

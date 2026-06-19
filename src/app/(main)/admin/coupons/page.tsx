"use client";

import { useState, useEffect, useCallback } from "react";
import { couponService, Coupon, CouponType } from "@/services/couponService";
import { useToastStore } from "@/store/useToastStore";
import { formatGia } from "@/utils/formatter";

const TYPE_LABEL: Record<CouponType, string> = {
  percent:  "Giảm %",
  freeship: "Freeship",
};

const TYPE_COLOR: Record<CouponType, string> = {
  percent:  "bg-blue-100 text-blue-700",
  freeship: "bg-purple-100 text-purple-700",
};

// ── Modal ─────────────────────────────────────────────────────────────────────
function CouponModal({
  coupon,
  onClose,
  onSaved,
}: {
  coupon: Coupon | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const addToast = useToastStore((s) => s.addToast);
  const [form, setForm] = useState({
    code: coupon?.code ?? "",
    discount_value: coupon?.discount_value?.toString() ?? "",
    type: (coupon?.type ?? "percent") as CouponType,
    is_active: coupon?.is_active ?? true,
  });
  const [saving, setSaving] = useState(false);

  const set = (k: keyof typeof form, v: unknown) => setForm((f) => ({ ...f, [k]: v }));

  const handleSave = async () => {
    if (!form.code.trim() || !form.discount_value) {
      addToast("Vui lòng nhập mã và giá trị giảm", "error");
      return;
    }
    setSaving(true);
    const payload = {
      code: form.code.trim().toUpperCase(),
      discount_value: Number(form.discount_value),
      type: form.type,
      is_active: form.is_active,
    };
    try {
      if (coupon) {
        await couponService.update(coupon._id, payload);
        addToast("Đã cập nhật coupon", "success");
      } else {
        await couponService.create(payload);
        addToast("Đã tạo coupon mới", "success");
      }
      onSaved();
      onClose();
    } catch {
      addToast("Lưu thất bại", "error");
    } finally {
      setSaving(false);
    }
  };

  const inputCls = "w-full px-3 py-2 rounded-xl border text-sm outline-none focus:border-orange-400 transition-colors";
  const inputStyle = { background: "var(--bg-secondary)", borderColor: "var(--border-color)", color: "var(--text-primary)" };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.5)" }}
    >
      <div className="w-full max-w-md rounded-3xl shadow-2xl overflow-hidden" style={{ background: "var(--bg-card)" }}>
        <div className="h-1 bg-gradient-to-r from-orange-500 to-pink-500" />
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-black" style={{ color: "var(--text-primary)" }}>
              {coupon ? "Chỉnh sửa Coupon" : "Tạo Coupon mới"}
            </h2>
            <button onClick={onClose} className="text-2xl leading-none opacity-40 hover:opacity-70">×</button>
          </div>

          <div>
            <label className="block text-xs font-bold mb-1.5" style={{ color: "var(--text-secondary)" }}>Mã coupon *</label>
            <input className={inputCls} style={inputStyle} value={form.code} onChange={(e) => set("code", e.target.value.toUpperCase())} placeholder="VD: SUMMER20" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold mb-1.5" style={{ color: "var(--text-secondary)" }}>Loại giảm giá</label>
              <select className={inputCls} style={inputStyle} value={form.type} onChange={(e) => set("type", e.target.value as CouponType)}>
                <option value="percent">Giảm % (0–100)</option>
                <option value="freeship">Freeship (VNĐ)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold mb-1.5" style={{ color: "var(--text-secondary)" }}>
                Giá trị {form.type === "percent" ? "(%)" : "(VNĐ)"} *
              </label>
              <input
                type="number"
                className={inputCls}
                style={inputStyle}
                value={form.discount_value}
                onChange={(e) => set("discount_value", e.target.value)}
                min={0}
                max={form.type === "percent" ? 100 : undefined}
                placeholder={form.type === "percent" ? "20" : "30000"}
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => set("is_active", !form.is_active)}
              className={`relative w-11 h-6 rounded-full transition-colors ${form.is_active ? "bg-green-500" : "bg-gray-300"}`}
            >
              <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${form.is_active ? "translate-x-5" : ""}`} />
            </button>
            <span className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
              {form.is_active ? "Đang hoạt động" : "Tạm ngưng"}
            </span>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl text-sm font-bold border transition-colors hover:bg-gray-50"
              style={{ borderColor: "var(--border-color)", color: "var(--text-secondary)" }}
            >
              Hủy
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white bg-orange-500 hover:bg-orange-600 disabled:opacity-60 transition-colors flex items-center justify-center gap-2"
            >
              {saving && <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
              {coupon ? "Lưu" : "Tạo mới"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function AdminCouponsPage() {
  const addToast = useToastStore((s) => s.addToast);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<Coupon | null | "new">(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchCoupons = useCallback(async () => {
    setLoading(true);
    try {
      const res = await couponService.getAll();
      if (res.statusCode === 200) setCoupons(res.data);
    } catch {
      addToast("Không thể tải danh sách coupon", "error");
    } finally {
      setLoading(false);
    }
  }, [addToast]);

  useEffect(() => { fetchCoupons(); }, [fetchCoupons]);

  const handleToggleActive = async (c: Coupon) => {
    try {
      await couponService.update(c._id, { is_active: !c.is_active });
      addToast(`Coupon ${c.code} đã ${!c.is_active ? "bật" : "tắt"}`, "success");
      await fetchCoupons();
    } catch {
      addToast("Cập nhật thất bại", "error");
    }
  };

  const handleDelete = async (c: Coupon) => {
    if (!confirm(`Xóa coupon "${c.code}"?`)) return;
    setDeletingId(c._id);
    try {
      await couponService.remove(c._id);
      addToast("Đã xóa coupon", "success");
      await fetchCoupons();
    } catch {
      addToast("Xóa thất bại", "error");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="min-h-screen py-10" style={{ background: "var(--bg-secondary)" }}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black" style={{ color: "var(--text-primary)" }}>
              Quản Lý Coupon
            </h1>
            <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>
              {coupons.length} coupon · {coupons.filter(c => c.is_active).length} đang hoạt động
            </p>
          </div>
          <button
            onClick={() => setModal("new")}
            className="px-5 py-2.5 rounded-xl font-bold text-white bg-orange-500 hover:bg-orange-600 transition-colors shadow-lg shadow-orange-100 flex items-center gap-2 shrink-0"
          >
            + Tạo coupon
          </button>
        </div>

        {/* Table */}
        <div className="rounded-2xl border overflow-hidden" style={{ background: "var(--bg-card)", borderColor: "var(--border-color)" }}>
          {loading ? (
            <div className="flex justify-center py-16">
              <span className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : coupons.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-4xl mb-3">🎟️</p>
              <p className="font-bold mb-1" style={{ color: "var(--text-primary)" }}>Chưa có coupon nào</p>
              <button onClick={() => setModal("new")} className="mt-4 text-sm font-bold text-orange-500 hover:text-orange-600">
                Tạo coupon đầu tiên →
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-xs font-semibold" style={{ color: "var(--text-muted)", background: "var(--bg-secondary)" }}>
                    <th className="px-4 py-3 text-left">Mã</th>
                    <th className="px-4 py-3 text-left">Loại</th>
                    <th className="px-4 py-3 text-left">Giá trị</th>
                    <th className="px-4 py-3 text-left">Trạng thái</th>
                    <th className="px-4 py-3 text-right">Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {coupons.map((c) => (
                    <tr key={c._id} className="border-t hover:bg-gray-50/50 transition-colors" style={{ borderColor: "var(--border-light)" }}>
                      <td className="px-4 py-3">
                        <span className="font-mono font-black text-sm" style={{ color: "var(--text-primary)" }}>{c.code}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${TYPE_COLOR[c.type]}`}>
                          {TYPE_LABEL[c.type]}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-bold" style={{ color: "var(--text-primary)" }}>
                        {c.type === "percent" ? `${c.discount_value}%` : formatGia(c.discount_value)}
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => handleToggleActive(c)}
                          className={`relative w-10 h-5 rounded-full transition-colors ${c.is_active ? "bg-green-500" : "bg-gray-300"}`}
                        >
                          <span className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${c.is_active ? "translate-x-5" : ""}`} />
                        </button>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setModal(c)}
                            className="px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors hover:bg-blue-50 hover:border-blue-200"
                            style={{ borderColor: "var(--border-color)", color: "var(--text-secondary)" }}
                          >
                            Sửa
                          </button>
                          <button
                            onClick={() => handleDelete(c)}
                            disabled={deletingId === c._id}
                            className="px-3 py-1.5 rounded-lg text-xs font-bold bg-red-50 text-red-600 hover:bg-red-100 transition-colors disabled:opacity-50"
                          >
                            {deletingId === c._id ? "..." : "Xóa"}
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

      {modal !== null && (
        <CouponModal
          coupon={modal === "new" ? null : modal}
          onClose={() => setModal(null)}
          onSaved={fetchCoupons}
        />
      )}
    </div>
  );
}

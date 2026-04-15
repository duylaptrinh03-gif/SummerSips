"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { saveOrder } from "@/utils/localStorage";
import { Order } from "@/types/order";

export default function CheckoutForm() {
  const { items, totalPrice, clearCart } = useCart();
  const router = useRouter();

  const [form, setForm] = useState({ customerName: "", phone: "" });
  const [errors, setErrors] = useState<{ customerName?: string; phone?: string }>({});
  const [submitting, setSubmitting] = useState(false);

  const validate = () => {
    const newErrors: typeof errors = {};
    if (!form.customerName.trim()) newErrors.customerName = "Vui lòng nhập họ tên.";
    if (!form.phone.trim()) {
      newErrors.phone = "Vui lòng nhập số điện thoại.";
    } else if (!/^(0|\+84)[0-9]{8,10}$/.test(form.phone.trim())) {
      newErrors.phone = "Số điện thoại không hợp lệ.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 800)); // simulate processing

    const order: Order = {
      id: `ORD-${Date.now()}`,
      customerName: form.customerName.trim(),
      phone: form.phone.trim(),
      items,
      total: totalPrice,
      createdAt: new Date().toISOString(),
    };

    saveOrder(order);
    clearCart();
    router.push(`/orders?new=${order.id}`);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      {/* Name */}
      <div>
        <label htmlFor="checkout-name" className="block text-sm font-semibold text-gray-700 mb-1.5">
          Họ và tên <span className="text-red-400">*</span>
        </label>
        <input
          id="checkout-name"
          type="text"
          value={form.customerName}
          onChange={(e) => setForm((f) => ({ ...f, customerName: e.target.value }))}
          placeholder="Nguyễn Văn A"
          className={`w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 transition-all ${errors.customerName
              ? "border-red-300 focus:ring-red-200 bg-red-50"
              : "border-gray-200 focus:ring-orange-200 focus:border-orange-400 bg-white"
            }`}
        />
        {errors.customerName && (
          <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
            <span>⚠️</span> {errors.customerName}
          </p>
        )}
      </div>

      {/* Phone */}
      <div>
        <label htmlFor="checkout-phone" className="block text-sm font-semibold text-gray-700 mb-1.5">
          Số điện thoại <span className="text-red-400">*</span>
        </label>
        <input
          id="checkout-phone"
          type="tel"
          value={form.phone}
          onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
          placeholder="0367647419"
          className={`w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 transition-all ${errors.phone
              ? "border-red-300 focus:ring-red-200 bg-red-50"
              : "border-gray-200 focus:ring-orange-200 focus:border-orange-400 bg-white"
            }`}
        />
        {errors.phone && (
          <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
            <span>⚠️</span> {errors.phone}
          </p>
        )}
      </div>

      {/* Order summary */}
      <div className="p-4 rounded-xl bg-orange-50 border border-orange-100">
        <p className="text-sm font-semibold text-gray-700 mb-2">Tóm tắt đơn hàng</p>
        <div className="space-y-1">
          {items.map((item) => (
            <div key={item.id} className="flex justify-between text-sm text-gray-600">
              <span>{item.name} × {item.quantity}</span>
              <span className="font-medium">{(item.price * item.quantity).toLocaleString("vi-VN")}đ</span>
            </div>
          ))}
        </div>
        <div className="mt-3 pt-3 border-t border-orange-200 flex justify-between">
          <span className="font-bold text-gray-800">Tổng cộng</span>
          <span className="font-black text-lg bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">
            {totalPrice.toLocaleString("vi-VN")}đ
          </span>
        </div>
      </div>

      {/* Submit */}
      <button
        id="checkout-submit"
        type="submit"
        disabled={submitting || items.length === 0}
        className="w-full py-4 rounded-2xl bg-gradient-to-r from-orange-500 to-pink-500 text-white font-black text-base hover:shadow-xl hover:shadow-orange-300/50 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none flex items-center justify-center gap-2"
      >
        {submitting ? (
          <>
            <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
            </svg>
            Đang xử lý...
          </>
        ) : (
          <>
            🎉 Đặt Hàng Ngay
          </>
        )}
      </button>
    </form>
  );
}

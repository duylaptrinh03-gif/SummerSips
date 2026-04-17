"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCartStore, DELIVERY_FEE, FREE_SHIP_THRESHOLD } from "@/store/useCartStore";
import { CartItemCard } from "@/components/cart/CartItemCard";
import { formatGia } from "@/utils/formatter";
import { orderService } from "@/services/orderService";
import { taoMaDonHang } from "@/utils/formatter";
import { useToastStore } from "@/store/useToastStore";

export default function PageCart() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const items = useCartStore((state) => state.items);
  const clearCart = useCartStore((state) => state.clearCart);
  const couponCode = useCartStore((state) => state.couponCode);
  const discountPercent = useCartStore((state) => state.discountPercent);
  const isFreeShip = useCartStore((state) => state.isFreeShip);
  const applyCoupon = useCartStore((state) => state.applyCoupon);
  const removeCoupon = useCartStore((state) => state.removeCoupon);

  const getCount = useCartStore((state) => state.getTotalCount);
  const getTotalPrice = useCartStore((state) => state.getTotalPrice);
  const getSubtotal = useCartStore((state) => state.getSubtotal);
  const getDeliveryFee = useCartStore((state) => state.getDeliveryFee);
  const getFinalTotal = useCartStore((state) => state.getFinalTotal);

  const addToast = useToastStore((s) => s.addToast);

  const totalCount = mounted ? getCount() : 0;
  const rawTotal = mounted ? getTotalPrice() : 0;
  const subtotal = mounted ? getSubtotal() : 0;
  const deliveryFee = mounted ? getDeliveryFee() : 0;
  const finalTotal = mounted ? getFinalTotal() : 0;

  // Form state
  const [hoTen, setHoTen] = useState("");
  const [soDienThoai, setSoDienThoai] = useState("");
  const [diaChi, setDiaChi] = useState("");
  const [couponInput, setCouponInput] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  const handleApplyCoupon = () => {
    if (!couponInput.trim()) return;
    const result = applyCoupon(couponInput);
    if (result.success) {
      addToast(result.message, "success");
      setCouponInput("");
    } else {
      addToast(result.message, "error");
    }
  };

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!hoTen.trim() || !soDienThoai.trim() || !diaChi.trim()) {
      setError("Vui lòng điền đầy đủ thông tin giao hàng!");
      return;
    }

    const phoneRegex = /^(0|\+84)[0-9]{8,10}$/;
    if (!phoneRegex.test(soDienThoai.replace(/\s+/g, ""))) {
      setError("Số điện thoại không hợp lệ!");
      return;
    }

    setError("");
    setIsSubmitting(true);

    try {
      const newOrder = {
        id: taoMaDonHang(),
        items: items,
        thongTinNhan: {
          hoTen: hoTen.trim(),
          soDienThoai: soDienThoai.trim(),
          diaChi: diaChi.trim(),
        },
        tongTien: finalTotal,
        trangThai: "cho_xac_nhan" as const,
        taoLuc: new Date().toISOString(),
      };

      await orderService.createOrder(newOrder);
      clearCart();
      router.push(`/don-hang?new=${newOrder.id}`);
    } catch {
      setError("Có lỗi xảy ra khi đặt hàng. Vui lòng thử lại!");
      setIsSubmitting(false);
    }
  };

  if (!mounted) return null;

  if (items.length === 0) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center p-6"
        style={{ background: "var(--bg-secondary)" }}>
        <span className="text-8xl mb-6 opacity-80" style={{ animation: "blob 4s infinite alternate" }}>🛒</span>
        <h1 className="text-3xl font-black mb-2" style={{ color: "var(--text-primary)" }}>Giỏ hàng trống</h1>
        <p className="mb-8 max-w-sm text-center" style={{ color: "var(--text-secondary)" }}>
          Một ly trà sữa không thể thay đổi thế giới, nhưng nó làm ngày của bạn vui hơn. Đặt ngay nhé!
        </p>
        <Link
          href="/thuc-don"
          className="px-8 py-4 font-bold rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-xl"
          style={{
            background: "linear-gradient(135deg, #f97316, #ec4899)",
            color: "white",
            boxShadow: "0 8px 24px rgba(249,115,22,0.35)",
          }}
        >
          Tiếp tục chọn món
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: "var(--bg-secondary)" }}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-black" style={{ color: "var(--text-primary)" }}>Giỏ Hàng</h1>
            <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>{totalCount} sản phẩm</p>
          </div>
          <button
            onClick={clearCart}
            className="text-sm font-bold text-gray-400 hover:text-red-500 transition-colors"
          >
            Xóa tất cả
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* List Items */}
          <div className="flex-1 space-y-4">
            {items.map((item) => (
              <CartItemCard key={item.cartId} item={item} />
            ))}

            <Link
              href="/thuc-don"
              className="inline-flex items-center gap-2 text-sm font-bold text-orange-500 hover:text-orange-600 transition-colors mt-4 p-2 rounded-lg hover:bg-orange-50"
            >
              ← Trở về Menu thêm món mới
            </Link>
          </div>

          {/* Checkout Block */}
          <div className="w-full lg:w-[420px] shrink-0">
            <div
              className="rounded-3xl p-6 sm:p-8 sticky top-24 border"
              style={{ background: "var(--bg-card)", borderColor: "var(--border-color)", boxShadow: "var(--shadow-md)" }}
            >
              <h2 className="text-xl font-black mb-6" style={{ color: "var(--text-primary)" }}>Thanh Toán</h2>

              {/* Order summary */}
              <div className="space-y-3 mb-5">
                <div className="flex justify-between text-sm">
                  <span style={{ color: "var(--text-secondary)" }}>Tạm tính</span>
                  <span className="font-semibold" style={{ color: "var(--text-primary)" }}>{formatGia(rawTotal)}</span>
                </div>

                {discountPercent > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-emerald-600">Giảm giá ({discountPercent}%)</span>
                    <span className="font-semibold text-emerald-600">-{formatGia(rawTotal - subtotal)}</span>
                  </div>
                )}

                <div className="flex justify-between text-sm">
                  <span style={{ color: "var(--text-secondary)" }}>
                    Phí giao hàng
                    {rawTotal >= FREE_SHIP_THRESHOLD && !isFreeShip && (
                      <span className="ml-1 text-emerald-500 font-semibold">(Miễn phí)</span>
                    )}
                    {isFreeShip && (
                      <span className="ml-1 text-emerald-500 font-semibold">(Miễn phí)</span>
                    )}
                  </span>
                  {deliveryFee === 0 ? (
                    <span className="font-semibold text-emerald-600">Miễn phí</span>
                  ) : (
                    <span className="font-semibold" style={{ color: "var(--text-primary)" }}>
                      {formatGia(DELIVERY_FEE)}
                    </span>
                  )}
                </div>

                {rawTotal < FREE_SHIP_THRESHOLD && !isFreeShip && (
                  <div className="text-xs px-3 py-2 rounded-xl"
                    style={{ background: "rgba(249,115,22,0.08)", color: "var(--brand-orange)" }}>
                    🚚 Thêm {formatGia(FREE_SHIP_THRESHOLD - rawTotal)} để được miễn phí giao hàng!
                  </div>
                )}

                <div className="h-px my-2" style={{ background: "var(--border-color)" }} />

                <div className="flex justify-between items-center">
                  <span className="font-bold" style={{ color: "var(--text-primary)" }}>Tổng cộng</span>
                  <span className="font-black text-2xl bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">
                    {formatGia(finalTotal)}
                  </span>
                </div>
              </div>

              {/* Coupon code */}
              <div className="mb-5">
                {couponCode ? (
                  <div className="flex items-center justify-between px-4 py-3 rounded-2xl border border-emerald-200 bg-emerald-50">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">🎉</span>
                      <div>
                        <p className="text-sm font-bold text-emerald-700">Mã {couponCode} đã áp dụng</p>
                        <p className="text-xs text-emerald-600">
                          {discountPercent > 0 ? `Giảm ${discountPercent}%` : "Miễn phí vận chuyển"}
                        </p>
                      </div>
                    </div>
                    <button onClick={removeCoupon} className="text-sm text-red-400 hover:text-red-600 font-bold transition-colors">✕</button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                      onKeyDown={(e) => e.key === "Enter" && handleApplyCoupon()}
                      placeholder="Nhập mã khuyến mãi..."
                      className="flex-1 px-4 py-2.5 text-sm rounded-xl border outline-none transition-all focus:ring-2 focus:ring-orange-200 focus:border-orange-400"
                      style={{ background: "var(--bg-secondary)", borderColor: "var(--border-color)", color: "var(--text-primary)" }}
                    />
                    <button
                      onClick={handleApplyCoupon}
                      className="px-4 py-2.5 rounded-xl text-sm font-bold bg-orange-100 text-orange-600 hover:bg-orange-200 transition-colors whitespace-nowrap"
                    >
                      Áp dụng
                    </button>
                  </div>
                )}
                <p className="text-[11px] mt-1.5" style={{ color: "var(--text-muted)" }}>
                  Thử: SUMMER20, SIPS10, FREESHIP, HELLO15
                </p>
              </div>

              {/* Delivery form */}
              <form onSubmit={handleCheckout} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>
                    Người nhận <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={hoTen}
                    onChange={(e) => setHoTen(e.target.value)}
                    placeholder="Nguyễn Văn A"
                    className="w-full px-4 py-3 rounded-xl border outline-none transition-all text-sm focus:ring-2 focus:ring-orange-200 focus:border-orange-400"
                    style={{ background: "var(--bg-secondary)", borderColor: "var(--border-color)", color: "var(--text-primary)" }}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>
                    Điện thoại <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    value={soDienThoai}
                    onChange={(e) => setSoDienThoai(e.target.value)}
                    placeholder="09xx xxx xxx"
                    className="w-full px-4 py-3 rounded-xl border outline-none transition-all text-sm focus:ring-2 focus:ring-orange-200 focus:border-orange-400"
                    style={{ background: "var(--bg-secondary)", borderColor: "var(--border-color)", color: "var(--text-primary)" }}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>
                    Địa chỉ giao <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={diaChi}
                    onChange={(e) => setDiaChi(e.target.value)}
                    placeholder="Số nhà, Tên đường, Quận, TP"
                    className="w-full px-4 py-3 rounded-xl border outline-none transition-all text-sm focus:ring-2 focus:ring-orange-200 focus:border-orange-400"
                    style={{ background: "var(--bg-secondary)", borderColor: "var(--border-color)", color: "var(--text-primary)" }}
                  />
                </div>

                {error && (
                  <div className="p-3 bg-red-50 text-red-600 text-sm font-semibold rounded-xl border border-red-100">
                    ⚠️ {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting || items.length === 0}
                  className="w-full py-4 mt-2 rounded-2xl font-black text-lg flex justify-center items-center gap-2 transition-all hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                  style={{
                    background: "linear-gradient(135deg, #f97316, #ec4899)",
                    color: "white",
                    boxShadow: "0 8px 24px rgba(249,115,22,0.35)",
                  }}
                >
                  {isSubmitting ? (
                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>🍹 Đặt Hàng Ngay</>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

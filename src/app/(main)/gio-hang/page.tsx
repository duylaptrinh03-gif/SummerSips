"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/useCartStore";
import { CartItemCard } from "@/components/cart/CartItemCard";
import { formatGia } from "@/utils/formatter";
import { orderService } from "@/services/orderService";
import { taoMaDonHang } from "@/utils/formatter";

export default function GioHangPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const items = useCartStore((state) => state.items);
  const clearCart = useCartStore((state) => state.clearCart);
  
  const getCount = useCartStore((state) => state.getTotalCount);
  const getPrice = useCartStore((state) => state.getTotalPrice);

  const totalCount = mounted ? getCount() : 0;
  const totalPrice = mounted ? getPrice() : 0;

  // Checkout Form State
  const [hoTen, setHoTen] = useState("");
  const [soDienThoai, setSoDienThoai] = useState("");
  const [diaChi, setDiaChi] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!hoTen.trim() || !soDienThoai.trim() || !diaChi.trim()) {
      setError("Vui lòng điền đầy đủ thông tin giao hàng!");
      return;
    }
    
    // Basic phone validation for Vietnam (0... 10 digits)
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
        tongTien: totalPrice,
        trangThai: "cho_xac_nhan" as const,
        taoLuc: new Date().toISOString(),
      };

      await orderService.createOrder(newOrder);
      clearCart();
      router.push(`/don-hang?new=${newOrder.id}`);
    } catch (err) {
      setError("Có lỗi xảy ra khi đặt hàng. Vui lòng thử lại!");
      setIsSubmitting(false);
    }
  };

  if (!mounted) return null; // Tránh lỗi hydration mismatch

  if (items.length === 0) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 bg-zinc-50">
        <span className="text-8xl mb-6 opacity-80" style={{ animation: "blob 4s infinite alternate" }}>🛒</span>
        <h1 className="text-3xl font-black text-gray-900 mb-2">Giỏ hàng trống</h1>
        <p className="text-gray-500 mb-8 max-w-sm text-center">
          Một ly trà sữa không thể thay đổi thế giới, nhưng nó làm ngày của bạn vui hơn. Đặt ngay nhé!
        </p>
        <Link
          href="/thuc-don"
          className="px-8 py-4 bg-gray-900 text-white font-bold rounded-2xl hover:bg-black hover:scale-105 active:scale-95 transition-all shadow-xl shadow-gray-900/20"
        >
          Tiếp tục chọn món
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-zinc-50 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-black text-gray-900">Giỏ Hàng</h1>
            <p className="text-gray-500 text-sm mt-1">{totalCount} sản phẩm</p>
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
          <div className="w-full lg:w-[400px] shrink-0">
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100 sticky top-24">
              <h2 className="text-xl font-black text-gray-900 mb-6">Thanh Toán</h2>
              
              <div className="flex justify-between items-center mb-6 p-4 rounded-2xl bg-orange-50/50">
                <span className="font-bold text-gray-600">Tổng cộng</span>
                <span className="font-black text-2xl bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">
                  {formatGia(totalPrice)}
                </span>
              </div>

              <form onSubmit={handleCheckout} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">Người nhận <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    value={hoTen}
                    onChange={(e) => setHoTen(e.target.value)}
                    placeholder="Nguyễn Văn A"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:bg-white focus:ring-2 focus:ring-orange-200 focus:border-orange-500 outline-none transition-all text-sm"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">Điện thoại <span className="text-red-500">*</span></label>
                  <input
                    type="tel"
                    value={soDienThoai}
                    onChange={(e) => setSoDienThoai(e.target.value)}
                    placeholder="09xx xxx xxx"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:bg-white focus:ring-2 focus:ring-orange-200 focus:border-orange-500 outline-none transition-all text-sm"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">Địa chỉ giao <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    value={diaChi}
                    onChange={(e) => setDiaChi(e.target.value)}
                    placeholder="Số nhà, Tên đường, Quận, TP"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:bg-white focus:ring-2 focus:ring-orange-200 focus:border-orange-500 outline-none transition-all text-sm"
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
                  className="w-full py-4 mt-6 rounded-2xl bg-gray-900 text-white font-black hover:bg-black hover:shadow-xl hover:shadow-gray-900/20 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed hover:-translate-y-0.5 transition-all text-lg flex justify-center items-center gap-2"
                >
                  {isSubmitting ? (
                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"/>
                  ) : (
                    "Đặt Hàng Ngay"
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

"use client";

import Link from "next/link";
import Navbar from "@/components/Navbar";
import CartItemComponent from "@/components/CartItem";
import CheckoutForm from "@/components/CheckoutForm";
import { useCart } from "@/context/CartContext";

export default function CartPage() {
  const { items, totalCount, totalPrice, clearCart } = useCart();

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-pink-50">
        <Navbar />
        <main className="pt-16 flex flex-col items-center justify-center min-h-[80vh] px-4 text-center">
          <div className="text-7xl mb-6 animate-[float_3s_ease-in-out_infinite]">🛒</div>
          <h1 className="text-3xl font-black text-gray-900 mb-3">Giỏ hàng trống</h1>
          <p className="text-gray-500 mb-8 max-w-sm">
            Bạn chưa thêm sản phẩm nào. Hãy khám phá thực đơn của chúng tôi nhé!
          </p>
          <Link
            href="/shop"
            id="cart-empty-shop-link"
            className="px-8 py-4 bg-gradient-to-r from-orange-500 to-pink-500 text-white font-bold rounded-2xl hover:shadow-lg hover:shadow-orange-300/50 hover:-translate-y-0.5 transition-all"
          >
            Xem Thực Đơn 🍹
          </Link>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-pink-50">
      <Navbar />

      <main className="pt-16 pb-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-black text-gray-900">Giỏ Hàng</h1>
              <p className="text-gray-400 text-sm mt-1">
                {totalCount} sản phẩm · {totalPrice.toLocaleString("vi-VN")}đ
              </p>
            </div>
            <button
              id="cart-clear-all"
              onClick={clearCart}
              className="text-sm text-gray-400 hover:text-red-400 transition-colors flex items-center gap-1"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Xóa tất cả
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            {/* Cart items column */}
            <div className="lg:col-span-3 space-y-3">
              {items.map((item) => (
                <CartItemComponent key={item.id} item={item} />
              ))}

              <Link
                href="/shop"
                id="cart-continue-shopping"
                className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-orange-500 transition-colors mt-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Tiếp tục mua sắm
              </Link>
            </div>

            {/* Checkout form column */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 sticky top-20">
                <h2 className="text-xl font-black text-gray-900 mb-5 flex items-center gap-2">
                  <span>📋</span> Thông tin đặt hàng
                </h2>
                <CheckoutForm />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

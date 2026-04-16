"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Order } from "@/types/order";
import { orderService } from "@/services/orderService";
import { OrderCard } from "@/components/order/OrderCard";
import { Suspense } from "react";

function OrdersContent() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  
  const searchParams = useSearchParams();
  const newOrderId = searchParams.get("new");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await orderService.getAllOrders();
        setOrders(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center p-20">
        <span className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"/>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm mt-8">
        <span className="text-6xl mb-6 opacity-80 inline-block grayscale">📝</span>
        <h2 className="text-2xl font-black text-gray-900 mb-2">Chưa có đơn hàng nào!</h2>
        <p className="text-gray-500 mb-8 max-w-sm mx-auto">
          Cùng bắt đầu hành trình hương vị cùng SummerSips ngày hôm nay nhé.
        </p>
        <Link
          href="/thuc-don"
          className="inline-flex px-8 py-3.5 bg-orange-50 text-orange-600 font-bold rounded-xl hover:bg-orange-100 transition-colors"
        >
          Xem Thực Đơn
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Thông báo đặt hàng thành công */}
      {newOrderId && (
        <div className="p-4 bg-green-50 rounded-2xl border border-green-200 flex items-center justify-between mb-8 animate-[fadeInDown_0.4s_ease-out]">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🎉</span>
            <div>
              <p className="font-bold text-green-800">Đặt hàng thành công!</p>
              <p className="text-sm text-green-600">
                Đơn hàng <span className="font-mono bg-green-100 px-1 rounded">{newOrderId}</span> đang được chuẩn bị.
              </p>
            </div>
          </div>
          <Link
            href="/don-hang"
            className="w-8 h-8 bg-black/5 rounded-full flex items-center justify-center text-green-800 hover:bg-black/10 transition"
            title="Đóng thông báo"
          >
            ✕
          </Link>
        </div>
      )}

      {/* Danh sách đơn hàng */}
      {orders.map((order) => (
        <OrderCard key={order.id} order={order} isNew={order.id === newOrderId} />
      ))}
    </div>
  );
}

export default function DonHangPage() {
  return (
    <div className="bg-zinc-50 min-h-screen py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-gray-900">Lịch Sử Đơn Hàng</h1>
            <p className="text-gray-500 text-sm mt-1">Theo dõi và quản lý các đơn hàng của bạn</p>
          </div>
          <Link
            href="/thuc-don"
            className="text-sm font-bold text-orange-500 hover:text-orange-600 transition-colors"
          >
            + Đặt thêm món
          </Link>
        </div>

        <Suspense fallback={
          <div className="flex justify-center p-20">
             <span className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"/>
          </div>
        }>
          <OrdersContent />
        </Suspense>
      </div>
    </div>
  );
}

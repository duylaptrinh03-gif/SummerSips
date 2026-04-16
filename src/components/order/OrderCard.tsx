import { Order, TRANG_THAI_LABEL } from "@/types/order";
import { formatNgayGio, formatGia } from "@/utils/formatter";
import { calculateItemPrice } from "@/types/cart";
import Image from "next/image";

interface OrderCardProps {
  order: Order;
  isNew?: boolean;
}

export function OrderCard({ order, isNew }: OrderCardProps) {
  // Config styles cho từng trạng thái
  const statusConfig: Record<string, string> = {
    cho_xac_nhan: "bg-amber-100 text-amber-700 border-amber-200",
    dang_pha_che: "bg-blue-100 text-blue-700 border-blue-200",
    dang_giao: "bg-purple-100 text-purple-700 border-purple-200",
    hoan_thanh: "bg-green-100 text-green-700 border-green-200",
    da_huy: "bg-red-100 text-red-700 border-red-200",
  };

  const statusClass = statusConfig[order.trangThai] || "bg-gray-100 text-gray-700";
  const isPending = order.trangThai === "cho_xac_nhan" || order.trangThai === "dang_pha_che";

  return (
    <div
      className={`bg-white rounded-3xl overflow-hidden shadow-sm border ${
        isNew ? "border-orange-300 shadow-orange-100" : "border-gray-100"
      }`}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-4 bg-gray-50/50 border-b border-gray-100">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono font-bold text-gray-500 uppercase">
              {order.id}
            </span>
            {isNew && (
              <span className="px-2 py-0.5 text-[10px] font-black rounded-full bg-orange-500 text-white animate-pulse">
                MỚI
              </span>
            )}
          </div>
          <p className="text-sm text-gray-500">
            {formatNgayGio(order.taoLuc)}
          </p>
        </div>

        <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center">
          <span className="text-xs text-gray-400 hidden sm:block">Tổng cộng</span>
          <span className="font-black text-xl text-gray-900">
            {formatGia(order.tongTien)}
          </span>
        </div>
      </div>

      {/* Thông tin giao hàng */}
      <div className="px-5 py-4 border-b border-gray-50">
        <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
          <div className="flex items-center gap-2 text-gray-600">
            <span className="w-6 h-6 flex items-center justify-center rounded-full bg-gray-100">👤</span>
            <span className="font-semibold">{order.thongTinNhan.hoTen}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <span className="w-6 h-6 flex items-center justify-center rounded-full bg-gray-100">📞</span>
            <span className="font-medium">{order.thongTinNhan.soDienThoai}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600 w-full sm:w-auto mt-1 sm:mt-0">
            <span className="w-6 h-6 flex items-center justify-center rounded-full bg-gray-100 shrink-0">📍</span>
            <span className="font-medium line-clamp-1">{order.thongTinNhan.diaChi}</span>
          </div>
        </div>
      </div>

      {/* Items */}
      <div className="px-5 py-4 bg-white">
        <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">
          Chi tiết đơn
        </p>
        <div className="space-y-4">
          {order.items.map((item) => (
            <div key={item.cartId} className="flex gap-3">
              <div className="relative w-12 h-12 rounded-xl bg-gray-50 overflow-hidden shrink-0 border border-gray-100">
                <Image src={item.image} alt={item.name} fill className="object-cover" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <p className="font-bold text-gray-900 text-sm">
                    <span className="text-orange-500 mr-1">{item.quantity}x</span> 
                    {item.name}
                  </p>
                  <span className="font-bold text-gray-700 text-sm">
                    {formatGia(calculateItemPrice(item))}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">
                   Size {item.size}, Đá {item.iceLevel}%, Đường {item.sugarLevel}%
                   {item.toppings.length > 0 && `, ${item.toppings.map(t => t.name).join(", ")}`}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Status Footer */}
      <div className="px-5 py-4 border-t border-gray-50 bg-gray-50/30 flex items-center justify-between">
        <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold border ${statusClass}`}>
          {isPending && (
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 currentColor"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 currentColor"></span>
            </span>
          )}
          {TRANG_THAI_LABEL[order.trangThai]}
        </div>

        {order.trangThai === "cho_xac_nhan" && (
          <button className="text-xs font-bold text-gray-400 hover:text-red-500 transition-colors">
            Hủy đơn
          </button>
        )}
      </div>
    </div>
  );
}

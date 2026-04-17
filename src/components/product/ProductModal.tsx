"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Drink, ToppingOption, SizeName } from "@/types/drink";
import { CartItem } from "@/types/cart";
import { formatGia, taoCartId } from "@/utils/formatter";
import { QuantityControl } from "../ui/QuantityControl";
import { useCartStore } from "@/store/useCartStore";
import { useToastStore } from "@/store/useToastStore";

interface ProductModalProps {
  drink: Drink;
  isOpen: boolean;
  onClose: () => void;
}

export function ProductModal({ drink, isOpen, onClose }: ProductModalProps) {
  const addItem = useCartStore((state) => state.addItem);
  const addToast = useToastStore((s) => s.addToast);

  // Tính toán size mặc định (Size có extraPrice === 0 hoặc size đầu tiên)
  const defaultSize = drink.sizeOptions.find(s => s.extraPrice === 0)?.name || drink.sizeOptions[0]?.name || "S";

  // States (Tự động khởi tạo lại mỗi khi component Mount)
  const [selectedSize, setSelectedSize] = useState<SizeName>(defaultSize as SizeName);
  const [iceLevel, setIceLevel] = useState<0 | 50 | 100>(100);
  const [sugarLevel, setSugarLevel] = useState<0 | 50 | 100>(100);
  const [selectedToppings, setSelectedToppings] = useState<ToppingOption[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [note, setNote] = useState("");

  // Ngăn scroll ở trang ngoài khi modal bật
  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "unset";
    return () => { document.body.style.overflow = "unset"; };
  }, [isOpen]);

  if (!isOpen) return null;

  // Tính toán giá
  const currentSizeObj = drink.sizeOptions.find((s) => s.name === selectedSize);
  const sizeExtra = currentSizeObj?.extraPrice || 0;
  const toppingTotal = selectedToppings.reduce((sum, t) => sum + t.price, 0);

  const unitPrice = drink.basePrice + sizeExtra + toppingTotal;
  const totalPrice = unitPrice * quantity;

  // Xử lý Topping toggle
  const handleToggleTopping = (topping: ToppingOption) => {
    const isSelected = selectedToppings.find(t => t.id === topping.id);
    if (isSelected) {
      setSelectedToppings(prev => prev.filter(t => t.id !== topping.id));
    } else {
      setSelectedToppings(prev => [...prev, topping]);
    }
  };

  // Nút Thêm vào giỏ
  const handleAddToCart = () => {
    const newItem: CartItem = {
      cartId: taoCartId(),
      drinkId: drink.id,
      name: drink.name,
      image: drink.image,
      basePrice: drink.basePrice,
      size: selectedSize,
      sizeExtraPrice: sizeExtra,
      toppings: selectedToppings,
      iceLevel: iceLevel,
      sugarLevel: sugarLevel,
      note: note.trim(),
      quantity,
    };

    addItem(newItem);
    addToast(`🛒 Đã thêm ${drink.name} vào giỏ hàng!`, "success");
    onClose();
  };


  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* Modal content */}
        <motion.div
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="relative w-full max-w-2xl bg-white sm:rounded-3xl rounded-t-3xl h-[85vh] sm:h-auto max-h-[90vh] flex flex-col overflow-hidden"
        >
          {/* Header Mobile: Kéo để đóng (Chỉ trang trí) */}
          <div className="w-full flex justify-center py-3 sm:hidden">
            <div className="w-12 h-1.5 bg-gray-200 rounded-full" />
          </div>

          {/* Close Btn Desktop */}
          <button
            onClick={onClose}
            className="hidden sm:flex absolute top-4 right-4 z-10 w-10 h-10 items-center justify-center bg-white/80 backdrop-blur text-gray-500 rounded-full shadow-sm hover:bg-gray-100 hover:text-gray-900 transition-colors"
          >
            ✕
          </button>

          <div className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-hide flex flex-col sm:flex-row">
            {/* Hình ảnh (Sticky trên desktop) */}
            <div className="w-full sm:w-[280px] md:w-[320px] shrink-0 bg-orange-50 flex flex-col overflow-hidden relative">
              <div className="relative aspect-square sm:aspect-auto sm:h-full w-full">
                <Image
                  src={drink.image}
                  alt={drink.name}
                  fill
                  className="object-cover"
                />
              </div>
            </div>

            {/* Form Options */}
            <div className="flex-1 p-6 flex flex-col gap-8">
              <div>
                <h2 className="text-2xl font-black text-gray-900 mb-2">{drink.name}</h2>
                <p className="text-sm text-gray-500 leading-relaxed mb-4">{drink.description}</p>
                <div className="inline-flex px-3 py-1 bg-orange-100 text-orange-600 rounded-lg text-lg font-black">
                  {formatGia(drink.basePrice)}
                </div>
              </div>

              {/* 1. Chọn Size */}
              {drink.sizeOptions.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-gray-900">Kích cỡ</h3>
                    <span className="text-xs font-semibold text-gray-400 bg-gray-100 px-2 py-1 rounded">Bắt buộc</span>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    {drink.sizeOptions.map((sz) => (
                      <button
                        key={sz.name}
                        onClick={() => setSelectedSize(sz.name)}
                        className={`flex flex-col items-center p-3 rounded-2xl border-2 transition-all ${selectedSize === sz.name
                            ? "border-orange-500 bg-orange-50 text-orange-600"
                            : "border-gray-100 text-gray-600 hover:border-gray-200"
                          }`}
                      >
                        <span className="font-bold mb-1">{sz.label}</span>
                        <span className="text-xs opacity-80">
                          {sz.extraPrice > 0 ? `+${formatGia(sz.extraPrice)}` : "Miễn phí"}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* 2. Lượng Đá & Đường */}
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h3 className="font-bold text-gray-900">Đá</h3>
                  <div className="flex bg-gray-100 rounded-xl p-1">
                    {([0, 50, 100] as const).map((val) => (
                      <button
                        key={`da-${val}`}
                        onClick={() => setIceLevel(val)}
                        className={`flex-1 py-1.5 text-sm font-bold rounded-lg transition-all ${iceLevel === val ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-900"
                          }`}
                      >
                        {val}%
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="font-bold text-gray-900">Đường</h3>
                  <div className="flex bg-gray-100 rounded-xl p-1">
                    {([0, 50, 100] as const).map((val) => (
                      <button
                        key={`duong-${val}`}
                        onClick={() => setSugarLevel(val)}
                        className={`flex-1 py-1.5 text-sm font-bold rounded-lg transition-all ${sugarLevel === val ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-900"
                          }`}
                      >
                        {val}%
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* 3. Chọn Topping */}
              {drink.toppingOptions.length > 0 && (
                <div className="space-y-3">
                  <h3 className="font-bold text-gray-900">Topping thêm</h3>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {drink.toppingOptions.map((top) => {
                      const isSelected = selectedToppings.some((t) => t.id === top.id);
                      return (
                        <label
                          key={top.id}
                          className={`flex items-center justify-between p-4 rounded-2xl border-2 cursor-pointer transition-all ${isSelected
                              ? "border-pink-500 bg-pink-50"
                              : "border-gray-100 hover:bg-gray-50"
                            }`}
                        >
                          <div className="flex items-center gap-3">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => handleToggleTopping(top)}
                              className="w-5 h-5 rounded text-pink-500 focus:ring-pink-500 accent-pink-500"
                            />
                            <span className={`font-semibold ${isSelected ? "text-pink-700" : "text-gray-700"}`}>
                              {top.name}
                            </span>
                          </div>
                          <span className="text-sm font-bold text-gray-500">+{formatGia(top.price)}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* 4. Ghi chú */}
              <div className="space-y-3">
                <h3 className="font-bold text-gray-900">Ghi chú thêm</h3>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Ví dụ: Ít béo, không lấy ống hút..."
                  className="w-full p-4 rounded-2xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all resize-none outline-none text-sm"
                  rows={2}
                />
              </div>

              {/* Padding for sticky footer */}
              <div className="h-4"></div>
            </div>
          </div>

          {/* Footer - Checkout Add */}
          <div className="border-t border-gray-100 bg-white p-4 sm:p-6 pb-safe flex items-center justify-between gap-6 relative z-10 shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
            <QuantityControl quantity={quantity} onIncrease={() => setQuantity(q => q + 1)} onDecrease={() => setQuantity(q => q - 1)} />

            <button
              onClick={handleAddToCart}
              className="flex-1 max-w-[300px] h-14 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-2xl font-black text-lg flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-orange-300/50 hover:-translate-y-0.5 active:translate-y-0 transition-all"
            >
              <span className="opacity-90 font-medium hidden sm:inline mr-2">{formatGia(unitPrice)}</span>
              Thêm {formatGia(totalPrice)}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

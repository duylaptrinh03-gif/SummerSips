"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useCartStore } from "@/store/useCartStore";
import { drinkService } from "@/services/drinkService";
import { Drink, Category } from "@/types/drink";
import { ProductCard } from "@/components/product/ProductCard";
import { CategoryTabs } from "@/components/product/CategoryTabs";
import { ProductModal } from "@/components/product/ProductModal";
import { Loader } from "@/components/ui/Loader";
import { formatGia } from "@/utils/formatter";
import { motion, AnimatePresence } from "framer-motion";

const CATEGORIES: Category[] = [
  "Tất cả",
  "Cà Phê",
  "Trà Sữa",
  "Trà Trái Cây",
  "Sinh Tố",
  "Nước Ép",
];

export default function ThucDonPage() {
  const [drinks, setDrinks] = useState<Drink[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<Category>("Tất cả");

  // Modal logic
  const [selectedDrink, setSelectedDrink] = useState<Drink | null>(null);

  // Floating Cart
  const getCount = useCartStore((state) => state.getTotalCount);
  const [mounted, setMounted] = useState(false);
  const totalCount = mounted ? getCount() : 0;
  const totalPrice = useCartStore((state) => mounted ? state.getTotalPrice() : 0);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const fetchMenu = async () => {
      setLoading(true);
      try {
        // Luôn fetch tất cả để filter ở client cho mượt
        const data = await drinkService.getDrinks("Tất cả");
        setDrinks(data);
      } catch (error) {
        console.error("Failed to fetch drinks", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMenu();
  }, []); // Chỉ fetch một lần duy nhất khi mount

  const filteredDrinks = useMemo(() => {
    if (activeCategory === "Tất cả") return drinks;
    return drinks.filter((d) => d.category === activeCategory);
  }, [drinks, activeCategory]);

  return (
    <div className="bg-zinc-50 min-h-screen pb-40">
      {/* Header Banner */}
      <section className="bg-gradient-to-br from-orange-50 via-white to-pink-50 py-16 px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-100 text-orange-600 text-sm font-semibold mb-6">
            🌊 Thực Đơn Tiêu Chuẩn Điểm 10
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-gray-900 mb-6 leading-tight tracking-tight">
            Chọn Đồ Uống{" "}
            <span className="bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">
              Yêu Thích Của Bạn
            </span>
          </h1>
          <p className="text-gray-500 text-lg">
            Hương vị tươi mát, pha chế mới mỗi trưa hè.
          </p>
        </motion.div>
      </section>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        {/* Lọc danh mục */}
        <div className="sticky top-16 z-[40] bg-zinc-50/90 backdrop-blur-md pt-4 pb-4 mb-4">
          <CategoryTabs
            categories={CATEGORIES}
            activeCategory={activeCategory}
            onChange={setActiveCategory}
          />
        </div>

        {/* Danh sách */}
        <AnimatePresence mode="popLayout">
          {loading ? (
            <motion.div
              key="loader"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="col-span-full"
            >
              <Loader />
            </motion.div>
          ) : filteredDrinks.length > 0 ? (
            <motion.div
              key={activeCategory} // Key bám theo category để có hiệu ứng chuyển
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              {filteredDrinks.map((drink) => (
                <ProductCard
                  key={drink.id}
                  drink={drink}
                  onClick={(d) => setSelectedDrink(d)}
                />
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-20 opacity-50"
            >
              <span className="text-6xl mb-4">😿</span>
              <p className="text-xl font-bold text-gray-500">
                Không tìm thấy món nào!
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Floating cart (Chỉ hiện khi có item) */}
      <AnimatePresence>
        {totalCount > 0 && (
          <motion.div
            initial={{ y: 150, x: "-50%" }}
            animate={{ y: 0, x: "-50%" }}
            exit={{ y: 150, x: "-50%" }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="fixed bottom-6 left-1/2 z-[45] w-full max-w-[340px] px-4"
          >
            <Link
              href="/gio-hang"
              className="flex items-center justify-between w-full px-5 py-4 bg-gray-900 text-white rounded-2xl shadow-2xl shadow-gray-900/30 hover:bg-black transition-all hover:scale-[1.02] active:scale-95 group"
            >
              <div className="flex items-center gap-3">
                <div className="relative w-8 h-8 flex justify-center items-center">
                  <span className="text-2xl group-hover:animate-bounce">🛒</span>
                  <span className="absolute -top-1 -right-2 w-5 h-5 flex items-center justify-center text-[10px] font-black bg-orange-500 text-white rounded-full shadow-sm">
                    {totalCount}
                  </span>
                </div>
                <span className="font-bold text-sm tracking-wide">Xem giỏ hàng</span>
              </div>
              <span className="font-black text-orange-400 text-lg">
                {formatGia(totalPrice)}
              </span>
            </Link>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal */}
      {selectedDrink && (
        <ProductModal
          isOpen={true}
          drink={selectedDrink}
          onClose={() => setSelectedDrink(null)}
        />
      )}
    </div>
  );
}

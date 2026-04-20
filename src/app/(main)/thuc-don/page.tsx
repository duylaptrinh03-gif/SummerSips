"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { useCartStore } from "@/store/useCartStore";
import { drinkService } from "@/services/drinkService";
import { Drink } from "@/types/drink";
import { ProductCard } from "@/components/product/ProductCard";
import { ProductGridSkeleton } from "@/components/ui/Skeleton";
import { formatGia } from "@/utils/formatter";
import { motion, AnimatePresence } from "framer-motion";

const ProductModal = dynamic(
  () => import("@/components/product/ProductModal").then((mod) => mod.ProductModal),
  {
    ssr: false,
    loading: () => <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[100]" />,
  }
);

export default function PageDrink() {
  const [drinks, setDrinks] = useState<Drink[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDrink, setSelectedDrink] = useState<Drink | null>(null);

  const getTotalCount = useCartStore((state) => state.getTotalCount);
  const getFinalTotal = useCartStore((state) => state.getFinalTotal);
  const totalCount = getTotalCount();
  const totalPrice = getFinalTotal();

  const fetchDrinks = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await drinkService.getDrinks();
      if (res.statusCode === 200) {
        setDrinks(res.data);
      } else {
        setDrinks([]);
      }
    } catch (err) {
      setDrinks([]);
      setError(err instanceof Error ? err.message : "Có lỗi xảy ra khi tải thực đơn.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDrinks();
  }, []);

  console.log(error)

  // ── Error state ──────────────────────────────────────────────────────────
  if (error) {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center gap-6 p-8"
        style={{ background: "var(--bg-secondary)" }}
      >
        <span className="text-7xl">😵</span>
        <div className="text-center">
          <h2 className="text-xl font-black mb-2" style={{ color: "var(--text-primary)" }}>
            Không thể tải thực đơn
          </h2>
          <p className="text-sm mb-6 max-w-sm" style={{ color: "var(--text-secondary)" }}>
            {error}
          </p>
          <button
            onClick={fetchDrinks}
            className="px-6 py-3 rounded-xl font-bold text-sm bg-orange-500 text-white hover:bg-orange-600 transition-colors"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-40" style={{ background: "var(--bg-secondary)" }}>
      {/* Header Banner */}
      <section
        className="py-16 px-4 text-center"
        style={{ background: "linear-gradient(135deg, var(--bg-primary) 0%, #fff7ed 50%, var(--bg-primary) 100%)" }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-100 text-orange-600 text-sm font-semibold mb-6">
            🌊 Thực Đơn Tiêu Chuẩn Điểm 10
          </div>
          <h1
            className="text-4xl sm:text-5xl md:text-6xl font-black mb-6 leading-tight tracking-tight"
            style={{ color: "var(--text-primary)" }}
          >
            Chọn Đồ Uống{" "}
            <span className="bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">
              Yêu Thích Của Bạn
            </span>
          </h1>
          <p className="text-lg" style={{ color: "var(--text-secondary)" }}>
            Hương vị tươi mát, pha chế mới mỗi trưa hè.
          </p>
        </motion.div>
      </section>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        {/* Count */}
        {!isLoading && (
          <p className="text-sm font-medium mb-4" style={{ color: "var(--text-muted)" }}>
            {drinks.length} sản phẩm
          </p>
        )}

        {/* Product Grid */}
        <AnimatePresence mode="popLayout">
          {isLoading ? (
            <motion.div key="skeleton" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <ProductGridSkeleton count={8} />
            </motion.div>
          ) : (
            <motion.div
              key="grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              {drinks.map((drink) => (
                <ProductCard
                  key={drink._id}
                  drink={drink}
                  onClick={(d) => setSelectedDrink(d)}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Floating Cart */}
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
              className="flex items-center justify-between w-full px-5 py-4 rounded-2xl shadow-2xl shadow-gray-900/30 hover:scale-[1.02] active:scale-95 group transition-all"
              style={{ background: "var(--text-primary)", color: "var(--bg-primary)" }}
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
              <span className="font-black text-orange-400 text-lg">{formatGia(totalPrice)}</span>
            </Link>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Product Modal */}
      <AnimatePresence>
        {selectedDrink && (
          <ProductModal
            key={selectedDrink._id}
            isOpen={true}
            drink={selectedDrink}
            onClose={() => setSelectedDrink(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
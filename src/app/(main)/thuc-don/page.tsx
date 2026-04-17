"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useCartStore } from "@/store/useCartStore";
import { drinkService } from "@/services/drinkService";
import { Drink, Category } from "@/types/drink";
import { ProductCard } from "@/components/product/ProductCard";
import { CategoryTabs } from "@/components/product/CategoryTabs";
import { ProductModal } from "@/components/product/ProductModal";
import { SearchBar } from "@/components/ui/SearchBar";
import { SortDropdown } from "@/components/ui/SortDropdown";
import { ProductGridSkeleton } from "@/components/ui/Skeleton";
import { formatGia } from "@/utils/formatter";
import { SortKey } from "@/types/ui";
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
  const [searchQuery, setSearchQuery] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("default");

  // Modal
  const [selectedDrink, setSelectedDrink] = useState<Drink | null>(null);

  // Floating Cart
  const getCount = useCartStore((state) => state.getTotalCount);
  const getFinalTotal = useCartStore((state) => state.getFinalTotal);
  const [mounted, setMounted] = useState(false);
  const totalCount = mounted ? getCount() : 0;
  const totalPrice = mounted ? getFinalTotal() : 0;

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const fetchMenu = async () => {
      setLoading(true);
      try {
        const data = await drinkService.getDrinks("Tất cả");
        setDrinks(data);
      } catch (error) {
        console.error("Failed to fetch drinks", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMenu();
  }, []);

  // Count per category (for badges)
  const categoryCounts = useMemo(() => {
    const counts: Partial<Record<Category, number>> = {};
    CATEGORIES.forEach((cat) => {
      counts[cat] = cat === "Tất cả"
        ? drinks.length
        : drinks.filter((d) => d.category === cat).length;
    });
    return counts;
  }, [drinks]);

  // Filter + sort
  const filteredDrinks = useMemo(() => {
    let result = drinks;

    // Category filter
    if (activeCategory !== "Tất cả") {
      result = result.filter((d) => d.category === activeCategory);
    }

    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (d) =>
          d.name.toLowerCase().includes(q) ||
          d.description.toLowerCase().includes(q) ||
          d.category.toLowerCase().includes(q)
      );
    }

    // Sort
    switch (sortKey) {
      case "price_asc":
        result = [...result].sort((a, b) => a.basePrice - b.basePrice);
        break;
      case "price_desc":
        result = [...result].sort((a, b) => b.basePrice - a.basePrice);
        break;
      case "name_asc":
        result = [...result].sort((a, b) => a.name.localeCompare(b.name, "vi"));
        break;
      case "popular":
        result = [...result].sort((a, b) => (b.soldCount ?? 0) - (a.soldCount ?? 0));
        break;
      default:
        break;
    }

    return result;
  }, [drinks, activeCategory, searchQuery, sortKey]);

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
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black mb-6 leading-tight tracking-tight"
              style={{ color: "var(--text-primary)" }}>
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
        {/* ── Sticky Filters ── */}
        <div
          className="sticky top-14 z-[40] pt-3 pb-3 mb-6 -mx-4 px-4 sm:-mx-6 sm:px-6 backdrop-blur-md"
          style={{ background: "var(--bg-secondary)dd" }}
        >
          {/* Category tabs */}
          <CategoryTabs
            categories={CATEGORIES}
            activeCategory={activeCategory}
            onChange={setActiveCategory}
            counts={categoryCounts}
          />

          {/* Search + Sort row */}
          <div className="flex gap-3 mt-3">
            <SearchBar onSearch={setSearchQuery} />
            <SortDropdown value={sortKey} onChange={setSortKey} />
          </div>
        </div>

        {/* Results count */}
        {!loading && (
          <p className="text-sm font-medium mb-4" style={{ color: "var(--text-muted)" }}>
            {filteredDrinks.length} sản phẩm{searchQuery && ` cho "${searchQuery}"`}
          </p>
        )}

        {/* Product Grid */}
        <AnimatePresence mode="popLayout">
          {loading ? (
            <motion.div key="skeleton" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <ProductGridSkeleton count={8} />
            </motion.div>
          ) : filteredDrinks.length > 0 ? (
            <motion.div
              key={`${activeCategory}-${sortKey}`}
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
              className="flex flex-col items-center justify-center py-24 gap-4"
            >
              <span className="text-7xl">🔍</span>
              <h3 className="text-xl font-bold" style={{ color: "var(--text-primary)" }}>
                Không tìm thấy kết quả
              </h3>
              <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                Thử tìm với từ khóa khác hoặc chọn danh mục khác
              </p>
              <button
                onClick={() => { setSearchQuery(""); setActiveCategory("Tất cả"); setSortKey("default"); }}
                className="px-6 py-2.5 rounded-xl font-semibold text-sm bg-orange-500 text-white hover:bg-orange-600 transition-colors"
              >
                Xóa bộ lọc
              </button>
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
          key={selectedDrink.id}
          isOpen={true}
          drink={selectedDrink}
          onClose={() => setSelectedDrink(null)}
        />
      )}
    </div>
  );
}

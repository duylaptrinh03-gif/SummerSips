"use client";

import { useState, useEffect, useMemo, Suspense } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";
import { useSession } from "next-auth/react";
import { useCartStore } from "@/store/useCartStore";
import { drinkService } from "@/services/drinkService";
import { orderService } from "@/services/orderService";
import { Drink, Category } from "@/types/drink";
import { ProductCard } from "@/components/product/ProductCard";
import { ProductGridSkeleton, RecoRowSkeleton } from "@/components/ui/Skeleton";
import { formatGia } from "@/utils/formatter";
import { motion, AnimatePresence } from "framer-motion";

const ProductModal = dynamic(
  () => import("@/components/product/ProductModal").then((mod) => mod.ProductModal),
  {
    ssr: false,
    loading: () => <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[100]" />,
  }
);

const CATEGORIES: Array<{ label: string; value: string; emoji: string }> = [
  { label: "Tất cả",     value: "Tất cả",      emoji: "✨" },
  { label: "Cà Phê",    value: "Cà Phê",      emoji: "☕" },
  { label: "Trà Sữa",   value: "Trà Sữa",     emoji: "🧋" },
  { label: "Trà Trái Cây", value: "Trà Trái Cây", emoji: "🍑" },
  { label: "Sinh Tố",   value: "Sinh Tố",     emoji: "🥤" },
  { label: "Nước Ép",   value: "Nước Ép",     emoji: "🍊" },
];

// ── Inner content (needs Suspense for useSearchParams) ────────────────────────
function ThucDonContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const [drinks, setDrinks] = useState<Drink[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDrink, setSelectedDrink] = useState<Drink | null>(null);

  // Recommendations
  const { data: session } = useSession();
  const [recommendations, setRecommendations] = useState<Drink[]>([]);
  const [recoTitle, setRecoTitle] = useState("Phổ biến nhất 🔥");
  const [recoCategory, setRecoCategory] = useState<string | null>(null);

  // Sync state với URL params
  const [search, setSearch] = useState(searchParams.get("search") ?? "");
  const [category, setCategory] = useState(searchParams.get("category") ?? "Tất cả");
  const [sortBy, setSortBy] = useState<"popular" | "price-asc" | "price-desc" | "rating">("popular");

  const getTotalCount = useCartStore((s) => s.getTotalCount);
  const getFinalTotal = useCartStore((s) => s.getFinalTotal);
  const totalCount = getTotalCount();
  const totalPrice = getFinalTotal();

  const fetchDrinks = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await drinkService.getDrinks();
      if (res.statusCode === 200) setDrinks(res.data);
      else setDrinks([]);
    } catch (err) {
      setDrinks([]);
      setError(err instanceof Error ? err.message : "Có lỗi xảy ra khi tải thực đơn.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchDrinks(); }, []);

  // Build recommendation list after drinks are loaded
  useEffect(() => {
    if (drinks.length === 0) return;

    const buildReco = async () => {
      if (session?.user) {
        try {
          const { orders } = await orderService.getMyOrders(1, 20);
          if (orders.length > 0) {
            const drinkMap = new Map(drinks.map((d) => [d._id, d]));
            const catCount: Record<string, number> = {};
            orders.forEach((o) => {
              o.items.forEach((item) => {
                const drink = drinkMap.get(item.drinkId);
                if (drink?.category) {
                  catCount[drink.category] = (catCount[drink.category] ?? 0) + item.quantity;
                }
              });
            });
            const topCat = Object.entries(catCount).sort((a, b) => b[1] - a[1])[0]?.[0];
            if (topCat) {
              const orderedIds = new Set(orders.flatMap((o) => o.items.map((i) => i.drinkId)));
              const unordered = drinks.filter((d) => d.category === topCat && !orderedIds.has(d._id));
              const fallback = drinks.filter((d) => d.category === topCat);
              const picks = (unordered.length >= 3 ? unordered : fallback).slice(0, 6);
              if (picks.length > 0) {
                setRecoTitle("Gợi ý cho bạn 🎯");
                setRecoCategory(topCat);
                setRecommendations(picks);
                return;
              }
            }
          }
        } catch {
          // fall through to popular
        }
      }
      // Guest or no order history: sort by soldCount
      const topSellers = [...drinks].sort((a, b) => (b.soldCount ?? 0) - (a.soldCount ?? 0)).slice(0, 6);
      setRecoTitle("Phổ biến nhất 🔥");
      setRecoCategory(null);
      setRecommendations(topSellers);
    };

    buildReco();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [drinks, session]);

  // Đọc URL params khi navigation (e.g. từ CommandPalette)
  useEffect(() => {
    const urlSearch = searchParams.get("search") ?? "";
    const urlCat = searchParams.get("category") ?? "Tất cả";
    setSearch(urlSearch);
    setCategory(urlCat);
  }, [searchParams]);

  // Cập nhật URL khi filter thay đổi
  const updateUrl = (newSearch: string, newCategory: string) => {
    const params = new URLSearchParams();
    if (newSearch.trim()) params.set("search", newSearch.trim());
    if (newCategory !== "Tất cả") params.set("category", newCategory);
    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  };

  const handleSearch = (val: string) => {
    setSearch(val);
    updateUrl(val, category);
  };

  const handleCategory = (val: string) => {
    setCategory(val);
    updateUrl(search, val);
  };

  // Filter + sort client-side
  const filtered = useMemo(() => {
    let list = drinks;
    if (category !== "Tất cả") list = list.filter((d) => d.category === category);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (d) => d.name.toLowerCase().includes(q) || d.description?.toLowerCase().includes(q)
      );
    }
    switch (sortBy) {
      case "price-asc":  return [...list].sort((a, b) => a.basePrice - b.basePrice);
      case "price-desc": return [...list].sort((a, b) => b.basePrice - a.basePrice);
      case "rating":     return [...list].sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
      default:           return [...list].sort((a, b) => (b.soldCount ?? 0) - (a.soldCount ?? 0));
    }
  }, [drinks, category, search, sortBy]);

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6 p-8" style={{ background: "var(--bg-secondary)" }}>
        <span className="text-7xl">😵</span>
        <div className="text-center">
          <h2 className="text-xl font-black mb-2" style={{ color: "var(--text-primary)" }}>Không thể tải thực đơn</h2>
          <p className="text-sm mb-6 max-w-sm" style={{ color: "var(--text-secondary)" }}>{error}</p>
          <button onClick={fetchDrinks} className="px-6 py-3 rounded-xl font-bold text-sm bg-orange-500 text-white hover:bg-orange-600 transition-colors">
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
        className="py-14 px-4 text-center"
        style={{ background: "linear-gradient(135deg, var(--bg-primary) 0%, #fff7ed 50%, var(--bg-primary) 100%)" }}
      >
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-100 text-orange-600 text-sm font-semibold mb-4">
            🌊 Thực Đơn Tiêu Chuẩn Điểm 10
          </div>
          <h1 className="text-4xl sm:text-5xl font-black mb-4 leading-tight" style={{ color: "var(--text-primary)" }}>
            Chọn Đồ Uống{" "}
            <span className="bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">
              Yêu Thích
            </span>
          </h1>

          {/* Search bar */}
          <div className="relative max-w-lg mx-auto mt-6">
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Tìm tên đồ uống..."
              className="w-full pl-12 pr-10 py-3.5 rounded-2xl text-sm font-medium border outline-none focus:border-orange-400 transition-colors shadow-sm"
              style={{ background: "var(--bg-card)", borderColor: "var(--border-color)", color: "var(--text-primary)" }}
            />
            {search && (
              <button
                onClick={() => handleSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-lg leading-none"
              >
                ×
              </button>
            )}
          </div>
        </motion.div>
      </section>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {/* Category Tabs + Sort */}
        <div className="flex items-center gap-3 mb-6">
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none flex-1">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.value}
                onClick={() => handleCategory(cat.value)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap border transition-all ${
                  category === cat.value
                    ? "bg-orange-500 border-orange-500 text-white shadow-md shadow-orange-100"
                    : "border-transparent hover:bg-orange-50 hover:border-orange-100"
                }`}
                style={category === cat.value ? {} : { color: "var(--text-secondary)" }}
              >
                <span>{cat.emoji}</span>
                {cat.label}
              </button>
            ))}
          </div>
          {/* Sort dropdown */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
            className="shrink-0 px-3 py-2 rounded-xl border text-sm font-semibold outline-none cursor-pointer transition-colors hover:border-orange-300 focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
            style={{
              background: "var(--bg-card)",
              borderColor: "var(--border-color)",
              color: "var(--text-primary)",
            }}
          >
            <option value="popular">🔥 Phổ biến</option>
            <option value="price-asc">💲 Giá tăng dần</option>
            <option value="price-desc">💰 Giá giảm dần</option>
            <option value="rating">⭐ Đánh giá cao</option>
          </select>
        </div>

        {/* Recommendations skeleton while drinks load */}
        {!search && category === "Tất cả" && isLoading && (
          <section className="mb-8">
            <div className="h-6 w-40 shimmer rounded-lg mb-4" />
            <RecoRowSkeleton count={5} />
          </section>
        )}

        {/* Recommendations */}
        {!search && category === "Tất cả" && recommendations.length > 0 && !isLoading && (
          <section className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-black" style={{ color: "var(--text-primary)" }}>
                {recoTitle}
              </h2>
              {recoCategory && (
                <button
                  onClick={() => handleCategory(recoCategory)}
                  className="text-xs font-bold text-orange-500 hover:text-orange-600 transition-colors"
                >
                  Xem thêm →
                </button>
              )}
            </div>
            <div className="flex gap-4 overflow-x-auto pb-3 scrollbar-none -mx-1 px-1">
              {recommendations.map((drink) => (
                <button
                  key={drink._id}
                  onClick={() => setSelectedDrink(drink)}
                  className="shrink-0 w-[168px] rounded-2xl overflow-hidden border text-left transition-all hover:shadow-md hover:-translate-y-0.5 active:scale-[0.97]"
                  style={{ background: "var(--bg-card)", borderColor: "var(--border-color)" }}
                >
                  <div
                    className="relative w-full h-28 overflow-hidden"
                    style={{ background: "var(--bg-secondary)" }}
                  >
                    {drink.image ? (
                      <Image src={drink.image} alt={drink.name} fill className="object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-4xl">🧋</div>
                    )}
                    {drink.tag && (
                      <span className="absolute top-2 left-2 px-2 py-0.5 text-[10px] font-bold rounded-full bg-orange-500 text-white">
                        {drink.tag}
                      </span>
                    )}
                  </div>
                  <div className="p-3">
                    <p className="text-sm font-bold leading-tight line-clamp-1" style={{ color: "var(--text-primary)" }}>
                      {drink.name}
                    </p>
                    <p className="text-xs font-black mt-1.5 bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">
                      {formatGia(drink.basePrice)}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </section>
        )}

        {/* Result count */}
        {!isLoading && (
          <p className="text-sm font-medium mb-5" style={{ color: "var(--text-muted)" }}>
            {search || category !== "Tất cả"
              ? `${filtered.length} kết quả${search ? ` cho "${search}"` : ""}${category !== "Tất cả" ? ` trong "${category}"` : ""}`
              : `${drinks.length} sản phẩm`}
          </p>
        )}

        {/* Grid */}
        <AnimatePresence mode="popLayout">
          {isLoading ? (
            <motion.div key="skeleton" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <ProductGridSkeleton count={8} />
            </motion.div>
          ) : filtered.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-24"
            >
              <p className="text-5xl mb-4">🔍</p>
              <h3 className="text-lg font-black mb-2" style={{ color: "var(--text-primary)" }}>
                Không tìm thấy đồ uống nào
              </h3>
              <p className="text-sm mb-6" style={{ color: "var(--text-secondary)" }}>
                Thử tìm với từ khóa khác hoặc xem tất cả sản phẩm.
              </p>
              <button
                onClick={() => { handleSearch(""); handleCategory("Tất cả"); }}
                className="px-6 py-2.5 rounded-xl text-sm font-bold bg-orange-50 text-orange-600 hover:bg-orange-100 transition-colors"
              >
                Xem tất cả
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              {filtered.map((drink) => (
                <ProductCard key={drink._id} drink={drink} onClick={(d) => setSelectedDrink(d)} />
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
            allDrinks={drinks}
            onSelectDrink={(d) => setSelectedDrink(d)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default function PageDrink() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--bg-secondary)" }}>
        <span className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <ThucDonContent />
    </Suspense>
  );
}

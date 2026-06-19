"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { LazySearchOrb } from "@/components/three";
import { drinkService } from "@/services/drinkService";
import { Drink } from "@/types/drink";

interface SearchResult {
  id: string;
  title: string;
  subtitle?: string;
  category: string;
  url: string;
}

// Static page shortcuts
const PAGE_RESULTS: SearchResult[] = [
  { id: "p1", title: "Lịch sử đơn hàng", category: "Trang", url: "/don-hang" },
  { id: "p2", title: "Giỏ hàng của tôi",  category: "Trang", url: "/gio-hang" },
  { id: "p3", title: "Cài đặt tài khoản", category: "Trang", url: "/cai-dat" },
  { id: "p4", title: "Dashboard",          category: "Trang", url: "/dashboard" },
];

export function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [isHovered, setIsHovered] = useState(false);
  const [drinks, setDrinks] = useState<Drink[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Handle Cmd+K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen((open) => !open);
      }
      if (e.key === "Escape") setIsOpen(false);
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Fetch drinks khi mở lần đầu
  useEffect(() => {
    if (isOpen && drinks.length === 0) {
      drinkService.getDrinks().then((res) => {
        if (res.statusCode === 200) setDrinks(res.data);
      }).catch(() => {});
    }
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setQuery("");
    }
  }, [isOpen]);

  // Build results từ drinks thật + page shortcuts
  const results = useMemo(() => {
    const drinkResults: SearchResult[] = drinks.map((d) => ({
      id: d._id,
      title: d.name,
      subtitle: d.category,
      category: "Thực đơn",
      url: `/thuc-don?search=${encodeURIComponent(d.name)}`,
    }));
    const all = [...drinkResults, ...PAGE_RESULTS];
    if (!query.trim()) return all.slice(0, 8);
    const q = query.toLowerCase();
    return all.filter(
      (r) => r.title.toLowerCase().includes(q) || r.subtitle?.toLowerCase().includes(q)
    );
  }, [drinks, query]);

  const handleSelect = (url: string) => {
    setIsOpen(false);
    router.push(url);
  };

  return (
    <>
      {/* Trigger Button (hidden on mobile, can be placed in Navbar) */}
      <button
        onClick={() => setIsOpen(true)}
        className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300 transition-all bg-gray-50/50"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <span>Tìm kiếm nhanh...</span>
        <kbd className="hidden sm:inline-flex items-center gap-1 px-1.5 py-0.5 rounded border border-gray-200 bg-white text-xs font-sans">
          <span className="text-xs">⌘</span>K
        </kbd>
      </button>

      {/* Modal */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[1000] flex items-start justify-center pt-[15vh] px-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm"
            />

            {/* Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="relative w-full max-w-2xl bg-white dark:bg-gray-900 rounded-3xl shadow-2xl overflow-hidden border border-gray-100 dark:border-gray-800"
            >
              {/* Top Section: Search Input + Orb */}
              <div className="relative border-b border-gray-100 dark:border-gray-800 flex items-center p-4">
                <svg className="w-6 h-6 text-orange-500 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  ref={inputRef}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Bạn đang tìm gì? (đồ uống, lịch sử, cài đặt...)"
                  className="flex-1 bg-transparent border-none outline-none px-4 py-2 text-lg text-gray-900 dark:text-white placeholder-gray-400"
                />
                
                {/* Search Orb */}
                <div 
                  className="w-16 h-16 absolute right-4"
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                >
                  <LazySearchOrb isHovered={isHovered} />
                </div>
              </div>

              {/* Results List */}
              <div className="max-h-[60vh] overflow-y-auto p-2">
                {results.length === 0 ? (
                  <div className="p-8 text-center text-gray-500">
                    <p>Không tìm thấy kết quả cho "{query}"</p>
                  </div>
                ) : (
                  <div className="space-y-1">
                    {/* Group by category */}
                    {Object.entries(
                      results.reduce((acc, curr) => {
                        (acc[curr.category] = acc[curr.category] || []).push(curr);
                        return acc;
                      }, {} as Record<string, SearchResult[]>)
                    ).map(([category, items]) => (
                      <div key={category} className="mb-4">
                        <div className="px-4 py-1.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                          {category}
                        </div>
                        <div className="space-y-1">
                          {items.map((item) => (
                            <button
                              key={item.id}
                              onClick={() => handleSelect(item.url)}
                              className="w-full flex items-center justify-between px-4 py-3 rounded-xl hover:bg-orange-50 dark:hover:bg-gray-800 transition-colors group text-left"
                            >
                              <div>
                                <span className="font-medium text-gray-700 dark:text-gray-200 group-hover:text-orange-600 block">
                                  {item.title}
                                </span>
                                {item.subtitle && (
                                  <span className="text-xs text-gray-400 group-hover:text-orange-400">{item.subtitle}</span>
                                )}
                              </div>
                              <svg className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity text-orange-500 shrink-0 ml-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="bg-gray-50 dark:bg-gray-800/50 p-4 border-t border-gray-100 dark:border-gray-800 text-xs text-gray-500 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1">
                    <kbd className="px-1.5 py-0.5 rounded border border-gray-300 bg-white dark:bg-gray-700">↑↓</kbd> điều hướng
                  </span>
                  <span className="flex items-center gap-1">
                    <kbd className="px-1.5 py-0.5 rounded border border-gray-300 bg-white dark:bg-gray-700">Enter</kbd> chọn
                  </span>
                </div>
                <span className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 rounded border border-gray-300 bg-white dark:bg-gray-700">ESC</kbd> đóng
                </span>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

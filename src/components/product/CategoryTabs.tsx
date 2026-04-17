"use client";

import { useRef } from "react";
import { Category } from "@/types/drink";

const CATEGORY_ICONS: Record<Category, string> = {
  "Tất cả": "🌈",
  "Cà Phê": "☕",
  "Trà Sữa": "🧋",
  "Trà Trái Cây": "🍑",
  "Sinh Tố": "🥤",
  "Nước Ép": "🍊",
};

interface CategoryTabsProps {
  categories: Category[];
  activeCategory: Category;
  onChange: (category: Category) => void;
  counts?: Partial<Record<Category, number>>;
}

export function CategoryTabs({ categories, activeCategory, onChange, counts }: CategoryTabsProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const handleClick = (cat: Category) => {
    onChange(cat);
    // Auto-scroll active tab into view on mobile
    const btn = containerRef.current?.querySelector(`[data-cat="${cat}"]`);
    btn?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
  };

  return (
    <div
      ref={containerRef}
      className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide"
      role="tablist"
      aria-label="Danh mục đồ uống"
    >
      {categories.map((cat) => {
        const isActive = cat === activeCategory;
        const count = counts?.[cat];
        return (
          <button
            key={cat}
            data-cat={cat}
            role="tab"
            aria-selected={isActive}
            id={`category-tab-${cat.replace(/\s+/g, "-").toLowerCase()}`}
            onClick={() => handleClick(cat)}
            className={`flex items-center gap-1.5 px-4 py-2.5 rounded-2xl text-sm font-semibold whitespace-nowrap shrink-0 transition-all duration-200 border ${
              isActive
                ? "bg-gradient-to-r from-orange-500 to-pink-500 text-white border-transparent shadow-md shadow-orange-200/50"
                : "border-transparent hover:-translate-y-0.5"
            }`}
            style={
              isActive
                ? {}
                : { background: "var(--bg-card)", borderColor: "var(--border-color)", color: "var(--text-secondary)" }
            }
          >
            <span>{CATEGORY_ICONS[cat]}</span>
            <span>{cat}</span>
            {count !== undefined && count > 0 && (
              <span
                className={`text-[10px] font-black px-1.5 py-0.5 rounded-full leading-none ${
                  isActive ? "bg-white/25 text-white" : "bg-orange-100 text-orange-600"
                }`}
              >
                {count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

"use client";

import { Category } from "@/types/drink";
import { motion } from "framer-motion";

interface CategoryTabsProps {
  categories: Category[];
  activeCategory: Category;
  onChange: (category: Category) => void;
}

export function CategoryTabs({ categories, activeCategory, onChange }: CategoryTabsProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
      {categories.map((category) => {
        const isActive = activeCategory === category;
        return (
          <button
            key={category}
            onClick={() => onChange(category)}
            className={`relative px-5 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-colors ${
              isActive ? "text-white" : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-100 shadow-sm"
            }`}
          >
            {isActive && (
              <motion.div
                layoutId="active-category"
                className="absolute inset-0 bg-gradient-to-r from-orange-500 to-pink-500 rounded-full"
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
            <span className="relative z-10">{category}</span>
          </button>
        );
      })}
    </div>
  );
}

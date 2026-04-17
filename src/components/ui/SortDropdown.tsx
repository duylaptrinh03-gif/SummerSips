"use client";

import { useState, useRef, useEffect } from "react";
import { SortKey, SortOption, SORT_OPTIONS } from "@/types/ui";

interface SortDropdownProps {
  value: SortKey;
  onChange: (key: SortKey) => void;
}

export function SortDropdown({ value, onChange }: SortDropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const current = SORT_OPTIONS.find((o) => o.key === value) ?? SORT_OPTIONS[0];

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        id="sort-dropdown-btn"
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-2xl border bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all whitespace-nowrap"
        style={{ background: "var(--bg-card)", borderColor: "var(--border-color)", color: "var(--text-primary)" }}
      >
        <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 4h18M7 8h10M11 12h6M15 16h2" />
        </svg>
        {current.label}
        <svg
          className={`w-3 h-3 text-gray-400 transition-transform ${open ? "rotate-180" : ""}`}
          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div
          className="absolute right-0 top-full mt-2 w-48 rounded-2xl border shadow-xl overflow-hidden z-50"
          style={{ background: "var(--bg-card)", borderColor: "var(--border-color)", boxShadow: "var(--shadow-lg)" }}
        >
          {SORT_OPTIONS.map((opt) => (
            <button
              key={opt.key}
              onClick={() => { onChange(opt.key); setOpen(false); }}
              className={`w-full text-left px-4 py-3 text-sm font-medium transition-colors ${
                opt.key === value
                  ? "bg-orange-50 text-orange-600 font-bold"
                  : "text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
              }`}
              style={opt.key === value ? {} : { color: "var(--text-primary)" }}
            >
              {opt.key === value && <span className="mr-2">✓</span>}
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

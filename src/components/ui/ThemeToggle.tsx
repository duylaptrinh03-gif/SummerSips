"use client";

import { useThemeStore } from "@/store/useThemeStore";

export function ThemeToggle() {
  const { theme, toggleTheme } = useThemeStore();
  const isDark = theme === "dark";

  return (
    <button
      onClick={toggleTheme}
      id="theme-toggle-btn"
      aria-label={isDark ? "Chuyển sang chế độ sáng" : "Chuyển sang chế độ tối"}
      className="relative w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white group overflow-hidden"
    >
      {/* Sun (light mode icon) */}
      <span
        className={`absolute text-lg transition-all duration-300 ${
          isDark ? "opacity-0 -translate-y-4 scale-75" : "opacity-100 translate-y-0 scale-100"
        }`}
      >
        ☀️
      </span>
      {/* Moon (dark mode icon) */}
      <span
        className={`absolute text-lg transition-all duration-300 ${
          isDark ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-4 scale-75"
        }`}
      >
        🌙
      </span>
    </button>
  );
}

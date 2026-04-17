"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCartStore } from "@/store/useCartStore";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

const navItems = [
  { label: "Trang Chủ", href: "/", emoji: "🏠" },
  { label: "Đồ Uống", href: "/thuc-don", emoji: "🍹" },
  { label: "Giỏ Hàng", href: "/gio-hang", emoji: "🛒" },
  { label: "Đơn Hàng", href: "/don-hang", emoji: "📦" },
];

export default function Navbar() {
  const pathname = usePathname();
  const getCount = useCartStore((state) => state.getTotalCount);
  const [mounted, setMounted] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  // Scroll shrink effect
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const totalCount = mounted ? getCount() : 0;

  // Đóng menu khi thay đổi route
  useEffect(() => {
    const timer = setTimeout(() => setIsMenuOpen(false), 0);
    return () => clearTimeout(timer);
  }, [pathname]);

  // Ngăn cuộn trang khi menu đang mở
  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "unset";
  }, [isMenuOpen]);

  return (
    <>
      {/* ═══════ HEADER ═══════ */}
      <header
        className={`fixed top-0 left-0 right-0 z-[100] backdrop-blur-lg border-b transition-all duration-300 ${
          scrolled ? "shadow-md py-0" : "shadow-sm py-0"
        }`}
        style={{
          background: "var(--bg-navbar)",
          borderColor: "var(--border-color)",
          boxShadow: scrolled ? "var(--shadow-md)" : "var(--shadow-sm)",
        }}
      >
        <div
          className={`max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between gap-4 transition-all duration-300 ${
            scrolled ? "h-14" : "h-16"
          }`}
        >
          {/* Logo */}
          <Link
            href="/"
            id="navbar-logo"
            className="relative z-50 flex items-center gap-2 shrink-0 group"
            onClick={() => setIsMenuOpen(false)}
          >
            <span className="text-2xl transition-transform group-hover:rotate-12 duration-300">🍹</span>
            <span className="text-xl font-black hidden xs:block" style={{ color: "var(--text-primary)" }}>
              Summer
              <span className="bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">
                Sips
              </span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  id={`nav-${item.href.replace("/", "") || "home"}`}
                  className={`relative px-4 py-2 rounded-xl text-sm font-bold transition-all duration-200 ${
                    isActive ? "bg-orange-50 text-orange-500" : "hover:bg-gray-50"
                  }`}
                  style={isActive ? {} : { color: "var(--text-secondary)" }}
                >
                  {item.label === "Giỏ Hàng" ? (
                    <span className="flex items-center gap-1.5">
                      <span>{item.label}</span>
                      {totalCount > 0 && (
                        <span className="inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 text-[10px] font-black rounded-full bg-gradient-to-r from-orange-500 to-pink-500 text-white shadow-sm shadow-orange-200">
                          {totalCount > 99 ? "99+" : totalCount}
                        </span>
                      )}
                    </span>
                  ) : (
                    item.label
                  )}
                  {isActive && (
                    <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-4 h-0.5 rounded-full bg-gradient-to-r from-orange-500 to-pink-500" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right controls */}
          <div className="flex items-center gap-1">
            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Mobile Cart */}
            <Link
              href="/gio-hang"
              className={`md:hidden p-2.5 rounded-xl transition-all relative ${
                pathname === "/gio-hang" ? "bg-orange-50 text-orange-500" : ""
              }`}
              style={{ color: pathname === "/gio-hang" ? undefined : "var(--text-secondary)" }}
            >
              <span className="text-xl">🛒</span>
              {totalCount > 0 && (
                <span className="absolute top-1 right-1 w-5 h-5 flex items-center justify-center text-[10px] font-black rounded-full bg-gradient-to-r from-orange-500 to-pink-500 text-white shadow-sm">
                  {totalCount > 99 ? "99+" : totalCount}
                </span>
              )}
            </Link>

            {/* Hamburger */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2.5 rounded-xl transition-all relative z-50 overflow-hidden hover:bg-gray-50"
              aria-label="Toggle menu"
              style={{ color: "var(--text-secondary)" }}
            >
              <div className="w-6 h-5 flex flex-col justify-between items-center transition-all duration-300">
                <span className={`w-full h-0.5 bg-current rounded-full transition-all duration-300 ${isMenuOpen ? "rotate-45 translate-y-[9px]" : ""}`} />
                <span className={`w-full h-0.5 bg-current rounded-full transition-all duration-300 ${isMenuOpen ? "opacity-0" : ""}`} />
                <span className={`w-full h-0.5 bg-current rounded-full transition-all duration-300 ${isMenuOpen ? "-rotate-45 -translate-y-[9px]" : ""}`} />
              </div>
            </button>
          </div>
        </div>
      </header>

      {/* ═══════ BACKDROP ═══════ */}
      <div
        className={`fixed inset-0 bg-black/20 backdrop-blur-sm z-[101] transition-opacity duration-300 md:hidden ${
          isMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsMenuOpen(false)}
      />

      {/* ═══════ DRAWER ═══════ */}
      <div
        className={`fixed top-0 right-0 bottom-0 w-[280px] z-[102] shadow-2xl transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] md:hidden ${
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
        style={{ background: "var(--bg-card)" }}
      >
        {/* Nút X */}
        <button
          onClick={() => setIsMenuOpen(false)}
          className="absolute top-4 right-4 p-2 rounded-full transition-colors hover:bg-gray-100"
          aria-label="Đóng menu"
          style={{ color: "var(--text-muted)" }}
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="flex flex-col h-full pt-20 px-6 pb-8">
          <div className="flex flex-col gap-2">
            <span className="text-[11px] font-black uppercase tracking-widest mb-2 px-4" style={{ color: "var(--text-muted)" }}>
              Menu Chính
            </span>

            {navItems.map((item, idx) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center justify-between px-4 py-3.5 rounded-2xl text-base font-bold transition-all duration-300 ${
                    isActive ? "bg-orange-50 text-orange-600 shadow-sm shadow-orange-100" : "hover:bg-gray-50"
                  }`}
                  style={{
                    transitionDelay: isMenuOpen ? `${idx * 50}ms` : "0ms",
                    transform: isMenuOpen ? "translateX(0)" : "translateX(20px)",
                    opacity: isMenuOpen ? 1 : 0,
                    color: isActive ? undefined : "var(--text-secondary)",
                  }}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span className="flex items-center gap-3">
                    <span className="text-xl">{item.emoji}</span>
                    {item.label}
                  </span>
                  {item.label === "Giỏ Hàng" && totalCount > 0 && (
                    <span className="inline-flex items-center justify-center min-w-[24px] h-6 px-2 text-xs font-black rounded-full bg-gradient-to-r from-orange-500 to-pink-500 text-white">
                      {totalCount}
                    </span>
                  )}
                  {isActive && <div className="w-1.5 h-1.5 rounded-full bg-orange-500" />}
                </Link>
              );
            })}
          </div>

          {/* Theme toggle in drawer */}
          <div className="mt-4 px-4 py-3 rounded-2xl" style={{ background: "var(--bg-secondary)" }}>
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold" style={{ color: "var(--text-secondary)" }}>Chế độ tối</span>
              <ThemeToggle />
            </div>
          </div>

          {/* Footer */}
          <div className="mt-auto pt-8 border-t space-y-4" style={{ borderColor: "var(--border-color)" }}>
            <div className="p-4 rounded-3xl bg-orange-50/50">
              <p className="text-xs text-orange-600/80 font-bold mb-1">Cần hỗ trợ?</p>
              <p className="text-sm font-black" style={{ color: "var(--text-primary)" }}>1900 1234 567</p>
            </div>
            <p className="text-[10px] text-center font-medium" style={{ color: "var(--text-muted)" }}>
              © 2026 SummerSips. Bùng nổ hương vị!
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "@/context/CartContext";

const navItems = [
  { label: "Trang Chủ", href: "/" },
  { label: "Đồ Uống", href: "/do-uong" },
  { label: "Giỏ Hàng", href: "/gio-hang" },
  { label: "Đơn Hàng", href: "/don-hang" },
];

export default function Navbar() {
  const pathname = usePathname();
  const { totalCount } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Đóng menu khi thay đổi route
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  // Ngăn cuộn trang (scroll) khi menu đang mở
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isMenuOpen]);

  return (
    <>
      {/* ================= HEADER CHÍNH ================= */}
      <header className="fixed top-0 left-0 right-0 z-[100] bg-white/90 backdrop-blur-lg border-b border-gray-100 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          
          {/* Logo */}
          <Link 
            href="/" 
            id="navbar-logo" 
            className="relative z-50 flex items-center gap-2 shrink-0 group"
            onClick={() => setIsMenuOpen(false)}
          >
            <span className="text-2xl transition-transform group-hover:rotate-12 duration-300">🍹</span>
            <span className="text-xl font-black text-gray-900 hidden xs:block">
              Summer
              <span className="bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">
                Sips
              </span>
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  id={`nav-${item.href.replace("/", "") || "home"}`}
                  className={`relative px-4 py-2 rounded-xl text-sm font-bold transition-all duration-200 ${
                    isActive
                      ? "bg-orange-50 text-orange-500"
                      : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                  }`}
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

          {/* Mobile Menu Button & Cart Toggle */}
          <div className="flex items-center gap-2 md:hidden">
            {/* Mobile Cart Button (Compact) */}
            <Link
              href="/gio-hang"
              className={`p-2.5 rounded-xl transition-all relative ${
                pathname === "/gio-hang" ? "bg-orange-50 text-orange-500" : "text-gray-500"
              }`}
            >
              <span className="text-xl">🛒</span>
              {totalCount > 0 && (
                <span className="absolute top-1 right-1 w-5 h-5 flex items-center justify-center text-[10px] font-black rounded-full bg-gradient-to-r from-orange-500 to-pink-500 text-white shadow-sm">
                  {totalCount > 99 ? "99+" : totalCount}
                </span>
              )}
            </Link>

            {/* Hamburger Button (Chỉ hiển thị khi menu đóng để tránh nhầm lẫn) */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2.5 rounded-xl text-gray-600 hover:bg-gray-50 transition-all relative z-50 overflow-hidden"
              aria-label="Toggle menu"
            >
              <div className="w-6 h-5 flex flex-col justify-between items-center transition-all duration-300">
                <span className={`w-full h-0.5 bg-current rounded-full transition-all duration-300 ${isMenuOpen ? 'rotate-45 translate-y-[9px]' : ''}`} />
                <span className={`w-full h-0.5 bg-current rounded-full transition-all duration-300 ${isMenuOpen ? 'opacity-0' : ''}`} />
                <span className={`w-full h-0.5 bg-current rounded-full transition-all duration-300 ${isMenuOpen ? '-rotate-45 -translate-y-[9px]' : ''}`} />
              </div>
            </button>
          </div>
        </div>
      </header>


      {/* ================= BACKDROP (NỀN TỐI MỜ) ================= */}
      <div 
        className={`fixed inset-0 bg-black/20 backdrop-blur-sm z-[101] transition-opacity duration-300 md:hidden ${
          isMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsMenuOpen(false)}
      />


      {/* ================= DRAWER (MENU TRƯỢT TỪ PHẢI SANG) ================= */}
      <div 
        className={`fixed top-0 right-0 bottom-0 w-[280px] bg-white z-[102] shadow-2xl transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] md:hidden ${
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Nút X đóng menu */}
        <button
          onClick={() => setIsMenuOpen(false)}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors z-10"
          aria-label="Đóng menu"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Nội dung chính của Drawer */}
        <div className="flex flex-col h-full pt-20 px-6 pb-8">
          <div className="flex flex-col gap-2">
            <span className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-2 px-4">Menu Chính</span>
            
            {navItems.map((item, idx) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center justify-between px-4 py-3.5 rounded-2xl text-base font-bold transition-all duration-300 ${
                    isActive
                      ? "bg-orange-50 text-orange-600 shadow-sm shadow-orange-100"
                      : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                  style={{ 
                    transitionDelay: isMenuOpen ? `${idx * 50}ms` : '0ms',
                    transform: isMenuOpen ? 'translateX(0)' : 'translateX(20px)',
                    opacity: isMenuOpen ? 1 : 0
                  }}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span className="flex items-center gap-3">
                    <span className="text-xl">
                      {item.label === "Trang Chủ" && "🏠"}
                      {item.label === "Đồ Uống" && "🍹"}
                      {item.label === "Giỏ Hàng" && "🛒"}
                      {item.label === "Đơn Hàng" && "📦"}
                    </span>
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

          {/* Mobile Footer Info */}
          <div className="mt-auto pt-8 border-t border-gray-100 space-y-4">
            <div className="p-4 rounded-3xl bg-orange-50/50">
              <p className="text-xs text-orange-600/80 font-bold mb-1">Cần hỗ trợ?</p>
              <p className="text-sm font-black text-gray-900">1900 1234 567</p>
            </div>
            <p className="text-[10px] text-gray-400 text-center font-medium">
              © 2024 SummerSips. Bùng nổ hương vị!
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
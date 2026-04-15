"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "@/context/CartContext";

const navItems = [
  { label: "Trang Chủ", href: "/" },
  { label: "Đồ Uống", href: "/shop" },
  { label: "Giỏ Hàng", href: "/cart" },
  { label: "Đơn Hàng", href: "/orders" },
];

export default function Navbar() {
  const pathname = usePathname();
  const { totalCount } = useCart();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-lg border-b border-gray-100 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link href="/" id="navbar-logo" className="flex items-center gap-2 shrink-0 group">
          <span className="text-2xl">🍹</span>
          <span className="text-xl font-black text-gray-900 hidden sm:block">
            Summer
            <span className="bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">
              Sips
            </span>
          </span>
        </Link>

        {/* Nav Links */}
        <nav className="flex items-center gap-1 sm:gap-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                id={`nav-${item.href.replace("/", "") || "home"}`}
                className={`relative px-3 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  isActive
                    ? "bg-orange-50 text-orange-500"
                    : "text-gray-500 hover:text-gray-800 hover:bg-gray-50"
                }`}
              >
                {item.label === "Giỏ Hàng" ? (
                  <span className="flex items-center gap-1.5">
                    <span>Giỏ Hàng</span>
                    {totalCount > 0 && (
                      <span className="inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 text-xs font-black rounded-full bg-gradient-to-r from-orange-500 to-pink-500 text-white animate-[fadeInDown_0.3s_ease-out]">
                        {totalCount > 99 ? "99+" : totalCount}
                      </span>
                    )}
                  </span>
                ) : (
                  item.label
                )}
                {isActive && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 rounded-full bg-gradient-to-r from-orange-500 to-pink-500" />
                )}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}

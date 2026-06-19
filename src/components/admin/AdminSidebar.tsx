"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { href: "/admin",            label: "Tổng quan",   icon: "📊", exact: true },
  { href: "/admin/orders",     label: "Đơn hàng",    icon: "📦" },
  { href: "/admin/products",   label: "Sản phẩm",    icon: "🧋" },
  { href: "/admin/categories", label: "Danh mục",    icon: "📂" },
  { href: "/admin/coupons",    label: "Coupon",      icon: "🎟️" },
  { href: "/admin/chat",       label: "Chat AI",     icon: "💬" },
];

export function AdminSidebar() {
  const pathname = usePathname();

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname.startsWith(href);

  return (
    <aside
      className="w-60 flex flex-col border-r h-full"
      style={{ background: "var(--bg-card)", borderColor: "var(--border-color)" }}
    >
      {/* Brand */}
      <div className="px-5 py-4 border-b shrink-0" style={{ borderColor: "var(--border-color)" }}>
        <Link href="/admin" className="flex items-center gap-2.5 group">
          <span className="text-2xl group-hover:scale-110 transition-transform">🧋</span>
          <div>
            <p className="font-black text-sm leading-tight" style={{ color: "var(--text-primary)" }}>
              SummerSips
            </p>
            <p className="text-[10px] font-semibold" style={{ color: "var(--text-muted)" }}>
              Bảng quản trị
            </p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5">
        <p className="px-3 pb-2 text-[10px] font-bold uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>
          Quản lý
        </p>
        {NAV_ITEMS.map(({ href, label, icon, exact }) => {
          const active = isActive(href, exact);
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                active
                  ? "bg-orange-500 text-white shadow-sm shadow-orange-200"
                  : "hover:bg-orange-50 dark:hover:bg-orange-500/10"
              }`}
              style={active ? {} : { color: "var(--text-secondary)" }}
            >
              <span className="text-base leading-none">{icon}</span>
              <span>{label}</span>
              {active && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-white/60" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-3 py-4 border-t shrink-0" style={{ borderColor: "var(--border-color)" }}>
        <Link
          href="/"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all hover:bg-gray-100/60 dark:hover:bg-white/5"
          style={{ color: "var(--text-muted)" }}
        >
          <span className="text-base leading-none">🏪</span>
          <span>Xem cửa hàng</span>
        </Link>
      </div>
    </aside>
  );
}

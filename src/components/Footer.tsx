import Link from "next/link";

const navLinks = [
  { label: "Đồ Uống", href: "#drinks" },
  { label: "Tính Năng", href: "#features" },
  { label: "Khuyến Mãi", href: "#promotions" },
  { label: "Đánh Giá", href: "#testimonials" },
];

const socialLinks = [
  {
    name: "Instagram",
    href: "#",
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
      </svg>
    ),
  },
  {
    name: "Twitter",
    href: "#",
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    name: "TikTok",
    href: "#",
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.27 8.27 0 004.84 1.56V6.79a4.85 4.85 0 01-1.07-.1z" />
      </svg>
    ),
  },
];

export default function Footer() {
  return (
    <footer className="bg-gray-950 text-gray-400">
      {/* Main footer content */}
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand column */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-3xl">🍹</span>
              <span className="text-2xl font-black text-white">
                Summer
                <span className="bg-gradient-to-r from-orange-400 to-pink-400 bg-clip-text text-transparent">
                  Sips
                </span>
              </span>
            </div>
            <p className="text-gray-500 leading-relaxed mb-6 max-w-sm">
              Pha chế những thức uống mùa hè tươi mát nhất từ năm 2020. Làm bằng tình yêu, phục vụ lạnh mát.
            </p>
            <div className="flex gap-3">
              {socialLinks.map((s) => (
                <a
                  key={s.name}
                  href={s.href}
                  id={`footer-social-${s.name.toLowerCase()}`}
                  aria-label={s.name}
                  className="w-10 h-10 rounded-xl bg-gray-800 hover:bg-gradient-to-br hover:from-orange-500 hover:to-pink-500 flex items-center justify-center text-gray-400 hover:text-white transition-all duration-300 hover:scale-110"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-white font-bold mb-4">Liên Kết Nhanh</h4>
            <ul className="space-y-3">
              {navLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="hover:text-orange-400 transition-colors hover:translate-x-1 inline-flex items-center gap-1 group"
                  >
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity">›</span>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-bold mb-4">Liên Hệ</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2">
                <span>📍</span>
                <span>Số 5c, Ngách 21 Ngõ 595 Lĩnh Nam
                  Phường Lĩnh Nam, Quận Hoàng Mai, Hà Nộ</span>
              </li>
              <li className="flex items-center gap-2">
                <span>📞</span>
                <a href="tel:+84901234567" className="hover:text-orange-400 transition-colors">
                  0367647419
                </a>
              </li>
              <li className="flex items-center gap-2">
                <span>✉️</span>
                <a href="mailto:summersips@gmail.com" className="hover:text-orange-400 transition-colors">
                  summersips@gmail.com
                </a>
              </li>
              <li className="flex items-center gap-2">
                <span>🕐</span>
                <span>T2–CN: 8:00 – 22:00</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-6xl mx-auto px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-sm text-gray-600">
            © 2026 SummerSips. Tất cả quyền được bảo lưu.
          </p>
          <div className="flex gap-6 text-sm">
            <a href="#" className="hover:text-orange-400 transition-colors">Chính Sách Bảo Mật</a>
            <a href="#" className="hover:text-orange-400 transition-colors">Điều Khoản Dịch Vụ</a>
            <a href="#" className="hover:text-orange-400 transition-colors">Chính Sách Cookie</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

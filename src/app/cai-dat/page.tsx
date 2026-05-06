import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { ProfileSettingsContent } from "@/components/settings/ProfileSettings";

export const metadata: Metadata = {
  title: "Cài Đặt Tài Khoản | SummerSips",
  description: "Quản lý thông tin cá nhân, thông báo và bảo mật tài khoản SummerSips của bạn.",
};

export default function SettingsPage() {
  return (
    <div className="min-h-screen" style={{ background: "var(--bg-secondary)" }}>
      <Navbar />
      <div className="pt-20 pb-16 px-4 sm:px-6">
        {/* Page header */}
        <div className="max-w-3xl mx-auto mb-8">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm mb-4" style={{ color: "var(--text-muted)" }}>
            <Link href="/" className="hover:text-orange-500 transition-colors">Trang chủ</Link>
            <span>/</span>
            <span style={{ color: "var(--text-primary)" }}>Cài đặt</span>
          </nav>

          <h1 className="text-3xl font-black" style={{ color: "var(--text-primary)" }}>
            Cài Đặt Tài Khoản ⚙️
          </h1>
          <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>
            Quản lý thông tin cá nhân và tùy chỉnh trải nghiệm của bạn
          </p>
        </div>

        <ProfileSettingsContent />
      </div>
    </div>
  );
}

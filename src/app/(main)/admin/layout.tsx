import type { Metadata } from "next";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import AdminMobileHeader from "./AdminMobileHeader";

export const metadata: Metadata = {
  title: {
    template: "%s | Admin SummerSips",
    default: "Admin Dashboard | SummerSips",
  },
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-[calc(100vh-64px)]">
      {/* Sidebar — desktop only, sticks below the fixed navbar */}
      <div
        className="hidden lg:block sticky top-16 self-start h-[calc(100vh-64px)] overflow-y-auto shrink-0"
      >
        <AdminSidebar />
      </div>

      {/* Content area */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Mobile top bar with sidebar toggle */}
        <AdminMobileHeader />
        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}

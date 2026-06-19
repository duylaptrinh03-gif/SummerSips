"use client";

import { useState } from "react";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

export default function AdminMobileHeader() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Mobile top bar */}
      <div
        className="lg:hidden flex items-center gap-3 px-4 py-3 border-b sticky top-16 z-30"
        style={{ background: "var(--bg-card)", borderColor: "var(--border-color)" }}
      >
        <button
          onClick={() => setOpen(true)}
          className="p-2 rounded-xl hover:bg-orange-50 transition-colors"
          aria-label="Mở menu"
          style={{ color: "var(--text-secondary)" }}
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M2 4h14M2 9h14M2 14h14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        </button>
        <span className="font-black text-sm" style={{ color: "var(--text-primary)" }}>
          🧋 Admin
        </span>
      </div>

      {/* Mobile drawer overlay */}
      {open && (
        <div className="fixed inset-0 z-[110] lg:hidden">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <div
            className="absolute left-0 top-0 bottom-0 w-60 shadow-2xl overflow-y-auto"
            style={{ background: "var(--bg-card)" }}
          >
            <div className="p-3 flex justify-end border-b" style={{ borderColor: "var(--border-color)" }}>
              <button
                onClick={() => setOpen(false)}
                className="p-2 rounded-xl hover:bg-gray-100/60 transition-colors text-xl leading-none"
                style={{ color: "var(--text-muted)" }}
              >
                ×
              </button>
            </div>
            <AdminSidebar />
          </div>
        </div>
      )}
    </>
  );
}

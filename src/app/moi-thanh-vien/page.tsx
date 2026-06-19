// src/app/moi-thanh-vien/page.tsx
"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import { useToastStore } from "@/store/useToastStore";
import { Mail, Shield, UserPlus } from "lucide-react";

export default function InvitePage() {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("member");
  const [loading, setLoading] = useState(false);
  const addToast = useToastStore((s) => s.addToast);

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      addToast(`Đã gửi lời mời tới ${email} 🎉`, "success");
      setEmail("");
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen" style={{ background: "var(--bg-secondary)" }}>
      <Navbar />
      
      <main className="pt-24 pb-16 px-4 flex justify-center">
        <div className="max-w-xl w-full bg-white dark:bg-gray-900 rounded-3xl p-8 shadow-xl border border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center">
              <UserPlus className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-black">Mời Thành Viên</h1>
              <p className="text-sm text-gray-500">Thêm người vào nhóm để cùng quản lý</p>
            </div>
          </div>

          <form onSubmit={handleInvite} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-bold ml-1">Email người nhận</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 outline-none focus:ring-2 focus:ring-orange-500 transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold ml-1">Vai trò</label>
              <div className="grid grid-cols-2 gap-3">
                {["member", "viewer"].map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRole(r)}
                    className={`flex items-center gap-3 p-4 rounded-2xl border transition-all ${
                      role === r 
                        ? "border-orange-500 bg-orange-50/50 dark:bg-orange-500/10 text-orange-600" 
                        : "border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800"
                    }`}
                  >
                    <Shield className={`w-5 h-5 ${role === r ? "text-orange-500" : "text-gray-400"}`} />
                    <span className="font-bold capitalize">{r}</span>
                  </button>
                ))}
              </div>
            </div>

            <button
              disabled={loading}
              className="w-full py-4 rounded-2xl bg-black text-white font-black hover:bg-gray-800 transition-all shadow-lg flex items-center justify-center gap-2"
            >
              {loading ? (
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                "Gửi lời mời 🚀"
              )}
            </button>
          </form>

          <div className="mt-12">
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Đang chờ chấp nhận</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/50">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700" />
                  <span className="text-sm font-medium">duy@example.com</span>
                </div>
                <span className="text-[10px] font-black uppercase text-gray-400">Member</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

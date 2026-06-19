// src/app/goi-cuoc/page.tsx
"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Check } from "lucide-react";
import { useToastStore } from "@/store/useToastStore";

const PLANS = [
  {
    id: "free",
    name: "Miễn phí",
    price: "0đ",
    description: "Dành cho người mới bắt đầu khám phá",
    features: ["Giao hàng tiêu chuẩn", "Tích điểm cơ bản", "Hỗ trợ qua email"],
    buttonText: "Bắt đầu ngay",
    premium: false,
  },
  {
    id: "pro",
    name: "Pro",
    price: "99.000đ",
    period: "/tháng",
    description: "Dành cho tín đồ sành điệu",
    features: ["Giao hàng ưu tiên", "X2 tích điểm", "Voucher hàng tháng", "Hỗ trợ 24/7"],
    buttonText: "Nâng cấp Pro",
    premium: true,
  },
  {
    id: "premium",
    name: "Premium",
    price: "199.000đ",
    period: "/tháng",
    description: "Trải nghiệm đỉnh cao không giới hạn",
    features: ["Giao hàng hỏa tốc", "X5 tích điểm", "Sản phẩm giới hạn", "Quản lý riêng"],
    buttonText: "Lên Premium",
    premium: false,
  },
];

export default function PricingPage() {
  const addToast = useToastStore((s) => s.addToast);
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);

  const handleUpgrade = async (planId: string) => {
    if (planId === "free") return;

    setLoadingPlan(planId);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        body: JSON.stringify({ planId }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err) {
      addToast("Lỗi kết nối thanh toán", "error");
    } finally {
      setLoadingPlan(null);
    }
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "var(--bg-primary)" }}>
      <Navbar />
      
      <main className="flex-1 pt-24 pb-16 px-4">
        <div className="max-w-6xl mx-auto text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-black mb-4">Chọn Gói Của Bạn 💎</h1>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            Nâng cấp trải nghiệm thưởng thức đồ uống với những đặc quyền dành riêng cho thành viên.
          </p>
        </div>

        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {PLANS.map((plan) => (
            <div
              key={plan.id}
              className={`relative p-8 rounded-3xl border transition-all duration-300 hover:-translate-y-2 flex flex-col ${
                plan.premium 
                  ? "border-orange-500 shadow-2xl shadow-orange-200 scale-105 z-10 bg-white dark:bg-gray-900" 
                  : "border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/50"
              }`}
            >
              {plan.premium && (
                <span className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-orange-500 text-white text-xs font-black rounded-full uppercase tracking-widest">
                  Phổ biến nhất
                </span>
              )}

              <div className="mb-8">
                <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                <div className="flex items-baseline gap-1 mb-2">
                  <span className="text-4xl font-black">{plan.price}</span>
                  {plan.period && <span className="text-gray-500 text-sm">{plan.period}</span>}
                </div>
                <p className="text-sm text-gray-500">{plan.description}</p>
              </div>

              <div className="space-y-4 mb-8 flex-1">
                {plan.features.map((feat) => (
                  <div key={feat} className="flex items-center gap-3 text-sm">
                    <div className="w-5 h-5 rounded-full bg-green-100 text-green-600 flex items-center justify-center shrink-0">
                      <Check className="w-3 h-3" />
                    </div>
                    <span className="text-gray-600 dark:text-gray-400">{feat}</span>
                  </div>
                ))}
              </div>

              <button
                onClick={() => handleUpgrade(plan.id)}
                disabled={loadingPlan === plan.id}
                className={`w-full py-4 rounded-2xl font-black transition-all shadow-lg ${
                  plan.premium
                    ? "bg-gradient-to-r from-orange-500 to-pink-500 text-white hover:shadow-orange-300"
                    : "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50"
                }`}
              >
                {loadingPlan === plan.id ? "Đang xử lý..." : plan.buttonText}
              </button>
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}

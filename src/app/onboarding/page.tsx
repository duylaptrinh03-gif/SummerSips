// src/app/onboarding/page.tsx
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { LazyOnboardingScene } from "@/components/three";

const STEPS = [
  {
    title: "Chào mừng bạn! 👋",
    description: "Chúng tôi rất vui khi được đồng hành cùng bạn trên hành trình khám phá hương vị.",
    icon: "✨",
  },
  {
    title: "Chọn sở thích 🍹",
    description: "Bạn thích vị ngọt ngào của trà sữa hay sự tươi mát của nước ép trái cây?",
    options: ["Trà sữa", "Trà trái cây", "Cà phê", "Sinh tố"],
  },
  {
    title: "Bật thông báo 🔔",
    description: "Đừng bỏ lỡ những ưu đãi đặc biệt và trạng thái đơn hàng của bạn.",
    action: "Bật thông báo ngay",
  },
  {
    title: "Sẵn sàng chưa? 🚀",
    description: "Tài khoản của bạn đã được thiết lập xong. Cùng bắt đầu đặt nước thôi nào!",
    action: "Vào Dashboard",
  },
];

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const router = useRouter();

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep((s) => s + 1);
    } else {
      router.push("/dashboard");
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#0f0f13] text-white overflow-hidden">
      {/* Left side: 3D Visualization */}
      <div className="w-full md:w-1/2 h-[40vh] md:h-screen relative">
        <LazyOnboardingScene step={currentStep} />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#0f0f13] md:bg-gradient-to-r" />
      </div>

      {/* Right side: Content */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8 md:p-16">
        <div className="max-w-md w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4 }}
              className="space-y-6"
            >
              <div className="space-y-2">
                <span className="text-sm font-black text-orange-500 uppercase tracking-widest">
                  Bước {currentStep + 1} / {STEPS.length}
                </span>
                <h1 className="text-4xl font-black leading-tight">
                  {STEPS[currentStep].title}
                </h1>
                <p className="text-gray-400 text-lg leading-relaxed">
                  {STEPS[currentStep].description}
                </p>
              </div>

              {STEPS[currentStep].options && (
                <div className="grid grid-cols-2 gap-3 py-4">
                  {STEPS[currentStep].options.map((opt) => (
                    <button
                      key={opt}
                      className="p-4 rounded-2xl border border-gray-800 hover:border-orange-500 hover:bg-orange-500/10 transition-all text-sm font-bold"
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              )}

              <button
                onClick={handleNext}
                className="w-full py-4 rounded-2xl font-black text-lg shadow-2xl transition-all hover:-translate-y-1 active:translate-y-0"
                style={{
                  background: "linear-gradient(135deg, #f97316, #ec4899)",
                  boxShadow: "0 10px 40px rgba(249,115,22,0.3)",
                }}
              >
                {STEPS[currentStep].action || "Tiếp tục"}
              </button>
            </motion.div>
          </AnimatePresence>

          {/* Progress dots */}
          <div className="flex gap-2 mt-12">
            {STEPS.map((_, i) => (
              <div
                key={i}
                className={`h-1.5 rounded-full transition-all duration-500 ${
                  i === currentStep ? "w-8 bg-orange-500" : "w-2 bg-gray-800"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

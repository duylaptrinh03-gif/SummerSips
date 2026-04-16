"use client";

import { motion } from "framer-motion";

export function Loader() {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-4">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        className="w-12 h-12 border-4 border-orange-200 border-t-orange-500 rounded-full"
      />
      <p className="text-gray-400 font-medium animate-pulse">Đang tải hương vị...</p>
    </div>
  );
}

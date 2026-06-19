import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Thực Đơn",
  description:
    "Khám phá thực đơn đa dạng của SummerSips — trà sữa, cà phê, trà trái cây, sinh tố và nước ép. Tươi ngon, tự nhiên, đặt hàng giao tận nơi.",
  keywords: ["thực đơn", "trà sữa", "cà phê", "sinh tố", "nước ép", "SummerSips"],
  openGraph: {
    title: "Thực Đơn | SummerSips",
    description: "Khám phá thực đơn đa dạng của SummerSips.",
    type: "website",
  },
};

export default function ThucDonLayout({ children }: { children: React.ReactNode }) {
  return children;
}

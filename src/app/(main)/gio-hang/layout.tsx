import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Giỏ Hàng",
  description: "Xem lại giỏ hàng, áp mã giảm giá và hoàn tất đặt hàng tại SummerSips.",
  openGraph: {
    title: "Giỏ Hàng | SummerSips",
    description: "Xem lại giỏ hàng và hoàn tất đặt hàng tại SummerSips.",
    type: "website",
  },
};

export default function GioHangLayout({ children }: { children: React.ReactNode }) {
  return children;
}

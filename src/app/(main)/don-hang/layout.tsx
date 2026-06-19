import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Lịch Sử Đơn Hàng",
  description: "Theo dõi trạng thái và lịch sử đơn hàng của bạn tại SummerSips.",
  openGraph: {
    title: "Lịch Sử Đơn Hàng | SummerSips",
    description: "Theo dõi trạng thái và lịch sử đơn hàng của bạn tại SummerSips.",
    type: "website",
  },
};

export default function DonHangLayout({ children }: { children: React.ReactNode }) {
  return children;
}

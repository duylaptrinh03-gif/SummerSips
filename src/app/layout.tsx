import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { ToastProvider } from "@/components/providers/ToastProvider";
import { BackToTop } from "@/components/ui/BackToTop";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "SummerSips — Thức Uống Mùa Hè",
  description:
    "Khám phá những thức uống thủ công bùng nổ hương vị nhiệt đới. Tươi ngon, tự nhiên và giao hàng tận nơi. Đặt hàng ngay hôm nay!",
  keywords: ["đồ uống mùa hè", "trà chanh", "sinh tố", "nước ép", "đặt hàng online"],
  openGraph: {
    title: "SummerSips — Thức Uống Mùa Hè",
    description: "Khám phá những thức uống thủ công bùng nổ hương vị nhiệt đới.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col" style={{ background: "var(--bg-primary)", color: "var(--text-primary)" }}>
        <ThemeProvider>
            <ToastProvider>
              {children}
              <BackToTop />
            </ToastProvider>
          </ThemeProvider>
      </body>
    </html>
  );
}

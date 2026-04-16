import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
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
    <html
      lang="vi"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
      </body>
    </html>
  );
}

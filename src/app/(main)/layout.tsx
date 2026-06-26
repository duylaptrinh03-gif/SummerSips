import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ErrorBoundary } from "@/components/common/ErrorBoundary";

export const metadata: Metadata = {
  title: {
    template: "%s | SummerSips",
    default: "SummerSips — Thức Uống Mùa Hè",
  },
};

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex-1 pt-16">
        <ErrorBoundary>{children}</ErrorBoundary>
      </div>
      <Footer />
    </div>
  );
}

import type { Metadata } from "next";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import DashboardClient from "./DashboardClient";

export const metadata: Metadata = {
  title: "Dashboard | SummerSips",
  description: "Tổng quan tài khoản, thống kê đơn hàng và thao tác nhanh.",
};

export default async function DashboardPage() {
  const session = await auth();

  if (!session) {
    redirect("/dang-nhap");
  }

  return <DashboardClient sessionName={session.user?.name} />;
}

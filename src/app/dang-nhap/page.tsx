import type { Metadata } from "next";
import { LoginForm, AuthLayout } from "@/components/auth/AuthForms";

export const metadata: Metadata = {
  title: "Đăng Nhập | SummerSips",
  description: "Đăng nhập vào SummerSips để theo dõi đơn hàng và nhận ưu đãi độc quyền.",
};

export default function LoginPage() {
  return (
    <AuthLayout
      title="Chào Mừng Trở Lại! 👋"
      subtitle="Đăng nhập để xem đơn hàng và ưu đãi của bạn"
    >
      <LoginForm />
    </AuthLayout>
  );
}

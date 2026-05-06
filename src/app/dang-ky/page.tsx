import type { Metadata } from "next";
import { RegisterForm, AuthLayout } from "@/components/auth/AuthForms";

export const metadata: Metadata = {
  title: "Đăng Ký | SummerSips",
  description: "Tạo tài khoản SummerSips miễn phí và nhận ngay ưu đãi chào mừng.",
};

export default function RegisterPage() {
  return (
    <AuthLayout
      title="Tạo Tài Khoản Mới 🎉"
      subtitle="Miễn phí • Không cần thẻ tín dụng"
    >
      <RegisterForm />
    </AuthLayout>
  );
}

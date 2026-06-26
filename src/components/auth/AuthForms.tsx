"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff } from "lucide-react";
import { LazyAuthParticles } from "@/components/three";
import { useToastStore } from "@/store/useToastStore";
import { authService } from "@/services/authService";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

// ── Types ─────────────────────────────────────────────────────────────────────
interface FormState {
  email: string;
  password: string;
}

// ── Shared input style ────────────────────────────────────────────────────────
function AuthInput({
  id,
  label,
  type,
  value,
  onChange,
  placeholder,
  disabled,
}: {
  id: string;
  label: string;
  type: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  disabled?: boolean;
}) {
  const isPassword = type === "password";
  const [showPassword, setShowPassword] = useState(false);
  const inputType = isPassword ? (showPassword ? "text" : "password") : type;

  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type={inputType}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          autoComplete={isPassword ? "current-password" : "email"}
          className="w-full px-4 py-3 rounded-2xl border text-sm outline-none transition-all focus:ring-2 focus:ring-orange-300 focus:border-orange-400 disabled:opacity-50"
          style={{
            background: "var(--bg-secondary)",
            borderColor: "var(--border-color)",
            color: "var(--text-primary)",
            paddingRight: isPassword ? "2.75rem" : undefined,
          }}
        />
        {isPassword && (
          <button
            type="button"
            tabIndex={-1}
            onClick={() => setShowPassword((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-lg transition-colors hover:bg-black/10"
            style={{ color: "var(--text-muted)" }}
          >
            {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
          </button>
        )}
      </div>
    </div>
  );
}

// ── Social button ─────────────────────────────────────────────────────────────
function SocialButton({
  icon,
  label,
  onClick,
  disabled,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="flex items-center justify-center gap-3 w-full px-4 py-3 rounded-2xl border text-sm font-semibold transition-all hover:bg-gray-50 active:scale-95 disabled:opacity-50"
      style={{ borderColor: "var(--border-color)", color: "var(--text-primary)", background: "var(--bg-card)" }}
    >
      {icon}
      {label}
    </button>
  );
}

// ── Google icon ───────────────────────────────────────────────────────────────
const GoogleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
  </svg>
);

// ── GitHub icon ───────────────────────────────────────────────────────────────
const GitHubIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
  </svg>
);


// ── Login Form ────────────────────────────────────────────────────────────────
export function LoginForm() {
  const addToast = useToastStore((s) => s.addToast);
  const [isPending, startTransition] = useTransition();
  const [form, setForm] = useState<FormState>({ email: "", password: "" });
  const [error, setError] = useState("");
  const router = useRouter();

  const set = (field: keyof FormState) => (val: string) => setForm((f) => ({ ...f, [field]: val }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!form.email.trim() || !form.password.trim()) {
      setError("Vui lòng nhập đầy đủ thông tin.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setError("Email không hợp lệ.");
      return;
    }
    startTransition(async () => {
      try {
        const result = await signIn("credentials", {
          email: form.email,
          password: form.password,
          redirect: false,
        });

        if (result?.error) {
          setError("Email hoặc mật khẩu không chính xác.");
          addToast("Đăng nhập thất bại!", "error");
        } else {
          addToast("Đăng nhập thành công! 🎉", "success");
          router.push("/");
        }
      } catch {
        addToast("Đã có lỗi xảy ra. Vui lòng thử lại!", "error");
      }
    });
  };


  const handleSocial = async (provider: "google" | "github") => {
    try {
      await signIn(provider, { redirectTo: "/dashboard" });
    } catch (err) {
      addToast(`Lỗi đăng nhập ${provider}`, "error");
    }
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="space-y-5"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      {/* Social login */}
      <div className="grid grid-cols-2 gap-3">
        <SocialButton
          icon={<GoogleIcon />}
          label="Google"
          onClick={() => handleSocial("google")}
          disabled={isPending}
        />
        <SocialButton
          icon={<GitHubIcon />}
          label="GitHub"
          onClick={() => handleSocial("github")}
          disabled={isPending}
        />
      </div>

      {/* Divider */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-px" style={{ background: "var(--border-color)" }} />
        <span className="text-xs font-medium" style={{ color: "var(--text-muted)" }}>hoặc dùng email</span>
        <div className="flex-1 h-px" style={{ background: "var(--border-color)" }} />
      </div>

      {/* Fields */}
      <AuthInput id="login-email" label="Email" type="email" value={form.email} onChange={set("email")} placeholder="ban@email.com" disabled={isPending} />
      <AuthInput id="login-password" label="Mật khẩu" type="password" value={form.password} onChange={set("password")} placeholder="••••••••" disabled={isPending} />

      {/* Forgot */}
      <div className="flex justify-end">
        <Link href="/quen-mat-khau" className="text-xs font-semibold text-orange-500 hover:text-orange-600">
          Quên mật khẩu?
        </Link>
      </div>

      {/* Error */}
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="text-sm text-red-500 font-medium px-3 py-2 bg-red-50 rounded-xl border border-red-100"
          >
            ⚠️ {error}
          </motion.p>
        )}
      </AnimatePresence>

      {/* Submit */}
      <button
        type="submit"
        id="btn-login"
        disabled={isPending}
        className="w-full py-3.5 rounded-2xl font-black text-white transition-all hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
        style={{
          background: "linear-gradient(135deg, #f97316, #ec4899)",
          boxShadow: "0 8px 24px rgba(249,115,22,0.35)",
        }}
      >
        {isPending ? (
          <span className="flex items-center justify-center gap-2">
            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Đang đăng nhập...
          </span>
        ) : (
          "Đăng Nhập 🚀"
        )}
      </button>

      {/* Switch to register */}
      <p className="text-center text-sm" style={{ color: "var(--text-secondary)" }}>
        Chưa có tài khoản?{" "}
        <Link href="/dang-ky" className="font-bold text-orange-500 hover:text-orange-600">
          Đăng ký miễn phí
        </Link>
      </p>
    </motion.form>
  );
}

// ── Register Form ─────────────────────────────────────────────────────────────
export function RegisterForm() {
  const addToast = useToastStore((s) => s.addToast);
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [error, setError] = useState("");

  const router = useRouter();

  const set = (field: keyof typeof form) => (val: string) => setForm((f) => ({ ...f, [field]: val }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!form.name.trim() || !form.email.trim() || !form.password.trim()) {
      setError("Vui lòng điền đầy đủ thông tin.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setError("Email không hợp lệ.");
      return;
    }
    if (form.password.length < 8) {
      setError("Mật khẩu phải ít nhất 8 ký tự.");
      return;
    }
    if (form.password !== form.confirm) {
      setError("Mật khẩu xác nhận không khớp.");
      return;
    }

    setIsLoading(true);
    try {
      // Chỉ gửi name/email/password — backend từ chối field lạ (forbidNonWhitelisted)
      await authService.register({ name: form.name, email: form.email, password: form.password });
      addToast("Đăng ký thành công! Vui lòng đăng nhập.", "success");
      router.push("/dang-nhap");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Đăng ký không thành công!";
      setError(message);
      addToast(message, "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocial = async (provider: "google" | "github") => {
    try {
      await signIn(provider, { redirectTo: "/dashboard" });
    } catch (err) {
      addToast(`Lỗi đăng nhập ${provider}`, "error");
    }
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="space-y-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      {/* Social */}
      <div className="grid grid-cols-2 gap-3">
        <SocialButton icon={<GoogleIcon />} label="Google" onClick={() => handleSocial("google")} disabled={isLoading} />
        <SocialButton icon={<GitHubIcon />} label="GitHub" onClick={() => handleSocial("github")} disabled={isLoading} />
      </div>

      <div className="flex items-center gap-3">
        <div className="flex-1 h-px" style={{ background: "var(--border-color)" }} />
        <span className="text-xs font-medium" style={{ color: "var(--text-muted)" }}>hoặc dùng email</span>
        <div className="flex-1 h-px" style={{ background: "var(--border-color)" }} />
      </div>

      {/* Fields */}
      <AuthInput id="reg-name" label="Tên của bạn" type="text" value={form.name} onChange={set("name")} placeholder="Nguyễn Văn A" disabled={isLoading} />
      <AuthInput id="reg-email" label="Email" type="email" value={form.email} onChange={set("email")} placeholder="ban@email.com" disabled={isLoading} />
      <AuthInput id="reg-password" label="Mật khẩu" type="password" value={form.password} onChange={set("password")} placeholder="Ít nhất 8 ký tự" disabled={isLoading} />
      <AuthInput id="reg-confirm" label="Xác nhận mật khẩu" type="password" value={form.confirm} onChange={set("confirm")} placeholder="Nhập lại mật khẩu" disabled={isLoading} />

      {/* Password strength */}
      {form.password && (
        <div className="space-y-1">
          <div className="flex gap-1">
            {[8, 12, 16].map((threshold) => (
              <div
                key={threshold}
                className="flex-1 h-1 rounded-full transition-colors duration-300"
                style={{
                  background:
                    form.password.length >= threshold
                      ? "linear-gradient(90deg, #f97316, #ec4899)"
                      : "var(--border-color)",
                }}
              />
            ))}
          </div>
          <p className="text-xs" style={{ color: "var(--text-muted)" }}>
            {form.password.length < 8
              ? "Quá ngắn"
              : form.password.length < 12
                ? "Chấp nhận được"
                : "Mạnh 💪"}
          </p>
        </div>
      )}

      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="text-sm text-red-500 font-medium px-3 py-2 bg-red-50 rounded-xl border border-red-100"
          >
            ⚠️ {error}
          </motion.p>
        )}
      </AnimatePresence>

      <button
        type="submit"
        id="btn-register"
        disabled={isLoading}
        className="w-full py-3.5 rounded-2xl font-black text-white transition-all hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 shadow-lg"
        style={{
          background: "linear-gradient(135deg, #f97316, #ec4899)",
          boxShadow: "0 8px 24px rgba(249,115,22,0.35)",
        }}
      >
        {isLoading ? (
          <span className="flex items-center justify-center gap-2">
            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Đang tạo tài khoản...
          </span>
        ) : (
          "Tạo Tài Khoản 🎉"
        )}
      </button>

      <p className="text-center text-sm" style={{ color: "var(--text-secondary)" }}>
        Đã có tài khoản?{" "}
        <Link href="/dang-nhap" className="font-bold text-orange-500 hover:text-orange-600">
          Đăng nhập ngay
        </Link>
      </p>

      <p className="text-center text-xs" style={{ color: "var(--text-muted)" }}>
        Bằng cách đăng ký, bạn đồng ý với{" "}
        <Link href="/dieu-khoan" className="underline hover:text-orange-500">Điều khoản dịch vụ</Link>{" "}
        của chúng tôi.
      </p>
    </motion.form>
  );
}

// ── Shared auth page layout shell ─────────────────────────────────────────────
export function AuthLayout({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
      style={{ background: "var(--bg-secondary)" }}
    >
      {/* Three.js floating particles background */}
      <div className="absolute inset-0 motion-safe:block motion-reduce:hidden">
        <LazyAuthParticles />
      </div>

      {/* Gradient blobs */}
      <div className="absolute top-[-20%] right-[-10%] w-96 h-96 rounded-full bg-gradient-to-br from-orange-300/20 to-pink-300/20 blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-20%] left-[-10%] w-96 h-96 rounded-full bg-gradient-to-br from-yellow-300/20 to-orange-300/20 blur-3xl pointer-events-none" />

      {/* Card */}
      <motion.div
        className="relative z-10 w-full max-w-md"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        <div
          className="rounded-3xl p-8 border shadow-2xl"
          style={{
            background: "var(--bg-card)",
            borderColor: "var(--border-color)",
            boxShadow: "0 24px 80px rgba(0,0,0,0.12), 0 0 0 1px rgba(249,115,22,0.05)",
          }}
        >
          {/* Logo */}
          <div className="text-center mb-8">
            <Link href="/" className="inline-flex items-center gap-2 mb-4 group">
              <span className="text-3xl group-hover:rotate-12 transition-transform duration-300">🍹</span>
              <span className="text-xl font-black" style={{ color: "var(--text-primary)" }}>
                Summer<span className="bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">Sips</span>
              </span>
            </Link>
            <h1 className="text-2xl font-black mb-1" style={{ color: "var(--text-primary)" }}>
              {title}
            </h1>
            <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
              {subtitle}
            </p>
          </div>

          {children}
        </div>
      </motion.div>
    </div>
  );
}

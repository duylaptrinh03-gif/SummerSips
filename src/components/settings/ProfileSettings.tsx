"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { useToastStore } from "@/store/useToastStore";
import { useThemeStore } from "@/store/useThemeStore";
import { useSession } from "next-auth/react";
import { userService } from "@/services/userService";
import { HttpError } from "@/lib/axiosInstance";

// ── Types ─────────────────────────────────────────────────────────────────────
interface UserProfile {
  name: string;
  email: string;
  phone: string;
  defaultAddress: string;
  avatar: string;
  notifications: {
    orderUpdates: boolean;
    promotions: boolean;
    newsletter: boolean;
  };
  theme: "light" | "dark" | "system";
}

// ── Section wrapper ───────────────────────────────────────────────────────────
function SettingsSection({ title, description, children }: { title: string; description?: string; children: React.ReactNode }) {
  return (
    <div
      className="rounded-3xl border p-6 sm:p-8"
      style={{ background: "var(--bg-card)", borderColor: "var(--border-color)" }}
    >
      <div className="mb-6">
        <h2 className="text-lg font-black" style={{ color: "var(--text-primary)" }}>{title}</h2>
        {description && (
          <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>{description}</p>
        )}
      </div>
      {children}
    </div>
  );
}

// ── Toggle ────────────────────────────────────────────────────────────────────
function Toggle({ checked, onChange, id }: { checked: boolean; onChange: (v: boolean) => void; id: string }) {
  return (
    <button
      type="button"
      id={id}
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 ${
        checked ? "bg-gradient-to-r from-orange-500 to-pink-500" : "bg-gray-200 dark:bg-gray-700"
      }`}
    >
      <span
        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
          checked ? "translate-x-5" : "translate-x-0"
        }`}
      />
    </button>
  );
}

// ── Field row ─────────────────────────────────────────────────────────────────
function FieldRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 py-3 border-b last:border-b-0" style={{ borderColor: "var(--border-light)" }}>
      <label className="text-sm font-semibold sm:w-40 shrink-0" style={{ color: "var(--text-secondary)" }}>
        {label}
      </label>
      <div className="flex-1">{children}</div>
    </div>
  );
}

function TextInput({ value, onChange, placeholder, disabled, id }: { value: string; onChange: (v: string) => void; placeholder?: string; disabled?: boolean; id: string }) {
  return (
    <input
      id={id}
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      disabled={disabled}
      className="w-full px-4 py-2.5 rounded-xl border text-sm outline-none transition-all focus:ring-2 focus:ring-orange-300 focus:border-orange-400 disabled:opacity-50"
      style={{ background: "var(--bg-secondary)", borderColor: "var(--border-color)", color: "var(--text-primary)" }}
    />
  );
}

// ── Avatar selector ───────────────────────────────────────────────────────────
const AVATAR_EMOJIS = ["👤", "🧑‍🍳", "👩", "🧑", "👨", "🧑‍💻", "👩‍💻", "🦊", "🐼", "🌸"];

function AvatarSelector({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex flex-wrap gap-3">
      {AVATAR_EMOJIS.map((emoji) => (
        <button
          key={emoji}
          type="button"
          onClick={() => onChange(emoji)}
          className={`w-12 h-12 rounded-2xl text-2xl flex items-center justify-center transition-all border-2 hover:scale-110 ${
            value === emoji ? "border-orange-400 bg-orange-50 scale-110 shadow-md" : "border-transparent bg-gray-100"
          }`}
          style={value !== emoji ? { borderColor: "var(--border-color)", background: "var(--bg-secondary)" } : {}}
          aria-label={`Chọn avatar ${emoji}`}
        >
          {emoji}
        </button>
      ))}
    </div>
  );
}

// ── Danger zone ───────────────────────────────────────────────────────────────
function DangerZone() {
  const [confirm, setConfirm] = useState(false);
  const addToast = useToastStore((s) => s.addToast);

  return (
    <div
      className="rounded-3xl border-2 border-red-200 p-6 sm:p-8"
      style={{ background: "var(--bg-card)" }}
    >
      <div className="mb-6">
        <h2 className="text-lg font-black text-red-600">⚠️ Vùng Nguy Hiểm</h2>
        <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>
          Các hành động không thể hoàn tác. Hãy cẩn thận.
        </p>
      </div>

      <div className="space-y-4">
        {/* Export data */}
        <div className="flex items-center justify-between p-4 rounded-2xl" style={{ background: "var(--bg-secondary)" }}>
          <div>
            <p className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>Tải về dữ liệu của bạn</p>
            <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>Xuất lịch sử đơn hàng và thông tin tài khoản</p>
          </div>
          <button
            type="button"
            onClick={() => addToast("📦 Xuất dữ liệu — chưa tích hợp", "info")}
            className="px-4 py-2 rounded-xl text-sm font-bold border transition-colors hover:bg-gray-50"
            style={{ borderColor: "var(--border-color)", color: "var(--text-secondary)" }}
          >
            Xuất JSON
          </button>
        </div>

        {/* Delete account */}
        <div className="flex items-center justify-between p-4 rounded-2xl bg-red-50">
          <div>
            <p className="text-sm font-bold text-red-700">Xóa tài khoản</p>
            <p className="text-xs mt-0.5 text-red-500">Xóa vĩnh viễn toàn bộ dữ liệu</p>
          </div>
          {!confirm ? (
            <button
              type="button"
              onClick={() => setConfirm(true)}
              className="px-4 py-2 rounded-xl text-sm font-bold bg-red-100 text-red-600 hover:bg-red-200 transition-colors"
            >
              Xóa
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => addToast("🗑️ Xóa tài khoản — chưa tích hợp", "error")}
                className="px-4 py-2 rounded-xl text-sm font-bold bg-red-500 text-white hover:bg-red-600 transition-colors"
              >
                Xác nhận
              </button>
              <button
                type="button"
                onClick={() => setConfirm(false)}
                className="px-4 py-2 rounded-xl text-sm font-bold bg-white text-gray-600 border border-gray-200 hover:bg-gray-50 transition-colors"
              >
                Hủy
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Theme selector ────────────────────────────────────────────────────────────
function ThemeSelector({ value, onChange }: { value: "light" | "dark"; onChange: (v: "light" | "dark") => void }) {
  return (
    <div className="flex gap-3">
      {(["light", "dark"] as const).map((t) => (
        <button
          key={t}
          type="button"
          onClick={() => onChange(t)}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 text-sm font-bold transition-all ${
            value === t ? "border-orange-400 shadow-sm" : ""
          }`}
          style={{
            background: value === t ? "var(--bg-secondary)" : "transparent",
            borderColor: value === t ? "#f97316" : "var(--border-color)",
            color: "var(--text-primary)",
          }}
        >
          {t === "light" ? "☀️ Sáng" : "🌙 Tối"}
        </button>
      ))}
    </div>
  );
}

// ── Main settings page content ────────────────────────────────────────────────
export function ProfileSettingsContent() {
  const { data: session, update } = useSession();
  const addToast = useToastStore((s) => s.addToast);
  const { theme: storeTheme, setTheme } = useThemeStore();
  const [isSaving, setIsSaving] = useState(false);
  const [profile, setProfile] = useState<UserProfile>({
    name: "",
    email: "",
    phone: "",
    defaultAddress: "",
    avatar: "🧑",
    notifications: {
      orderUpdates: true,
      promotions: true,
      newsletter: false,
    },
    theme: storeTheme,
  });

  // Tải profile từ API khi component mount
  useEffect(() => {
    if (!session?.user) return;
    userService.getMe()
      .then((res) => {
        if (res?.data) {
          setProfile((p) => ({
            ...p,
            name: res.data.name || session.user.name || "",
            email: res.data.email || session.user.email || "",
            phone: res.data.phone || p.phone,
            defaultAddress: res.data.defaultAddress || p.defaultAddress,
            avatar: res.data.avatar || p.avatar,
            notifications: res.data.notifications
              ? { ...p.notifications, ...res.data.notifications }
              : p.notifications,
          }));
        }
      })
      .catch(() => {
        setProfile((p) => ({
          ...p,
          name: session.user.name || "",
          email: session.user.email || "",
        }));
      });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session?.user?.id]);

  const set = <K extends keyof UserProfile>(key: K) => (val: UserProfile[K]) =>
    setProfile((p) => ({ ...p, [key]: val }));

  const setNotif = (key: keyof UserProfile["notifications"]) => (val: boolean) =>
    setProfile((p) => ({ ...p, notifications: { ...p.notifications, [key]: val } }));

  // Thay đổi theme ngay lập tức, không cần nhấn lưu
  const handleThemeChange = useCallback((t: "light" | "dark") => {
    setTheme(t);
    setProfile((p) => ({ ...p, theme: t }));
  }, [setTheme]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await userService.updateMe({
        name: profile.name,
        phone: profile.phone,
        defaultAddress: profile.defaultAddress,
        avatar: profile.avatar,
        notifications: profile.notifications,
      });
      await update({ name: profile.name });
      addToast("Đã lưu thông tin thành công!", "success");
    } catch (err) {
      const message = err instanceof HttpError ? err.message : "Không thể lưu thông tin. Vui lòng thử lại!";
      addToast(message, "error");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Profile info */}
      <SettingsSection title="Thông Tin Cá Nhân" description="Cập nhật thông tin hiển thị và liên hệ">
        {/* Avatar */}
        <div className="mb-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-100 to-pink-100 flex items-center justify-center text-4xl border-2 border-orange-200">
              {profile.avatar}
            </div>
            <div>
              <p className="font-bold text-sm" style={{ color: "var(--text-primary)" }}>Avatar</p>
              <p className="text-xs" style={{ color: "var(--text-muted)" }}>Chọn emoji đại diện</p>
            </div>
          </div>
          <AvatarSelector value={profile.avatar} onChange={set("avatar")} />
        </div>

        <FieldRow label="Họ tên">
          <TextInput id="profile-name" value={profile.name} onChange={set("name")} placeholder="Họ và tên" />
        </FieldRow>
        <FieldRow label="Email">
          <TextInput id="profile-email" value={profile.email} onChange={set("email")} placeholder="email@example.com" disabled />
          <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>Liên hệ hỗ trợ để đổi email</p>
        </FieldRow>
        <FieldRow label="Số điện thoại">
          <TextInput id="profile-phone" value={profile.phone} onChange={set("phone")} placeholder="09xx xxx xxx" />
        </FieldRow>
        <FieldRow label="Địa chỉ mặc định">
          <TextInput id="profile-address" value={profile.defaultAddress} onChange={set("defaultAddress")} placeholder="Số nhà, đường, quận, thành phố" />
        </FieldRow>
      </SettingsSection>

      {/* Theme */}
      <SettingsSection title="Giao Diện" description="Thay đổi có hiệu lực ngay lập tức, không cần lưu">
        <FieldRow label="Chủ đề màu sắc">
          <ThemeSelector value={profile.theme === "system" ? "light" : profile.theme} onChange={handleThemeChange} />
        </FieldRow>
      </SettingsSection>

      {/* Notifications */}
      <SettingsSection title="Thông Báo" description="Chọn những thông báo bạn muốn nhận">
        <FieldRow label="Cập nhật đơn hàng">
          <Toggle id="notif-orders" checked={profile.notifications.orderUpdates} onChange={setNotif("orderUpdates")} />
        </FieldRow>
        <FieldRow label="Khuyến mãi & ưu đãi">
          <Toggle id="notif-promos" checked={profile.notifications.promotions} onChange={setNotif("promotions")} />
        </FieldRow>
        <FieldRow label="Bản tin hàng tuần">
          <Toggle id="notif-newsletter" checked={profile.notifications.newsletter} onChange={setNotif("newsletter")} />
        </FieldRow>
      </SettingsSection>

      {/* Save button */}
      <motion.button
        type="button"
        onClick={handleSave}
        disabled={isSaving}
        className="w-full py-4 rounded-2xl font-black text-white transition-all hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-60 shadow-lg"
        style={{
          background: "linear-gradient(135deg, #f97316, #ec4899)",
          boxShadow: "0 8px 24px rgba(249,115,22,0.35)",
        }}
        whileTap={{ scale: 0.98 }}
      >
        {isSaving ? (
          <span className="flex items-center justify-center gap-2">
            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Đang lưu...
          </span>
        ) : (
          "💾 Lưu Thay Đổi"
        )}
      </motion.button>

      {/* Danger zone */}
      <DangerZone />
    </div>
  );
}

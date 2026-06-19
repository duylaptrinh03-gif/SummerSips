// src/auth.ts
import NextAuth from "next-auth";
import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import GitHub from "next-auth/providers/github";

// ── Augment next-auth types để thêm accessToken vào session ────────────────
declare module "next-auth" {
  interface Session {
    accessToken?: string;
    user: {
      id: string;
      email: string;
      name: string;
      image?: string | null;
      role?: string;
    };
  }

  interface User {
    id: string;
    email: string;
    name: string;
    image?: string | null;
    role?: string;
    accessToken?: string;
  }
}

declare module "@auth/core/jwt" {
  interface JWT {
    accessToken?: string;
    userId?: string;
    role?: string;
  }
}

// ── Auth.js v5 config ──────────────────────────────────────────────────────
const config: NextAuthConfig = {
  providers: [
    // ── 1. Credentials (Email + Password) — gọi backend NestJS ──────────
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Mật khẩu", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        try {
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                email: credentials.email,
                password: credentials.password,
              }),
              cache: "no-store",
            }
          );

          if (!res.ok) {
            const errBody = await res.text().catch(() => "");
            console.error("[auth] login failed:", res.status, errBody);
            return null;
          }

          // Backend wrap qua TransformInterceptor: { statusCode, data: { accessToken, user }, totalResult }
          const json = (await res.json()) as {
            statusCode: number;
            data: {
              accessToken?: string;
              user?: {
                id: string;
                email: string;
                name?: string;
                role?: string;
              };
            };
          };

          console.log("[auth] login response:", JSON.stringify(json));
          if (!json.data?.accessToken || !json.data?.user) return null;

          const userData = json.data.user;
          const userId = userData.id ?? "";
          const userEmail = userData.email ?? String(credentials.email);
          const userName = userData.name ?? userEmail;
          const userRole = userData.role ?? "user";
          const accessToken = json.data.accessToken;

          return {
            id: userId,
            email: userEmail,
            name: userName,
            role: userRole,
            accessToken,
          };
        } catch (e) {
          console.error("[auth] authorize exception:", e);
          return null;
        }
      },
    }),

    // ── 2. Google OAuth ───────────────────────────────────────────────────
    // Tự động đọc AUTH_GOOGLE_ID và AUTH_GOOGLE_SECRET từ env
    Google,

    // ── 3. GitHub OAuth ───────────────────────────────────────────────────
    // Tự động đọc AUTH_GITHUB_ID và AUTH_GITHUB_SECRET từ env
    GitHub,
  ],

  // ── Session strategy: JWT (không cần DB phía frontend) ─────────────────
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  // ── JWT callbacks ────────────────────────────────────────────────────────
  callbacks: {
    async jwt({ token, user, account }) {
      // Lần đầu đăng nhập: lưu thông tin từ user/account vào token
      if (user) {
        token.userId = user.id;
        token.role = user.role;
        token.accessToken = user.accessToken;
        token.name = user.name;
        token.email = user.email;
      }
      // OAuth providers (Google, GitHub): dùng sub làm userId
      if (account && account.provider !== "credentials") {
        token.userId = token.sub;
        token.accessToken = account.access_token;
      }
      return token;
    },

    async session({ session, token }) {
      // Expose token data ra client session
      session.accessToken = token.accessToken as string | undefined;
      session.user.id = (token.userId ?? token.sub ?? "") as string;
      session.user.role = token.role as string | undefined;
      if (token.name) session.user.name = token.name as string;
      if (token.email) session.user.email = token.email as string;
      return session;
    },
  },

  // ── Custom pages (mapping sang routes tiếng Việt) ──────────────────────
  pages: {
    signIn: "/dang-nhap",
    error: "/dang-nhap", // hiển thị lỗi trên trang login
    newUser: "/onboarding", // redirect sau khi đăng ký lần đầu
  },

  // ── Security ──────────────────────────────────────────────────────────────
  // AUTH_SECRET được đọc tự động từ env
  trustHost: true,
};

export const { handlers, auth, signIn, signOut } = NextAuth(config);

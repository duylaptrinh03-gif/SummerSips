// src/middleware.ts
import { auth } from "@/auth";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// ── Simple In-memory Rate Limiter (Chỉ có hiệu lực trong 1 instance Edge) ──
const rateLimitMap = new Map<string, { count: number; lastReset: number }>();
const LIMIT = 10; // 10 requests
const WINDOW = 60 * 1000; // 1 phút

export default auth((req: NextRequest & { auth?: any }) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;

  // 1. Rate Limiting cho trang đăng nhập/đăng ký
  if (nextUrl.pathname.startsWith("/dang-nhap") || nextUrl.pathname.startsWith("/dang-ky")) {
    const ip = req.headers.get("x-forwarded-for") ?? "127.0.0.1";
    const now = Date.now();
    const rateData = rateLimitMap.get(ip) ?? { count: 0, lastReset: now };

    if (now - rateData.lastReset > WINDOW) {
      rateData.count = 1;
      rateData.lastReset = now;
    } else {
      rateData.count++;
    }
    rateLimitMap.set(ip, rateData);

    if (rateData.count > LIMIT) {
      return new NextResponse("Quá nhiều yêu cầu. Vui lòng thử lại sau.", { status: 429 });
    }
  }

  // 2. Route Protection
  const isProtectedRoute = 
    nextUrl.pathname.startsWith("/dashboard") || 
    nextUrl.pathname.startsWith("/cai-dat") || 
    nextUrl.pathname.startsWith("/don-hang") ||
    nextUrl.pathname.startsWith("/onboarding");

  if (isProtectedRoute && !isLoggedIn) {
    return NextResponse.redirect(new URL("/dang-nhap", nextUrl));
  }
  

  // 3. Redirect nếu đã login mà cố vào trang auth -> Vào onboarding để kiểm tra trạng thái
  if ((nextUrl.pathname === "/dang-nhap" || nextUrl.pathname === "/dang-ky") && isLoggedIn) {
    return NextResponse.redirect(new URL("/onboarding", nextUrl));
  }

  return NextResponse.next();
});

// Cấu hình matcher để middleware không chạy trên file tĩnh
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};

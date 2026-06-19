// src/app/api/stripe/checkout/route.ts
import { NextResponse } from "next/server";
import { auth } from "@/auth";

// import Stripe from "stripe";
// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2023-10-16' });

export async function POST(req: Request) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { planId } = await req.json();

    // Mock logic: Trả về URL checkout (trong thực tế là từ stripe.checkout.sessions.create)
    const mockCheckoutUrl = "https://checkout.stripe.com/pay/mock_session_" + Math.random().toString(36).substring(7);

    console.log(`[Stripe] Tạo phiên thanh toán cho gói ${planId} cho user ${session.user.email}`);

    return NextResponse.json({ url: mockCheckoutUrl });
  } catch (err) {
    return NextResponse.json({ error: "Lỗi tạo phiên thanh toán" }, { status: 500 });
  }
}

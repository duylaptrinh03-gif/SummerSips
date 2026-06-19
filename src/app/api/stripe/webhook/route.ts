// src/app/api/stripe/webhook/route.ts
import { NextResponse } from "next/server";
// import Stripe from "stripe";

export async function POST(req: Request) {
  const payload = await req.text();
  // const sig = req.headers.get("stripe-signature")!;

  try {
    console.log("[Stripe Webhook] Nhận sự kiện từ Stripe");
    
    // Logic verify webhook signature và xử lý event
    // const event = stripe.webhooks.constructEvent(payload, sig, process.env.STRIPE_WEBHOOK_SECRET!);
    
    // if (event.type === 'checkout.session.completed') {
    //   const session = event.data.object;
    //   // Update user subscription in DB
    // }

    return NextResponse.json({ received: true });
  } catch (err) {
    return NextResponse.json({ error: "Webhook Error" }, { status: 400 });
  }
}

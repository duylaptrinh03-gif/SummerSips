// src/app/api/email/route.ts
import { NextResponse } from "next/server";

// Mock Resend SDK if not installed, or use real one
// import { Resend } from 'resend';
// const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { to, subject, type, data } = await req.json();

    if (!to || !subject || !type) {
      return NextResponse.json({ error: "Thiếu thông tin email" }, { status: 400 });
    }

    console.log(`[Email Service] Gửi email ${type} tới ${to}`);

    // Logic gửi email thật (nếu có API Key)
    /*
    await resend.emails.send({
      from: process.env.EMAIL_FROM || 'SummerSips <onboarding@resend.dev>',
      to,
      subject,
      html: `<h1>${subject}</h1><p>Chào ${data.name}, ...</p>`,
    });
    */

    return NextResponse.json({ message: "Email đã được gửi thành công (Mock)" });
  } catch (err) {
    return NextResponse.json({ error: "Lỗi server khi gửi email" }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY || "re_testingfallbackapikey"); // Fallback to prevent crash, though it will fail to send if invalid

export async function POST(req: Request) {
  try {
    const { email, token, name } = await req.json();

    if (!email || !token) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 
      (process.env.NODE_ENV === "development" ? "http://localhost:3000" : "https://offerbell.org");
      
    const verificationLink = `${appUrl}/verify?token=${token}`;

    const data = await resend.emails.send({
      from: "OfferBell <onboarding@offerbell.org>",
      to: email,
      subject: "Verify your email for OfferBell",
      html: `
        <div style="font-family: sans-serif; color: #111; max-width: 500px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 8px;">
          <h2 style="font-family: serif; font-size: 24px;">Welcome to OfferBell, ${name}!</h2>
          <p>Please verify your email address by clicking the link below so you can get started:</p>
          <a href="${verificationLink}" style="display: inline-block; padding: 12px 24px; background: #0a0a0a; color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: bold; margin-top: 10px;">Verify Email</a>
          <p style="margin-top: 24px; font-size: 13px; color: #666;">If you didn't create an account, you can safely ignore this email.</p>
        </div>
      `,
    });

    return NextResponse.json(data);
  } catch (error) {
    console.error("Failed to send verification email:", error);
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
  }
}

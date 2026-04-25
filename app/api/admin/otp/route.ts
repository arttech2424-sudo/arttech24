import { NextResponse } from "next/server";

const OTP_EXPIRY_MS = 5 * 60 * 1000;
const DEFAULT_OTP = process.env.ADMIN_OTP_CODE || "246810";
const allowedPhones = (process.env.ADMIN_OTP_PHONES || "")
  .split(",")
  .map((v) => v.trim())
  .filter(Boolean);

type OTPStore = Map<string, { code: string; expiresAt: number }>;

declare global {
  var __adminOtpStore: OTPStore | undefined;
}

const otpStore: OTPStore = globalThis.__adminOtpStore || new Map();
globalThis.__adminOtpStore = otpStore;

function isAllowedPhone(phone: string) {
  if (!allowedPhones.length) {
    return true;
  }
  return allowedPhones.includes(phone);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const action = String(body.action || "");
    const phone = String(body.phone || "").trim();

    if (!phone || !/^\+?[0-9]{10,15}$/.test(phone)) {
      return NextResponse.json({ error: "Enter a valid mobile number" }, { status: 400 });
    }

    if (!isAllowedPhone(phone)) {
      return NextResponse.json({ error: "This number is not authorized for admin login" }, { status: 403 });
    }

    if (action === "send") {
      const code = DEFAULT_OTP;
      otpStore.set(phone, { code, expiresAt: Date.now() + OTP_EXPIRY_MS });

      console.info(`[Admin OTP] ${phone} -> ${code}`);

      return NextResponse.json({
        success: true,
        message: "OTP sent. Check server logs in development.",
      });
    }

    if (action === "verify") {
      const otp = String(body.otp || "").trim();
      const saved = otpStore.get(phone);

      if (!saved || saved.expiresAt < Date.now() || otp !== saved.code) {
        return NextResponse.json({ error: "Invalid or expired OTP" }, { status: 401 });
      }

      otpStore.delete(phone);

      const response = NextResponse.json({ success: true });
      response.cookies.set({
        name: "admin_mobile_auth",
        value: phone,
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: 60 * 60 * 8,
      });

      return response;
    }

    return NextResponse.json({ error: "Unsupported action" }, { status: 400 });
  } catch {
    return NextResponse.json({ error: "OTP request failed" }, { status: 500 });
  }
}

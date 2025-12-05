import { NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(req: Request) {
  const text = await req.text();
  const signature = req.headers.get("x-signature") || "";

  const hmac = crypto.createHmac(
    "sha256",
    process.env.LEMON_SQUEEZY_WEBHOOK_SECRET!
  );
  const digest = Buffer.from(hmac.update(text).digest("hex"), "hex");
  const computedSignature = Buffer.from(signature, "hex");

  if (!crypto.timingSafeEqual(digest, computedSignature)) {
    return new NextResponse("Invalid signature", { status: 401 });
  }

  const payload = JSON.parse(text);
  if (payload.meta?.event_name === "order_created") {
    const email =
      payload.data?.attributes?.first_order_item?.attributes?.customer_email;
    // TODO: store payment/entitlement in Supabase for this email if desired
  }

  return NextResponse.json({ success: true });
}

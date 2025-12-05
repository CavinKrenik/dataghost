import { createAdminClient } from "@/lib/supabase/admin";
import { headers } from "next/headers";
import crypto from "crypto";

export async function POST(request: Request) {
    const body = await request.text();
    const hmac = headers().get("x-signature");
    const secret = process.env.LEMON_SQUEEZY_WEBHOOK_SECRET;

    if (!secret) {
        console.error("LEMON_SQUEEZY_WEBHOOK_SECRET not set");
        return new Response("Server Configuration Error", { status: 500 });
    }

    // Verify signature
    const digest = crypto
        .createHmac("sha256", secret)
        .update(body)
        .digest("hex");

    if (digest !== hmac) {
        console.error("Invalid signature");
        return new Response("Invalid signature", { status: 403 });
    }

    const payload = JSON.parse(body);
    const eventName = payload.meta.event_name;
    const data = payload.data;
    const attributes = data.attributes;

    // Custom data passed during checkout contains user_id
    const userId = payload.meta.custom_data?.user_id;
    const email = attributes.user_email;

    console.log(`Received webhook: ${eventName} for ${email} (User ID: ${userId})`);

    if (!userId) {
        // If we don't have user_id, we can't reliably update the profile.
        // We could try to find by email, but user_id is safer.
        // For now, log error and return.
        console.error("No user_id in custom_data");
        return new Response("No user_id provided", { status: 400 });
    }

    const supabase = createAdminClient();

    // Map Lemon Squeezy status to our status
    let status = "inactive";
    let plan = "none";

    // Determine plan based on variant ID
    const monthlyId = process.env.NEXT_PUBLIC_LEMON_MONTHLY_ID;
    const yearlyId = process.env.NEXT_PUBLIC_LEMON_YEARLY_ID;
    const variantId = String(attributes.variant_id);

    if (variantId === monthlyId) plan = "monthly";
    else if (variantId === yearlyId) plan = "yearly";

    // Handle events
    switch (eventName) {
        case "order_created":
        case "subscription_created":
        case "subscription_updated":
        case "subscription_resumed":
        case "subscription_payment_success":
            if (attributes.status === "active" || attributes.status === "on_trial") {
                status = "active";
            } else if (attributes.status === "past_due") {
                status = "past_due";
            } else if (attributes.status === "cancelled" || attributes.status === "expired") {
                status = "canceled"; // Note: 'canceled' vs 'cancelled' spelling
            }
            break;

        case "subscription_cancelled":
        case "subscription_expired":
            status = "canceled";
            break;

        case "subscription_payment_failed":
            status = "past_due";
            break;

        default:
            // Unhandled event
            return new Response("Event ignored", { status: 200 });
    }

    // Update profile
    const { error } = await supabase
        .from("profiles")
        .update({
            plan,
            status,
            billing_provider: "lemonsqueezy",
            billing_customer_id: attributes.customer_id,
            billing_subscription_id: attributes.identifier,
            updated_at: new Date().toISOString(),
        })
        .eq("id", userId);

    if (error) {
        console.error("Error updating profile:", error);
        return new Response("Error updating profile", { status: 500 });
    }

    return new Response("Webhook processed", { status: 200 });
}

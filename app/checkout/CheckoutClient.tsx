"use client";

import { useEffect } from "react";
import Image from "next/image";

export default function CheckoutClient({
    user,
    plan,
}: {
    user: any;
    plan: string;
}) {
    const isYearly = plan === "yearly";
    const variantId = isYearly
        ? process.env.NEXT_PUBLIC_LEMON_YEARLY_ID
        : process.env.NEXT_PUBLIC_LEMON_MONTHLY_ID;

    // Construct checkout URL
    const checkoutUrl = `https://dataghost.lemonsqueezy.com/buy/${variantId}?checkout[email]=${encodeURIComponent(
        user.email
    )}&checkout[custom][user_id]=${user.id}&checkout[success_url]=${encodeURIComponent(
        `${process.env.NEXT_PUBLIC_APP_URL}/success`
    )}`;

    useEffect(() => {
        // Redirect to Lemon Squeezy
        if (variantId) {
            window.location.href = checkoutUrl;
        }
    }, [variantId, checkoutUrl]);

    return (
        <div className="min-h-screen bg-ghost-bg flex flex-col items-center justify-center p-4 text-center">
            <Image
                src="/ghost.png"
                alt="DataGhost"
                width={80}
                height={80}
                className="animate-pulse drop-shadow-[0_0_12px_#00e5ff]"
            />
            <h2 className="mt-8 text-2xl font-bold text-white">
                Redirecting to secure checkout...
            </h2>
            <p className="mt-2 text-ghost-muted">
                Please wait while we transfer you to our payment provider.
            </p>
            {!variantId && (
                <div className="mt-8 p-4 bg-red-500/10 border border-red-500 rounded text-red-500">
                    Error: Missing Lemon Squeezy Variant ID. Please check your configuration.
                </div>
            )}
        </div>
    );
}

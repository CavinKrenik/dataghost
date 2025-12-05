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

    if (!variantId) {
        if (process.env.NODE_ENV === 'development') {
            throw new Error(
                'Lemon Squeezy variant IDs are not configured. Set NEXT_PUBLIC_LEMON_MONTHLY_ID and NEXT_PUBLIC_LEMON_YEARLY_ID in your environment variables.'
            );
        }
        // In production, we'll show the error message in the UI below
    }

    // Construct checkout URL
    const checkoutUrl = variantId ? `https://dataghost.lemonsqueezy.com/buy/${variantId}?checkout[email]=${encodeURIComponent(
        user.email
    )}&checkout[custom][user_id]=${user.id}&checkout[success_url]=${encodeURIComponent(
        `${process.env.NEXT_PUBLIC_APP_URL}/success`
    )}` : '';

    useEffect(() => {
        // Redirect to Lemon Squeezy
        if (variantId && checkoutUrl) {
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
                <div className="mt-8 p-4 bg-red-500/10 border border-red-500 rounded text-red-500 max-w-md">
                    <p className="font-bold">Something went wrong preparing your checkout.</p>
                    <p className="text-sm mt-1">Please try again in a few minutes or contact support.</p>
                </div>
            )}
        </div>
    );
}

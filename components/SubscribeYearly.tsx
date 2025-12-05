"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function SubscribeYearly({ user }: { user: any }) {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubscribe = () => {
        setLoading(true);
        if (!user) {
            router.push("/login");
            return;
        }

        const variantId = process.env.NEXT_PUBLIC_LEMON_YEARLY_ID;
        if (!variantId) {
            console.error("Yearly ID not set");
            setLoading(false);
            return;
        }

        // Construct checkout URL with user data
        const checkoutUrl = `https://dataghost.lemonsqueezy.com/buy/${variantId}?checkout[email]=${encodeURIComponent(
            user.email
        )}&checkout[custom][user_id]=${user.id}&checkout[success_url]=${encodeURIComponent(
            `${process.env.NEXT_PUBLIC_APP_URL}/success`
        )}`;

        window.location.href = checkoutUrl;
    };

    return (
        <button
            onClick={handleSubscribe}
            disabled={loading}
            className="mt-8 block w-full rounded-md bg-ghost-cyan px-3 py-3 text-center text-sm font-semibold text-ghost-bg shadow-sm hover:bg-ghost-cyanSoft focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ghost-cyan transition-all shadow-glow"
        >
            {loading ? "Redirecting..." : "Get Yearly"}
        </button>
    );
}

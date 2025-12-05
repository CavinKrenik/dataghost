"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";

export default function AuthConfirmPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const plan = searchParams.get("plan");

    useEffect(() => {
        const timeout = setTimeout(() => {
            if (plan) {
                router.push(`/checkout?plan=${plan}`);
            } else {
                router.push("/dashboard");
            }
        }, 3000);

        return () => clearTimeout(timeout);
    }, [router, plan]);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center">
            <Image
                src="/ghost.png"
                alt="DataGhost"
                width={80}
                height={80}
                className="animate-bounce drop-shadow-[0_0_12px_#00e5ff]"
            />
            <h2 className="mt-8 text-2xl font-bold text-white">
                Email confirmed!
            </h2>
            <p className="mt-2 text-ghost-muted">
                Redirecting you to {plan ? "checkout" : "dashboard"}...
            </p>
        </div>
    );
}

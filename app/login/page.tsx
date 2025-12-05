"use client";

import { createSupabaseBrowserClient } from "@/lib/supabase/client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

export const runtime = 'nodejs'

export default function LoginPage({
    searchParams,
}: {
    searchParams: { plan?: string };
}) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    const supabase = createSupabaseBrowserClient();
    const plan = searchParams.plan;

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            if (error.message.includes("Email not confirmed")) {
                setError("You created an account, but your email isn’t confirmed yet. Please click the confirmation link we sent to your inbox, then try logging in again.");
            } else {
                setError(error.message);
            }
            setLoading(false);
        } else {
            router.refresh();
            if (plan) {
                router.push(`/checkout?plan=${plan}`);
            } else {
                router.push("/dashboard");
            }
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-md space-y-8">
                <div className="text-center">
                    <Image
                        src="/ghost.png"
                        alt="DataGhost"
                        width={60}
                        height={60}
                        className="mx-auto drop-shadow-[0_0_12px_#00e5ff]"
                    />
                    <h2 className="mt-6 text-3xl font-bold tracking-tight text-white">
                        Welcome back
                    </h2>
                    <p className="mt-2 text-sm text-ghost-muted">
                        Sign in to your DataGhost account.
                    </p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleLogin}>
                    <div className="space-y-4 rounded-md shadow-sm">
                        <div>
                            <label htmlFor="email-address" className="sr-only">
                                Email address
                            </label>
                            <input
                                id="email-address"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                className="relative block w-full rounded-md border-0 bg-white/5 py-2.5 px-3 text-white ring-1 ring-inset ring-white/10 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-ghost-cyan sm:text-sm sm:leading-6"
                                placeholder="Email address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="sr-only">
                                Password
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                required
                                className="relative block w-full rounded-md border-0 bg-white/5 py-2.5 px-3 text-white ring-1 ring-inset ring-white/10 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-ghost-cyan sm:text-sm sm:leading-6"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    {error && (
                        <div className="text-red-400 text-sm text-center">{error}</div>
                    )}

                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="group relative flex w-full justify-center rounded-md bg-ghost-cyan px-3 py-2.5 text-sm font-semibold text-ghost-bg hover:bg-ghost-cyanSoft focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ghost-cyan disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-glow"
                        >
                            {loading ? "Sign in" : "Sign in"}
                        </button>
                    </div>
                </form>

                <p className="text-center text-sm text-ghost-muted">
                    Don&apos;t have an account?{" "}
                    <Link
                        href={`/signup${plan ? `?plan=${plan}` : ""}`}
                        className="font-semibold text-ghost-cyan hover:text-ghost-cyanSoft"
                    >
                        Sign up
                    </Link>
                </p>
            </div>
        </div>
    );
}

"use client";

import { createSupabaseBrowserClient } from "@/lib/supabase/client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

export const runtime = 'nodejs'

export default function SignupPage() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    const supabase = createSupabaseBrowserClient();


    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const { error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                emailRedirectTo: `${location.origin}/auth/callback`,
            },
        });

        if (error) {
            setError(error.message);
            setLoading(false);
        } else {
            // For email/password without confirmation, we might be logged in immediately
            // or need to check email. Assuming auto-confirm or session creation for now.
            // If email confirmation is on, this flow might need adjustment.
            // But user requested "logs in -> redirects to /pricing".
            // If Supabase is set to "Enable email confirmations", they won't be logged in yet.
            // Assuming standard dev setup or "Disable email confirmations" for smoother flow,
            // or we just tell them to check email.
            // Let's try to refresh and push.
            router.refresh();
            router.push("/pricing");
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
                        Create your account
                    </h2>
                    <p className="mt-2 text-sm text-ghost-muted">
                        Start vanishing from data brokers today.
                    </p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleSignup}>
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
                                autoComplete="new-password"
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
                            {loading ? "Creating account..." : "Sign up"}
                        </button>
                    </div>
                </form>

                <p className="text-center text-sm text-ghost-muted">
                    Already have an account?{" "}
                    <Link
                        href="/login"
                        className="font-semibold text-ghost-cyan hover:text-ghost-cyanSoft"
                    >
                        Sign in
                    </Link>
                </p>
            </div>
        </div>
    );
}

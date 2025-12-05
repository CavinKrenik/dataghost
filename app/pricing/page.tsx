import Link from "next/link";
import Image from "next/image";
import { Check } from "lucide-react";
import { SubscribeMonthly } from "@/components/SubscribeMonthly";
import { SubscribeYearly } from "@/components/SubscribeYearly";
import { getCurrentUser } from "@/lib/auth";

export default async function PricingPage() {
    const user = await getCurrentUser();

    return (
        <div className="min-h-screen bg-ghost-bg py-20 px-4">
            <div className="mx-auto max-w-5xl text-center space-y-12">
                <div className="space-y-4">
                    <Image
                        src="/ghost.png"
                        alt="DataGhost"
                        width={80}
                        height={80}
                        className="mx-auto drop-shadow-[0_0_12px_#00e5ff]"
                    />
                    <h1 className="text-4xl font-bold text-white">
                        Choose your plan
                    </h1>
                    <p className="text-xl text-ghost-muted max-w-2xl mx-auto">
                        Start vanishing from data brokers today. Cancel anytime.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                    {/* Monthly Plan */}
                    <div className="rounded-3xl border border-ghost-grid/40 bg-ghost-card p-8 shadow-glow/20 flex flex-col hover:border-ghost-cyan/50 transition-all">
                        <div className="mb-6">
                            <h3 className="text-2xl font-bold text-white">Monthly</h3>
                            <div className="mt-4 flex items-baseline justify-center gap-x-2">
                                <span className="text-5xl font-bold tracking-tight text-white">
                                    $19
                                </span>
                                <span className="text-sm font-semibold leading-6 text-ghost-muted">
                                    /month
                                </span>
                            </div>
                        </div>
                        <ul role="list" className="mt-8 space-y-3 text-sm leading-6 text-gray-300 flex-1 text-left">
                            {[
                                "Removal from 80+ data brokers",
                                "Weekly re-scans",
                                "Privacy dashboard",
                                "Cancel anytime",
                            ].map((feature) => (
                                <li key={feature} className="flex gap-x-3">
                                    <Check className="h-6 w-5 flex-none text-ghost-cyan" aria-hidden="true" />
                                    {feature}
                                </li>
                            ))}
                        </ul>
                        <SubscribeMonthly user={user} />
                    </div>

                    {/* Yearly Plan */}
                    <div className="rounded-3xl border border-ghost-cyan bg-ghost-card p-8 shadow-glow flex flex-col relative overflow-hidden">
                        <div className="absolute top-0 right-0 bg-ghost-cyan text-ghost-bg text-xs font-bold px-3 py-1 rounded-bl-lg">
                            BEST VALUE
                        </div>
                        <div className="mb-6">
                            <h3 className="text-2xl font-bold text-white">Yearly</h3>
                            <div className="mt-4 flex items-baseline justify-center gap-x-2">
                                <span className="text-5xl font-bold tracking-tight text-white">
                                    $149
                                </span>
                                <span className="text-sm font-semibold leading-6 text-ghost-muted">
                                    /year
                                </span>
                            </div>
                            <p className="mt-1 text-xs text-ghost-cyan">Save 35%</p>
                        </div>
                        <ul role="list" className="mt-8 space-y-3 text-sm leading-6 text-gray-300 flex-1 text-left">
                            {[
                                "Removal from 80+ data brokers",
                                "Weekly re-scans",
                                "Privacy dashboard",
                                "Priority support",
                                "2 months free",
                            ].map((feature) => (
                                <li key={feature} className="flex gap-x-3">
                                    <Check className="h-6 w-5 flex-none text-ghost-cyan" aria-hidden="true" />
                                    {feature}
                                </li>
                            ))}
                        </ul>
                        <SubscribeYearly user={user} />
                    </div>
                </div>
            </div>
        </div>
    );
}

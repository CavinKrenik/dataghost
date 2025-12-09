import type { Metadata } from "next";
import { Check, X, Shield, Zap, RefreshCw, Trash2, Database } from "lucide-react";
export const metadata: Metadata = {
    // OPTIMIZED: 56 characters
    title: "DataGhost vs DeleteMe & Incogni: 2025 Pricing Comparison",

    // OPTIMIZED: 138 characters
    description: "See why DataGhost is the winner. Only we offer a $49 one-time payment, weekly re-scans, and permanent data deletion. No recurring fees.",
    alternates: { canonical: "https://dataghost.me/comparison" },
    openGraph: {
        title: "DataGhost vs DeleteMe vs Incogni vs Optery vs Kanary – 2025 Comparison (No Subscription Winner)",
        description: "Side-by-side 2025 comparison. Only DataGhost offers one-time $49 payment, weekly re-scans, and permanent data deletion. No recurring fees ever.",
        url: "https://dataghost.me/comparison",
        images: "/opengraph-image.jpg",
    },
    twitter: {
        card: "summary_large_image",
        title: "DataGhost vs DeleteMe vs Incogni vs Optery vs Kanary – 2025 Comparison (No Subscription Winner)",
        description: "Side-by-side 2025 comparison. Only DataGhost offers one-time $49 payment, weekly re-scans, and permanent data deletion. No recurring fees ever.",
        images: ["/opengraph-image.jpg"],
    },
};
type ComparisonKey = "price" | "subscription" | "account" | "deletion" | "brokers";

interface Feature {
    name: string;
    key: ComparisonKey;
}

interface Competitor {
    name: string;
    isPrimary?: boolean; // Make optional
    price: string;
    subscription: string;
    account: string;
    deletion: string;
    brokers: string;
}

const FEATURES: Feature[] = [
    { name: "Price", key: "price" },
    { name: "Subscription Required", key: "subscription" },
    { name: "Account / Dashboard", key: "account" },
    { name: "Data Deletion", key: "deletion" },
    { name: "Brokers Covered", key: "brokers" },
];

const COMPETITORS: Competitor[] = [
    {
        name: "DataGhost",
        isPrimary: true,
        price: "$49 one-time",
        subscription: "No",
        account: "No",
        deletion: "✓ Yes (after 45 days)",
        brokers: "70+",
    },
    {
        name: "Incogni",
        price: "$99/year",
        subscription: "Yes",
        account: "Yes",
        deletion: "Retained indefinitely",
        brokers: "70–200+",
    },
    {
        name: "DeleteMe",
        price: "$129/year",
        subscription: "Yes",
        account: "Yes",
        deletion: "Retained indefinitely",
        brokers: "750+ (many DIY)",
    },
    {
        name: "Optery",
        price: "$39–$249/year",
        subscription: "Yes",
        account: "Yes",
        deletion: "Retained indefinitely",
        brokers: "300+",
    },
    {
        name: "Kanary",
        price: "$180/year",
        subscription: "Yes",
        account: "Yes",
        deletion: "Retained indefinitely",
        brokers: "100+",
    },
];
export default function Comparison() {
    return (
        <div className="min-h-screen bg-ghost-navy text-white py-16 px-6">
            <div className="max-w-7xl mx-auto">
                { }
                <div className="text-center mb-16 md:mb-20">
                    <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black mb-8 bg-gradient-to-br from-cyan-300 via-purple-400 to-pink-400 bg-clip-text text-transparent leading-tight text-center">
                        DataGhost vs The Subscription Services<br />2025 Comparison
                    </h1>
                    <p className="text-base md:text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
                        Most services require recurring subscriptions and retain your data indefinitely.
                        DataGhost is different: one powerful removal sweep for <span className="text-ghost-cyan font-bold">$49</span>.
                    </p>
                </div>
                { }
                <div className="md:hidden space-y-6">
                    {FEATURES.map((feature, i) => (
                        <div key={feature.key} className="rounded-2xl border border-cyan-900/40 bg-black/40 backdrop-blur-sm p-6 shadow-lg shadow-black/20">
                            <h3 className="text-lg font-bold text-white mb-4 border-b border-white/10 pb-2 flex items-center gap-2">
                                <span className="text-ghost-cyan">
                                    {feature.key === 'price' && '$'}
                                    {feature.key === 'subscription' && '↻'}
                                    {feature.key === 'account' && '👤'}
                                    {feature.key === 'deletion' && '🗑️'}
                                    {feature.key === 'brokers' && '📂'}
                                </span>
                                {feature.name}
                            </h3>
                            <div className="space-y-3 text-sm">
                                {COMPETITORS.map((comp) => (
                                    <div key={comp.name} className={`grid grid-cols-2 gap-4 items-center ${comp.isPrimary ? 'bg-cyan-950/30 -mx-4 px-4 py-2 rounded-lg border border-cyan-500/20' : ''}`}>
                                        <div className={`font-medium ${comp.isPrimary ? 'text-ghost-cyan font-bold' : 'text-zinc-500'}`}>
                                            {comp.name}
                                        </div>
                                        <div className={`text-right font-medium ${comp.isPrimary ? 'text-ghost-cyan font-bold' :
                                            (feature.key === 'subscription' || feature.key === 'account') && comp.name !== 'DataGhost' ? 'text-red-400' :
                                                'text-zinc-300'
                                            }`}>
                                            { }
                                            {comp[feature.key]}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
                { }
                <div className="hidden md:block overflow-x-auto rounded-3xl border border-cyan-800/40 bg-black/30 backdrop-blur-xl -mx-6 px-6 md:mx-auto md:max-w-7xl md:px-0 mt-12 mb-20 shadow-2xl shadow-cyan-900/20">
                    <div className="min-w-[920px] py-8">
                        <table className="w-full text-left border-collapse">
                            <thead className="sticky top-0 z-20 bg-ghost-navy/95 backdrop-blur-xl border-b border-cyan-800/50">
                                <tr>
                                    <th className="sticky left-0 z-30 bg-ghost-navy/95 backdrop-blur-xl px-8 py-6 text-lg font-semibold border-r border-cyan-800/50">Feature</th>
                                    {COMPETITORS.map((comp) => (
                                        <th key={comp.name} className={`px-8 py-6 text-xl font-bold text-center ${comp.isPrimary ? 'text-ghost-cyan bg-cyan-950/30' : 'text-gray-300'}`}>
                                            {comp.name}
                                            {comp.isPrimary && <span className="block text-xs font-normal text-ghost-cyan/80 mt-1">Recommended</span>}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {FEATURES.map((feature, i) => (
                                    <tr key={feature.key} className="border-b border-cyan-900/20 hover:bg-white/5 transition">
                                        <td className="sticky left-0 z-10 bg-ghost-navy/90 backdrop-blur-xl px-8 py-6 font-medium border-r border-cyan-800/50">
                                            {feature.name}
                                        </td>
                                        {COMPETITORS.map((comp) => (
                                            <td key={`${comp.name}-${feature.key}`} className={`px-8 py-6 text-center ${comp.isPrimary ? 'bg-cyan-950/10' : ''}`}>
                                                <span className={`text-lg font-semibold ${feature.key === 'price' && comp.isPrimary ? 'text-3xl text-ghost-cyan' :
                                                    (feature.key === 'subscription' || feature.key === 'account') && comp.isPrimary ? 'text-ghost-cyan text-2xl' :
                                                        (feature.key === 'subscription' || feature.key === 'account') && !comp.isPrimary ? 'text-red-500 text-2xl' :
                                                            feature.key === 'deletion' && comp.isPrimary ? 'text-ghost-cyan' :
                                                                'text-gray-300'
                                                    }`}>
                                                    { }
                                                    {comp[feature.key]}
                                                </span>
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
                { }
                <div className="text-center mt-12 md:mt-20">
                    <a
                        href="https://dataghost.lemonsqueezy.com/buy/9f83b3ac-bdcf-41f9-a25f-3e524d7d9d2b?embed=1"
                        className="inline-block px-10 py-6 md:px-16 md:py-8 text-xl md:text-3xl font-black bg-gradient-to-r from-cyan-600 to-purple-600 rounded-2xl hover:scale-105 transition shadow-2xl shadow-cyan-900/50 text-white"
                    >
                        Yes — Ghost Me for $49 One-Time
                    </a>
                    <p className="mt-6 md:mt-8 text-lg md:text-2xl text-gray-400">No subscription. No account. Just gone.</p>
                </div>
            </div>
        </div>
    );
}

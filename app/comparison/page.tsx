import type { Metadata } from "next";
import { Check, X, Shield, Zap, RefreshCw, Trash2, Database } from "lucide-react";

export const metadata: Metadata = {
    title: "DataGhost vs DeleteMe vs Incogni vs Optery vs Kanary – 2025 Comparison (No Subscription Winner)",
    description: "Side-by-side 2025 comparison. Only DataGhost offers one-time $49 payment, weekly re-scans, and permanent data deletion. No recurring fees ever.",
    alternates: { canonical: "https://dataghost.me/comparison" },
    openGraph: {
        title: "DataGhost vs DeleteMe vs Incogni vs Optery vs Kanary – 2025 Comparison (No Subscription Winner)",
        description: "Side-by-side 2025 comparison. Only DataGhost offers one-time $49 payment, weekly re-scans, and permanent data deletion. No recurring fees ever.",
        url: "https://dataghost.me/comparison",
        images: "/og-comparison.png",
    },
};

const FEATURES = [
    { name: "Price", key: "price" },
    { name: "Subscription Required", key: "subscription" },
    { name: "Account / Dashboard", key: "account" },
    { name: "Data Deletion", key: "deletion" },
    { name: "Brokers Covered", key: "brokers" },
];

const COMPETITORS = [
    {
        name: "DataGhost",
        isPrimary: true,
        price: "$49 one-time",
        subscription: "No",
        account: "No",
        deletion: "✓ Yes (after 45 days)",
        brokers: "80+",
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
                {/* Hero Intro */}
                <div className="text-center mb-16 md:mb-20">
                    <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black mb-8 bg-gradient-to-br from-cyan-300 via-purple-400 to-pink-400 bg-clip-text text-transparent leading-tight text-center">
                        DataGhost vs The Subscription Services<br />2025 Comparison
                    </h1>
                    <p className="text-base md:text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
                        Most services require recurring subscriptions and retain your data indefinitely.
                        DataGhost is different: one powerful removal sweep for <span className="text-ghost-cyan font-bold">$49</span>.
                    </p>
                </div>

                {/* Swipe Hint for Mobile */}
                <div className="md:hidden text-center text-sm text-ghost-cyan animate-pulse mb-4 font-semibold tracking-wide">
                    ← Swipe view to compare →
                </div>

                {/* Unified Responsive Table View */}
                <div className="w-full overflow-x-auto relative rounded-3xl border border-cyan-800/40 bg-black/30 backdrop-blur-xl mb-20 shadow-2xl shadow-cyan-900/20">
                    <div className="min-w-[920px] py-8 px-6">
                        <table className="w-full text-left border-collapse">
                            <thead className="sticky top-0 z-50">
                                <tr>
                                    <th className="sticky left-0 z-40 bg-ghost-navy/95 backdrop-blur-xl px-6 py-6 text-lg font-semibold border-r border-cyan-800/50 border-b border-cyan-800/50 rounded-tl-xl text-white shadow-[4px_0_24px_rgba(0,0,0,0.8)]">Feature</th>
                                    {COMPETITORS.map((comp) => (
                                        <th key={comp.name} className={`px-8 py-6 text-xl font-bold text-center border-b border-cyan-800/50 bg-ghost-navy/95 backdrop-blur-xl ${comp.isPrimary ? 'text-ghost-cyan' : 'text-gray-300'}`}>
                                            {comp.name}
                                            {comp.isPrimary && <span className="block text-xs font-normal text-ghost-cyan/80 mt-1">Recommended</span>}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {FEATURES.map((feature, i) => (
                                    <tr key={feature.key} className="border-b border-cyan-900/20 hover:bg-white/5 transition group">
                                        <td className="sticky left-0 z-30 bg-ghost-navy/95 backdrop-blur-xl px-6 py-6 font-medium border-r border-cyan-800/50 text-white shadow-[4px_0_24px_rgba(0,0,0,0.8)] group-hover:bg-ghost-navy transition-colors">
                                            {feature.name}
                                        </td>
                                        {COMPETITORS.map((comp) => (
                                            <td key={`${comp.name}-${feature.key}`} className={`px-8 py-6 text-center ${comp.isPrimary ? 'bg-cyan-950/20' : ''}`}>
                                                <span className={`text-lg font-semibold ${
                                                    // Specific styling logic mirroring the original table
                                                    feature.key === 'price' && comp.isPrimary ? 'text-3xl text-ghost-cyan' :
                                                        (feature.key === 'subscription' || feature.key === 'account') && comp.isPrimary ? 'text-ghost-cyan text-2xl' :
                                                            (feature.key === 'subscription' || feature.key === 'account') && !comp.isPrimary ? 'text-red-500 text-2xl' :
                                                                feature.key === 'deletion' && comp.isPrimary ? 'text-ghost-cyan' :
                                                                    'text-gray-300'
                                                    }`}>
                                                    {/* @ts-ignore */}
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

                {/* Final CTA */}
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

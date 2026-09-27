import type { Metadata } from "next";
export const metadata: Metadata = {
    title: "DataGhost vs Data Removal Subscriptions: 2027 Comparison",

    description: "Compare DataGhost's $49 one-time service with Incogni, DeleteMe, Optery, and Kanary. See annual prices, coverage, and data retention policies.",
    alternates: { canonical: "https://dataghost.me/comparison" },
    openGraph: {
        title: "DataGhost vs Data Removal Subscriptions: 2027 Comparison",
        description: "Compare a $49 one-time service with annual subscriptions. Prices and coverage vary by plan.",
        url: "https://dataghost.me/comparison",
        images: "/opengraph-image.jpg",
    },

    twitter: {
        card: "summary_large_image",
        title: "DataGhost vs Data Removal Subscriptions: 2027 Comparison",
        description: "Compare a $49 one-time service with annual subscriptions. Prices and coverage vary by plan.",
        images: ["/opengraph-image.jpg"],
    },
};
type ComparisonKey = "price" | "duration" | "account" | "deletion" | "brokers";

interface Feature {
    name: string;
    key: ComparisonKey;
}

interface Competitor {
    name: string;
    isPrimary?: boolean;
    price: string;
    duration: string;
    account: string;
    deletion: string;
    brokers: string;
}

const FEATURES: Feature[] = [
    { name: "Price (one person)", key: "price" },
    { name: "Service period", key: "duration" },
    { name: "Account / Dashboard", key: "account" },
    { name: "Customer data retention", key: "deletion" },
    { name: "Sites / broker targets", key: "brokers" },
];

const COMPETITORS: Competitor[] = [
    {
        name: "DataGhost",
        isPrimary: true,
        price: "$49 one-time",
        duration: "45 days; weekly follow-ups",
        account: "No",
        deletion: "Deleted after 45 days",
        brokers: "70+ opt-out targets",
    },
    {
        name: "Incogni",
        price: "$95.88/year (Standard)",
        duration: "Ongoing subscription",
        account: "Yes",
        deletion: "Up to 24 months after service ends; deletion can be requested",
        brokers: "420+ on Standard",
    },
    {
        name: "DeleteMe",
        price: "$129/year",
        duration: "Ongoing subscription",
        account: "Yes",
        deletion: "Membership period plus 6 months",
        brokers: "30+ top sites on Standard; 969 on broader removal list",
    },
    {
        name: "Optery",
        price: "$39–$249/year",
        duration: "Ongoing subscription",
        account: "Yes",
        deletion: "Account deletion available; backups cleared within 7 days",
        brokers: "380+ Core to 635+ Ultimate, with Expanded Reach",
    },
    {
        name: "Kanary",
        price: "$250–$500/year",
        duration: "Ongoing subscription",
        account: "Yes",
        deletion: "Account data deleted when you leave",
        brokers: "Coverage varies by risk profile",
    },
];
export default function Comparison() {
    return (
        <div className="min-h-screen bg-ghost-navy text-white py-16 px-6">
            <div className="max-w-7xl mx-auto">
                { }
                <div className="text-center mb-16 md:mb-20">
                    <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black mb-8 bg-gradient-to-br from-cyan-300 via-purple-400 to-pink-400 bg-clip-text text-transparent leading-tight text-center">
                        DataGhost vs The Subscription Services<br />2027 Comparison
                    </h1>
                    <p className="text-base md:text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
                        Compare a <span className="text-ghost-cyan font-bold">$49 one-time</span> service with ongoing subscriptions.
                        Prices, coverage, and monitoring periods differ by plan.
                    </p>
                    <p className="mt-5 text-sm text-gray-400">Competitor details checked September 26, 2026. Recheck before purchasing; taxes, promotions, and plan changes may affect prices.</p>
                </div>
                { }
                <div className="md:hidden space-y-6">
                    {FEATURES.map((feature, i) => (
                        <div key={feature.key} className="rounded-2xl border border-cyan-900/40 bg-black/40 backdrop-blur-sm p-6 shadow-lg shadow-black/20">
                            <h3 className="text-lg font-bold text-white mb-4 border-b border-white/10 pb-2 flex items-center gap-2">
                                <span className="text-ghost-cyan">
                                    {feature.key === 'price' && '$'}
                                    {feature.key === 'duration' && '↻'}
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
                                        <div className={`text-right font-medium ${comp.isPrimary ? 'text-ghost-cyan font-bold' : 'text-zinc-300'}`}>
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
                                                    (feature.key === 'duration' || feature.key === 'account' || feature.key === 'deletion') && comp.isPrimary ? 'text-ghost-cyan' :
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
                <div className="max-w-4xl mx-auto text-sm leading-relaxed text-gray-400">
                    <p>Coverage counts use each provider&apos;s published definitions. A listed target or submitted request does not guarantee that a broker removes a record. DeleteMe&apos;s broader list describes sites where it has found and removed data; its Standard plan description names 30+ top sites. Optery&apos;s displayed counts include Expanded Reach.</p>
                    <p className="mt-4">Sources: <a className="text-ghost-cyan underline" href="https://incogni.com/pricing">Incogni plans</a> and <a className="text-ghost-cyan underline" href="https://incogni.com/legal/privacy-policy">privacy policy</a>; <a className="text-ghost-cyan underline" href="https://joindeleteme.com/blog/choosing-your-deleteme-plan/">DeleteMe Standard plan</a>, <a className="text-ghost-cyan underline" href="https://joindeleteme.com/sites-we-remove-from/">site list</a>, and <a className="text-ghost-cyan underline" href="https://privacy.joindeleteme.com/policies?name=privacy-policy">privacy policy</a>; <a className="text-ghost-cyan underline" href="https://www.optery.com/pricing/">Optery plans</a> and <a className="text-ghost-cyan underline" href="https://www.optery.com/privacy-policy/">privacy policy</a>; <a className="text-ghost-cyan underline" href="https://www.kanary.com/pricing">Kanary plans</a>, <a className="text-ghost-cyan underline" href="https://www.kanary.com/remove-from-sites">coverage</a>, and <a className="text-ghost-cyan underline" href="https://www.kanary.com/privacy-and-security">privacy details</a>.</p>
                </div>
                { }
                <div className="text-center mt-12 md:mt-20">
                    <a
                        href="https://buy.stripe.com/6oU4gA0to6pKbsdffe6oo01"
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

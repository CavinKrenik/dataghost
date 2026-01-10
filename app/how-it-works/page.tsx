import Link from "next/link";
import { ArrowRight, ShieldCheck, Database, Cpu, Ghost, Lock, Zap } from "lucide-react";
import { StickyCTA } from "@/components/StickyCTA";

export const metadata = {
    title: "The Ghost Protocol | How DataGhost Works",
    description: "A technical deep dive into the distributed architecture, stealth automation, and privacy-by-design principles behind DataGhost.",
};

export default function HowItWorksPage() {
    return (
        <div className="min-h-screen bg-ghost-bg text-white selection:bg-ghost-cyan selection:text-ghost-bg">
            {/* Hero Section */}
            <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-4xl opacity-20 pointer-events-none">
                    <div className="absolute inset-0 bg-gradient-to-b from-ghost-cyan/20 to-transparent blur-3xl rounded-full" />
                </div>

                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-ghost-navy border border-ghost-cyan/30 text-ghost-cyan mb-8 animate-fade-in-up">
                    <Cpu className="w-4 h-4" />
                    <span className="text-sm font-semibold tracking-wide uppercase">Engineering Deep Dive</span>
                </div>

                <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 text-white drop-shadow-[0_0_15px_rgba(0,229,255,0.3)]">
                    The <span className="text-ghost-cyan">Ghost</span> Protocol
                </h1>
                <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
                    How we architected a distributed, "Stateful but Stateless" privacy engine to automate the web's hardest targets.
                </p>
            </section>

            {/* The Mission */}
            <section className="py-20 bg-ghost-navy/30 border-y border-white/5">
                <div className="max-w-4xl mx-auto px-4">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-3xl font-bold mb-4 text-white">The "Nuclear Option"</h2>
                            <p className="text-gray-400 mb-4">
                                Most privacy tools are monthly subscriptions because it's a better business model for <em>them</em>. We built DataGhost because we believe removing your data should be a transaction, not a rent payment.
                            </p>
                            <p className="text-gray-400">
                                To make this economically viable ($49 one-time), we had to engineer a system that is incredibly efficient, automated, and doesn't hoard data forever.
                            </p>
                        </div>
                        <div className="bg-ghost-bg p-6 rounded-xl border border-ghost-cyan/20 shadow-[0_0_30px_rgba(0,229,255,0.05)]">
                            <ul className="space-y-4">
                                <li className="flex gap-3">
                                    <div className="mt-1 w-6 h-6 rounded-full bg-red-500/10 flex items-center justify-center text-red-400 shrink-0">✕</div>
                                    <span className="text-gray-300">No Monthly Subscriptions</span>
                                </li>
                                <li className="flex gap-3">
                                    <div className="mt-1 w-6 h-6 rounded-full bg-red-500/10 flex items-center justify-center text-red-400 shrink-0">✕</div>
                                    <span className="text-gray-300">No Long-Term Data Retention</span>
                                </li>
                                <li className="flex gap-3">
                                    <div className="mt-1 w-6 h-6 rounded-full bg-green-500/10 flex items-center justify-center text-ghost-cyan shrink-0">✓</div>
                                    <span className="text-gray-300">One-Time "Fire and Forget" Removal</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* The Architecture */}
            <section className="py-20 px-4 max-w-5xl mx-auto">
                <h2 className="text-3xl font-bold mb-12 text-center">Distributed Architecture</h2>

                <div className="relative">
                    {/* Connector Line */}
                    <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-ghost-cyan/50 to-transparent -translate-y-1/2 z-0" />

                    <div className="grid md:grid-cols-3 gap-8 relative z-10">
                        {/* Node 1 */}
                        <div className="bg-ghost-navy p-6 rounded-xl border border-white/10 text-center hover:border-ghost-cyan/50 transition-colors">
                            <div className="w-12 h-12 mx-auto bg-blue-500/20 rounded-lg flex items-center justify-center text-blue-400 mb-4">
                                <Zap className="w-6 h-6" />
                            </div>
                            <h3 className="text-lg font-bold text-white mb-2">Frontend (Edge)</h3>
                            <p className="text-sm text-gray-400">Next.js 14 App Router hosted on Netlify. Handles payments, user input, and initiates the protocol.</p>
                        </div>

                        {/* Node 2 */}
                        <div className="bg-ghost-navy p-6 rounded-xl border border-ghost-cyan/30 text-center shadow-[0_0_20px_rgba(0,229,255,0.1)] transform md:-translate-y-4 bg-ghost-navy-dark">
                            <div className="w-12 h-12 mx-auto bg-ghost-cyan/20 rounded-lg flex items-center justify-center text-ghost-cyan mb-4">
                                <Ghost className="w-6 h-6" />
                            </div>
                            <h3 className="text-lg font-bold text-white mb-2">The Handshake</h3>
                            <p className="text-sm text-gray-400">
                                "Fire-and-Forget" pattern. The UI triggers the job, the worker responds <code>202 Accepted</code>, and processing happens asynchronously to prevent timeouts.
                            </p>
                        </div>

                        {/* Node 3 */}
                        <div className="bg-ghost-navy p-6 rounded-xl border border-white/10 text-center hover:border-ghost-cyan/50 transition-colors">
                            <div className="w-12 h-12 mx-auto bg-purple-500/20 rounded-lg flex items-center justify-center text-purple-400 mb-4">
                                <Database className="w-6 h-6" />
                            </div>
                            <h3 className="text-lg font-bold text-white mb-2">The Muscle</h3>
                            <p className="text-sm text-gray-400">Node.js Worker on Railway. Runs headless Playwright browsers with stealth injection to automate removals.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stealth & Privacy */}
            <section className="py-20 bg-ghost-navy/30 border-t border-white/5">
                <div className="max-w-6xl mx-auto px-4 grid md:grid-cols-2 gap-16">

                    {/* Stealth */}
                    <div>
                        <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                            <ShieldCheck className="text-ghost-cyan" />
                            Stealth Automation
                        </h3>
                        <p className="text-gray-400 leading-relaxed mb-6">
                            Standard headless browsers get blocked instantly by "Hard Targets" like Whitepages or BeenVerified (using Cloudflare/Datadome).
                        </p>
                        <p className="text-gray-400 leading-relaxed">
                            DataGhost uses <strong>Fingerprint Injection</strong>. We randomize the WebGL, AudioContext, and Canvas fingerprints of our worker bots to mimic real Chrome users on residential IPs. This allows us to automate removal forms that usually require manual human intervention.
                        </p>
                    </div>

                    {/* Data Lifecycle */}
                    <div>
                        <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                            <Lock className="text-ghost-cyan" />
                            Stateful but Stateless
                        </h3>
                        <p className="text-gray-400 leading-relaxed mb-6">
                            We follow a strict data lifecycle policy to minimize liability for us and risk for you.
                        </p>
                        <ul className="space-y-4 text-gray-400">
                            <li className="pl-4 border-l-2 border-ghost-cyan">
                                <strong className="text-white block">Day 0-45:</strong> Data is stored (encrypted) in Supabase to track removal status and perform re-scans.
                            </li>
                            <li className="pl-4 border-l-2 border-gray-700">
                                <strong className="text-white block">Day 46:</strong> A Cron job permanently wipes your PII from our database. We retain zero logs.
                            </li>
                        </ul>
                    </div>
                </div>
            </section>

            {/* Tech Stack List */}
            <section className="py-20 px-4 text-center">
                <h3 className="text-sm font-bold text-ghost-cyan uppercase tracking-widest mb-8">The Stack</h3>
                <div className="flex flex-wrap justify-center gap-4 max-w-4xl mx-auto">
                    {["Next.js 14", "TypeScript", "Tailwind CSS", "Supabase RLS", "PostgreSQL", "Node.js", "Express", "Playwright", "Resend API", "Stripe", "Railway", "Netlify"].map((tech) => (
                        <span key={tech} className="px-4 py-2 bg-ghost-navy border border-white/10 rounded-md text-gray-300 text-sm">
                            {tech}
                        </span>
                    ))}
                </div>
            </section>

            <StickyCTA />
        </div>
    );
}

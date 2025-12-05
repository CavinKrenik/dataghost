"use client";

import Link from "next/link";
import Image from "next/image";
import { LandingInfo } from "@/components/LandingInfo";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-ghost-navy text-ghost-text relative">
      {/* Hero Section */}
      <section className="relative bg-holo px-6 pt-28 pb-24 text-center overflow-hidden">
        <div className="flex justify-center mb-8">
          <Image
            src="/ghost.png"
            alt="DataGhost privacy removal service illustration"
            width={140}
            height={140}
            className="animate-float drop-shadow-[0_0_30px_#00e5ff]"
          />
        </div>
        <h1 className="text-5xl md:text-6xl font-bold leading-tight">
          Ghost your data from{" "}
          <span className="text-ghost-cyan drop-shadow-[0_0_25px_rgba(0,229,255,0.65)]">
            80+ brokers (auto + manual checklist)
          </span>
        </h1>

        <div className="mt-10 flex flex-col items-center gap-4">
          <Link
            href="/payment"
            className="bg-ghost-cyan text-black px-10 py-4 rounded-full font-semibold shadow-glow hover:opacity-90 transition text-lg"
          >
            Ghost My Data – $49 one-time (no subscription)
          </Link>
          <p className="text-sm text-ghost-muted">
            One payment · No account needed · Everything sent to your email
          </p>
        </div>

        <div className="mt-8 flex flex-wrap justify-center gap-3 text-sm text-ghost-muted">
          <span>No ID upload required</span>
          <span>•</span>
          <span>Transparent CC emails</span>
          <span>•</span>
          <span>Data deleted after 45 days</span>
          <span>•</span>
          <span>Weekly re-scans included</span>
        </div>
      </section>

      {/* Pricing Card Section */}
      <section className="px-6 py-12 flex justify-center">
        <div className="bg-ghost-card border border-ghost-border p-8 rounded-2xl shadow-glow max-w-md w-full text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-ghost-cyan to-transparent opacity-50"></div>

          <h2 className="text-2xl font-bold mb-6 text-white">One-Time Payment – $49</h2>

          <ul className="text-left space-y-3 mb-8 text-ghost-text/90">
            <li className="flex items-start gap-3">
              <span className="text-ghost-cyan mt-1">✓</span>
              <span>80+ brokers (auto + manual checklist)</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-ghost-cyan mt-1">✓</span>
              <span>Weekly re-scans for 45 days</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-ghost-cyan mt-1">✓</span>
              <span>Full removal report + proof PDFs emailed</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-ghost-cyan mt-1">✓</span>
              <span>No account, no login, no subscription, no renewals</span>
            </li>
          </ul>

          <Link
            href="/payment"
            className="block w-full bg-ghost-cyan text-black px-6 py-3 rounded-lg font-bold hover:opacity-90 transition shadow-[0_0_15px_rgba(0,229,255,0.3)]"
          >
            Ghost My Data Now – $49 one-time
          </Link>

          <p className="mt-3 text-xs text-ghost-muted">
            Launch pricing — goes to $79 soon
          </p>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="px-6 py-12 max-w-5xl mx-auto">
        <h3 className="text-center text-xl font-semibold mb-8 text-ghost-muted uppercase tracking-widest">
          <span className="text-ghost-cyan mr-2">👻</span> Recent Ghosts
        </h3>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-ghost-card/50 border border-ghost-border/50 p-6 rounded-xl">
            <p className="text-ghost-text italic mb-4">“Found me on 52 sites. Most gone in 2 weeks. Best $49 I ever spent.”</p>
            <p className="text-ghost-cyan font-semibold text-sm">– J.R.</p>
          </div>
          <div className="bg-ghost-card/50 border border-ghost-border/50 p-6 rounded-xl">
            <p className="text-ghost-text italic mb-4">“No account, no BS, just results. Spokeo & BeenVerified finally dead.”</p>
            <p className="text-ghost-cyan font-semibold text-sm">– Mike</p>
          </div>
          <div className="bg-ghost-card/50 border border-ghost-border/50 p-6 rounded-xl">
            <p className="text-ghost-text italic mb-4">“Worked perfectly. Got all the confirmation emails. Worth double.”</p>
            <p className="text-ghost-cyan font-semibold text-sm">– Sarah</p>
          </div>
        </div>
      </section>

      <LandingInfo />
    </main>
  );
}

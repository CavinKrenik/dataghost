
import Link from "next/link";
import Image from "next/image";
import { LandingInfo } from "@/components/LandingInfo";
export default function HomePage() {
  return (
    <main className="min-h-screen bg-ghost-navy text-ghost-text relative">

      <section className="relative bg-holo px-6 pt-16 pb-24 md:pt-28 md:pb-32 lg:pt-40 lg:pb-48 text-center overflow-hidden">
        <div className="flex justify-center mb-6 md:mb-8">
          <div className="relative w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 lg:w-[520px] lg:h-[520px]">
            <Image
              src="/ghost.png"
              alt="DataGhost privacy removal service illustration"
              fill
              className="object-contain animate-float drop-shadow-[0_0_30px_#00e5ff]"
              sizes="(max-width: 640px) 256px, (max-width: 768px) 320px, (max-width: 1024px) 384px, 520px"
              priority
            />
          </div>
        </div>
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight max-w-5xl mx-auto">
          Ghost your data from{" "}
          <span className="text-ghost-cyan drop-shadow-[0_0_25px_rgba(0,229,255,0.65)]">
            70+ brokers
          </span>
        </h1>
        <div className="mt-4">
          <Link href="/comparison" className="text-ghost-cyan hover:underline font-semibold text-lg flex items-center justify-center gap-2">
            See how we destroy Incogni, DeleteMe, Optery, and Kanary
            <span className="text-xl">→</span>
          </Link>
        </div>
        <div className="mt-10 flex flex-col items-center gap-4">
          <Link
            href="https://buy.stripe.com/6oU4gA0to6pKbsdffe6oo01"
            className="bg-ghost-cyan text-black px-10 py-4 rounded-full font-semibold shadow-glow hover:opacity-90 transition text-lg"
          >
            Ghost My Data – $49 one-time (no subscription)
          </Link>
          <p className="text-sm text-ghost-muted">
            One payment · No account needed
          </p>
        </div>
        <div className="mt-8 flex flex-wrap justify-center gap-3 text-sm text-ghost-muted">
          <span>No ID upload required</span>
          <span>•</span>
          <span>Data deleted after 45 days</span>
        </div>
      </section>

      <section className="px-6 py-16 bg-ghost-bg">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-10">How We Handle Your Data</h2>
          <div className="grid gap-6 text-lg text-ghost-text/90">
            <div className="flex gap-4">
              <span className="text-ghost-cyan text-xl">•</span>
              <p>We only ask for the minimum needed to make opt-outs work: name, email, city, state, age range.</p>
            </div>
            <div className="flex gap-4">
              <span className="text-ghost-cyan text-xl">•</span>
              <p>Your data is encrypted at rest (Supabase Postgres with AES-256) and in transit (TLS 1.3).</p>
            </div>
            <div className="flex gap-4">
              <span className="text-ghost-cyan text-xl">•</span>
              <p>We never sell, share, or use your data for anything else.</p>
            </div>
            <div className="flex gap-4">
              <span className="text-ghost-cyan text-xl">•</span>
              <p>We store it for exactly 45 days so we can re-scan and catch re-appearances.</p>
            </div>
            <div className="flex gap-4">
              <span className="text-ghost-cyan text-xl">•</span>
              <p>On day 46 we permanently delete everything from our systems — gone forever.</p>
            </div>
            <div className="flex gap-4">
              <span className="text-ghost-cyan text-xl">•</span>
              <p>No accounts, no dashboards, no cookies, no tracking — we don't even use analytics.</p>
            </div>
            <div className="flex gap-4">
              <span className="text-ghost-cyan text-xl">•</span>
              <p>All processing happens in the US/EU-compliant regions.</p>
            </div>
            <div className="mt-6 text-center text-ghost-muted italic">
              We are privacy maximalists building for privacy maximalists.
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 py-12 flex flex-col items-center">

        <div className="max-w-2xl text-center mb-8">
          <p className="text-sm text-gray-400 leading-relaxed">
            DataGhost is an automation service that submits opt-out requests on your behalf. We are not attorneys and do not provide legal advice. Because each data broker maintains its own compliance and verification policies, we cannot guarantee removal from every broker.
          </p>
        </div>
        <div className="bg-ghost-card border border-ghost-border p-8 rounded-2xl shadow-glow max-w-md w-full text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-ghost-cyan to-transparent opacity-50"></div>
          <h2 className="text-2xl font-bold mb-6 text-white">Best One-Time Data Removal Service 2025 – $49</h2>
          <ul className="text-left space-y-3 mb-8 text-ghost-text/90">
            <li className="flex items-start gap-3">
              <span className="text-ghost-cyan mt-1">✓</span>
              <span>70+ brokers manually</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-ghost-cyan mt-1">✓</span>
              <span>Weekly re-scans for 45 days</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-ghost-cyan mt-1">✓</span>
              <span>No account, no login, no subscription, no renewals</span>
            </li>
          </ul>
          <Link
            href="https://buy.stripe.com/6oU4gA0to6pKbsdffe6oo01"
            className="block w-full bg-ghost-cyan text-black px-6 py-3 rounded-lg font-bold hover:opacity-90 transition shadow-[0_0_15px_rgba(0,229,255,0.3)]"
          >
            Ghost My Data Now – $49
          </Link>
          <p className="mt-3 text-xs text-ghost-muted">
            Launch pricing — goes to $79 soon
          </p>
        </div>
      </section>
      <section className="px-6 py-16 bg-ghost-navy/50">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">FAQ</h2>
          <div className="space-y-8">
            <div>
              <h3 className="text-xl font-bold text-white mb-2">Is this a subscription?</h3>
              <p className="text-ghost-muted">No  $49 one-time.</p>
            </div>
            <div>
              <h3 className="text-xl font-bold text-white mb-2">Do you keep my data?</h3>
              <p className="text-ghost-muted">We permanently delete everything after 45 days.</p>
            </div>
            <div>
              <h3 className="text-xl font-bold text-white mb-2">Do you have an account/dashboard?</h3>
              <p className="text-ghost-muted">No, we don't want your password either.</p>
            </div>
            <div>
              <h3 className="text-xl font-bold text-white mb-2">How long until I'm removed?</h3>
              <p className="text-ghost-muted">Most brokers remove within 7–30 days. We re-scan for 45 days.</p>
            </div>
            <div>
              <h3 className="text-xl font-bold text-white mb-2">What if a broker ignores the request?</h3>
              <p className="text-ghost-muted">We re-submit automatically.</p>
            </div>
            <div>
              <h3 className="text-xl font-bold text-white mb-2">Is this legal?</h3>
              <p className="text-ghost-muted">Yes — we're just automating public opt-out processes.</p>
            </div>
            <div>
              <h3 className="text-xl font-bold text-white mb-2">Refund policy?</h3>
              <p className="text-ghost-muted">Refund policy? Non-refundable after payment – service begins immediately.</p>
            </div>
            <div>
              <h3 className="text-xl font-bold text-white mb-2">Will this remove me from Google?</h3>
              <p className="text-ghost-muted">No — this is only data brokers/people-search sites. Google is separate.</p>
            </div>
          </div>
        </div>
      </section>
      <LandingInfo />
    </main>
  );
}

"use client";

import Link from "next/link";
import Image from "next/image";
import { LandingInfo } from "@/components/LandingInfo";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-ghost-navy text-ghost-text relative">
      <section className="relative bg-holo px-6 pt-28 pb-24 text-center overflow-hidden">
        <div className="flex justify-center mb-8">
          <Image
            src="/ghost.png"
            alt="DataGhost Mascot"
            width={140}
            height={140}
            className="animate-float drop-shadow-[0_0_30px_#00e5ff]"
          />
        </div>
        <h1 className="text-5xl md:text-6xl font-bold leading-tight">
          Ghost your data from{" "}
          <span className="text-ghost-cyan drop-shadow-[0_0_25px_rgba(0,229,255,0.65)]">
            80+ data brokers
          </span>
        </h1>

        <div className="mt-10 flex flex-col md:flex-row gap-4 justify-center">
          <Link
            href="/pricing"
            className="bg-ghost-cyan text-black px-10 py-4 rounded-full font-semibold shadow-glow hover:opacity-90 transition"
          >
            Start Ghosting My Data
          </Link>
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

      <LandingInfo />

      {/* pricing section can go here later, with id="pricing" */}
    </main>
  );
}

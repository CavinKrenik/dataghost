"use client";

import Link from "next/link";

const brokers = [
    "Spokeo",
    "Intelius",
    "BeenVerified",
    "PeopleFinders",
    "FastPeopleSearch",
    "TruePeopleSearch",
    "TruthFinder",
    "InstantCheckmate",
    "Whitepages",
    "MyLife",
    "Radaris",
    "Nuwber",
    "FamilyTreeNow",
    "PeekYou",
    "Clustrmaps",
    "That’sThem",
    "NeighborWho",
    "PrivateEye",
    "PeopleSmart",
    "USSearch",
    "SmartBackgroundChecks",
    "Cyberbackgroundchecks",
    "VoterRecords",
    "PublicRecords.com",
    // …add or remove based on your brokers.json
];

function SectionCard({
    title,
    children,
}: {
    title: string;
    children: React.ReactNode;
}) {
    return (
        <details className="group rounded-2xl border border-ghost-purple bg-ghost-navy-light text-sm text-ghost-text shadow-card">
            <summary className="flex cursor-pointer items-center justify-between px-6 py-4 font-semibold tracking-wide hover:text-ghost-cyan transition-colors">
                <span>{title}</span>
                <span className="text-xs text-ghost-cyan group-open:rotate-180 transition-transform">
                    ▼
                </span>
            </summary>
            <div className="border-t border-ghost-purple px-6 py-5 space-y-3 text-xs leading-relaxed text-ghost-muted">
                {children}
            </div>
        </details>
    );
}

export function LandingInfo() {
    return (
        <section className="mx-auto mt-10 flex max-w-4xl flex-col gap-4 px-4 pb-16">
            <SectionCard title="HOW DOES DATAGHOST WORK?">
                <ol className="list-decimal space-y-2 pl-4">
                    <li>
                        <strong className="text-white">Create your account.</strong> Sign up in seconds to unlock the dashboard.
                    </li>
                    <li>
                        <strong className="text-white">Tell us what they know.</strong> We need just enough to find your records—name, city, and age.
                    </li>
                    <li>
                        <strong className="text-white">We blast legal opt-out requests.</strong> We generate strict CCPA/GDPR demands and fire them off to 80+ brokers. You get CC&apos;d on everything.
                    </li>
                    <li>
                        <strong className="text-white">Watch the deletions roll in.</strong> We track every response. You get a permanent paper trail of who complied and when.
                    </li>
                    <li>
                        <strong className="text-white">We don&apos;t stop.</strong> Brokers are stubborn. We re-scan and re-send requests automatically when your data pops back up.
                    </li>
                    <li>
                        <strong className="text-white">We hold nothing.</strong> Your data is wiped from our servers after 45 days. We&apos;re a ghost, remember?
                    </li>
                </ol>
                <p className="pt-2 text-[0.7rem] text-[#b8b0ff]">
                    DataGhost does not guarantee permanent removal—data brokers are persistent—but we drastically reduce your exposure and give you a repeatable, automated weapon to fight back.
                </p>
            </SectionCard>

            <SectionCard title="WHO ARE THE DATA BROKERS?">
                <p>
                    Data brokers are the companies selling your secrets. They scrape public records, purchase histories, and social media to build profiles they sell to marketers, background-check services, and creeps.
                </p>
                <p className="pt-2">
                    DataGhost targets the worst offenders. We hit the high-impact people-search and background-check sites that expose you the most.
                </p>
                <div className="grid grid-cols-2 gap-x-6 gap-y-1 pt-3 text-[0.7rem]">
                    {brokers.map((b) => (
                        <span key={b}>• {b}</span>
                    ))}
                </div>
                <p className="pt-3 text-[0.7rem] text-[#b8b0ff]">
                    This list evolves. As new brokers crawl out of the woodwork, we add them to our hit list.
                </p>
            </SectionCard>

            <SectionCard title="WHO BUILT DATAGHOST?">
                <p>
                    DataGhost.me is an independent privacy tool built by Cavin Krenik. It&apos;s inspired by open-source privacy activism and powered by modern automation.
                </p>
                <p>
                    We stand on the shoulders of giants, but DataGhost is a standalone service with its own infrastructure, strict privacy policies, and dedicated support.
                </p>
                <p className="text-[0.7rem] text-[#b8b0ff]">
                    We are legally clean, ethically strict, and brutally transparent. We exist to give you control, not to become another data hoarder.
                </p>
            </SectionCard>

            {/* CTA under the info */}
            <div className="mt-4 flex justify-center">
                <Link
                    href="/checkout"
                    className="inline-flex items-center justify-center rounded-full bg-ghost-cyan px-8 py-3 text-sm font-semibold text-black shadow-glow hover:opacity-90 transition"
                >
                    View Pricing & Continue
                </Link>
            </div>
        </section>
    );
}

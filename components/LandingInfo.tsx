
import Link from "next/link";
const brokers = [
    "AdvancedBackgroundChecks",
    "BeenVerified",
    "CheckPeople",
    "Clustrmaps",
    "CocoFinder",
    "Cyberbackgroundchecks",
    "FamilyTreeNow",
    "FastPeopleSearch",
    "IdStrong",
    "InstantCheckmate",
    "MyLife",
    "NeighborWho",
    "NumLookup",
    "Nuwber",
    "PeekYou",
    "PeopleByName",
    "PeopleFinders",
    "PeopleSearchNow",
    "PrivateEye",
    "Radaris",
    "SearchPeopleFree",
    "SearchQuarry",
    "SmartBackgroundChecks",
    "Spytox",
    "TruePeopleSearch",
    "TruthFinder",
    "UnMask",
    "USPhoneBook",
    "Veripages",
    "VoterRecords",
    "Whitepages",
    "Xlek",
    "Acxiom",
    "BackgroundChecks.com",
    "Checkr",
    "Dataveria",
    "Epsilon",
    "Equifax",
    "Experian Marketing",
    "FullContact",
    "Intelius",
    "LexisNexis",
    "National Public Data",
    "Ofsearch",
    "Oracle Data Cloud",
    "PeopleConnect",
    "PeopleSmart",
    "RocketReach",
    "Spokeo",
    "That'sThem",
    "TransUnion",
    "USSearch",
    "ZoomInfo",
    "BidSwitch",
    "Comscore",
    "Criteo",
    "Cuebiq",
    "Gravy Analytics",
    "InMobi",
    "Killi",
    "LiveRamp",
    "Lusha",
    "NextRoll",
    "Nielsen",
    "Quantcast",
    "SalesIntel",
    "ShareThis",
    "Sovrn",
    "Start.io",
    "Tappx",
    "The Trade Desk",
    "TowerData",
    "Versium"
].sort();
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
                        <strong className="text-white">Pay $49 one-time.</strong> No subscription, no account created.
                    </li>
                    <li>
                        <strong className="text-white">Tell us the basics.</strong> After payment we ask only for your name, city, state, and age range.
                    </li>
                    <li>
                        <strong className="text-white">We launch the protocol.</strong> We blast legal opt-out emails to 40+ brokers (you are CC’d). Simultaneously, our <strong className="text-ghost-cyan">Ghost Worker</strong> physically navigates to the "hard" sites (like Whitepages & BeenVerified) to automate their removal forms for you.
                    </li>
                    <li>
                        <strong className="text-white">Watch the deletions roll in.</strong> As brokers respond, you receive their confirmation emails directly in your inbox.
                    </li>
                    <li>
                        <strong className="text-white">We keep going for 45 days.</strong> For 45 days we automatically re-scan and re-send removal requests if your data reappears.
                    </li>
                    <li>
                        <strong className="text-white">Then we ghost your data.</strong> We temporarily store your info for <strong className="text-ghost-cyan">exactly 45 days only</strong>. On day 46, a pg_cron job permanently deletes everything — no backups, no logs, gone forever.
                    </li>
                </ol>
                <p className="pt-2 text-[0.7rem] text-[#b8b0ff]">
                    DataGhost does not guarantee permanent removal—data brokers are persistent—but we drastically reduce your exposure and give you a repeatable, automated weapon to fight back against <strong>70+ brokers</strong>.
                </p>
            </SectionCard>
            <SectionCard title="WHO ARE THE DATA BROKERS?">
                <p>
                    Data brokers are the companies selling your secrets. They scrape public records, purchase histories, and social media to build profiles they sell to marketers, background-check services, and creeps.
                </p>
                <p className="pt-2">
                    DataGhost targets the worst offenders. We hit the high-impact people-search and background-check sites that expose you the most.
                </p>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-2 pt-4 text-sm sm:text-base">
                    {brokers.map((b) => (
                        <div key={b} className="flex items-center gap-2 min-w-0">
                            <span className="text-ghost-cyan shrink-0">•</span>
                            <span className="truncate" title={b}>
                                {b}
                            </span>
                        </div>
                    ))}
                </div>
                <p className="pt-3 text-[0.7rem] text-[#b8b0ff]">
                    This list evolves. As new brokers crawl out of the woodwork, we add them to our hit list.
                </p>
            </SectionCard>
            <SectionCard title="WHO BUILT DATAGHOST?">
                <p>
                    DataGhost was engineered by <strong>Cavin Krenik</strong>, a veteran commercial fisherman turned privacy engineer, currently completing his degree in Interactive Web Design.
                </p>
                <p className="pt-2">
                    Why the pivot? Because years at sea teach you two things: <strong>reliability is everything</strong>, and <strong>you don't keep what you don't need.</strong>
                </p>
                <p className="pt-2">
                    While studying design, I realized that <strong>good design isn't just pixels! It's respect.</strong> A subscription model for a one-time problem is bad design. I taught myself full-stack engineering to build a solution that is rugged, finite, and honest.
                </p>
                <p className="pt-3 text-[0.7rem] text-[#b8b0ff]">
                    Legally clean. Ethically strict. Brutally transparent. We delete your data after 45 days because we exist to give you control, not to become another data hoarder.
                </p>
            </SectionCard>
        </section>
    );
}

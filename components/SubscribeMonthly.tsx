import Link from "next/link";

export function SubscribeMonthly({ user }: { user: any }) {
    return (
        <Link
            href="/checkout?plan=monthly"
            className="mt-8 block w-full rounded-md bg-ghost-card border border-ghost-cyan/30 px-3 py-3 text-center text-sm font-semibold text-white shadow-sm hover:bg-ghost-cyan/10 hover:border-ghost-cyan focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ghost-cyan transition-all shadow-glow"
        >
            Get Monthly
        </Link>
    );
}

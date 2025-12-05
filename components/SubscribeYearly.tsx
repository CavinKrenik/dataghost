import Link from "next/link";

export function SubscribeYearly({ user }: { user: any }) {
    return (
        <Link
            href="/checkout?plan=yearly"
            className="mt-8 block w-full rounded-md bg-ghost-cyan px-3 py-3 text-center text-sm font-semibold text-ghost-bg shadow-sm hover:bg-ghost-cyanSoft focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ghost-cyan transition-all shadow-glow"
        >
            Get Yearly
        </Link>
    );
}

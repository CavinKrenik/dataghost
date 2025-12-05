import Link from "next/link";

export default function Footer() {
    return (
        <footer className="border-t border-cyan-900/40 mt-16">
            <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-8 text-sm text-slate-400 md:flex-row md:items-center md:justify-between">
                {/* Left block */}
                <div className="space-y-1">
                    <div className="font-semibold text-slate-200">DataGhost.me</div>
                    <div>© 2025 DataGhost.me</div>
                    <div className="text-xs text-slate-500">
                        Built on open-source from Visible Labs (MIT License)
                    </div>
                </div>

                {/* Right block (legal links) */}
                <nav className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs md:text-sm">
                    <Link
                        href="/legal/terms"
                        className="hover:text-cyan-300 transition-colors"
                    >
                        Terms of Service
                    </Link>
                    <Link
                        href="/legal/privacy"
                        className="hover:text-cyan-300 transition-colors"
                    >
                        Privacy Policy
                    </Link>
                    <Link
                        href="/legal/refund"
                        className="hover:text-cyan-300 transition-colors"
                    >
                        Refund Policy
                    </Link>
                    <Link
                        href="/legal/cookies"
                        className="hover:text-cyan-300 transition-colors"
                    >
                        Cookie Policy
                    </Link>
                    <Link
                        href="/legal/security"
                        className="hover:text-cyan-300 transition-colors"
                    >
                        Security Statement
                    </Link>
                </nav>
            </div>
        </footer>
    );
}

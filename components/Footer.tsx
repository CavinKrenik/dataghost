import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BarChart3, Cpu, Twitter, Instagram } from "lucide-react";
export default function Footer() {
    return (
        <footer className="border-t border-cyan-900/40 mt-16">
            <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 sm:px-8 lg:px-12 py-12 md:py-16 text-sm text-slate-400 md:flex-row md:items-center md:justify-between">
                { }
                <div className="space-y-1">
                    <div className="font-semibold text-slate-200">DataGhost.me</div>
                    {/* Contrast Fix: text-slate-500 -> text-slate-400 */}
                    <div className="text-xs text-slate-400">
                        Built open-source by privacy activists
                    </div>
                    {/* Touch Target Fix: Added py-2 */}
                    <a
                        href="mailto:hello@dataghost.me"
                        className="text-xs text-cyan-400 hover:underline block py-2"
                    >
                        hello@dataghost.me
                    </a>
                    {/* Touch Target Fix: Added py-2 */}
                    {/* Touch Target Fix: Added py-2 */}
                    <Link
                        href="/how-it-works"
                        className="text-xs text-slate-500 hover:text-white transition-colors flex items-center gap-1 mt-1 py-2"
                    >
                        <Cpu className="w-3 h-3" />
                        <span>Architecture (How it Works)</span>
                    </Link>
                    <div className="flex gap-4 mt-2 pl-0.5">
                        <a
                            href="https://x.com/DataghostMe"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-slate-500 hover:text-cyan-400 transition-colors"
                            aria-label="X (Twitter)"
                        >
                            <Twitter className="w-4 h-4" />
                        </a>
                        <a
                            href="https://instagram.com/dataghost.me"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-slate-500 hover:text-cyan-400 transition-colors"
                            aria-label="Instagram"
                        >
                            <Instagram className="w-4 h-4" />
                        </a>
                    </div>
                </div>
                { }
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
                    <Button
                        asChild
                        variant="outline"
                        className="border-cyan-700/60 text-cyan-300 hover:bg-cyan-900/30 hover:border-cyan-500 hover:text-white bg-black/20 backdrop-blur-md flex items-center gap-2"
                    >
                        <Link href="/comparison">
                            <BarChart3 className="w-4 h-4" />
                            Comparison
                        </Link>
                    </Button>
                </nav>
            </div>
        </footer>
    );
}

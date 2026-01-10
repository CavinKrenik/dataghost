import Link from "next/link";
import { Cpu, Twitter, Instagram } from "lucide-react";

export default function Footer() {
    return (
        <footer className="border-t border-cyan-900/40 mt-16 bg-black/20">
            <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12 py-12 md:py-16">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12">
                    {/* Column 1: Brand & Identity */}
                    <div className="space-y-4">
                        <div className="space-y-1">
                            <div className="font-semibold text-slate-200 text-lg">DataGhost.me</div>
                            <div className="text-xs text-slate-400 max-w-xs">
                                Built open-source by privacy activists to give you control over your digital footprint.
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <a
                                href="https://x.com/DataghostMe"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-slate-500 hover:text-cyan-400 transition-colors"
                                aria-label="X (Twitter)"
                            >
                                <Twitter className="w-5 h-5" />
                            </a>
                            <a
                                href="https://instagram.com/dataghost.me"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-slate-500 hover:text-cyan-400 transition-colors"
                                aria-label="Instagram"
                            >
                                <Instagram className="w-5 h-5" />
                            </a>
                        </div>
                    </div>

                    {/* Column 2: Product */}
                    <div className="flex flex-col gap-3">
                        <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Product</h3>
                        <Link href="/comparison" className="text-sm text-slate-400 hover:text-cyan-300 transition-colors">
                            Why DataGhost?
                        </Link>
                        <Link href="/how-it-works" className="text-sm text-slate-400 hover:text-cyan-300 transition-colors flex items-center gap-1.5">
                            <Cpu className="w-3.5 h-3.5" />
                            Architecture
                        </Link>
                        <Link href="https://buy.stripe.com/fZucN53Uv2iN75feUQ6kg00" className="text-sm text-slate-400 hover:text-cyan-300 transition-colors">
                            Pricing
                        </Link>
                    </div>

                    {/* Column 3: Support */}
                    <div className="flex flex-col gap-3">
                        <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Support</h3>
                        <a href="mailto:hello@dataghost.me" className="text-sm text-slate-400 hover:text-cyan-300 transition-colors">
                            hello@dataghost.me
                        </a>
                        <Link href="/#faq" className="text-sm text-slate-400 hover:text-cyan-300 transition-colors">
                            FAQ
                        </Link>
                    </div>

                    {/* Column 4: Legal */}
                    <div className="flex flex-col gap-3">
                        <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Legal</h3>
                        <Link href="/legal/terms" className="text-sm text-slate-400 hover:text-cyan-300 transition-colors">
                            Terms of Service
                        </Link>
                        <Link href="/legal/privacy" className="text-sm text-slate-400 hover:text-cyan-300 transition-colors">
                            Privacy Policy
                        </Link>
                        <Link href="/legal/refund" className="text-sm text-slate-400 hover:text-cyan-300 transition-colors">
                            Refund Policy
                        </Link>
                        <Link href="/legal/cookies" className="text-sm text-slate-400 hover:text-cyan-300 transition-colors">
                            Cookie Policy
                        </Link>
                        <Link href="/legal/security" className="text-sm text-slate-400 hover:text-cyan-300 transition-colors">
                            Security Statement
                        </Link>
                    </div>
                </div>

                <div className="mt-12 pt-8 border-t border-cyan-900/30 text-center md:text-left">
                    <p className="text-xs text-slate-600">
                        &copy; {new Date().getFullYear()} DataGhost. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}

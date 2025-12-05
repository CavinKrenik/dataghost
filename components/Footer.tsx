import Link from "next/link";

export default function Footer() {
    return (
        <footer className="border-t border-ghost-grid/40 bg-black/60 text-xs text-ghost-muted">
            <div className="mx-auto max-w-5xl px-6 py-8">
                <div className="flex flex-col md:flex-row justify-between gap-8">
                    {/* Brand & Copyright */}
                    <div className="flex flex-col gap-2">
                        <span className="font-semibold text-ghost-text">DataGhost.me</span>
                        <span>© {new Date().getFullYear()} DataGhost.me</span>
                        <span>Built on open-source from Visible Labs (MIT License)</span>
                    </div>

                    {/* Legal Links */}
                    <div className="flex flex-col gap-2 md:text-right">
                        <Link href="/legal/terms" className="hover:text-ghost-cyan transition">Terms of Service</Link>
                        <Link href="/legal/privacy" className="hover:text-ghost-cyan transition">Privacy Policy</Link>
                        <Link href="/legal/refund" className="hover:text-ghost-cyan transition">Refund Policy</Link>
                        <Link href="/legal/cookies" className="hover:text-ghost-cyan transition">Cookie Policy</Link>
                        <Link href="/legal/security" className="hover:text-ghost-cyan transition">Security Statement</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}

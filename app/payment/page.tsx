import Script from "next/script";

export default function PaymentPage() {
    return (
        <main className="min-h-screen bg-ghost-bg text-ghost-text flex flex-col items-center justify-center p-6">
            <div className="max-w-md w-full text-center space-y-8">
                <h1 className="text-3xl font-bold">One-Time Payment</h1>

                <p className="text-ghost-muted text-lg">
                    Pay once. No accounts. After checkout we’ll ask for the minimum info needed to ghost your data.
                </p>

                <div className="bg-ghost-card border border-ghost-border p-8 rounded-xl shadow-glow">
                    <a
                        href="https://dataghost.lemonsqueezy.com/buy/9f83b3ac-bdcf-41f9-a25f-3e524d7d9d2b?embed=1"
                        className="lemonsqueezy-button bg-ghost-cyan text-black px-8 py-4 rounded-full font-bold text-lg hover:opacity-90 transition w-full block"
                    >
                        Buy DataGhost One-time payment — $49
                    </a>
                    <Script src="https://assets.lemonsqueezy.com/lemon.js" strategy="lazyOnload" />
                </div>

                <p className="text-sm text-ghost-muted">
                    Secure payment via Lemon Squeezy.
                </p>
            </div>
        </main>
    );
}

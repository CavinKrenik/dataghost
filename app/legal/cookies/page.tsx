import type { Metadata } from "next";
export const metadata: Metadata = {
    title: "Cookie Policy | DataGhost.me",
    description: "Cookie Policy for DataGhost.me data removal service.",
};
export default function CookiePage() {
    return (
        <div className="mx-auto max-w-3xl px-6 py-12 md:py-20">
            <h1 className="mb-8 text-3xl font-bold text-ghost-text md:text-4xl">
                Cookie Policy
            </h1>
            <div className="space-y-8 text-ghost-muted">
                <section>
                    <h2 className="mb-4 text-xl font-semibold text-ghost-cyan">1. What Are Cookies?</h2>
                    <p className="leading-relaxed">
                        Cookies are small text files stored on your device when you visit a website. They help us recognize your device, remember your preferences, and ensure security.
                    </p>
                </section>

                <section>
                    <h2 className="mb-4 text-xl font-semibold text-ghost-cyan">2. How We Use Cookies</h2>
                    <p className="leading-relaxed">
                        We use cookies solely for essential functionality, not for tracking or advertising. Our use is limited to:
                    </p>
                    <ul className="mt-2 list-disc pl-5 space-y-2">
                        <li><strong>Essential Cookies:</strong> Necessary for the website to function, such as securely managing your user session (if applicable) and processing your purchase via Lemon Squeezy. These cannot be disabled.</li>
                        <li><strong>Functionality Cookies:</strong> Remember basic preferences to improve your experience.</li>
                    </ul>
                </section>

                <section>
                    <h2 className="mb-4 text-xl font-semibold text-ghost-cyan">3. Third-Party Cookies</h2>
                    <p className="leading-relaxed">
                        We use trusted third-party services that may also set cookies on your device, but **only for strictly necessary purposes** (e.g., processing payment and securing our connection to the database). These include:
                    </p>
                    <ul className="mt-2 list-disc pl-5 space-y-2">
                        <li><strong>Supabase:</strong> For database security and authentication session management.</li>
                        <li><strong>Netlify:</strong> For site performance and load balancing.</li>
                        <li><strong>Lemon Squeezy:</strong> For secure checkout and payment processing (PCI-DSS compliant).</li>
                    </ul>
                </section>

                <section>
                    <h2 className="mb-4 text-xl font-semibold text-ghost-cyan">4. Managing Cookies</h2>
                    <p className="leading-relaxed">
                        You can control and delete cookies through your browser settings. Please note that disabling essential cookies may prevent you from using the Service.
                    </p>
                    <p className="mt-2 leading-relaxed">
                        For more information on how to manage cookies, visit <a href="https://www.allaboutcookies.org" target="_blank" rel="noopener noreferrer" className="text-ghost-cyan hover:underline">allaboutcookies.org</a>.
                    </p>
                </section>

                <section>
                    <h2 className="mb-4 text-xl font-semibold text-ghost-cyan">5. Updates to This Policy</h2>
                    <p className="leading-relaxed">
                        We may update this Cookie Policy from time to time. Any changes will be posted on this page with an updated revision date.
                    </p>
                </section>
            </div>
        </div>
    );
}

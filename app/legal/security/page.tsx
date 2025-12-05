import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Security Statement | DataGhost.me",
    description: "Security Statement for DataGhost.me data removal service.",
};

export default function SecurityPage() {
    return (
        <div className="mx-auto max-w-3xl px-6 py-12 md:py-20">
            <h1 className="mb-8 text-3xl font-bold text-ghost-text md:text-4xl">
                Security Statement
            </h1>

            <div className="space-y-8 text-ghost-muted">
                <section>
                    <h2 className="mb-4 text-xl font-semibold text-ghost-cyan">1. Our Commitment</h2>
                    <p className="leading-relaxed">
                        At DataGhost.me, protecting your personal information is our top priority. We employ industry-standard security measures to ensure your data is safe, secure, and private.
                    </p>
                </section>

                <section>
                    <h2 className="mb-4 text-xl font-semibold text-ghost-cyan">2. Data Encryption</h2>
                    <p className="leading-relaxed">
                        <strong>In Transit:</strong> All data transmitted between your device and our servers is encrypted using TLS (Transport Layer Security) 1.2 or higher.
                    </p>
                    <p className="mt-2 leading-relaxed">
                        <strong>At Rest:</strong> Sensitive user data stored in our databases is encrypted at rest using AES-256 encryption standards.
                    </p>
                </section>

                <section>
                    <h2 className="mb-4 text-xl font-semibold text-ghost-cyan">3. Access Control</h2>
                    <p className="leading-relaxed">
                        Access to user data is strictly limited to authorized personnel who require it to perform their job duties (e.g., customer support). We enforce multi-factor authentication (MFA) for all administrative access.
                    </p>
                </section>

                <section>
                    <h2 className="mb-4 text-xl font-semibold text-ghost-cyan">4. Data Retention & Deletion</h2>
                    <p className="leading-relaxed">
                        We practice data minimization. User data used for scanning and opt-out requests is <strong>automatically deleted</strong> from our active servers 45 days after your purchase, reducing the risk of long-term data exposure.
                    </p>
                </section>

                <section>
                    <h2 className="mb-4 text-xl font-semibold text-ghost-cyan">5. Infrastructure Security</h2>
                    <p className="leading-relaxed">
                        We rely on world-class infrastructure providers:
                    </p>
                    <ul className="mt-2 list-disc pl-5 space-y-2">
                        <li><strong>Supabase:</strong> For secure, compliant database hosting.</li>
                        <li><strong>Netlify:</strong> For secure, distributed application hosting.</li>
                        <li><strong>Lemon Squeezy:</strong> For PCI-DSS compliant payment processing. We do not store your credit card information on our servers.</li>
                    </ul>
                </section>

                <section>
                    <h2 className="mb-4 text-xl font-semibold text-ghost-cyan">6. Responsible Disclosure</h2>
                    <p className="leading-relaxed">
                        If you believe you have found a security vulnerability in DataGhost.me, please contact us immediately at <a href="mailto:support@dataghost.me" className="text-ghost-cyan hover:underline">support@dataghost.me</a>. We appreciate your help in keeping our community safe.
                    </p>
                </section>
            </div>
        </div>
    );
}

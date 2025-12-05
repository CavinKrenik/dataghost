import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Terms of Service | DataGhost.me",
    description: "Terms of Service for DataGhost.me data removal service.",
};

export default function TermsPage() {
    return (
        <div className="mx-auto max-w-3xl px-6 py-12 md:py-20">
            <h1 className="mb-8 text-3xl font-bold text-ghost-text md:text-4xl">
                Terms of Service
            </h1>

            <div className="space-y-8 text-ghost-muted">
                <section>
                    <h2 className="mb-4 text-xl font-semibold text-ghost-cyan">1. Service Description</h2>
                    <p className="leading-relaxed">
                        DataGhost.me ("Service", "we", "us") provides a data privacy tool that assists users in identifying and opting out of personal data collection by third-party data brokers. Our Service includes automated removal requests, periodic re-scans, and reporting on the status of these requests.
                    </p>
                    <p className="mt-4 leading-relaxed">
                        Please note that DataGhost.me is <strong>not a legal service</strong>. We do not guarantee 100% removal of your data from all data brokers, as third-party compliance is outside our direct control. We act as your agent to submit opt-out requests on your behalf.
                    </p>
                </section>

                <section>
                    <h2 className="mb-4 text-xl font-semibold text-ghost-cyan">2. User Responsibilities</h2>
                    <p className="leading-relaxed">
                        By using our Service, you agree to:
                    </p>
                    <ul className="mt-2 list-disc pl-5 space-y-2">
                        <li>Provide accurate, current, and complete information required for the opt-out process.</li>
                        <li>Maintain the security of your account credentials.</li>
                        <li>Use the Service only for your own personal data or for individuals for whom you have legal authority to act.</li>
                        <li>Not use the Service for any illegal or unauthorized purpose.</li>
                    </ul>
                </section>

                <section>
                    <h2 className="mb-4 text-xl font-semibold text-ghost-cyan">3. Payment & Subscription</h2>
                    <p className="leading-relaxed">
                        <strong>Billing:</strong> Services are billed on a subscription basis (monthly or yearly) via our payment processor, Lemon Squeezy.
                    </p>
                    <p className="mt-2 leading-relaxed">
                        <strong>Renewals:</strong> Subscriptions automatically renew at the end of each billing cycle unless cancelled. You may cancel your subscription at any time through your dashboard or by contacting support.
                    </p>
                    <p className="mt-2 leading-relaxed">
                        <strong>Cancellation:</strong> Cancellation stops future billing. Your service will continue until the end of the current paid period.
                    </p>
                </section>

                <section>
                    <h2 className="mb-4 text-xl font-semibold text-ghost-cyan">4. Refund Policy</h2>
                    <p className="leading-relaxed">
                        Due to the immediate and irreversible nature of the work we perform (automated data scanning and opt-out submission), <strong>we do not offer refunds once the opt-out process has begun</strong>.
                    </p>
                    <p className="mt-2 leading-relaxed">
                        Exceptions are made only for:
                    </p>
                    <ul className="mt-2 list-disc pl-5 space-y-2">
                        <li>Technical errors resulting in duplicate charges.</li>
                        <li>Proven fraudulent billing.</li>
                    </ul>
                </section>

                <section>
                    <h2 className="mb-4 text-xl font-semibold text-ghost-cyan">5. Disclaimers & Limitation of Liability</h2>
                    <p className="leading-relaxed">
                        The Service is provided "as is" and "as available" without warranties of any kind. We are not liable for the failure of any data broker to honor an opt-out request or for any data that reappears after removal.
                    </p>
                    <p className="mt-2 leading-relaxed">
                        In no event shall DataGhost.me be liable for any indirect, incidental, special, consequential, or punitive damages arising out of or related to your use of the Service.
                    </p>
                </section>

                <section>
                    <h2 className="mb-4 text-xl font-semibold text-ghost-cyan">6. Governing Law</h2>
                    <p className="leading-relaxed">
                        These Terms shall be governed by and construed in accordance with the laws of <strong>Washington State, USA</strong>, without regard to its conflict of law provisions.
                    </p>
                </section>

                <section>
                    <h2 className="mb-4 text-xl font-semibold text-ghost-cyan">7. Contact Us</h2>
                    <p className="leading-relaxed">
                        If you have any questions about these Terms, please contact us at: <a href="mailto:support@dataghost.me" className="text-ghost-cyan hover:underline">support@dataghost.me</a>.
                    </p>
                </section>
            </div>
        </div>
    );
}

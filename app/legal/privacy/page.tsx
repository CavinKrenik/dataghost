import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Privacy Policy | DataGhost.me",
    description: "Privacy Policy for DataGhost.me data removal service.",
};

export default function PrivacyPage() {
    return (
        <div className="mx-auto max-w-3xl px-6 py-12 md:py-20">
            <h1 className="mb-8 text-3xl font-bold text-ghost-text md:text-4xl">
                Privacy Policy
            </h1>

            <div className="space-y-8 text-ghost-muted">
                <section>
                    <h2 className="mb-4 text-xl font-semibold text-ghost-cyan">1. Information We Collect</h2>
                    <p className="leading-relaxed">
                        To provide our data removal service, we collect the following information:
                    </p>
                    <ul className="mt-2 list-disc pl-5 space-y-2">
                        <li><strong>Personal Information:</strong> Name, email address, phone number, date of birth, and home addresses. This data is required to identify your records on data broker sites.</li>
                        <li><strong>Payment Data:</strong> Payment history (processed via Lemon Squeezy).</li>
                        <li><strong>Technical Data:</strong> IP address, browser type, and device information for security and analytics.</li>
                        <li><strong>Scan Results:</strong> Data found on public data broker databases during our scans.</li>
                    </ul>
                </section>

                <section>
                    <h2 className="mb-4 text-xl font-semibold text-ghost-cyan">2. How We Use Your Data</h2>
                    <p className="leading-relaxed">
                        We use your data solely for:
                    </p>
                    <ul className="mt-2 list-disc pl-5 space-y-2">
                        <li>Scanning data broker databases for your personal information.</li>
                        <li>Submitting opt-out and removal requests on your behalf.</li>
                        <li>Providing customer support.</li>
                        <li>Improving our Service security and functionality.</li>
                    </ul>
                </section>

                <section>
                    <h2 className="mb-4 text-xl font-semibold text-ghost-cyan">3. Data Retention</h2>
                    <p className="leading-relaxed">
                        We retain your personal information only as long as necessary to provide the Service.
                    </p>
                    <p className="mt-2 leading-relaxed">
                        <strong>Automatic Deletion:</strong> Your personal data used for scans is deleted from our active servers within <strong>45 days</strong> after your purchase, unless a longer retention period is required by law.
                    </p>
                </section>

                <section>
                    <h2 className="mb-4 text-xl font-semibold text-ghost-cyan">4. Third-Party Processors</h2>
                    <p className="leading-relaxed">
                        We use trusted third-party service providers to operate our business. These include:
                    </p>
                    <ul className="mt-2 list-disc pl-5 space-y-2">
                        <li><strong>Supabase:</strong> Database and authentication services.</li>
                        <li><strong>Netlify:</strong> Hosting and serverless functions.</li>
                        <li><strong>Lemon Squeezy:</strong> Payment processing and billing (Merchant of Record).</li>
                    </ul>
                    <p className="mt-2 leading-relaxed">
                        We do <strong>not</strong> sell your data to third parties.
                    </p>
                </section>

                <section>
                    <h2 className="mb-4 text-xl font-semibold text-ghost-cyan">5. Your Rights</h2>
                    <p className="leading-relaxed">
                        Depending on your location (including GDPR and CCPA jurisdictions), you have the right to:
                    </p>
                    <ul className="mt-2 list-disc pl-5 space-y-2">
                        <li>Access the personal data we hold about you.</li>
                        <li>Request correction of inaccurate data.</li>
                        <li>Request deletion of your data.</li>
                        <li>Export your data.</li>
                    </ul>
                    <p className="mt-2 leading-relaxed">
                        To exercise these rights, please contact us at <a href="mailto:support@dataghost.me" className="text-ghost-cyan hover:underline">support@dataghost.me</a>.
                    </p>
                </section>

                <section>
                    <h2 className="mb-4 text-xl font-semibold text-ghost-cyan">6. Cookies</h2>
                    <p className="leading-relaxed">
                        We use cookies to maintain your session, secure your account, and analyze site traffic. You can control cookie preferences through your browser settings. See our <a href="/legal/cookies" className="text-ghost-cyan hover:underline">Cookie Policy</a> for more details.
                    </p>
                </section>

                <section>
                    <h2 className="mb-4 text-xl font-semibold text-ghost-cyan">7. Contact Us</h2>
                    <p className="leading-relaxed">
                        DataGhost.me is located in Washington State, USA. For privacy-related inquiries, contact: <a href="mailto:support@dataghost.me" className="text-ghost-cyan hover:underline">support@dataghost.me</a>.
                    </p>
                </section>
            </div>
        </div>
    );
}

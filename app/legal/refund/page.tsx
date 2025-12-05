import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Refund Policy | DataGhost.me",
    description: "Refund Policy for DataGhost.me data removal service.",
};

export default function RefundPage() {
    return (
        <div className="mx-auto max-w-3xl px-6 py-12 md:py-20">
            <h1 className="mb-8 text-3xl font-bold text-ghost-text md:text-4xl">
                Refund Policy
            </h1>

            <div className="space-y-8 text-ghost-muted">
                <section>
                    <h2 className="mb-4 text-xl font-semibold text-ghost-cyan">1. No Refunds After Service Begins</h2>
                    <p className="leading-relaxed">
                        DataGhost.me initiates work immediately upon your subscription. This involves automated scanning of data broker databases and the submission of opt-out requests. Because this work is irreversible and incurs immediate costs, <strong>we do not offer refunds once the opt-out process has begun</strong>.
                    </p>
                </section>

                <section>
                    <h2 className="mb-4 text-xl font-semibold text-ghost-cyan">2. Eligible Refund Circumstances</h2>
                    <p className="leading-relaxed">
                        We will issue a full refund only under the following specific circumstances:
                    </p>
                    <ul className="mt-2 list-disc pl-5 space-y-2">
                        <li><strong>Duplicate Charges:</strong> If a technical error causes you to be billed twice for the same billing period.</li>
                        <li><strong>Fraudulent Transactions:</strong> If you can demonstrate that your card was used without your authorization.</li>
                        <li><strong>Billing Errors:</strong> If you were charged after a confirmed cancellation date.</li>
                    </ul>
                </section>

                <section>
                    <h2 className="mb-4 text-xl font-semibold text-ghost-cyan">3. How to Request a Refund</h2>
                    <p className="leading-relaxed">
                        To request a refund for an eligible circumstance, please email us at <a href="mailto:support@dataghost.me" className="text-ghost-cyan hover:underline">support@dataghost.me</a> with the subject line "Refund Request".
                    </p>
                    <p className="mt-2 leading-relaxed">
                        Please include:
                    </p>
                    <ul className="mt-2 list-disc pl-5 space-y-2">
                        <li>Your account email address.</li>
                        <li>Date of the transaction.</li>
                        <li>Reason for the request.</li>
                    </ul>
                </section>

                <section>
                    <h2 className="mb-4 text-xl font-semibold text-ghost-cyan">4. Payment Processing</h2>
                    <p className="leading-relaxed">
                        All payments and refunds are processed securely through our Merchant of Record, <strong>Lemon Squeezy</strong>. Refunds, when approved, will be credited back to your original method of payment within 5-10 business days.
                    </p>
                </section>
            </div>
        </div>
    );
}

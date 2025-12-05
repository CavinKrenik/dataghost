"use client";

import { DataBrokerWizard } from "@/components/data-broker-remover/DataBrokerWizard";

export default function DataBrokerRemoverPage() {
    return (
        <main className="min-h-screen bg-ghost-bg p-6 flex flex-col items-center justify-center">
            <div className="max-w-4xl w-full">
                <div className="text-center mb-12">
                    <h1 className="text-3xl font-bold text-white mb-2">
                        Data Broker Remover
                    </h1>
                    <p className="text-ghost-muted">
                        Opt-out from 80+ data brokers automatically.
                    </p>
                </div>

                <DataBrokerWizard />
            </div>
        </main>
    );
}

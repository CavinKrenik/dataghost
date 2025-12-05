

import { DataBrokerWizard } from "@/components/data-broker-remover/DataBrokerWizard";
import Image from "next/image";
import { requireActiveSubscriber } from "@/lib/profile";

export default async function DashboardPage() {
  await requireActiveSubscriber();

  return (
    <div className="min-h-screen bg-ghost-bg py-10 px-4">
      <div className="mx-auto max-w-5xl space-y-8">
        <div className="flex items-center gap-4 mb-6">
          <Image
            src="/ghost.png"
            alt="DataGhost Icon"
            width={50}
            height={50}
          />
          <h1 className="text-4xl font-bold">Your DataGhost Dashboard</h1>
        </div>
        <p className="text-ghost-muted text-sm">
          You&apos;re now unlocked. Use the wizard below to start sending
          opt-out requests to supported data brokers.
        </p>
        <div className="rounded-3xl border border-ghost-grid/40 bg-ghost-card p-4 md:p-6 shadow-glow/50">
          <DataBrokerWizard />
        </div>
      </div>
    </div>
  );
}

import Link from "next/link";
import Image from "next/image";

// Convert to a Server Component to receive searchParams from the Server Action redirect
export default function SuccessPage({
  searchParams,
}: {
  searchParams?: {
    emails?: string;
    forms?: string;
  };
}) {

  const emailCount = parseInt(searchParams?.emails || '41');
  const formCount = parseInt(searchParams?.forms || '41');
  const totalActions = emailCount + formCount;

  return (
    <div className="min-h-screen bg-ghost-bg flex flex-col items-center justify-center p-4 text-center">
      <Image
        src="/ghost.png"
        alt="DataGhost successful data removal"
        width={80}
        height={80}
        className="drop-shadow-[0_0_12px_#00e5ff]"
      />
      <h1 className="mt-8 text-4xl font-bold text-white">
        Ghosting Initiated!
      </h1>
      <p className="mt-4 text-xl text-ghost-cyan max-w-md">
        We have launched your {totalActions} removal actions.
      </p>

      <div className="mt-8 max-w-xl bg-ghost-navy-dark border border-ghost-grid rounded-xl p-6 text-left">
        <h3 className="text-white font-bold text-lg mb-4 border-b border-gray-700 pb-2">
          What to Expect
        </h3>
        <p className="text-sm text-ghost-muted mb-4">
          <strong className="text-white">✔ ACTION 1: Automated Emails Sent</strong>
          <br />
          We just sent **{emailCount}** opt-out emails to data brokers and ad-tech firms. Check your inbox (and spam) for confirmation replies.
        </p>
        <p className="text-sm text-ghost-muted mb-4">
          <strong className="text-white">✔ ACTION 2: Ghost Worker Deployed</strong>
          <br />
          Our powerful Ghost Worker is now processing **{formCount}** form-based submissions in the background (e.g., BeenVerified, Whitepages).
        </p>
        <p className="text-sm text-ghost-muted mb-4">
          <strong className="text-white">Total Removal Actions Launched: {totalActions}</strong>
        </p>
        <p className="text-sm text-ghost-muted mt-4">
          <strong className="text-white">Note:</strong> A small number of brokers (like Acxiom) may reply asking for a signed form or ID.
          This is a standard stalling tactic. We provide a guide on how to handle these specific cases in your confirmation email.
        </p>
      </div>
      <div className="mt-6">
        <Link href="/comparison" className="text-ghost-cyan hover:underline font-medium text-lg">
          See how you just beat every subscription service →
        </Link>
      </div>
      <Link
        href="/"
        className="mt-8 rounded-md bg-ghost-cyan px-8 py-3 text-lg font-semibold text-ghost-bg shadow-sm hover:bg-ghost-cyanSoft transition-all shadow-glow"
      >
        Return to Home
      </Link>
    </div>
  );
}

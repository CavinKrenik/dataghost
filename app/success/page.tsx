import Link from "next/link";
import Image from "next/image";

export default function SuccessPage() {
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
        Payment Successful!
      </h1>
      <p className="mt-4 text-xl text-ghost-muted max-w-md">
        Thank you for your payment. Please check your email for next steps.
      </p>
      <Link
        href="/"
        className="mt-8 rounded-md bg-ghost-cyan px-8 py-3 text-lg font-semibold text-ghost-bg shadow-sm hover:bg-ghost-cyanSoft transition-all shadow-glow"
      >
        Return to Home
      </Link>
    </div>
  );
}

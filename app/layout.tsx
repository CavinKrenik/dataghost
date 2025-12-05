import type { Metadata } from "next";
import "./globals.css";
import Image from "next/image";
import Link from "next/link";
import type React from "react";
import { getCurrentUser } from "@/lib/auth";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "DataGhost.me – Vanish from Data Brokers",
  description:
    "One-click opt-out requests to 80+ data brokers with weekly re-scans and 45-day data deletion.",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  return (
    <html lang="en">
      <body className="min-h-screen bg-ghost-bg text-ghost-text">
        <div className="min-h-screen flex flex-col">
          {/* Header */}
          <header className="border-b border-ghost-grid/40 bg-black/40 backdrop-blur-sm">
            <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
              <Link href="/" className="flex items-center gap-3">
                <Image
                  src="/ghost.png"
                  alt="DataGhost Logo"
                  width={40}
                  height={40}
                  className="drop-shadow-[0_0_12px_#00e5ff]"
                />
                <div>
                  <div className="text-xl font-semibold tracking-tight">
                    DataGhost<span className="text-ghost-cyan">.me</span>
                  </div>
                  <div className="text-xs text-ghost-muted">
                    Ghost your data from 80+ brokers.
                  </div>
                </div>
              </Link>

              <nav className="flex items-center gap-4 text-sm">
                <Link
                  href="/pricing"
                  className="hover:text-ghost-cyan transition"
                >
                  Plans & Pricing
                </Link>
                {user ? (
                  <Link
                    href="/dashboard"
                    className="hover:text-ghost-cyan transition"
                  >
                    Dashboard
                  </Link>
                ) : (
                  <Link
                    href="/login"
                    className="hover:text-ghost-cyan transition"
                  >
                    Sign In
                  </Link>
                )}
              </nav>
            </div>
          </header>

          {/* Main */}
          <main className="flex-1">{children}</main>

          {/* Footer */}
          <Footer />
        </div>
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import "./globals.css";
import Image from "next/image";
import Link from "next/link";
import type React from "react";
import { getCurrentUser } from "@/lib/auth";
import Footer from "@/components/Footer";
import { StickyCTA } from "@/components/StickyCTA";

export const metadata: Metadata = {
  title: "DataGhost – Remove Your Personal Data from 80+ Data Brokers | One-Time $49",
  description:
    "DataGhost permanently removes your personal information from 80+ data brokers with a single $49 one-time payment. No subscriptions. No dashboards. No data stored. Full report included.",
  keywords: [
    "data removal service",
    "data broker opt out",
    "privacy protection",
    "delete my data online",
    "remove personal information",
    "data broker removal",
    "people search site removal",
    "one time data removal",
    "DataGhost",
  ],
  openGraph: {
    type: "website",
    url: "https://dataghost.me/",
    siteName: "DataGhost",
    title: "DataGhost – Remove Your Personal Data from 80+ Data Brokers",
    description:
      "Permanently remove your personal info from 80+ data brokers with a one-time $49 service. No accounts. No subscriptions. No stored PII.",
    images: [
      {
        url: "https://dataghost.me/og-image.png",
        width: 1200,
        height: 630,
        alt: "DataGhost Privacy Service",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@dataghost",
    title: "DataGhost – Remove Your Personal Data from 80+ Data Brokers",
    description:
      "Permanently remove your personal data from 80+ brokers for $49. One-time payment. Zero stored personal information.",
    images: ["https://dataghost.me/og-image.png"],
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon.png", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
  metadataBase: new URL("https://dataghost.me"),
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://dataghost.me/",
  },
  verification: {
    other: {
      "msvalidate.01": "43D8458B6CB20206F4C08FE460880147",
    },
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://dataghost.me/#organization",
      name: "DataGhost",
      url: "https://dataghost.me",
      logo: {
        "@type": "ImageObject",
        url: "https://dataghost.me/logo.png",
        width: 512,
        height: 512,
      },
      sameAs: ["https://x.com/dataghost", "https://www.facebook.com/dataghost"],
      description:
        "DataGhost removes your personal information from 80+ data brokers with a one-time $49 service. No subscriptions, no accounts, no stored personal data.",
      contactPoint: [
        {
          "@type": "ContactPoint",
          contactType: "customer support",
          email: "support@dataghost.me",
        },
      ],
    },
    {
      "@type": "WebSite",
      "@id": "https://dataghost.me/#website",
      url: "https://dataghost.me",
      name: "DataGhost",
      description: "Remove Your Personal Data from 80+ Data Brokers",
      publisher: {
        "@id": "https://dataghost.me/#organization",
      },
      inLanguage: "en-US",
    },
    {
      "@type": "BreadcrumbList",
      "@id": "https://dataghost.me/#breadcrumb",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: "https://dataghost.me",
        },
      ],
    },
    {
      "@type": "FAQPage",
      "@id": "https://dataghost.me/#faq",
      mainEntity: [
        {
          "@type": "Question",
          name: "How does DataGhost work?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "It works in 6 steps: 1) Pay $49 one-time (no subscription). 2) Provide basic info (name, city, state, age). 3) We blast opt-out requests to 80+ data brokers. 4) You receive confirmation emails and a PDF report. 5) We re-scan for 45 days. 6) After 45 days, we permanently delete your data from our systems.",
          },
        },
        {
          "@type": "Question",
          name: "Who are the data brokers?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Data brokers are companies that scrape and sell your personal information. DataGhost targets the worst offenders including Spokeo, Intelius, BeenVerified, PeopleFinders, FastPeopleSearch, TruePeopleSearch, and 80+ others.",
          },
        },
        {
          "@type": "Question",
          name: "Who built DataGhost?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "DataGhost is an independent privacy tool built by Cavin Krenik. It is a standalone service with its own infrastructure, strict privacy policies, and dedicated support, designed to give you control over your data.",
          },
        },
      ],
    },
    {
      "@type": "Service",
      "@id": "https://dataghost.me/#service",
      name: "Data Broker Removal Service",
      provider: {
        "@id": "https://dataghost.me/#organization",
      },
      description:
        "Automated removal of personal information from 80+ data broker databases.",
      offers: {
        "@type": "Offer",
        price: "49.00",
        priceCurrency: "USD",
        description: "One-time payment for 45 days of protection and removal.",
      },
    },
  ],
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
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
                  href="/payment"
                  className="bg-ghost-cyan text-black px-5 py-2 rounded-full font-semibold hover:opacity-90 transition shadow-glow text-xs md:text-sm"
                >
                  Ghost My Data – $49
                </Link>
              </nav>
            </div>
          </header>

          {/* Main */}
          <main className="flex-1">{children}</main>

          {/* Footer */}
          <Footer />
          <StickyCTA />
        </div>
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import "./globals.css";
import Image from "next/image";
import Link from "next/link";
import type React from "react";
import { getCurrentUser } from "@/lib/auth";
import Footer from "@/components/Footer";
import { StickyCTA } from "@/components/StickyCTA";
import { Button } from "@/components/ui/button";
import { BarChart3 } from "lucide-react";
export const metadata: Metadata = {
  // OPTIMIZED: 58 characters (Perfect for Bing/Google)
  title: "DataGhost: Remove Your Data from 70+ Brokers ($49 One-Time)",

  // OPTIMIZED: 153 characters (Fits perfectly in the snippet)
  description:
    "Remove personal info from Spokeo, Whitepages, and 70+ brokers for $49 one-time. No subscription, no account. The best 2025 alternative to DeleteMe.",

  keywords: [
    "data removal service",
    "deleteme alternative",
    "incogni alternative",
    "one time payment data removal",
    "remove my data from google",
    "privacy tool",
    "data broker opt out",
  ],
  openGraph: {
    type: "website",
    url: "https://dataghost.me",
    siteName: "DataGhost",
    title: "DataGhost – Best One-Time Data Removal Service 2025 ($49 Forever)",
    description:
      "Remove your data from 70+ brokers once. No subscription. The clearest winner vs DeleteMe, Incogni, Optery, Kanary.",
    images: [
      {
        url: "/opengraph-image.jpg",
        width: 1200,
        height: 630,
        alt: "DataGhost – Best One-Time Data Removal Service",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@DataghostMe",
    title: "DataGhost – Best One-Time Data Removal Service 2025 ($49 Forever)",
    description:
      "Remove your data from 70+ brokers once. No subscription. The clearest winner vs DeleteMe, Incogni, Optery, Kanary.",
    images: ["/opengraph-image.jpg"],
  },
  icons: {
    icon: [
      { url: "/favicon-48x48.png", type: "image/png", sizes: "48x48" },
      { url: "/favicon-96x96.png", type: "image/png", sizes: "96x96" },
      { url: "/favicon-144x144.png", type: "image/png", sizes: "144x144" },
      { url: "/favicon-192x192.png", type: "image/png", sizes: "192x192" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
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
      sameAs: ["https://x.com/DataghostMe", "https://instagram.com/dataghost.me"],
      description:
        "DataGhost is the best one-time data removal service of 2025. We remove your personal information from 70+ data brokers for a single $49 payment. No subscriptions.",
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
      description: "Remove your data from 70+ brokers ONCE for $49. No subscription. The best DeleteMe/Incogni alternative in 2025 – automatic + manual opt-outs, weekly rescans, full removal report.",
      publisher: {
        "@id": "https://dataghost.me/#organization",
      },
      inLanguage: "en-US",
      potentialAction: {
        "@type": "SearchAction",
        target: "https://dataghost.me/search?q={search_term_string}",
        "query-input": "required name=search_term_string"
      },
    },
    {
      "@type": "Offer",
      "name": "DataGhost One-Time Data Removal",
      "price": "49",
      "priceCurrency": "USD",
      "description": "Remove your data from 70+ brokers forever. One payment, no subscription.",
      "url": "https://dataghost.me",
      "seller": {
        "@id": "https://dataghost.me/#organization"
      }
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
            text: "It works in 6 steps: 1) Pay $49 one-time (no subscription). 2) Provide basic info (name, city, state, age). 3) We blast opt-out requests to 70+ data brokers. 4) You receive confirmation emails. 5) We re-scan for 45 days. 6) After 45 days, we permanently delete your data from our systems.",
          },
        },
        {
          "@type": "Question",
          name: "Who are the data brokers?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Data brokers are companies that scrape and sell your personal information. DataGhost targets the worst offenders including Spokeo, Intelius, BeenVerified, PeopleFinders, FastPeopleSearch, TruePeopleSearch, and 70+ others.",
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
      "serviceType": "Data Removal Service",
      "provider": {
        "@type": "Organization",
        "name": "DataGhost",
        "url": "https://dataghost.me"
      },
      "offers": {
        "@type": "Offer",
        "price": "49",
        "priceCurrency": "USD",
        "description": "One-time permanent data removal from 70+ data brokers"
      },
      "areaServed": "Worldwide"
    }
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
        <div className="min-h-screen flex flex-col pb-24 md:pb-0">
          { }
          <header className="border-b border-ghost-grid/40 bg-black/40 backdrop-blur-sm sticky top-0 z-50">
            <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 gap-4">
              <Link href="/" className="flex items-center gap-3 shrink-0">
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
                  <div className="text-xs text-ghost-muted hidden sm:block">
                    Ghost your data from 70+ brokers.
                  </div>
                </div>
              </Link>
              <nav className="flex items-center gap-4 text-sm shrink-0">
                <Button
                  asChild
                  variant="outline"
                  className="hidden lg:flex items-center gap-2 border-cyan-700/60 text-cyan-300 hover:bg-cyan-900/30 hover:border-cyan-500 hover:text-white bg-black/20 backdrop-blur-md mr-2"
                >
                  <Link href="/comparison">
                    <BarChart3 className="w-4 h-4" />
                    Comparison
                  </Link>
                </Button>
                <Link
                  href="https://buy.stripe.com/6oU4gA0to6pKbsdffe6oo01"
                  className="bg-ghost-cyan text-black px-4 py-2 md:px-5 md:py-2 rounded-full font-semibold hover:opacity-90 transition shadow-glow text-xs md:text-sm whitespace-nowrap"
                >
                  Ghost My Data – $49
                </Link>
              </nav>
            </div>
          </header>
          { }
          <main className="flex-1">{children}</main>
          { }
          <Footer />
          <StickyCTA />
        </div>
      </body>
    </html>
  );
}

"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export function StickyCTA() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            // Show after scrolling down 100px
            if (window.scrollY > 100) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    if (!isVisible) return null;

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-ghost-navy/95 backdrop-blur-md border-t border-ghost-cyan/30 p-4 z-50 md:hidden animate-slide-up">
            <div className="flex items-center justify-between gap-4">
                <div className="text-sm">
                    <p className="font-bold text-white">Ghost your data</p>
                    <p className="text-xs text-ghost-muted">One-time $49 · No account</p>
                </div>
                <Link
                    href="/payment"
                    className="bg-ghost-cyan text-black px-5 py-2.5 rounded-full font-bold text-sm shadow-glow whitespace-nowrap"
                >
                    Get Started
                </Link>
            </div>
        </div>
    );
}

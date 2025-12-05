'use client';

import { useState } from 'react';
import Image from 'next/image';
import { startGhosting } from './actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function StartPage() {
    const [pending, setPending] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [count, setCount] = useState(0);
    const [manualBrokersCount, setManualBrokersCount] = useState(0);
    const [pdfBase64, setPdfBase64] = useState<string | null>(null);

    async function handleSubmit(formData: FormData) {
        setPending(true);
        setError(null);
        try {
            const result = await startGhosting(undefined, formData);
            if (result.success) {
                setCount(result.count || 0);
                setManualBrokersCount(result.manualBrokersCount || 0);
                setPdfBase64(result.pdfBase64 || null);
                setSuccess(true);
            } else {
                setError(result.error || 'Something went wrong. Please try again.');
            }
        } catch (err: any) {
            console.error('Form submission error:', err);
            setError(err.message || 'An unexpected error occurred.');
        } finally {
            setPending(false);
        }
    }

    return (
        <main className="min-h-screen bg-ghost-navy text-ghost-text relative bg-holo flex flex-col items-center justify-center p-6">

            {/* Floating Ghost */}
            <div className="mb-8">
                <Image
                    src="/ghost.png"
                    alt="DataGhost Mascot"
                    width={120}
                    height={120}
                    className="animate-float drop-shadow-[0_0_30px_#00e5ff]"
                    priority
                />
            </div>

            <div className="max-w-xl w-full bg-ghost-navy-light/80 backdrop-blur-md border border-ghost-grid rounded-3xl p-8 shadow-card">

                {!success ? (
                    <>
                        <h1 className="text-3xl md:text-4xl font-bold mb-4 text-center leading-tight">
                            Payment successful – you're now being ghosted 👻
                        </h1>
                        <p className="text-ghost-muted text-center mb-8 text-lg">
                            Last step: tell us the basics so we can nuke your data from 80+ brokers.
                        </p>

                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                handleSubmit(new FormData(e.currentTarget));
                            }}
                            className="space-y-5"
                        >

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div className="space-y-2">
                                    <Label htmlFor="fullName" className="text-ghost-text">Full Name</Label>
                                    <Input
                                        id="fullName"
                                        name="fullName"
                                        placeholder="Jane Doe"
                                        required
                                        className="bg-ghost-purple border-ghost-grid text-white placeholder:text-gray-500 focus:border-ghost-cyan"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="email" className="text-ghost-text">Email Address</Label>
                                    <Input
                                        id="email"
                                        name="email"
                                        type="email"
                                        placeholder="jane@example.com"
                                        required
                                        className="bg-ghost-purple border-ghost-grid text-white placeholder:text-gray-500 focus:border-ghost-cyan"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                                <div className="space-y-2">
                                    <Label htmlFor="city" className="text-ghost-text">City</Label>
                                    <Input
                                        id="city"
                                        name="city"
                                        placeholder="New York"
                                        required
                                        className="bg-ghost-purple border-ghost-grid text-white placeholder:text-gray-500 focus:border-ghost-cyan"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="state" className="text-ghost-text">State</Label>
                                    <Input
                                        id="state"
                                        name="state"
                                        placeholder="NY"
                                        required
                                        className="bg-ghost-purple border-ghost-grid text-white placeholder:text-gray-500 focus:border-ghost-cyan"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="ageRange" className="text-ghost-text">Age Range</Label>
                                    <select
                                        id="ageRange"
                                        name="ageRange"
                                        required
                                        className="flex h-10 w-full rounded-md border border-ghost-grid bg-ghost-purple px-3 py-2 text-sm text-white ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 focus:border-ghost-cyan"
                                    >
                                        <option value="" disabled selected>Select...</option>
                                        <option value="18-29">18-29</option>
                                        <option value="30-39">30-39</option>
                                        <option value="40-49">40-49</option>
                                        <option value="50-59">50-59</option>
                                        <option value="60+">60+</option>
                                    </select>
                                </div>
                            </div>

                            <div className="pt-2">
                                <Button
                                    type="submit"
                                    disabled={pending}
                                    className="w-full bg-ghost-cyan text-ghost-navy font-bold text-lg h-12 hover:bg-ghost-cyan-light shadow-glow transition-all duration-300"
                                >
                                    {pending ? 'Initializing Protocol...' : 'Start Ghosting 👻'}
                                </Button>
                            </div>

                            {error && (
                                <p className="text-red-400 text-center text-sm bg-red-900/20 p-2 rounded border border-red-900/50">
                                    {error}
                                </p>
                            )}

                            <p className="text-center text-xs text-ghost-muted/70 mt-4 leading-relaxed">
                                We CC you on every single opt-out email. <br />
                                You'll get 80+ emails in the next ~60 seconds.
                            </p>
                        </form>
                    </>
                ) : (
                    <div className="text-center py-10 space-y-6">
                        <div className="mx-auto w-20 h-20 bg-ghost-cyan/20 rounded-full flex items-center justify-center mb-6 border border-ghost-cyan shadow-glow">
                            <svg className="w-10 h-10 text-ghost-cyan" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>

                        <h2 className="text-3xl font-bold text-white"> Protocol Initiated! 👻 </h2>

                        <div className="text-ghost-text text-lg space-y-4 text-left bg-ghost-purple/30 p-6 rounded-xl border border-ghost-grid">
                            <p>
                                We auto-removed you from <strong>{count} brokers</strong> via email — check your inbox (and Spam) for the CCs.
                            </p>
                            <p>
                                The remaining <strong>{manualBrokersCount} brokers</strong> require manual forms (they reject automated emails).
                            </p>
                            <p>
                                Download your personalized removal checklist below — it has pre-filled links. Takes ~15 minutes total.
                            </p>
                        </div>

                        {pdfBase64 && (
                            <div className="pt-4">
                                <a
                                    href={`data:application/pdf;base64,${pdfBase64}`}
                                    download="DataGhost_Manual_Removal_Checklist.pdf"
                                    className="inline-flex items-center justify-center w-full bg-ghost-cyan text-ghost-navy font-bold text-lg h-14 rounded-lg hover:bg-ghost-cyan-light shadow-glow transition-all duration-300 transform hover:scale-[1.02]"
                                >
                                    <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                    </svg>
                                    Download Manual Removal PDF
                                </a>
                            </div>
                        )}

                        <p className="text-ghost-muted text-sm mt-6">
                            We'll re-scan everything for 45 days and kill anything that comes back.
                        </p>
                    </div>
                )}
            </div>
        </main>
    );
}

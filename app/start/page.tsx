'use client';

import { useState } from 'react';
import Image from 'next/image';
import { startGhosting } from './actions';
import { checkEmailPayment } from './verify-actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function StartPage() {
    const [step, setStep] = useState<1 | 2 | 3>(1); // 1=Email, 2=Form, 3=Success
    const [email, setEmail] = useState('');

    // State for Step 1
    const [checkingPayment, setCheckingPayment] = useState(false);
    const [paymentError, setPaymentError] = useState<string | null>(null);

    // State for Step 2
    const [submitting, setSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [result, setResult] = useState<{ count: number; manualBrokersCount: number; pdfBase64?: string } | null>(null);

    async function handleCheckPayment(e: React.FormEvent) {
        e.preventDefault();
        setCheckingPayment(true);
        setPaymentError(null);

        try {
            const res = await checkEmailPayment(email);
            if (res.success) {
                setStep(2);
            } else {
                setPaymentError(res.error || 'Payment verification failed.');
            }
        } catch (err) {
            setPaymentError('An unexpected error occurred.');
        } finally {
            setCheckingPayment(false);
        }
    }

    async function handleFinalSubmit(formData: FormData) {
        setSubmitting(true);
        setSubmitError(null);

        try {
            // Append the verified email to formData just in case the user inspected element
            // stored in state 'email'
            if (formData.get('email') !== email) {
                formData.set('email', email);
            }

            const res = await startGhosting(undefined, formData);
            if (res.success) {
                setResult({
                    count: res.count || 0,
                    manualBrokersCount: res.manualBrokersCount || 0,
                    pdfBase64: res.pdfBase64
                });
                setStep(3);
            } else {
                setSubmitError(res.error || 'Submission failed.');
            }
        } catch (err) {
            setSubmitError('An unexpected error occurred.');
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <main className="min-h-screen bg-ghost-navy text-ghost-text relative bg-holo flex flex-col items-center justify-center p-6">

            {/* Floating Ghost */}
            <div className="mb-8">
                <Image
                    src="/ghost.png"
                    alt="DataGhost removes your personal information from data brokers"
                    width={120}
                    height={120}
                    className="animate-float drop-shadow-[0_0_30px_#00e5ff]"
                    priority
                />
            </div>

            <div className="max-w-xl w-full bg-ghost-navy-light/80 backdrop-blur-md border border-ghost-grid rounded-3xl p-8 shadow-card">

                {/* STEP 1: Verify Payment */}
                {step === 1 && (
                    <div className="space-y-6">
                        <div className="text-center">
                            <h1 className="text-3xl font-bold text-white mb-2">Initialize Data Removal</h1>
                            <p className="text-ghost-muted">Enter the email address you used for payment.</p>
                        </div>

                        <form onSubmit={handleCheckPayment} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="check-email" className="text-ghost-text">Payment Email</Label>
                                <Input
                                    id="check-email"
                                    type="email"
                                    required
                                    placeholder="your@email.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="bg-ghost-purple border-ghost-grid text-white focus:border-ghost-cyan h-12 text-lg"
                                />
                            </div>

                            <Button
                                type="submit"
                                disabled={checkingPayment}
                                className="w-full bg-ghost-cyan text-ghost-navy font-bold text-lg h-12 hover:bg-ghost-cyan-light shadow-glow transition-all"
                            >
                                {checkingPayment ? 'Verifying...' : 'Verify Payment →'}
                            </Button>

                            {paymentError && (
                                <div className="p-4 rounded-lg bg-red-950/50 border border-red-500/30 text-center">
                                    <p className="text-red-400 font-semibold mb-2">{paymentError}</p>
                                    <a href="/payment" className="text-sm underline text-white hover:text-ghost-cyan">
                                        Haven't paid yet? Click here to start data removal ($49)
                                    </a>
                                </div>
                            )}
                        </form>
                    </div>
                )}

                {/* STEP 2: Data Entry */}
                {step === 2 && (
                    <div className="space-y-6">
                        <div className="text-center mb-6">
                            <h2 className="text-2xl font-bold text-white">Payment Verified ✅</h2>
                            <p className="text-ghost-muted">Tell us the basics so we can nuke your data.</p>
                        </div>

                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                handleFinalSubmit(new FormData(e.currentTarget));
                            }}
                            className="space-y-5"
                        >
                            {/* Hidden email field to pass to action */}
                            <input type="hidden" name="email" value={email} />

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
                                    <Label className="text-ghost-text">Email</Label>
                                    <div className="flex h-10 w-full rounded-md border border-ghost-grid bg-black/40 px-3 py-2 text-sm text-gray-400 cursor-not-allowed">
                                        {email}
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
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
                                    <Label htmlFor="postcode" className="text-ghost-text">Zip Code</Label>
                                    <Input
                                        id="postcode"
                                        name="postcode"
                                        placeholder="10001"
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
                                        className="flex h-10 w-full rounded-md border border-ghost-grid bg-ghost-purple px-3 py-2 text-sm text-white focus-visible:outline-none focus:border-ghost-cyan"
                                        defaultValue=""
                                    >
                                        <option value="" disabled>Select...</option>
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
                                    disabled={submitting}
                                    className="w-full bg-ghost-cyan text-ghost-navy font-bold text-lg h-12 hover:bg-ghost-cyan-light shadow-glow transition-all duration-300"
                                >
                                    {submitting ? 'Initializing Protocol...' : 'Start Ghosting 👻'}
                                </Button>
                            </div>

                            {submitError && (
                                <p className="text-red-400 text-center text-sm bg-red-900/20 p-2 rounded border border-red-900/50">
                                    {submitError}
                                </p>
                            )}

                            <p className="text-center text-xs text-ghost-muted/70 mt-4 leading-relaxed">
                                We CC you on every single opt-out email. <br />
                                You'll get 80+ emails in the next ~60 seconds.
                            </p>
                        </form>
                    </div>
                )}

                {/* STEP 3: Success */}
                {step === 3 && result && (
                    <div className="text-center py-4 space-y-6 animate-in fade-in zoom-in duration-500">
                        <div className="mx-auto w-20 h-20 bg-ghost-cyan/20 rounded-full flex items-center justify-center mb-6 border border-ghost-cyan shadow-glow">
                            <svg className="w-10 h-10 text-ghost-cyan" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>

                        <h2 className="text-3xl font-bold text-white">Protocol Initiated! 👻</h2>

                        <div className="text-ghost-text text-lg space-y-4 text-left bg-ghost-purple/30 p-6 rounded-xl border border-ghost-grid">
                            <p>We auto-removed you from <strong>{result.count} brokers</strong> via email — check your inbox (and Spam) in 30 seconds.</p>
                            <p>The remaining <strong>{result.manualBrokersCount} brokers</strong> require manual forms.</p>
                        </div>

                        {result.pdfBase64 && (
                            <div className="pt-2">
                                <a
                                    href={`data:application/pdf;base64,${result.pdfBase64}`}
                                    download="DataGhost_Manual_Removal_Checklist.pdf"
                                    className="inline-flex items-center justify-center w-full bg-ghost-cyan text-ghost-navy font-bold text-lg h-14 rounded-lg hover:bg-ghost-cyan-light shadow-glow transition-all transform hover:scale-[1.02]"
                                >
                                    <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                    </svg>
                                    Download Manual Checklist
                                </a>
                            </div>
                        )}

                        <div className="bg-ghost-navy-dark p-4 rounded-xl border border-ghost-grid text-left text-sm text-ghost-muted">
                            <p className="mb-2"><span className="text-ghost-cyan font-bold">Next:</span> We re-scan daily for 45 days. You'll get a final "All Clear" report then.</p>
                            <p className="text-xs text-ghost-muted/80 mt-2">
                                We temporarily store your info for <strong className="text-ghost-cyan">exactly 45 days only</strong> so we can automatically
                                re-remove your data every week if it reappears. On day 46, a pg_cron job permanently deletes everything —
                                no backups, no logs, gone forever.
                            </p>
                        </div>
                    </div>
                )}

            </div>
        </main>
    );
}

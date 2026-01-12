import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
    title: "Billing & Pricing - Plans, Payments, and Subscription Management",
    description: "Understand Nerlude's pricing plans, manage your subscription, update payment methods, and get answers to common billing questions.",
    alternates: {
        canonical: "https://nerlude.io/help/billing",
    },
    openGraph: {
        title: "Billing & Pricing - Nerlude Help Center",
        description: "Everything you need to know about Nerlude pricing, plans, and billing.",
        type: "article",
    },
};

export default function BillingPage() {
    return (
        <article className="prose prose-slate max-w-none">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-small text-t-tertiary mb-8 not-prose">
                <Link href="/help" className="hover:text-t-primary transition-colors">Help Center</Link>
                <span>/</span>
                <span className="text-t-primary">Billing & Plans</span>
            </nav>

            <h1 className="text-h1 mb-4 not-prose">Billing & Pricing</h1>
            <p className="text-body text-t-secondary mb-8 not-prose">
                Everything you need to know about Nerlude's pricing plans, subscription management, and billing.
            </p>

            {/* Table of Contents */}
            <div className="bg-b-surface2 rounded-2xl p-6 mb-10 not-prose">
                <h2 className="text-body-bold mb-4">In this guide</h2>
                <ul className="space-y-2">
                    <li><a href="#pricing" className="text-small text-primary1 hover:underline">Pricing plans explained</a></li>
                    <li><a href="#free-plan" className="text-small text-primary1 hover:underline">What's included in Free</a></li>
                    <li><a href="#upgrading" className="text-small text-primary1 hover:underline">Upgrading your plan</a></li>
                    <li><a href="#downgrading" className="text-small text-primary1 hover:underline">Downgrading your plan</a></li>
                    <li><a href="#payment-methods" className="text-small text-primary1 hover:underline">Managing payment methods</a></li>
                    <li><a href="#invoices" className="text-small text-primary1 hover:underline">Invoices and receipts</a></li>
                    <li><a href="#cancellation" className="text-small text-primary1 hover:underline">Canceling your subscription</a></li>
                    <li><a href="#faq" className="text-small text-primary1 hover:underline">Billing FAQ</a></li>
                </ul>
            </div>

            <section id="pricing" className="mb-12">
                <h2 className="text-h3 mb-4 not-prose">Pricing Plans Explained</h2>
                <div className="space-y-4 text-body text-t-secondary">
                    <p>
                        Nerlude offers simple, transparent pricing designed for founders, indie hackers, and small teams. We have three plans:
                    </p>
                    <div className="grid grid-cols-3 gap-4 mt-6 max-md:grid-cols-1 not-prose">
                        <div className="p-6 rounded-2xl bg-b-surface2 border border-stroke-subtle">
                            <h3 className="text-body-bold text-t-primary mb-2">Free</h3>
                            <p className="text-h3 text-t-primary mb-4">$0<span className="text-base text-t-tertiary">/forever</span></p>
                            <ul className="space-y-2 text-base text-t-secondary">
                                <li>✓ 1 project</li>
                                <li>✓ 1 team member</li>
                                <li>✓ 5 services</li>
                                <li>✓ Project documentation</li>
                                <li>✓ Community support</li>
                            </ul>
                        </div>
                        <div className="p-6 rounded-2xl bg-primary1/5 border-2 border-primary1">
                            <div className="flex items-center gap-2 mb-2">
                                <h3 className="text-body-bold text-t-primary">Pro</h3>
                                <span className="px-2 py-0.5 text-xs rounded-full bg-primary1 text-white">Popular</span>
                            </div>
                            <p className="text-h3 text-t-primary mb-4">$19.99<span className="text-base text-t-tertiary">/month</span></p>
                            <ul className="space-y-2 text-base text-t-secondary">
                                <li>✓ 10 projects</li>
                                <li>✓ 5 team members</li>
                                <li>✓ Advanced alerts (email + Slack)</li>
                                <li>✓ Cost tracking & analytics</li>
                                <li>✓ Environment separation</li>
                                <li>✓ Asset management</li>
                                <li>✓ Document import (CSV/AI)</li>
                                <li>✓ Priority support</li>
                            </ul>
                        </div>
                        <div className="p-6 rounded-2xl bg-b-surface2 border border-stroke-subtle">
                            <h3 className="text-body-bold text-t-primary mb-2">Team</h3>
                            <p className="text-h3 text-t-primary mb-4">$39.99<span className="text-base text-t-tertiary">/month</span></p>
                            <ul className="space-y-2 text-base text-t-secondary">
                                <li>✓ Unlimited projects</li>
                                <li>✓ Unlimited team members</li>
                                <li>✓ All Pro features</li>
                                <li>✓ Role-based access control</li>
                                <li>✓ Time-limited contractor access</li>
                                <li>✓ Audit logging</li>
                                <li>✓ API access</li>
                                <li>✓ Dedicated support</li>
                            </ul>
                        </div>
                    </div>
                    <p className="mt-4">
                        All paid plans include a <strong>14-day free trial</strong> so you can try before you commit.
                    </p>
                </div>
            </section>

            <section id="free-plan" className="mb-12">
                <h2 className="text-h3 mb-4 not-prose">What's Included in Free</h2>
                <div className="space-y-4 text-body text-t-secondary">
                    <p>
                        Our Free plan is perfect for solo founders just getting started. Here's what you get:
                    </p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li><strong>1 project</strong> - Manage one product or app</li>
                        <li><strong>1 team member</strong> - Just you (perfect for solo founders)</li>
                        <li><strong>5 services</strong> - Track up to 5 SaaS subscriptions</li>
                        <li><strong>Project documentation</strong> - Keep notes and setup guides</li>
                        <li><strong>Renewal reminders</strong> - Never miss a renewal</li>
                        <li><strong>Community support</strong> - Get help from our community</li>
                    </ul>
                    <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 mt-4">
                        <p className="text-small text-blue-600 dark:text-blue-400">
                            <strong>💡 Good to know:</strong> The Free plan is free forever. No credit card required, no time limits.
                        </p>
                    </div>
                </div>
            </section>

            <section id="upgrading" className="mb-12">
                <h2 className="text-h3 mb-4 not-prose">Upgrading Your Plan</h2>
                <div className="space-y-4 text-body text-t-secondary">
                    <p>
                        Ready for more? Here's how to upgrade:
                    </p>
                    <ol className="list-decimal pl-6 space-y-3">
                        <li>
                            <strong>Go to Settings → Billing</strong>
                            <p className="mt-1">Navigate to your workspace settings and select the Billing tab.</p>
                        </li>
                        <li>
                            <strong>Click "Upgrade Plan"</strong>
                            <p className="mt-1">You'll see a comparison of available plans.</p>
                        </li>
                        <li>
                            <strong>Select your new plan</strong>
                            <p className="mt-1">Choose Pro or Team based on your needs.</p>
                        </li>
                        <li>
                            <strong>Choose billing cycle</strong>
                            <p className="mt-1">Monthly or yearly (save 20% with yearly billing).</p>
                        </li>
                        <li>
                            <strong>Enter payment details</strong>
                            <p className="mt-1">Add your credit card or connect PayPal.</p>
                        </li>
                        <li>
                            <strong>Confirm upgrade</strong>
                            <p className="mt-1">Your new features are available immediately!</p>
                        </li>
                    </ol>
                    <h3 className="text-h5 mt-6 mb-3 not-prose">Prorated billing</h3>
                    <p>
                        When you upgrade mid-cycle, we prorate the charges. You only pay for the remaining days in your billing period at the new rate.
                    </p>
                </div>
            </section>

            <section id="downgrading" className="mb-12">
                <h2 className="text-h3 mb-4 not-prose">Downgrading Your Plan</h2>
                <div className="space-y-4 text-body text-t-secondary">
                    <p>
                        Need to scale back? You can downgrade at any time:
                    </p>
                    <ol className="list-decimal pl-6 space-y-3">
                        <li>Go to Settings → Billing</li>
                        <li>Click "Change Plan"</li>
                        <li>Select a lower tier plan</li>
                        <li>Review what features you'll lose</li>
                        <li>Confirm the downgrade</li>
                    </ol>
                    <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 mt-4">
                        <p className="text-small text-amber-600 dark:text-amber-400">
                            <strong>⚠️ Important:</strong> Downgrades take effect at the end of your current billing period. You'll keep your current features until then.
                        </p>
                    </div>
                    <h3 className="text-h5 mt-6 mb-3 not-prose">What happens to your data?</h3>
                    <p>
                        If you exceed the limits of your new plan:
                    </p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li><strong>Projects</strong> - You'll need to archive extra projects before downgrading</li>
                        <li><strong>Team members</strong> - Extra members will be removed (you choose who)</li>
                        <li><strong>Services</strong> - You'll need to remove services to fit the new limit</li>
                    </ul>
                    <p>
                        Your data is never deleted automatically. You have full control over what to keep.
                    </p>
                </div>
            </section>

            <section id="payment-methods" className="mb-12">
                <h2 className="text-h3 mb-4 not-prose">Managing Payment Methods</h2>
                <div className="space-y-4 text-body text-t-secondary">
                    <p>
                        We accept the following payment methods:
                    </p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>Credit cards (Visa, Mastercard, American Express)</li>
                        <li>Debit cards</li>
                        <li>PayPal</li>
                    </ul>
                    <h3 className="text-h5 mt-6 mb-3 not-prose">Adding or updating a payment method:</h3>
                    <ol className="list-decimal pl-6 space-y-2">
                        <li>Go to Settings → Billing</li>
                        <li>Click "Payment Methods"</li>
                        <li>Add a new card or update existing</li>
                        <li>Set your default payment method</li>
                    </ol>
                    <h3 className="text-h5 mt-6 mb-3 not-prose">Failed payments</h3>
                    <p>
                        If a payment fails, we'll:
                    </p>
                    <ol className="list-decimal pl-6 space-y-2">
                        <li>Send you an email notification</li>
                        <li>Retry the payment after 3 days</li>
                        <li>Retry again after 7 days</li>
                        <li>Downgrade to Free after 14 days if still failing</li>
                    </ol>
                    <p>
                        You can update your payment method at any time to resolve failed payments.
                    </p>
                </div>
            </section>

            <section id="invoices" className="mb-12">
                <h2 className="text-h3 mb-4 not-prose">Invoices and Receipts</h2>
                <div className="space-y-4 text-body text-t-secondary">
                    <p>
                        All invoices are available in your billing settings:
                    </p>
                    <ol className="list-decimal pl-6 space-y-2">
                        <li>Go to Settings → Billing</li>
                        <li>Click "Billing History"</li>
                        <li>View or download any invoice as PDF</li>
                    </ol>
                    <p>
                        Invoices are also emailed to you after each successful payment.
                    </p>
                    <h3 className="text-h5 mt-6 mb-3 not-prose">Adding billing information</h3>
                    <p>
                        Need invoices with your company details? You can add:
                    </p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>Company name</li>
                        <li>Billing address</li>
                        <li>VAT/Tax ID</li>
                    </ul>
                    <p>
                        Go to Settings → Billing → Billing Information to update these details.
                    </p>
                </div>
            </section>

            <section id="cancellation" className="mb-12">
                <h2 className="text-h3 mb-4 not-prose">Canceling Your Subscription</h2>
                <div className="space-y-4 text-body text-t-secondary">
                    <p>
                        We're sorry to see you go, but canceling is easy:
                    </p>
                    <ol className="list-decimal pl-6 space-y-3">
                        <li>Go to Settings → Billing</li>
                        <li>Click "Cancel Subscription"</li>
                        <li>Tell us why you're leaving (optional but helpful)</li>
                        <li>Confirm cancellation</li>
                    </ol>
                    <h3 className="text-h5 mt-6 mb-3 not-prose">What happens when you cancel:</h3>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>You keep access until the end of your billing period</li>
                        <li>Your account downgrades to Free automatically</li>
                        <li>Your data is preserved (within Free plan limits)</li>
                        <li>You can resubscribe anytime</li>
                    </ul>
                    <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4 mt-4">
                        <p className="text-small text-green-600 dark:text-green-400">
                            <strong>✅ No lock-in:</strong> You can export all your data before canceling. We believe your data belongs to you.
                        </p>
                    </div>
                </div>
            </section>

            <section id="faq" className="mb-12">
                <h2 className="text-h3 mb-4 not-prose">Billing FAQ</h2>
                <div className="space-y-4 not-prose">
                    {[
                        {
                            q: "Do you offer refunds?",
                            a: "Yes! If you're not satisfied within the first 14 days of a paid plan, contact us for a full refund. No questions asked."
                        },
                        {
                            q: "Can I switch between monthly and yearly billing?",
                            a: "Yes, you can switch at any time. If switching to yearly, you'll get credit for any unused monthly time."
                        },
                        {
                            q: "Do you offer discounts for startups?",
                            a: "Yes! We offer 50% off for the first year for early-stage startups. Contact us at hello@nerlude.io with details about your company."
                        },
                        {
                            q: "Is there a limit on API calls?",
                            a: "No, all plans include unlimited API calls. We don't meter usage."
                        },
                        {
                            q: "Do you charge per user?",
                            a: "No, our pricing is based on plans with included team member limits, not per-seat pricing."
                        },
                        {
                            q: "Can I pay annually?",
                            a: "Yes! Annual billing saves you 10% compared to monthly billing."
                        }
                    ].map((item, i) => (
                        <div key={i} className="p-5 rounded-xl bg-b-surface2">
                            <h3 className="text-body-bold text-t-primary mb-2">{item.q}</h3>
                            <p className="text-base text-t-secondary">{item.a}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Contact */}
            <div className="bg-primary1/5 rounded-2xl p-8 text-center not-prose">
                <h2 className="text-h4 mb-3">Have billing questions?</h2>
                <p className="text-body text-t-secondary mb-6">
                    Our team is here to help with any billing or pricing questions.
                </p>
                <a
                    href="mailto:hello@nerlude.io"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary1 text-white font-medium hover:bg-primary1/90 transition-colors"
                >
                    Contact Us
                </a>
            </div>

            {/* JSON-LD */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "FAQPage",
                        "mainEntity": [
                            {
                                "@type": "Question",
                                "name": "How much does Nerlude cost?",
                                "acceptedAnswer": {
                                    "@type": "Answer",
                                    "text": "Nerlude offers a Free plan ($0 forever), Pro plan ($19.99/month), and Team plan ($39.99/month). All paid plans include a 14-day free trial. Save 10% with yearly billing."
                                }
                            },
                            {
                                "@type": "Question",
                                "name": "Does Nerlude offer refunds?",
                                "acceptedAnswer": {
                                    "@type": "Answer",
                                    "text": "Yes, Nerlude offers a full refund within the first 14 days of any paid plan, no questions asked."
                                }
                            },
                            {
                                "@type": "Question",
                                "name": "Can I use Nerlude for free?",
                                "acceptedAnswer": {
                                    "@type": "Answer",
                                    "text": "Yes, Nerlude's Free plan is free forever and includes 1 project, 5 services, and project documentation. No credit card required."
                                }
                            }
                        ]
                    })
                }}
            />
        </article>
    );
}

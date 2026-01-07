import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
    title: "Managing Services - Complete Guide to SaaS Subscription Tracking",
    description: "Learn how to add, organize, and manage all your SaaS subscriptions in Nerlude. Track costs, store credentials, set renewal reminders, and keep your tech stack organized.",
    alternates: {
        canonical: "https://nerlude.com/help/services",
    },
    openGraph: {
        title: "Managing Services in Nerlude - Complete Guide",
        description: "Master SaaS subscription management with Nerlude. Track costs, credentials, and renewals in one place.",
        type: "article",
    },
};

export default function ServicesPage() {
    return (
        <article className="prose prose-slate max-w-none">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-small text-t-tertiary mb-8 not-prose">
                <Link href="/help" className="hover:text-t-primary transition-colors">Help Center</Link>
                <span>/</span>
                <span className="text-t-primary">Managing Services</span>
            </nav>

            <h1 className="text-h1 mb-4 not-prose">Managing Services in Nerlude</h1>
            <p className="text-body text-t-secondary mb-8 not-prose">
                Services are the heart of Nerlude. Learn how to add, organize, and manage all your SaaS subscriptions, APIs, and tools in one centralized location.
            </p>

            {/* Table of Contents */}
            <div className="bg-b-surface2 rounded-2xl p-6 mb-10 not-prose">
                <h2 className="text-body-bold mb-4">In this guide</h2>
                <ul className="space-y-2">
                    <li><a href="#what-are-services" className="text-small text-primary1 hover:underline">What are services?</a></li>
                    <li><a href="#add-service" className="text-small text-primary1 hover:underline">Adding a new service</a></li>
                    <li><a href="#service-categories" className="text-small text-primary1 hover:underline">Service categories</a></li>
                    <li><a href="#credentials" className="text-small text-primary1 hover:underline">Managing credentials</a></li>
                    <li><a href="#renewal-reminders" className="text-small text-primary1 hover:underline">Setting renewal reminders</a></li>
                    <li><a href="#cost-tracking" className="text-small text-primary1 hover:underline">Cost tracking</a></li>
                    <li><a href="#custom-services" className="text-small text-primary1 hover:underline">Adding custom services</a></li>
                    <li><a href="#bulk-import" className="text-small text-primary1 hover:underline">Bulk import from CSV</a></li>
                    <li><a href="#best-practices" className="text-small text-primary1 hover:underline">Best practices</a></li>
                </ul>
            </div>

            <section id="what-are-services" className="mb-12">
                <h2 className="text-h3 mb-4 not-prose">What Are Services?</h2>
                <div className="space-y-4 text-body text-t-secondary">
                    <p>
                        In Nerlude, a <strong>service</strong> represents any SaaS tool, API, subscription, or digital product that your project depends on. This includes:
                    </p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li><strong>Cloud Infrastructure</strong> - AWS, Google Cloud, Vercel, Netlify, DigitalOcean</li>
                        <li><strong>Payment Processing</strong> - Stripe, PayPal, Square, Paddle</li>
                        <li><strong>Authentication</strong> - Auth0, Clerk, Firebase Auth, Supabase</li>
                        <li><strong>Databases</strong> - MongoDB Atlas, PlanetScale, Supabase, Neon</li>
                        <li><strong>Email Services</strong> - SendGrid, Mailgun, Postmark, Resend</li>
                        <li><strong>Analytics</strong> - Mixpanel, Amplitude, PostHog, Google Analytics</li>
                        <li><strong>Monitoring</strong> - Sentry, LogRocket, Datadog, New Relic</li>
                        <li><strong>Design Tools</strong> - Figma, Canva, Adobe Creative Cloud</li>
                        <li><strong>Communication</strong> - Slack, Discord, Intercom, Crisp</li>
                        <li><strong>And many more...</strong></li>
                    </ul>
                    <p>
                        Each service in Nerlude can store its own credentials, track costs, and have renewal reminders configured.
                    </p>
                </div>
            </section>

            <section id="add-service" className="mb-12">
                <h2 className="text-h3 mb-4 not-prose">Adding a New Service</h2>
                <div className="space-y-4 text-body text-t-secondary">
                    <p>
                        Adding services to your project is straightforward. Here's the step-by-step process:
                    </p>
                    <ol className="list-decimal pl-6 space-y-4">
                        <li>
                            <strong>Navigate to your project</strong>
                            <p className="mt-1">Click on the project where you want to add the service from your dashboard.</p>
                        </li>
                        <li>
                            <strong>Click "Add Service"</strong>
                            <p className="mt-1">You'll find this button on the Services tab or the project overview page.</p>
                        </li>
                        <li>
                            <strong>Search or browse for your service</strong>
                            <p className="mt-1">Nerlude has 100+ pre-configured services. Type the name (e.g., "Stripe") or browse by category.</p>
                        </li>
                        <li>
                            <strong>Fill in the service details:</strong>
                            <ul className="list-disc pl-6 mt-2 space-y-2">
                                <li><strong>Service name</strong> - Auto-filled for known services, customizable for your reference</li>
                                <li><strong>Monthly cost</strong> - Enter the amount you pay (used for cost tracking)</li>
                                <li><strong>Billing cycle</strong> - Monthly, quarterly, yearly, or custom</li>
                                <li><strong>Renewal date</strong> - When does this subscription renew?</li>
                                <li><strong>Account email</strong> - The email associated with this service account</li>
                                <li><strong>Notes</strong> - Any additional information you want to remember</li>
                            </ul>
                        </li>
                        <li>
                            <strong>Save the service</strong>
                            <p className="mt-1">Click "Add Service" to save. You can always edit these details later.</p>
                        </li>
                    </ol>
                </div>
            </section>

            <section id="service-categories" className="mb-12">
                <h2 className="text-h3 mb-4 not-prose">Service Categories</h2>
                <div className="space-y-4 text-body text-t-secondary">
                    <p>
                        Nerlude organizes services into categories to help you find what you need quickly:
                    </p>
                    <div className="grid grid-cols-2 gap-4 mt-4 max-md:grid-cols-1 not-prose">
                        {[
                            { name: "Infrastructure", icon: "🏗️", examples: "AWS, GCP, Vercel" },
                            { name: "Database", icon: "🗄️", examples: "MongoDB, PostgreSQL, Redis" },
                            { name: "Authentication", icon: "🔐", examples: "Auth0, Clerk, Firebase" },
                            { name: "Payments", icon: "💳", examples: "Stripe, PayPal, Paddle" },
                            { name: "Email", icon: "📧", examples: "SendGrid, Mailgun, Resend" },
                            { name: "Analytics", icon: "📊", examples: "Mixpanel, Amplitude, PostHog" },
                            { name: "Monitoring", icon: "🔍", examples: "Sentry, LogRocket, Datadog" },
                            { name: "Storage", icon: "☁️", examples: "S3, Cloudinary, Uploadthing" },
                            { name: "Communication", icon: "💬", examples: "Slack, Intercom, Twilio" },
                            { name: "Design", icon: "🎨", examples: "Figma, Canva, Adobe" },
                            { name: "Development", icon: "⚙️", examples: "GitHub, GitLab, Linear" },
                            { name: "Marketing", icon: "📢", examples: "Mailchimp, HubSpot, Beehiiv" },
                        ].map((cat) => (
                            <div key={cat.name} className="p-4 rounded-xl bg-b-surface2">
                                <div className="flex items-center gap-2 mb-2">
                                    <span>{cat.icon}</span>
                                    <span className="font-medium text-t-primary">{cat.name}</span>
                                </div>
                                <p className="text-small text-t-tertiary">{cat.examples}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section id="credentials" className="mb-12">
                <h2 className="text-h3 mb-4 not-prose">Managing Credentials</h2>
                <div className="space-y-4 text-body text-t-secondary">
                    <p>
                        Each service can store multiple credentials securely. This is perfect for API keys, secrets, tokens, and passwords.
                    </p>
                    <h3 className="text-h5 mt-6 mb-3 not-prose">Types of credentials you can store:</h3>
                    <ul className="list-disc pl-6 space-y-2">
                        <li><strong>API Keys</strong> - Public and secret keys for API access</li>
                        <li><strong>Access Tokens</strong> - OAuth tokens, JWT secrets</li>
                        <li><strong>Database URLs</strong> - Connection strings with credentials</li>
                        <li><strong>Webhook Secrets</strong> - Signing secrets for webhook verification</li>
                        <li><strong>Account Passwords</strong> - Login credentials for service dashboards</li>
                        <li><strong>Environment Variables</strong> - Any key-value pairs your app needs</li>
                    </ul>
                    <h3 className="text-h5 mt-6 mb-3 not-prose">How to add credentials:</h3>
                    <ol className="list-decimal pl-6 space-y-3">
                        <li>Open the service you want to add credentials to</li>
                        <li>Navigate to the "Credentials" tab</li>
                        <li>Click "Add Credential"</li>
                        <li>Enter a name (e.g., "Production API Key") and the value</li>
                        <li>Optionally add a description or expiration date</li>
                        <li>Save the credential</li>
                    </ol>
                    <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4 mt-4">
                        <p className="text-small text-green-600 dark:text-green-400">
                            <strong>🔒 Security:</strong> All credentials are encrypted with AES-256 encryption before storage. They're only decrypted when you explicitly view them.
                        </p>
                    </div>
                    <h3 className="text-h5 mt-6 mb-3 not-prose">Credential features:</h3>
                    <ul className="list-disc pl-6 space-y-2">
                        <li><strong>One-click copy</strong> - Copy credentials to clipboard instantly</li>
                        <li><strong>Show/hide toggle</strong> - Keep values hidden until you need them</li>
                        <li><strong>Expiration tracking</strong> - Get alerts when credentials are about to expire</li>
                        <li><strong>Version history</strong> - Track when credentials were last updated</li>
                        <li><strong>Team sharing</strong> - Control who can view credentials with role permissions</li>
                    </ul>
                </div>
            </section>

            <section id="renewal-reminders" className="mb-12">
                <h2 className="text-h3 mb-4 not-prose">Setting Renewal Reminders</h2>
                <div className="space-y-4 text-body text-t-secondary">
                    <p>
                        One of the most valuable features of Nerlude is automatic renewal tracking. Never be surprised by an unexpected charge or service interruption again.
                    </p>
                    <h3 className="text-h5 mt-6 mb-3 not-prose">How renewal reminders work:</h3>
                    <ol className="list-decimal pl-6 space-y-3">
                        <li>
                            <strong>Set the renewal date</strong> - When adding or editing a service, enter the next renewal date.
                        </li>
                        <li>
                            <strong>Choose billing cycle</strong> - Select monthly, quarterly, yearly, or custom. Nerlude will automatically calculate future renewals.
                        </li>
                        <li>
                            <strong>Receive reminders</strong> - You'll get notifications at:
                            <ul className="list-disc pl-6 mt-2 space-y-1">
                                <li>30 days before (for annual subscriptions)</li>
                                <li>14 days before</li>
                                <li>7 days before</li>
                                <li>1 day before</li>
                            </ul>
                        </li>
                        <li>
                            <strong>Take action</strong> - Review, renew, cancel, or negotiate before the deadline.
                        </li>
                    </ol>
                    <h3 className="text-h5 mt-6 mb-3 not-prose">Customizing reminders:</h3>
                    <p>
                        You can customize reminder intervals for individual services or set project-wide defaults in your settings.
                    </p>
                    <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 mt-4">
                        <p className="text-small text-blue-600 dark:text-blue-400">
                            <strong>💡 Pro tip:</strong> For critical services, add extra reminder days to give yourself more time to review and act.
                        </p>
                    </div>
                </div>
            </section>

            <section id="cost-tracking" className="mb-12">
                <h2 className="text-h3 mb-4 not-prose">Cost Tracking</h2>
                <div className="space-y-4 text-body text-t-secondary">
                    <p>
                        Nerlude automatically calculates your total SaaS spend across all projects and services.
                    </p>
                    <h3 className="text-h5 mt-6 mb-3 not-prose">What you can track:</h3>
                    <ul className="list-disc pl-6 space-y-2">
                        <li><strong>Monthly burn rate</strong> - Total cost per month across all services</li>
                        <li><strong>Per-project costs</strong> - See how much each project costs to run</li>
                        <li><strong>Per-service costs</strong> - Individual service pricing</li>
                        <li><strong>Cost trends</strong> - Track how your spending changes over time</li>
                    </ul>
                    <h3 className="text-h5 mt-6 mb-3 not-prose">Tips for accurate cost tracking:</h3>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>Enter costs in your local currency for consistency</li>
                        <li>For usage-based pricing, enter your average monthly cost</li>
                        <li>Update costs when your plan changes</li>
                        <li>Include taxes if you want total spend visibility</li>
                    </ul>
                </div>
            </section>

            <section id="custom-services" className="mb-12">
                <h2 className="text-h3 mb-4 not-prose">Adding Custom Services</h2>
                <div className="space-y-4 text-body text-t-secondary">
                    <p>
                        Can't find a service in our library? No problem! You can add any custom service.
                    </p>
                    <ol className="list-decimal pl-6 space-y-3">
                        <li>Click "Add Service" in your project</li>
                        <li>Select "Add Custom Service" at the bottom of the search results</li>
                        <li>Enter the service name and details</li>
                        <li>Choose a category and icon</li>
                        <li>Add the service URL (optional)</li>
                        <li>Save your custom service</li>
                    </ol>
                    <p>
                        Custom services work exactly like pre-configured ones - you can add credentials, track costs, and set renewal reminders.
                    </p>
                </div>
            </section>

            <section id="bulk-import" className="mb-12">
                <h2 className="text-h3 mb-4 not-prose">Bulk Import from CSV</h2>
                <div className="space-y-4 text-body text-t-secondary">
                    <p>
                        If you have many services to add, you can import them in bulk using a CSV file.
                    </p>
                    <h3 className="text-h5 mt-6 mb-3 not-prose">CSV format:</h3>
                    <div className="bg-b-surface2 rounded-xl p-4 font-mono text-small overflow-x-auto">
                        name,category,monthly_cost,renewal_date,billing_cycle,notes<br/>
                        Stripe,payments,0,2024-03-15,monthly,Payment processing<br/>
                        Vercel,infrastructure,20,2024-04-01,monthly,Hosting<br/>
                        Figma,design,15,2024-06-01,monthly,Design tool
                    </div>
                    <h3 className="text-h5 mt-6 mb-3 not-prose">To import:</h3>
                    <ol className="list-decimal pl-6 space-y-3">
                        <li>Go to your project settings</li>
                        <li>Click "Import Services"</li>
                        <li>Upload your CSV file</li>
                        <li>Review the preview and confirm</li>
                    </ol>
                </div>
            </section>

            <section id="best-practices" className="mb-12">
                <h2 className="text-h3 mb-4 not-prose">Best Practices</h2>
                <div className="space-y-4 text-body text-t-secondary">
                    <ul className="list-disc pl-6 space-y-3">
                        <li>
                            <strong>Keep services organized by project</strong> - Don't mix production and development services in the same project.
                        </li>
                        <li>
                            <strong>Update costs regularly</strong> - Review and update service costs monthly, especially for usage-based pricing.
                        </li>
                        <li>
                            <strong>Use descriptive names</strong> - Name credentials clearly (e.g., "Production Stripe Secret Key" vs just "API Key").
                        </li>
                        <li>
                            <strong>Set renewal dates immediately</strong> - Add renewal dates when you first add a service so you don't forget.
                        </li>
                        <li>
                            <strong>Review before renewals</strong> - Use the reminder period to evaluate if you still need the service.
                        </li>
                        <li>
                            <strong>Document setup steps</strong> - Use the notes field to record how you configured each service.
                        </li>
                    </ul>
                </div>
            </section>

            {/* Related Articles */}
            <div className="border-t border-stroke-subtle pt-8 not-prose">
                <h2 className="text-h5 mb-4">Related Articles</h2>
                <div className="grid grid-cols-2 gap-4 max-md:grid-cols-1">
                    <Link href="/help/getting-started" className="p-4 rounded-xl bg-b-surface2 hover:bg-b-surface2/80 transition-colors">
                        <span className="text-small font-medium text-t-primary">Getting Started →</span>
                    </Link>
                    <Link href="/help/security" className="p-4 rounded-xl bg-b-surface2 hover:bg-b-surface2/80 transition-colors">
                        <span className="text-small font-medium text-t-primary">Security Best Practices →</span>
                    </Link>
                </div>
            </div>

            {/* JSON-LD */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "Article",
                        "headline": "Managing Services in Nerlude - Complete Guide",
                        "description": "Learn how to add, organize, and manage all your SaaS subscriptions in Nerlude.",
                        "author": {
                            "@type": "Organization",
                            "name": "Nerlude"
                        },
                        "publisher": {
                            "@type": "Organization",
                            "name": "Nerlude",
                            "url": "https://nerlude.com"
                        }
                    })
                }}
            />
        </article>
    );
}

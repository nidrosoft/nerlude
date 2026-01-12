import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
    title: "API & Integrations - Connect Your Tools with Nerlude",
    description: "Learn how to integrate Nerlude with your existing tools, use our API, set up webhooks, and automate your SaaS management workflow.",
    alternates: {
        canonical: "https://nerlude.io/help/integrations",
    },
    openGraph: {
        title: "API & Integrations - Nerlude Help Center",
        description: "Connect Nerlude with your tools. API documentation, webhooks, and third-party integrations.",
        type: "article",
    },
};

export default function IntegrationsPage() {
    return (
        <article className="prose prose-slate max-w-none">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-small text-t-tertiary mb-8 not-prose">
                <Link href="/help" className="hover:text-t-primary transition-colors">Help Center</Link>
                <span>/</span>
                <span className="text-t-primary">API & Integrations</span>
            </nav>

            <h1 className="text-h1 mb-4 not-prose">API & Integrations</h1>
            <p className="text-body text-t-secondary mb-8 not-prose">
                Connect Nerlude with your existing tools and automate your workflow. Learn about our API, webhooks, and supported integrations.
            </p>

            {/* Table of Contents */}
            <div className="bg-b-surface2 rounded-2xl p-6 mb-10 not-prose">
                <h2 className="text-body-bold mb-4">In this guide</h2>
                <ul className="space-y-2">
                    <li><a href="#overview" className="text-small text-primary1 hover:underline">Integration overview</a></li>
                    <li><a href="#supported" className="text-small text-primary1 hover:underline">Supported integrations</a></li>
                    <li><a href="#api" className="text-small text-primary1 hover:underline">REST API</a></li>
                    <li><a href="#webhooks" className="text-small text-primary1 hover:underline">Webhooks</a></li>
                    <li><a href="#zapier" className="text-small text-primary1 hover:underline">Zapier integration</a></li>
                    <li><a href="#slack" className="text-small text-primary1 hover:underline">Slack notifications</a></li>
                    <li><a href="#import-export" className="text-small text-primary1 hover:underline">Import & export</a></li>
                </ul>
            </div>

            <section id="overview" className="mb-12">
                <h2 className="text-h3 mb-4 not-prose">Integration Overview</h2>
                <div className="space-y-4 text-body text-t-secondary">
                    <p>
                        Nerlude is designed to work seamlessly with your existing tools and workflows. We offer multiple ways to integrate:
                    </p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li><strong>100+ pre-built service integrations</strong> - Automatic recognition of popular SaaS tools</li>
                        <li><strong>REST API</strong> - Full programmatic access to your data</li>
                        <li><strong>Webhooks</strong> - Real-time notifications for events</li>
                        <li><strong>Zapier</strong> - Connect with 5,000+ apps without code</li>
                        <li><strong>Slack</strong> - Get notifications in your team channels</li>
                        <li><strong>CSV import/export</strong> - Bulk data management</li>
                    </ul>
                </div>
            </section>

            <section id="supported" className="mb-12">
                <h2 className="text-h3 mb-4 not-prose">Supported Integrations</h2>
                <div className="space-y-4 text-body text-t-secondary">
                    <p>
                        Nerlude recognizes and provides enhanced support for 100+ popular services:
                    </p>
                    <div className="grid grid-cols-3 gap-3 mt-6 max-md:grid-cols-2 not-prose">
                        {[
                            "AWS", "Google Cloud", "Azure", "Vercel", "Netlify", "Heroku",
                            "Stripe", "PayPal", "Paddle", "Gumroad", "Lemon Squeezy",
                            "MongoDB", "PostgreSQL", "Redis", "Supabase", "PlanetScale", "Neon",
                            "Auth0", "Clerk", "Firebase", "Okta",
                            "SendGrid", "Mailgun", "Postmark", "Resend", "Mailchimp",
                            "Twilio", "Vonage", "MessageBird",
                            "Sentry", "LogRocket", "Datadog", "New Relic",
                            "Mixpanel", "Amplitude", "PostHog", "Segment",
                            "Cloudflare", "Fastly", "Cloudinary",
                            "GitHub", "GitLab", "Bitbucket", "Linear", "Jira",
                            "Slack", "Discord", "Intercom", "Crisp", "Zendesk",
                            "Figma", "Canva", "Adobe CC", "Framer",
                            "OpenAI", "Anthropic", "Replicate", "Hugging Face"
                        ].map((service) => (
                            <div key={service} className="px-3 py-2 rounded-lg bg-b-surface2 text-small text-t-secondary text-center">
                                {service}
                            </div>
                        ))}
                    </div>
                    <p className="mt-4">
                        Don't see your service? You can add any custom service manually.
                    </p>
                </div>
            </section>

            <section id="api" className="mb-12">
                <h2 className="text-h3 mb-4 not-prose">REST API</h2>
                <div className="space-y-4 text-body text-t-secondary">
                    <p>
                        Our REST API gives you full programmatic access to your Nerlude data. Perfect for automation, custom dashboards, and integrations.
                    </p>
                    <h3 className="text-h5 mt-6 mb-3 not-prose">Authentication</h3>
                    <p>
                        API requests are authenticated using API keys. Generate a key in Settings → API.
                    </p>
                    <div className="bg-b-surface2 rounded-xl p-4 font-mono text-small overflow-x-auto">
                        <code>
                            curl -H "Authorization: Bearer YOUR_API_KEY" \<br/>
                            &nbsp;&nbsp;https://api.nerlude.io/v1/projects
                        </code>
                    </div>
                    <h3 className="text-h5 mt-6 mb-3 not-prose">Available endpoints</h3>
                    <div className="overflow-x-auto not-prose">
                        <table className="w-full text-small border-collapse">
                            <thead>
                                <tr className="border-b border-stroke-subtle">
                                    <th className="text-left py-3 px-4 text-t-primary font-medium">Endpoint</th>
                                    <th className="text-left py-3 px-4 text-t-primary font-medium">Description</th>
                                </tr>
                            </thead>
                            <tbody className="text-t-secondary">
                                <tr className="border-b border-stroke-subtle">
                                    <td className="py-3 px-4 font-mono">GET /projects</td>
                                    <td className="py-3 px-4">List all projects</td>
                                </tr>
                                <tr className="border-b border-stroke-subtle">
                                    <td className="py-3 px-4 font-mono">GET /projects/:id</td>
                                    <td className="py-3 px-4">Get project details</td>
                                </tr>
                                <tr className="border-b border-stroke-subtle">
                                    <td className="py-3 px-4 font-mono">GET /projects/:id/services</td>
                                    <td className="py-3 px-4">List services in a project</td>
                                </tr>
                                <tr className="border-b border-stroke-subtle">
                                    <td className="py-3 px-4 font-mono">POST /services</td>
                                    <td className="py-3 px-4">Create a new service</td>
                                </tr>
                                <tr className="border-b border-stroke-subtle">
                                    <td className="py-3 px-4 font-mono">GET /renewals</td>
                                    <td className="py-3 px-4">List upcoming renewals</td>
                                </tr>
                                <tr>
                                    <td className="py-3 px-4 font-mono">GET /stats</td>
                                    <td className="py-3 px-4">Get dashboard statistics</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 mt-4">
                        <p className="text-small text-blue-600 dark:text-blue-400">
                            <strong>📚 Full documentation:</strong> Complete API documentation with examples is available at <a href="https://docs.nerlude.io/api" className="underline">docs.nerlude.io/api</a>
                        </p>
                    </div>
                </div>
            </section>

            <section id="webhooks" className="mb-12">
                <h2 className="text-h3 mb-4 not-prose">Webhooks</h2>
                <div className="space-y-4 text-body text-t-secondary">
                    <p>
                        Webhooks let you receive real-time notifications when events happen in Nerlude.
                    </p>
                    <h3 className="text-h5 mt-6 mb-3 not-prose">Setting up webhooks</h3>
                    <ol className="list-decimal pl-6 space-y-2">
                        <li>Go to Settings → Webhooks</li>
                        <li>Click "Add Webhook"</li>
                        <li>Enter your endpoint URL</li>
                        <li>Select which events to receive</li>
                        <li>Save and test the webhook</li>
                    </ol>
                    <h3 className="text-h5 mt-6 mb-3 not-prose">Available events</h3>
                    <ul className="list-disc pl-6 space-y-2">
                        <li><code>renewal.upcoming</code> - Service renewal is approaching</li>
                        <li><code>renewal.due</code> - Service renewal is due today</li>
                        <li><code>service.created</code> - New service added</li>
                        <li><code>service.updated</code> - Service details changed</li>
                        <li><code>service.deleted</code> - Service removed</li>
                        <li><code>project.created</code> - New project created</li>
                        <li><code>team.member_added</code> - Team member joined</li>
                        <li><code>credential.accessed</code> - Credential was viewed</li>
                    </ul>
                    <h3 className="text-h5 mt-6 mb-3 not-prose">Webhook payload example</h3>
                    <div className="bg-b-surface2 rounded-xl p-4 font-mono text-small overflow-x-auto">
                        <pre>{`{
  "event": "renewal.upcoming",
  "timestamp": "2024-01-15T10:00:00Z",
  "data": {
    "service_id": "srv_123",
    "service_name": "Stripe",
    "project_id": "prj_456",
    "renewal_date": "2024-01-22",
    "days_until_renewal": 7,
    "monthly_cost": 0
  }
}`}</pre>
                    </div>
                </div>
            </section>

            <section id="zapier" className="mb-12">
                <h2 className="text-h3 mb-4 not-prose">Zapier Integration</h2>
                <div className="space-y-4 text-body text-t-secondary">
                    <p>
                        Connect Nerlude with 5,000+ apps using Zapier—no coding required.
                    </p>
                    <h3 className="text-h5 mt-6 mb-3 not-prose">Popular Zaps</h3>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>Send renewal reminders to Slack</li>
                        <li>Create Notion pages for new services</li>
                        <li>Add new services to a Google Sheet</li>
                        <li>Send email digests of upcoming renewals</li>
                        <li>Create Trello cards for expiring services</li>
                    </ul>
                    <h3 className="text-h5 mt-6 mb-3 not-prose">Setting up Zapier</h3>
                    <ol className="list-decimal pl-6 space-y-2">
                        <li>Go to <a href="https://zapier.com" className="text-primary1 hover:underline">zapier.com</a> and create an account</li>
                        <li>Search for "Nerlude" in the app directory</li>
                        <li>Connect your Nerlude account using your API key</li>
                        <li>Create a Zap with Nerlude as a trigger or action</li>
                    </ol>
                </div>
            </section>

            <section id="slack" className="mb-12">
                <h2 className="text-h3 mb-4 not-prose">Slack Notifications</h2>
                <div className="space-y-4 text-body text-t-secondary">
                    <p>
                        Get Nerlude notifications directly in your Slack workspace.
                    </p>
                    <h3 className="text-h5 mt-6 mb-3 not-prose">Setting up Slack</h3>
                    <ol className="list-decimal pl-6 space-y-2">
                        <li>Go to Settings → Integrations → Slack</li>
                        <li>Click "Connect to Slack"</li>
                        <li>Authorize Nerlude in your Slack workspace</li>
                        <li>Choose which channel to receive notifications</li>
                        <li>Select which events to notify about</li>
                    </ol>
                    <h3 className="text-h5 mt-6 mb-3 not-prose">Notification types</h3>
                    <ul className="list-disc pl-6 space-y-2">
                        <li><strong>Renewal reminders</strong> - Get notified before services renew</li>
                        <li><strong>Cost alerts</strong> - When monthly burn exceeds a threshold</li>
                        <li><strong>Team activity</strong> - When team members access credentials</li>
                        <li><strong>Weekly digest</strong> - Summary of upcoming renewals</li>
                    </ul>
                </div>
            </section>

            <section id="import-export" className="mb-12">
                <h2 className="text-h3 mb-4 not-prose">Import & Export</h2>
                <div className="space-y-4 text-body text-t-secondary">
                    <h3 className="text-h5 mt-6 mb-3 not-prose">Importing data</h3>
                    <p>
                        You can import services from:
                    </p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li><strong>CSV files</strong> - Bulk import from spreadsheets</li>
                        <li><strong>JSON files</strong> - Import from other tools</li>
                        <li><strong>1Password</strong> - Import credentials (coming soon)</li>
                    </ul>
                    <h3 className="text-h5 mt-6 mb-3 not-prose">Exporting data</h3>
                    <p>
                        Export your data anytime in multiple formats:
                    </p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li><strong>CSV</strong> - For spreadsheets and analysis</li>
                        <li><strong>JSON</strong> - For programmatic use</li>
                        <li><strong>PDF</strong> - For documentation and audits</li>
                    </ul>
                    <p>
                        Go to Settings → Data → Export to download your data.
                    </p>
                    <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4 mt-4">
                        <p className="text-small text-green-600 dark:text-green-400">
                            <strong>✅ Your data, your choice:</strong> We believe your data belongs to you. Export everything anytime, no restrictions.
                        </p>
                    </div>
                </div>
            </section>

            {/* Related Articles */}
            <div className="border-t border-stroke-subtle pt-8 not-prose">
                <h2 className="text-h5 mb-4">Related Articles</h2>
                <div className="grid grid-cols-2 gap-4 max-md:grid-cols-1">
                    <Link href="/help/services" className="p-4 rounded-xl bg-b-surface2 hover:bg-b-surface2/80 transition-colors">
                        <span className="text-small font-medium text-t-primary">Managing Services →</span>
                    </Link>
                    <Link href="/help/security" className="p-4 rounded-xl bg-b-surface2 hover:bg-b-surface2/80 transition-colors">
                        <span className="text-small font-medium text-t-primary">Security →</span>
                    </Link>
                </div>
            </div>

            {/* JSON-LD */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "TechArticle",
                        "headline": "API & Integrations - Connect Your Tools with Nerlude",
                        "description": "Learn how to integrate Nerlude with your existing tools using our API, webhooks, and third-party integrations.",
                        "author": {
                            "@type": "Organization",
                            "name": "Nerlude"
                        }
                    })
                }}
            />
        </article>
    );
}

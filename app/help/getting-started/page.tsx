import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
    title: "Getting Started with Nerlude - Complete Beginner's Guide",
    description: "Learn how to set up Nerlude and start managing your SaaS stack. This comprehensive guide covers account creation, project setup, adding services, and dashboard navigation.",
    alternates: {
        canonical: "https://nerlude.com/help/getting-started",
    },
    openGraph: {
        title: "Getting Started with Nerlude - Complete Beginner's Guide",
        description: "Learn how to set up Nerlude and start managing your SaaS stack in minutes.",
        type: "article",
    },
};

export default function GettingStartedPage() {
    return (
        <article className="prose prose-slate max-w-none">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-small text-t-tertiary mb-8 not-prose">
                <Link href="/help" className="hover:text-t-primary transition-colors">Help Center</Link>
                <span>/</span>
                <span className="text-t-primary">Getting Started</span>
            </nav>

            <h1 className="text-h1 mb-4 not-prose">Getting Started with Nerlude</h1>
            <p className="text-body text-t-secondary mb-8 not-prose">
                Welcome to Nerlude! This guide will walk you through everything you need to know to start managing your SaaS stack effectively.
            </p>

            {/* Table of Contents */}
            <div className="bg-b-surface2 rounded-2xl p-6 mb-10 not-prose">
                <h2 className="text-body-bold mb-4">In this guide</h2>
                <ul className="space-y-2">
                    <li><a href="#what-is-nerlude" className="text-small text-primary1 hover:underline">What is Nerlude?</a></li>
                    <li><a href="#create-account" className="text-small text-primary1 hover:underline">Creating your account</a></li>
                    <li><a href="#create-project" className="text-small text-primary1 hover:underline">Creating your first project</a></li>
                    <li><a href="#add-services" className="text-small text-primary1 hover:underline">Adding services to your project</a></li>
                    <li><a href="#dashboard" className="text-small text-primary1 hover:underline">Understanding the dashboard</a></li>
                    <li><a href="#credentials" className="text-small text-primary1 hover:underline">Storing credentials securely</a></li>
                    <li><a href="#renewals" className="text-small text-primary1 hover:underline">Setting up renewal reminders</a></li>
                    <li><a href="#next-steps" className="text-small text-primary1 hover:underline">Next steps</a></li>
                </ul>
            </div>

            {/* Content Sections */}
            <section id="what-is-nerlude" className="mb-12">
                <h2 className="text-h3 mb-4 not-prose">What is Nerlude?</h2>
                <div className="space-y-4 text-body text-t-secondary">
                    <p>
                        Nerlude is a comprehensive SaaS management platform designed specifically for founders, indie hackers, and small teams who need to keep track of multiple software subscriptions, API keys, and digital services across their projects.
                    </p>
                    <p>
                        Think of Nerlude as the control center for your entire tech stack. Instead of scattered spreadsheets, password managers, and sticky notes, you get one unified dashboard where you can:
                    </p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li><strong>Track all your SaaS subscriptions</strong> - Know exactly what you're paying for and when renewals are due</li>
                        <li><strong>Store credentials securely</strong> - Keep API keys, passwords, and secrets encrypted with AES-256</li>
                        <li><strong>Monitor costs</strong> - See your total monthly burn across all services at a glance</li>
                        <li><strong>Never miss renewals</strong> - Get automated reminders before any subscription expires</li>
                        <li><strong>Collaborate with your team</strong> - Share access with team members using role-based permissions</li>
                        <li><strong>Document everything</strong> - Keep notes, setup instructions, and documentation for each service</li>
                    </ul>
                    <p>
                        Whether you're running a single side project or managing multiple products, Nerlude helps you stay organized and in control of your infrastructure.
                    </p>
                </div>
            </section>

            <section id="create-account" className="mb-12">
                <h2 className="text-h3 mb-4 not-prose">Creating Your Account</h2>
                <div className="space-y-4 text-body text-t-secondary">
                    <p>
                        Getting started with Nerlude takes less than a minute. Here's how to create your account:
                    </p>
                    <ol className="list-decimal pl-6 space-y-3">
                        <li>
                            <strong>Visit the signup page</strong> - Go to <Link href="/signup" className="text-primary1 hover:underline">nerlude.com/signup</Link> or click "Get Started Free" on our homepage.
                        </li>
                        <li>
                            <strong>Enter your details</strong> - Provide your email address and create a secure password. We recommend using a password manager to generate a strong, unique password.
                        </li>
                        <li>
                            <strong>Verify your email</strong> - Check your inbox for a verification email and click the confirmation link. This helps us keep your account secure.
                        </li>
                        <li>
                            <strong>Complete onboarding</strong> - Answer a few quick questions about your use case so we can personalize your experience.
                        </li>
                    </ol>
                    <p>
                        That's it! You're now ready to create your first project and start organizing your SaaS stack.
                    </p>
                    <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 mt-4">
                        <p className="text-small text-blue-600 dark:text-blue-400">
                            <strong>💡 Pro tip:</strong> You can also sign up using Google or GitHub for faster access. Your account will be linked to your existing credentials.
                        </p>
                    </div>
                </div>
            </section>

            <section id="create-project" className="mb-12">
                <h2 className="text-h3 mb-4 not-prose">Creating Your First Project</h2>
                <div className="space-y-4 text-body text-t-secondary">
                    <p>
                        In Nerlude, a <strong>project</strong> represents a product, app, or business that you're building. Each project contains its own set of services, credentials, and team members.
                    </p>
                    <p>
                        For example, if you're building a mobile app and a marketing website, you might create two separate projects to keep their services organized.
                    </p>
                    <h3 className="text-h5 mt-6 mb-3 not-prose">How to create a project:</h3>
                    <ol className="list-decimal pl-6 space-y-3">
                        <li>
                            <strong>Click "New Project"</strong> - You'll find this button in the top navigation bar or on your dashboard.
                        </li>
                        <li>
                            <strong>Choose a name</strong> - Give your project a descriptive name like "MyApp Production" or "Marketing Website".
                        </li>
                        <li>
                            <strong>Select a project type</strong> - Choose from Web App, Mobile App, API, Landing Page, Extension, or Desktop App. This helps categorize your project.
                        </li>
                        <li>
                            <strong>Pick an icon</strong> - Select an emoji or icon to make your project easily recognizable in the dashboard.
                        </li>
                        <li>
                            <strong>Add a description (optional)</strong> - Include any notes about the project for your reference.
                        </li>
                    </ol>
                    <p>
                        Once created, you'll be taken to your project's overview page where you can start adding services.
                    </p>
                </div>
            </section>

            <section id="add-services" className="mb-12">
                <h2 className="text-h3 mb-4 not-prose">Adding Services to Your Project</h2>
                <div className="space-y-4 text-body text-t-secondary">
                    <p>
                        Services are the individual SaaS tools, APIs, and subscriptions that power your project. Nerlude supports over 100 popular services out of the box, and you can add custom services for anything else.
                    </p>
                    <h3 className="text-h5 mt-6 mb-3 not-prose">To add a service:</h3>
                    <ol className="list-decimal pl-6 space-y-3">
                        <li>
                            <strong>Open your project</strong> - Navigate to the project where you want to add the service.
                        </li>
                        <li>
                            <strong>Click "Add Service"</strong> - You'll find this button on the Services tab or the project overview.
                        </li>
                        <li>
                            <strong>Search or browse</strong> - Find your service by searching (e.g., "Stripe", "AWS", "Vercel") or browse by category.
                        </li>
                        <li>
                            <strong>Fill in the details</strong> - Enter information like:
                            <ul className="list-disc pl-6 mt-2 space-y-1">
                                <li>Monthly cost (for tracking your burn rate)</li>
                                <li>Billing cycle (monthly, yearly, etc.)</li>
                                <li>Renewal date (to set up reminders)</li>
                                <li>Account email or username</li>
                            </ul>
                        </li>
                        <li>
                            <strong>Save the service</strong> - Click "Add Service" to save it to your project.
                        </li>
                    </ol>
                    <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 mt-4">
                        <p className="text-small text-amber-600 dark:text-amber-400">
                            <strong>⚠️ Note:</strong> You can always edit service details later. Don't worry about getting everything perfect on the first try.
                        </p>
                    </div>
                </div>
            </section>

            <section id="dashboard" className="mb-12">
                <h2 className="text-h3 mb-4 not-prose">Understanding the Dashboard</h2>
                <div className="space-y-4 text-body text-t-secondary">
                    <p>
                        Your Nerlude dashboard gives you a bird's-eye view of your entire SaaS stack. Here's what you'll find:
                    </p>
                    <h3 className="text-h5 mt-6 mb-3 not-prose">Stats Overview</h3>
                    <p>At the top of your dashboard, you'll see four key metrics:</p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li><strong>Active Projects</strong> - Total number of projects you're managing</li>
                        <li><strong>Monthly Burn</strong> - Combined cost of all your services per month</li>
                        <li><strong>Total Services</strong> - Number of services across all projects</li>
                        <li><strong>Upcoming Renewals</strong> - Services with renewals in the next 30 days</li>
                    </ul>
                    <h3 className="text-h5 mt-6 mb-3 not-prose">Project Cards</h3>
                    <p>
                        Below the stats, you'll see cards for each of your projects. Each card shows:
                    </p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>Project name and icon</li>
                        <li>Project type (Web App, Mobile, etc.)</li>
                        <li>Health status (Healthy, Warning, or Critical based on upcoming renewals)</li>
                        <li>Monthly cost for that project</li>
                        <li>Number of services</li>
                        <li>Alert count for urgent items</li>
                    </ul>
                    <p>
                        Click any project card to dive into its details and manage its services.
                    </p>
                </div>
            </section>

            <section id="credentials" className="mb-12">
                <h2 className="text-h3 mb-4 not-prose">Storing Credentials Securely</h2>
                <div className="space-y-4 text-body text-t-secondary">
                    <p>
                        One of Nerlude's most powerful features is secure credential storage. You can save API keys, passwords, tokens, and other secrets directly with each service.
                    </p>
                    <h3 className="text-h5 mt-6 mb-3 not-prose">How credential storage works:</h3>
                    <ol className="list-decimal pl-6 space-y-3">
                        <li>
                            <strong>Navigate to a service</strong> - Open any service in your project.
                        </li>
                        <li>
                            <strong>Go to the Credentials tab</strong> - You'll see options to add different types of credentials.
                        </li>
                        <li>
                            <strong>Add your credentials</strong> - Enter the credential name (e.g., "Production API Key") and the value.
                        </li>
                        <li>
                            <strong>Save securely</strong> - Your credentials are encrypted with AES-256 before being stored.
                        </li>
                    </ol>
                    <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4 mt-4">
                        <p className="text-small text-green-600 dark:text-green-400">
                            <strong>🔒 Security note:</strong> Credentials are encrypted at rest and in transit. Only you and team members with appropriate permissions can view them.
                        </p>
                    </div>
                </div>
            </section>

            <section id="renewals" className="mb-12">
                <h2 className="text-h3 mb-4 not-prose">Setting Up Renewal Reminders</h2>
                <div className="space-y-4 text-body text-t-secondary">
                    <p>
                        Never miss a subscription renewal again. Nerlude automatically tracks renewal dates and sends you reminders before they're due.
                    </p>
                    <h3 className="text-h5 mt-6 mb-3 not-prose">Default reminder schedule:</h3>
                    <ul className="list-disc pl-6 space-y-2">
                        <li><strong>30 days before</strong> - Early heads up for annual subscriptions</li>
                        <li><strong>14 days before</strong> - Time to review and decide</li>
                        <li><strong>7 days before</strong> - Final reminder</li>
                        <li><strong>1 day before</strong> - Last chance alert</li>
                    </ul>
                    <p>
                        You can customize these reminder intervals in your project settings or for individual services.
                    </p>
                    <h3 className="text-h5 mt-6 mb-3 not-prose">To set a renewal date:</h3>
                    <ol className="list-decimal pl-6 space-y-3">
                        <li>Open the service you want to configure</li>
                        <li>Click "Edit" or go to the Settings tab</li>
                        <li>Set the renewal date and billing cycle</li>
                        <li>Save your changes</li>
                    </ol>
                    <p>
                        Nerlude will automatically calculate future renewal dates based on your billing cycle.
                    </p>
                </div>
            </section>

            <section id="next-steps" className="mb-12">
                <h2 className="text-h3 mb-4 not-prose">Next Steps</h2>
                <div className="space-y-4 text-body text-t-secondary">
                    <p>
                        Now that you've got the basics down, here are some things you might want to explore:
                    </p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li><Link href="/help/team" className="text-primary1 hover:underline">Invite team members</Link> to collaborate on your projects</li>
                        <li><Link href="/help/services" className="text-primary1 hover:underline">Learn advanced service management</Link> techniques</li>
                        <li><Link href="/help/security" className="text-primary1 hover:underline">Review security best practices</Link> for your account</li>
                        <li><Link href="/help/billing" className="text-primary1 hover:underline">Explore pricing plans</Link> if you need more features</li>
                    </ul>
                </div>
            </section>

            {/* Related Articles */}
            <div className="border-t border-stroke-subtle pt-8 not-prose">
                <h2 className="text-h5 mb-4">Related Articles</h2>
                <div className="grid grid-cols-2 gap-4 max-md:grid-cols-1">
                    <Link href="/help/services" className="p-4 rounded-xl bg-b-surface2 hover:bg-b-surface2/80 transition-colors">
                        <span className="text-small font-medium text-t-primary">Managing Services →</span>
                    </Link>
                    <Link href="/help/team" className="p-4 rounded-xl bg-b-surface2 hover:bg-b-surface2/80 transition-colors">
                        <span className="text-small font-medium text-t-primary">Team Collaboration →</span>
                    </Link>
                </div>
            </div>

            {/* JSON-LD Structured Data */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "HowTo",
                        "name": "Getting Started with Nerlude",
                        "description": "Learn how to set up Nerlude and start managing your SaaS stack effectively.",
                        "step": [
                            {
                                "@type": "HowToStep",
                                "name": "Create your account",
                                "text": "Sign up at nerlude.com/signup with your email or use Google/GitHub authentication."
                            },
                            {
                                "@type": "HowToStep",
                                "name": "Create your first project",
                                "text": "Click 'New Project', choose a name, select a project type, and pick an icon."
                            },
                            {
                                "@type": "HowToStep",
                                "name": "Add services",
                                "text": "Search for services like Stripe, AWS, or Vercel and add them to your project with cost and renewal information."
                            },
                            {
                                "@type": "HowToStep",
                                "name": "Store credentials",
                                "text": "Add API keys and secrets to each service. They're encrypted with AES-256."
                            },
                            {
                                "@type": "HowToStep",
                                "name": "Set up reminders",
                                "text": "Configure renewal dates to receive automatic reminders before subscriptions expire."
                            }
                        ]
                    })
                }}
            />
        </article>
    );
}

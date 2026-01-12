import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
    title: {
        default: "Help Center | Nerlude",
        template: "%s | Nerlude Help Center",
    },
    description: "Get help with Nerlude - the control center for managing your SaaS stack. Find guides, tutorials, and answers to common questions.",
    openGraph: {
        title: "Help Center | Nerlude",
        description: "Get help with Nerlude - the control center for managing your SaaS stack.",
        type: "website",
    },
};

const helpCategories = [
    {
        title: "Getting Started",
        href: "/help/getting-started",
        description: "Learn the basics",
    },
    {
        title: "Managing Services",
        href: "/help/services",
        description: "Add and configure services",
    },
    {
        title: "Team Collaboration",
        href: "/help/team",
        description: "Work with your team",
    },
    {
        title: "Billing & Plans",
        href: "/help/billing",
        description: "Subscription management",
    },
    {
        title: "Security",
        href: "/help/security",
        description: "Keep your data safe",
    },
    {
        title: "API & Integrations",
        href: "/help/integrations",
        description: "Connect your tools",
    },
];

export default function HelpLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-b-surface1">
            {/* Header */}
            <header className="sticky top-0 z-50 border-b border-stroke-subtle bg-b-surface2">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2">
                        <img
                            src="/images/logo-dark.svg"
                            alt="Nerlude"
                            className="h-8 dark:hidden"
                        />
                        <img
                            src="/images/logo-light.svg"
                            alt="Nerlude"
                            className="h-8 hidden dark:block"
                        />
                    </Link>
                    <nav className="flex items-center gap-6">
                        <Link
                            href="/help"
                            className="text-base text-t-secondary hover:text-t-primary transition-colors"
                        >
                            Help Center
                        </Link>
                        <Link
                            href="/"
                            className="text-base text-t-secondary hover:text-t-primary transition-colors"
                        >
                            Back to App
                        </Link>
                    </nav>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-6 py-8 flex gap-8 max-lg:flex-col">
                {/* Sidebar */}
                <aside className="w-64 shrink-0 max-lg:w-full">
                    <nav className="sticky top-24 space-y-1">
                        <Link
                            href="/help"
                            className="block px-4 py-2 rounded-xl text-base font-medium text-t-secondary hover:text-t-primary hover:bg-b-surface2 transition-colors"
                        >
                            Overview
                        </Link>
                        {helpCategories.map((category) => (
                            <Link
                                key={category.href}
                                href={category.href}
                                className="block px-4 py-2 rounded-xl text-base text-t-secondary hover:text-t-primary hover:bg-b-surface2 transition-colors"
                            >
                                {category.title}
                            </Link>
                        ))}
                        <div className="pt-4 mt-4 border-t border-stroke-subtle">
                            <a
                                href="mailto:hello@nerlude.io"
                                className="block px-4 py-2 rounded-xl text-base text-t-tertiary hover:text-t-primary hover:bg-b-surface2 transition-colors"
                            >
                                Contact Support
                            </a>
                        </div>
                    </nav>
                </aside>

                {/* Main Content */}
                <main className="flex-1 min-w-0">{children}</main>
            </div>

            {/* Footer */}
            <footer className="border-t border-stroke-subtle bg-b-surface2 mt-16">
                <div className="max-w-7xl mx-auto px-6 py-8">
                    <div className="flex items-center justify-between max-md:flex-col max-md:gap-4">
                        <p className="text-base text-t-tertiary">
                            © {new Date().getFullYear()} Nerlude. All rights reserved.
                        </p>
                        <div className="flex items-center gap-6">
                            <Link
                                href="/terms"
                                className="text-base text-t-tertiary hover:text-t-primary transition-colors"
                            >
                                Terms
                            </Link>
                            <Link
                                href="/privacy"
                                className="text-base text-t-tertiary hover:text-t-primary transition-colors"
                            >
                                Privacy
                            </Link>
                            <a
                                href="mailto:hello@nerlude.io"
                                className="text-base text-t-tertiary hover:text-t-primary transition-colors"
                            >
                                hello@nerlude.io
                            </a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}

"use client";

import { useState, useMemo } from "react";
import Link from "next/link";

const categories = [
    {
        title: "Getting Started",
        description: "New to Nerlude? Start here to learn the basics of setting up your account and creating your first project.",
        href: "/help/getting-started",
        icon: "🚀",
        articles: ["Create your first project", "Add services to your project", "Understanding the dashboard"],
        keywords: ["start", "begin", "new", "account", "setup", "first", "project", "onboarding"],
    },
    {
        title: "Managing Services",
        description: "Learn how to add, configure, and organize all your SaaS tools and subscriptions in one place.",
        href: "/help/services",
        icon: "⚙️",
        articles: ["Adding a new service", "Managing credentials", "Setting renewal reminders"],
        keywords: ["service", "subscription", "saas", "tool", "add", "credentials", "api", "key", "renewal", "reminder"],
    },
    {
        title: "Team Collaboration",
        description: "Invite team members, set permissions, and collaborate effectively on your projects.",
        href: "/help/team",
        icon: "👥",
        articles: ["Inviting team members", "Role permissions", "Sharing projects"],
        keywords: ["team", "member", "invite", "permission", "role", "share", "collaborate", "access"],
    },
    {
        title: "Billing & Plans",
        description: "Understand our pricing, manage your subscription, and get answers to billing questions.",
        href: "/help/billing",
        icon: "💳",
        articles: ["Pricing plans explained", "Upgrading your plan", "Managing payment methods"],
        keywords: ["billing", "price", "pricing", "plan", "payment", "upgrade", "downgrade", "subscription", "cost", "free", "pro", "team"],
    },
    {
        title: "Security",
        description: "Learn about our security practices and how we keep your credentials and data safe.",
        href: "/help/security",
        icon: "🔒",
        articles: ["How we encrypt your data", "Two-factor authentication", "Security best practices"],
        keywords: ["security", "encrypt", "encryption", "password", "2fa", "authentication", "safe", "protect", "data"],
    },
    {
        title: "API & Integrations",
        description: "Connect Nerlude with your existing tools and automate your workflow.",
        href: "/help/integrations",
        icon: "🔗",
        articles: ["API documentation", "Webhooks setup", "Third-party integrations"],
        keywords: ["api", "integration", "webhook", "connect", "automate", "zapier", "slack", "import", "export"],
    },
];

const popularArticles = [
    { title: "How to create your first project", href: "/help/getting-started#create-project", keywords: ["create", "project", "first", "new"] },
    { title: "Adding and managing services", href: "/help/services#add-service", keywords: ["add", "service", "manage"] },
    { title: "Setting up renewal reminders", href: "/help/services#renewal-reminders", keywords: ["renewal", "reminder", "alert", "notification"] },
    { title: "Inviting team members", href: "/help/team#invite-members", keywords: ["invite", "team", "member", "add"] },
    { title: "Understanding pricing plans", href: "/help/billing#pricing", keywords: ["pricing", "plan", "cost", "free", "pro"] },
    { title: "Securing your credentials", href: "/help/security#credentials", keywords: ["security", "credential", "password", "api", "key"] },
];

export default function HelpContent() {
    const [searchQuery, setSearchQuery] = useState("");

    const filteredCategories = useMemo(() => {
        if (!searchQuery.trim()) return categories;
        const query = searchQuery.toLowerCase();
        return categories.filter(
            (cat) =>
                cat.title.toLowerCase().includes(query) ||
                cat.description.toLowerCase().includes(query) ||
                cat.articles.some((a) => a.toLowerCase().includes(query)) ||
                cat.keywords.some((k) => k.includes(query))
        );
    }, [searchQuery]);

    const filteredArticles = useMemo(() => {
        if (!searchQuery.trim()) return popularArticles;
        const query = searchQuery.toLowerCase();
        return popularArticles.filter(
            (article) =>
                article.title.toLowerCase().includes(query) ||
                article.keywords.some((k) => k.includes(query))
        );
    }, [searchQuery]);

    const hasResults = filteredCategories.length > 0 || filteredArticles.length > 0;

    return (
        <div className="space-y-12">
            {/* Hero Section */}
            <div className="text-center py-8">
                <h1 className="text-h1 mb-4">How can we help you?</h1>
                <p className="text-body text-t-secondary max-w-2xl mx-auto">
                    Find guides, tutorials, and answers to help you get the most out of Nerlude.
                    Can't find what you're looking for? <a href="mailto:hello@nerlude.io" className="text-primary1 hover:underline">Contact us</a>.
                </p>
            </div>

            {/* Search */}
            <div className="max-w-xl mx-auto">
                <div className="relative">
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search for help articles..."
                        className="w-full px-5 py-4 pl-12 rounded-2xl bg-b-surface2 border border-stroke-subtle text-body placeholder:text-t-tertiary focus:outline-none focus:ring-2 focus:ring-primary1/20"
                    />
                    <svg
                        className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-t-tertiary"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                    </svg>
                    {searchQuery && (
                        <button
                            onClick={() => setSearchQuery("")}
                            className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center rounded-full bg-b-surface1 text-t-tertiary hover:text-t-primary transition-colors"
                        >
                            ×
                        </button>
                    )}
                </div>
                {searchQuery && (
                    <p className="mt-2 text-sm text-t-tertiary text-center">
                        {hasResults
                            ? `Found ${filteredCategories.length} categories and ${filteredArticles.length} articles`
                            : "No results found. Try a different search term."}
                    </p>
                )}
            </div>

            {/* No Results */}
            {searchQuery && !hasResults && (
                <div className="text-center py-12">
                    <p className="text-h4 mb-2">No results found</p>
                    <p className="text-body text-t-secondary mb-6">
                        Try searching for something else, or browse the categories below.
                    </p>
                    <button
                        onClick={() => setSearchQuery("")}
                        className="text-primary1 hover:underline"
                    >
                        Clear search
                    </button>
                </div>
            )}

            {/* Categories Grid */}
            {filteredCategories.length > 0 && (
                <div className="grid grid-cols-2 gap-6 max-md:grid-cols-1">
                    {filteredCategories.map((category) => (
                        <Link
                            key={category.href}
                            href={category.href}
                            className="group p-6 rounded-3xl bg-b-surface2 border border-stroke-subtle hover:border-primary1/30 hover:shadow-lg transition-all"
                        >
                            <div className="flex items-start gap-4">
                                <span className="text-3xl">{category.icon}</span>
                                <div className="flex-1">
                                    <h2 className="text-lg font-semibold mb-2 group-hover:text-primary1 transition-colors">
                                        {category.title}
                                    </h2>
                                    <p className="text-base text-t-secondary mb-4">
                                        {category.description}
                                    </p>
                                    <ul className="space-y-1">
                                        {category.articles.map((article) => (
                                            <li key={article} className="text-sm text-t-tertiary">
                                                • {article}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}

            {/* Popular Articles */}
            {filteredArticles.length > 0 && (
                <div className="bg-b-surface2 rounded-3xl p-8">
                    <h2 className="text-h4 mb-6">
                        {searchQuery ? "Matching Articles" : "Popular Articles"}
                    </h2>
                    <div className="grid grid-cols-2 gap-4 max-md:grid-cols-1">
                        {filteredArticles.map((article) => (
                            <Link
                                key={article.href}
                                href={article.href}
                                className="flex items-center gap-3 p-4 rounded-xl hover:bg-b-surface1 transition-colors"
                            >
                                <span className="text-primary1">→</span>
                                <span className="text-base text-t-primary hover:text-primary1 transition-colors">
                                    {article.title}
                                </span>
                            </Link>
                        ))}
                    </div>
                </div>
            )}

            {/* Contact Section */}
            <div className="text-center py-8 border-t border-stroke-subtle">
                <h2 className="text-h4 mb-3">Still need help?</h2>
                <p className="text-body text-t-secondary mb-6">
                    Our support team is here to help you with any questions.
                </p>
                <a
                    href="mailto:hello@nerlude.io"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary1 text-white font-medium hover:bg-primary1/90 transition-colors"
                >
                    Contact Support
                </a>
            </div>
        </div>
    );
}

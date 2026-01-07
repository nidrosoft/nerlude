"use client";

import { useState } from "react";
import Icon from "@/components/Icon";

interface FAQItem {
    question: string;
    answer: string;
}

const faqs: FAQItem[] = [
    {
        question: "How do I add a new service?",
        answer: "Navigate to your project, click the 'Add Service' button, select a category, and follow the setup wizard to connect your service.",
    },
    {
        question: "How do I manage credentials?",
        answer: "Go to the service detail page and click on the 'Credentials' tab. You can view, copy, and manage all your API keys and secrets there.",
    },
    {
        question: "How do I invite team members?",
        answer: "Go to Settings > Team, click 'Invite Member', enter their email address, and select their role. They'll receive an invitation email.",
    },
    {
        question: "How do I set up renewal reminders?",
        answer: "When adding or editing a service, you can configure renewal reminder days. You'll receive notifications before each renewal date.",
    },
    {
        question: "How do I export my data?",
        answer: "Go to Settings > Workspace, scroll to the 'Data Export' section, select your preferred format (JSON or CSV), and click Export.",
    },
];

const HelpWidget = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<"help" | "faq" | "contact">("help");
    const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
    const [message, setMessage] = useState("");

    const handleSendMessage = () => {
        if (!message.trim()) return;
        // In a real app, this would send to support
        alert("Message sent! Our team will get back to you soon.");
        setMessage("");
    };

    return (
        <>
            {/* Floating Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`fixed bottom-6 right-6 z-40 flex items-center justify-center size-14 rounded-full shadow-lg transition-all ${
                    isOpen ? "bg-b-surface2 fill-t-primary rotate-45" : "bg-primary1 fill-white"
                }`}
            >
                <Icon className="!w-6 !h-6" name={isOpen ? "plus" : "question-circle"} />
            </button>

            {/* Widget Panel */}
            {isOpen && (
                <div className="fixed bottom-24 right-6 z-40 w-96 max-h-[70vh] rounded-3xl bg-b-surface1 shadow-2xl border border-stroke-subtle overflow-hidden max-md:w-[calc(100%-3rem)] max-md:right-6 max-md:left-6">
                    {/* Header */}
                    <div className="p-5 border-b border-stroke-subtle">
                        <h3 className="text-body-bold">Help Center</h3>
                        <p className="text-small text-t-secondary mt-1">How can we help you today?</p>
                    </div>

                    {/* Tabs */}
                    <div className="flex border-b border-stroke-subtle">
                        {[
                            { id: "help", label: "Quick Help", icon: "bulb" },
                            { id: "faq", label: "FAQ", icon: "question-circle" },
                            { id: "contact", label: "Contact", icon: "chat" },
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                                className={`flex-1 flex items-center justify-center gap-2 py-3 text-small font-medium transition-colors ${
                                    activeTab === tab.id
                                        ? "text-primary1 border-b-2 border-primary1 fill-primary1"
                                        : "text-t-secondary fill-t-secondary hover:text-t-primary hover:fill-t-primary"
                                }`}
                            >
                                <Icon className="!w-4 !h-4" name={tab.icon} />
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {/* Content */}
                    <div className="p-5 max-h-80 overflow-y-auto">
                        {activeTab === "help" && (
                            <div className="space-y-3">
                                <a
                                    href="/help/getting-started"
                                    className="flex items-center gap-3 p-3 rounded-xl bg-b-surface2 hover:bg-b-surface2/80 transition-colors"
                                >
                                    <div className="flex items-center justify-center size-10 rounded-xl bg-blue-500/10 fill-blue-500">
                                        <Icon className="!w-5 !h-5" name="bulb" />
                                    </div>
                                    <div>
                                        <div className="text-small font-medium text-t-primary">Getting Started</div>
                                        <div className="text-xs text-t-tertiary">Learn the basics of Nelrude</div>
                                    </div>
                                </a>
                                <a
                                    href="/help/services"
                                    className="flex items-center gap-3 p-3 rounded-xl bg-b-surface2 hover:bg-b-surface2/80 transition-colors"
                                >
                                    <div className="flex items-center justify-center size-10 rounded-xl bg-purple-500/10 fill-purple-500">
                                        <Icon className="!w-5 !h-5" name="cube" />
                                    </div>
                                    <div>
                                        <div className="text-small font-medium text-t-primary">Managing Services</div>
                                        <div className="text-xs text-t-tertiary">Add and configure services</div>
                                    </div>
                                </a>
                                <a
                                    href="/help/team"
                                    className="flex items-center gap-3 p-3 rounded-xl bg-b-surface2 hover:bg-b-surface2/80 transition-colors"
                                >
                                    <div className="flex items-center justify-center size-10 rounded-xl bg-green-500/10 fill-green-500">
                                        <Icon className="!w-5 !h-5" name="users" />
                                    </div>
                                    <div>
                                        <div className="text-small font-medium text-t-primary">Team Collaboration</div>
                                        <div className="text-xs text-t-tertiary">Invite and manage team members</div>
                                    </div>
                                </a>
                                <a
                                    href="/help/billing"
                                    className="flex items-center gap-3 p-3 rounded-xl bg-b-surface2 hover:bg-b-surface2/80 transition-colors"
                                >
                                    <div className="flex items-center justify-center size-10 rounded-xl bg-amber-500/10 fill-amber-500">
                                        <Icon className="!w-5 !h-5" name="documents" />
                                    </div>
                                    <div>
                                        <div className="text-small font-medium text-t-primary">Billing & Plans</div>
                                        <div className="text-xs text-t-tertiary">Manage your subscription</div>
                                    </div>
                                </a>
                            </div>
                        )}

                        {activeTab === "faq" && (
                            <div className="space-y-2">
                                {faqs.map((faq, index) => (
                                    <div key={index} className="rounded-xl bg-b-surface2 overflow-hidden">
                                        <button
                                            onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                                            className="flex items-center justify-between w-full p-4 text-left"
                                        >
                                            <span className="text-small font-medium text-t-primary pr-4">{faq.question}</span>
                                            <Icon
                                                className={`!w-4 !h-4 fill-t-tertiary shrink-0 transition-transform ${
                                                    expandedFaq === index ? "rotate-180" : ""
                                                }`}
                                                name="chevron"
                                            />
                                        </button>
                                        {expandedFaq === index && (
                                            <div className="px-4 pb-4 text-small text-t-secondary">
                                                {faq.answer}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}

                        {activeTab === "contact" && (
                            <div className="space-y-4">
                                <p className="text-small text-t-secondary">
                                    Can't find what you're looking for? Send us a message and we'll get back to you.
                                </p>
                                <textarea
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    placeholder="Describe your issue or question..."
                                    rows={4}
                                    className="w-full px-4 py-3 rounded-xl bg-b-surface2 text-small text-t-primary placeholder:text-t-tertiary resize-none focus:outline-none focus:ring-2 focus:ring-primary1/20"
                                />
                                <button
                                    onClick={handleSendMessage}
                                    disabled={!message.trim()}
                                    className="w-full py-3 rounded-xl bg-primary1 text-white text-small font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary1/90 transition-colors"
                                >
                                    Send Message
                                </button>
                                <div className="flex items-center justify-center gap-4 pt-2">
                                    <a href="mailto:hello@nerlude.com" className="text-xs text-t-tertiary hover:text-t-primary transition-colors">
                                        hello@nerlude.com
                                    </a>
                                    <span className="w-1 h-1 rounded-full bg-t-tertiary" />
                                    <a href="/help" className="text-xs text-t-tertiary hover:text-t-primary transition-colors">
                                        Documentation
                                    </a>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
};

export default HelpWidget;

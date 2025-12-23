"use client";

import { useState } from "react";
import Icon from "@/components/Icon";

const faqs = [
    {
        question: "Is my data secure?",
        answer: "Absolutely. All credentials are encrypted using AES-256 encryption at rest. We never store your secrets in plain text, and our infrastructure is built on industry-leading security practices. Your data is yours—we can't read it even if we wanted to.",
    },
    {
        question: "Can I import from Notion or spreadsheets?",
        answer: "Yes! We support importing from CSV files, which means you can export from Notion, Google Sheets, or any spreadsheet tool. We also have a guided import wizard that helps you map your existing data to Nelrude's structure.",
    },
    {
        question: "What happens if I cancel?",
        answer: "You can export all your data at any time. If you cancel a paid plan, you'll be downgraded to the Free plan at the end of your billing cycle. Your projects and data remain accessible, but you'll be limited to 1 project.",
    },
    {
        question: "Do you support custom services?",
        answer: "Yes! While we have 100+ pre-configured services with smart defaults, you can add any custom service. Just give it a name, add your credentials, and configure the fields you need. Perfect for internal tools or niche services.",
    },
    {
        question: "Can I invite contractors with limited access?",
        answer: "Absolutely. You can invite team members with time-limited access that automatically expires. Set their role (Viewer, Member, or Admin) and choose which projects they can access. When the contract ends, access is revoked automatically.",
    },
    {
        question: "What integrations do you support?",
        answer: "We support 100+ services including Vercel, Supabase, Stripe, AWS, Cloudflare, Namecheap, Resend, and many more. We're constantly adding new integrations based on user requests. Don't see yours? Let us know!",
    },
    {
        question: "How do renewal alerts work?",
        answer: "You set the renewal date for each service, and we'll send you alerts at 30, 14, 7, and 1 day before expiration. Alerts can be delivered via email, Slack (Pro plan), or in-app notifications. Never miss a domain expiration again.",
    },
    {
        question: "Is there a free trial?",
        answer: "Yes! All paid plans come with a 14-day free trial. No credit card required to start. The Free plan is also free forever—perfect for trying Nelrude with your first project before upgrading.",
    },
];

const FAQ = () => {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    const toggleFaq = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <div className="section section-lines before:-top-12! before:-bottom-12! after:-top-12! after:-bottom-12! max-md:before:hidden max-md:after:hidden">
            <div className="relative before:absolute before:top-0 before:left-0 before:right-0 before:h-[1.5px] before:bg-linear-(--gradient-horizontal) after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[1.5px] after:bg-linear-(--gradient-horizontal) max-md:before:hidden max-md:after:hidden">
                <div className="center">
                    <div className="py-16 max-lg:py-12 max-md:py-10">
                        <div className="mb-12 text-center max-md:text-left max-md:mb-10">
                            <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 rounded-full bg-accent2/10 text-accent2 text-button">
                                <span className="w-2 h-2 rounded-full bg-accent2"></span>
                                FAQ
                            </div>
                            <h2 className="mb-4 text-h1">
                                Frequently asked questions
                            </h2>
                            <p className="max-w-140 mx-auto text-body-lg text-t-secondary max-md:max-w-full">
                                Everything you need to know about Nelrude.
                            </p>
                        </div>
                        <div className="max-w-180 mx-auto">
                            <div className="relative p-1.5 border-[1.5px] border-stroke-subtle rounded-4xl">
                                <div className="rounded-3xl bg-b-surface2 overflow-hidden divide-y divide-stroke-subtle">
                                    {faqs.map((faq, index) => (
                                        <div key={index}>
                                            <button
                                                onClick={() => toggleFaq(index)}
                                                className="w-full flex items-center justify-between gap-4 p-6 text-left hover:bg-b-subtle/30 transition-colors max-md:p-4"
                                            >
                                                <span className="text-body-lg-bold">{faq.question}</span>
                                                <div
                                                    className={`shrink-0 w-8 h-8 rounded-full bg-b-subtle flex items-center justify-center transition-transform duration-200 ${
                                                        openIndex === index ? "rotate-180" : ""
                                                    }`}
                                                >
                                                    <div className="fill-t-primary">
                                                        <Icon name="chevron" />
                                                    </div>
                                                </div>
                                            </button>
                                            <div
                                                className={`overflow-hidden transition-all duration-300 ${
                                                    openIndex === index ? "max-h-96" : "max-h-0"
                                                }`}
                                            >
                                                <div className="px-6 pb-6 text-body text-t-secondary max-md:px-4 max-md:pb-4">
                                                    {faq.answer}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FAQ;

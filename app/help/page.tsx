import type { Metadata } from "next";
import HelpContent from "./HelpContent";

export const metadata: Metadata = {
    title: "Help Center",
    description: "Get help with Nerlude - find guides, tutorials, FAQs, and answers to common questions about managing your SaaS stack.",
    alternates: {
        canonical: "https://nerlude.com/help",
    },
};

export default function HelpCenterPage() {
    return (
        <>
            <HelpContent />
            
            {/* JSON-LD Structured Data for SEO */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "FAQPage",
                        "mainEntity": [
                            {
                                "@type": "Question",
                                "name": "What is Nerlude?",
                                "acceptedAnswer": {
                                    "@type": "Answer",
                                    "text": "Nerlude is a SaaS management platform that helps founders and teams track all their subscriptions, store credentials securely, manage costs, and never miss a renewal. It's the control center for your entire SaaS stack."
                                }
                            },
                            {
                                "@type": "Question",
                                "name": "How do I get started with Nerlude?",
                                "acceptedAnswer": {
                                    "@type": "Answer",
                                    "text": "Sign up for a free account, create your first project, and start adding your services. Nerlude will help you organize everything and set up renewal reminders automatically."
                                }
                            },
                            {
                                "@type": "Question",
                                "name": "Is Nerlude free to use?",
                                "acceptedAnswer": {
                                    "@type": "Answer",
                                    "text": "Yes! Nerlude offers a free plan that includes 1 project, 1 team member, 5 services, project documentation, and community support. Paid plans are available for teams that need more features."
                                }
                            },
                            {
                                "@type": "Question",
                                "name": "How does Nerlude keep my credentials secure?",
                                "acceptedAnswer": {
                                    "@type": "Answer",
                                    "text": "Nerlude uses AES-256 encryption to protect all stored credentials. Your data is encrypted at rest and in transit, and we follow industry best practices for security."
                                }
                            }
                        ]
                    })
                }}
            />
        </>
    );
}

import type { Metadata } from "next";
import localFont from "next/font/local";
import Providers from "./providers";
import "./globals.css";

const satoshi = localFont({
    src: [
        {
            path: "../public/fonts/Satoshi-Light.woff2",
            weight: "300",
        },
        {
            path: "../public/fonts/Satoshi-Regular.woff2",
            weight: "400",
        },
        {
            path: "../public/fonts/Satoshi-Medium.woff2",
            weight: "500",
        },
        {
            path: "../public/fonts/Satoshi-Bold.woff2",
            weight: "700",
        },
    ],
    variable: "--font-satoshi",
});

export const metadata: Metadata = {
    title: {
        default: "Nerlude - The Control Center for Your SaaS Stack",
        template: "%s | Nerlude",
    },
    description: "Stop losing money to forgotten renewals. Nerlude helps founders track services, store credentials securely, and manage costs across all their products in one dashboard.",
    keywords: [
        "SaaS management",
        "subscription tracking",
        "credential management",
        "API key storage",
        "renewal alerts",
        "indie hacker tools",
        "founder tools",
        "product infrastructure",
        "service management",
        "cost tracking",
    ],
    authors: [{ name: "Nerlude" }],
    creator: "Nerlude",
    publisher: "Nerlude",
    metadataBase: new URL("https://nerlude.com"),
    openGraph: {
        type: "website",
        locale: "en_US",
        url: "https://nerlude.com",
        siteName: "Nerlude",
        title: "Nerlude - The Control Center for Your SaaS Stack",
        description: "Stop losing money to forgotten renewals. Track services, store credentials securely, and manage costs across all your products in one beautiful dashboard.",
        images: [
            {
                url: "/images/twittercard.png",
                width: 1200,
                height: 630,
                alt: "Nerlude - The Control Center for Your SaaS Stack",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "Nerlude - The Control Center for Your SaaS Stack",
        description: "Stop losing money to forgotten renewals. Track services, store credentials securely, and manage costs across all your products.",
        site: "@nerlude",
        creator: "@nerlude",
        images: ["/images/twittercard.png"],
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            "max-video-preview": -1,
            "max-image-preview": "large",
            "max-snippet": -1,
        },
    },
    verification: {
        google: "your-google-verification-code",
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <head>
                <link rel="canonical" href="https://nerlude.com" />
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify({
                            "@context": "https://schema.org",
                            "@type": "SoftwareApplication",
                            "name": "Nerlude",
                            "applicationCategory": "BusinessApplication",
                            "operatingSystem": "Web Browser",
                            "description": "Nerlude is a SaaS management platform that helps founders track subscriptions, store credentials securely, and never miss a renewal.",
                            "offers": {
                                "@type": "Offer",
                                "price": "0",
                                "priceCurrency": "USD"
                            },
                            "aggregateRating": {
                                "@type": "AggregateRating",
                                "ratingValue": "4.8",
                                "ratingCount": "150"
                            }
                        })
                    }}
                />
            </head>
            <body
                className={`${satoshi.variable} bg-b-surface1 font-satoshi text-[1rem] text-t-primary antialiased`}
            >
                <Providers>{children}</Providers>
            </body>
        </html>
    );
}

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
    title: "Nelrude",
    description: "The control center for founders to manage product infrastructure",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <head>
                {/* Description no longer than 155 characters */}
                <meta
                    name="description"
                    content="Nelrude: The control center for founders to manage product infrastructure"
                />
                {/* Product Name */}
                <meta
                    name="product-name"
                    content="Nelrude - Product Infrastructure Management"
                />
                {/* Twitter Card data */}
                <meta name="twitter:card" content="summary" />
                <meta name="twitter:site" content="@nelrude" />
                <meta
                    name="twitter:title"
                    content="Nelrude - Product Infrastructure Management"
                />
                <meta
                    name="twitter:description"
                    content="The control center for founders to manage product infrastructure - domains, hosting, databases, API keys, and more."
                />
                <meta name="twitter:creator" content="@nelrude" />
                {/* Twitter Summary card images must be at least 120x120px */}
                <meta
                    name="twitter:image"
                    content="/og-image.png"
                />
                {/* Open Graph data for Facebook */}
                <meta
                    property="og:title"
                    content="Nelrude - Product Infrastructure Management"
                />
                <meta property="og:type" content="website" />
                <meta
                    property="og:url"
                    content="https://nelrude.com"
                />
                <meta
                    property="og:image"
                    content="/og-image.png"
                />
                <meta
                    property="og:description"
                    content="The control center for founders to manage product infrastructure - domains, hosting, databases, API keys, and more."
                />
                <meta
                    property="og:site_name"
                    content="Nelrude"
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

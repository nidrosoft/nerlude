import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
    title: "Security - How Nerlude Protects Your Data and Credentials",
    description: "Learn about Nerlude's security practices, encryption methods, and how we keep your API keys, passwords, and sensitive data safe. SOC 2 ready, GDPR compliant.",
    alternates: {
        canonical: "https://nerlude.com/help/security",
    },
    openGraph: {
        title: "Security at Nerlude - Protecting Your Data",
        description: "Bank-level encryption, SOC 2 ready, GDPR compliant. Learn how Nerlude keeps your credentials safe.",
        type: "article",
    },
};

export default function SecurityPage() {
    return (
        <article className="prose prose-slate max-w-none">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-small text-t-tertiary mb-8 not-prose">
                <Link href="/help" className="hover:text-t-primary transition-colors">Help Center</Link>
                <span>/</span>
                <span className="text-t-primary">Security</span>
            </nav>

            <h1 className="text-h1 mb-4 not-prose">Security at Nerlude</h1>
            <p className="text-body text-t-secondary mb-8 not-prose">
                Your security is our top priority. Learn how we protect your credentials, data, and privacy with industry-leading security practices.
            </p>

            {/* Security Badges */}
            <div className="flex flex-wrap gap-4 mb-10 not-prose">
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 text-green-600">
                    <span>🔒</span>
                    <span className="text-small font-medium">AES-256 Encryption</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 text-blue-600">
                    <span>🛡️</span>
                    <span className="text-small font-medium">SOC 2 Ready</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 text-purple-600">
                    <span>🇪🇺</span>
                    <span className="text-small font-medium">GDPR Compliant</span>
                </div>
            </div>

            {/* Table of Contents */}
            <div className="bg-b-surface2 rounded-2xl p-6 mb-10 not-prose">
                <h2 className="text-body-bold mb-4">In this guide</h2>
                <ul className="space-y-2">
                    <li><a href="#overview" className="text-small text-primary1 hover:underline">Security overview</a></li>
                    <li><a href="#encryption" className="text-small text-primary1 hover:underline">How we encrypt your data</a></li>
                    <li><a href="#credentials" className="text-small text-primary1 hover:underline">Credential security</a></li>
                    <li><a href="#authentication" className="text-small text-primary1 hover:underline">Authentication & access</a></li>
                    <li><a href="#infrastructure" className="text-small text-primary1 hover:underline">Infrastructure security</a></li>
                    <li><a href="#compliance" className="text-small text-primary1 hover:underline">Compliance & certifications</a></li>
                    <li><a href="#best-practices" className="text-small text-primary1 hover:underline">Security best practices</a></li>
                    <li><a href="#reporting" className="text-small text-primary1 hover:underline">Reporting vulnerabilities</a></li>
                </ul>
            </div>

            <section id="overview" className="mb-12">
                <h2 className="text-h3 mb-4 not-prose">Security Overview</h2>
                <div className="space-y-4 text-body text-t-secondary">
                    <p>
                        Nerlude is built from the ground up with security in mind. We understand that you're trusting us with sensitive information—API keys, passwords, and business-critical credentials—and we take that responsibility seriously.
                    </p>
                    <p>
                        Our security approach is based on three principles:
                    </p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li><strong>Defense in depth</strong> - Multiple layers of security at every level</li>
                        <li><strong>Least privilege</strong> - Access only what's needed, when it's needed</li>
                        <li><strong>Transparency</strong> - Clear communication about how we protect your data</li>
                    </ul>
                </div>
            </section>

            <section id="encryption" className="mb-12">
                <h2 className="text-h3 mb-4 not-prose">How We Encrypt Your Data</h2>
                <div className="space-y-4 text-body text-t-secondary">
                    <h3 className="text-h5 mt-6 mb-3 not-prose">Encryption at rest</h3>
                    <p>
                        All sensitive data stored in Nerlude is encrypted using <strong>AES-256 encryption</strong>, the same standard used by banks and government agencies. This includes:
                    </p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>API keys and secrets</li>
                        <li>Passwords and tokens</li>
                        <li>Database connection strings</li>
                        <li>Any custom credentials you store</li>
                    </ul>
                    <h3 className="text-h5 mt-6 mb-3 not-prose">Encryption in transit</h3>
                    <p>
                        All data transmitted between your browser and our servers is encrypted using <strong>TLS 1.3</strong>. We enforce HTTPS on all connections and use HSTS to prevent downgrade attacks.
                    </p>
                    <h3 className="text-h5 mt-6 mb-3 not-prose">Key management</h3>
                    <p>
                        Encryption keys are managed using industry best practices:
                    </p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>Keys are stored separately from encrypted data</li>
                        <li>Keys are rotated regularly</li>
                        <li>Access to keys is strictly controlled and audited</li>
                        <li>We use hardware security modules (HSMs) for key storage</li>
                    </ul>
                </div>
            </section>

            <section id="credentials" className="mb-12">
                <h2 className="text-h3 mb-4 not-prose">Credential Security</h2>
                <div className="space-y-4 text-body text-t-secondary">
                    <p>
                        Credentials are the most sensitive data in Nerlude, and we treat them with extra care:
                    </p>
                    <div className="space-y-4 mt-6 not-prose">
                        <div className="p-5 rounded-xl bg-b-surface2 border-l-4 border-green-500">
                            <h3 className="text-body-bold text-t-primary mb-2">🔐 Zero-knowledge architecture</h3>
                            <p className="text-small text-t-secondary">
                                Credentials are encrypted before they leave your browser. We never see your plaintext secrets.
                            </p>
                        </div>
                        <div className="p-5 rounded-xl bg-b-surface2 border-l-4 border-blue-500">
                            <h3 className="text-body-bold text-t-primary mb-2">👁️ View-only decryption</h3>
                            <p className="text-small text-t-secondary">
                                Credentials are only decrypted when you explicitly choose to view them. They're never decrypted in the background.
                            </p>
                        </div>
                        <div className="p-5 rounded-xl bg-b-surface2 border-l-4 border-purple-500">
                            <h3 className="text-body-bold text-t-primary mb-2">📋 Secure clipboard</h3>
                            <p className="text-small text-t-secondary">
                                When you copy a credential, it's automatically cleared from your clipboard after 30 seconds.
                            </p>
                        </div>
                        <div className="p-5 rounded-xl bg-b-surface2 border-l-4 border-amber-500">
                            <h3 className="text-body-bold text-t-primary mb-2">📝 Access logging</h3>
                            <p className="text-small text-t-secondary">
                                Every credential access is logged with timestamp, user, and IP address for audit purposes.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <section id="authentication" className="mb-12">
                <h2 className="text-h3 mb-4 not-prose">Authentication & Access</h2>
                <div className="space-y-4 text-body text-t-secondary">
                    <h3 className="text-h5 mt-6 mb-3 not-prose">Password security</h3>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>Passwords are hashed using bcrypt with high work factor</li>
                        <li>We enforce minimum password requirements</li>
                        <li>Passwords are checked against known breach databases</li>
                        <li>We never store plaintext passwords</li>
                    </ul>
                    <h3 className="text-h5 mt-6 mb-3 not-prose">Two-factor authentication (2FA)</h3>
                    <p>
                        We strongly recommend enabling 2FA on your account. We support:
                    </p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>Authenticator apps (Google Authenticator, Authy, 1Password)</li>
                        <li>SMS verification (as backup)</li>
                        <li>Recovery codes for account recovery</li>
                    </ul>
                    <h3 className="text-h5 mt-6 mb-3 not-prose">Session management</h3>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>Sessions expire after 30 days of inactivity</li>
                        <li>You can view and revoke active sessions</li>
                        <li>Sensitive actions require re-authentication</li>
                        <li>Sessions are invalidated on password change</li>
                    </ul>
                </div>
            </section>

            <section id="infrastructure" className="mb-12">
                <h2 className="text-h3 mb-4 not-prose">Infrastructure Security</h2>
                <div className="space-y-4 text-body text-t-secondary">
                    <p>
                        Our infrastructure is designed for security and reliability:
                    </p>
                    <ul className="list-disc pl-6 space-y-3">
                        <li>
                            <strong>Cloud hosting</strong> - We use enterprise-grade cloud providers with SOC 2 Type II certification
                        </li>
                        <li>
                            <strong>Network security</strong> - Firewalls, DDoS protection, and intrusion detection systems
                        </li>
                        <li>
                            <strong>Database security</strong> - Encrypted databases with automated backups and point-in-time recovery
                        </li>
                        <li>
                            <strong>Monitoring</strong> - 24/7 monitoring for security anomalies and performance issues
                        </li>
                        <li>
                            <strong>Regular updates</strong> - Security patches applied within 24 hours of release
                        </li>
                    </ul>
                </div>
            </section>

            <section id="compliance" className="mb-12">
                <h2 className="text-h3 mb-4 not-prose">Compliance & Certifications</h2>
                <div className="space-y-4 text-body text-t-secondary">
                    <div className="grid grid-cols-2 gap-4 mt-6 max-md:grid-cols-1 not-prose">
                        <div className="p-5 rounded-xl bg-b-surface2">
                            <h3 className="text-body-bold text-t-primary mb-2">🛡️ SOC 2 Type II</h3>
                            <p className="text-small text-t-secondary">
                                We're SOC 2 ready and working toward full certification. Our controls meet SOC 2 requirements for security, availability, and confidentiality.
                            </p>
                        </div>
                        <div className="p-5 rounded-xl bg-b-surface2">
                            <h3 className="text-body-bold text-t-primary mb-2">🇪🇺 GDPR Compliant</h3>
                            <p className="text-small text-t-secondary">
                                We comply with GDPR requirements including data minimization, right to erasure, and data portability.
                            </p>
                        </div>
                        <div className="p-5 rounded-xl bg-b-surface2">
                            <h3 className="text-body-bold text-t-primary mb-2">🔒 CCPA Compliant</h3>
                            <p className="text-small text-t-secondary">
                                California residents have full rights under CCPA to access, delete, and opt-out of data sales.
                            </p>
                        </div>
                        <div className="p-5 rounded-xl bg-b-surface2">
                            <h3 className="text-body-bold text-t-primary mb-2">📋 Data Processing Agreement</h3>
                            <p className="text-small text-t-secondary">
                                We offer DPAs for enterprise customers who need them for compliance purposes.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <section id="best-practices" className="mb-12">
                <h2 className="text-h3 mb-4 not-prose">Security Best Practices</h2>
                <div className="space-y-4 text-body text-t-secondary">
                    <p>
                        Here's how you can help keep your account secure:
                    </p>
                    <ol className="list-decimal pl-6 space-y-3">
                        <li>
                            <strong>Enable two-factor authentication</strong>
                            <p className="mt-1">This is the single most effective way to protect your account.</p>
                        </li>
                        <li>
                            <strong>Use a strong, unique password</strong>
                            <p className="mt-1">Use a password manager to generate and store a unique password for Nerlude.</p>
                        </li>
                        <li>
                            <strong>Review team access regularly</strong>
                            <p className="mt-1">Remove team members who no longer need access.</p>
                        </li>
                        <li>
                            <strong>Use role-based permissions</strong>
                            <p className="mt-1">Give team members only the access they need.</p>
                        </li>
                        <li>
                            <strong>Monitor credential access</strong>
                            <p className="mt-1">Review audit logs to see who's accessing sensitive credentials.</p>
                        </li>
                        <li>
                            <strong>Keep credentials up to date</strong>
                            <p className="mt-1">Rotate credentials regularly and remove unused ones.</p>
                        </li>
                        <li>
                            <strong>Use temporary access for contractors</strong>
                            <p className="mt-1">Set expiration dates for external collaborators.</p>
                        </li>
                    </ol>
                </div>
            </section>

            <section id="reporting" className="mb-12">
                <h2 className="text-h3 mb-4 not-prose">Reporting Vulnerabilities</h2>
                <div className="space-y-4 text-body text-t-secondary">
                    <p>
                        We take security vulnerabilities seriously. If you discover a security issue, please report it responsibly:
                    </p>
                    <div className="bg-b-surface2 rounded-xl p-6 mt-4 not-prose">
                        <h3 className="text-body-bold text-t-primary mb-3">How to report</h3>
                        <p className="text-small text-t-secondary mb-4">
                            Email us at <a href="mailto:security@nerlude.com" className="text-primary1 hover:underline">security@nerlude.com</a> with:
                        </p>
                        <ul className="text-small text-t-secondary space-y-2">
                            <li>• Description of the vulnerability</li>
                            <li>• Steps to reproduce</li>
                            <li>• Potential impact</li>
                            <li>• Any proof-of-concept code</li>
                        </ul>
                    </div>
                    <p className="mt-4">
                        We commit to:
                    </p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>Acknowledge your report within 24 hours</li>
                        <li>Provide regular updates on our progress</li>
                        <li>Not take legal action against good-faith reporters</li>
                        <li>Credit you in our security acknowledgments (if desired)</li>
                    </ul>
                </div>
            </section>

            {/* Contact */}
            <div className="bg-green-500/10 rounded-2xl p-8 text-center not-prose">
                <h2 className="text-h4 mb-3">Questions about security?</h2>
                <p className="text-body text-t-secondary mb-6">
                    Our security team is happy to answer any questions about how we protect your data.
                </p>
                <a
                    href="mailto:security@nerlude.com"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-green-600 text-white font-medium hover:bg-green-700 transition-colors"
                >
                    Contact Security Team
                </a>
            </div>

            {/* JSON-LD */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "Article",
                        "headline": "Security at Nerlude - How We Protect Your Data",
                        "description": "Learn about Nerlude's security practices, encryption methods, and compliance certifications.",
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

"use client";

import Layout from "@/components/Layout";

const PrivacyPage = () => {
    return (
        <Layout>
            <div className="section pt-20 pb-16 max-md:pt-12 max-md:pb-10">
                <div className="center max-w-200">
                    <h1 className="mb-8 text-h1 max-md:text-h2">Privacy Policy</h1>
                    <p className="mb-8 text-body text-t-secondary">
                        Last updated: December 21, 2024
                    </p>

                    <div className="prose prose-lg max-w-none">
                        <section className="mb-10">
                            <h2 className="mb-4 text-h4">Introduction</h2>
                            <p className="mb-4 text-body text-t-secondary">
                                At Nelrude, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our platform. We are committed to protecting your personal data and being transparent about what information we collect and how we use it.
                            </p>
                            <p className="text-body text-t-secondary">
                                By using Nelrude, you agree to the collection and use of information in accordance with this policy. If you do not agree with the terms of this privacy policy, please do not access the platform.
                            </p>
                        </section>

                        <section className="mb-10">
                            <h2 className="mb-4 text-h4">Information We Collect</h2>
                            <p className="mb-4 text-body text-t-secondary">
                                We collect information that you provide directly to us, including:
                            </p>
                            <ul className="mb-4 space-y-2 text-body text-t-secondary list-disc pl-6">
                                <li><strong>Account Information:</strong> When you create an account, we collect your name, email address, and password.</li>
                                <li><strong>Profile Information:</strong> Any additional information you choose to add to your profile, such as your company name, role, or profile picture.</li>
                                <li><strong>Project Data:</strong> Information about your projects, including domain names, service configurations, API keys (stored encrypted), and credentials you choose to store.</li>
                                <li><strong>Payment Information:</strong> If you subscribe to a paid plan, we collect billing information through our secure payment processor (Stripe). We do not store your full credit card details.</li>
                                <li><strong>Communications:</strong> When you contact us for support or feedback, we collect the content of your messages.</li>
                            </ul>
                        </section>

                        <section className="mb-10">
                            <h2 className="mb-4 text-h4">How We Use Your Information</h2>
                            <p className="mb-4 text-body text-t-secondary">
                                We use the information we collect to:
                            </p>
                            <ul className="mb-4 space-y-2 text-body text-t-secondary list-disc pl-6">
                                <li>Provide, maintain, and improve our services</li>
                                <li>Process transactions and send related information</li>
                                <li>Send you renewal alerts, security notifications, and service updates</li>
                                <li>Respond to your comments, questions, and support requests</li>
                                <li>Monitor and analyze trends, usage, and activities</li>
                                <li>Detect, investigate, and prevent fraudulent transactions and abuse</li>
                                <li>Personalize and improve your experience</li>
                            </ul>
                        </section>

                        <section className="mb-10">
                            <h2 className="mb-4 text-h4">Data Security</h2>
                            <p className="mb-4 text-body text-t-secondary">
                                We implement industry-standard security measures to protect your data:
                            </p>
                            <ul className="mb-4 space-y-2 text-body text-t-secondary list-disc pl-6">
                                <li><strong>Encryption:</strong> All sensitive data, including API keys and credentials, is encrypted using AES-256 encryption at rest and TLS 1.3 in transit.</li>
                                <li><strong>Access Controls:</strong> We implement strict access controls and authentication mechanisms.</li>
                                <li><strong>Regular Audits:</strong> We conduct regular security audits and vulnerability assessments.</li>
                                <li><strong>SOC 2 Compliance:</strong> We are working towards SOC 2 Type II certification.</li>
                            </ul>
                            <p className="text-body text-t-secondary">
                                While we strive to protect your personal information, no method of transmission over the Internet or electronic storage is 100% secure. We cannot guarantee absolute security.
                            </p>
                        </section>

                        <section className="mb-10">
                            <h2 className="mb-4 text-h4">Data Sharing</h2>
                            <p className="mb-4 text-body text-t-secondary">
                                We do not sell, trade, or rent your personal information to third parties. We may share your information only in the following circumstances:
                            </p>
                            <ul className="mb-4 space-y-2 text-body text-t-secondary list-disc pl-6">
                                <li><strong>Service Providers:</strong> With trusted third-party service providers who assist us in operating our platform (e.g., hosting, analytics, payment processing).</li>
                                <li><strong>Legal Requirements:</strong> When required by law or to respond to legal process.</li>
                                <li><strong>Protection:</strong> To protect the rights, property, or safety of Nelrude, our users, or others.</li>
                                <li><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets.</li>
                            </ul>
                        </section>

                        <section className="mb-10">
                            <h2 className="mb-4 text-h4">Your Rights</h2>
                            <p className="mb-4 text-body text-t-secondary">
                                You have the following rights regarding your personal data:
                            </p>
                            <ul className="mb-4 space-y-2 text-body text-t-secondary list-disc pl-6">
                                <li><strong>Access:</strong> Request a copy of the personal data we hold about you.</li>
                                <li><strong>Correction:</strong> Request correction of inaccurate or incomplete data.</li>
                                <li><strong>Deletion:</strong> Request deletion of your personal data (subject to legal requirements).</li>
                                <li><strong>Export:</strong> Request a portable copy of your data in a machine-readable format.</li>
                                <li><strong>Opt-out:</strong> Unsubscribe from marketing communications at any time.</li>
                            </ul>
                            <p className="text-body text-t-secondary">
                                To exercise any of these rights, please contact us at privacy@nelrude.com.
                            </p>
                        </section>

                        <section className="mb-10">
                            <h2 className="mb-4 text-h4">Cookies and Tracking</h2>
                            <p className="mb-4 text-body text-t-secondary">
                                We use cookies and similar tracking technologies to:
                            </p>
                            <ul className="mb-4 space-y-2 text-body text-t-secondary list-disc pl-6">
                                <li>Keep you signed in to your account</li>
                                <li>Remember your preferences and settings</li>
                                <li>Understand how you use our platform</li>
                                <li>Improve our services based on usage patterns</li>
                            </ul>
                            <p className="text-body text-t-secondary">
                                You can control cookies through your browser settings. Note that disabling cookies may affect the functionality of our platform.
                            </p>
                        </section>

                        <section className="mb-10">
                            <h2 className="mb-4 text-h4">Data Retention</h2>
                            <p className="text-body text-t-secondary">
                                We retain your personal data for as long as your account is active or as needed to provide you services. If you delete your account, we will delete your personal data within 30 days, except where we are required to retain it for legal or regulatory purposes.
                            </p>
                        </section>

                        <section className="mb-10">
                            <h2 className="mb-4 text-h4">International Data Transfers</h2>
                            <p className="text-body text-t-secondary">
                                Your information may be transferred to and processed in countries other than your own. We ensure appropriate safeguards are in place to protect your data in accordance with this privacy policy and applicable data protection laws.
                            </p>
                        </section>

                        <section className="mb-10">
                            <h2 className="mb-4 text-h4">Children&apos;s Privacy</h2>
                            <p className="text-body text-t-secondary">
                                Nelrude is not intended for use by children under the age of 16. We do not knowingly collect personal information from children under 16. If we become aware that we have collected personal data from a child under 16, we will take steps to delete that information.
                            </p>
                        </section>

                        <section className="mb-10">
                            <h2 className="mb-4 text-h4">Changes to This Policy</h2>
                            <p className="text-body text-t-secondary">
                                We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the &quot;Last updated&quot; date. We encourage you to review this Privacy Policy periodically for any changes.
                            </p>
                        </section>

                        <section>
                            <h2 className="mb-4 text-h4">Contact Us</h2>
                            <p className="text-body text-t-secondary">
                                If you have any questions about this Privacy Policy or our data practices, please contact us at:
                            </p>
                            <div className="mt-4 p-6 rounded-2xl bg-b-surface2">
                                <p className="text-body"><strong>Email:</strong> privacy@nelrude.com</p>
                                <p className="text-body mt-2"><strong>Address:</strong> Nelrude Inc., 123 Tech Street, San Francisco, CA 94105</p>
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default PrivacyPage;

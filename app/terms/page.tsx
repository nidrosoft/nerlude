"use client";

import Layout from "@/components/Layout";

const TermsPage = () => {
    return (
        <Layout>
            <div className="section pt-20 pb-16 max-md:pt-12 max-md:pb-10">
                <div className="center max-w-200">
                    <h1 className="mb-8 text-h1 max-md:text-h2">Terms & Conditions</h1>
                    <p className="mb-8 text-body text-t-secondary">
                        Last updated: December 21, 2024
                    </p>

                    <div className="prose prose-lg max-w-none">
                        <section className="mb-10">
                            <h2 className="mb-4 text-h4">1. Agreement to Terms</h2>
                            <p className="mb-4 text-body text-t-secondary">
                                Welcome to Nelrude! These Terms and Conditions (&quot;Terms&quot;) govern your access to and use of the Nelrude platform, including our website, applications, and services (collectively, the &quot;Service&quot;).
                            </p>
                            <p className="text-body text-t-secondary">
                                By accessing or using our Service, you agree to be bound by these Terms. If you disagree with any part of the terms, you may not access the Service.
                            </p>
                        </section>

                        <section className="mb-10">
                            <h2 className="mb-4 text-h4">2. Description of Service</h2>
                            <p className="mb-4 text-body text-t-secondary">
                                Nelrude is a product infrastructure management platform that helps you:
                            </p>
                            <ul className="mb-4 space-y-2 text-body text-t-secondary list-disc pl-6">
                                <li>Organize and track domains, hosting, databases, and other services across multiple projects</li>
                                <li>Securely store and manage API keys and credentials</li>
                                <li>Receive renewal alerts and cost tracking notifications</li>
                                <li>Collaborate with team members on infrastructure management</li>
                                <li>Generate documentation and maintain audit logs</li>
                            </ul>
                        </section>

                        <section className="mb-10">
                            <h2 className="mb-4 text-h4">3. Account Registration</h2>
                            <p className="mb-4 text-body text-t-secondary">
                                To use certain features of the Service, you must register for an account. When you register, you agree to:
                            </p>
                            <ul className="mb-4 space-y-2 text-body text-t-secondary list-disc pl-6">
                                <li>Provide accurate, current, and complete information</li>
                                <li>Maintain and promptly update your account information</li>
                                <li>Keep your password secure and confidential</li>
                                <li>Accept responsibility for all activities under your account</li>
                                <li>Notify us immediately of any unauthorized access or security breach</li>
                            </ul>
                            <p className="text-body text-t-secondary">
                                You must be at least 16 years old to create an account. By creating an account, you represent that you meet this requirement.
                            </p>
                        </section>

                        <section className="mb-10">
                            <h2 className="mb-4 text-h4">4. Subscription Plans and Billing</h2>
                            <p className="mb-4 text-body text-t-secondary">
                                Nelrude offers both free and paid subscription plans:
                            </p>
                            <ul className="mb-4 space-y-2 text-body text-t-secondary list-disc pl-6">
                                <li><strong>Free Plan:</strong> Limited features with restrictions on projects and team members.</li>
                                <li><strong>Pro Plan:</strong> Enhanced features for individual users and small teams.</li>
                                <li><strong>Team Plan:</strong> Full features with advanced collaboration and security options.</li>
                            </ul>
                            <p className="mb-4 text-body text-t-secondary">
                                For paid plans:
                            </p>
                            <ul className="mb-4 space-y-2 text-body text-t-secondary list-disc pl-6">
                                <li>Billing occurs on a monthly or annual basis, depending on your selection</li>
                                <li>Payments are processed securely through Stripe</li>
                                <li>Subscriptions automatically renew unless cancelled before the renewal date</li>
                                <li>Price changes will be communicated at least 30 days in advance</li>
                                <li>Refunds are available within 14 days of initial purchase for annual plans</li>
                            </ul>
                        </section>

                        <section className="mb-10">
                            <h2 className="mb-4 text-h4">5. Acceptable Use</h2>
                            <p className="mb-4 text-body text-t-secondary">
                                You agree not to use the Service to:
                            </p>
                            <ul className="mb-4 space-y-2 text-body text-t-secondary list-disc pl-6">
                                <li>Violate any applicable laws or regulations</li>
                                <li>Infringe on the intellectual property rights of others</li>
                                <li>Transmit malware, viruses, or other malicious code</li>
                                <li>Attempt to gain unauthorized access to our systems or other users&apos; accounts</li>
                                <li>Interfere with or disrupt the integrity or performance of the Service</li>
                                <li>Store or transmit illegal content</li>
                                <li>Engage in any activity that could harm minors</li>
                                <li>Use the Service for competitive analysis or to build a competing product</li>
                            </ul>
                        </section>

                        <section className="mb-10">
                            <h2 className="mb-4 text-h4">6. Your Data</h2>
                            <p className="mb-4 text-body text-t-secondary">
                                You retain all rights to the data you store on Nelrude (&quot;Your Data&quot;). By using the Service, you grant us a limited license to:
                            </p>
                            <ul className="mb-4 space-y-2 text-body text-t-secondary list-disc pl-6">
                                <li>Store, process, and display Your Data as necessary to provide the Service</li>
                                <li>Create backups for disaster recovery purposes</li>
                                <li>Analyze aggregated, anonymized data to improve our Service</li>
                            </ul>
                            <p className="text-body text-t-secondary">
                                You are responsible for maintaining backups of Your Data. While we implement robust backup systems, we recommend keeping your own copies of critical information.
                            </p>
                        </section>

                        <section className="mb-10">
                            <h2 className="mb-4 text-h4">7. Security and Credentials</h2>
                            <p className="mb-4 text-body text-t-secondary">
                                Nelrude provides secure storage for sensitive information like API keys and credentials. However:
                            </p>
                            <ul className="mb-4 space-y-2 text-body text-t-secondary list-disc pl-6">
                                <li>You are responsible for the security of credentials before they are stored in Nelrude</li>
                                <li>You should use strong, unique passwords for your Nelrude account</li>
                                <li>We recommend enabling two-factor authentication when available</li>
                                <li>You should regularly rotate credentials stored in the platform</li>
                                <li>We are not liable for breaches resulting from credentials compromised outside our platform</li>
                            </ul>
                        </section>

                        <section className="mb-10">
                            <h2 className="mb-4 text-h4">8. Intellectual Property</h2>
                            <p className="mb-4 text-body text-t-secondary">
                                The Service and its original content, features, and functionality are owned by Nelrude and are protected by international copyright, trademark, patent, trade secret, and other intellectual property laws.
                            </p>
                            <p className="text-body text-t-secondary">
                                You may not copy, modify, distribute, sell, or lease any part of our Service or included software, nor may you reverse engineer or attempt to extract the source code of that software.
                            </p>
                        </section>

                        <section className="mb-10">
                            <h2 className="mb-4 text-h4">9. Third-Party Services</h2>
                            <p className="text-body text-t-secondary">
                                Nelrude may integrate with or link to third-party services (such as domain registrars, hosting providers, or payment processors). We are not responsible for the content, privacy policies, or practices of these third-party services. Your use of such services is governed by their respective terms and conditions.
                            </p>
                        </section>

                        <section className="mb-10">
                            <h2 className="mb-4 text-h4">10. Service Availability</h2>
                            <p className="mb-4 text-body text-t-secondary">
                                We strive to maintain high availability of our Service. However:
                            </p>
                            <ul className="mb-4 space-y-2 text-body text-t-secondary list-disc pl-6">
                                <li>We do not guarantee uninterrupted or error-free operation</li>
                                <li>We may perform scheduled maintenance with advance notice when possible</li>
                                <li>We reserve the right to modify, suspend, or discontinue features with reasonable notice</li>
                                <li>Force majeure events may affect service availability</li>
                            </ul>
                        </section>

                        <section className="mb-10">
                            <h2 className="mb-4 text-h4">11. Limitation of Liability</h2>
                            <p className="mb-4 text-body text-t-secondary">
                                To the maximum extent permitted by law:
                            </p>
                            <ul className="mb-4 space-y-2 text-body text-t-secondary list-disc pl-6">
                                <li>Nelrude shall not be liable for any indirect, incidental, special, consequential, or punitive damages</li>
                                <li>Our total liability shall not exceed the amount you paid us in the 12 months preceding the claim</li>
                                <li>We are not liable for any loss of data, profits, or business opportunities</li>
                                <li>We are not responsible for damages resulting from unauthorized access to your account</li>
                            </ul>
                        </section>

                        <section className="mb-10">
                            <h2 className="mb-4 text-h4">12. Disclaimer of Warranties</h2>
                            <p className="text-body text-t-secondary">
                                THE SERVICE IS PROVIDED &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot; WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT. WE DO NOT WARRANT THAT THE SERVICE WILL BE UNINTERRUPTED, SECURE, OR ERROR-FREE.
                            </p>
                        </section>

                        <section className="mb-10">
                            <h2 className="mb-4 text-h4">13. Indemnification</h2>
                            <p className="text-body text-t-secondary">
                                You agree to indemnify and hold harmless Nelrude, its officers, directors, employees, and agents from any claims, damages, losses, liabilities, and expenses (including legal fees) arising from your use of the Service, violation of these Terms, or infringement of any third-party rights.
                            </p>
                        </section>

                        <section className="mb-10">
                            <h2 className="mb-4 text-h4">14. Termination</h2>
                            <p className="mb-4 text-body text-t-secondary">
                                We may terminate or suspend your account and access to the Service:
                            </p>
                            <ul className="mb-4 space-y-2 text-body text-t-secondary list-disc pl-6">
                                <li>Immediately for violations of these Terms</li>
                                <li>For non-payment of subscription fees after a grace period</li>
                                <li>If required by law or to protect our users</li>
                            </ul>
                            <p className="text-body text-t-secondary">
                                You may terminate your account at any time through your account settings. Upon termination, your right to use the Service will cease immediately, and we will delete your data within 30 days unless legally required to retain it.
                            </p>
                        </section>

                        <section className="mb-10">
                            <h2 className="mb-4 text-h4">15. Governing Law</h2>
                            <p className="text-body text-t-secondary">
                                These Terms shall be governed by and construed in accordance with the laws of the State of California, United States, without regard to its conflict of law provisions. Any disputes arising under these Terms shall be resolved in the courts of San Francisco County, California.
                            </p>
                        </section>

                        <section className="mb-10">
                            <h2 className="mb-4 text-h4">16. Changes to Terms</h2>
                            <p className="text-body text-t-secondary">
                                We reserve the right to modify these Terms at any time. We will notify you of material changes by posting the new Terms on this page and updating the &quot;Last updated&quot; date. Your continued use of the Service after such changes constitutes acceptance of the new Terms.
                            </p>
                        </section>

                        <section>
                            <h2 className="mb-4 text-h4">17. Contact Us</h2>
                            <p className="text-body text-t-secondary">
                                If you have any questions about these Terms, please contact us:
                            </p>
                            <div className="mt-4 p-6 rounded-2xl bg-b-surface2">
                                <p className="text-body"><strong>Email:</strong> legal@nelrude.com</p>
                                <p className="text-body mt-2"><strong>Address:</strong> Nelrude Inc., 123 Tech Street, San Francisco, CA 94105</p>
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default TermsPage;

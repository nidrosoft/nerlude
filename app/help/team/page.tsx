import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
    title: "Team Collaboration - Invite Members & Manage Permissions",
    description: "Learn how to invite team members, set role-based permissions, and collaborate effectively on your projects in Nerlude. Perfect for startups and small teams.",
    alternates: {
        canonical: "https://nerlude.io/help/team",
    },
    openGraph: {
        title: "Team Collaboration in Nerlude",
        description: "Invite team members, set permissions, and collaborate on your SaaS management.",
        type: "article",
    },
};

export default function TeamPage() {
    return (
        <article className="prose prose-slate max-w-none">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-small text-t-tertiary mb-8 not-prose">
                <Link href="/help" className="hover:text-t-primary transition-colors">Help Center</Link>
                <span>/</span>
                <span className="text-t-primary">Team Collaboration</span>
            </nav>

            <h1 className="text-h1 mb-4 not-prose">Team Collaboration in Nerlude</h1>
            <p className="text-body text-t-secondary mb-8 not-prose">
                Nerlude makes it easy to work with your team. Invite members, set permissions, and collaborate on managing your SaaS stack together.
            </p>

            {/* Table of Contents */}
            <div className="bg-b-surface2 rounded-2xl p-6 mb-10 not-prose">
                <h2 className="text-body-bold mb-4">In this guide</h2>
                <ul className="space-y-2">
                    <li><a href="#invite-members" className="text-small text-primary1 hover:underline">Inviting team members</a></li>
                    <li><a href="#roles" className="text-small text-primary1 hover:underline">Understanding roles</a></li>
                    <li><a href="#permissions" className="text-small text-primary1 hover:underline">Permission levels</a></li>
                    <li><a href="#manage-team" className="text-small text-primary1 hover:underline">Managing your team</a></li>
                    <li><a href="#sharing-projects" className="text-small text-primary1 hover:underline">Sharing projects</a></li>
                    <li><a href="#contractor-access" className="text-small text-primary1 hover:underline">Temporary contractor access</a></li>
                    <li><a href="#best-practices" className="text-small text-primary1 hover:underline">Best practices</a></li>
                </ul>
            </div>

            <section id="invite-members" className="mb-12">
                <h2 className="text-h3 mb-4 not-prose">Inviting Team Members</h2>
                <div className="space-y-4 text-body text-t-secondary">
                    <p>
                        Adding team members to your Nerlude workspace is simple. Here's how to invite someone:
                    </p>
                    <ol className="list-decimal pl-6 space-y-3">
                        <li>
                            <strong>Go to Settings → Team</strong>
                            <p className="mt-1">Navigate to your workspace settings and select the Team tab.</p>
                        </li>
                        <li>
                            <strong>Click "Invite Member"</strong>
                            <p className="mt-1">You'll see a form to enter the new member's details.</p>
                        </li>
                        <li>
                            <strong>Enter their email address</strong>
                            <p className="mt-1">Use the email address they'll use to sign in to Nerlude.</p>
                        </li>
                        <li>
                            <strong>Select a role</strong>
                            <p className="mt-1">Choose from Owner, Admin, Member, or Viewer (see roles explained below).</p>
                        </li>
                        <li>
                            <strong>Send the invitation</strong>
                            <p className="mt-1">They'll receive an email with a link to join your workspace.</p>
                        </li>
                    </ol>
                    <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 mt-4">
                        <p className="text-small text-blue-600 dark:text-blue-400">
                            <strong>💡 Note:</strong> Invitations expire after 7 days. You can resend an invitation if it expires.
                        </p>
                    </div>
                </div>
            </section>

            <section id="roles" className="mb-12">
                <h2 className="text-h3 mb-4 not-prose">Understanding Roles</h2>
                <div className="space-y-4 text-body text-t-secondary">
                    <p>
                        Nerlude uses role-based access control (RBAC) to manage what team members can do. There are four roles:
                    </p>
                    <div className="space-y-4 mt-6 not-prose">
                        <div className="p-5 rounded-xl bg-b-surface2 border-l-4 border-purple-500">
                            <h3 className="text-body-bold text-t-primary mb-2">👑 Owner</h3>
                            <p className="text-small text-t-secondary mb-3">
                                Full control over the workspace. Can manage billing, delete projects, and transfer ownership.
                            </p>
                            <ul className="text-small text-t-tertiary space-y-1">
                                <li>• All Admin permissions</li>
                                <li>• Manage billing and subscription</li>
                                <li>• Delete workspace</li>
                                <li>• Transfer ownership</li>
                            </ul>
                        </div>
                        <div className="p-5 rounded-xl bg-b-surface2 border-l-4 border-blue-500">
                            <h3 className="text-body-bold text-t-primary mb-2">⚡ Admin</h3>
                            <p className="text-small text-t-secondary mb-3">
                                Can manage projects, services, and team members. Ideal for co-founders and lead developers.
                            </p>
                            <ul className="text-small text-t-tertiary space-y-1">
                                <li>• All Member permissions</li>
                                <li>• Invite and remove team members</li>
                                <li>• Create and delete projects</li>
                                <li>• View and manage all credentials</li>
                            </ul>
                        </div>
                        <div className="p-5 rounded-xl bg-b-surface2 border-l-4 border-green-500">
                            <h3 className="text-body-bold text-t-primary mb-2">👤 Member</h3>
                            <p className="text-small text-t-secondary mb-3">
                                Can view and edit projects and services. Perfect for developers and team contributors.
                            </p>
                            <ul className="text-small text-t-tertiary space-y-1">
                                <li>• View all projects</li>
                                <li>• Add and edit services</li>
                                <li>• View credentials (if granted)</li>
                                <li>• Add notes and documentation</li>
                            </ul>
                        </div>
                        <div className="p-5 rounded-xl bg-b-surface2 border-l-4 border-amber-500">
                            <h3 className="text-body-bold text-t-primary mb-2">👁️ Viewer</h3>
                            <p className="text-small text-t-secondary mb-3">
                                Read-only access to projects and services. Great for stakeholders and auditors.
                            </p>
                            <ul className="text-small text-t-tertiary space-y-1">
                                <li>• View projects and services</li>
                                <li>• View costs and renewal dates</li>
                                <li>• Cannot edit or add anything</li>
                                <li>• Cannot view credentials</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            <section id="permissions" className="mb-12">
                <h2 className="text-h3 mb-4 not-prose">Permission Levels</h2>
                <div className="space-y-4 text-body text-t-secondary">
                    <p>
                        Here's a detailed breakdown of what each role can do:
                    </p>
                    <div className="overflow-x-auto not-prose">
                        <table className="w-full text-small border-collapse">
                            <thead>
                                <tr className="border-b border-stroke-subtle">
                                    <th className="text-left py-3 px-4 text-t-primary font-medium">Permission</th>
                                    <th className="text-center py-3 px-4 text-t-primary font-medium">Owner</th>
                                    <th className="text-center py-3 px-4 text-t-primary font-medium">Admin</th>
                                    <th className="text-center py-3 px-4 text-t-primary font-medium">Member</th>
                                    <th className="text-center py-3 px-4 text-t-primary font-medium">Viewer</th>
                                </tr>
                            </thead>
                            <tbody className="text-t-secondary">
                                <tr className="border-b border-stroke-subtle">
                                    <td className="py-3 px-4">View projects</td>
                                    <td className="text-center py-3 px-4">✅</td>
                                    <td className="text-center py-3 px-4">✅</td>
                                    <td className="text-center py-3 px-4">✅</td>
                                    <td className="text-center py-3 px-4">✅</td>
                                </tr>
                                <tr className="border-b border-stroke-subtle">
                                    <td className="py-3 px-4">Create projects</td>
                                    <td className="text-center py-3 px-4">✅</td>
                                    <td className="text-center py-3 px-4">✅</td>
                                    <td className="text-center py-3 px-4">❌</td>
                                    <td className="text-center py-3 px-4">❌</td>
                                </tr>
                                <tr className="border-b border-stroke-subtle">
                                    <td className="py-3 px-4">Add/edit services</td>
                                    <td className="text-center py-3 px-4">✅</td>
                                    <td className="text-center py-3 px-4">✅</td>
                                    <td className="text-center py-3 px-4">✅</td>
                                    <td className="text-center py-3 px-4">❌</td>
                                </tr>
                                <tr className="border-b border-stroke-subtle">
                                    <td className="py-3 px-4">View credentials</td>
                                    <td className="text-center py-3 px-4">✅</td>
                                    <td className="text-center py-3 px-4">✅</td>
                                    <td className="text-center py-3 px-4">⚙️</td>
                                    <td className="text-center py-3 px-4">❌</td>
                                </tr>
                                <tr className="border-b border-stroke-subtle">
                                    <td className="py-3 px-4">Manage team</td>
                                    <td className="text-center py-3 px-4">✅</td>
                                    <td className="text-center py-3 px-4">✅</td>
                                    <td className="text-center py-3 px-4">❌</td>
                                    <td className="text-center py-3 px-4">❌</td>
                                </tr>
                                <tr className="border-b border-stroke-subtle">
                                    <td className="py-3 px-4">Manage billing</td>
                                    <td className="text-center py-3 px-4">✅</td>
                                    <td className="text-center py-3 px-4">❌</td>
                                    <td className="text-center py-3 px-4">❌</td>
                                    <td className="text-center py-3 px-4">❌</td>
                                </tr>
                                <tr>
                                    <td className="py-3 px-4">Delete workspace</td>
                                    <td className="text-center py-3 px-4">✅</td>
                                    <td className="text-center py-3 px-4">❌</td>
                                    <td className="text-center py-3 px-4">❌</td>
                                    <td className="text-center py-3 px-4">❌</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <p className="text-small text-t-tertiary mt-2">
                        ⚙️ = Configurable per project or service
                    </p>
                </div>
            </section>

            <section id="manage-team" className="mb-12">
                <h2 className="text-h3 mb-4 not-prose">Managing Your Team</h2>
                <div className="space-y-4 text-body text-t-secondary">
                    <h3 className="text-h5 mt-6 mb-3 not-prose">Changing a member's role</h3>
                    <ol className="list-decimal pl-6 space-y-2">
                        <li>Go to Settings → Team</li>
                        <li>Find the team member you want to update</li>
                        <li>Click the role dropdown next to their name</li>
                        <li>Select the new role</li>
                        <li>Confirm the change</li>
                    </ol>
                    <h3 className="text-h5 mt-6 mb-3 not-prose">Removing a team member</h3>
                    <ol className="list-decimal pl-6 space-y-2">
                        <li>Go to Settings → Team</li>
                        <li>Find the team member you want to remove</li>
                        <li>Click the "..." menu next to their name</li>
                        <li>Select "Remove from team"</li>
                        <li>Confirm the removal</li>
                    </ol>
                    <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 mt-4">
                        <p className="text-small text-amber-600 dark:text-amber-400">
                            <strong>⚠️ Important:</strong> Removing a team member immediately revokes their access. They won't be able to view any projects or credentials.
                        </p>
                    </div>
                </div>
            </section>

            <section id="sharing-projects" className="mb-12">
                <h2 className="text-h3 mb-4 not-prose">Sharing Projects</h2>
                <div className="space-y-4 text-body text-t-secondary">
                    <p>
                        By default, all team members can see all projects in your workspace. However, you can restrict access to specific projects:
                    </p>
                    <ol className="list-decimal pl-6 space-y-3">
                        <li>Open the project you want to configure</li>
                        <li>Go to Project Settings → Access</li>
                        <li>Toggle "Restrict access to specific members"</li>
                        <li>Select which team members should have access</li>
                        <li>Save your changes</li>
                    </ol>
                    <p>
                        This is useful when you have sensitive projects that only certain team members should see, or when working with external contractors.
                    </p>
                </div>
            </section>

            <section id="contractor-access" className="mb-12">
                <h2 className="text-h3 mb-4 not-prose">Temporary Contractor Access</h2>
                <div className="space-y-4 text-body text-t-secondary">
                    <p>
                        Working with freelancers or contractors? You can grant temporary access that automatically expires.
                    </p>
                    <h3 className="text-h5 mt-6 mb-3 not-prose">Setting up temporary access:</h3>
                    <ol className="list-decimal pl-6 space-y-3">
                        <li>Invite the contractor as a team member</li>
                        <li>When selecting their role, check "Set expiration date"</li>
                        <li>Choose when their access should expire</li>
                        <li>Send the invitation</li>
                    </ol>
                    <p>
                        When the expiration date arrives, their access is automatically revoked. You'll receive a notification so you can extend it if needed.
                    </p>
                    <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4 mt-4">
                        <p className="text-small text-green-600 dark:text-green-400">
                            <strong>✅ Security tip:</strong> Always use temporary access for contractors and external collaborators. This ensures they can't access your data after the project ends.
                        </p>
                    </div>
                </div>
            </section>

            <section id="best-practices" className="mb-12">
                <h2 className="text-h3 mb-4 not-prose">Best Practices</h2>
                <div className="space-y-4 text-body text-t-secondary">
                    <ul className="list-disc pl-6 space-y-3">
                        <li>
                            <strong>Use the principle of least privilege</strong> - Give team members only the permissions they need to do their job.
                        </li>
                        <li>
                            <strong>Review access regularly</strong> - Periodically check who has access and remove anyone who no longer needs it.
                        </li>
                        <li>
                            <strong>Use expiring access for contractors</strong> - Always set an expiration date for external collaborators.
                        </li>
                        <li>
                            <strong>Restrict credential access</strong> - Not everyone needs to see API keys. Limit credential visibility to those who need it.
                        </li>
                        <li>
                            <strong>Have multiple owners</strong> - For business continuity, consider having at least two owners on your workspace.
                        </li>
                        <li>
                            <strong>Document role assignments</strong> - Keep a record of why each person has their role for audit purposes.
                        </li>
                    </ul>
                </div>
            </section>

            {/* Related Articles */}
            <div className="border-t border-stroke-subtle pt-8 not-prose">
                <h2 className="text-h5 mb-4">Related Articles</h2>
                <div className="grid grid-cols-2 gap-4 max-md:grid-cols-1">
                    <Link href="/help/security" className="p-4 rounded-xl bg-b-surface2 hover:bg-b-surface2/80 transition-colors">
                        <span className="text-small font-medium text-t-primary">Security Best Practices →</span>
                    </Link>
                    <Link href="/help/billing" className="p-4 rounded-xl bg-b-surface2 hover:bg-b-surface2/80 transition-colors">
                        <span className="text-small font-medium text-t-primary">Billing & Plans →</span>
                    </Link>
                </div>
            </div>

            {/* JSON-LD */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "Article",
                        "headline": "Team Collaboration in Nerlude",
                        "description": "Learn how to invite team members, set role-based permissions, and collaborate effectively.",
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

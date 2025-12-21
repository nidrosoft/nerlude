"use client";

import { useState } from "react";
import Layout from "@/components/Layout";
import Icon from "@/components/Icon";
import Button from "@/components/Button";
import Field from "@/components/Field";
import SettingsSidebar from "../SettingsSidebar";

const WorkspaceSettingsPage = () => {
    const [workspaceName, setWorkspaceName] = useState("My Workspace");
    const [currency, setCurrency] = useState("USD");
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showInviteModal, setShowInviteModal] = useState(false);
    const [inviteEmail, setInviteEmail] = useState("");
    const [inviteRole, setInviteRole] = useState("member");

    const teamMembers = [
        { id: "1", name: "John Doe", email: "john@example.com", role: "owner", avatar: "J" },
        { id: "2", name: "Jane Smith", email: "jane@example.com", role: "admin", avatar: "J" },
        { id: "3", name: "Bob Wilson", email: "bob@example.com", role: "member", avatar: "B" },
    ];

    const currencies = [
        { value: "USD", label: "USD ($)" },
        { value: "EUR", label: "EUR (€)" },
        { value: "GBP", label: "GBP (£)" },
        { value: "CAD", label: "CAD ($)" },
        { value: "AUD", label: "AUD ($)" },
    ];

    const roles = [
        { value: "admin", label: "Admin" },
        { value: "member", label: "Member" },
        { value: "viewer", label: "Viewer" },
    ];

    const handleSaveWorkspace = () => {
        console.log("Saving workspace:", { workspaceName, currency });
    };

    const handleInviteMember = () => {
        console.log("Inviting:", { email: inviteEmail, role: inviteRole });
        setShowInviteModal(false);
        setInviteEmail("");
        setInviteRole("member");
    };

    const handleRemoveMember = (memberId: string) => {
        console.log("Removing member:", memberId);
    };

    const handleDeleteWorkspace = () => {
        console.log("Deleting workspace");
        setShowDeleteModal(false);
    };

    const getRoleBadgeColor = (role: string) => {
        switch (role) {
            case "owner":
                return "bg-amber-500/10 text-amber-600 border-amber-500/20";
            case "admin":
                return "bg-blue-500/10 text-blue-600 border-blue-500/20";
            case "member":
                return "bg-green-500/10 text-green-600 border-green-500/20";
            default:
                return "bg-gray-500/10 text-gray-600 border-gray-500/20";
        }
    };

    return (
        <Layout isLoggedIn>
            <div className="min-h-[calc(100vh-80px)] py-8">
                <div className="max-w-5xl mx-auto px-6">
                    <div className="flex gap-8 max-lg:flex-col">
                        {/* Sidebar */}
                        <SettingsSidebar activeTab="workspace" />

                        {/* Main Content */}
                        <div className="flex-1">
                            {/* Header */}
                            <div className="flex items-center gap-4 mb-8">
                                <div className="flex items-center justify-center size-12 rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border-[1.5px] border-purple-500/30">
                                    <Icon className="!w-6 !h-6 fill-purple-500" name="cube" />
                                </div>
                                <div>
                                    <h1 className="text-h3">Workspace Settings</h1>
                                    <p className="text-small text-t-secondary">
                                        Manage your workspace and team members
                                    </p>
                                </div>
                            </div>

                            {/* General Settings */}
                            <div className="p-6 mb-6 rounded-4xl bg-b-surface2">
                                <h2 className="text-body-bold mb-6">General</h2>
                                
                                <div className="grid grid-cols-2 gap-4 mb-6 max-md:grid-cols-1">
                                    <Field
                                        label="Workspace Name"
                                        value={workspaceName}
                                        onChange={(e) => setWorkspaceName(e.target.value)}
                                        placeholder="My Workspace"
                                    />
                                    <div>
                                        <label className="block mb-2 text-small font-medium text-t-secondary">
                                            Default Currency
                                        </label>
                                        <select
                                            value={currency}
                                            onChange={(e) => setCurrency(e.target.value)}
                                            className="w-full px-4 py-3 rounded-xl bg-b-surface1 text-t-primary border-2 border-stroke-subtle focus:outline-none focus:border-primary1 appearance-none cursor-pointer"
                                            style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 16px center' }}
                                        >
                                            {currencies.map((c) => (
                                                <option key={c.value} value={c.value} className="bg-b-surface1 text-t-primary py-2">
                                                    {c.label}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div className="flex justify-end">
                                    <Button isPrimary onClick={handleSaveWorkspace}>
                                        Save Changes
                                    </Button>
                                </div>
                            </div>

                            {/* Team Members */}
                            <div className="p-6 mb-6 rounded-4xl bg-b-surface2">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-body-bold">Team Members</h2>
                                    <Button isPrimary onClick={() => setShowInviteModal(true)}>
                                        <Icon className="mr-2 !w-5 !h-5" name="plus" />
                                        Invite Member
                                    </Button>
                                </div>
                                
                                <div className="space-y-3">
                                    {teamMembers.map((member) => (
                                        <div
                                            key={member.id}
                                            className="flex items-center justify-between p-4 rounded-2xl bg-b-surface1"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="size-10 rounded-full bg-gradient-to-br from-primary1/20 to-primary2/20 flex items-center justify-center font-medium">
                                                    {member.avatar}
                                                </div>
                                                <div>
                                                    <p className="font-medium">{member.name}</p>
                                                    <p className="text-small text-t-secondary">{member.email}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <span className={`px-3 py-1 text-xs font-medium rounded-full border ${getRoleBadgeColor(member.role)}`}>
                                                    {member.role.charAt(0).toUpperCase() + member.role.slice(1)}
                                                </span>
                                                {member.role !== "owner" && (
                                                    <button
                                                        onClick={() => handleRemoveMember(member.id)}
                                                        className="p-2 rounded-xl hover:bg-red-500/10 fill-t-tertiary hover:fill-red-500 transition-colors"
                                                    >
                                                        <Icon className="!w-4 !h-4" name="close" />
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* API Keys */}
                            <div className="p-6 mb-6 rounded-4xl bg-b-surface2">
                                <div className="flex items-center justify-between mb-6">
                                    <div>
                                        <h2 className="text-body-bold">API Keys</h2>
                                        <p className="text-small text-t-secondary mt-1">
                                            Manage API keys for integrations
                                        </p>
                                    </div>
                                    <Button isStroke>
                                        <Icon className="mr-2 !w-5 !h-5" name="plus" />
                                        Create Key
                                    </Button>
                                </div>
                                
                                <div className="p-4 rounded-2xl bg-b-surface1 text-center">
                                    <p className="text-small text-t-tertiary">
                                        No API keys created yet
                                    </p>
                                </div>
                            </div>

                            {/* Data Export */}
                            <div className="p-6 mb-6 rounded-4xl bg-b-surface2">
                                <h2 className="text-body-bold mb-4">Data Export</h2>
                                <p className="text-small text-t-secondary mb-4">
                                    Export all your workspace data including projects, services, and credentials.
                                </p>
                                <Button isStroke>
                                    <Icon className="mr-2 !w-5 !h-5" name="documents" />
                                    Export Data
                                </Button>
                            </div>

                            {/* Danger Zone */}
                            <div className="p-6 rounded-4xl border-2 border-red-500/20 bg-red-500/5">
                                <h2 className="text-body-bold text-red-500 mb-4">Danger Zone</h2>
                                <p className="text-small text-t-secondary mb-4">
                                    Deleting your workspace will permanently remove all projects, services, and team members.
                                </p>
                                <Button 
                                    className="!bg-red-500 !text-white hover:!bg-red-600"
                                    onClick={() => setShowDeleteModal(true)}
                                >
                                    Delete Workspace
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Invite Member Modal */}
            {showInviteModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <div 
                        className="absolute inset-0 bg-[#282828]/90"
                        onClick={() => setShowInviteModal(false)}
                    />
                    <div className="relative z-10 w-full max-w-md mx-4 p-8 rounded-4xl bg-b-surface1">
                        <h3 className="text-h4 mb-6">Invite Team Member</h3>
                        
                        <div className="space-y-4 mb-6">
                            <Field
                                label="Email Address"
                                type="email"
                                value={inviteEmail}
                                onChange={(e) => setInviteEmail(e.target.value)}
                                placeholder="colleague@example.com"
                            />
                            <div>
                                <label className="block mb-2 text-small font-medium text-t-secondary">
                                    Role
                                </label>
                                <select
                                    value={inviteRole}
                                    onChange={(e) => setInviteRole(e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl bg-b-surface2 text-t-primary border-2 border-stroke-subtle focus:outline-none focus:border-primary1 appearance-none cursor-pointer"
                                    style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 16px center' }}
                                >
                                    {roles.map((r) => (
                                        <option key={r.value} value={r.value} className="bg-b-surface2 text-t-primary py-2">
                                            {r.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <Button
                                className="flex-1"
                                isStroke
                                onClick={() => setShowInviteModal(false)}
                            >
                                Cancel
                            </Button>
                            <Button
                                className="flex-1"
                                isPrimary
                                onClick={handleInviteMember}
                                disabled={!inviteEmail}
                            >
                                Send Invite
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Workspace Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <div 
                        className="absolute inset-0 bg-[#282828]/90"
                        onClick={() => setShowDeleteModal(false)}
                    />
                    <div className="relative z-10 w-full max-w-md mx-4 p-8 rounded-4xl bg-b-surface1">
                        <h3 className="text-h4 mb-2">Delete Workspace?</h3>
                        <p className="text-small text-t-secondary mb-6">
                            This action cannot be undone. All projects, services, credentials, and team members will be permanently deleted.
                        </p>
                        <div className="flex gap-3">
                            <Button
                                className="flex-1"
                                isStroke
                                onClick={() => setShowDeleteModal(false)}
                            >
                                Cancel
                            </Button>
                            <Button
                                className="flex-1 !bg-red-500 !text-white hover:!bg-red-600"
                                onClick={handleDeleteWorkspace}
                            >
                                Delete Workspace
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </Layout>
    );
};

export default WorkspaceSettingsPage;

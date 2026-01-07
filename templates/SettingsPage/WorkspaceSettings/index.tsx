"use client";

import { useState } from "react";
import Layout from "@/components/Layout";
import Icon from "@/components/Icon";
import Button from "@/components/Button";
import Field from "@/components/Field";
import SettingsSidebar from "../SettingsSidebar";
import { useToast } from "@/components/Toast";

const WorkspaceSettingsPage = () => {
    const toast = useToast();
    const [workspaceName, setWorkspaceName] = useState("My Workspace");
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteConfirmText, setDeleteConfirmText] = useState("");
    const [showInviteModal, setShowInviteModal] = useState(false);
    const [inviteEmail, setInviteEmail] = useState("");
    const [inviteRole, setInviteRole] = useState("member");

    const teamMembers = [
        { id: "1", name: "John Doe", email: "john@example.com", role: "owner", avatar: "J" },
        { id: "2", name: "Jane Smith", email: "jane@example.com", role: "admin", avatar: "J" },
        { id: "3", name: "Bob Wilson", email: "bob@example.com", role: "member", avatar: "B" },
    ];

    const roles = [
        { value: "admin", label: "Admin" },
        { value: "member", label: "Member" },
        { value: "viewer", label: "Viewer" },
    ];

    const handleSaveWorkspace = () => {
        console.log("Saving workspace:", { workspaceName });
        toast.success("Workspace updated", "Your workspace settings have been saved.");
    };

    const handleInviteMember = () => {
        console.log("Inviting:", { email: inviteEmail, role: inviteRole });
        setShowInviteModal(false);
        setInviteEmail("");
        setInviteRole("member");
        toast.success("Invitation sent", `An invite has been sent to ${inviteEmail}.`);
    };

    const handleRemoveMember = (memberId: string) => {
        console.log("Removing member:", memberId);
        toast.success("Member removed", "The team member has been removed from this workspace.");
    };

    const handleDeleteWorkspace = () => {
        console.log("Deleting workspace");
        setShowDeleteModal(false);
        toast.info("Workspace deleted", "Your workspace has been permanently deleted.");
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
        <Layout isLoggedIn isFixedHeader>
            {/* Floating Sidebar */}
            <SettingsSidebar activeTab="workspace" />
            
            {/* Main Content - with left margin to account for collapsed sidebar */}
            <div className="min-h-screen pl-24 pt-20 max-md:pl-4">
                {/* Sticky Header */}
                <div className="sticky top-20 z-20 bg-b-surface1 pb-4 -mx-4 px-4">
                    <div className="center">
                        <div className="flex items-center gap-4 py-4">
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
                    </div>
                </div>
                
                <div className="center">
                    {/* Main Content */}
                    <div className="w-full">

                            {/* General Settings */}
                            <div className="p-6 mb-6 rounded-4xl bg-b-surface2">
                                <h2 className="text-body-bold mb-6">General</h2>
                                
                                <div className="max-w-md mx-auto mb-6">
                                    <Field
                                        label="Workspace Name"
                                        value={workspaceName}
                                        onChange={(e) => setWorkspaceName(e.target.value)}
                                        placeholder="My Workspace"
                                    />
                                </div>

                                <div className="flex justify-center">
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
                                <h2 className="text-body-bold mb-2">Data Export</h2>
                                <p className="text-small text-t-secondary mb-6">
                                    Export all your workspace data including projects, services, and credentials.
                                </p>
                                
                                <div className="grid grid-cols-2 gap-4 mb-6 max-md:grid-cols-1">
                                    <div className="p-4 rounded-2xl bg-b-surface1 border-2 border-primary1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <div className="flex items-center justify-center size-10 rounded-xl bg-primary1/10 fill-primary1">
                                                <Icon className="!w-5 !h-5" name="code" />
                                            </div>
                                            <div>
                                                <p className="font-medium text-t-primary">JSON Format</p>
                                                <p className="text-xs text-t-tertiary">Structured data format</p>
                                            </div>
                                        </div>
                                        <p className="text-xs text-t-secondary">Best for importing into other tools or programmatic access.</p>
                                    </div>
                                    <div className="p-4 rounded-2xl bg-b-surface1 border-2 border-transparent hover:border-stroke-subtle transition-colors cursor-pointer">
                                        <div className="flex items-center gap-3 mb-2">
                                            <div className="flex items-center justify-center size-10 rounded-xl bg-b-surface2 fill-t-secondary">
                                                <Icon className="!w-5 !h-5" name="documents" />
                                            </div>
                                            <div>
                                                <p className="font-medium text-t-primary">CSV Format</p>
                                                <p className="text-xs text-t-tertiary">Spreadsheet compatible</p>
                                            </div>
                                        </div>
                                        <p className="text-xs text-t-secondary">Best for viewing in Excel, Google Sheets, or other spreadsheet apps.</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4">
                                    <Button isSecondary>
                                        <Icon className="mr-2 !w-5 !h-5" name="export" />
                                        Export All Data
                                    </Button>
                                    <span className="text-xs text-t-tertiary">
                                        Last export: Never
                                    </span>
                                </div>
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
                                <div className="flex gap-2">
                                    {roles.map((r) => (
                                        <button
                                            key={r.value}
                                            onClick={() => setInviteRole(r.value)}
                                            className={`flex-1 px-4 py-3 rounded-xl text-small font-medium transition-all border-2 ${
                                                inviteRole === r.value
                                                    ? "bg-t-primary text-b-surface1 border-t-primary"
                                                    : "bg-b-surface2 text-t-secondary border-stroke-subtle hover:border-stroke-highlight"
                                            }`}
                                        >
                                            {r.label}
                                        </button>
                                    ))}
                                </div>
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
                                isSecondary
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
                        onClick={() => {
                            setShowDeleteModal(false);
                            setDeleteConfirmText("");
                        }}
                    />
                    <div className="relative z-10 w-full max-w-md mx-4 p-8 rounded-4xl bg-b-surface1">
                        <h3 className="text-h4 mb-2">Delete Workspace?</h3>
                        <p className="text-small text-t-secondary mb-4">
                            This action cannot be undone. All projects, services, credentials, and team members will be permanently deleted.
                        </p>
                        <div className="mb-6">
                            <label className="block text-small font-medium text-t-secondary mb-2">
                                Type <span className="font-bold text-red-500">DELETE</span> to confirm
                            </label>
                            <input
                                type="text"
                                value={deleteConfirmText}
                                onChange={(e) => setDeleteConfirmText(e.target.value)}
                                placeholder="Type DELETE here"
                                className="w-full px-4 py-3 rounded-xl bg-b-surface2 border border-stroke-subtle text-body placeholder:text-t-tertiary focus:outline-none focus:border-red-500 transition-colors"
                            />
                        </div>
                        <div className="flex gap-3">
                            <Button
                                className="flex-1"
                                isStroke
                                onClick={() => {
                                    setShowDeleteModal(false);
                                    setDeleteConfirmText("");
                                }}
                            >
                                Cancel
                            </Button>
                            <Button
                                className="flex-1 !bg-red-500 !text-white hover:!bg-red-600 disabled:!bg-red-500/50 disabled:cursor-not-allowed"
                                onClick={handleDeleteWorkspace}
                                disabled={deleteConfirmText !== "DELETE"}
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

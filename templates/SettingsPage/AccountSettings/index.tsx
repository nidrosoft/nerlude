"use client";

import { useState, useEffect, useCallback } from "react";
import Layout from "@/components/Layout";
import Icon from "@/components/Icon";
import Button from "@/components/Button";
import Field from "@/components/Field";
import Skeleton from "@/components/Skeleton";
import SettingsSidebar from "../SettingsSidebar";
import { useToast } from "@/components/Toast";
import { getSupabaseClient } from "@/lib/db";

const AccountSettingsPage = () => {
    const toast = useToast();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteConfirmText, setDeleteConfirmText] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    // Fetch user profile data
    useEffect(() => {
        const fetchUserData = async () => {
            setIsLoading(true);
            try {
                const supabase = getSupabaseClient();
                const { data: { user } } = await supabase.auth.getUser();
                
                if (user) {
                    setEmail(user.email || '');
                    setName(user.user_metadata?.name || user.user_metadata?.full_name || '');
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchUserData();
    }, []);

    const handleSaveProfile = async () => {
        setIsSaving(true);
        try {
            const supabase = getSupabaseClient();
            const { error } = await supabase.auth.updateUser({
                data: { name, full_name: name }
            });
            
            if (error) throw error;
            toast.success("Profile updated", "Your profile information has been saved.");
        } catch (error) {
            console.error('Error saving profile:', error);
            toast.error("Error", "Failed to update profile.");
        } finally {
            setIsSaving(false);
        }
    };

    const handleChangePassword = async () => {
        if (newPassword !== confirmPassword) {
            toast.error("Passwords don't match", "Please make sure your passwords match.");
            return;
        }
        
        try {
            const supabase = getSupabaseClient();
            const { error } = await supabase.auth.updateUser({
                password: newPassword
            });
            
            if (error) throw error;
            
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
            toast.success("Password updated", "Your password has been changed successfully.");
        } catch (error) {
            console.error('Error changing password:', error);
            toast.error("Error", "Failed to change password.");
        }
    };

    const handleDeleteAccount = async () => {
        // Note: Account deletion typically requires backend support
        toast.info("Contact Support", "Please contact support to delete your account.");
        setShowDeleteModal(false);
    };

    return (
        <Layout isLoggedIn isFixedHeader>
            {/* Floating Sidebar */}
            <SettingsSidebar activeTab="account" />
            
            {/* Main Content - with left margin to account for collapsed sidebar */}
            <div className="min-h-screen pl-24 pt-20 max-md:pl-4">
                {/* Sticky Header */}
                <div className="sticky top-20 z-20 bg-b-surface1 pb-4 -mx-4 px-4">
                    <div className="center">
                        <div className="flex items-center gap-4 py-4">
                            <div className="flex items-center justify-center size-12 rounded-2xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border-[1.5px] border-blue-500/30">
                                <Icon className="!w-6 !h-6 fill-blue-500" name="profile" />
                            </div>
                            <div>
                                <h1 className="text-h3">Account Settings</h1>
                                <p className="text-small text-t-secondary">
                                    Manage your profile and security settings
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div className="center">
                    {/* Main Content */}
                    <div className="w-full">

                            {/* Profile Section */}
                            <div className="p-6 mb-6 rounded-4xl bg-b-surface2">
                                <h2 className="text-body-bold mb-6">Profile Information</h2>
                                
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="relative">
                                        <div className="size-20 rounded-full bg-gradient-to-br from-primary1/20 to-primary2/20 flex items-center justify-center text-3xl">
                                            {name.charAt(0).toUpperCase()}
                                        </div>
                                        <button className="absolute -bottom-1 -right-1 size-8 rounded-full bg-b-surface1 border-2 border-b-surface2 flex items-center justify-center fill-t-secondary hover:fill-t-primary transition-colors">
                                            <Icon className="!w-4 !h-4" name="camera" />
                                        </button>
                                    </div>
                                    <div>
                                        <p className="text-body-bold">{name}</p>
                                        <p className="text-small text-t-secondary">{email}</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4 mb-6 max-md:grid-cols-1">
                                    <Field
                                        label="Full Name"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="Your name"
                                    />
                                    <Field
                                        label="Email Address"
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="your@email.com"
                                    />
                                </div>

                                <div className="flex justify-end">
                                    <Button isPrimary onClick={handleSaveProfile}>
                                        Save Changes
                                    </Button>
                                </div>
                            </div>

                            {/* Password Section */}
                            <div className="p-6 mb-6 rounded-4xl bg-b-surface2">
                                <h2 className="text-body-bold mb-6">Change Password</h2>
                                
                                <div className="space-y-4 mb-6">
                                    <Field
                                        label="Current Password"
                                        type="password"
                                        value={currentPassword}
                                        onChange={(e) => setCurrentPassword(e.target.value)}
                                        placeholder="Enter current password"
                                    />
                                    <div className="grid grid-cols-2 gap-4 max-md:grid-cols-1">
                                        <Field
                                            label="New Password"
                                            type="password"
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            placeholder="Enter new password"
                                        />
                                        <Field
                                            label="Confirm New Password"
                                            type="password"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            placeholder="Confirm new password"
                                        />
                                    </div>
                                </div>

                                <div className="flex justify-end">
                                    <Button 
                                        isPrimary 
                                        onClick={handleChangePassword}
                                        disabled={!currentPassword || !newPassword || !confirmPassword}
                                    >
                                        Update Password
                                    </Button>
                                </div>
                            </div>

                            {/* Security Section */}
                            <div className="p-6 mb-6 rounded-4xl bg-b-surface2">
                                <h2 className="text-body-bold mb-6">Security</h2>
                                
                                {/* Two-Factor Authentication */}
                                <div className="flex items-center justify-between p-4 rounded-2xl bg-b-surface1 mb-4">
                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center justify-center size-10 rounded-xl bg-green-500/10 border-[1.5px] border-green-500/20 fill-green-500">
                                            <Icon className="!w-5 !h-5" name="lock" />
                                        </div>
                                        <div>
                                            <p className="font-medium">Two-Factor Authentication</p>
                                            <p className="text-small text-t-secondary">
                                                Add an extra layer of security to your account
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setTwoFactorEnabled(!twoFactorEnabled)}
                                        className={`relative w-12 h-7 rounded-full transition-colors border-2 ${
                                            twoFactorEnabled ? "bg-green-500 border-green-500" : "bg-b-surface2 border-stroke-subtle"
                                        }`}
                                    >
                                        <span
                                            className={`absolute top-1 left-1 size-5 rounded-full bg-white shadow-md transition-transform ${
                                                twoFactorEnabled ? "translate-x-5" : ""
                                            }`}
                                        />
                                    </button>
                                </div>

                                {/* Active Sessions */}
                                <div className="p-4 rounded-2xl bg-b-surface1">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center gap-4">
                                            <div className="flex items-center justify-center size-10 rounded-xl bg-blue-500/10 border-[1.5px] border-blue-500/20 fill-blue-500">
                                                <Icon className="!w-5 !h-5" name="mobile" />
                                            </div>
                                            <div>
                                                <p className="font-medium">Active Sessions</p>
                                                <p className="text-small text-t-secondary">
                                                    Manage devices where you're logged in
                                                </p>
                                            </div>
                                        </div>
                                        <Button isStroke>
                                            View All
                                        </Button>
                                    </div>
                                    <div className="text-small text-t-tertiary">
                                        Currently logged in on 2 devices
                                    </div>
                                </div>
                            </div>

                            {/* Connected Accounts */}
                            <div className="p-6 mb-6 rounded-4xl bg-b-surface2">
                                <h2 className="text-body-bold mb-6">Connected Accounts</h2>
                                
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between p-4 rounded-2xl bg-b-surface1">
                                        <div className="flex items-center gap-4">
                                            <div className="flex items-center justify-center size-10 rounded-xl bg-b-surface2">
                                                <Icon className="!w-5 !h-5 fill-t-secondary" name="external-link" />
                                            </div>
                                            <div>
                                                <p className="font-medium">Google</p>
                                                <p className="text-small text-t-secondary">Not connected</p>
                                            </div>
                                        </div>
                                        <Button isStroke>Connect</Button>
                                    </div>
                                    <div className="flex items-center justify-between p-4 rounded-2xl bg-b-surface1">
                                        <div className="flex items-center gap-4">
                                            <div className="flex items-center justify-center size-10 rounded-xl bg-b-surface2">
                                                <Icon className="!w-5 !h-5 fill-t-secondary" name="edit" />
                                            </div>
                                            <div>
                                                <p className="font-medium">GitHub</p>
                                                <p className="text-small text-t-secondary">Not connected</p>
                                            </div>
                                        </div>
                                        <Button isStroke>Connect</Button>
                                    </div>
                                </div>
                            </div>

                            {/* API Keys / Personal Tokens */}
                            <div className="p-6 mb-6 rounded-4xl bg-b-surface2">
                                <div className="flex items-center justify-between mb-6">
                                    <div>
                                        <h2 className="text-body-bold">API Keys</h2>
                                        <p className="text-small text-t-secondary mt-1">
                                            Manage personal access tokens for API integrations
                                        </p>
                                    </div>
                                    <Button isSecondary onClick={() => toast.info("Create API Key", "API key creation modal would open here")}>
                                        <Icon className="mr-2 !w-4 !h-4" name="plus" />
                                        Create Key
                                    </Button>
                                </div>
                                
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between p-4 rounded-2xl bg-b-surface1">
                                        <div className="flex items-center gap-4">
                                            <div className="flex items-center justify-center size-10 rounded-xl bg-green-500/10 fill-green-500">
                                                <Icon className="!w-5 !h-5" name="key" />
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <p className="font-medium">Production API Key</p>
                                                    <span className="px-2 py-0.5 text-xs rounded-full bg-green-500/10 text-green-600">Active</span>
                                                </div>
                                                <p className="text-small text-t-tertiary">Created Jan 1, 2025 · Last used 2 hours ago</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Button isStroke onClick={() => toast.success("Copied!", "API key copied to clipboard")}>
                                                <Icon className="!w-4 !h-4" name="copy" />
                                            </Button>
                                            <Button isStroke className="!border-red-500/30 !text-red-500 hover:!bg-red-500/10" onClick={() => toast.warning("Key revoked", "API key has been revoked")}>
                                                Revoke
                                            </Button>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between p-4 rounded-2xl bg-b-surface1">
                                        <div className="flex items-center gap-4">
                                            <div className="flex items-center justify-center size-10 rounded-xl bg-amber-500/10 fill-amber-500">
                                                <Icon className="!w-5 !h-5" name="key" />
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <p className="font-medium">Development Key</p>
                                                    <span className="px-2 py-0.5 text-xs rounded-full bg-amber-500/10 text-amber-600">Limited</span>
                                                </div>
                                                <p className="text-small text-t-tertiary">Created Dec 15, 2024 · Last used 1 day ago</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Button isStroke onClick={() => toast.success("Copied!", "API key copied to clipboard")}>
                                                <Icon className="!w-4 !h-4" name="copy" />
                                            </Button>
                                            <Button isStroke className="!border-red-500/30 !text-red-500 hover:!bg-red-500/10" onClick={() => toast.warning("Key revoked", "API key has been revoked")}>
                                                Revoke
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="mt-4 p-4 rounded-xl bg-b-surface1 border border-stroke-subtle">
                                    <div className="flex items-start gap-3">
                                        <Icon className="!w-5 !h-5 fill-t-tertiary shrink-0 mt-0.5" name="question-circle" />
                                        <div className="text-small text-t-secondary">
                                            <p className="font-medium text-t-primary mb-1">About API Keys</p>
                                            <p>API keys allow you to access Nelrude programmatically. Keep your keys secure and never share them publicly. You can revoke keys at any time.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Danger Zone */}
                            <div className="p-6 rounded-4xl border-2 border-red-500/20 bg-red-500/5">
                                <h2 className="text-body-bold text-red-500 mb-4">Danger Zone</h2>
                                <p className="text-small text-t-secondary mb-4">
                                    Once you delete your account, there is no going back. Please be certain.
                                </p>
                                <Button 
                                    className="!bg-red-500 !text-white hover:!bg-red-600"
                                    onClick={() => setShowDeleteModal(true)}
                                >
                                    Delete Account
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

            {/* Delete Account Modal */}
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
                        <h3 className="text-h4 mb-2">Delete Account?</h3>
                        <p className="text-small text-t-secondary mb-4">
                            This action cannot be undone. All your projects, services, and data will be permanently deleted.
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
                                onClick={handleDeleteAccount}
                                disabled={deleteConfirmText !== "DELETE"}
                            >
                                Delete Account
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </Layout>
    );
};

export default AccountSettingsPage;

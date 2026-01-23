"use client";

import { useState } from "react";
import Layout from "@/components/Layout";
import Icon from "@/components/Icon";
import Button from "@/components/Button";
import SettingsSidebar from "../SettingsSidebar";

interface NotificationSetting {
    id: string;
    title: string;
    description: string;
    email: boolean;
    push: boolean;
    inApp: boolean;
}

const NotificationsSettingsPage = () => {
    const [notifications, setNotifications] = useState<NotificationSetting[]>([
        {
            id: "renewals",
            title: "Renewal Reminders",
            description: "Get notified before domains, subscriptions, and services renew",
            email: true,
            push: true,
            inApp: true,
        },
        {
            id: "cost_alerts",
            title: "Cost Alerts",
            description: "Get notified when costs exceed thresholds or change significantly",
            email: true,
            push: false,
            inApp: true,
        },
        {
            id: "team_activity",
            title: "Team Activity",
            description: "Get notified when team members join, leave, or make changes",
            email: false,
            push: false,
            inApp: true,
        },
        {
            id: "security",
            title: "Security Alerts",
            description: "Get notified about login attempts and security events",
            email: true,
            push: true,
            inApp: true,
        },
        {
            id: "product_updates",
            title: "Product Updates",
            description: "Get notified about new features and improvements",
            email: true,
            push: false,
            inApp: false,
        },
    ]);

    const [emailDigest, setEmailDigest] = useState<"immediate" | "daily" | "weekly">("daily");
    const [quietHoursEnabled, setQuietHoursEnabled] = useState(false);
    const [quietHoursStart, setQuietHoursStart] = useState("22:00");
    const [quietHoursEnd, setQuietHoursEnd] = useState("08:00");

    const toggleNotification = (id: string, channel: "email" | "push" | "inApp") => {
        setNotifications((prev) =>
            prev.map((n) =>
                n.id === id ? { ...n, [channel]: !n[channel] } : n
            )
        );
    };

    const handleSave = async () => {
        try {
            // TODO: Save to API when backend is ready
            // await fetch('/api/users/me/preferences', {
            //     method: 'PATCH',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify({
            //         notifications,
            //         emailDigest,
            //         quietHoursEnabled,
            //         quietHoursStart,
            //         quietHoursEnd,
            //     }),
            // });
            toast.success("Settings saved", "Your notification preferences have been updated.");
        } catch {
            toast.error("Error", "Failed to save notification settings. Please try again.");
        }
    };

    return (
        <Layout isLoggedIn isFixedHeader>
            {/* Floating Sidebar */}
            <SettingsSidebar activeTab="notifications" />
            
            {/* Main Content - with left margin to account for collapsed sidebar */}
            <div className="min-h-screen pl-24 pt-20 max-md:pl-4">
                {/* Sticky Header */}
                <div className="sticky top-20 z-20 bg-b-surface1 pb-4 -mx-4 px-4">
                    <div className="center">
                        <div className="flex items-center gap-4 py-4">
                            <div className="flex items-center justify-center size-12 rounded-2xl bg-gradient-to-br from-green-500/20 to-emerald-500/20 border-[1.5px] border-green-500/30">
                                <Icon className="!w-6 !h-6 fill-green-500" name="bell" />
                            </div>
                            <div>
                                <h1 className="text-h3">Notifications</h1>
                                <p className="text-small text-t-secondary">
                                    Manage how and when you receive notifications
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div className="center">
                    {/* Main Content */}
                    <div className="w-full">

                            {/* Notification Preferences */}
                            <div className="p-6 mb-6 rounded-4xl bg-b-surface2">
                                <h2 className="text-body-bold mb-6">Notification Preferences</h2>
                                
                                {/* Header Row */}
                                <div className="flex items-center gap-4 px-4 mb-4 text-small font-medium text-t-tertiary">
                                    <div className="flex-1">Notification Type</div>
                                    <div className="w-16 text-center">Email</div>
                                    <div className="w-16 text-center">Push</div>
                                </div>

                                <div className="space-y-3">
                                    {notifications.map((notification) => (
                                        <div
                                            key={notification.id}
                                            className="flex items-center gap-4 p-4 rounded-2xl bg-b-surface1"
                                        >
                                            <div className="flex-1">
                                                <p className="font-medium">{notification.title}</p>
                                                <p className="text-small text-t-secondary">
                                                    {notification.description}
                                                </p>
                                            </div>
                                            <div className="w-16 flex justify-center">
                                                <button
                                                    onClick={() => toggleNotification(notification.id, "email")}
                                                    className={`size-6 rounded-lg border-2 flex items-center justify-center transition-all ${
                                                        notification.email
                                                            ? "bg-primary1 border-primary1"
                                                            : "border-stroke-subtle"
                                                    }`}
                                                >
                                                    {notification.email && (
                                                        <Icon className="!w-4 !h-4 fill-white" name="check" />
                                                    )}
                                                </button>
                                            </div>
                                            <div className="w-16 flex justify-center">
                                                <button
                                                    onClick={() => toggleNotification(notification.id, "push")}
                                                    className={`size-6 rounded-lg border-2 flex items-center justify-center transition-all ${
                                                        notification.push
                                                            ? "bg-primary1 border-primary1"
                                                            : "border-stroke-subtle"
                                                    }`}
                                                >
                                                    {notification.push && (
                                                        <Icon className="!w-4 !h-4 fill-white" name="check" />
                                                    )}
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Email Digest */}
                            <div className="p-6 mb-6 rounded-4xl bg-b-surface2">
                                <h2 className="text-body-bold mb-4">Email Digest</h2>
                                <p className="text-small text-t-secondary mb-4">
                                    Choose how often you want to receive email summaries
                                </p>
                                
                                <div className="flex gap-3">
                                    {[
                                        { value: "immediate", label: "Immediate" },
                                        { value: "daily", label: "Daily Digest" },
                                        { value: "weekly", label: "Weekly Digest" },
                                    ].map((option) => (
                                        <button
                                            key={option.value}
                                            onClick={() => setEmailDigest(option.value as typeof emailDigest)}
                                            className={`px-4 py-2 rounded-xl text-small font-medium transition-all ${
                                                emailDigest === option.value
                                                    ? "bg-primary1 text-white"
                                                    : "bg-b-surface1 text-t-secondary hover:bg-b-surface1/80"
                                            }`}
                                        >
                                            {option.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Quiet Hours */}
                            <div className="p-6 mb-6 rounded-4xl bg-b-surface2">
                                <div className="flex items-center justify-between mb-4">
                                    <div>
                                        <h2 className="text-body-bold">Quiet Hours</h2>
                                        <p className="text-small text-t-secondary mt-1">
                                            Pause notifications during specific hours
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => setQuietHoursEnabled(!quietHoursEnabled)}
                                        className={`relative w-12 h-7 rounded-full transition-colors border-2 ${
                                            quietHoursEnabled ? "bg-primary1 border-primary1" : "bg-b-surface2 border-stroke-subtle"
                                        }`}
                                    >
                                        <span
                                            className={`absolute top-1 left-1 size-5 rounded-full bg-white shadow-md transition-transform ${
                                                quietHoursEnabled ? "translate-x-5" : ""
                                            }`}
                                        />
                                    </button>
                                </div>
                                
                                {quietHoursEnabled && (
                                    <div className="flex items-center gap-4 p-4 rounded-2xl bg-b-surface1">
                                        <div className="flex-1">
                                            <label className="block mb-2 text-small font-medium text-t-secondary">
                                                Start Time
                                            </label>
                                            <input
                                                type="time"
                                                value={quietHoursStart}
                                                onChange={(e) => setQuietHoursStart(e.target.value)}
                                                className="w-full px-4 py-2 rounded-xl bg-b-surface2 text-t-primary focus:outline-none focus:ring-2 focus:ring-primary1/20"
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <label className="block mb-2 text-small font-medium text-t-secondary">
                                                End Time
                                            </label>
                                            <input
                                                type="time"
                                                value={quietHoursEnd}
                                                onChange={(e) => setQuietHoursEnd(e.target.value)}
                                                className="w-full px-4 py-2 rounded-xl bg-b-surface2 text-t-primary focus:outline-none focus:ring-2 focus:ring-primary1/20"
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Save Button */}
                            <div className="flex justify-end">
                                <Button isPrimary onClick={handleSave}>
                                    Save Preferences
                                </Button>
                            </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default NotificationsSettingsPage;

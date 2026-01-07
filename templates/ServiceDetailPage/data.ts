import { Credential, UsageStat, ActivityLogItem } from "./types";

export const mockCredentials: Credential[] = [
    { id: "1", label: "API Key", value: "demo_live_xxxxxxxxxxxxxxxxxxxx", isSecret: true, environment: "production" },
    { id: "2", label: "Secret Key", value: "demo_secret_xxxxxxxxxxxxxxxxxxxx", isSecret: true, environment: "production" },
    { id: "3", label: "Public Key", value: "demo_public_xxxxxxxxxxxx", isSecret: false, environment: "production" },
    { id: "4", label: "Webhook URL", value: "https://api.example.com/webhooks/service", isSecret: false, environment: "production" },
    { id: "5", label: "API Key (Staging)", value: "demo_test_xxxxxxxxxxxxxxxxxxxx", isSecret: true, environment: "staging" },
];

export const mockUsageStats: UsageStat[] = [
    { label: "API Calls", value: "12,847", change: "+12%", trend: "up" },
    { label: "Bandwidth", value: "2.4 GB", change: "+5%", trend: "up" },
    { label: "Errors", value: "23", change: "-8%", trend: "down" },
    { label: "Avg Response", value: "145ms", change: "-3%", trend: "down" },
];

export const mockActivityLog: ActivityLogItem[] = [
    { id: "1", action: "API key rotated", user: "John Doe", timestamp: "2 hours ago" },
    { id: "2", action: "Plan upgraded to Pro", user: "Jane Smith", timestamp: "3 days ago" },
    { id: "3", action: "Webhook endpoint added", user: "John Doe", timestamp: "1 week ago" },
    { id: "4", action: "Service connected", user: "Jane Smith", timestamp: "2 weeks ago" },
];

export const mockBillingHistory = [
    { date: "Jan 1, 2025", desc: "Monthly subscription", amount: "$29.00", status: "paid" },
    { date: "Dec 1, 2024", desc: "Monthly subscription", amount: "$29.00", status: "paid" },
    { date: "Nov 1, 2024", desc: "Monthly subscription", amount: "$29.00", status: "paid" },
];

export const notificationSettings = [
    { label: "Renewal reminders", desc: "Get notified before service renewal", enabled: true },
    { label: "Usage alerts", desc: "Alert when usage exceeds threshold", enabled: false },
    { label: "Billing notifications", desc: "Receive billing and payment updates", enabled: true },
];

export type TabId = "overview" | "credentials" | "usage" | "settings";

export interface TabInfo {
    id: TabId;
    label: string;
    icon: string;
}

export interface Credential {
    id: string;
    label: string;
    value: string;
    isSecret: boolean;
    environment: "production" | "staging" | "development";
    credentialType?: string;
    description?: string;
    fields?: Record<string, string>; // All credential fields (username, password, etc.)
    createdAt?: string;
}

export interface UsageStat {
    label: string;
    value: string;
    change?: string;
    trend?: "up" | "down" | "neutral";
}

export interface ActivityLogItem {
    id: string;
    action: string;
    user: string;
    timestamp: string;
}

export const tabs: TabInfo[] = [
    { id: "overview", label: "Overview", icon: "home" },
    { id: "credentials", label: "Credentials", icon: "key" },
    { id: "settings", label: "Settings", icon: "gear" },
];

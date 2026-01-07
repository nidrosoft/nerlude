"use client";

import { ReactNode } from "react";
import Button from "@/components/Button";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
    icon?: ReactNode;
    title: string;
    description?: string;
    action?: {
        label: string;
        onClick: () => void;
        icon?: ReactNode;
    };
    secondaryAction?: {
        label: string;
        onClick: () => void;
    };
    className?: string;
    size?: "sm" | "md" | "lg";
}

const EmptyState = ({
    icon,
    title,
    description,
    action,
    secondaryAction,
    className,
    size = "md",
}: EmptyStateProps) => {
    const sizeClasses = {
        sm: {
            container: "py-8",
            icon: "w-12 h-12 mb-3",
            title: "text-body-bold",
            description: "text-small",
        },
        md: {
            container: "py-12",
            icon: "w-16 h-16 mb-4",
            title: "text-h4",
            description: "text-body",
        },
        lg: {
            container: "py-16",
            icon: "w-20 h-20 mb-6",
            title: "text-h3",
            description: "text-body-lg",
        },
    };

    const sizes = sizeClasses[size];

    return (
        <div className={cn("flex flex-col items-center text-center", sizes.container, className)}>
            {icon && (
                <div className={cn("flex items-center justify-center rounded-2xl bg-b-surface2 text-t-tertiary", sizes.icon)}>
                    {icon}
                </div>
            )}
            <h3 className={cn("text-t-primary mb-2", sizes.title)}>{title}</h3>
            {description && (
                <p className={cn("text-t-secondary max-w-md mb-6", sizes.description)}>
                    {description}
                </p>
            )}
            {(action || secondaryAction) && (
                <div className="flex items-center gap-3">
                    {action && (
                        <Button onClick={action.onClick} isPrimary>
                            {action.icon && <span className="mr-2">{action.icon}</span>}
                            {action.label}
                        </Button>
                    )}
                    {secondaryAction && (
                        <Button onClick={secondaryAction.onClick} isStroke>
                            {secondaryAction.label}
                        </Button>
                    )}
                </div>
            )}
        </div>
    );
};

// Pre-built empty states for common use cases
export const EmptyProjects = ({ onCreateProject }: { onCreateProject: () => void }) => (
    <EmptyState
        icon={
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
        }
        title="No projects yet"
        description="Create your first project to start tracking your services, credentials, and costs."
        action={{
            label: "Create Project",
            onClick: onCreateProject,
        }}
    />
);

export const EmptyServices = ({ onAddService }: { onAddService: () => void }) => (
    <EmptyState
        icon={
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
            </svg>
        }
        title="No services added"
        description="Add your first service to track credentials, costs, and renewal dates."
        action={{
            label: "Add Service",
            onClick: onAddService,
        }}
        size="sm"
    />
);

export const EmptyAssets = ({ onUpload }: { onUpload: () => void }) => (
    <EmptyState
        icon={
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
        }
        title="No assets uploaded"
        description="Upload logos, screenshots, and documents for this project."
        action={{
            label: "Upload Files",
            onClick: onUpload,
        }}
        size="sm"
    />
);

export const EmptyDocs = ({ onCreateDoc }: { onCreateDoc: () => void }) => (
    <EmptyState
        icon={
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
        }
        title="No documentation yet"
        description="Add notes, architecture docs, or getting started guides for this project."
        action={{
            label: "Create Document",
            onClick: onCreateDoc,
        }}
        size="sm"
    />
);

export const EmptyTeam = ({ onInvite }: { onInvite: () => void }) => (
    <EmptyState
        icon={
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
        }
        title="No team members"
        description="Invite team members to collaborate on this project."
        action={{
            label: "Invite Member",
            onClick: onInvite,
        }}
        size="sm"
    />
);

export const EmptyAlerts = () => (
    <EmptyState
        icon={
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        }
        title="All caught up!"
        description="No pending alerts or renewals to worry about."
        size="sm"
    />
);

export const EmptySearch = ({ query }: { query: string }) => (
    <EmptyState
        icon={
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
        }
        title="No results found"
        description={`We couldn't find anything matching "${query}". Try a different search term.`}
        size="sm"
    />
);

export default EmptyState;

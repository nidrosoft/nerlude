"use client";

import { useState } from "react";
import Link from "next/link";
import { Service, Project } from "@/types";
import Icon from "@/components/Icon";
import { useProjectStore } from "@/stores";
import { getServiceHealth, getHealthInfo } from "@/lib/utils/healthStatus";

type Props = {
    services: Service[];
    projects: Project[];
};

const QuickAccess = ({ services, projects }: Props) => {
    const { 
        pinnedServiceIds, 
        recentServiceAccesses,
        togglePinService,
        recordServiceAccess 
    } = useProjectStore();
    const [copiedId, setCopiedId] = useState<string | null>(null);

    // Get pinned services
    const pinnedServices = services.filter(s => pinnedServiceIds.includes(s.id));
    
    // Get recent services (last 5, excluding pinned)
    const recentServices = recentServiceAccesses
        .slice(0, 5)
        .map(r => services.find(s => s.id === r.serviceId))
        .filter((s): s is Service => s !== undefined && !pinnedServiceIds.includes(s.id));

    // Helper to get project for a service
    const getProjectForService = (service: Service) => {
        return projects.find(p => p.id === service.projectId);
    };

    // Copy to clipboard simulation (would copy actual credential in real app)
    const handleCopyKey = async (service: Service) => {
        // In real implementation, this would copy the actual API key
        await navigator.clipboard.writeText(`${service.name.toLowerCase()}_api_key_placeholder`);
        setCopiedId(service.id);
        recordServiceAccess(service.id, service.projectId);
        setTimeout(() => setCopiedId(null), 2000);
    };

    // Handle service click (record access)
    const handleServiceClick = (service: Service) => {
        recordServiceAccess(service.id, service.projectId);
    };

    // Render a service card
    const renderServiceCard = (service: Service, showPin: boolean = true) => {
        const project = getProjectForService(service);
        const health = getServiceHealth(service);
        const healthInfo = getHealthInfo(health);
        const isPinned = pinnedServiceIds.includes(service.id);

        return (
            <div
                key={service.id}
                className="group relative flex items-center gap-3 p-3 rounded-2xl bg-b-surface2 hover:bg-b-surface3 transition-colors"
            >
                {/* Health Indicator */}
                <div className="relative">
                    <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-b-surface1">
                        <span className="text-lg font-medium text-t-secondary">
                            {service.name.charAt(0)}
                        </span>
                    </div>
                    <span 
                        className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full ring-2 ring-b-surface2 ${
                            health === 'healthy' ? 'bg-green-500' :
                            health === 'warning' ? 'bg-amber-500' : 'bg-red-500'
                        }`}
                        title={healthInfo.label}
                    />
                </div>

                {/* Service Info */}
                <div className="flex-1 min-w-0">
                    <Link 
                        href={`/projects/${service.projectId}`}
                        onClick={() => handleServiceClick(service)}
                        className="block truncate text-small font-medium text-t-primary hover:underline"
                    >
                        {service.name}
                    </Link>
                    <div className="flex items-center gap-2 text-xs text-t-tertiary">
                        <span className="truncate">{project?.name || 'Unknown Project'}</span>
                        {service.plan && (
                            <>
                                <span>•</span>
                                <span>{service.plan}</span>
                            </>
                        )}
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    {/* Copy Key Button */}
                    <button
                        onClick={() => handleCopyKey(service)}
                        className={`p-1.5 rounded-lg transition-colors ${
                            copiedId === service.id 
                                ? 'bg-green-500/10 text-green-600' 
                                : 'hover:bg-b-surface1 text-t-tertiary hover:text-t-primary'
                        }`}
                        title={copiedId === service.id ? 'Copied!' : 'Copy API Key'}
                    >
                        <Icon 
                            name="copy" 
                            className={`!w-4 !h-4 ${copiedId === service.id ? 'fill-green-600' : 'fill-current'}`} 
                        />
                    </button>

                    {/* Pin/Unpin Button */}
                    {showPin && (
                        <button
                            onClick={() => togglePinService(service.id)}
                            className={`p-1.5 rounded-lg transition-colors ${
                                isPinned 
                                    ? 'bg-primary1/10 text-primary1' 
                                    : 'hover:bg-b-surface1 text-t-tertiary hover:text-t-primary'
                            }`}
                            title={isPinned ? 'Unpin' : 'Pin to Quick Access'}
                        >
                            <Icon 
                                name="star" 
                                className={`!w-4 !h-4 ${isPinned ? 'fill-primary1' : 'fill-current'}`} 
                            />
                        </button>
                    )}

                    {/* External Link */}
                    <button
                        className="p-1.5 rounded-lg hover:bg-b-surface1 text-t-tertiary hover:text-t-primary transition-colors"
                        title="Open Dashboard"
                    >
                        <Icon name="export" className="!w-4 !h-4 fill-current" />
                    </button>
                </div>
            </div>
        );
    };

    // Don't render if no pinned or recent services
    if (pinnedServices.length === 0 && recentServices.length === 0) {
        return null;
    }

    return (
        <div className="mb-8">
            <div className="grid grid-cols-2 gap-6 max-lg:grid-cols-1">
                {/* Pinned Services */}
                {pinnedServices.length > 0 && (
                    <div>
                        <div className="flex items-center gap-2 mb-3">
                            <Icon name="star" className="!w-4.5 !h-4.5 fill-primary1" />
                            <h3 className="text-small font-medium text-t-secondary">Pinned Services</h3>
                        </div>
                        <div className="space-y-2">
                            {pinnedServices.map(service => renderServiceCard(service, true))}
                        </div>
                    </div>
                )}

                {/* Recent Services */}
                {recentServices.length > 0 && (
                    <div>
                        <div className="flex items-center gap-2 mb-3">
                            <Icon name="clock" className="!w-4.5 !h-4.5 fill-t-tertiary" />
                            <h3 className="text-small font-medium text-t-secondary">Recently Accessed</h3>
                        </div>
                        <div className="space-y-2">
                            {recentServices.map(service => renderServiceCard(service, true))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default QuickAccess;

/**
 * Health Status Utilities
 * 
 * Calculates health status for services and projects based on:
 * - Renewal dates
 * - Service status
 * - Alert count
 */

import { Service, Project, Alert } from '@/types';

export type HealthStatus = 'healthy' | 'warning' | 'critical';

export interface HealthInfo {
    status: HealthStatus;
    label: string;
    color: string;
    bgColor: string;
    borderColor: string;
    icon: string;
}

const HEALTH_CONFIG: Record<HealthStatus, Omit<HealthInfo, 'status'>> = {
    healthy: {
        label: 'Healthy',
        color: 'text-green-600',
        bgColor: 'bg-green-500',
        borderColor: 'border-green-500',
        icon: '🟢',
    },
    warning: {
        label: 'Warning',
        color: 'text-amber-600',
        bgColor: 'bg-amber-500',
        borderColor: 'border-amber-500',
        icon: '🟡',
    },
    critical: {
        label: 'Critical',
        color: 'text-red-600',
        bgColor: 'bg-red-500',
        borderColor: 'border-red-500',
        icon: '🔴',
    },
};

/**
 * Get health status info object
 */
export function getHealthInfo(status: HealthStatus): HealthInfo {
    return {
        status,
        ...HEALTH_CONFIG[status],
    };
}

/**
 * Calculate health status for a single service
 */
export function getServiceHealth(service: Service): HealthStatus {
    const now = new Date();
    
    // Critical: Service is inactive/deprecated or expired
    if (service.status === 'inactive' || service.status === 'deprecated') {
        return 'critical';
    }
    
    // Check renewal date
    if (service.renewalDate) {
        const renewalDate = new Date(service.renewalDate);
        const daysUntilRenewal = Math.ceil((renewalDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        
        // Critical: Expired or expires within 7 days
        if (daysUntilRenewal <= 7) {
            return 'critical';
        }
        
        // Warning: Expires within 30 days
        if (daysUntilRenewal <= 30) {
            return 'warning';
        }
    }
    
    // Paused services are warning
    if (service.status === 'paused') {
        return 'warning';
    }
    
    return 'healthy';
}

/**
 * Calculate aggregate health status for a project based on its services and alerts
 */
export function getProjectHealth(
    project: Project,
    services: Service[],
    alerts: Alert[] = []
): HealthStatus {
    // Filter services for this project
    const projectServices = services.filter(s => s.projectId === project.id);
    const projectAlerts = alerts.filter(a => a.projectId === project.id && !a.isDismissed);
    
    // Check for critical alerts
    const hasCriticalAlert = projectAlerts.some(a => a.priority === 'high');
    if (hasCriticalAlert) {
        return 'critical';
    }
    
    // Check service health
    const serviceHealthStatuses = projectServices.map(s => getServiceHealth(s));
    
    // If any service is critical, project is critical
    if (serviceHealthStatuses.includes('critical')) {
        return 'critical';
    }
    
    // Check for warning alerts or warning services
    const hasWarningAlert = projectAlerts.some(a => a.priority === 'medium');
    if (hasWarningAlert || serviceHealthStatuses.includes('warning')) {
        return 'warning';
    }
    
    // Project is paused or archived
    if (project.status === 'paused' || project.status === 'archived') {
        return 'warning';
    }
    
    return 'healthy';
}

/**
 * Get health breakdown for a project
 */
export function getProjectHealthBreakdown(
    project: Project,
    services: Service[],
    alerts: Alert[] = []
): { healthy: number; warning: number; critical: number } {
    const projectServices = services.filter(s => s.projectId === project.id);
    
    return projectServices.reduce(
        (acc, service) => {
            const health = getServiceHealth(service);
            acc[health]++;
            return acc;
        },
        { healthy: 0, warning: 0, critical: 0 }
    );
}

/**
 * Get days until renewal for a service
 */
export function getDaysUntilRenewal(service: Service): number | null {
    if (!service.renewalDate) return null;
    
    const now = new Date();
    const renewalDate = new Date(service.renewalDate);
    return Math.ceil((renewalDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}

/**
 * Format renewal status text
 */
export function getRenewalStatusText(service: Service): string | null {
    const days = getDaysUntilRenewal(service);
    if (days === null) return null;
    
    if (days < 0) return 'Expired';
    if (days === 0) return 'Expires today';
    if (days === 1) return 'Expires tomorrow';
    if (days <= 7) return `Expires in ${days} days`;
    if (days <= 30) return `Renews in ${days} days`;
    
    return null;
}

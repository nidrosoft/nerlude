"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Project, Service, Alert } from "@/types";
import Icon from "@/components/Icon";
import { getProjectHealth, getHealthInfo, HealthStatus } from "@/lib/utils/healthStatus";
import { useToast } from "@/components/Toast";

type Props = {
    project: Project;
    services?: Service[];
    alerts?: Alert[];
    onDuplicate?: (project: Project) => void;
};

const typeLabels: Record<string, string> = {
    web: "Web App",
    mobile: "Mobile",
    extension: "Extension",
    desktop: "Desktop",
    api: "API",
    landing: "Landing",
};

const healthStyles: Record<HealthStatus, { dot: string; ring: string }> = {
    healthy: { 
        dot: "bg-green-500", 
        ring: "ring-green-500/20" 
    },
    warning: { 
        dot: "bg-amber-500", 
        ring: "ring-amber-500/20" 
    },
    critical: { 
        dot: "bg-red-500", 
        ring: "ring-red-500/20" 
    },
};

const ProjectCard = ({ project, services = [], alerts = [], onDuplicate }: Props) => {
    const router = useRouter();
    const toast = useToast();
    const [showMenu, setShowMenu] = useState(false);
    const healthStatus = getProjectHealth(project, services, alerts);
    const healthInfo = getHealthInfo(healthStatus);
    const styles = healthStyles[healthStatus];

    const handleDuplicate = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setShowMenu(false);
        if (onDuplicate) {
            onDuplicate(project);
        } else {
            toast.success("Project duplicated", `A copy of "${project.name}" has been created.`);
        }
    };

    const handleArchive = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setShowMenu(false);
        toast.warning("Project archived", `"${project.name}" has been moved to archives.`);
    };
    
    return (
        <div className="group relative h-full">
            <Link
                href={`/projects/${project.id}`}
                className={`block h-full p-6 rounded-4xl bg-b-surface2 cursor-pointer transition-all hover:shadow-hover max-md:p-4 ring-2 ring-transparent hover:${styles.ring}`}
            >
                <div className="flex items-start justify-between mb-10 max-md:mb-6">
                    <div className="relative">
                        <div className="flex items-center justify-center size-11 rounded-full border-[1.5px] border-primary1/15 bg-primary1/5">
                            <span className="text-xl">{project.icon}</span>
                        </div>
                        {/* Health Status Indicator */}
                        <span 
                            className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full ${styles.dot} ring-2 ring-b-surface2`}
                            title={healthInfo.label}
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        {project.alertCount > 0 && (
                            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-red-500/10 text-red-500 text-xs font-medium">
                                {project.alertCount}
                            </span>
                        )}
                    </div>
                </div>
                <div className="mb-2 truncate text-body-bold text-t-primary/80 transition-colors group-hover:text-t-primary">
                    {project.name}
                </div>
                <div className="flex items-center gap-2 mb-3">
                    <span className="px-2 py-0.5 text-xs rounded-full bg-b-surface1 text-t-secondary">
                        {typeLabels[project.type] || project.type}
                    </span>
                    {/* Health Badge */}
                    <span className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs ${
                        healthStatus === 'healthy' ? 'bg-green-500/10 text-green-600' :
                        healthStatus === 'warning' ? 'bg-amber-500/10 text-amber-600' :
                        'bg-red-500/10 text-red-600'
                    }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${styles.dot}`} />
                        {healthInfo.label}
                    </span>
                </div>
                <div className="flex items-center gap-4 text-small text-t-tertiary">
                    <div className="flex items-center gap-1.5 fill-t-tertiary">
                        <Icon className="!w-4 !h-4" name="documents" />
                        <span>${project.monthlyCost}/mo</span>
                    </div>
                    <div className="flex items-center gap-1.5 fill-t-tertiary">
                        <Icon className="!w-4 !h-4" name="post" />
                        <span>{project.serviceCount} services</span>
                    </div>
                </div>
            </Link>
            
            {/* Quick Actions Button - Bottom Right */}
            <button
                onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setShowMenu(!showMenu);
                }}
                className="absolute bottom-4 right-4 flex items-center justify-center size-8 rounded-xl bg-b-surface1/80 hover:bg-b-surface1 opacity-0 group-hover:opacity-100 transition-all fill-t-tertiary hover:fill-t-primary z-10"
            >
                <Icon className="!w-4 !h-4" name="more" />
            </button>
            
            {/* Quick Actions Menu - Opens upward from bottom */}
            {showMenu && (
                <>
                    <div 
                        className="fixed inset-0 z-20"
                        onClick={() => setShowMenu(false)}
                    />
                    <div className="absolute bottom-14 right-4 z-30 w-40 p-2 rounded-2xl bg-b-surface1 shadow-lg border border-stroke-subtle">
                        <button
                            onClick={handleDuplicate}
                            className="flex items-center w-full px-3 py-2 rounded-xl text-small text-t-secondary hover:bg-b-surface2 hover:text-t-primary transition-colors fill-t-secondary hover:fill-t-primary"
                        >
                            <Icon className="!w-4 !h-4 mr-2" name="copy" />
                            Duplicate
                        </button>
                        <button
                            onClick={handleArchive}
                            className="flex items-center w-full px-3 py-2 rounded-xl text-small text-amber-500 hover:bg-amber-500/10 transition-colors fill-amber-500"
                        >
                            <Icon className="!w-4 !h-4 mr-2" name="documents" />
                            Archive
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default ProjectCard;

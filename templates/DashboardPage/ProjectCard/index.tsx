"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Menu, MenuButton, MenuItems, MenuItem } from "@headlessui/react";
import { Project, Service, Alert } from "@/types";
import Icon from "@/components/Icon";
import ConfirmModal from "@/components/ConfirmModal";
import { getProjectHealth, getHealthInfo, HealthStatus } from "@/lib/utils/healthStatus";
import { useToast } from "@/components/Toast";
import { useProjectLoading } from "@/components/ProjectLoadingOverlay";

type Props = {
    project: Project;
    services?: Service[];
    alerts?: Alert[];
    onDuplicate?: (project: Project) => void;
    onArchive?: (project: Project) => void;
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

const ProjectCard = ({ project, services = [], alerts = [], onDuplicate, onArchive }: Props) => {
    const toast = useToast();
    const router = useRouter();
    const { showLoading } = useProjectLoading();
    const [showArchiveModal, setShowArchiveModal] = useState(false);
    const [isArchiving, setIsArchiving] = useState(false);
    const [isDuplicating, setIsDuplicating] = useState(false);
    const healthStatus = getProjectHealth(project, services, alerts);
    const healthInfo = getHealthInfo(healthStatus);
    const styles = healthStyles[healthStatus];

    const handleProjectClick = (e: React.MouseEvent) => {
        e.preventDefault();
        showLoading(project.name);
        router.push(`/projects/${project.id}`);
    };

    const handleDuplicate = async () => {
        setIsDuplicating(true);
        try {
            const response = await fetch(`/api/projects/${project.id}/duplicate`, { method: 'POST' });
            
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Failed to duplicate project');
            }
            
            const data = await response.json();
            
            if (onDuplicate) {
                onDuplicate(data.project);
            }
            toast.success("Project duplicated", `A copy of "${project.name}" has been created.`);
        } catch (error) {
            toast.error("Error", error instanceof Error ? error.message : "Failed to duplicate project. Please try again.");
        } finally {
            setIsDuplicating(false);
        }
    };

    const handleArchiveClick = () => {
        setShowArchiveModal(true);
    };

    const handleArchiveConfirm = async () => {
        setIsArchiving(true);
        try {
            const response = await fetch(`/api/projects/${project.id}/archive`, { method: 'POST' });
            
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Failed to archive project');
            }
            
            if (onArchive) {
                onArchive(project);
            }
            toast.warning("Project archived", `"${project.name}" has been moved to archives.`);
        } catch (error) {
            toast.error("Error", error instanceof Error ? error.message : "Failed to archive project. Please try again.");
        } finally {
            setIsArchiving(false);
            setShowArchiveModal(false);
        }
    };
    
    return (
        <div className="group relative h-full">
            <div
                onClick={handleProjectClick}
                className={`block h-full p-6 rounded-4xl bg-b-surface2 border border-stroke-subtle cursor-pointer transition-all hover:shadow-hover max-md:p-4 ring-2 ring-transparent hover:${styles.ring}`}
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
            </div>
            
            {/* Quick Actions Menu - Bottom Right */}
            <Menu as="div" className="absolute bottom-4 right-4 z-10">
                <MenuButton 
                    className="flex items-center justify-center size-8 rounded-xl bg-b-surface1/80 hover:bg-b-surface1 opacity-0 group-hover:opacity-100 transition-all fill-t-tertiary hover:fill-t-primary"
                    onClick={(e: React.MouseEvent) => e.preventDefault()}
                >
                    <Icon className="!w-4 !h-4" name="more" />
                </MenuButton>
                <MenuItems
                    className="z-50 [--anchor-gap:0.5rem] w-40 shadow-hover bg-b-surface2 border border-stroke-subtle rounded-2xl outline-0 origin-bottom transition duration-200 ease-out data-closed:scale-95 data-closed:opacity-0"
                    anchor="top end"
                    transition
                >
                    <div className="p-2">
                        <MenuItem>
                            <button
                                onClick={handleDuplicate}
                                className="flex items-center w-full px-3 py-2 rounded-xl text-small text-t-secondary hover:bg-b-highlight hover:text-t-primary transition-colors fill-t-secondary hover:fill-t-primary"
                            >
                                <Icon className="!w-4 !h-4 mr-2" name="copy" />
                                Duplicate
                            </button>
                        </MenuItem>
                        <MenuItem>
                            <button
                                onClick={handleArchiveClick}
                                className="flex items-center w-full px-3 py-2 rounded-xl text-small text-amber-500 hover:bg-amber-500/10 transition-colors fill-amber-500"
                            >
                                <Icon className="!w-4 !h-4 mr-2" name="documents" />
                                Archive
                            </button>
                        </MenuItem>
                    </div>
                </MenuItems>
            </Menu>

            {/* Archive Confirmation Modal */}
            <ConfirmModal
                isOpen={showArchiveModal}
                onClose={() => setShowArchiveModal(false)}
                onConfirm={handleArchiveConfirm}
                title="Archive Project?"
                message={`"${project.name}" will be moved to archives. You can restore it anytime from the archived projects page.`}
                confirmText="Archive"
                cancelText="Cancel"
                variant="warning"
                isLoading={isArchiving}
            />
        </div>
    );
};

export default ProjectCard;

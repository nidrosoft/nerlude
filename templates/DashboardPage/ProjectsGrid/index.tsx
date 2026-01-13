"use client";

import { useState } from "react";
import Link from "next/link";
import { Project, Service, Alert } from "@/types";
import ProjectCard from "../ProjectCard";
import Icon from "@/components/Icon";
import useSubscription from "@/hooks/useSubscription";
import UpgradeModal from "@/components/UpgradeModal";

type Props = {
    projects: Project[];
    services?: Service[];
    alerts?: Alert[];
};

const ProjectsGrid = ({ projects, services = [], alerts = [] }: Props) => {
    const { plan, canCreateProject, isDemoAccount } = useSubscription();
    const [showUpgradeModal, setShowUpgradeModal] = useState(false);

    // Check if user can create more projects
    const projectCheck = canCreateProject();
    const canCreate = isDemoAccount || projectCheck.allowed;

    const handleAddProjectClick = (e: React.MouseEvent) => {
        if (!canCreate) {
            e.preventDefault();
            setShowUpgradeModal(true);
        }
    };

    // Empty state when no projects exist
    if (projects.length === 0) {
        return (
            <>
                <div className="flex flex-col items-center justify-center py-12 px-6 rounded-4xl bg-b-surface2 border border-stroke-subtle">
                    <div className="flex items-center justify-center size-14 rounded-2xl bg-blue-500/10 mb-4">
                        <Icon className="!w-7 !h-7 fill-blue-500" name="post" />
                    </div>
                    <h3 className="text-body-bold text-t-primary mb-1 text-center">No projects yet</h3>
                    <p className="text-small text-t-tertiary text-center max-w-xs mb-5">
                        Create your first project to start tracking services, costs, and credentials.
                    </p>
                    <Link
                        href="/projects/new"
                        className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary1 text-white text-small font-medium hover:bg-primary1/90 transition-colors"
                    >
                        <Icon className="!w-4 !h-4 fill-white" name="plus" />
                        Create Your First Project
                    </Link>
                </div>
                
                <UpgradeModal
                    isOpen={showUpgradeModal}
                    onClose={() => setShowUpgradeModal(false)}
                    title="Project Limit Reached"
                    message={`You've reached your limit of ${plan.maxProjects} project${plan.maxProjects === 1 ? '' : 's'} on the ${plan.name} plan. Upgrade to create more projects.`}
                    suggestedPlan={plan.id === "free" ? "Pro" : "Team"}
                    limitType="projects"
                />
            </>
        );
    }

    return (
        <>
            <div className="flex flex-wrap -mt-6 -mx-3 max-md:-mt-4 max-md:mx-0">
                {projects.map((project) => (
                    <div
                        key={project.id}
                        className="w-[calc(25%-1.5rem)] mt-6 mx-3 max-3xl:w-[calc(33.333%-1.5rem)] max-[1179px]:w-[calc(50%-1.5rem)] max-md:w-full max-md:mt-4 max-md:mx-0"
                    >
                        <ProjectCard 
                            project={project} 
                            services={services}
                            alerts={alerts}
                        />
                    </div>
                ))}
                <div className="w-[calc(25%-1.5rem)] mt-6 mx-3 max-3xl:w-[calc(33.333%-1.5rem)] max-[1179px]:w-[calc(50%-1.5rem)] max-md:w-full max-md:mt-4 max-md:mx-0">
                    {canCreate ? (
                        <Link
                            href="/projects/new"
                            className="group flex flex-col items-center justify-center h-full min-h-[200px] p-6 border-2 border-dashed border-stroke-subtle rounded-4xl text-t-secondary hover:border-primary1 hover:text-primary1 hover:bg-primary1/5 transition-all cursor-pointer max-md:p-4"
                        >
                            <div className="flex items-center justify-center size-11 mb-10 rounded-full border-[1.5px] border-primary1/15 bg-primary1/5 fill-primary1 max-md:mb-6">
                                <Icon name="plus" />
                            </div>
                            <span className="font-medium text-body-bold">Add Project</span>
                        </Link>
                    ) : (
                        <button
                            onClick={handleAddProjectClick}
                            className="group flex flex-col items-center justify-center h-full min-h-[200px] w-full p-6 border-2 border-dashed border-stroke-subtle rounded-4xl text-t-tertiary hover:border-amber-500/50 hover:bg-amber-500/5 transition-all cursor-pointer max-md:p-4"
                        >
                            <div className="flex items-center justify-center size-11 mb-10 rounded-full border-[1.5px] border-amber-500/20 bg-amber-500/10 fill-amber-500 max-md:mb-6">
                                <Icon name="lock" />
                            </div>
                            <span className="font-medium text-body-bold text-t-tertiary">Add Project</span>
                            <span className="text-xs text-amber-600 mt-1">Upgrade to unlock</span>
                        </button>
                    )}
                </div>
            </div>
            
            <UpgradeModal
                isOpen={showUpgradeModal}
                onClose={() => setShowUpgradeModal(false)}
                title="Project Limit Reached"
                message={`You've reached your limit of ${plan.maxProjects} project${plan.maxProjects === 1 ? '' : 's'} on the ${plan.name} plan. Upgrade to create more projects.`}
                suggestedPlan={plan.id === "free" ? "Pro" : "Team"}
                limitType="projects"
            />
        </>
    );
};

export default ProjectsGrid;

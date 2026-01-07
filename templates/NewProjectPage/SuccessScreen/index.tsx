"use client";

import { useEffect, useState } from "react";
import { ArrowRight, Add, DocumentText, Notification } from "iconsax-react";
import Icon from "@/components/Icon";
import Button from "@/components/Button";
import { ExtractedProject } from "@/types";

type Props = {
    projects: ExtractedProject[];
    onViewDashboard: () => void;
    onCreateAnother: () => void;
};

const SuccessScreen = ({ projects, onViewDashboard, onCreateAnother }: Props) => {
    const [showConfetti, setShowConfetti] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setShowConfetti(false), 3000);
        return () => clearTimeout(timer);
    }, []);

    const totalServices = projects.reduce((sum, p) => sum + p.services.length, 0);
    const totalMonthlyCost = projects.reduce((sum, p) => sum + p.totalMonthlyCost, 0);

    return (
        <div className="flex flex-col items-center justify-center py-12 text-center">
            {/* Success Animation */}
            <div className="relative mb-8">
                <div className="flex items-center justify-center size-24 rounded-3xl bg-green-500/10">
                    <Icon className="!w-12 !h-12 fill-green-500" name="check" />
                </div>
                {showConfetti && (
                    <div className="absolute inset-0 pointer-events-none">
                        {[...Array(12)].map((_, i) => (
                            <div
                                key={i}
                                className="absolute w-2 h-2 rounded-full animate-ping"
                                style={{
                                    backgroundColor: ['#8B5CF6', '#EC4899', '#10B981', '#F59E0B'][i % 4],
                                    top: '50%',
                                    left: '50%',
                                    transform: `rotate(${i * 30}deg) translateY(-40px)`,
                                    animationDelay: `${i * 100}ms`,
                                    animationDuration: '1s',
                                }}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Title */}
            <h2 className="text-h3 text-t-primary mb-2">
                {projects.length === 1 ? 'Project Created!' : `${projects.length} Projects Created!`}
            </h2>
            <p className="text-body text-t-secondary mb-8 max-w-md">
                Your {projects.length === 1 ? 'project has' : 'projects have'} been set up with {totalServices} service{totalServices !== 1 ? 's' : ''} and all documents saved.
            </p>

            {/* Created Projects */}
            <div className="w-full max-w-md space-y-3 mb-8">
                {projects.map((project) => (
                    <div
                        key={project.id}
                        className="flex items-center gap-4 p-4 rounded-2xl bg-b-surface1 text-left"
                    >
                        <div className="flex items-center justify-center size-12 rounded-2xl bg-primary1/10 text-xl">
                            {project.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="font-medium text-t-primary truncate">{project.name.value}</div>
                            <div className="text-small text-t-secondary">
                                {project.services.length} service{project.services.length !== 1 ? 's' : ''} • ${project.totalMonthlyCost.toFixed(2)}/mo
                            </div>
                        </div>
                        <Icon className="!w-5 !h-5 fill-green-500" name="check" />
                    </div>
                ))}
            </div>

            {/* Summary */}
            <div className="flex items-center justify-center gap-6 mb-8 text-small">
                <div className="flex items-center gap-2">
                    <DocumentText size={16} color="#9CA3AF" variant="Bold" />
                    <span className="text-t-secondary">Documents saved to resources</span>
                </div>
                <div className="flex items-center gap-2">
                    <Notification size={16} color="#9CA3AF" variant="Bold" />
                    <span className="text-t-secondary">Renewal alerts configured</span>
                </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
                <Button isStroke onClick={onCreateAnother}>
                    <Add size={20} color="currentColor" className="mr-2" />
                    Add Another Project
                </Button>
                <Button isPrimary onClick={onViewDashboard}>
                    View Dashboard
                    <ArrowRight size={20} color="white" className="ml-2" />
                </Button>
            </div>
        </div>
    );
};

export default SuccessScreen;

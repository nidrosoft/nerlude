"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Layout from "@/components/Layout";
import Icon from "@/components/Icon";
import ConfirmModal from "@/components/ConfirmModal";
import { useToast } from "@/components/Toast";
import { Project } from "@/types";
import Skeleton from "@/components/Skeleton";

const typeLabels: Record<string, string> = {
    web: "Web App",
    mobile: "Mobile",
    extension: "Extension",
    desktop: "Desktop",
    api: "API",
    landing: "Landing",
};

interface ArchivedProject {
    id: string;
    name: string;
    description?: string;
    icon: string;
    type: string;
    status: string;
    archived_at?: string;
    updated_at: string;
    services?: { count: number }[];
}

const ArchivedProjectsPage = () => {
    const toast = useToast();
    const [projects, setProjects] = useState<ArchivedProject[]>([]);
    const [selectedProject, setSelectedProject] = useState<ArchivedProject | null>(null);
    const [showRestoreModal, setShowRestoreModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(true);

    useEffect(() => {
        fetchArchivedProjects();
    }, []);

    const fetchArchivedProjects = async () => {
        try {
            const response = await fetch('/api/projects?status=archived');
            if (response.ok) {
                const data = await response.json();
                setProjects(data);
            }
        } catch (error) {
            console.error('Failed to fetch archived projects:', error);
        } finally {
            setIsFetching(false);
        }
    };

    const handleRestoreClick = (project: ArchivedProject) => {
        setSelectedProject(project);
        setShowRestoreModal(true);
    };

    const handleDeleteClick = (project: ArchivedProject) => {
        setSelectedProject(project);
        setShowDeleteModal(true);
    };

    const handleRestore = async () => {
        if (!selectedProject) return;
        
        setIsLoading(true);
        try {
            const response = await fetch(`/api/projects/${selectedProject.id}/archive`, { method: 'DELETE' });
            
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Failed to restore project');
            }
            
            setProjects(projects.filter(p => p.id !== selectedProject.id));
            toast.success("Project restored", `"${selectedProject.name}" has been restored to active projects.`);
        } catch (error) {
            toast.error("Error", error instanceof Error ? error.message : "Failed to restore project. Please try again.");
        } finally {
            setIsLoading(false);
            setShowRestoreModal(false);
            setSelectedProject(null);
        }
    };

    const handlePermanentDelete = async () => {
        if (!selectedProject) return;
        
        setIsLoading(true);
        try {
            const response = await fetch(`/api/projects/${selectedProject.id}`, { method: 'DELETE' });
            
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Failed to delete project');
            }
            
            setProjects(projects.filter(p => p.id !== selectedProject.id));
            toast.success("Project deleted", `"${selectedProject.name}" has been permanently deleted.`);
        } catch (error) {
            toast.error("Error", error instanceof Error ? error.message : "Failed to delete project. Please try again.");
        } finally {
            setIsLoading(false);
            setShowDeleteModal(false);
            setSelectedProject(null);
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    return (
        <Layout isLoggedIn>
            <div className="py-8 max-md:py-6">
                <div className="center">
                    {/* Header */}
                    <div className="flex items-center gap-4 mb-8">
                        <Link 
                            href="/dashboard"
                            className="flex items-center justify-center size-10 rounded-xl bg-b-surface2 border border-stroke-subtle hover:bg-b-highlight transition-colors fill-t-secondary hover:fill-t-primary"
                        >
                            <Icon className="!w-5 !h-5 rotate-180" name="arrow" />
                        </Link>
                        <div>
                            <h1 className="text-h3 text-t-primary">Archived Projects</h1>
                            <p className="text-body text-t-secondary mt-1">
                                {projects.length} archived project{projects.length !== 1 ? 's' : ''}
                            </p>
                        </div>
                    </div>

                    {/* Empty State */}
                    {projects.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-20 px-6 rounded-4xl bg-b-surface2 border border-stroke-subtle">
                            <div className="flex items-center justify-center size-16 rounded-2xl bg-b-highlight mb-4">
                                <Icon className="!w-8 !h-8 fill-t-tertiary" name="documents" />
                            </div>
                            <h3 className="text-h5 text-t-primary mb-2">No archived projects</h3>
                            <p className="text-body text-t-secondary text-center max-w-md mb-6">
                                When you archive a project, it will appear here. Archived projects can be restored at any time.
                            </p>
                            <Link href="/dashboard">
                                <button className="px-6 py-3 rounded-full bg-primary1 text-white font-medium hover:bg-primary1/90 transition-colors">
                                    Back to Dashboard
                                </button>
                            </Link>
                        </div>
                    )}

                    {/* Projects List */}
                    {projects.length > 0 && (
                        <div className="space-y-4">
                            {projects.map((project) => (
                                <div 
                                    key={project.id}
                                    className="flex items-center justify-between p-5 rounded-3xl bg-b-surface2 border border-stroke-subtle hover:shadow-hover transition-all"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center justify-center size-12 rounded-xl bg-b-highlight">
                                            <span className="text-2xl">{project.icon}</span>
                                        </div>
                                        <div>
                                            <h3 className="text-body-bold text-t-primary">{project.name}</h3>
                                            <div className="flex items-center gap-3 mt-1">
                                                <span className="px-2 py-0.5 text-xs rounded-full bg-b-surface1 text-t-secondary">
                                                    {typeLabels[project.type] || project.type}
                                                </span>
                                                <span className="text-small text-t-tertiary">
                                                    Archived {formatDate(project.archived_at || project.updated_at)}
                                                </span>
                                                <span className="text-small text-t-tertiary">
                                                    {project.services?.[0]?.count || 0} services
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => handleRestoreClick(project)}
                                            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary1/10 text-primary1 font-medium hover:bg-primary1/20 transition-colors"
                                        >
                                            <Icon className="!w-4 !h-4 fill-primary1" name="generation" />
                                            Restore
                                        </button>
                                        <button
                                            onClick={() => handleDeleteClick(project)}
                                            className="flex items-center justify-center size-10 rounded-xl bg-red-500/10 hover:bg-red-500/20 transition-colors fill-red-500"
                                        >
                                            <Icon className="!w-4 !h-4" name="trash" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Info Box */}
                    {projects.length > 0 && (
                        <div className="mt-8 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20">
                            <div className="flex items-start gap-3">
                                <Icon className="!w-5 !h-5 fill-amber-500 shrink-0 mt-0.5" name="bell" />
                                <div>
                                    <p className="text-small font-medium text-amber-600 dark:text-amber-400">
                                        Archived projects are kept for 90 days
                                    </p>
                                    <p className="text-small text-t-secondary mt-1">
                                        After 90 days, archived projects will be automatically deleted. Restore them before then to keep your data.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Restore Confirmation Modal */}
            <ConfirmModal
                isOpen={showRestoreModal}
                onClose={() => {
                    setShowRestoreModal(false);
                    setSelectedProject(null);
                }}
                onConfirm={handleRestore}
                title="Restore Project?"
                message={`"${selectedProject?.name}" will be restored to your active projects and all its services will become accessible again.`}
                confirmText="Restore Project"
                cancelText="Cancel"
                variant="info"
                isLoading={isLoading}
            />

            {/* Delete Confirmation Modal */}
            <ConfirmModal
                isOpen={showDeleteModal}
                onClose={() => {
                    setShowDeleteModal(false);
                    setSelectedProject(null);
                }}
                onConfirm={handlePermanentDelete}
                title="Permanently Delete?"
                message={`This will permanently delete "${selectedProject?.name}" and all its services, credentials, and data. This action cannot be undone.`}
                confirmText="Delete Forever"
                cancelText="Cancel"
                variant="danger"
                isLoading={isLoading}
            />
        </Layout>
    );
};

export default ArchivedProjectsPage;

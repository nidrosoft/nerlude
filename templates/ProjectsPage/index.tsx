"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Layout from "@/components/Layout";
import Icon from "@/components/Icon";
import Button from "@/components/Button";
import Skeleton from "@/components/Skeleton";
import { useWorkspaceStore } from "@/stores";
import { useToast } from "@/components/Toast";

interface Project {
    id: string;
    name: string;
    description: string | null;
    icon: string;
    type: string;
    status: string;
    workspace_id: string;
    created_at: string;
    updated_at: string;
    services?: { count: number }[];
}

const ProjectsPage = () => {
    const { currentWorkspace } = useWorkspaceStore();
    const toast = useToast();
    const [projects, setProjects] = useState<Project[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filter, setFilter] = useState<"all" | "active" | "archived">("all");
    const [searchQuery, setSearchQuery] = useState("");

    const fetchProjects = useCallback(async () => {
        if (!currentWorkspace) return;
        
        setIsLoading(true);
        try {
            const params = new URLSearchParams();
            params.set('workspace_id', currentWorkspace.id);
            if (filter !== "all") {
                params.set('status', filter);
            }
            
            const response = await fetch(`/api/projects?${params.toString()}`);
            if (!response.ok) throw new Error('Failed to fetch projects');
            
            const data = await response.json();
            setProjects(data);
        } catch (error) {
            console.error('Error fetching projects:', error);
            toast.error("Error", "Failed to load projects");
        } finally {
            setIsLoading(false);
        }
    }, [currentWorkspace, filter, toast]);

    useEffect(() => {
        fetchProjects();
    }, [fetchProjects]);

    const filteredProjects = projects.filter(project => 
        project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const getServiceCount = (project: Project) => {
        return project.services?.[0]?.count || 0;
    };

    return (
        <Layout isLoggedIn>
            <div className="min-h-[calc(100vh-80px)] py-8">
                <div className="max-w-6xl mx-auto px-6">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h1 className="text-h2 mb-1">Projects</h1>
                            <p className="text-body text-t-secondary">
                                Manage your projects and services
                            </p>
                        </div>
                        <Button isPrimary as="link" href="/projects/new">
                            <Icon className="mr-2 !w-5 !h-5" name="plus" />
                            New Project
                        </Button>
                    </div>

                    {/* Filters & Search */}
                    <div className="flex items-center gap-4 mb-6">
                        <div className="flex items-center gap-2 p-1 bg-b-surface2 rounded-full">
                            {(["all", "active", "archived"] as const).map((f) => (
                                <button
                                    key={f}
                                    onClick={() => setFilter(f)}
                                    className={`px-4 py-2 rounded-full text-small font-medium capitalize transition-all ${
                                        filter === f
                                            ? "bg-b-surface1 text-t-primary shadow-sm"
                                            : "text-t-tertiary hover:text-t-primary"
                                    }`}
                                >
                                    {f}
                                </button>
                            ))}
                        </div>
                        <div className="flex-1 relative">
                            <Icon className="absolute left-4 top-1/2 -translate-y-1/2 !w-5 !h-5 text-t-tertiary" name="search" />
                            <input
                                type="text"
                                placeholder="Search projects..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 rounded-full bg-b-surface2 text-body text-t-primary placeholder:text-t-tertiary focus:outline-none focus:ring-2 focus:ring-primary1/20"
                            />
                        </div>
                    </div>

                    {/* Projects Grid */}
                    {isLoading ? (
                        <div className="grid grid-cols-3 gap-4 max-lg:grid-cols-2 max-md:grid-cols-1">
                            {[1, 2, 3, 4, 5, 6].map((i) => (
                                <div key={i} className="p-6 rounded-3xl bg-b-surface2">
                                    <div className="flex items-start gap-4 mb-4">
                                        <Skeleton variant="rounded" width={48} height={48} />
                                        <div className="flex-1">
                                            <Skeleton variant="text" height={20} className="w-32 mb-2" />
                                            <Skeleton variant="text" height={14} className="w-20" />
                                        </div>
                                    </div>
                                    <Skeleton variant="text" height={14} className="w-full mb-2" />
                                    <Skeleton variant="text" height={14} className="w-3/4" />
                                </div>
                            ))}
                        </div>
                    ) : filteredProjects.length === 0 ? (
                        <div className="text-center py-20">
                            <div className="flex items-center justify-center size-20 mx-auto mb-6 rounded-3xl bg-b-surface2">
                                <Icon className="!w-10 !h-10 text-t-tertiary" name="documents" />
                            </div>
                            <h2 className="text-h3 mb-2">No projects yet</h2>
                            <p className="text-body text-t-secondary mb-6">
                                Create your first project to start tracking services
                            </p>
                            <Button isPrimary as="link" href="/projects/new">
                                <Icon className="mr-2 !w-5 !h-5" name="plus" />
                                Create Project
                            </Button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-3 gap-4 max-lg:grid-cols-2 max-md:grid-cols-1">
                            {filteredProjects.map((project) => (
                                <Link
                                    key={project.id}
                                    href={`/projects/${project.id}`}
                                    className="group p-6 rounded-3xl bg-b-surface2 hover:shadow-hover transition-all"
                                >
                                    <div className="flex items-start gap-4 mb-4">
                                        <div className="flex items-center justify-center size-12 rounded-2xl bg-primary1/10 text-2xl">
                                            {project.icon}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="text-body-bold truncate group-hover:text-primary1 transition-colors">
                                                {project.name}
                                            </h3>
                                            <p className="text-small text-t-tertiary capitalize">
                                                {project.type}
                                            </p>
                                        </div>
                                        {project.status === "archived" && (
                                            <span className="px-2 py-1 rounded-full bg-amber-500/10 text-amber-500 text-xs font-medium">
                                                Archived
                                            </span>
                                        )}
                                    </div>
                                    {project.description && (
                                        <p className="text-small text-t-secondary line-clamp-2 mb-4">
                                            {project.description}
                                        </p>
                                    )}
                                    <div className="flex items-center gap-4 text-small text-t-tertiary">
                                        <span className="flex items-center gap-1">
                                            <Icon className="!w-4 !h-4" name="cube" />
                                            {getServiceCount(project)} services
                                        </span>
                                        <span>
                                            Updated {new Date(project.updated_at).toLocaleDateString()}
                                        </span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    );
};

export default ProjectsPage;

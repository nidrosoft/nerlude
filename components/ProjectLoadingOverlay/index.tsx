"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import Icon from "@/components/Icon";

interface ProjectLoadingContextType {
    isLoading: boolean;
    projectName: string | null;
    showLoading: (name: string) => void;
    hideLoading: () => void;
}

const ProjectLoadingContext = createContext<ProjectLoadingContextType | undefined>(undefined);

export function ProjectLoadingProvider({ children }: { children: ReactNode }) {
    const [isLoading, setIsLoading] = useState(false);
    const [projectName, setProjectName] = useState<string | null>(null);

    const showLoading = (name: string) => {
        setProjectName(name);
        setIsLoading(true);
    };

    const hideLoading = () => {
        setIsLoading(false);
        setProjectName(null);
    };

    return (
        <ProjectLoadingContext.Provider value={{ isLoading, projectName, showLoading, hideLoading }}>
            {children}
            <ProjectLoadingOverlay />
        </ProjectLoadingContext.Provider>
    );
}

export function useProjectLoading() {
    const context = useContext(ProjectLoadingContext);
    if (context === undefined) {
        throw new Error('useProjectLoading must be used within a ProjectLoadingProvider');
    }
    return context;
}

const ProjectLoadingOverlay = () => {
    const context = useContext(ProjectLoadingContext);
    
    if (!context?.isLoading) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-b-subtle95 backdrop-blur-sm transition-opacity duration-300">
            <div className="flex flex-col items-center gap-5 p-10 rounded-4xl bg-b-surface2 shadow-hover border border-stroke-subtle">
                {/* Animated Icon Container */}
                <div className="relative">
                    <div className="flex items-center justify-center size-20 rounded-3xl bg-primary1/10">
                        <Icon className="!w-10 !h-10 fill-primary1" name="folder" />
                    </div>
                    {/* Spinning ring */}
                    <div className="absolute inset-0 rounded-3xl border-[3px] border-primary1/20 border-t-primary1 animate-spin" />
                </div>

                {/* Loading Text */}
                <div className="text-center">
                    <p className="text-h5 text-t-primary mb-1">
                        Loading Project
                    </p>
                    {context.projectName && (
                        <p className="text-body text-t-secondary">
                            Fetching {context.projectName} information...
                        </p>
                    )}
                </div>

                {/* Animated dots */}
                <div className="flex gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-primary1 animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2.5 h-2.5 rounded-full bg-primary1 animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2.5 h-2.5 rounded-full bg-primary1 animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
            </div>
        </div>
    );
};

export default ProjectLoadingOverlay;

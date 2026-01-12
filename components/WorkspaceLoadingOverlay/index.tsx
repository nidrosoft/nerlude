"use client";

import { useWorkspaceStore } from "@/stores";
import Icon from "@/components/Icon";

const WorkspaceLoadingOverlay = () => {
    const { isLoading, currentWorkspace } = useWorkspaceStore();

    if (!isLoading) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-b-subtle95 backdrop-blur-sm">
            <div className="flex flex-col items-center gap-4 p-8 rounded-3xl bg-b-surface2 shadow-hover">
                <div className="flex items-center justify-center size-16 rounded-2xl bg-primary1/10 text-primary1">
                    <Icon className="!w-8 !h-8" name="cube" />
                </div>
                <div className="text-center">
                    <p className="text-body font-medium text-t-primary">
                        Switching workspace
                    </p>
                    {currentWorkspace && (
                        <p className="text-small text-t-secondary mt-1">
                            Loading {currentWorkspace.name}...
                        </p>
                    )}
                </div>
                <div className="size-6 rounded-full border-2 border-primary1 border-t-transparent animate-spin" />
            </div>
        </div>
    );
};

export default WorkspaceLoadingOverlay;

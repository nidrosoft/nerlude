"use client";

import { useEffect, useCallback, useState } from "react";
import { useRouter } from "next/navigation";

interface UseUnsavedChangesOptions {
    hasChanges: boolean;
    message?: string;
}

interface UseUnsavedChangesReturn {
    showWarning: boolean;
    pendingPath: string | null;
    confirmNavigation: () => void;
    cancelNavigation: () => void;
    handleNavigation: (path: string) => boolean;
}

export const useUnsavedChanges = ({
    hasChanges,
    message = "You have unsaved changes. Are you sure you want to leave?",
}: UseUnsavedChangesOptions): UseUnsavedChangesReturn => {
    const router = useRouter();
    const [showWarning, setShowWarning] = useState(false);
    const [pendingPath, setPendingPath] = useState<string | null>(null);

    // Handle browser back/forward and tab close
    useEffect(() => {
        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            if (hasChanges) {
                e.preventDefault();
                e.returnValue = message;
                return message;
            }
        };

        window.addEventListener("beforeunload", handleBeforeUnload);
        return () => window.removeEventListener("beforeunload", handleBeforeUnload);
    }, [hasChanges, message]);

    // Handle programmatic navigation
    const handleNavigation = useCallback(
        (path: string): boolean => {
            if (hasChanges) {
                setPendingPath(path);
                setShowWarning(true);
                return false; // Prevent navigation
            }
            return true; // Allow navigation
        },
        [hasChanges]
    );

    const confirmNavigation = useCallback(() => {
        setShowWarning(false);
        if (pendingPath) {
            router.push(pendingPath);
            setPendingPath(null);
        }
    }, [pendingPath, router]);

    const cancelNavigation = useCallback(() => {
        setShowWarning(false);
        setPendingPath(null);
    }, []);

    return {
        showWarning,
        pendingPath,
        confirmNavigation,
        cancelNavigation,
        handleNavigation,
    };
};

export default useUnsavedChanges;

"use client";

import { useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useUIStore } from "@/stores";

interface ShortcutConfig {
    key: string;
    ctrl?: boolean;
    meta?: boolean;
    shift?: boolean;
    alt?: boolean;
    action: () => void;
    description: string;
}

export const useKeyboardShortcuts = () => {
    const router = useRouter();
    const { setCommandPaletteOpen } = useUIStore();

    const shortcuts: ShortcutConfig[] = [
        {
            key: "k",
            meta: true,
            action: () => setCommandPaletteOpen(true),
            description: "Open command palette",
        },
        {
            key: "n",
            meta: true,
            shift: true,
            action: () => router.push("/projects/new"),
            description: "Create new project",
        },
        {
            key: "d",
            meta: true,
            shift: true,
            action: () => router.push("/dashboard"),
            description: "Go to dashboard",
        },
        {
            key: ",",
            meta: true,
            action: () => router.push("/settings/account"),
            description: "Open settings",
        },
        {
            key: "Escape",
            action: () => setCommandPaletteOpen(false),
            description: "Close modals",
        },
    ];

    const handleKeyDown = useCallback(
        (e: KeyboardEvent) => {
            // Don't trigger shortcuts when typing in inputs
            const target = e.target as HTMLElement;
            if (
                target.tagName === "INPUT" ||
                target.tagName === "TEXTAREA" ||
                target.isContentEditable
            ) {
                // Allow Escape to work in inputs
                if (e.key !== "Escape") return;
            }

            for (const shortcut of shortcuts) {
                const metaMatch = shortcut.meta ? e.metaKey || e.ctrlKey : !e.metaKey && !e.ctrlKey;
                const shiftMatch = shortcut.shift ? e.shiftKey : !e.shiftKey;
                const altMatch = shortcut.alt ? e.altKey : !e.altKey;

                if (
                    e.key.toLowerCase() === shortcut.key.toLowerCase() &&
                    metaMatch &&
                    shiftMatch &&
                    altMatch
                ) {
                    e.preventDefault();
                    shortcut.action();
                    return;
                }
            }
        },
        [shortcuts]
    );

    useEffect(() => {
        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, [handleKeyDown]);

    return { shortcuts };
};

export default useKeyboardShortcuts;

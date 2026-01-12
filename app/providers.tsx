"use client";

import { ThemeProvider } from "next-themes";
import { AuthProvider } from "@/lib/auth";
import Toast from "@/components/Toast";
import CommandPalette from "@/components/CommandPalette";
import KeyboardShortcutsProvider from "@/components/KeyboardShortcutsProvider";
import { ProjectLoadingProvider } from "@/components/ProjectLoadingOverlay";

const Providers = ({ children }: { children: React.ReactNode }) => {
    return (
        <ThemeProvider defaultTheme="light" disableTransitionOnChange>
            <AuthProvider>
                <ProjectLoadingProvider>
                    <KeyboardShortcutsProvider>
                        {children}
                        <Toast />
                        <CommandPalette />
                    </KeyboardShortcutsProvider>
                </ProjectLoadingProvider>
            </AuthProvider>
        </ThemeProvider>
    );
};

export default Providers;

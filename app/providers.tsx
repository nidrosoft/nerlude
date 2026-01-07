"use client";

import { ThemeProvider } from "next-themes";
import Toast from "@/components/Toast";
import CommandPalette from "@/components/CommandPalette";
import KeyboardShortcutsProvider from "@/components/KeyboardShortcutsProvider";

const Providers = ({ children }: { children: React.ReactNode }) => {
    return (
        <ThemeProvider defaultTheme="light" disableTransitionOnChange>
            <KeyboardShortcutsProvider>
                {children}
                <Toast />
                <CommandPalette />
            </KeyboardShortcutsProvider>
        </ThemeProvider>
    );
};

export default Providers;

"use client";

import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";

interface Props {
    children: React.ReactNode;
}

const KeyboardShortcutsProvider = ({ children }: Props) => {
    useKeyboardShortcuts();
    return <>{children}</>;
};

export default KeyboardShortcutsProvider;

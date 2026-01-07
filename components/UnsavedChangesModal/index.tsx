"use client";

import Button from "@/components/Button";

interface Props {
    isOpen: boolean;
    onConfirm: () => void;
    onCancel: () => void;
    title?: string;
    message?: string;
}

const UnsavedChangesModal = ({
    isOpen,
    onConfirm,
    onCancel,
    title = "Unsaved Changes",
    message = "You have unsaved changes. Are you sure you want to leave? Your changes will be lost.",
}: Props) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div
                className="absolute inset-0 bg-[#282828]/90"
                onClick={onCancel}
            />
            <div className="relative z-10 w-full max-w-md mx-4 p-8 rounded-4xl bg-b-surface1">
                <h3 className="text-h4 mb-2">{title}</h3>
                <p className="text-small text-t-secondary mb-6">{message}</p>
                <div className="flex gap-3">
                    <Button className="flex-1" isStroke onClick={onCancel}>
                        Keep Editing
                    </Button>
                    <Button className="flex-1" isPrimary onClick={onConfirm}>
                        Leave Anyway
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default UnsavedChangesModal;

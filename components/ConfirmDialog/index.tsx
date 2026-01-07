"use client";

import { ReactNode } from "react";
import Modal from "@/components/Modal";
import Button from "@/components/Button";
import { cn } from "@/lib/utils";
import { Warning2, Trash, CloseCircle } from "iconsax-react";

interface ConfirmDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    description?: string;
    confirmLabel?: string;
    cancelLabel?: string;
    variant?: "danger" | "warning" | "default";
    isLoading?: boolean;
    icon?: ReactNode;
}

const ConfirmDialog = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    description,
    confirmLabel = "Confirm",
    cancelLabel = "Cancel",
    variant = "default",
    isLoading = false,
    icon,
}: ConfirmDialogProps) => {
    const variantStyles = {
        danger: {
            iconBg: "bg-red-500/10",
            iconColor: "text-red-500",
            defaultIcon: <Trash size={24} variant="Bold" />,
            buttonClass: "bg-red-500 hover:bg-red-600 text-white",
        },
        warning: {
            iconBg: "bg-amber-500/10",
            iconColor: "text-amber-500",
            defaultIcon: <Warning2 size={24} variant="Bold" />,
            buttonClass: "bg-amber-500 hover:bg-amber-600 text-white",
        },
        default: {
            iconBg: "bg-b-surface2",
            iconColor: "text-t-primary",
            defaultIcon: <CloseCircle size={24} />,
            buttonClass: "",
        },
    };

    const styles = variantStyles[variant];

    return (
        <Modal open={isOpen} onClose={onClose}>
            <div className="p-6 max-w-md">
                <div className="flex flex-col items-center text-center">
                    <div className={cn("w-14 h-14 rounded-full flex items-center justify-center mb-4", styles.iconBg, styles.iconColor)}>
                        {icon || styles.defaultIcon}
                    </div>
                    <h3 className="text-h4 text-t-primary mb-2">{title}</h3>
                    {description && (
                        <p className="text-body text-t-secondary mb-6">{description}</p>
                    )}
                    <div className="flex items-center gap-3 w-full">
                        <Button
                            className="flex-1"
                            isStroke
                            onClick={onClose}
                            disabled={isLoading}
                        >
                            {cancelLabel}
                        </Button>
                        <Button
                            className={cn("flex-1", variant !== "default" && styles.buttonClass)}
                            isPrimary={variant === "default"}
                            onClick={onConfirm}
                            disabled={isLoading}
                        >
                            {isLoading ? "Loading..." : confirmLabel}
                        </Button>
                    </div>
                </div>
            </div>
        </Modal>
    );
};

// Pre-built confirm dialogs for common use cases
export const DeleteConfirmDialog = ({
    isOpen,
    onClose,
    onConfirm,
    itemName,
    itemType = "item",
    isLoading,
}: {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    itemName: string;
    itemType?: string;
    isLoading?: boolean;
}) => (
    <ConfirmDialog
        isOpen={isOpen}
        onClose={onClose}
        onConfirm={onConfirm}
        title={`Delete ${itemType}?`}
        description={`Are you sure you want to delete "${itemName}"? This action cannot be undone.`}
        confirmLabel="Delete"
        variant="danger"
        isLoading={isLoading}
    />
);

export const DiscardChangesDialog = ({
    isOpen,
    onClose,
    onConfirm,
}: {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
}) => (
    <ConfirmDialog
        isOpen={isOpen}
        onClose={onClose}
        onConfirm={onConfirm}
        title="Discard changes?"
        description="You have unsaved changes. Are you sure you want to leave? Your changes will be lost."
        confirmLabel="Discard"
        cancelLabel="Keep Editing"
        variant="warning"
    />
);

export const LogoutConfirmDialog = ({
    isOpen,
    onClose,
    onConfirm,
}: {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
}) => (
    <ConfirmDialog
        isOpen={isOpen}
        onClose={onClose}
        onConfirm={onConfirm}
        title="Sign out?"
        description="Are you sure you want to sign out of your account?"
        confirmLabel="Sign Out"
        variant="default"
    />
);

export default ConfirmDialog;

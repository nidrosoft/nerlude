"use client";

import { useEffect } from "react";
import { useUIStore } from "@/stores";
import { cn } from "@/lib/utils";
import { CloseCircle, TickCircle, Warning2, InfoCircle } from "iconsax-react";

const Toast = () => {
    const { toasts, removeToast } = useUIStore();

    if (toasts.length === 0) return null;

    return (
        <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm">
            {toasts.map((toast) => (
                <ToastItem
                    key={toast.id}
                    id={toast.id}
                    type={toast.type}
                    title={toast.title}
                    message={toast.message}
                    onClose={() => removeToast(toast.id)}
                />
            ))}
        </div>
    );
};

interface ToastItemProps {
    id: string;
    type: "success" | "error" | "warning" | "info";
    title: string;
    message?: string;
    onClose: () => void;
}

const ToastItem = ({ type, title, message, onClose }: ToastItemProps) => {
    const typeStyles = {
        success: {
            bg: "bg-green-500/10 border-green-500/20",
            icon: <TickCircle size={20} className="text-green-500" variant="Bold" />,
            iconBg: "bg-green-500/20",
        },
        error: {
            bg: "bg-red-500/10 border-red-500/20",
            icon: <CloseCircle size={20} className="text-red-500" variant="Bold" />,
            iconBg: "bg-red-500/20",
        },
        warning: {
            bg: "bg-amber-500/10 border-amber-500/20",
            icon: <Warning2 size={20} className="text-amber-500" variant="Bold" />,
            iconBg: "bg-amber-500/20",
        },
        info: {
            bg: "bg-blue-500/10 border-blue-500/20",
            icon: <InfoCircle size={20} className="text-blue-500" variant="Bold" />,
            iconBg: "bg-blue-500/20",
        },
    };

    const styles = typeStyles[type];

    return (
        <div
            className={cn(
                "flex items-start gap-3 p-4 rounded-2xl border backdrop-blur-sm",
                "animate-in slide-in-from-right-full duration-300",
                styles.bg
            )}
        >
            <div className={cn("flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center", styles.iconBg)}>
                {styles.icon}
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-body-bold text-t-primary">{title}</p>
                {message && <p className="text-small text-t-secondary mt-0.5">{message}</p>}
            </div>
            <button
                onClick={onClose}
                className="flex-shrink-0 p-1 rounded-lg hover:bg-b-surface2 transition-colors"
            >
                <CloseCircle size={16} className="text-t-tertiary" />
            </button>
        </div>
    );
};

// Hook for easy toast usage
export const useToast = () => {
    const { addToast } = useUIStore();

    return {
        success: (title: string, message?: string) => addToast({ type: "success", title, message }),
        error: (title: string, message?: string) => addToast({ type: "error", title, message }),
        warning: (title: string, message?: string) => addToast({ type: "warning", title, message }),
        info: (title: string, message?: string) => addToast({ type: "info", title, message }),
    };
};

export default Toast;

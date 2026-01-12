"use client";

import { Fragment } from "react";
import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from "@headlessui/react";
import Icon from "@/components/Icon";
import Button from "@/components/Button";

type ConfirmModalProps = {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    variant?: "danger" | "warning" | "info";
    isLoading?: boolean;
};

const variantStyles = {
    danger: {
        icon: "trash",
        iconBg: "bg-red-500/10",
        iconColor: "fill-red-500",
        buttonClass: "bg-red-500 hover:bg-red-600 text-white",
    },
    warning: {
        icon: "documents",
        iconBg: "bg-amber-500/10",
        iconColor: "fill-amber-500",
        buttonClass: "bg-amber-500 hover:bg-amber-600 text-white",
    },
    info: {
        icon: "generation",
        iconBg: "bg-primary1/10",
        iconColor: "fill-primary1",
        buttonClass: "bg-primary1 hover:bg-primary1/90 text-white",
    },
};

const ConfirmModal = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = "Confirm",
    cancelText = "Cancel",
    variant = "warning",
    isLoading = false,
}: ConfirmModalProps) => {
    const styles = variantStyles[variant];

    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={onClose}>
                <TransitionChild
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
                </TransitionChild>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4">
                        <TransitionChild
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <DialogPanel className="w-full max-w-md transform overflow-hidden rounded-3xl bg-b-surface2 border border-stroke-subtle p-6 shadow-xl transition-all">
                                <div className="flex flex-col items-center text-center">
                                    <div className={`flex items-center justify-center size-14 rounded-2xl ${styles.iconBg} ${styles.iconColor} mb-4`}>
                                        <Icon className="!w-7 !h-7" name={styles.icon} />
                                    </div>
                                    
                                    <DialogTitle as="h3" className="text-h5 text-t-primary mb-2">
                                        {title}
                                    </DialogTitle>
                                    
                                    <p className="text-body text-t-secondary mb-6">
                                        {message}
                                    </p>
                                    
                                    <div className="flex gap-3 w-full">
                                        <Button
                                            className="flex-1"
                                            isSecondary
                                            onClick={onClose}
                                            disabled={isLoading}
                                        >
                                            {cancelText}
                                        </Button>
                                        <button
                                            className={`flex-1 px-4 py-3 rounded-full font-medium transition-colors ${styles.buttonClass} disabled:opacity-50`}
                                            onClick={onConfirm}
                                            disabled={isLoading}
                                        >
                                            {isLoading ? "Processing..." : confirmText}
                                        </button>
                                    </div>
                                </div>
                            </DialogPanel>
                        </TransitionChild>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
};

export default ConfirmModal;

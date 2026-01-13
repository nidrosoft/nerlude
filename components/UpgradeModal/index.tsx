"use client";

import { useRouter } from "next/navigation";
import Modal from "@/components/Modal";
import Button from "@/components/Button";
import Icon from "@/components/Icon";

interface UpgradeModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    message: string;
    suggestedPlan?: string;
    limitType?: "projects" | "team" | "services" | "credentials" | "storage" | "integrations" | "feature";
}

const UpgradeModal = ({
    isOpen,
    onClose,
    title,
    message,
    suggestedPlan = "Pro",
    limitType,
}: UpgradeModalProps) => {
    const router = useRouter();

    const handleUpgrade = () => {
        onClose();
        router.push("/settings/plan");
    };

    const getIcon = () => {
        switch (limitType) {
            case "projects":
                return "folder";
            case "team":
                return "people";
            case "services":
                return "element-3";
            case "credentials":
                return "key";
            case "storage":
                return "cloud";
            case "integrations":
                return "link";
            default:
                return "star";
        }
    };

    return (
        <Modal
            open={isOpen}
            onClose={onClose}
        >
            <div className="flex flex-col items-center text-center py-4">
                <div className="flex items-center justify-center size-16 rounded-full bg-amber-500/10 mb-4">
                    <Icon className="!w-8 !h-8 fill-amber-500" name={getIcon()} />
                </div>
                
                <h2 className="text-h4 mb-2">{title}</h2>
                
                <p className="text-t-secondary mb-6 max-w-sm">
                    {message}
                </p>

                <div className="p-4 rounded-2xl bg-b-surface2 mb-6 w-full">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-small font-medium">Upgrade to {suggestedPlan}</p>
                            <p className="text-xs text-t-tertiary">
                                {suggestedPlan === "Pro" 
                                    ? "Starting at $19.99/month" 
                                    : "Starting at $39.99/month"}
                            </p>
                        </div>
                        <Icon className="!w-5 !h-5 fill-primary1" name="arrow-right" />
                    </div>
                </div>

                <div className="flex gap-3 w-full">
                    <Button
                        className="flex-1"
                        isStroke
                        onClick={onClose}
                    >
                        Maybe Later
                    </Button>
                    <Button
                        className="flex-1"
                        isPrimary
                        onClick={handleUpgrade}
                    >
                        Upgrade Now
                    </Button>
                </div>
            </div>
        </Modal>
    );
};

export default UpgradeModal;

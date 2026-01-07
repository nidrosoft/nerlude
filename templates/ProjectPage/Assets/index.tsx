"use client";

import { useState } from "react";
import Icon from "@/components/Icon";
import Button from "@/components/Button";
import AssetUploadModal from "./AssetUploadModal";

type AssetCategory = "logos" | "screenshots" | "documents";

type Props = {
    projectId: string;
    showUploadModal?: boolean;
    onCloseUploadModal?: () => void;
};

// Color styles for each asset category (soft bg + strong icon color)
const categoryStyles: Record<string, { bg: string; border: string; icon: string }> = {
    Logos: { bg: "bg-purple-500/10", border: "border-purple-500/20", icon: "fill-purple-500" },
    Screenshots: { bg: "bg-cyan-500/10", border: "border-cyan-500/20", icon: "fill-cyan-500" },
    Documents: { bg: "bg-amber-500/10", border: "border-amber-500/20", icon: "fill-amber-500" },
};

const Assets = ({ projectId, showUploadModal = false, onCloseUploadModal }: Props) => {
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
    const [uploadCategory, setUploadCategory] = useState<AssetCategory>("logos");

    // Combine internal and external modal state
    const modalOpen = showUploadModal || isUploadModalOpen;

    const handleOpenUploadModal = (category?: AssetCategory) => {
        if (category) setUploadCategory(category);
        setIsUploadModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsUploadModalOpen(false);
        onCloseUploadModal?.();
    };

    const handleUpload = (asset: any) => {
        console.log("Uploaded asset:", asset);
        // TODO: Handle actual upload logic
    };

    const assetCategories = [
        {
            title: "Logos",
            icon: "bezier-curves",
            items: [
                { name: "Logo Icon", type: "PNG", size: "24 KB" },
                { name: "Logo Full", type: "SVG", size: "12 KB" },
                { name: "Logo Dark Mode", type: "SVG", size: "12 KB" },
            ],
        },
        {
            title: "Screenshots",
            icon: "camera",
            items: [
                { name: "App Store Screenshot 1", type: "PNG", size: "245 KB" },
                { name: "App Store Screenshot 2", type: "PNG", size: "312 KB" },
            ],
        },
        {
            title: "Documents",
            icon: "documents",
            items: [
                { name: "Privacy Policy", type: "PDF", size: "156 KB" },
                { name: "Terms of Service", type: "PDF", size: "89 KB" },
            ],
        },
    ];

    return (
        <div>
            <div className="space-y-6">
                {assetCategories.map((category) => (
                    <div key={category.title}>
                        <div className="flex items-center mb-3 fill-t-secondary">
                            <Icon className="mr-2 !w-5 !h-5" name={category.icon} />
                            <h3 className="text-body-bold">{category.title}</h3>
                        </div>
                        <div className="grid grid-cols-3 gap-3 max-lg:grid-cols-2 max-md:grid-cols-1">
                            {category.items.map((item, index) => {
                                const styles = categoryStyles[category.title] || { bg: "bg-gray-500/10", border: "border-gray-500/20", icon: "fill-gray-500" };
                                return (
                                    <div
                                        key={index}
                                        className="p-4 rounded-4xl bg-b-surface2 hover:shadow-hover transition-shadow cursor-pointer"
                                    >
                                        <div className={`flex items-center justify-center h-24 mb-3 rounded-2xl border-[1.5px] ${styles.bg} ${styles.border}`}>
                                            <Icon className={`!w-8 !h-8 ${styles.icon}`} name="documents" />
                                        </div>
                                        <div className="text-small font-medium truncate">{item.name}</div>
                                        <div className="flex items-center justify-between text-xs text-t-tertiary">
                                            <span>{item.type}</span>
                                            <span>{item.size}</span>
                                        </div>
                                    </div>
                                );
                            })}
                            <div 
                                onClick={() => handleOpenUploadModal(category.title.toLowerCase() as AssetCategory)}
                                className="flex flex-col items-center justify-center p-4 rounded-4xl border-2 border-dashed border-stroke-subtle hover:border-primary1 hover:bg-primary1/5 transition-all cursor-pointer"
                            >
                                <Icon className="!w-6 !h-6 mb-2 fill-t-tertiary" name="plus" />
                                <span className="text-small text-t-secondary">Add {category.title.toLowerCase()}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Upload Modal */}
            <AssetUploadModal
                isOpen={modalOpen}
                onClose={handleCloseModal}
                onUpload={handleUpload}
                defaultCategory={uploadCategory}
            />
        </div>
    );
};

export default Assets;

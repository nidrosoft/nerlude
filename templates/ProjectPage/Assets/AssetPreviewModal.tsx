"use client";

import Modal from "@/components/Modal";
import Button from "@/components/Button";
import Icon from "@/components/Icon";
import AssetTypeIcon, { getAssetType, getAssetTypeLabel } from "./AssetTypeIcon";

interface Asset {
    id: string;
    name: string;
    file_path: string;
    file_type: string;
    file_size: number;
    folder_id: string | null;
    metadata?: { url?: string };
    created_at?: string;
}

interface AssetPreviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    asset: Asset | null;
    onDelete: (assetId: string, assetName: string) => void;
}

const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const formatDate = (dateString?: string): string => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
};

const AssetPreviewModal = ({ isOpen, onClose, asset, onDelete }: AssetPreviewModalProps) => {
    if (!asset) return null;

    const assetType = getAssetType(asset.file_type);
    const typeLabel = getAssetTypeLabel(assetType);
    const url = asset.metadata?.url;

    const handleDownload = async () => {
        if (url) {
            try {
                // Fetch the file as a blob to force download
                const response = await fetch(url);
                const blob = await response.blob();
                const blobUrl = window.URL.createObjectURL(blob);
                
                const link = document.createElement('a');
                link.href = blobUrl;
                link.download = asset.name;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                
                // Clean up the blob URL
                window.URL.revokeObjectURL(blobUrl);
            } catch (error) {
                console.error('Download failed:', error);
                // Fallback: open in new tab
                window.open(url, '_blank');
            }
        }
    };

    const handleDelete = () => {
        onDelete(asset.id, asset.name);
        onClose();
    };

    const renderPreview = () => {
        if (!url) {
            return (
                <div className="flex items-center justify-center h-64 bg-b-surface1 rounded-2xl">
                    <div className="text-center">
                        <Icon className="!w-12 !h-12 fill-t-tertiary mx-auto mb-2" name="document" />
                        <p className="text-small text-t-tertiary">Preview not available</p>
                    </div>
                </div>
            );
        }

        if (assetType === "image") {
            return (
                <div className="flex items-center justify-center bg-b-surface1 rounded-2xl overflow-hidden">
                    <img 
                        src={url} 
                        alt={asset.name}
                        className="max-h-96 max-w-full object-contain"
                    />
                </div>
            );
        }

        if (assetType === "video") {
            return (
                <div className="bg-b-surface1 rounded-2xl overflow-hidden">
                    <video 
                        src={url} 
                        controls
                        className="w-full max-h-96"
                    >
                        Your browser does not support the video tag.
                    </video>
                </div>
            );
        }

        if (assetType === "pdf") {
            return (
                <div className="flex flex-col items-center justify-center h-64 bg-b-surface1 rounded-2xl">
                    <Icon className="!w-16 !h-16 fill-red-500 mb-3" name="document-text" />
                    <p className="text-body font-medium text-t-primary mb-1">PDF Document</p>
                    <p className="text-small text-t-tertiary mb-4">{asset.name}</p>
                    <Button isSecondary onClick={handleDownload}>
                        <Icon className="mr-2 !w-4 !h-4" name="eye" />
                        Open PDF
                    </Button>
                </div>
            );
        }

        return (
            <div className="flex flex-col items-center justify-center h-64 bg-b-surface1 rounded-2xl">
                <AssetTypeIcon fileType={asset.file_type} size="lg" />
                <p className="text-body font-medium text-t-primary mt-4 mb-1">{typeLabel}</p>
                <p className="text-small text-t-tertiary">{asset.name}</p>
            </div>
        );
    };

    return (
        <Modal classWrapper="!max-w-2xl !p-6" open={isOpen} onClose={onClose}>
            <div>
                {/* Header */}
                <div className="flex items-start justify-between mb-5">
                    <div className="flex items-center gap-3">
                        <AssetTypeIcon fileType={asset.file_type} size="lg" />
                        <div>
                            <h2 className="text-h4 text-t-primary truncate max-w-md">{asset.name}</h2>
                            <p className="text-small text-t-tertiary">{typeLabel} • {formatFileSize(asset.file_size)}</p>
                        </div>
                    </div>
                </div>

                {/* Preview */}
                <div className="mb-5">
                    {renderPreview()}
                </div>

                {/* Details */}
                <div className="p-4 rounded-2xl bg-b-surface1 mb-5">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-xs text-t-tertiary mb-1">File Type</p>
                            <p className="text-small text-t-primary">{asset.file_type || "Unknown"}</p>
                        </div>
                        <div>
                            <p className="text-xs text-t-tertiary mb-1">File Size</p>
                            <p className="text-small text-t-primary">{formatFileSize(asset.file_size)}</p>
                        </div>
                        <div className="col-span-2">
                            <p className="text-xs text-t-tertiary mb-1">Uploaded</p>
                            <p className="text-small text-t-primary">{formatDate(asset.created_at)}</p>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                    <Button className="flex-1" isStroke onClick={onClose}>
                        Close
                    </Button>
                    <Button isSecondary onClick={handleDownload} disabled={!url}>
                        <Icon className="mr-2 !w-4 !h-4" name="download" />
                        Download
                    </Button>
                    <Button 
                        className="!bg-red-500/10 !text-red-500 !border-transparent hover:!bg-red-500/20"
                        onClick={handleDelete}
                    >
                        <Icon className="mr-2 !w-4 !h-4 !fill-red-500" name="trash" />
                        Delete
                    </Button>
                </div>
            </div>
        </Modal>
    );
};

export default AssetPreviewModal;

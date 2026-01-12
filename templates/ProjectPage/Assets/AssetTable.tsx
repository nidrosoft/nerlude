"use client";

import Icon from "@/components/Icon";
import Button from "@/components/Button";
import { getAssetType, getAssetTypeLabel, AssetFileType } from "./AssetTypeIcon";
import { cn } from "@/lib/utils";

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

interface AssetTableProps {
    assets: Asset[];
    onDelete: (assetId: string, assetName: string) => void;
    onPreview?: (asset: Asset) => void;
    className?: string;
}

const formatFileSize = (bytes: number): string => {
    if (!bytes) return "-";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const formatDate = (dateString?: string): string => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });
};

const typeColors: Record<AssetFileType, { bg: string; text: string }> = {
    image: { bg: "bg-blue-500/10", text: "text-blue-600" },
    video: { bg: "bg-purple-500/10", text: "text-purple-600" },
    pdf: { bg: "bg-red-500/10", text: "text-red-600" },
    document: { bg: "bg-blue-500/10", text: "text-blue-600" },
    spreadsheet: { bg: "bg-green-500/10", text: "text-green-600" },
    archive: { bg: "bg-amber-500/10", text: "text-amber-600" },
    code: { bg: "bg-slate-500/10", text: "text-slate-600" },
    other: { bg: "bg-slate-500/10", text: "text-slate-600" },
};

const AssetThumbnail = ({ asset }: { asset: Asset }) => {
    const assetType = getAssetType(asset.file_type);
    const url = asset.metadata?.url;
    
    if (assetType === "image" && url) {
        return (
            <div className="size-10 rounded-lg overflow-hidden bg-b-surface2 flex-shrink-0">
                <img 
                    src={url} 
                    alt={asset.name} 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        e.currentTarget.parentElement!.innerHTML = '<div class="w-full h-full flex items-center justify-center"><svg class="w-5 h-5 text-t-tertiary" viewBox="0 0 24 24" fill="currentColor"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14zm-5-7l-3 3.72L9 13l-3 4h12l-4-5z"/></svg></div>';
                    }}
                />
            </div>
        );
    }
    
    const iconMap: Record<AssetFileType, { icon: string; color: string }> = {
        image: { icon: "image", color: "text-blue-500" },
        video: { icon: "video", color: "text-purple-500" },
        pdf: { icon: "document-text", color: "text-red-500" },
        document: { icon: "document-text", color: "text-blue-500" },
        spreadsheet: { icon: "document-text", color: "text-green-500" },
        archive: { icon: "archive", color: "text-amber-500" },
        code: { icon: "code", color: "text-slate-500" },
        other: { icon: "document", color: "text-slate-500" },
    };
    
    const { icon, color } = iconMap[assetType];
    
    return (
        <div className={cn("size-10 rounded-lg bg-b-surface2 flex items-center justify-center flex-shrink-0")}>
            <Icon className={cn("!w-5 !h-5", color.replace("text-", "fill-"))} name={icon} />
        </div>
    );
};

const TypeBadge = ({ type }: { type: AssetFileType }) => {
    const label = getAssetTypeLabel(type);
    const colors = typeColors[type];
    
    return (
        <span className={cn("px-2 py-0.5 rounded-md text-xs font-medium", colors.bg, colors.text)}>
            {label}
        </span>
    );
};

const AssetTable = ({ assets, onDelete, onPreview, className }: AssetTableProps) => {
    const handleDownload = async (e: React.MouseEvent, asset: Asset) => {
        e.stopPropagation();
        const url = asset.metadata?.url;
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

    if (assets.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-16 px-4 rounded-2xl border border-stroke-subtle bg-b-surface1">
                <div className="flex items-center justify-center size-20 rounded-2xl bg-primary1/10 mb-4">
                    <Icon className="!w-10 !h-10 fill-primary1" name="folder-open" />
                </div>
                <p className="text-body font-medium text-t-primary mb-1">No assets in this folder</p>
                <p className="text-small text-t-tertiary">Upload files to get started</p>
            </div>
        );
    }

    return (
        <div className={cn("overflow-hidden rounded-2xl border border-stroke-subtle bg-b-surface1", className)}>
            <table className="w-full">
                <thead>
                    <tr className="border-b border-stroke-subtle">
                        <th className="text-left px-4 py-3 text-small font-medium text-t-tertiary">Name</th>
                        <th className="text-left px-4 py-3 text-small font-medium text-t-tertiary w-28">Type</th>
                        <th className="text-left px-4 py-3 text-small font-medium text-t-tertiary w-24">Size</th>
                        <th className="text-left px-4 py-3 text-small font-medium text-t-tertiary w-32">Date</th>
                        <th className="text-right px-4 py-3 text-small font-medium text-t-tertiary w-28">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {assets.map((asset, index) => {
                        const assetType = getAssetType(asset.file_type);
                        
                        return (
                            <tr 
                                key={asset.id} 
                                onClick={() => onPreview?.(asset)}
                                className={cn(
                                    "group hover:bg-b-highlight transition-colors cursor-pointer",
                                    index !== assets.length - 1 && "border-b border-stroke-subtle"
                                )}
                            >
                                <td className="px-4 py-3">
                                    <div className="flex items-center gap-3">
                                        <AssetThumbnail asset={asset} />
                                        <span 
                                            className="text-body font-medium text-t-primary truncate max-w-xs"
                                            title={asset.name}
                                        >
                                            {asset.name}
                                        </span>
                                    </div>
                                </td>
                                <td className="px-4 py-3">
                                    <TypeBadge type={assetType} />
                                </td>
                                <td className="px-4 py-3">
                                    <span className="text-small text-t-secondary">{formatFileSize(asset.file_size)}</span>
                                </td>
                                <td className="px-4 py-3">
                                    <span className="text-small text-t-secondary">{formatDate(asset.created_at)}</span>
                                </td>
                                <td className="px-4 py-3">
                                    <div className="flex items-center justify-end gap-2">
                                        <button
                                            onClick={(e) => handleDownload(e, asset)}
                                            className="size-8 flex items-center justify-center rounded-full border border-transparent hover:border-stroke-subtle hover:bg-b-surface2 fill-t-tertiary hover:fill-t-primary transition-all"
                                            title="Download"
                                        >
                                            <Icon className="!w-4 !h-4" name="import" />
                                        </button>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onDelete(asset.id, asset.name);
                                            }}
                                            className="size-8 flex items-center justify-center rounded-full border border-transparent hover:border-red-500/30 hover:bg-red-500/10 fill-t-tertiary hover:fill-red-500 transition-all"
                                            title="Delete"
                                        >
                                            <Icon className="!w-4 !h-4" name="trash" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};

export default AssetTable;

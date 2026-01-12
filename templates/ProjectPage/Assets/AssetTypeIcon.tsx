"use client";

import Icon from "@/components/Icon";
import { cn } from "@/lib/utils";

export type AssetFileType = "image" | "video" | "pdf" | "document" | "spreadsheet" | "archive" | "code" | "other";

interface AssetTypeIconProps {
    fileType: string;
    size?: "sm" | "md" | "lg";
    showBadge?: boolean;
    className?: string;
}

export const getAssetType = (mimeType: string): AssetFileType => {
    if (!mimeType) return "other";
    
    if (mimeType.startsWith("image/")) return "image";
    if (mimeType.startsWith("video/")) return "video";
    if (mimeType.includes("pdf")) return "pdf";
    if (mimeType.includes("word") || mimeType.includes("document")) return "document";
    if (mimeType.includes("sheet") || mimeType.includes("excel") || mimeType.includes("csv")) return "spreadsheet";
    if (mimeType.includes("zip") || mimeType.includes("rar") || mimeType.includes("tar") || mimeType.includes("gz")) return "archive";
    if (mimeType.includes("javascript") || mimeType.includes("json") || mimeType.includes("html") || mimeType.includes("css") || mimeType.includes("text/")) return "code";
    
    return "other";
};

export const getAssetTypeLabel = (type: AssetFileType): string => {
    const labels: Record<AssetFileType, string> = {
        image: "Image",
        video: "Video",
        pdf: "PDF",
        document: "Document",
        spreadsheet: "Spreadsheet",
        archive: "Archive",
        code: "Code",
        other: "File",
    };
    return labels[type];
};

const typeConfig: Record<AssetFileType, { icon: string; bg: string; text: string; fill: string }> = {
    image: { icon: "image", bg: "bg-blue-500/10", text: "text-blue-600", fill: "fill-blue-500" },
    video: { icon: "video", bg: "bg-purple-500/10", text: "text-purple-600", fill: "fill-purple-500" },
    pdf: { icon: "document-text", bg: "bg-red-500/10", text: "text-red-600", fill: "fill-red-500" },
    document: { icon: "document-text", bg: "bg-blue-500/10", text: "text-blue-600", fill: "fill-blue-500" },
    spreadsheet: { icon: "document-text", bg: "bg-green-500/10", text: "text-green-600", fill: "fill-green-500" },
    archive: { icon: "archive", bg: "bg-amber-500/10", text: "text-amber-600", fill: "fill-amber-500" },
    code: { icon: "code", bg: "bg-slate-500/10", text: "text-slate-600", fill: "fill-slate-500" },
    other: { icon: "document", bg: "bg-slate-500/10", text: "text-slate-600", fill: "fill-slate-500" },
};

const sizeClasses = {
    sm: { container: "size-8", icon: "!w-4 !h-4" },
    md: { container: "size-10", icon: "!w-5 !h-5" },
    lg: { container: "size-12", icon: "!w-6 !h-6" },
};

const AssetTypeIcon = ({ fileType, size = "md", showBadge = false, className }: AssetTypeIconProps) => {
    const type = getAssetType(fileType);
    const config = typeConfig[type];
    const sizeClass = sizeClasses[size];

    return (
        <div className={cn("flex items-center gap-2", className)}>
            <div className={cn(
                "flex items-center justify-center rounded-xl",
                config.bg,
                sizeClass.container
            )}>
                <Icon className={cn(sizeClass.icon, config.fill)} name={config.icon} />
            </div>
            {showBadge && (
                <span className={cn(
                    "px-2 py-0.5 rounded-full text-xs font-medium",
                    config.bg,
                    config.text
                )}>
                    {getAssetTypeLabel(type)}
                </span>
            )}
        </div>
    );
};

export default AssetTypeIcon;

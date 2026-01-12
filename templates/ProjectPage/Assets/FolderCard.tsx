"use client";

import Icon from "@/components/Icon";

interface Folder {
    id: string;
    name: string;
    description: string | null;
    color: string;
    created_at: string;
}

interface FolderCardProps {
    folder: Folder;
    assetCount: number;
    onOpen: (folderId: string) => void;
    onUpload: (folderId: string) => void;
    onDelete: (folderId: string, folderName: string) => void;
}

const folderColors: Record<string, { main: string; dark: string; shadow: string }> = {
    slate: { main: "#94a3b8", dark: "#64748b", shadow: "rgba(100, 116, 139, 0.25)" },
    red: { main: "#f87171", dark: "#ef4444", shadow: "rgba(239, 68, 68, 0.25)" },
    orange: { main: "#fb923c", dark: "#f97316", shadow: "rgba(249, 115, 22, 0.25)" },
    amber: { main: "#fbbf24", dark: "#f59e0b", shadow: "rgba(245, 158, 11, 0.25)" },
    green: { main: "#4ade80", dark: "#22c55e", shadow: "rgba(34, 197, 94, 0.25)" },
    teal: { main: "#2dd4bf", dark: "#14b8a6", shadow: "rgba(20, 184, 166, 0.25)" },
    blue: { main: "#60a5fa", dark: "#3b82f6", shadow: "rgba(59, 130, 246, 0.25)" },
    indigo: { main: "#818cf8", dark: "#6366f1", shadow: "rgba(99, 102, 241, 0.25)" },
    purple: { main: "#a78bfa", dark: "#8b5cf6", shadow: "rgba(139, 92, 246, 0.25)" },
    pink: { main: "#f472b6", dark: "#ec4899", shadow: "rgba(236, 72, 153, 0.25)" },
};

const FolderCard = ({ folder, assetCount, onOpen, onUpload, onDelete }: FolderCardProps) => {
    const colors = folderColors[folder.color] || folderColors.blue;
    
    return (
        <div
            onClick={() => onOpen(folder.id)}
            className="group relative cursor-pointer transition-all duration-200 hover:translate-y-[-2px]"
            style={{ filter: `drop-shadow(0 4px 12px ${colors.shadow})` }}
        >
            {/* Wider folder SVG with integrated text */}
            <svg 
                viewBox="0 0 120 80" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
                className="w-full h-auto"
            >
                {/* Tab/back part */}
                <path 
                    d="M8 12C8 7.58172 11.5817 4 16 4H36C38.1217 4 40.1566 4.84285 41.6569 6.34315L48 12.5H8V12Z" 
                    fill={colors.dark}
                />
                {/* Main folder body */}
                <rect x="4" y="14" width="112" height="62" rx="8" fill={colors.main} />
                {/* Text directly on folder */}
                <text 
                    x="12" 
                    y="52" 
                    fill="white" 
                    fontSize="11" 
                    fontWeight="600" 
                    fontFamily="system-ui, -apple-system, sans-serif"
                >
                    {folder.name.length > 14 ? folder.name.slice(0, 14) + '...' : folder.name}
                </text>
                <text 
                    x="12" 
                    y="66" 
                    fill="rgba(255,255,255,0.7)" 
                    fontSize="9" 
                    fontFamily="system-ui, -apple-system, sans-serif"
                >
                    {assetCount} {assetCount === 1 ? "asset" : "assets"}
                </text>
            </svg>
            
            {/* Action buttons - appear on hover at top right */}
            <div className="absolute top-[22%] right-[6%] flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onUpload(folder.id);
                    }}
                    className="size-6 flex items-center justify-center rounded-full bg-white/90 shadow-sm hover:bg-white transition-all"
                    title="Upload to folder"
                >
                    <Icon className="!w-3 !h-3 fill-gray-600" name="add" />
                </button>
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onDelete(folder.id, folder.name);
                    }}
                    className="size-6 flex items-center justify-center rounded-full bg-white/90 shadow-sm hover:bg-red-50 transition-all"
                    title="Delete folder"
                >
                    <Icon className="!w-3 !h-3 fill-gray-600 hover:fill-red-500" name="trash" />
                </button>
            </div>
        </div>
    );
};

export default FolderCard;

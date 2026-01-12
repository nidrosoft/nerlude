"use client";

import { useState, useEffect, useCallback } from "react";
import Icon from "@/components/Icon";
import Button from "@/components/Button";
import Skeleton from "@/components/Skeleton";
import { useToast } from "@/components/Toast";
import { cn } from "@/lib/utils";
import CreateFolderModal from "./CreateFolderModal";
import AssetUploadModalV2 from "./AssetUploadModalV2";

interface Folder {
    id: string;
    name: string;
    description: string | null;
    color: string;
    created_at: string;
    assets?: { count: number }[];
}

interface Asset {
    id: string;
    name: string;
    file_path: string;
    file_type: string;
    file_size: number;
    folder_id: string | null;
    metadata?: { url?: string };
}

type Props = {
    projectId: string;
    showUploadModal?: boolean;
    onCloseUploadModal?: () => void;
};

const folderColorStyles: Record<string, { bg: string; border: string; icon: string }> = {
    slate: { bg: "bg-slate-500/10", border: "border-slate-500/20", icon: "fill-slate-500" },
    red: { bg: "bg-red-500/10", border: "border-red-500/20", icon: "fill-red-500" },
    orange: { bg: "bg-orange-500/10", border: "border-orange-500/20", icon: "fill-orange-500" },
    amber: { bg: "bg-amber-500/10", border: "border-amber-500/20", icon: "fill-amber-500" },
    green: { bg: "bg-green-500/10", border: "border-green-500/20", icon: "fill-green-500" },
    teal: { bg: "bg-teal-500/10", border: "border-teal-500/20", icon: "fill-teal-500" },
    blue: { bg: "bg-blue-500/10", border: "border-blue-500/20", icon: "fill-blue-500" },
    indigo: { bg: "bg-indigo-500/10", border: "border-indigo-500/20", icon: "fill-indigo-500" },
    purple: { bg: "bg-purple-500/10", border: "border-purple-500/20", icon: "fill-purple-500" },
    pink: { bg: "bg-pink-500/10", border: "border-pink-500/20", icon: "fill-pink-500" },
};

const Assets = ({ projectId, showUploadModal = false, onCloseUploadModal }: Props) => {
    const toast = useToast();
    const [folders, setFolders] = useState<Folder[]>([]);
    const [assets, setAssets] = useState<Asset[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
    const [isCreateFolderModalOpen, setIsCreateFolderModalOpen] = useState(false);
    const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
    const [openFolderId, setOpenFolderId] = useState<string | null>(null);

    const fetchData = useCallback(async () => {
        setIsLoading(true);
        try {
            const [foldersRes, assetsRes] = await Promise.all([
                fetch(`/api/projects/${projectId}/assets/folders`),
                fetch(`/api/projects/${projectId}/assets`),
            ]);

            if (foldersRes.ok) {
                const foldersData = await foldersRes.json();
                setFolders(foldersData);
            }

            if (assetsRes.ok) {
                const assetsData = await assetsRes.json();
                setAssets(assetsData.map((a: any) => ({
                    id: a.id,
                    name: a.name,
                    file_path: a.file_path,
                    file_type: a.file_type,
                    file_size: a.file_size,
                    folder_id: a.folder_id,
                    metadata: a.metadata,
                })));
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setIsLoading(false);
        }
    }, [projectId]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    useEffect(() => {
        if (showUploadModal) {
            setIsUploadModalOpen(true);
        }
    }, [showUploadModal]);

    const handleCloseUploadModal = () => {
        setIsUploadModalOpen(false);
        setSelectedFolderId(null);
        onCloseUploadModal?.();
    };

    const handleOpenUploadModal = (folderId?: string) => {
        if (folderId) setSelectedFolderId(folderId);
        setIsUploadModalOpen(true);
    };

    const handleCreateFolder = async (folder: { name: string; description: string; color: string }) => {
        try {
            const response = await fetch(`/api/projects/${projectId}/assets/folders`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(folder),
            });

            if (response.ok) {
                const newFolder = await response.json();
                setFolders(prev => [newFolder, ...prev]);
                toast.success("Folder created", `${folder.name} has been created`);
            } else {
                throw new Error('Failed to create folder');
            }
        } catch (error) {
            console.error('Error creating folder:', error);
            toast.error("Error", "Failed to create folder");
        }
    };

    const handleDeleteFolder = async (folderId: string, folderName: string) => {
        if (!confirm(`Delete "${folderName}" and all its assets?`)) return;

        try {
            const response = await fetch(`/api/projects/${projectId}/assets/folders/${folderId}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                setFolders(prev => prev.filter(f => f.id !== folderId));
                setAssets(prev => prev.filter(a => a.folder_id !== folderId));
                if (openFolderId === folderId) setOpenFolderId(null);
                toast.success("Folder deleted", `${folderName} has been deleted`);
            } else {
                throw new Error('Failed to delete folder');
            }
        } catch (error) {
            console.error('Error deleting folder:', error);
            toast.error("Error", "Failed to delete folder");
        }
    };

    const handleUpload = async (data: { file: File; name: string; folderId: string | null }) => {
        const formData = new FormData();
        formData.append('file', data.file);
        formData.append('name', data.name);
        if (data.folderId) formData.append('folder_id', data.folderId);

        const response = await fetch(`/api/projects/${projectId}/assets/upload`, {
            method: 'POST',
            body: formData,
        });

        if (response.ok) {
            const newAsset = await response.json();
            setAssets(prev => [{
                id: newAsset.id,
                name: newAsset.name,
                file_path: newAsset.file_path,
                file_type: newAsset.file_type,
                file_size: newAsset.file_size,
                folder_id: newAsset.folder_id || data.folderId,
                metadata: newAsset.metadata,
            }, ...prev]);
            toast.success("Asset uploaded", `${data.name} has been uploaded`);
        } else {
            const error = await response.json();
            throw new Error(error.error || 'Upload failed');
        }
    };

    const handleDeleteAsset = async (assetId: string, assetName: string) => {
        try {
            const response = await fetch(`/api/projects/${projectId}/assets/${assetId}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                setAssets(prev => prev.filter(a => a.id !== assetId));
                toast.success("Asset deleted", `${assetName} has been deleted`);
            } else {
                throw new Error('Failed to delete asset');
            }
        } catch (error) {
            console.error('Error deleting asset:', error);
            toast.error("Error", "Failed to delete asset");
        }
    };

    const formatFileSize = (bytes: number) => {
        if (bytes < 1024) return `${bytes} B`;
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
        return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    };

    const getFileIcon = (fileType: string) => {
        if (fileType?.startsWith("image/")) return "image";
        if (fileType?.includes("pdf")) return "document-text";
        if (fileType?.includes("word") || fileType?.includes("document")) return "document-text";
        return "document";
    };

    const getAssetsByFolder = (folderId: string) => {
        return assets.filter(a => a.folder_id === folderId);
    };

    const getUnorganizedAssets = () => {
        return assets.filter(a => !a.folder_id);
    };

    if (isLoading) {
        return (
            <div className="p-8 rounded-4xl bg-b-surface2">
                <div className="grid grid-cols-4 gap-4 max-lg:grid-cols-3 max-md:grid-cols-2">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="p-4 rounded-3xl bg-b-surface1">
                            <Skeleton variant="rounded" height={80} className="mb-3" />
                            <Skeleton variant="text" height={16} className="w-24 mb-1" />
                            <Skeleton variant="text" height={12} className="w-16" />
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    const unorganizedAssets = getUnorganizedAssets();

    return (
        <div className="p-8 rounded-4xl bg-b-surface2">
            {/* Empty State */}
            {folders.length === 0 && assets.length === 0 && (
                <div className="flex flex-col items-center justify-center py-16 px-4">
                    <div className="flex items-center justify-center size-20 rounded-3xl bg-primary1/10 mb-6">
                        <svg className="w-10 h-10" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M9.00006 10.34C10.0701 10.34 10.9401 9.47 10.9401 8.4C10.9401 7.33 10.0701 6.46 9.00006 6.46C7.93006 6.46 7.06006 7.33 7.06006 8.4C7.06006 9.47 7.93006 10.34 9.00006 10.34Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="stroke-primary1"/>
                            <path d="M11.91 2.58H8.99996C4.14996 2.58 2.20996 4.52 2.20996 9.37V15.19C2.20996 20.04 4.14996 21.98 8.99996 21.98H14.82C19.67 21.98 21.62 20.04 21.62 15.19V11.31" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="stroke-primary1"/>
                            <path d="M2.84985 19.03L7.63985 15.82M13.2599 16.24L17.2999 12.77C18.0599 12.12 19.2799 12.12 20.0399 12.77L21.6199 14.13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="stroke-primary1"/>
                            <path d="M21.7099 5.34L20.5799 5.6C19.7699 5.79 19.1499 6.42 18.9599 7.22L18.6999 8.35C18.6699 8.47 18.4999 8.47 18.4699 8.35L18.2099 7.22C18.0199 6.41 17.3899 5.79 16.5899 5.6L15.4599 5.34C15.3399 5.31 15.3399 5.14 15.4599 5.11L16.5899 4.85C17.3999 4.66 18.0199 4.03 18.2099 3.23L18.4699 2.1C18.4999 1.98 18.6699 1.98 18.6999 2.1L18.9599 3.23C19.1499 4.04 19.7799 4.66 20.5799 4.85L21.7099 5.11C21.8299 5.14 21.8299 5.31 21.7099 5.34Z" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" className="stroke-primary1"/>
                        </svg>
                    </div>
                    <h3 className="text-h3 mb-2">No assets yet</h3>
                    <p className="text-body text-t-secondary text-center max-w-md mb-6">
                        Create folders to organize your project assets like logos, screenshots, documents, and more.
                    </p>
                    <Button isPrimary onClick={() => setIsCreateFolderModalOpen(true)}>
                        <Icon className="mr-2 !w-5 !h-5" name="plus" />
                        Create Your First Folder
                    </Button>
                </div>
            )}

            {/* Folders Grid */}
            {(folders.length > 0 || unorganizedAssets.length > 0) && (
                <div className="space-y-6">
                    {/* Folders */}
                    <div className="grid grid-cols-4 gap-4 max-lg:grid-cols-3 max-md:grid-cols-2 max-sm:grid-cols-1">
                        {folders.map((folder) => {
                            const styles = folderColorStyles[folder.color] || folderColorStyles.slate;
                            const folderAssets = getAssetsByFolder(folder.id);
                            const isOpen = openFolderId === folder.id;

                            return (
                                <div key={folder.id} className="relative">
                                    <div
                                        onClick={() => setOpenFolderId(isOpen ? null : folder.id)}
                                        className={cn(
                                            "group p-4 rounded-3xl bg-b-surface1 hover:shadow-hover transition-all cursor-pointer border-2",
                                            isOpen ? `${styles.border}` : "border-transparent"
                                        )}
                                    >
                                        <div className={cn(
                                            "flex items-center justify-center h-20 mb-3 rounded-2xl",
                                            styles.bg
                                        )}>
                                            <Icon className={cn("!w-10 !h-10", styles.icon)} name="folder" />
                                        </div>
                                        <div className="text-body font-medium truncate">{folder.name}</div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs text-t-tertiary">{folderAssets.length} assets</span>
                                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleOpenUploadModal(folder.id);
                                                    }}
                                                    className="p-1.5 rounded-lg hover:bg-b-surface1 fill-t-tertiary hover:fill-primary1 transition-colors"
                                                    title="Upload to folder"
                                                >
                                                    <Icon className="!w-4 !h-4" name="upload" />
                                                </button>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleDeleteFolder(folder.id, folder.name);
                                                    }}
                                                    className="p-1.5 rounded-lg hover:bg-red-500/10 fill-t-tertiary hover:fill-red-500 transition-colors"
                                                    title="Delete folder"
                                                >
                                                    <Icon className="!w-4 !h-4" name="trash" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Expanded folder contents */}
                                    {isOpen && (
                                        <div className="absolute left-0 right-0 top-full mt-2 z-10 p-4 rounded-2xl bg-b-surface1 border border-stroke-subtle shadow-lg">
                                            <div className="flex items-center justify-between mb-3">
                                                <span className="text-small font-medium">{folder.name}</span>
                                                <button
                                                    onClick={() => setOpenFolderId(null)}
                                                    className="p-1 rounded-lg hover:bg-b-surface2 fill-t-tertiary"
                                                >
                                                    <Icon className="!w-4 !h-4" name="close" />
                                                </button>
                                            </div>
                                            {folderAssets.length === 0 ? (
                                                <div className="text-center py-6">
                                                    <p className="text-small text-t-tertiary mb-2">No assets in this folder</p>
                                                    <button
                                                        onClick={() => handleOpenUploadModal(folder.id)}
                                                        className="text-xs text-primary1 hover:underline"
                                                    >
                                                        Upload first asset
                                                    </button>
                                                </div>
                                            ) : (
                                                <div className="space-y-2 max-h-64 overflow-y-auto">
                                                    {folderAssets.map((asset) => (
                                                        <div
                                                            key={asset.id}
                                                            className="group flex items-center gap-3 p-2 rounded-xl hover:bg-b-surface2 transition-colors"
                                                        >
                                                            <div className="flex items-center justify-center size-10 rounded-lg bg-b-surface1">
                                                                <Icon className="!w-5 !h-5 fill-t-tertiary" name={getFileIcon(asset.file_type)} />
                                                            </div>
                                                            <div className="flex-1 min-w-0">
                                                                <p className="text-small font-medium truncate">{asset.name}</p>
                                                                <p className="text-xs text-t-tertiary">{formatFileSize(asset.file_size)}</p>
                                                            </div>
                                                            <button
                                                                onClick={() => handleDeleteAsset(asset.id, asset.name)}
                                                                className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg hover:bg-red-500/10 fill-t-tertiary hover:fill-red-500 transition-all"
                                                            >
                                                                <Icon className="!w-4 !h-4" name="trash" />
                                                            </button>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            );
                        })}

                        {/* Create Folder Card */}
                        <div
                            onClick={() => setIsCreateFolderModalOpen(true)}
                            className="flex flex-col items-center justify-center p-4 min-h-[140px] rounded-3xl border-2 border-dashed border-stroke-subtle hover:border-primary1 hover:bg-primary1/5 transition-all cursor-pointer"
                        >
                            <Icon className="!w-8 !h-8 mb-2 fill-t-tertiary" name="folder-add" />
                            <span className="text-small text-t-secondary">Create Folder</span>
                        </div>
                    </div>

                    {/* Unorganized Assets */}
                    {unorganizedAssets.length > 0 && (
                        <div>
                            <h3 className="text-body font-medium text-t-secondary mb-3">Unorganized Assets</h3>
                            <div className="grid grid-cols-6 gap-3 max-lg:grid-cols-4 max-md:grid-cols-3 max-sm:grid-cols-2">
                                {unorganizedAssets.map((asset) => (
                                    <div
                                        key={asset.id}
                                        className="group relative p-3 rounded-2xl bg-b-surface1 hover:shadow-hover transition-shadow"
                                    >
                                        <div className="flex items-center justify-center h-16 mb-2 rounded-xl bg-b-surface2">
                                            <Icon className="!w-6 !h-6 fill-t-tertiary" name={getFileIcon(asset.file_type)} />
                                        </div>
                                        <p className="text-xs font-medium truncate">{asset.name}</p>
                                        <p className="text-xs text-t-tertiary">{formatFileSize(asset.file_size)}</p>
                                        <button
                                            onClick={() => handleDeleteAsset(asset.id, asset.name)}
                                            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 p-1 rounded-full bg-red-500/10 hover:bg-red-500/20 transition-all"
                                        >
                                            <Icon className="!w-3 !h-3 fill-red-500" name="close" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Create Folder Modal */}
            <CreateFolderModal
                isOpen={isCreateFolderModalOpen}
                onClose={() => setIsCreateFolderModalOpen(false)}
                onCreateFolder={handleCreateFolder}
            />

            {/* Upload Modal */}
            <AssetUploadModalV2
                isOpen={isUploadModalOpen}
                onClose={handleCloseUploadModal}
                onUpload={handleUpload}
                folders={folders}
                onCreateFolder={() => {
                    setIsUploadModalOpen(false);
                    setIsCreateFolderModalOpen(true);
                }}
                preselectedFolderId={selectedFolderId}
            />
        </div>
    );
};

export default Assets;

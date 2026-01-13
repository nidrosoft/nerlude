"use client";

import { useState, useEffect, useCallback } from "react";
import Icon from "@/components/Icon";
import Button from "@/components/Button";
import Skeleton from "@/components/Skeleton";
import { useToast } from "@/components/Toast";
import { cn } from "@/lib/utils";
import CreateFolderModal from "./CreateFolderModal";
import AssetUploadModalV2 from "./AssetUploadModalV2";
import AssetTable from "./AssetTable";
import AssetPreviewModal from "./AssetPreviewModal";
import FolderCard from "./FolderCard";
import EmptyState from "./EmptyState";
import DeleteConfirmModal from "./DeleteConfirmModal";
import useSubscription from "@/hooks/useSubscription";
import UpgradeModal from "@/components/UpgradeModal";

interface Folder {
    id: string;
    name: string;
    description: string | null;
    color: string;
    created_at: string;
}

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

type Props = {
    projectId: string;
    showUploadModal?: boolean;
    onCloseUploadModal?: () => void;
    onBreadcrumbChange?: (folderPath: { id: string | null; name: string; onClick?: () => void }[]) => void;
};

const Assets = ({ projectId, showUploadModal = false, onCloseUploadModal, onBreadcrumbChange }: Props) => {
    const toast = useToast();
    const { canUploadFile, getUpgradeMessage } = useSubscription();
    const [folders, setFolders] = useState<Folder[]>([]);
    const [assets, setAssets] = useState<Asset[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
    const [isCreateFolderModalOpen, setIsCreateFolderModalOpen] = useState(false);
    const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
    const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);
    const [previewAsset, setPreviewAsset] = useState<Asset | null>(null);
    const [viewMode, setViewMode] = useState<"grid" | "table">("table");
    const [showUpgradeModal, setShowUpgradeModal] = useState(false);
    const [upgradeModalConfig, setUpgradeModalConfig] = useState({ title: "", message: "", suggestedPlan: "Pro" });
    
    // Delete confirmation state
    const [deleteModal, setDeleteModal] = useState<{
        isOpen: boolean;
        itemId: string;
        itemName: string;
        itemType: "file" | "folder";
    }>({ isOpen: false, itemId: "", itemName: "", itemType: "file" });
    const [isDeleting, setIsDeleting] = useState(false);

    // Get current folder info
    const currentFolder = currentFolderId ? folders.find(f => f.id === currentFolderId) : null;

    // Update breadcrumb when folder changes
    useEffect(() => {
        if (onBreadcrumbChange) {
            const path: { id: string | null; name: string; onClick?: () => void }[] = [
                { 
                    id: null, 
                    name: "Assets",
                    onClick: currentFolderId ? () => setCurrentFolderId(null) : undefined
                }
            ];
            if (currentFolder) {
                path.push({ id: currentFolder.id, name: currentFolder.name });
            }
            onBreadcrumbChange(path);
        }
    }, [currentFolderId, currentFolder, onBreadcrumbChange]);

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
                    created_at: a.created_at,
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

    const handleOpenUploadModal = (folderId?: string, fileSize?: number) => {
        // Check storage limit before opening upload modal
        const storageCheck = canUploadFile(fileSize || 0);
        if (!storageCheck.allowed) {
            const upgradeMsg = getUpgradeMessage("storage");
            setUpgradeModalConfig({
                title: upgradeMsg.title,
                message: upgradeMsg.message,
                suggestedPlan: upgradeMsg.suggestedPlan,
            });
            setShowUpgradeModal(true);
            return;
        }
        if (folderId) setSelectedFolderId(folderId);
        else if (currentFolderId) setSelectedFolderId(currentFolderId);
        setIsUploadModalOpen(true);
    };

    const handleOpenFolder = (folderId: string) => {
        setCurrentFolderId(folderId);
    };

    const handleGoBack = () => {
        setCurrentFolderId(null);
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

    const handleDeleteFolder = (folderId: string, folderName: string) => {
        setDeleteModal({
            isOpen: true,
            itemId: folderId,
            itemName: folderName,
            itemType: "folder"
        });
    };

    const confirmDeleteFolder = async (folderId: string) => {
        setIsDeleting(true);
        try {
            const response = await fetch(`/api/projects/${projectId}/assets/folders/${folderId}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                setFolders(prev => prev.filter(f => f.id !== folderId));
                setAssets(prev => prev.filter(a => a.folder_id !== folderId));
                if (currentFolderId === folderId) setCurrentFolderId(null);
                toast.success("Folder deleted", `${deleteModal.itemName} has been deleted`);
            } else {
                throw new Error('Failed to delete folder');
            }
        } catch (error) {
            console.error('Error deleting folder:', error);
            toast.error("Error", "Failed to delete folder");
        } finally {
            setIsDeleting(false);
            setDeleteModal({ isOpen: false, itemId: "", itemName: "", itemType: "file" });
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
                created_at: newAsset.created_at,
            }, ...prev]);
            toast.success("Asset uploaded", `${data.name} has been uploaded`);
        } else {
            const error = await response.json();
            throw new Error(error.error || 'Upload failed');
        }
    };

    const handleDeleteAsset = (assetId: string, assetName: string) => {
        setDeleteModal({
            isOpen: true,
            itemId: assetId,
            itemName: assetName,
            itemType: "file"
        });
    };

    const confirmDeleteAsset = async (assetId: string) => {
        setIsDeleting(true);
        try {
            const response = await fetch(`/api/projects/${projectId}/assets/${assetId}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                setAssets(prev => prev.filter(a => a.id !== assetId));
                toast.success("Asset deleted", `${deleteModal.itemName} has been deleted`);
            } else {
                throw new Error('Failed to delete asset');
            }
        } catch (error) {
            console.error('Error deleting asset:', error);
            toast.error("Error", "Failed to delete asset");
        } finally {
            setIsDeleting(false);
            setDeleteModal({ isOpen: false, itemId: "", itemName: "", itemType: "file" });
        }
    };

    const handleConfirmDelete = () => {
        if (deleteModal.itemType === "folder") {
            confirmDeleteFolder(deleteModal.itemId);
        } else {
            confirmDeleteAsset(deleteModal.itemId);
        }
    };

    const getAssetsByFolder = (folderId: string) => assets.filter(a => a.folder_id === folderId);
    const getUnorganizedAssets = () => assets.filter(a => !a.folder_id);

    // Loading state
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

    // Empty state
    if (folders.length === 0 && assets.length === 0) {
        return (
            <div className="p-8 rounded-4xl bg-b-surface2">
                <EmptyState 
                    onCreateFolder={() => setIsCreateFolderModalOpen(true)}
                    onUpload={() => setIsUploadModalOpen(true)}
                />
                <CreateFolderModal
                    isOpen={isCreateFolderModalOpen}
                    onClose={() => setIsCreateFolderModalOpen(false)}
                    onCreateFolder={handleCreateFolder}
                />
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
    }

    const currentAssets = currentFolderId ? getAssetsByFolder(currentFolderId) : [];
    const unorganizedAssets = getUnorganizedAssets();

    return (
        <div className="p-8 rounded-4xl bg-b-surface2">
            {/* Inside a folder view */}
            {currentFolderId && currentFolder ? (
                <div className="space-y-5">
                    {/* Folder Header */}
                    <div className="flex items-center justify-between p-4 rounded-2xl bg-b-surface1 border border-stroke-subtle">
                        <div className="flex items-center gap-4">
                            <Button 
                                isStroke 
                                isCircle 
                                onClick={handleGoBack}
                                title="Back to folders"
                            >
                                <Icon className="!w-5 !h-5 fill-inherit" name="arrow-left" />
                            </Button>
                            <div>
                                <h3 className="text-h4 text-t-primary">{currentFolder.name}</h3>
                                <p className="text-small text-t-tertiary">{currentAssets.length} {currentAssets.length === 1 ? "asset" : "assets"}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="flex items-center h-12 bg-b-surface2 rounded-full px-1 border border-stroke-subtle">
                                <button
                                    onClick={() => setViewMode("table")}
                                    className={cn(
                                        "flex items-center gap-2 h-10 px-4 rounded-full text-small font-medium transition-all",
                                        viewMode === "table" 
                                            ? "bg-b-surface1 text-t-primary fill-t-primary shadow-sm" 
                                            : "text-t-tertiary fill-t-tertiary hover:text-t-secondary hover:fill-t-secondary"
                                    )}
                                >
                                    <Icon className="!w-4 !h-4" name="menu" />
                                    List
                                </button>
                                <button
                                    onClick={() => setViewMode("grid")}
                                    className={cn(
                                        "flex items-center gap-2 h-10 px-4 rounded-full text-small font-medium transition-all",
                                        viewMode === "grid" 
                                            ? "bg-b-surface1 text-t-primary fill-t-primary shadow-sm" 
                                            : "text-t-tertiary fill-t-tertiary hover:text-t-secondary hover:fill-t-secondary"
                                    )}
                                >
                                    <Icon className="!w-4 !h-4" name="element-3" />
                                    Grid
                                </button>
                            </div>
                            <Button isStroke icon="upload" onClick={() => handleOpenUploadModal(currentFolderId)}>
                                Upload
                            </Button>
                        </div>
                    </div>

                    {/* Assets Table/Grid */}
                    {viewMode === "table" ? (
                        <AssetTable 
                            assets={currentAssets} 
                            onDelete={handleDeleteAsset}
                            onPreview={setPreviewAsset}
                        />
                    ) : (
                        <div className="grid grid-cols-5 gap-4 max-lg:grid-cols-4 max-md:grid-cols-3 max-sm:grid-cols-2">
                            {currentAssets.map((asset) => (
                                <div
                                    key={asset.id}
                                    onClick={() => setPreviewAsset(asset)}
                                    className="group relative p-3 rounded-2xl bg-b-surface1 border border-stroke-subtle hover:border-stroke-highlight hover:shadow-hover transition-all cursor-pointer"
                                >
                                    <div className="flex items-center justify-center h-24 mb-3 rounded-xl bg-b-surface2 overflow-hidden">
                                        {asset.file_type?.startsWith("image/") && asset.metadata?.url ? (
                                            <img src={asset.metadata.url} alt={asset.name} className="h-full w-full object-cover" />
                                        ) : (
                                            <Icon className="!w-10 !h-10 fill-t-tertiary" name="document" />
                                        )}
                                    </div>
                                    <p className="text-small font-medium truncate text-t-primary">{asset.name}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            ) : (
                /* Folders view */
                <div className="space-y-6">
                    {/* Folders Grid */}
                    <div className="grid grid-cols-4 gap-4 max-lg:grid-cols-3 max-md:grid-cols-2 max-sm:grid-cols-1">
                        {folders.map((folder) => (
                            <FolderCard
                                key={folder.id}
                                folder={folder}
                                assetCount={getAssetsByFolder(folder.id).length}
                                onOpen={handleOpenFolder}
                                onUpload={handleOpenUploadModal}
                                onDelete={handleDeleteFolder}
                            />
                        ))}

                        {/* Create Folder Card - matching folder style */}
                        <div
                            onClick={() => setIsCreateFolderModalOpen(true)}
                            className="group relative cursor-pointer transition-all duration-200 hover:translate-y-[-2px]"
                            style={{ filter: "drop-shadow(0 4px 12px rgba(0, 0, 0, 0.1))" }}
                        >
                            <svg 
                                viewBox="0 0 120 80" 
                                fill="none" 
                                xmlns="http://www.w3.org/2000/svg"
                                className="w-full h-auto"
                            >
                                {/* Tab/back part */}
                                <path 
                                    d="M8 12C8 7.58172 11.5817 4 16 4H36C38.1217 4 40.1566 4.84285 41.6569 6.34315L48 12.5H8V12Z" 
                                    className="fill-gray-300 group-hover:fill-primary1/80 transition-colors"
                                />
                                {/* Main folder body */}
                                <rect x="4" y="14" width="112" height="62" rx="8" className="fill-gray-300 group-hover:fill-primary1 transition-colors" />
                                {/* Plus icon */}
                                <rect x="54" y="36" width="12" height="2" rx="1" fill="white" />
                                <rect x="59" y="31" width="2" height="12" rx="1" fill="white" />
                                {/* Text */}
                                <text 
                                    x="60" 
                                    y="62" 
                                    fill="white" 
                                    fontSize="9" 
                                    fontWeight="500" 
                                    fontFamily="system-ui, -apple-system, sans-serif"
                                    textAnchor="middle"
                                >
                                    New Folder
                                </text>
                            </svg>
                        </div>
                    </div>

                    {/* Unorganized Assets */}
                    {unorganizedAssets.length > 0 && (
                        <div className="pt-4 border-t border-stroke-subtle">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-body font-medium text-t-primary">Unorganized Assets</h3>
                                <div className="flex items-center bg-b-surface1 rounded-full p-1 border border-stroke-subtle">
                                    <button
                                        onClick={() => setViewMode("table")}
                                        className={cn(
                                            "flex items-center gap-2 px-3 py-1.5 rounded-full text-small font-medium transition-all",
                                            viewMode === "table" 
                                                ? "bg-b-surface2 text-t-primary fill-t-primary shadow-sm" 
                                                : "text-t-tertiary fill-t-tertiary hover:text-t-secondary hover:fill-t-secondary"
                                        )}
                                    >
                                        <Icon className="!w-4 !h-4" name="menu" />
                                        List
                                    </button>
                                    <button
                                        onClick={() => setViewMode("grid")}
                                        className={cn(
                                            "flex items-center gap-2 px-3 py-1.5 rounded-full text-small font-medium transition-all",
                                            viewMode === "grid" 
                                                ? "bg-b-surface2 text-t-primary fill-t-primary shadow-sm" 
                                                : "text-t-tertiary fill-t-tertiary hover:text-t-secondary hover:fill-t-secondary"
                                        )}
                                    >
                                        <Icon className="!w-4 !h-4" name="element-3" />
                                        Grid
                                    </button>
                                </div>
                            </div>
                            {viewMode === "table" ? (
                                <AssetTable 
                                    assets={unorganizedAssets} 
                                    onDelete={handleDeleteAsset}
                                    onPreview={setPreviewAsset}
                                />
                            ) : (
                                <div className="grid grid-cols-6 gap-3 max-lg:grid-cols-4 max-md:grid-cols-3 max-sm:grid-cols-2">
                                    {unorganizedAssets.map((asset) => (
                                        <div
                                            key={asset.id}
                                            onClick={() => setPreviewAsset(asset)}
                                            className="group relative p-3 rounded-2xl bg-b-surface1 border border-stroke-subtle hover:border-stroke-highlight hover:shadow-hover transition-all cursor-pointer"
                                        >
                                            <div className="flex items-center justify-center h-20 mb-2 rounded-xl bg-b-surface2 overflow-hidden">
                                                {asset.file_type?.startsWith("image/") && asset.metadata?.url ? (
                                                    <img src={asset.metadata.url} alt={asset.name} className="h-full w-full object-cover" />
                                                ) : (
                                                    <Icon className="!w-8 !h-8 fill-t-tertiary" name="document" />
                                                )}
                                            </div>
                                            <p className="text-small font-medium truncate text-t-primary">{asset.name}</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}

            {/* Modals */}
            <CreateFolderModal
                isOpen={isCreateFolderModalOpen}
                onClose={() => setIsCreateFolderModalOpen(false)}
                onCreateFolder={handleCreateFolder}
            />
            <AssetUploadModalV2
                isOpen={isUploadModalOpen}
                onClose={handleCloseUploadModal}
                onUpload={handleUpload}
                folders={folders}
                onCreateFolder={() => {
                    setIsUploadModalOpen(false);
                    setIsCreateFolderModalOpen(true);
                }}
                preselectedFolderId={selectedFolderId || currentFolderId}
            />
            <AssetPreviewModal
                isOpen={!!previewAsset}
                onClose={() => setPreviewAsset(null)}
                asset={previewAsset}
                onDelete={handleDeleteAsset}
            />
            <DeleteConfirmModal
                isOpen={deleteModal.isOpen}
                onClose={() => setDeleteModal({ isOpen: false, itemId: "", itemName: "", itemType: "file" })}
                onConfirm={handleConfirmDelete}
                itemName={deleteModal.itemName}
                itemType={deleteModal.itemType}
                isDeleting={isDeleting}
            />
            
            {/* Upgrade Modal */}
            <UpgradeModal
                isOpen={showUpgradeModal}
                onClose={() => setShowUpgradeModal(false)}
                title={upgradeModalConfig.title}
                message={upgradeModalConfig.message}
                suggestedPlan={upgradeModalConfig.suggestedPlan}
                limitType="storage"
            />
        </div>
    );
};

export default Assets;

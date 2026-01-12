"use client";

import { useState, useEffect } from "react";
import Modal from "@/components/Modal";
import Button from "@/components/Button";
import Icon from "@/components/Icon";
import { cn } from "@/lib/utils";

interface Folder {
    id: string;
    name: string;
    color: string;
}

interface AssetUploadModalV2Props {
    isOpen: boolean;
    onClose: () => void;
    onUpload: (data: { file: File; name: string; folderId: string | null }) => Promise<void>;
    folders: Folder[];
    onCreateFolder: () => void;
    preselectedFolderId?: string | null;
}

const AssetUploadModalV2 = ({
    isOpen,
    onClose,
    onUpload,
    folders,
    onCreateFolder,
    preselectedFolderId = null,
}: AssetUploadModalV2Props) => {
    const [name, setName] = useState("");
    const [file, setFile] = useState<File | null>(null);
    const [selectedFolderId, setSelectedFolderId] = useState<string | null>(preselectedFolderId);
    const [isDragging, setIsDragging] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);

    useEffect(() => {
        if (isOpen) {
            setSelectedFolderId(preselectedFolderId);
        }
    }, [isOpen, preselectedFolderId]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            setFile(selectedFile);
            if (!name) {
                setName(selectedFile.name.replace(/\.[^/.]+$/, ""));
            }
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const droppedFile = e.dataTransfer.files?.[0];
        if (droppedFile) {
            setFile(droppedFile);
            if (!name) {
                setName(droppedFile.name.replace(/\.[^/.]+$/, ""));
            }
        }
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleSubmit = async () => {
        if (!name || !file) return;

        setIsUploading(true);
        setUploadProgress(0);

        try {
            // Simulate progress
            const progressInterval = setInterval(() => {
                setUploadProgress(prev => Math.min(prev + 10, 90));
            }, 100);

            await onUpload({ file, name, folderId: selectedFolderId });

            clearInterval(progressInterval);
            setUploadProgress(100);

            setTimeout(() => {
                resetForm();
                onClose();
            }, 500);
        } catch (error) {
            console.error('Upload error:', error);
        } finally {
            setIsUploading(false);
        }
    };

    const resetForm = () => {
        setName("");
        setFile(null);
        setSelectedFolderId(preselectedFolderId);
        setUploadProgress(0);
    };

    const handleClose = () => {
        if (!isUploading) {
            resetForm();
            onClose();
        }
    };

    const getFileIcon = () => {
        if (!file) return "document";
        const type = file.type;
        if (type.startsWith("image/")) return "image";
        if (type.includes("pdf")) return "document-text";
        if (type.includes("word") || type.includes("document")) return "document-text";
        if (type.includes("sheet") || type.includes("excel")) return "document-text";
        return "document";
    };

    const formatFileSize = (bytes: number) => {
        if (bytes < 1024) return `${bytes} B`;
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
        return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    };

    const selectedFolder = folders.find(f => f.id === selectedFolderId);

    return (
        <Modal classWrapper="!max-w-3xl !p-6" open={isOpen} onClose={handleClose}>
            <div>
                <div className="flex items-center gap-3 mb-5">
                    <div className="flex items-center justify-center size-12 rounded-2xl bg-primary1/10">
                        <Icon className="!w-6 !h-6 fill-primary1" name="cloud-upload" />
                    </div>
                    <div>
                        <h2 className="text-h3">Upload Asset</h2>
                        <p className="text-small text-t-secondary">Add files to your project</p>
                    </div>
                </div>

                {/* Asset Name - moved to top */}
                <div className="mb-4">
                    <label className="block text-small font-medium mb-2">Asset Name</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter a name for this asset"
                        className="w-full h-12 px-5 rounded-full bg-b-surface2 border-[1.5px] border-stroke-subtle focus:border-primary1 focus:outline-none text-body transition-colors"
                        disabled={isUploading}
                    />
                </div>

                {/* File Drop Zone */}
                <div className="mb-4">
                    <label className="block text-small font-medium mb-2">File</label>
                    <div
                        onDrop={handleDrop}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        className={cn(
                            "relative flex flex-col items-center justify-center p-6 rounded-2xl border-2 border-dashed transition-all cursor-pointer",
                            isDragging
                                ? "border-primary1 bg-primary1/5"
                                : file
                                ? "border-green-500 bg-green-500/5"
                                : "border-primary1/50 bg-b-surface2"
                        )}
                    >
                        <input
                            type="file"
                            onChange={handleFileChange}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            disabled={isUploading}
                        />
                        {file ? (
                            <>
                                <div className="flex items-center justify-center size-12 rounded-xl mb-3 bg-green-500/10">
                                    <Icon className="!w-6 !h-6 fill-green-600" name={getFileIcon()} />
                                </div>
                                <span className="text-body font-medium text-t-primary">{file.name}</span>
                                <span className="text-small text-t-tertiary">
                                    {formatFileSize(file.size)}
                                </span>
                                {!isUploading && (
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setFile(null);
                                            setName("");
                                        }}
                                        className="mt-2 text-xs text-red-500 hover:text-red-600"
                                    >
                                        Remove file
                                    </button>
                                )}
                            </>
                        ) : (
                            <>
                                <div className="flex items-center justify-center size-14 rounded-2xl mb-3 bg-primary1/10 border-[1.5px] border-primary1/30">
                                    <Icon className="!w-7 !h-7 fill-primary1" name="cloud-upload" />
                                </div>
                                <span className="text-body text-t-secondary">
                                    Drop file here or <span className="text-primary1 font-medium">browse</span>
                                </span>
                                <span className="text-small text-t-tertiary mt-1">
                                    Supports images, documents, and more
                                </span>
                            </>
                        )}
                    </div>
                </div>

                {/* Folder Selection */}
                <div className="mb-5">
                    <label className="block text-small font-medium mb-2">Destination Folder</label>
                    {folders.length === 0 ? (
                        <div className="p-4 rounded-2xl bg-b-surface2 border border-stroke-subtle">
                            <div className="flex items-center gap-4">
                                <div className="flex items-center justify-center size-12 rounded-xl bg-amber-500/10">
                                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path opacity="0.4" d="M21.74 9.44H2V6.42C2 3.98 3.98 2 6.42 2H8.75C10.38 2 10.89 2.53 11.54 3.4L12.94 5.26C13.25 5.67 13.29 5.73 13.87 5.73H16.66C19.03 5.72 21.05 7.28 21.74 9.44Z" className="fill-amber-500"/>
                                        <path d="M21.99 10.8404C21.97 10.3504 21.89 9.89043 21.74 9.44043H2V16.6504C2 19.6004 4.4 22.0004 7.35 22.0004H16.65C19.6 22.0004 22 19.6004 22 16.6504V11.0704C22 11.0004 22 10.9104 21.99 10.8404ZM14.5 16.2504H12.81V18.0004C12.81 18.4104 12.47 18.7504 12.06 18.7504C11.65 18.7504 11.31 18.4104 11.31 18.0004V16.2504H9.5C9.09 16.2504 8.75 15.9104 8.75 15.5004C8.75 15.0904 9.09 14.7504 9.5 14.7504H11.31V13.0004C11.31 12.5904 11.65 12.2504 12.06 12.2504C12.47 12.2504 12.81 12.5904 12.81 13.0004V14.7504H14.5C14.91 14.7504 15.25 15.0904 15.25 15.5004C15.25 15.9104 14.91 16.2504 14.5 16.2504Z" className="fill-amber-500"/>
                                    </svg>
                                </div>
                                <div className="flex-1">
                                    <p className="text-body font-medium text-t-primary">No folders yet</p>
                                    <p className="text-small text-t-tertiary">Create a folder first to organize your assets</p>
                                </div>
                                <Button isSecondary onClick={onCreateFolder} className="shrink-0">
                                    <Icon className="mr-2 !w-4 !h-4" name="plus" />
                                    Create Folder
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <div className="p-4 rounded-2xl bg-b-surface2 border border-stroke-subtle">
                            <div className="flex flex-wrap gap-2 mb-3">
                                {folders.map((folder) => (
                                    <button
                                        key={folder.id}
                                        onClick={() => setSelectedFolderId(folder.id)}
                                        className={cn(
                                            "flex items-center gap-2 h-10 px-4 rounded-xl text-small font-medium transition-all border-[1.5px]",
                                            selectedFolderId === folder.id
                                                ? "bg-primary1/10 border-primary1 text-primary1"
                                                : "bg-b-surface1 border-transparent text-t-secondary hover:border-stroke-primary"
                                        )}
                                    >
                                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path opacity="0.4" d="M21.74 9.44H2V6.42C2 3.98 3.98 2 6.42 2H8.75C10.38 2 10.89 2.53 11.54 3.4L12.94 5.26C13.25 5.67 13.29 5.73 13.87 5.73H16.66C19.03 5.72 21.05 7.28 21.74 9.44Z" className={selectedFolderId === folder.id ? "fill-primary1" : "fill-t-tertiary"}/>
                                            <path d="M21.99 10.8404C21.97 10.3504 21.89 9.89043 21.74 9.44043H2V16.6504C2 19.6004 4.4 22.0004 7.35 22.0004H16.65C19.6 22.0004 22 19.6004 22 16.6504V11.0704C22 11.0004 22 10.9104 21.99 10.8404ZM14.5 16.2504H12.81V18.0004C12.81 18.4104 12.47 18.7504 12.06 18.7504C11.65 18.7504 11.31 18.4104 11.31 18.0004V16.2504H9.5C9.09 16.2504 8.75 15.9104 8.75 15.5004C8.75 15.0904 9.09 14.7504 9.5 14.7504H11.31V13.0004C11.31 12.5904 11.65 12.2504 12.06 12.2504C12.47 12.2504 12.81 12.5904 12.81 13.0004V14.7504H14.5C14.91 14.7504 15.25 15.0904 15.25 15.5004C15.25 15.9104 14.91 16.2504 14.5 16.2504Z" className={selectedFolderId === folder.id ? "fill-primary1" : "fill-t-tertiary"}/>
                                        </svg>
                                        {folder.name}
                                    </button>
                                ))}
                            </div>
                            <button
                                onClick={onCreateFolder}
                                className="flex items-center gap-1.5 text-small text-t-tertiary hover:text-primary1 transition-colors"
                            >
                                <Icon className="!w-4 !h-4" name="plus" />
                                Create new folder
                            </button>
                        </div>
                    )}
                </div>

                {/* Upload Progress */}
                {isUploading && (
                    <div className="mb-5 p-4 rounded-2xl bg-primary1/5 border border-primary1/20">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="animate-spin">
                                <Icon className="!w-5 !h-5 fill-primary1" name="loading" />
                            </div>
                            <span className="text-body font-medium text-primary1">Uploading...</span>
                            <span className="ml-auto text-small text-primary1">{uploadProgress}%</span>
                        </div>
                        <div className="h-2 rounded-full bg-primary1/20 overflow-hidden">
                            <div 
                                className="h-full bg-primary1 rounded-full transition-all duration-200"
                                style={{ width: `${uploadProgress}%` }}
                            />
                        </div>
                    </div>
                )}

                {/* Actions */}
                <div className="flex gap-3">
                    <Button className="flex-1" isStroke onClick={handleClose} disabled={isUploading}>
                        Cancel
                    </Button>
                    <Button
                        className="flex-1"
                        isPrimary
                        onClick={handleSubmit}
                        disabled={!name || !file || !selectedFolderId || isUploading}
                    >
                        {isUploading ? (
                            <>
                                <div className="animate-spin mr-2">
                                    <Icon className="!w-5 !h-5" name="loading" />
                                </div>
                                Uploading...
                            </>
                        ) : (
                            <>
                                <Icon className="mr-2 !w-5 !h-5" name="upload" />
                                Upload Asset
                            </>
                        )}
                    </Button>
                </div>
            </div>
        </Modal>
    );
};

export default AssetUploadModalV2;

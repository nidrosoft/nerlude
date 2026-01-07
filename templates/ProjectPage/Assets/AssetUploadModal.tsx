"use client";

import { useState } from "react";
import Modal from "@/components/Modal";
import Button from "@/components/Button";
import Icon from "@/components/Icon";
import { cn } from "@/lib/utils";

type AssetCategory = "logos" | "screenshots" | "documents";

interface AssetUploadModalProps {
    isOpen: boolean;
    onClose: () => void;
    onUpload: (asset: UploadedAsset) => void;
    defaultCategory?: AssetCategory;
}

interface UploadedAsset {
    name: string;
    category: AssetCategory;
    file: File | null;
    variant?: string; // For logos: light, dark, icon, full
    platform?: string; // For screenshots: iOS, Android, Web
    documentType?: string; // For documents: privacy, terms, other
}

const categoryConfig: Record<AssetCategory, {
    label: string;
    icon: string;
    bg: string;
    border: string;
    iconColor: string;
    acceptedTypes: string;
    description: string;
}> = {
    logos: {
        label: "Logo",
        icon: "bezier-curves",
        bg: "bg-purple-500/10",
        border: "border-purple-500/20",
        iconColor: "fill-purple-500",
        acceptedTypes: ".png,.svg,.jpg,.jpeg,.webp",
        description: "Upload your brand logos in various formats",
    },
    screenshots: {
        label: "Screenshot",
        icon: "camera",
        bg: "bg-cyan-500/10",
        border: "border-cyan-500/20",
        iconColor: "fill-cyan-500",
        acceptedTypes: ".png,.jpg,.jpeg,.webp",
        description: "Upload app screenshots for different platforms",
    },
    documents: {
        label: "Document",
        icon: "documents",
        bg: "bg-amber-500/10",
        border: "border-amber-500/20",
        iconColor: "fill-amber-500",
        acceptedTypes: ".pdf,.doc,.docx,.txt,.md",
        description: "Upload legal documents and policies",
    },
};

const logoVariants = [
    { value: "icon", label: "Icon" },
    { value: "full", label: "Full Logo" },
    { value: "light", label: "Light Mode" },
    { value: "dark", label: "Dark Mode" },
    { value: "wordmark", label: "Wordmark" },
];

const screenshotPlatforms = [
    { value: "ios", label: "iOS" },
    { value: "android", label: "Android" },
    { value: "web", label: "Web" },
    { value: "desktop", label: "Desktop" },
];

const documentTypes = [
    { value: "privacy", label: "Privacy Policy" },
    { value: "terms", label: "Terms of Service" },
    { value: "license", label: "License Agreement" },
    { value: "other", label: "Other" },
];

const AssetUploadModal = ({
    isOpen,
    onClose,
    onUpload,
    defaultCategory = "logos",
}: AssetUploadModalProps) => {
    const [category, setCategory] = useState<AssetCategory>(defaultCategory);
    const [name, setName] = useState("");
    const [file, setFile] = useState<File | null>(null);
    const [variant, setVariant] = useState("");
    const [platform, setPlatform] = useState("");
    const [documentType, setDocumentType] = useState("");
    const [isDragging, setIsDragging] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
    const [errorMessage, setErrorMessage] = useState('');

    const config = categoryConfig[category];

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
        setUploadStatus('uploading');
        setUploadProgress(0);
        setErrorMessage('');

        try {
            // Simulate upload progress
            for (let i = 0; i <= 100; i += 10) {
                await new Promise(resolve => setTimeout(resolve, 100));
                setUploadProgress(i);
            }

            onUpload({
                name,
                category,
                file,
                variant: category === "logos" ? variant : undefined,
                platform: category === "screenshots" ? platform : undefined,
                documentType: category === "documents" ? documentType : undefined,
            });

            setUploadStatus('success');
            
            // Auto close after success
            setTimeout(() => {
                resetForm();
                setUploadStatus('idle');
                onClose();
            }, 1500);
        } catch (error) {
            setUploadStatus('error');
            setErrorMessage('Failed to upload file. Please try again.');
        } finally {
            setIsUploading(false);
        }
    };

    const resetForm = () => {
        setName("");
        setFile(null);
        setVariant("");
        setPlatform("");
        setDocumentType("");
        setUploadProgress(0);
        setUploadStatus('idle');
        setErrorMessage('');
    };

    const handleCategoryChange = (newCategory: AssetCategory) => {
        setCategory(newCategory);
        resetForm();
    };

    return (
        <Modal classWrapper="!max-w-3xl" open={isOpen} onClose={onClose}>
            <div>
                <h2 className="text-h3 mb-2">Upload Asset</h2>
                <p className="text-body text-t-secondary mb-6">
                    Add a new asset to your project
                </p>

                {/* Category Selector */}
                <div className="mb-6">
                    <label className="block text-small font-medium mb-2">Asset Type</label>
                    <div className="flex gap-2">
                        {(Object.keys(categoryConfig) as AssetCategory[]).map((cat) => {
                            const catConfig = categoryConfig[cat];
                            const isActive = category === cat;
                            return (
                                <button
                                    key={cat}
                                    onClick={() => handleCategoryChange(cat)}
                                    className={cn(
                                        "flex-1 flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all",
                                        isActive
                                            ? `${catConfig.bg} ${catConfig.border}`
                                            : "border-stroke-subtle hover:border-stroke-primary bg-b-surface2"
                                    )}
                                >
                                    <div className={cn(
                                        "flex items-center justify-center size-10 rounded-xl",
                                        isActive ? catConfig.bg : "bg-b-surface1"
                                    )}>
                                        <Icon
                                            className={cn("!w-5 !h-5", isActive ? catConfig.iconColor : "fill-t-tertiary")}
                                            name={catConfig.icon}
                                        />
                                    </div>
                                    <span className={cn(
                                        "text-small font-medium",
                                        isActive ? "text-t-primary" : "text-t-secondary"
                                    )}>
                                        {catConfig.label}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* File Drop Zone */}
                <div className="mb-6">
                    <label className="block text-small font-medium mb-2">File</label>
                    <div
                        onDrop={handleDrop}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        className={cn(
                            "relative flex flex-col items-center justify-center p-8 rounded-2xl border-2 border-dashed transition-all cursor-pointer",
                            isDragging
                                ? "border-primary1 bg-primary1/5"
                                : file
                                ? "border-green-500 bg-green-500/5"
                                : "border-primary1/50 hover:border-primary1 bg-b-surface2"
                        )}
                    >
                        <input
                            type="file"
                            accept={config.acceptedTypes}
                            onChange={handleFileChange}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                        {file ? (
                            <>
                                <div className={cn(
                                    "flex items-center justify-center size-12 rounded-xl mb-3",
                                    config.bg
                                )}>
                                    <Icon className={cn("!w-6 !h-6", config.iconColor)} name={config.icon} />
                                </div>
                                <span className="text-body font-medium text-t-primary">{file.name}</span>
                                <span className="text-small text-t-tertiary">
                                    {(file.size / 1024).toFixed(1)} KB
                                </span>
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
                                    {config.description}
                                </span>
                            </>
                        )}
                    </div>
                </div>

                {/* Asset Name */}
                <div className="mb-6">
                    <label className="block text-small font-medium mb-2">Name</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder={`Enter ${config.label.toLowerCase()} name`}
                        className="w-full h-12 px-5 rounded-full bg-b-surface2 border-[1.5px] border-stroke-subtle focus:border-primary1 focus:outline-none text-body transition-colors"
                    />
                </div>

                {/* Category-specific fields */}
                {category === "logos" && (
                    <div className="mb-6">
                        <label className="block text-small font-medium mb-2">Variant</label>
                        <div className="flex flex-wrap gap-2">
                            {logoVariants.map((v) => (
                                <button
                                    key={v.value}
                                    onClick={() => setVariant(v.value)}
                                    className={cn(
                                        "h-10 px-5 rounded-full text-small font-medium transition-all border-[1.5px]",
                                        variant === v.value
                                            ? "bg-purple-500/10 border-purple-500/30 text-purple-600"
                                            : "bg-b-surface2 border-stroke-subtle text-t-secondary hover:border-stroke-primary"
                                    )}
                                >
                                    {v.label}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {category === "screenshots" && (
                    <div className="mb-6">
                        <label className="block text-small font-medium mb-2">Platform</label>
                        <div className="flex flex-wrap gap-2">
                            {screenshotPlatforms.map((p) => (
                                <button
                                    key={p.value}
                                    onClick={() => setPlatform(p.value)}
                                    className={cn(
                                        "h-10 px-5 rounded-full text-small font-medium transition-all border-[1.5px]",
                                        platform === p.value
                                            ? "bg-cyan-500/10 border-cyan-500/30 text-cyan-600"
                                            : "bg-b-surface2 border-stroke-subtle text-t-secondary hover:border-stroke-primary"
                                    )}
                                >
                                    {p.label}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {category === "documents" && (
                    <div className="mb-6">
                        <label className="block text-small font-medium mb-2">Document Type</label>
                        <div className="flex flex-wrap gap-2">
                            {documentTypes.map((d) => (
                                <button
                                    key={d.value}
                                    onClick={() => setDocumentType(d.value)}
                                    className={cn(
                                        "h-10 px-5 rounded-full text-small font-medium transition-all border-[1.5px]",
                                        documentType === d.value
                                            ? "bg-amber-500/10 border-amber-500/30 text-amber-600"
                                            : "bg-b-surface2 border-stroke-subtle text-t-secondary hover:border-stroke-primary"
                                    )}
                                >
                                    {d.label}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Upload Status */}
                {uploadStatus === 'uploading' && (
                    <div className="mb-6 p-4 rounded-2xl bg-primary1/5 border border-primary1/20">
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

                {uploadStatus === 'success' && (
                    <div className="mb-6 p-4 rounded-2xl bg-green-500/10 border border-green-500/20">
                        <div className="flex items-center gap-3">
                            <div className="flex items-center justify-center size-8 rounded-full bg-green-500/20">
                                <Icon className="!w-4 !h-4 fill-green-600" name="check" />
                            </div>
                            <span className="text-body font-medium text-green-600">Upload successful!</span>
                        </div>
                    </div>
                )}

                {uploadStatus === 'error' && (
                    <div className="mb-6 p-4 rounded-2xl bg-red-500/10 border border-red-500/20">
                        <div className="flex items-center gap-3">
                            <div className="flex items-center justify-center size-8 rounded-full bg-red-500/20">
                                <Icon className="!w-4 !h-4 fill-red-600" name="close" />
                            </div>
                            <div>
                                <span className="text-body font-medium text-red-600">Upload failed</span>
                                {errorMessage && (
                                    <p className="text-small text-red-500 mt-0.5">{errorMessage}</p>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Actions */}
                <div className="flex gap-3">
                    <Button className="flex-1" isStroke onClick={onClose} disabled={isUploading}>
                        Cancel
                    </Button>
                    <Button
                        className="flex-1"
                        isSecondary
                        onClick={handleSubmit}
                        disabled={!name || !file || isUploading || uploadStatus === 'success'}
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
                                Upload {config.label}
                            </>
                        )}
                    </Button>
                </div>
            </div>
        </Modal>
    );
};

export default AssetUploadModal;

"use client";

import { useState, useCallback } from "react";
import { CloudAdd, Trash, DocumentText, Lamp } from "iconsax-react";
import Icon from "@/components/Icon";
import Button from "@/components/Button";
import { UploadedDocument } from "@/types";

type Props = {
    documents: UploadedDocument[];
    onDocumentsChange: (documents: UploadedDocument[]) => void;
    onContinue: () => void;
    onBack: () => void;
};

const ACCEPTED_TYPES = [
    'application/pdf',
    'image/png',
    'image/jpeg',
    'image/jpg',
    'image/webp',
];

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const MAX_FILES = 20;

const DocumentUpload = ({ documents, onDocumentsChange, onContinue, onBack }: Props) => {
    const [isDragging, setIsDragging] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const generateId = () => Math.random().toString(36).substring(2, 15);

    const validateFile = (file: File): string | null => {
        if (!ACCEPTED_TYPES.includes(file.type)) {
            return `${file.name}: Unsupported file type. Please upload PDF or image files.`;
        }
        if (file.size > MAX_FILE_SIZE) {
            return `${file.name}: File too large. Maximum size is 10MB.`;
        }
        return null;
    };

    const processFiles = useCallback((files: FileList | File[]) => {
        setError(null);
        const fileArray = Array.from(files);
        
        if (documents.length + fileArray.length > MAX_FILES) {
            setError(`Maximum ${MAX_FILES} files allowed. You can upload ${MAX_FILES - documents.length} more.`);
            return;
        }

        const errors: string[] = [];
        const newDocuments: UploadedDocument[] = [];

        fileArray.forEach((file) => {
            const validationError = validateFile(file);
            if (validationError) {
                errors.push(validationError);
            } else {
                const previewUrl = file.type.startsWith('image/') 
                    ? URL.createObjectURL(file) 
                    : undefined;

                newDocuments.push({
                    id: generateId(),
                    file,
                    name: file.name,
                    type: 'receipt', // Default, will be determined by AI
                    size: file.size,
                    previewUrl,
                    status: 'pending',
                });
            }
        });

        if (errors.length > 0) {
            setError(errors.join('\n'));
        }

        if (newDocuments.length > 0) {
            onDocumentsChange([...documents, ...newDocuments]);
        }
    }, [documents, onDocumentsChange]);

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        processFiles(e.dataTransfer.files);
    }, [processFiles]);

    const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            processFiles(e.target.files);
        }
    }, [processFiles]);

    const removeDocument = (id: string) => {
        const doc = documents.find(d => d.id === id);
        if (doc?.previewUrl) {
            URL.revokeObjectURL(doc.previewUrl);
        }
        onDocumentsChange(documents.filter(d => d.id !== id));
    };

    const formatFileSize = (bytes: number) => {
        if (bytes < 1024) return `${bytes} B`;
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
        return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    };

    return (
        <div>
            <h2 className="text-body-bold mb-2">Upload Your Documents</h2>
            <p className="text-small text-t-secondary mb-6">
                Drop receipts, invoices, or screenshots from the same project. Our AI will analyze and extract all the details.
            </p>

            {/* Tips */}
            <div className="p-4 rounded-2xl bg-violet-500/5 border border-violet-500/10 mb-6">
                <div className="flex items-start gap-3">
                    <Lamp size={20} color="#8B5CF6" variant="Bold" className="shrink-0 mt-0.5" />
                    <div className="text-small">
                        <p className="font-medium text-t-primary mb-1">Tips for best results:</p>
                        <ul className="text-t-secondary space-y-1">
                            <li>• Upload documents from the <strong>same project</strong> for accurate grouping</li>
                            <li>• Include receipts with service names, amounts, and dates</li>
                            <li>• Screenshots of billing pages work great too</li>
                            <li>• We support PDF, PNG, JPG, and WebP files</li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Drop Zone */}
            <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`relative flex flex-col items-center justify-center p-8 rounded-3xl border-2 border-dashed transition-all ${
                    isDragging
                        ? 'border-violet-500 bg-violet-500/5'
                        : 'border-stroke-subtle bg-b-surface1 hover:border-stroke-highlight'
                }`}
            >
                <input
                    type="file"
                    multiple
                    accept={ACCEPTED_TYPES.join(',')}
                    onChange={handleFileInput}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div className={`flex items-center justify-center size-16 mb-4 rounded-2xl ${
                    isDragging ? 'bg-violet-500/10' : 'bg-b-surface2'
                }`}>
                    <CloudAdd size={32} color={isDragging ? '#8B5CF6' : '#9CA3AF'} variant="Bold" />
                </div>
                <p className="text-body-bold text-t-primary mb-1">
                    {isDragging ? 'Drop files here' : 'Drag & drop files here'}
                </p>
                <p className="text-small text-t-secondary mb-4">
                    or click to browse
                </p>
                <p className="text-xs text-t-tertiary">
                    PDF, PNG, JPG, WebP • Max 10MB per file • Up to {MAX_FILES} files
                </p>
            </div>

            {/* Error Message */}
            {error && (
                <div className="mt-4 p-4 rounded-2xl bg-red-500/10 border border-red-500/20">
                    <div className="flex items-start gap-3">
                        <Icon className="!w-5 !h-5 fill-red-500 shrink-0 mt-0.5" name="warning" />
                        <p className="text-small text-red-500 whitespace-pre-line">{error}</p>
                    </div>
                </div>
            )}

            {/* Uploaded Files List */}
            {documents.length > 0 && (
                <div className="mt-6">
                    <div className="flex items-center justify-between mb-3">
                        <h3 className="text-small font-medium text-t-secondary">
                            Uploaded Files ({documents.length})
                        </h3>
                        <button
                            onClick={() => onDocumentsChange([])}
                            className="text-small text-t-tertiary hover:text-red-500 transition-colors"
                        >
                            Clear all
                        </button>
                    </div>
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                        {documents.map((doc) => (
                            <div
                                key={doc.id}
                                className="flex items-center gap-3 p-3 rounded-2xl bg-b-surface1"
                            >
                                {doc.previewUrl ? (
                                    <div className="size-10 rounded-xl overflow-hidden bg-b-surface2 shrink-0">
                                        <img
                                            src={doc.previewUrl}
                                            alt={doc.name}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-center size-10 rounded-xl bg-red-500/10 shrink-0">
                                        <Icon className="!w-5 !h-5 fill-red-500" name="documents" />
                                    </div>
                                )}
                                <div className="flex-1 min-w-0">
                                    <p className="text-small font-medium text-t-primary truncate">
                                        {doc.name}
                                    </p>
                                    <p className="text-xs text-t-tertiary">
                                        {formatFileSize(doc.size)}
                                    </p>
                                </div>
                                <button
                                    onClick={() => removeDocument(doc.id)}
                                    className="flex items-center justify-center size-8 rounded-full hover:bg-b-surface2 transition-colors"
                                >
                                    <Icon className="!w-4 !h-4 fill-t-tertiary hover:fill-red-500" name="close" />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Actions */}
            <div className="flex justify-between gap-3 pt-6 mt-6 border-t border-stroke-subtle">
                <Button isStroke onClick={onBack}>
                    Back
                </Button>
                <Button
                    isPrimary
                    onClick={onContinue}
                    disabled={documents.length === 0}
                >
                    Analyze Documents ({documents.length})
                </Button>
            </div>
        </div>
    );
};

export default DocumentUpload;

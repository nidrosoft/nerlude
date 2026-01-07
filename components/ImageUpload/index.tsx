"use client";

import { useState, useRef, useCallback } from "react";
import Icon from "@/components/Icon";

interface Props {
    value?: string;
    onChange: (imageUrl: string | null) => void;
    className?: string;
    size?: "sm" | "md" | "lg";
}

const sizeClasses = {
    sm: "size-12",
    md: "size-16",
    lg: "size-20",
};

const ImageUpload = ({ value, onChange, className = "", size = "md" }: Props) => {
    const [isDragging, setIsDragging] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileSelect = useCallback(
        async (file: File) => {
            if (!file.type.startsWith("image/")) {
                alert("Please select an image file");
                return;
            }

            if (file.size > 5 * 1024 * 1024) {
                alert("Image must be less than 5MB");
                return;
            }

            setIsLoading(true);

            // Convert to base64 for demo purposes
            // In production, you'd upload to a storage service
            const reader = new FileReader();
            reader.onload = (e) => {
                const result = e.target?.result as string;
                onChange(result);
                setIsLoading(false);
            };
            reader.onerror = () => {
                alert("Failed to read file");
                setIsLoading(false);
            };
            reader.readAsDataURL(file);
        },
        [onChange]
    );

    const handleDrop = useCallback(
        (e: React.DragEvent) => {
            e.preventDefault();
            setIsDragging(false);

            const file = e.dataTransfer.files[0];
            if (file) {
                handleFileSelect(file);
            }
        },
        [handleFileSelect]
    );

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    }, []);

    const handleClick = () => {
        fileInputRef.current?.click();
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            handleFileSelect(file);
        }
    };

    const handleRemove = (e: React.MouseEvent) => {
        e.stopPropagation();
        onChange(null);
    };

    return (
        <div className={`relative ${className}`}>
            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleInputChange}
                className="hidden"
            />

            <button
                type="button"
                onClick={handleClick}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                className={`relative flex items-center justify-center ${sizeClasses[size]} rounded-2xl border-2 border-dashed transition-all overflow-hidden ${
                    isDragging
                        ? "border-primary1 bg-primary1/10"
                        : value
                        ? "border-transparent"
                        : "border-stroke-subtle hover:border-primary1 hover:bg-primary1/5"
                }`}
            >
                {isLoading ? (
                    <div className="flex items-center justify-center fill-t-tertiary">
                        <Icon className="!w-6 !h-6 animate-spin" name="gear" />
                    </div>
                ) : value ? (
                    <img
                        src={value}
                        alt="Uploaded"
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="flex flex-col items-center fill-t-tertiary">
                        <Icon className="!w-6 !h-6" name="camera" />
                    </div>
                )}
            </button>

            {value && (
                <button
                    type="button"
                    onClick={handleRemove}
                    className="absolute -top-1 -right-1 flex items-center justify-center size-5 rounded-full bg-red-500 fill-white hover:bg-red-600 transition-colors"
                >
                    <Icon className="!w-3 !h-3" name="close" />
                </button>
            )}
        </div>
    );
};

export default ImageUpload;

"use client";

import { useState } from "react";
import Modal from "@/components/Modal";
import Button from "@/components/Button";
import Icon from "@/components/Icon";
import { cn } from "@/lib/utils";

interface CreateFolderModalProps {
    isOpen: boolean;
    onClose: () => void;
    onCreateFolder: (folder: { name: string; description: string; color: string }) => void;
}

const folderColors = [
    { value: "slate", bg: "bg-slate-500", label: "Gray" },
    { value: "red", bg: "bg-red-500", label: "Red" },
    { value: "orange", bg: "bg-orange-500", label: "Orange" },
    { value: "amber", bg: "bg-amber-500", label: "Yellow" },
    { value: "green", bg: "bg-green-500", label: "Green" },
    { value: "teal", bg: "bg-teal-500", label: "Teal" },
    { value: "blue", bg: "bg-blue-500", label: "Blue" },
    { value: "indigo", bg: "bg-indigo-500", label: "Indigo" },
    { value: "purple", bg: "bg-purple-500", label: "Purple" },
    { value: "pink", bg: "bg-pink-500", label: "Pink" },
];

const CreateFolderModal = ({
    isOpen,
    onClose,
    onCreateFolder,
}: CreateFolderModalProps) => {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [color, setColor] = useState("slate");
    const [isCreating, setIsCreating] = useState(false);

    const handleSubmit = async () => {
        if (!name.trim()) return;

        setIsCreating(true);
        try {
            await onCreateFolder({ name: name.trim(), description: description.trim(), color });
            resetForm();
            onClose();
        } catch (error) {
            console.error('Error creating folder:', error);
        } finally {
            setIsCreating(false);
        }
    };

    const resetForm = () => {
        setName("");
        setDescription("");
        setColor("slate");
    };

    const handleClose = () => {
        resetForm();
        onClose();
    };

    return (
        <Modal classWrapper="!max-w-lg !p-6" open={isOpen} onClose={handleClose}>
            <div>
                <div className="flex items-center gap-3 mb-5">
                    <div className="flex items-center justify-center size-12 rounded-2xl bg-primary1/10">
                        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path opacity="0.4" d="M21.74 9.44H2V6.42C2 3.98 3.98 2 6.42 2H8.75C10.38 2 10.89 2.53 11.54 3.4L12.94 5.26C13.25 5.67 13.29 5.73 13.87 5.73H16.66C19.03 5.72 21.05 7.28 21.74 9.44Z" className="fill-primary1"/>
                            <path d="M21.99 10.8404C21.97 10.3504 21.89 9.89043 21.74 9.44043H2V16.6504C2 19.6004 4.4 22.0004 7.35 22.0004H16.65C19.6 22.0004 22 19.6004 22 16.6504V11.0704C22 11.0004 22 10.9104 21.99 10.8404ZM14.5 16.2504H12.81V18.0004C12.81 18.4104 12.47 18.7504 12.06 18.7504C11.65 18.7504 11.31 18.4104 11.31 18.0004V16.2504H9.5C9.09 16.2504 8.75 15.9104 8.75 15.5004C8.75 15.0904 9.09 14.7504 9.5 14.7504H11.31V13.0004C11.31 12.5904 11.65 12.2504 12.06 12.2504C12.47 12.2504 12.81 12.5904 12.81 13.0004V14.7504H14.5C14.91 14.7504 15.25 15.0904 15.25 15.5004C15.25 15.9104 14.91 16.2504 14.5 16.2504Z" className="fill-primary1"/>
                        </svg>
                    </div>
                    <div>
                        <h2 className="text-h3">Create Folder</h2>
                        <p className="text-small text-t-secondary">Organize your assets into folders</p>
                    </div>
                </div>

                {/* Folder Name */}
                <div className="mb-4">
                    <label className="block text-small font-medium mb-2">Folder Name</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g., Marketing Assets, Logos 2024"
                        className="w-full h-12 px-5 rounded-full bg-b-surface2 border-[1.5px] border-stroke-subtle focus:border-primary1 focus:outline-none text-body transition-colors"
                        autoFocus
                    />
                </div>

                {/* Description */}
                <div className="mb-4">
                    <label className="block text-small font-medium mb-2">Description (optional)</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="What kind of assets will this folder contain?"
                        rows={2}
                        className="w-full px-5 py-3 rounded-2xl bg-b-surface2 border-[1.5px] border-stroke-subtle focus:border-primary1 focus:outline-none text-body transition-colors resize-none"
                    />
                </div>

                {/* Color Picker */}
                <div className="mb-6">
                    <label className="block text-small font-medium mb-2">Folder Color</label>
                    <div className="flex flex-wrap gap-2">
                        {folderColors.map((c) => (
                            <button
                                key={c.value}
                                onClick={() => setColor(c.value)}
                                className={cn(
                                    "size-8 rounded-full transition-all",
                                    c.bg,
                                    color === c.value 
                                        ? "ring-2 ring-offset-2 ring-offset-b-surface1 ring-t-primary scale-110" 
                                        : "hover:scale-105"
                                )}
                                title={c.label}
                            />
                        ))}
                    </div>
                </div>

                {/* Preview */}
                <div className="mb-6 p-4 rounded-2xl bg-b-surface2 border border-stroke-subtle">
                    <p className="text-xs text-t-tertiary mb-2">Preview</p>
                    <div className="flex items-center gap-3">
                        <div className={cn(
                            "flex items-center justify-center size-10 rounded-xl",
                            `bg-${color}-500/10`
                        )}>
                            <Icon className={cn("!w-5 !h-5", `fill-${color}-500`)} name="folder" />
                        </div>
                        <div>
                            <p className="text-body font-medium">{name || "Folder Name"}</p>
                            <p className="text-xs text-t-tertiary">0 assets</p>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                    <Button className="flex-1" isStroke onClick={handleClose} disabled={isCreating}>
                        Cancel
                    </Button>
                    <Button
                        className="flex-1"
                        isPrimary
                        onClick={handleSubmit}
                        disabled={!name.trim() || isCreating}
                    >
                        {isCreating ? (
                            <>
                                <div className="animate-spin mr-2">
                                    <Icon className="!w-5 !h-5" name="loading" />
                                </div>
                                Creating...
                            </>
                        ) : (
                            <>
                                <Icon className="mr-2 !w-5 !h-5" name="plus" />
                                Create Folder
                            </>
                        )}
                    </Button>
                </div>
            </div>
        </Modal>
    );
};

export default CreateFolderModal;

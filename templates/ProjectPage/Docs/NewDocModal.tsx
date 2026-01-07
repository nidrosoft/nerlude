"use client";

import { useState } from "react";
import Icon from "@/components/Icon";
import Button from "@/components/Button";
import { useDocsContext } from "./DocsContext";
import { DocumentType } from "./types";
import { documentTemplates, commonEmojis } from "./data";

const NewDocModal = () => {
    const { showNewDocModal, setShowNewDocModal, handleCreateDocument } = useDocsContext();
    
    const [newDocTitle, setNewDocTitle] = useState("");
    const [selectedTemplate, setSelectedTemplate] = useState<DocumentType>("notes");
    const [selectedEmoji, setSelectedEmoji] = useState<string | null>(null);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);

    const handleCreate = () => {
        handleCreateDocument(newDocTitle, selectedTemplate, selectedEmoji);
        // Reset form
        setNewDocTitle("");
        setSelectedTemplate("notes");
        setSelectedEmoji(null);
        setShowEmojiPicker(false);
    };

    const handleClose = () => {
        setShowNewDocModal(false);
        setNewDocTitle("");
        setSelectedTemplate("notes");
        setSelectedEmoji(null);
        setShowEmojiPicker(false);
    };

    if (!showNewDocModal) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-[#282828]/90" onClick={handleClose} />
            <div className="relative z-10 w-full max-w-3xl mx-4 p-8 rounded-4xl bg-b-surface1 max-h-[90vh] overflow-auto">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-h4">Create New Document</h3>
                    <button
                        onClick={handleClose}
                        className="flex items-center justify-center size-10 rounded-xl hover:bg-b-surface2 fill-t-tertiary hover:fill-t-primary transition-colors"
                    >
                        <Icon className="!w-5 !h-5" name="close" />
                    </button>
                </div>

                {/* Document Title */}
                <div className="mb-6">
                    <label className="block text-small font-medium text-t-secondary mb-2">
                        Document Title (optional)
                    </label>
                    <input
                        type="text"
                        value={newDocTitle}
                        onChange={(e) => setNewDocTitle(e.target.value)}
                        placeholder="Enter a custom title or leave blank to use template name"
                        className="w-full px-4 py-3 rounded-xl bg-b-surface2 text-body text-t-primary placeholder:text-t-tertiary focus:outline-none focus:ring-2 focus:ring-primary1/20"
                    />
                </div>

                {/* Custom Emoji */}
                <div className="mb-6">
                    <label className="block text-small font-medium text-t-secondary mb-2">
                        Custom Icon (optional)
                    </label>
                    <div className="relative">
                        <button
                            type="button"
                            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                            className="flex items-center gap-3 px-4 py-3 rounded-xl bg-b-surface2 text-body text-t-primary hover:bg-b-surface2/80 transition-colors"
                        >
                            {selectedEmoji ? (
                                <span className="text-xl">{selectedEmoji}</span>
                            ) : (
                                <span className="text-t-tertiary">Select an emoji</span>
                            )}
                            <Icon className="!w-4 !h-4 fill-t-tertiary ml-auto" name="chevron" />
                        </button>
                        {showEmojiPicker && (
                            <div className="absolute top-full left-0 mt-2 p-4 rounded-2xl bg-b-surface2 shadow-lg border border-stroke-subtle z-10 w-80">
                                <div className="flex items-center justify-between mb-3">
                                    <span className="text-small font-medium text-t-secondary">Pick an emoji</span>
                                    {selectedEmoji && (
                                        <button
                                            onClick={() => {
                                                setSelectedEmoji(null);
                                                setShowEmojiPicker(false);
                                            }}
                                            className="text-xs text-t-tertiary hover:text-t-primary"
                                        >
                                            Clear
                                        </button>
                                    )}
                                </div>
                                <div className="grid grid-cols-8 gap-1">
                                    {commonEmojis.map((emoji) => (
                                        <button
                                            key={emoji}
                                            type="button"
                                            onClick={() => {
                                                setSelectedEmoji(emoji);
                                                setShowEmojiPicker(false);
                                            }}
                                            className={`flex items-center justify-center size-8 rounded-lg text-lg hover:bg-b-surface1 transition-colors ${
                                                selectedEmoji === emoji ? "bg-primary1/20" : ""
                                            }`}
                                        >
                                            {emoji}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                    <p className="text-xs text-t-tertiary mt-2">
                        Choose an emoji to replace the default icon, or leave blank to use the template icon.
                    </p>
                </div>

                {/* Template Selection */}
                <div className="mb-6">
                    <label className="block text-small font-medium text-t-secondary mb-3">
                        Choose a Template
                    </label>
                    <div className="grid grid-cols-2 gap-3 max-md:grid-cols-1">
                        {documentTemplates.map((template) => (
                            <button
                                key={template.type}
                                onClick={() => setSelectedTemplate(template.type)}
                                className={`flex items-start p-4 rounded-2xl text-left transition-all ${
                                    selectedTemplate === template.type
                                        ? "bg-primary1/10 border-2 border-primary1"
                                        : "bg-b-surface2 border-2 border-transparent hover:border-stroke-subtle"
                                }`}
                            >
                                <div className="flex items-center justify-center size-10 mr-3 rounded-xl bg-b-surface1 fill-t-secondary shrink-0">
                                    <Icon className="!w-5 !h-5" name={template.icon} />
                                </div>
                                <div className="min-w-0">
                                    <div className="font-medium text-t-primary">{template.title}</div>
                                    <div className="text-xs text-t-tertiary mt-0.5 line-clamp-2">
                                        {template.description}
                                    </div>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-3">
                    <Button isStroke onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button isPrimary onClick={handleCreate}>
                        Create Document
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default NewDocModal;

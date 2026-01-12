"use client";

import { useRef } from "react";
import Icon from "@/components/Icon";
import { useDocsContext } from "./DocsContext";

const DocsEditor = () => {
    const { 
        activeDoc, 
        isExpanded, 
        setIsExpanded, 
        setShowDeleteConfirm,
        handleContentChange,
        saveStatus,
        documents
    } = useDocsContext();
    
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const getSaveStatusText = () => {
        switch (saveStatus) {
            case "saving":
                return "Saving...";
            case "saved":
                return "Saved";
            case "unsaved":
                return "Unsaved changes";
        }
    };

    const getSaveStatusIcon = () => {
        switch (saveStatus) {
            case "saving":
                return "loader";
            case "saved":
                return "check";
            case "unsaved":
                return "edit";
        }
    };

    // Show empty state if no active document
    if (!activeDoc) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center rounded-4xl bg-b-surface2 p-8">
                <div className="flex items-center justify-center size-16 mb-4 rounded-2xl bg-b-surface1 fill-t-tertiary">
                    <Icon className="!w-8 !h-8" name="edit" />
                </div>
                <h3 className="text-body-bold text-t-primary mb-2">No document selected</h3>
                <p className="text-small text-t-secondary text-center">
                    Select a document from the sidebar or create a new one to start writing.
                </p>
            </div>
        );
    }

    return (
        <div className={`flex-1 flex flex-col rounded-4xl bg-b-surface2 ${isExpanded ? "min-h-[calc(100vh-120px)]" : ""}`}>
            {/* Editor Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-stroke-subtle">
                <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center size-8 rounded-lg bg-b-surface1 fill-t-secondary">
                        {activeDoc.emoji ? (
                            <span className="text-lg">{activeDoc.emoji}</span>
                        ) : (
                            <Icon className="!w-4 !h-4" name={activeDoc.icon || "edit"} />
                        )}
                    </div>
                    <span className="font-medium text-t-primary">{activeDoc.title}</span>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="flex items-center justify-center size-8 rounded-lg hover:bg-b-surface1 fill-t-tertiary hover:fill-t-primary transition-colors"
                        title={isExpanded ? "Exit focus mode" : "Focus mode"}
                    >
                        <Icon className="!w-4 !h-4" name={isExpanded ? "chevron" : "export"} />
                    </button>
                    <button
                        onClick={() => setShowDeleteConfirm(true)}
                        className="flex items-center justify-center size-8 rounded-lg hover:bg-red-500/10 fill-t-tertiary hover:fill-red-500 transition-colors"
                        title="Delete document"
                        disabled={documents.length <= 1}
                    >
                        <Icon className="!w-4 !h-4" name="close" />
                    </button>
                </div>
            </div>

            {/* Editor Content */}
            <div className="flex-1 p-6">
                <textarea
                    ref={textareaRef}
                    className={`w-full bg-transparent text-body text-t-primary resize-none focus:outline-none ${
                        isExpanded ? "min-h-[calc(100vh-280px)]" : "h-96"
                    }`}
                    value={activeDoc.content || ""}
                    onChange={(e) => handleContentChange(e.target.value)}
                    placeholder="Start writing..."
                />
            </div>

            {/* Editor Footer */}
            <div className="flex items-center justify-between px-6 py-3 border-t border-stroke-subtle">
                <span className="text-xs text-t-tertiary">Markdown supported</span>
                <div className="flex items-center gap-1.5 text-xs text-t-tertiary">
                    <Icon 
                        className={`!w-3 !h-3 ${saveStatus === "saving" ? "animate-spin" : ""} ${
                            saveStatus === "saved" ? "fill-green-500" : "fill-t-tertiary"
                        }`} 
                        name={getSaveStatusIcon()} 
                    />
                    <span>{getSaveStatusText()}</span>
                </div>
            </div>
        </div>
    );
};

export default DocsEditor;

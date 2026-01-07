"use client";

import { useState } from "react";
import Icon from "@/components/Icon";
import { useDocsContext } from "./DocsContext";
import { Document, DocumentType } from "./types";

const DocsSidebar = () => {
    const { 
        documents, 
        activeDocId, 
        setActiveDocId, 
        isExpanded,
        getCategoryInfo 
    } = useDocsContext();
    
    const [expandedCategories, setExpandedCategories] = useState<DocumentType[]>([]);

    // Group documents by type
    const documentsByType = documents.reduce((acc, doc) => {
        if (!acc[doc.type]) {
            acc[doc.type] = [];
        }
        acc[doc.type].push(doc);
        return acc;
    }, {} as Record<DocumentType, Document[]>);

    const toggleCategory = (type: DocumentType) => {
        setExpandedCategories((prev) =>
            prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
        );
    };

    return (
        <div className={`w-64 shrink-0 max-md:w-full ${isExpanded ? "max-md:hidden" : ""}`}>
            <div className="p-4 rounded-3xl bg-b-surface2">
                <div className="flex items-center justify-between mb-4 px-2">
                    <span className="text-small font-medium text-t-secondary">Documents</span>
                    <span className="text-xs text-t-tertiary">{documents.length}</span>
                </div>
                <div className="space-y-2">
                    {Object.entries(documentsByType).map(([type, docs]) => {
                        const categoryInfo = getCategoryInfo(type as DocumentType);
                        const isCategoryExpanded = expandedCategories.includes(type as DocumentType);
                        const hasMultiple = docs.length > 1;

                        if (!hasMultiple) {
                            // Single document - show directly
                            const doc = docs[0];
                            return (
                                <button
                                    key={doc.id}
                                    onClick={() => setActiveDocId(doc.id)}
                                    className={`flex items-center w-full px-3 py-2.5 rounded-xl text-left text-small transition-all ${
                                        activeDocId === doc.id
                                            ? "bg-b-surface1 text-t-primary fill-t-primary"
                                            : "text-t-secondary fill-t-secondary hover:bg-b-surface1"
                                    }`}
                                >
                                    {doc.emoji ? (
                                        <span className="mr-2.5 text-base">{doc.emoji}</span>
                                    ) : (
                                        <Icon className="mr-2.5 !w-4 !h-4" name={doc.icon} />
                                    )}
                                    <span className="truncate">{doc.title}</span>
                                </button>
                            );
                        }

                        // Multiple documents - show collapsible group
                        return (
                            <div key={type} className="space-y-1">
                                <button
                                    onClick={() => toggleCategory(type as DocumentType)}
                                    className="flex items-center w-full px-3 py-2.5 rounded-xl text-left text-small text-t-secondary fill-t-secondary hover:bg-b-surface1 transition-all"
                                >
                                    <Icon className="mr-2.5 !w-4 !h-4" name={categoryInfo.icon} />
                                    <span className="truncate flex-1">{categoryInfo.title}</span>
                                    <span className="text-xs text-t-tertiary mr-2">{docs.length}</span>
                                    <Icon 
                                        className={`!w-3 !h-3 transition-transform ${isCategoryExpanded ? "rotate-180" : ""}`} 
                                        name="chevron" 
                                    />
                                </button>
                                {isCategoryExpanded && (
                                    <div className="ml-4 pl-3 border-l border-stroke-subtle space-y-1">
                                        {docs.map((doc) => (
                                            <button
                                                key={doc.id}
                                                onClick={() => setActiveDocId(doc.id)}
                                                className={`flex items-center w-full px-3 py-2 rounded-xl text-left text-small transition-all ${
                                                    activeDocId === doc.id
                                                        ? "bg-b-surface1 text-t-primary fill-t-primary"
                                                        : "text-t-tertiary fill-t-tertiary hover:bg-b-surface1 hover:text-t-secondary"
                                                }`}
                                            >
                                                {doc.emoji ? (
                                                    <span className="mr-2 text-sm">{doc.emoji}</span>
                                                ) : (
                                                    <span className="w-1.5 h-1.5 rounded-full bg-current mr-2.5 shrink-0" />
                                                )}
                                                <span className="truncate">{doc.title}</span>
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default DocsSidebar;

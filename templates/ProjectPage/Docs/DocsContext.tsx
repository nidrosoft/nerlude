"use client";

import { createContext, useContext, useState, useCallback, useRef, useEffect, ReactNode } from "react";
import { Document, DocumentType, SaveStatus } from "./types";
import { initialDocs, documentTemplates } from "./data";

interface DocsContextType {
    documents: Document[];
    activeDocId: string;
    activeDoc: Document | undefined;
    saveStatus: SaveStatus;
    isExpanded: boolean;
    showNewDocModal: boolean;
    showDeleteConfirm: boolean;
    
    setActiveDocId: (id: string) => void;
    setIsExpanded: (expanded: boolean) => void;
    setShowNewDocModal: (show: boolean) => void;
    setShowDeleteConfirm: (show: boolean) => void;
    handleContentChange: (content: string) => void;
    handleCreateDocument: (title: string, templateType: DocumentType, emoji: string | null) => void;
    handleDeleteDocument: () => void;
    getCategoryInfo: (type: DocumentType) => { title: string; icon: string };
}

const DocsContext = createContext<DocsContextType | null>(null);

export const useDocsContext = () => {
    const context = useContext(DocsContext);
    if (!context) {
        throw new Error("useDocsContext must be used within DocsProvider");
    }
    return context;
};

interface DocsProviderProps {
    children: ReactNode;
    projectId: string;
    externalShowNewDocModal?: boolean;
    onExternalCloseNewDocModal?: () => void;
}

export const DocsProvider = ({ children, projectId, externalShowNewDocModal = false, onExternalCloseNewDocModal }: DocsProviderProps) => {
    const [documents, setDocuments] = useState<Document[]>(initialDocs);
    const [activeDocId, setActiveDocId] = useState<string>(initialDocs[0].id);
    const [isExpanded, setIsExpanded] = useState(false);
    const [internalShowNewDocModal, setInternalShowNewDocModal] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [saveStatus, setSaveStatus] = useState<SaveStatus>("saved");
    const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    // Combine internal and external modal state
    const showNewDocModal = externalShowNewDocModal || internalShowNewDocModal;
    
    const setShowNewDocModal = (show: boolean) => {
        setInternalShowNewDocModal(show);
        if (!show) {
            onExternalCloseNewDocModal?.();
        }
    };

    const activeDoc = documents.find((d) => d.id === activeDocId);

    const handleContentChange = useCallback((newContent: string) => {
        setSaveStatus("unsaved");
        
        setDocuments((prev) =>
            prev.map((doc) =>
                doc.id === activeDocId
                    ? { ...doc, content: newContent, updatedAt: new Date().toISOString() }
                    : doc
            )
        );

        if (saveTimeoutRef.current) {
            clearTimeout(saveTimeoutRef.current);
        }

        saveTimeoutRef.current = setTimeout(() => {
            setSaveStatus("saving");
            setTimeout(() => {
                setSaveStatus("saved");
            }, 300);
        }, 500);
    }, [activeDocId]);

    const handleCreateDocument = useCallback((title: string, templateType: DocumentType, emoji: string | null) => {
        const template = documentTemplates.find((t) => t.type === templateType);
        if (!template) return;

        const newDoc: Document = {
            id: `doc-${Date.now()}`,
            title: title || template.title,
            icon: template.icon,
            emoji: emoji || undefined,
            type: templateType,
            content: template.defaultContent,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };

        setDocuments((prev) => [...prev, newDoc]);
        setActiveDocId(newDoc.id);
        setShowNewDocModal(false);
    }, []);

    const handleDeleteDocument = useCallback(() => {
        if (documents.length <= 1) return;
        
        const newDocs = documents.filter((d) => d.id !== activeDocId);
        setDocuments(newDocs);
        setActiveDocId(newDocs[0].id);
        setShowDeleteConfirm(false);
    }, [documents, activeDocId]);

    const getCategoryInfo = useCallback((type: DocumentType) => {
        const template = documentTemplates.find((t) => t.type === type);
        return template || { title: type, icon: "edit" };
    }, []);

    // Cleanup timeout on unmount
    useEffect(() => {
        return () => {
            if (saveTimeoutRef.current) {
                clearTimeout(saveTimeoutRef.current);
            }
        };
    }, []);

    // Handle escape key to exit expanded mode
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape" && isExpanded) {
                setIsExpanded(false);
            }
        };
        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, [isExpanded]);

    const value: DocsContextType = {
        documents,
        activeDocId,
        activeDoc,
        saveStatus,
        isExpanded,
        showNewDocModal,
        showDeleteConfirm,
        setActiveDocId,
        setIsExpanded,
        setShowNewDocModal,
        setShowDeleteConfirm,
        handleContentChange,
        handleCreateDocument,
        handleDeleteDocument,
        getCategoryInfo,
    };

    return (
        <DocsContext.Provider value={value}>
            {children}
        </DocsContext.Provider>
    );
};

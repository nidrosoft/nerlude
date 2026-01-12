"use client";

import { createContext, useContext, useState, useCallback, useRef, useEffect, ReactNode } from "react";
import { Document, DocumentType, SaveStatus } from "./types";
import { documentTemplates } from "./data";

interface DocsContextType {
    documents: Document[];
    activeDocId: string;
    activeDoc: Document | undefined;
    saveStatus: SaveStatus;
    isExpanded: boolean;
    isLoading: boolean;
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
    const [documents, setDocuments] = useState<Document[]>([]);
    const [activeDocId, setActiveDocId] = useState<string>("");
    const [isExpanded, setIsExpanded] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [internalShowNewDocModal, setInternalShowNewDocModal] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [saveStatus, setSaveStatus] = useState<SaveStatus>("saved");
    const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    // Fetch documents from API
    const fetchDocuments = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`/api/projects/${projectId}/documents`);
            if (response.ok) {
                const data = await response.json();
                const mappedDocs: Document[] = data.map((d: any) => ({
                    id: d.id,
                    title: d.title,
                    icon: d.icon || 'edit',
                    emoji: d.emoji,
                    content: d.content || '',
                    type: d.doc_type || 'notes',
                    createdAt: d.created_at,
                    updatedAt: d.updated_at,
                }));
                setDocuments(mappedDocs);
                if (mappedDocs.length > 0 && !activeDocId) {
                    setActiveDocId(mappedDocs[0].id);
                }
            }
        } catch (error) {
            console.error('Error fetching documents:', error);
        } finally {
            setIsLoading(false);
        }
    }, [projectId, activeDocId]);

    useEffect(() => {
        fetchDocuments();
    }, [fetchDocuments]);

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

        // Auto-save after 1 second of no typing
        saveTimeoutRef.current = setTimeout(async () => {
            setSaveStatus("saving");
            try {
                const response = await fetch(`/api/projects/${projectId}/documents/${activeDocId}`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ content: newContent }),
                });
                if (response.ok) {
                    setSaveStatus("saved");
                } else {
                    console.error('Failed to save document');
                    setSaveStatus("unsaved");
                }
            } catch (error) {
                console.error('Error saving document:', error);
                setSaveStatus("unsaved");
            }
        }, 1000);
    }, [activeDocId, projectId]);

    const handleCreateDocument = useCallback(async (title: string, templateType: DocumentType, emoji: string | null) => {
        const template = documentTemplates.find((t) => t.type === templateType);
        if (!template) return;

        try {
            const response = await fetch(`/api/projects/${projectId}/documents`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title: title || template.title,
                    doc_type: templateType,
                    icon: template.icon,
                    emoji: emoji || null,
                    content: template.defaultContent,
                }),
            });

            if (response.ok) {
                const data = await response.json();
                const newDoc: Document = {
                    id: data.id,
                    title: data.title,
                    icon: data.icon || template.icon,
                    emoji: data.emoji || undefined,
                    type: data.doc_type,
                    content: data.content || template.defaultContent,
                    createdAt: data.created_at,
                    updatedAt: data.updated_at,
                };
                setDocuments((prev) => [newDoc, ...prev]);
                setActiveDocId(newDoc.id);
                setShowNewDocModal(false);
            } else {
                console.error('Failed to create document');
            }
        } catch (error) {
            console.error('Error creating document:', error);
        }
    }, [projectId]);

    const handleDeleteDocument = useCallback(async () => {
        if (documents.length <= 1) return;
        
        try {
            const response = await fetch(`/api/projects/${projectId}/documents/${activeDocId}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                const newDocs = documents.filter((d) => d.id !== activeDocId);
                setDocuments(newDocs);
                setActiveDocId(newDocs[0]?.id || "");
                setShowDeleteConfirm(false);
            } else {
                console.error('Failed to delete document');
            }
        } catch (error) {
            console.error('Error deleting document:', error);
        }
    }, [documents, activeDocId, projectId]);

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
        isLoading,
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

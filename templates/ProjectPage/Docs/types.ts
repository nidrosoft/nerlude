export interface Document {
    id: string;
    title: string;
    icon: string;
    emoji?: string;
    content: string;
    type: DocumentType;
    createdAt: string;
    updatedAt: string;
}

export type DocumentType = 
    | "architecture"
    | "getting-started"
    | "decisions"
    | "api-reference"
    | "changelog"
    | "roadmap"
    | "troubleshooting"
    | "meeting-notes"
    | "environment"
    | "notes";

export interface DocumentTemplate {
    type: DocumentType;
    title: string;
    icon: string;
    description: string;
    defaultContent: string;
}

export type SaveStatus = "saved" | "saving" | "unsaved";

import { ProjectType } from "@/types";

export type Step = "method" | "basics" | "template" | "services" | "confirm" | "upload" | "processing" | "review" | "confirm-import" | "success" | "email-sync" | "email-processing";
export type FlowType = "manual" | "documents" | "email";

export interface ProjectTemplate {
    id: string;
    name: string;
    description: string;
    icon: string;
    type: ProjectType;
    suggestedServices: string[];
}

export interface ProjectTypeOption {
    value: ProjectType;
    label: string;
    icon: string;
    color: string;
}

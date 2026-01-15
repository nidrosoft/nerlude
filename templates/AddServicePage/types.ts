import { ServiceCategory } from "@/types";
import { ServiceRegistryItem } from "@/registry";

export type Step = "category" | "service" | "configure" | "confirm" | "upload" | "processing" | "review-extracted";

export type FlowType = "manual" | "upload";

export interface StepInfo {
    id: string;
    label: string;
    number: number;
}

export const manualSteps: StepInfo[] = [
    { id: "category", label: "Category", number: 1 },
    { id: "service", label: "Service", number: 2 },
    { id: "configure", label: "Configure", number: 3 },
    { id: "confirm", label: "Confirm", number: 4 },
];

export const uploadSteps: StepInfo[] = [
    { id: "upload", label: "Upload", number: 1 },
    { id: "processing", label: "Analyze", number: 2 },
    { id: "review-extracted", label: "Review", number: 3 },
    { id: "confirm", label: "Add", number: 4 },
];

export const steps = manualSteps;

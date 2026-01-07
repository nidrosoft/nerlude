import { ServiceCategory } from "@/types";
import { ServiceRegistryItem } from "@/registry";

export type Step = "category" | "service" | "configure" | "confirm";

export interface StepInfo {
    id: string;
    label: string;
    number: number;
}

export const steps: StepInfo[] = [
    { id: "category", label: "Category", number: 1 },
    { id: "service", label: "Service", number: 2 },
    { id: "configure", label: "Configure", number: 3 },
    { id: "confirm", label: "Confirm", number: 4 },
];

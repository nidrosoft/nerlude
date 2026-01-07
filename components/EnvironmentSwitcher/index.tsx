"use client";

import { ProjectEnvironment } from "@/types";
import { useProjectStore } from "@/stores/projectStore";
import { cn } from "@/lib/utils";
import Icon from "@/components/Icon";

const environmentConfig: Record<ProjectEnvironment, { 
    label: string; 
    color: string; 
    bgColor: string;
    borderColor: string;
    icon: string;
}> = {
    production: {
        label: "Production",
        color: "text-green-600",
        bgColor: "bg-green-500/10",
        borderColor: "border-green-500/30",
        icon: "verification",
    },
    staging: {
        label: "Staging",
        color: "text-amber-600",
        bgColor: "bg-amber-500/10",
        borderColor: "border-amber-500/30",
        icon: "generation",
    },
    development: {
        label: "Development",
        color: "text-blue-600",
        bgColor: "bg-blue-500/10",
        borderColor: "border-blue-500/30",
        icon: "edit",
    },
};

interface EnvironmentSwitcherProps {
    className?: string;
    compact?: boolean;
}

const EnvironmentSwitcher = ({ className, compact = false }: EnvironmentSwitcherProps) => {
    const { activeEnvironment, setActiveEnvironment } = useProjectStore();
    const config = environmentConfig[activeEnvironment];

    const environments: ProjectEnvironment[] = ['production', 'staging', 'development'];

    if (compact) {
        return (
            <div className={cn("relative group", className)}>
                <button className={cn(
                    "flex items-center gap-2 h-10 px-4 rounded-full border-[1.5px] transition-all",
                    config.bgColor,
                    config.borderColor,
                    "hover:shadow-hover"
                )}>
                    <span className={cn("w-2 h-2 rounded-full", config.bgColor.replace("/10", ""))} />
                    <span className={cn("text-small font-medium", config.color)}>
                        {config.label}
                    </span>
                    <Icon className="!w-4 !h-4 fill-t-tertiary" name="chevron" />
                </button>
                
                {/* Dropdown */}
                <div className="absolute top-full right-0 mt-2 w-48 py-2 bg-b-surface1 rounded-2xl border border-stroke-subtle shadow-hover opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                    {environments.map((env) => {
                        const envConfig = environmentConfig[env];
                        const isActive = env === activeEnvironment;
                        return (
                            <button
                                key={env}
                                onClick={() => setActiveEnvironment(env)}
                                className={cn(
                                    "w-full flex items-center gap-3 px-4 py-2.5 transition-colors",
                                    isActive ? "bg-b-surface2" : "hover:bg-b-surface2"
                                )}
                            >
                                <span className={cn(
                                    "w-2 h-2 rounded-full",
                                    envConfig.bgColor.replace("/10", "")
                                )} />
                                <span className={cn(
                                    "text-small font-medium",
                                    isActive ? envConfig.color : "text-t-secondary"
                                )}>
                                    {envConfig.label}
                                </span>
                                {isActive && (
                                    <Icon className={cn("!w-4 !h-4 ml-auto", envConfig.color.replace("text-", "fill-"))} name="check" />
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>
        );
    }

    return (
        <div className={cn("flex items-center gap-1 p-1 bg-b-surface2 rounded-full", className)}>
            {environments.map((env) => {
                const envConfig = environmentConfig[env];
                const isActive = env === activeEnvironment;
                return (
                    <button
                        key={env}
                        onClick={() => setActiveEnvironment(env)}
                        className={cn(
                            "flex items-center gap-2 h-10 px-4 rounded-full transition-all",
                            isActive 
                                ? cn(envConfig.bgColor, envConfig.borderColor, "border-[1.5px]")
                                : "hover:bg-b-surface1"
                        )}
                    >
                        <span className={cn(
                            "w-2 h-2 rounded-full",
                            isActive ? envConfig.bgColor.replace("/10", "") : "bg-t-tertiary"
                        )} />
                        <span className={cn(
                            "text-small font-medium",
                            isActive ? envConfig.color : "text-t-tertiary"
                        )}>
                            {envConfig.label}
                        </span>
                    </button>
                );
            })}
        </div>
    );
};

export default EnvironmentSwitcher;

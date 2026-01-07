"use client";

import { cn } from "@/lib/utils";

interface SkeletonProps {
    className?: string;
    variant?: "text" | "circular" | "rectangular" | "rounded";
    width?: string | number;
    height?: string | number;
    animation?: "pulse" | "wave" | "none";
}

const Skeleton = ({
    className,
    variant = "rectangular",
    width,
    height,
    animation = "pulse",
}: SkeletonProps) => {
    const baseClasses = "bg-b-surface2";
    
    const variantClasses = {
        text: "rounded",
        circular: "rounded-full",
        rectangular: "rounded-none",
        rounded: "rounded-2xl",
    };
    
    const animationClasses = {
        pulse: "animate-pulse",
        wave: "animate-shimmer",
        none: "",
    };
    
    const style: React.CSSProperties = {
        width: width,
        height: height,
    };
    
    return (
        <div
            className={cn(
                baseClasses,
                variantClasses[variant],
                animationClasses[animation],
                className
            )}
            style={style}
        />
    );
};

// Pre-built skeleton patterns
export const SkeletonText = ({ lines = 3, className }: { lines?: number; className?: string }) => (
    <div className={cn("space-y-2", className)}>
        {Array.from({ length: lines }).map((_, i) => (
            <Skeleton
                key={i}
                variant="text"
                height={16}
                className={i === lines - 1 ? "w-3/4" : "w-full"}
            />
        ))}
    </div>
);

export const SkeletonCard = ({ className }: { className?: string }) => (
    <div className={cn("p-6 rounded-3xl bg-b-surface2 space-y-4", className)}>
        <div className="flex items-center gap-4">
            <Skeleton variant="circular" width={48} height={48} />
            <div className="flex-1 space-y-2">
                <Skeleton variant="text" height={20} className="w-1/2" />
                <Skeleton variant="text" height={14} className="w-1/3" />
            </div>
        </div>
        <SkeletonText lines={2} />
    </div>
);

export const SkeletonProjectCard = ({ className }: { className?: string }) => (
    <div className={cn("p-6 rounded-3xl border border-stroke-subtle bg-b-surface1 space-y-4", className)}>
        <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
                <Skeleton variant="rounded" width={48} height={48} />
                <div className="space-y-2">
                    <Skeleton variant="text" height={20} className="w-32" />
                    <Skeleton variant="text" height={14} className="w-20" />
                </div>
            </div>
            <Skeleton variant="rounded" width={24} height={24} />
        </div>
        <div className="flex items-center justify-between pt-2">
            <Skeleton variant="text" height={16} className="w-16" />
            <Skeleton variant="text" height={16} className="w-24" />
        </div>
    </div>
);

export const SkeletonTable = ({ rows = 5, cols = 4, className }: { rows?: number; cols?: number; className?: string }) => (
    <div className={cn("space-y-3", className)}>
        {/* Header */}
        <div className="flex gap-4 pb-2 border-b border-stroke-subtle">
            {Array.from({ length: cols }).map((_, i) => (
                <Skeleton key={i} variant="text" height={14} className="flex-1" />
            ))}
        </div>
        {/* Rows */}
        {Array.from({ length: rows }).map((_, rowIndex) => (
            <div key={rowIndex} className="flex gap-4 py-2">
                {Array.from({ length: cols }).map((_, colIndex) => (
                    <Skeleton key={colIndex} variant="text" height={16} className="flex-1" />
                ))}
            </div>
        ))}
    </div>
);

export const SkeletonStats = ({ count = 4, className }: { count?: number; className?: string }) => (
    <div className={cn("grid gap-4", className)} style={{ gridTemplateColumns: `repeat(${count}, 1fr)` }}>
        {Array.from({ length: count }).map((_, i) => (
            <div key={i} className="p-4 rounded-2xl bg-b-surface2 space-y-2">
                <Skeleton variant="text" height={14} className="w-1/2" />
                <Skeleton variant="text" height={28} className="w-3/4" />
            </div>
        ))}
    </div>
);

export default Skeleton;

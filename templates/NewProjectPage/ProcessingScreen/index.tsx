"use client";

import { useEffect, useState } from "react";
import Icon from "@/components/Icon";
import { UploadedDocument } from "@/types";

type Props = {
    documents: UploadedDocument[];
    onComplete: () => void;
};

const processingSteps = [
    { id: 'upload', label: 'Uploading documents', icon: 'upload' },
    { id: 'analyze', label: 'Analyzing content with AI', icon: 'generation' },
    { id: 'extract', label: 'Extracting service details', icon: 'documents' },
    { id: 'organize', label: 'Organizing into projects', icon: 'post' },
];

const ProcessingScreen = ({ documents, onComplete }: Props) => {
    const [currentStep, setCurrentStep] = useState(0);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        // Simulate processing steps
        const stepDuration = 1500; // 1.5 seconds per step
        const progressInterval = 50; // Update progress every 50ms
        const progressIncrement = 100 / (processingSteps.length * (stepDuration / progressInterval));

        const progressTimer = setInterval(() => {
            setProgress((prev) => {
                const next = prev + progressIncrement;
                if (next >= 100) {
                    clearInterval(progressTimer);
                    return 100;
                }
                return next;
            });
        }, progressInterval);

        const stepTimer = setInterval(() => {
            setCurrentStep((prev) => {
                if (prev >= processingSteps.length - 1) {
                    clearInterval(stepTimer);
                    // Complete after a short delay
                    setTimeout(onComplete, 500);
                    return prev;
                }
                return prev + 1;
            });
        }, stepDuration);

        return () => {
            clearInterval(progressTimer);
            clearInterval(stepTimer);
        };
    }, [onComplete]);

    return (
        <div className="flex flex-col items-center justify-center py-12">
            {/* Animated Icon */}
            <div className="relative mb-8">
                <div className="flex items-center justify-center size-24 rounded-3xl bg-violet-500/10">
                    <Icon className="!w-12 !h-12 fill-violet-500 animate-pulse" name="generation" />
                </div>
                {/* Spinning ring */}
                <div className="absolute inset-0 rounded-3xl border-2 border-violet-500/20 border-t-violet-500 animate-spin" />
            </div>

            {/* Title */}
            <h2 className="text-h4 text-t-primary mb-2">Analyzing Your Documents</h2>
            <p className="text-small text-t-secondary mb-8 text-center max-w-md">
                Our AI is extracting service details, costs, and renewal dates from your {documents.length} document{documents.length !== 1 ? 's' : ''}.
            </p>

            {/* Progress Bar */}
            <div className="w-full max-w-md mb-8">
                <div className="h-2 rounded-full bg-b-surface1 overflow-hidden">
                    <div
                        className="h-full rounded-full bg-gradient-to-r from-violet-500 to-pink-500 transition-all duration-300"
                        style={{ width: `${progress}%` }}
                    />
                </div>
                <div className="flex justify-between mt-2 text-xs text-t-tertiary">
                    <span>{Math.round(progress)}% complete</span>
                    <span>{documents.length} files</span>
                </div>
            </div>

            {/* Processing Steps */}
            <div className="w-full max-w-md space-y-3">
                {processingSteps.map((step, index) => {
                    const isComplete = index < currentStep;
                    const isCurrent = index === currentStep;
                    const isPending = index > currentStep;

                    return (
                        <div
                            key={step.id}
                            className={`flex items-center gap-3 p-3 rounded-2xl transition-all ${
                                isCurrent
                                    ? 'bg-violet-500/10 border border-violet-500/20'
                                    : isComplete
                                    ? 'bg-green-500/5 border border-green-500/10'
                                    : 'bg-b-surface1 border border-transparent'
                            }`}
                        >
                            <div className={`flex items-center justify-center size-8 rounded-xl ${
                                isComplete
                                    ? 'bg-green-500/10'
                                    : isCurrent
                                    ? 'bg-violet-500/10'
                                    : 'bg-b-surface2'
                            }`}>
                                {isComplete ? (
                                    <Icon className="!w-4 !h-4 fill-green-500" name="check" />
                                ) : (
                                    <Icon
                                        className={`!w-4 !h-4 ${
                                            isCurrent ? 'fill-violet-500 animate-pulse' : 'fill-t-tertiary'
                                        }`}
                                        name={step.icon}
                                    />
                                )}
                            </div>
                            <span className={`text-small font-medium ${
                                isComplete
                                    ? 'text-green-500'
                                    : isCurrent
                                    ? 'text-violet-500'
                                    : 'text-t-tertiary'
                            }`}>
                                {step.label}
                            </span>
                            {isCurrent && (
                                <div className="ml-auto flex gap-1">
                                    <span className="w-1.5 h-1.5 rounded-full bg-violet-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                                    <span className="w-1.5 h-1.5 rounded-full bg-violet-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                                    <span className="w-1.5 h-1.5 rounded-full bg-violet-500 animate-bounce" style={{ animationDelay: '300ms' }} />
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Document Thumbnails */}
            <div className="flex items-center justify-center gap-2 mt-8 flex-wrap max-w-md">
                {documents.slice(0, 8).map((doc, index) => (
                    <div
                        key={doc.id}
                        className="size-10 rounded-xl overflow-hidden bg-b-surface1 border border-stroke-subtle"
                        style={{ animationDelay: `${index * 100}ms` }}
                    >
                        {doc.previewUrl ? (
                            <img
                                src={doc.previewUrl}
                                alt={doc.name}
                                className="w-full h-full object-cover opacity-60"
                            />
                        ) : (
                            <div className="flex items-center justify-center w-full h-full">
                                <Icon className="!w-4 !h-4 fill-t-tertiary" name="documents" />
                            </div>
                        )}
                    </div>
                ))}
                {documents.length > 8 && (
                    <div className="flex items-center justify-center size-10 rounded-xl bg-b-surface1 border border-stroke-subtle">
                        <span className="text-xs text-t-tertiary">+{documents.length - 8}</span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProcessingScreen;

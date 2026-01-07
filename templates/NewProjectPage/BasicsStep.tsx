"use client";

import Icon from "@/components/Icon";
import Button from "@/components/Button";
import Field from "@/components/Field";
import ImageUpload from "@/components/ImageUpload";
import { ProjectType } from "@/types";
import { projectTypes, emojiOptions } from "./data";

interface BasicsStepProps {
    projectName: string;
    setProjectName: (name: string) => void;
    projectType: ProjectType;
    setProjectType: (type: ProjectType) => void;
    projectIcon: string;
    setProjectIcon: (icon: string) => void;
    customIconImage: string | null;
    setCustomIconImage: (url: string | null) => void;
    customTypeName: string;
    setCustomTypeName: (name: string) => void;
    showCustomType: boolean;
    setShowCustomType: (show: boolean) => void;
    onContinue: () => void;
}

const BasicsStep = ({
    projectName,
    setProjectName,
    projectType,
    setProjectType,
    projectIcon,
    setProjectIcon,
    customIconImage,
    setCustomIconImage,
    customTypeName,
    setCustomTypeName,
    showCustomType,
    setShowCustomType,
    onContinue,
}: BasicsStepProps) => {
    return (
        <div>
            <h2 className="text-body-bold mb-6">Project Details</h2>

            {/* Project Name */}
            <div className="mb-6">
                <Field
                    label="Project Name"
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    placeholder="My Awesome Project"
                    required
                />
            </div>

            {/* Project Icon */}
            <div className="mb-6">
                <label className="block mb-2 text-small font-medium text-t-secondary">
                    Project Icon
                </label>
                <div className="flex items-start gap-4">
                    {/* Custom Image Upload */}
                    <div className="flex flex-col items-center">
                        <ImageUpload
                            value={customIconImage || undefined}
                            onChange={(url) => {
                                setCustomIconImage(url);
                                if (url) setProjectIcon("");
                            }}
                            size="md"
                        />
                        <span className="text-xs text-t-tertiary mt-1">Upload</span>
                    </div>
                    
                    <div className="flex-1">
                        <div className="flex flex-wrap gap-2">
                            {emojiOptions.map((emoji) => (
                                <button
                                    key={emoji}
                                    onClick={() => {
                                        setProjectIcon(emoji);
                                        setCustomIconImage(null);
                                    }}
                                    className={`flex items-center justify-center size-12 rounded-2xl text-xl transition-all ${
                                        projectIcon === emoji && !customIconImage
                                            ? "bg-primary1/10 border-2 border-primary1"
                                            : "bg-b-surface1 border-2 border-transparent hover:border-stroke-subtle"
                                    }`}
                                >
                                    {emoji}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Project Type */}
            <div className="mb-6">
                <label className="block mb-2 text-small font-medium text-t-secondary">
                    Project Type
                </label>
                <div className="grid grid-cols-3 gap-3 max-md:grid-cols-2">
                    {projectTypes.map((type) => {
                        const colorClasses = type.color.split(" ");
                        return (
                            <button
                                key={type.value}
                                onClick={() => {
                                    setProjectType(type.value);
                                    setShowCustomType(false);
                                    setCustomTypeName("");
                                }}
                                className={`flex items-center p-3 rounded-2xl text-left transition-all ${
                                    projectType === type.value && !showCustomType
                                        ? "bg-primary1/10 border-2 border-primary1"
                                        : "bg-b-surface1 border-2 border-transparent hover:border-stroke-subtle"
                                }`}
                            >
                                <div className={`flex items-center justify-center size-8 mr-3 rounded-xl border-[1.5px] ${colorClasses[0]} ${colorClasses[1]} ${colorClasses[2]}`}>
                                    <Icon className="!w-4 !h-4" name={type.icon} />
                                </div>
                                <span className="text-small font-medium">{type.label}</span>
                            </button>
                        );
                    })}
                </div>
                
                {/* Custom Type Option */}
                <button
                    onClick={() => {
                        setShowCustomType(true);
                        setProjectType("custom" as ProjectType);
                    }}
                    className={`flex items-center w-full mt-3 p-3 rounded-2xl text-left transition-all ${
                        showCustomType
                            ? "bg-primary1/10 border-2 border-primary1"
                            : "bg-b-surface1 border-2 border-transparent hover:border-stroke-subtle"
                    }`}
                >
                    <div className="flex items-center justify-center size-8 mr-3 rounded-xl border-[1.5px] bg-gradient-to-br from-violet-500/10 to-pink-500/10 border-violet-500/20 fill-violet-500">
                        <Icon className="!w-4 !h-4" name="edit" />
                    </div>
                    <div className="flex-1">
                        <span className="text-small font-medium">Custom Type</span>
                        <span className="text-xs text-t-tertiary ml-2">Define your own project type</span>
                    </div>
                    <Icon className="!w-4 !h-4 fill-t-tertiary" name="arrow-right" />
                </button>
                
                {/* Custom Type Input */}
                {showCustomType && (
                    <div className="mt-3 p-4 rounded-2xl bg-b-surface1 border-2 border-primary1/20">
                        <label className="block mb-2 text-xs text-t-tertiary">
                            Enter your custom project type
                        </label>
                        <input
                            type="text"
                            value={customTypeName}
                            onChange={(e) => setCustomTypeName(e.target.value)}
                            placeholder="e.g., Blockchain DApp, CLI Tool, WordPress Plugin..."
                            className="w-full px-4 py-3 rounded-xl bg-b-surface2 text-t-primary placeholder:text-t-tertiary focus:outline-none focus:ring-2 focus:ring-primary1/20"
                            autoFocus
                        />
                    </div>
                )}
            </div>

            <div className="flex justify-end pt-4 border-t border-stroke-subtle">
                <Button
                    isPrimary
                    onClick={onContinue}
                    disabled={!projectName.trim() || (showCustomType && !customTypeName.trim())}
                >
                    Continue
                </Button>
            </div>
        </div>
    );
};

export default BasicsStep;

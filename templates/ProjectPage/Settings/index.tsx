"use client";

import { useState } from "react";
import { Project } from "@/types";
import Icon from "@/components/Icon";
import Button from "@/components/Button";
import Field from "@/components/Field";

type Props = {
    project: Project;
};

const Settings = ({ project }: Props) => {
    const [name, setName] = useState(project.name);
    const [status, setStatus] = useState(project.status);

    const typeLabels: Record<string, string> = {
        web: "Web App",
        mobile: "Mobile App",
        extension: "Browser Extension",
        desktop: "Desktop App",
        api: "API / Backend",
        landing: "Landing Page",
    };

    return (
        <div>
            <div className="space-y-6">
                <div className="p-6 rounded-4xl bg-b-surface2">
                    <h3 className="text-body-bold mb-4">General</h3>
                    <div className="space-y-4">
                        <Field
                            label="Project Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Enter project name"
                        />
                        <div>
                            <label className="block mb-2 text-small font-medium text-t-secondary">
                                Project Type
                            </label>
                            <div className="px-4 py-3 rounded-xl bg-b-surface1 text-t-primary">
                                {typeLabels[project.type] || project.type}
                            </div>
                        </div>
                        <div>
                            <label className="block mb-2 text-small font-medium text-t-secondary">
                                Status
                            </label>
                            <div className="flex gap-2">
                                {["active", "paused", "archived"].map((s) => (
                                    <button
                                        key={s}
                                        onClick={() => setStatus(s as typeof status)}
                                        className={`px-4 py-2 rounded-xl text-small font-medium capitalize transition-all ${
                                            status === s
                                                ? "bg-t-primary text-b-surface1"
                                                : "bg-b-surface1 text-t-secondary hover:bg-b-surface1/80"
                                        }`}
                                    >
                                        {s}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="mt-6 pt-4 border-t border-stroke-subtle">
                        <Button isSecondary>Save Changes</Button>
                    </div>
                </div>

                <div className="p-6 rounded-4xl bg-b-surface2">
                    <h3 className="text-body-bold mb-4">Export</h3>
                    <p className="text-small text-t-secondary mb-4">
                        Download all project data including services, credentials, and documentation.
                    </p>
                    <Button isStroke>
                        <Icon className="mr-2 !w-5 !h-5" name="download" />
                        Export Project Data
                    </Button>
                </div>

                <div className="p-6 rounded-4xl border-2 border-red-500/20 bg-red-500/5">
                    <h3 className="text-body-bold text-red-600 mb-4">Danger Zone</h3>
                    <p className="text-small text-t-secondary mb-4">
                        Once you delete a project, there is no going back. Please be certain.
                    </p>
                    <Button isStroke className="!border-red-500/30 !text-red-600 hover:!bg-red-500/10">
                        <Icon className="mr-2 !w-5 !h-5" name="close" />
                        Delete Project
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default Settings;

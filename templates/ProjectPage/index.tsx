"use client";

import { useState } from "react";
import Layout from "@/components/Layout";
import Sidebar from "./Sidebar";
import Overview from "./Overview";
import Services from "./Services";
import Assets from "./Assets";
import Docs from "./Docs";
import Team from "./Team";
import Settings from "./Settings";
import { mockProjects, mockAlerts } from "@/data/mockProjects";
import { mockServices } from "@/data/mockServices";

type Props = {
    projectId: string;
};

const ProjectPage = ({ projectId }: Props) => {
    const [activeTab, setActiveTab] = useState("overview");

    const project = mockProjects.find((p) => p.id === projectId);
    const projectServices = mockServices.filter((s) => s.projectId === projectId);
    const projectAlerts = mockAlerts.filter((a) => a.projectId === projectId);

    if (!project) {
        return (
            <Layout isLoggedIn>
                <div className="py-20 text-center">
                    <h1 className="text-h2 mb-4">Project not found</h1>
                    <p className="text-t-secondary">
                        The project you're looking for doesn't exist.
                    </p>
                </div>
            </Layout>
        );
    }

    const renderContent = () => {
        switch (activeTab) {
            case "overview":
                return (
                    <Overview
                        project={project}
                        services={projectServices}
                        alerts={projectAlerts}
                    />
                );
            case "services":
                return <Services services={projectServices} projectId={projectId} />;
            case "assets":
                return <Assets projectId={projectId} />;
            case "docs":
                return <Docs projectId={projectId} />;
            case "team":
                return <Team projectId={projectId} />;
            case "settings":
                return <Settings project={project} />;
            default:
                return null;
        }
    };

    return (
        <Layout isLoggedIn>
            {/* Floating Sidebar */}
            <Sidebar
                project={project}
                activeTab={activeTab}
                onTabChange={setActiveTab}
            />
            
            {/* Main Content - with left margin to account for collapsed sidebar */}
            <div className="min-h-[calc(100vh-80px)] pl-24 py-6 max-md:pl-4">
                <div className="center">
                    {renderContent()}
                </div>
            </div>
        </Layout>
    );
};

export default ProjectPage;

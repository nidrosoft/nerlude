import Link from "next/link";
import { Project } from "@/types";
import Icon from "@/components/Icon";

type Props = {
    project: Project;
};

const typeLabels: Record<string, string> = {
    web: "Web App",
    mobile: "Mobile",
    extension: "Extension",
    desktop: "Desktop",
    api: "API",
    landing: "Landing",
};

const statusColors: Record<string, string> = {
    active: "bg-green-500",
    paused: "bg-amber-500",
    archived: "bg-gray-400",
};

const ProjectCard = ({ project }: Props) => {
    return (
        <Link
            href={`/projects/${project.id}`}
            className="group block h-full p-6 rounded-4xl bg-b-surface2 cursor-pointer transition-shadow hover:shadow-hover max-md:p-4"
        >
            <div className="flex items-start justify-between mb-10 max-md:mb-6">
                <div className="flex items-center justify-center size-11 rounded-full border-[1.5px] border-primary1/15 bg-primary1/5">
                    <span className="text-xl">{project.icon}</span>
                </div>
                {project.alertCount > 0 && (
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-red-500/10 text-red-500 text-xs font-medium">
                        {project.alertCount}
                    </span>
                )}
            </div>
            <div className="mb-2 truncate text-body-bold text-t-primary/80 transition-colors group-hover:text-t-primary">
                {project.name}
            </div>
            <div className="flex items-center gap-2 mb-3">
                <span className="px-2 py-0.5 text-xs rounded-full bg-b-surface1 text-t-secondary">
                    {typeLabels[project.type] || project.type}
                </span>
                <span className="flex items-center gap-1">
                    <span className={`w-2 h-2 rounded-full ${statusColors[project.status]}`} />
                    <span className="text-xs text-t-tertiary capitalize">
                        {project.status}
                    </span>
                </span>
            </div>
            <div className="flex items-center gap-4 text-small text-t-tertiary">
                <div className="flex items-center gap-1.5 fill-t-tertiary">
                    <Icon className="!w-4 !h-4" name="documents" />
                    <span>${project.monthlyCost}/mo</span>
                </div>
                <div className="flex items-center gap-1.5 fill-t-tertiary">
                    <Icon className="!w-4 !h-4" name="post" />
                    <span>{project.serviceCount} services</span>
                </div>
            </div>
        </Link>
    );
};

export default ProjectCard;

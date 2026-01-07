import Link from "next/link";
import { Project, Service, Alert } from "@/types";
import ProjectCard from "../ProjectCard";
import Icon from "@/components/Icon";

type Props = {
    projects: Project[];
    services?: Service[];
    alerts?: Alert[];
};

const ProjectsGrid = ({ projects, services = [], alerts = [] }: Props) => {
    return (
        <div className="flex flex-wrap -mt-6 -mx-3 max-md:-mt-4 max-md:mx-0">
            {projects.map((project) => (
                <div
                    key={project.id}
                    className="w-[calc(25%-1.5rem)] mt-6 mx-3 max-3xl:w-[calc(33.333%-1.5rem)] max-[1179px]:w-[calc(50%-1.5rem)] max-md:w-full max-md:mt-4 max-md:mx-0"
                >
                    <ProjectCard 
                        project={project} 
                        services={services}
                        alerts={alerts}
                    />
                </div>
            ))}
            <div className="w-[calc(25%-1.5rem)] mt-6 mx-3 max-3xl:w-[calc(33.333%-1.5rem)] max-[1179px]:w-[calc(50%-1.5rem)] max-md:w-full max-md:mt-4 max-md:mx-0">
                <Link
                    href="/projects/new"
                    className="group flex flex-col items-center justify-center h-full p-6 border-2 border-dashed border-stroke-subtle rounded-4xl text-t-secondary hover:border-primary1 hover:text-primary1 hover:bg-primary1/5 transition-all cursor-pointer max-md:p-4"
                >
                    <div className="flex items-center justify-center size-11 mb-10 rounded-full border-[1.5px] border-primary1/15 bg-primary1/5 fill-primary1 max-md:mb-6">
                        <Icon name="plus" />
                    </div>
                    <span className="font-medium text-body-bold">Add Project</span>
                </Link>
            </div>
        </div>
    );
};

export default ProjectsGrid;

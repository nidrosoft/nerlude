import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import Image from "@/components/Image";
import Icon from "@/components/Icon";
import ThemeButton from "@/components/ThemeButton";
import { getSupabaseClient } from "@/lib/db";
import { useWorkspaceStore } from "@/stores";

const ProjectIcon = ({ color }: { color?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M21.67 14.3L21.27 19.3C21.12 20.83 21 22 18.29 22H5.71001C3.00001 22 2.88001 20.83 2.73001 19.3L2.33001 14.3C2.25001 13.47 2.51001 12.7 2.98001 12.11C2.99001 12.1 2.99001 12.1 3.00001 12.09C3.55001 11.42 4.38001 11 5.31001 11H18.69C19.62 11 20.44 11.42 20.98 12.07C20.99 12.08 21 12.09 21 12.1C21.49 12.69 21.76 13.46 21.67 14.3Z" stroke={color} strokeWidth="1.5" strokeMiterlimit="10"/>
        <path d="M3.5 11.4303V6.28027C3.5 2.88027 4.35 2.03027 7.75 2.03027H9.02C10.29 2.03027 10.58 2.41027 11.06 3.05027L12.33 4.75027C12.65 5.17027 12.84 5.43027 13.69 5.43027H16.24C19.64 5.43027 20.49 6.28027 20.49 9.68027V11.4703" stroke={color} strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M9.43005 17H14.5701" stroke={color} strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);

const navigation = [
    {
        title: "My Projects",
        icon: "post",
        url: "/dashboard",
        iconColor: "fill-blue-500",
    },
    {
        title: "Workspace",
        icon: "cube",
        url: "/settings/workspace",
        iconColor: "fill-purple-500",
    },
    {
        title: "Manage Plan",
        icon: "star-stroke",
        url: "/settings/plan",
        iconColor: "fill-amber-500",
    },
    {
        title: "Account Settings",
        icon: "profile",
        url: "/settings/account",
        iconColor: "fill-cyan-500",
    },
];

type Props = {
    onLogout: () => void;
};

const UserMenu = ({ onLogout }: Props) => {
    const { currentWorkspace } = useWorkspaceStore();
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const [projectCount, setProjectCount] = useState(0);
    const [projectLimit, setProjectLimit] = useState(5); // Default free plan limit

    // Fetch project count and plan limits
    useEffect(() => {
        const fetchProjectData = async () => {
            if (!currentWorkspace) return;
            
            try {
                // Fetch projects count
                const projectsRes = await fetch(`/api/projects?workspace_id=${currentWorkspace.id}`);
                if (projectsRes.ok) {
                    const projects = await projectsRes.json();
                    setProjectCount(projects.length);
                }

                // Fetch workspace to get plan limits
                const workspaceRes = await fetch(`/api/workspaces/${currentWorkspace.id}`);
                if (workspaceRes.ok) {
                    const data = await workspaceRes.json();
                    // Map plan to project limits
                    const planLimits: Record<string, number> = {
                        'free': 1,
                        'starter': 3,
                        'pro': 10,
                        'team': -1, // unlimited
                        'enterprise': -1,
                    };
                    const plan = data.subscription?.plan_id || 'free';
                    setProjectLimit(planLimits[plan] || 5);
                }
            } catch (error) {
                console.error('Error fetching project data:', error);
            }
        };
        fetchProjectData();
    }, [currentWorkspace]);

    const handleLogout = async () => {
        setIsLoggingOut(true);
        
        // Create a timeout promise to prevent hanging
        const timeoutPromise = new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Logout timeout')), 3000)
        );
        
        try {
            const supabase = getSupabaseClient();
            // Race between signOut and timeout
            await Promise.race([
                supabase.auth.signOut(),
                timeoutPromise
            ]);
        } catch (error) {
            console.error("Logout error:", error);
        }
        
        // Always redirect regardless of success/failure
        onLogout();
        window.location.href = "/";
    };
    return (
        <Menu>
            <MenuButton 
                className="relative flex size-12 border-4 border-b-surface2 rounded-full outline-0 before:absolute before:-inset-1 before:z-1 before:rounded-full before:border-[1.5px] before:border-stroke2 before:opacity-0 before:transition-opacity data-open:before:opacity-100"
                aria-label="User menu"
            >
                <Image
                    className="size-10 object-cover rounded-full opacity-100"
                    src="/images/avatar.png"
                    width={40}
                    height={40}
                    alt="Avatar"
                />
            </MenuButton>
            <MenuItems
                className="z-50 [--anchor-gap:1rem] w-62 shadow-hover bg-b-surface2 rounded-3xl outline-0 origin-top transition duration-200 ease-out data-closed:scale-95 data-closed:opacity-0"
                anchor="bottom end"
                transition
            >
                <div className="p-3">
                    <div className="">
                        {navigation.map((item, index) => (
                            <MenuItem key={index}>
                                <Link
                                    className="flex items-center w-full h-12 px-3 rounded-2xl text-hairline font-medium text-t-secondary transition-colors hover:bg-b-highlight hover:text-t-primary"
                                    href={item.url}
                                >
                                    <Icon
                                        className={`mr-4 ${item.iconColor}`}
                                        name={item.icon}
                                    />
                                    {item.title}
                                </Link>
                            </MenuItem>
                        ))}
                    </div>
                    <div className="flex items-center w-full h-12 px-3 text-hairline font-medium text-t-secondary max-md:hidden">
                        <div className="size-6 mr-4">
                            <ProjectIcon color="#10b981" />
                        </div>
                        <div className="">
                            Projects: <span className="text-t-primary">{projectCount}/{projectLimit === -1 ? "∞" : projectLimit}</span>
                        </div>
                        {projectLimit !== -1 && (
                        <Link
                            className="ml-5 px-2 py-0.5 border-[1.5px] border-primary2/15 bg-primary2/5 rounded-full text-hairline font-medium text-primary2 transition-colors hover:border-primary2/25 hover:bg-primary2/10"
                            href="/settings/plan"
                        >
                            Upgrade
                        </Link>
                        )}
                    </div>
                </div>
                <div className="p-3 border-t border-stroke-subtle">
                    <div className="hidden items-center w-full h-12 pl-3 text-hairline text-t-secondary max-md:flex">
                        <Icon className="mr-4 fill-t-secondary" name="bulb" />
                        <div className="">Theme</div>
                        <ThemeButton className="ml-auto" isHorizontal />
                    </div>
                    <button
                        className="flex items-center w-full h-12 px-3 rounded-2xl text-hairline font-medium text-t-secondary transition-colors hover:bg-red-500/10 hover:text-red-500 disabled:opacity-50"
                        onClick={handleLogout}
                        disabled={isLoggingOut}
                    >
                        <Icon className="mr-4 fill-red-500" name="logout" />
                        {isLoggingOut ? "Logging out..." : "Log out"}
                    </button>
                </div>
            </MenuItems>
        </Menu>
    );
};

export default UserMenu;

import { DashboardStats } from "@/types";
import Icon from "@/components/Icon";

type Props = {
    stats: DashboardStats;
};

const ProjectIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" className={className}>
        <path d="M21.67 14.3L21.27 19.3C21.12 20.83 21 22 18.29 22H5.71001C3.00001 22 2.88001 20.83 2.73001 19.3L2.33001 14.3C2.25001 13.47 2.51001 12.7 2.98001 12.11C2.99001 12.1 2.99001 12.1 3.00001 12.09C3.55001 11.42 4.38001 11 5.31001 11H18.69C19.62 11 20.44 11.42 20.98 12.07C20.99 12.08 21 12.09 21 12.1C21.49 12.69 21.76 13.46 21.67 14.3Z" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10"/>
        <path d="M3.5 11.4303V6.28027C3.5 2.88027 4.35 2.03027 7.75 2.03027H9.02C10.29 2.03027 10.58 2.41027 11.06 3.05027L12.33 4.75027C12.65 5.17027 12.84 5.43027 13.69 5.43027H16.24C19.64 5.43027 20.49 6.28027 20.49 9.68027V11.4703" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M9.43005 17H14.5701" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);

const ServiceIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" className={className}>
        <path d="M17.5604 8.66977H6.44035C4.60035 8.66977 3.11035 7.17977 3.11035 5.33977C3.11035 3.49977 4.60035 2.00977 6.44035 2.00977H17.5504C19.3904 2.00977 20.8804 3.49977 20.8804 5.33977C20.8804 7.17977 19.3904 8.66977 17.5504 8.66977H17.5604Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M12.0003 21.9996C10.7703 21.9996 9.78027 21.0096 9.78027 19.7796C9.78027 18.5496 10.7703 17.5596 12.0003 17.5596C13.2303 17.5596 14.2203 18.5496 14.2203 19.7796C14.2203 21.0096 13.2303 21.9996 12.0003 21.9996Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path opacity="0.4" fillRule="evenodd" clipRule="evenodd" d="M12.7505 8.66992C12.7505 8.25571 12.4147 7.91992 12.0005 7.91992C11.5863 7.91992 11.2505 8.25571 11.2505 8.66992V12.3594H8.50047C5.72626 12.3594 3.48047 14.6052 3.48047 17.3794C3.48047 17.7936 3.81626 18.1294 4.23047 18.1294C4.64468 18.1294 4.98047 17.7936 4.98047 17.3794C4.98047 15.4336 6.55468 13.8594 8.50047 13.8594H11.2505V17.5599C11.2505 17.9741 11.5863 18.3099 12.0005 18.3099C12.4147 18.3099 12.7505 17.9741 12.7505 17.5599V13.8594H15.5105C17.4563 13.8594 19.0305 15.4336 19.0305 17.3794C19.0305 17.7936 19.3663 18.1294 19.7805 18.1294C20.1947 18.1294 20.5305 17.7936 20.5305 17.3794C20.5305 14.6052 18.2847 12.3594 15.5105 12.3594H12.7505V8.66992Z" fill="currentColor"/>
        <path d="M19.7796 21.9996C18.5496 21.9996 17.5596 21.0096 17.5596 19.7796C17.5596 18.5496 18.5496 17.5596 19.7796 17.5596C21.0096 17.5596 21.9996 18.5496 21.9996 19.7796C21.9996 21.0096 21.0096 21.9996 19.7796 21.9996Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M4.22 21.9996C2.99 21.9996 2 21.0096 2 19.7796C2 18.5496 2.99 17.5596 4.22 17.5596C5.45 17.5596 6.44 18.5496 6.44 19.7796C6.44 21.0096 5.45 21.9996 4.22 21.9996Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);

const statItems = [
    { 
        key: "totalProjects", 
        label: "Active Projects", 
        customIcon: "project",
        bgColor: "bg-blue-500/10",
        borderColor: "border-blue-500/20",
        iconColor: "text-blue-500",
    },
    { 
        key: "monthlyBurn", 
        label: "Monthly Burn", 
        icon: "wallet", 
        prefix: "$",
        bgColor: "bg-purple-500/10",
        borderColor: "border-purple-500/20",
        iconColor: "fill-purple-500",
    },
    { 
        key: "totalServices", 
        label: "Total Services", 
        customIcon: "service",
        bgColor: "bg-amber-500/10",
        borderColor: "border-amber-500/20",
        iconColor: "text-amber-500",
    },
    { 
        key: "upcomingRenewals", 
        label: "Upcoming Renewals", 
        icon: "bell",
        bgColor: "bg-green-500/10",
        borderColor: "border-green-500/20",
        iconColor: "fill-green-500",
    },
];

const StatsBar = ({ stats }: Props) => {
    return (
        <div className="flex flex-wrap -mt-4 -mx-2 mb-8 max-md:-mt-3 max-md:-mx-1.5 max-md:mb-6">
            {statItems.map((item) => (
                <div
                    key={item.key}
                    className="w-[calc(25%-1rem)] mt-4 mx-2 p-6 rounded-4xl bg-b-surface2 max-lg:w-[calc(50%-1rem)] max-md:w-[calc(50%-0.75rem)] max-md:mt-3 max-md:mx-1.5 max-md:p-4"
                >
                    <div className={`flex items-center justify-center size-11 mb-6 rounded-2xl border-[1.5px] ${item.borderColor} ${item.bgColor} ${item.iconColor} max-md:mb-4`}>
                        {item.customIcon === "project" && <ProjectIcon />}
                        {item.customIcon === "service" && <ServiceIcon />}
                        {item.icon && <Icon name={item.icon} />}
                    </div>
                    <div className="text-h2 mb-1">
                        {item.prefix || ""}
                        {stats[item.key as keyof DashboardStats].toLocaleString()}
                    </div>
                    <div className="text-small text-t-tertiary">{item.label}</div>
                </div>
            ))}
        </div>
    );
};

export default StatsBar;

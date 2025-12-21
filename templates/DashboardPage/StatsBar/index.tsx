import { DashboardStats } from "@/types";
import Icon from "@/components/Icon";

type Props = {
    stats: DashboardStats;
};

const statItems = [
    { 
        key: "totalProjects", 
        label: "Active Projects", 
        icon: "cube",
        bgColor: "bg-blue-500/10",
        borderColor: "border-blue-500/20",
        iconColor: "fill-blue-500",
    },
    { 
        key: "monthlyBurn", 
        label: "Monthly Burn", 
        icon: "documents", 
        prefix: "$",
        bgColor: "bg-purple-500/10",
        borderColor: "border-purple-500/20",
        iconColor: "fill-purple-500",
    },
    { 
        key: "totalServices", 
        label: "Total Services", 
        icon: "post",
        bgColor: "bg-amber-500/10",
        borderColor: "border-amber-500/20",
        iconColor: "fill-amber-500",
    },
    { 
        key: "upcomingRenewals", 
        label: "Upcoming Renewals", 
        icon: "generation",
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
                        <Icon name={item.icon} />
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

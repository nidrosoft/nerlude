"use client";

import Icon from "@/components/Icon";
import Button from "@/components/Button";

type Props = {
    projectId: string;
};

const Team = ({ projectId }: Props) => {
    const members = [
        {
            id: "1",
            name: "Steven Chen",
            email: "steven@example.com",
            role: "Owner",
            avatar: "SC",
        },
        {
            id: "2",
            name: "Sarah Johnson",
            email: "sarah@example.com",
            role: "Admin",
            avatar: "SJ",
        },
        {
            id: "3",
            name: "Mike Wilson",
            email: "mike@example.com",
            role: "Member",
            avatar: "MW",
            expiresAt: "2025-02-15",
        },
    ];

    const roleColors: Record<string, string> = {
        Owner: "bg-purple-500/10 text-purple-600",
        Admin: "bg-blue-500/10 text-blue-600",
        Member: "bg-green-500/10 text-green-600",
        Viewer: "bg-gray-500/10 text-gray-600",
    };

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-h3">Team</h2>
                <Button isSecondary>
                    <Icon className="mr-2 !w-5 !h-5" name="plus" />
                    Invite Member
                </Button>
            </div>

            <div className="p-5 rounded-4xl bg-b-surface2">
                <div className="space-y-3">
                    {members.map((member) => (
                        <div
                            key={member.id}
                            className="flex items-center p-4 rounded-xl bg-b-surface1"
                        >
                            <div className="flex items-center justify-center size-10 mr-4 rounded-full bg-primary1/10 text-primary1 font-medium">
                                {member.avatar}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                    <span className="font-medium text-t-primary truncate">
                                        {member.name}
                                    </span>
                                    <span className={`px-2 py-0.5 text-xs rounded-full ${roleColors[member.role]}`}>
                                        {member.role}
                                    </span>
                                </div>
                                <div className="text-small text-t-secondary truncate">
                                    {member.email}
                                </div>
                                {member.expiresAt && (
                                    <div className="text-xs text-amber-600 mt-1">
                                        Access expires {new Date(member.expiresAt).toLocaleDateString()}
                                    </div>
                                )}
                            </div>
                            <Button isStroke className="shrink-0">
                                <Icon className="!w-5 !h-5" name="dots" />
                            </Button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Team;

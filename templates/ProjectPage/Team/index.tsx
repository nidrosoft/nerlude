"use client";

import { useState } from "react";
import Icon from "@/components/Icon";
import Button from "@/components/Button";
import Dropdown from "@/components/Dropdown";
import Field from "@/components/Field";
import { useToast } from "@/components/Toast";

/**
 * BACKEND IMPLEMENTATION NOTES:
 * 
 * Project-Level Team Management:
 * 
 * 1. INVITE FLOW:
 *    - POST /api/projects/{projectId}/invites
 *    - Body: { email: string, role: "Admin" | "Member" | "Viewer" }
 *    - Backend should:
 *      a) Check if user exists in workspace - if yes, add them directly to project
 *      b) If user doesn't exist in workspace, send invite email with project-specific invite link
 *      c) Store pending invite in database with expiration (e.g., 7 days)
 *      d) When user accepts, add them to both workspace (if new) and project
 * 
 * 2. ROLE HIERARCHY:
 *    - Project roles are INDEPENDENT of workspace roles
 *    - A user can be "Viewer" at workspace level but "Admin" on a specific project
 *    - Project Owner is typically the creator or can be transferred
 *    - Only Project Owner or Workspace Admin can manage project team
 * 
 * 3. PERMISSIONS:
 *    - Owner: Full control, can delete project, transfer ownership
 *    - Admin: Can manage team, edit all settings, manage services
 *    - Member: Can view and edit services, cannot manage team
 *    - Viewer: Read-only access to project
 * 
 * 4. DATA MODEL:
 *    - project_members table: { project_id, user_id, role, invited_by, joined_at, expires_at? }
 *    - project_invites table: { id, project_id, email, role, invited_by, created_at, expires_at, accepted_at? }
 */

type Props = {
    projectId: string;
    showInviteModal?: boolean;
    onCloseInviteModal?: () => void;
};

const Team = ({ projectId, showInviteModal: externalShowModal, onCloseInviteModal }: Props) => {
    const toast = useToast();
    const [internalShowModal, setInternalShowModal] = useState(false);
    
    // Use external control if provided, otherwise use internal state
    const showInviteModal = externalShowModal !== undefined ? externalShowModal : internalShowModal;
    const setShowInviteModal = onCloseInviteModal 
        ? (show: boolean) => { if (!show) onCloseInviteModal(); }
        : setInternalShowModal;
    const [inviteEmail, setInviteEmail] = useState("");
    const [inviteRole, setInviteRole] = useState<"Admin" | "Member" | "Viewer">("Member");
    const [members, setMembers] = useState([
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
    ]);

    const handleChangeRole = (memberId: string, newRole: string) => {
        setMembers(prev => prev.map(m => m.id === memberId ? { ...m, role: newRole } : m));
        toast.success("Role updated", `Member role changed to ${newRole}`);
    };

    const handleRemoveMember = (memberId: string, memberName: string) => {
        setMembers(prev => prev.filter(m => m.id !== memberId));
        toast.success("Member removed", `${memberName} has been removed from the team`);
    };

    const handleInviteMember = () => {
        if (!inviteEmail) return;
        
        // Generate initials from email
        const initials = inviteEmail.split("@")[0].slice(0, 2).toUpperCase();
        
        // Add new member (in real app, this would be a pending invite)
        const newMember = {
            id: Date.now().toString(),
            name: inviteEmail.split("@")[0], // Use email prefix as temp name
            email: inviteEmail,
            role: inviteRole,
            avatar: initials,
            // In real implementation, this would be a pending invite until accepted
        };
        
        setMembers(prev => [...prev, newMember]);
        setShowInviteModal(false);
        setInviteEmail("");
        setInviteRole("Member");
        toast.success("Invitation sent", `An invite has been sent to ${inviteEmail}`);
    };

    const roles: { value: "Admin" | "Member" | "Viewer"; label: string }[] = [
        { value: "Admin", label: "Admin" },
        { value: "Member", label: "Member" },
        { value: "Viewer", label: "Viewer" },
    ];

    const roleColors: Record<string, string> = {
        Owner: "bg-purple-500/10 text-purple-600",
        Admin: "bg-blue-500/10 text-blue-600",
        Member: "bg-green-500/10 text-green-600",
        Viewer: "bg-gray-500/10 text-gray-600",
    };

    return (
        <div>
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
                            <Dropdown
                                trigger={
                                    <Button isStroke className="shrink-0">
                                        <Icon className="!w-5 !h-5" name="more" />
                                    </Button>
                                }
                                items={member.role !== "Owner" ? [
                                    {
                                        label: "Make Admin",
                                        icon: <Icon className="!w-5 !h-5 fill-t-tertiary" name="profile" />,
                                        onClick: () => handleChangeRole(member.id, "Admin"),
                                    },
                                    {
                                        label: "Make Member",
                                        icon: <Icon className="!w-5 !h-5 fill-t-tertiary" name="profile" />,
                                        onClick: () => handleChangeRole(member.id, "Member"),
                                    },
                                    {
                                        label: "Make Viewer",
                                        icon: <Icon className="!w-5 !h-5 fill-t-tertiary" name="eye" />,
                                        onClick: () => handleChangeRole(member.id, "Viewer"),
                                    },
                                    {
                                        label: "Remove",
                                        icon: <Icon className="!w-5 !h-5 fill-red-500" name="close" />,
                                        onClick: () => handleRemoveMember(member.id, member.name),
                                    },
                                ] : []}
                            />
                        </div>
                    ))}
                </div>
            </div>

            {/* Invite Member Modal */}
            {showInviteModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <div 
                        className="absolute inset-0 bg-[#282828]/90"
                        onClick={() => setShowInviteModal(false)}
                    />
                    <div className="relative z-10 w-full max-w-md mx-4 p-8 rounded-4xl bg-b-surface1">
                        <h3 className="text-h4 mb-6">Invite Team Member</h3>
                        
                        <div className="space-y-4 mb-6">
                            <Field
                                label="Email Address"
                                type="email"
                                value={inviteEmail}
                                onChange={(e) => setInviteEmail(e.target.value)}
                                placeholder="colleague@example.com"
                            />
                            <div>
                                <label className="block mb-2 text-small font-medium text-t-secondary">
                                    Role
                                </label>
                                <div className="flex gap-2">
                                    {roles.map((r) => (
                                        <button
                                            key={r.value}
                                            onClick={() => setInviteRole(r.value)}
                                            className={`flex-1 px-4 py-3 rounded-xl text-small font-medium transition-all border-2 ${
                                                inviteRole === r.value
                                                    ? "bg-t-primary text-b-surface1 border-t-primary"
                                                    : "bg-b-surface2 text-t-secondary border-stroke-subtle hover:border-stroke-highlight"
                                            }`}
                                        >
                                            {r.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <Button
                                className="flex-1"
                                isStroke
                                onClick={() => setShowInviteModal(false)}
                            >
                                Cancel
                            </Button>
                            <Button
                                className="flex-1"
                                isPrimary
                                onClick={handleInviteMember}
                                disabled={!inviteEmail}
                            >
                                Send Invite
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

// Export the setShowInviteModal function via a ref or callback pattern
// For now, we expose it through the component's internal state
export const useTeamInvite = () => {
    // This would be implemented with context or zustand in production
};

export default Team;

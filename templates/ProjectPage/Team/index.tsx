"use client";

import { useState, useEffect, useCallback } from "react";
import Icon from "@/components/Icon";
import Button from "@/components/Button";
import Dropdown from "@/components/Dropdown";
import Field from "@/components/Field";
import Skeleton from "@/components/Skeleton";
import { useToast } from "@/components/Toast";
import useSubscription from "@/hooks/useSubscription";
import UpgradeModal from "@/components/UpgradeModal";

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

interface Member {
    id: string;
    userId?: string;
    name: string;
    email: string;
    avatarUrl?: string;
    role: string;
    joinedAt?: string;
}

const Team = ({ projectId, showInviteModal: externalShowModal, onCloseInviteModal }: Props) => {
    const toast = useToast();
    const { canAddTeamMember, getUpgradeMessage } = useSubscription();
    const [internalShowModal, setInternalShowModal] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showUpgradeModal, setShowUpgradeModal] = useState(false);
    const [upgradeModalConfig, setUpgradeModalConfig] = useState({ title: "", message: "", suggestedPlan: "Pro" });
    
    // Use external control if provided, otherwise use internal state
    const showInviteModal = externalShowModal !== undefined ? externalShowModal : internalShowModal;
    const setShowInviteModal = onCloseInviteModal 
        ? (show: boolean) => { if (!show) onCloseInviteModal(); }
        : setInternalShowModal;
    const [inviteEmail, setInviteEmail] = useState("");
    const [inviteRole, setInviteRole] = useState<"Admin" | "Member" | "Viewer">("Member");
    const [members, setMembers] = useState<Member[]>([]);

    // Check team member limit before showing invite modal
    const handleShowInviteModal = () => {
        const teamCheck = canAddTeamMember();
        if (!teamCheck.allowed) {
            const upgradeMsg = getUpgradeMessage("team");
            setUpgradeModalConfig({
                title: upgradeMsg.title,
                message: upgradeMsg.message,
                suggestedPlan: upgradeMsg.suggestedPlan,
            });
            setShowUpgradeModal(true);
            return;
        }
        setShowInviteModal(true);
    };

    // Fetch team members from API
    const fetchMembers = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`/api/projects/${projectId}/members`);
            if (response.ok) {
                const data = await response.json();
                setMembers(data.map((m: any) => ({
                    id: m.id,
                    userId: m.userId,
                    name: m.name,
                    email: m.email,
                    avatarUrl: m.avatarUrl,
                    role: m.role.charAt(0).toUpperCase() + m.role.slice(1), // Capitalize
                    joinedAt: m.joinedAt,
                })));
            }
        } catch (error) {
            console.error('Error fetching members:', error);
        } finally {
            setIsLoading(false);
        }
    }, [projectId]);

    useEffect(() => {
        fetchMembers();
    }, [fetchMembers]);

    const handleChangeRole = async (memberId: string, userId: string, newRole: string) => {
        try {
            const response = await fetch(`/api/projects/${projectId}/members/${userId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ role: newRole.toLowerCase() }),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Failed to update role');
            }

            setMembers(prev => prev.map(m => m.id === memberId ? { ...m, role: newRole } : m));
            toast.success("Role updated", `Member role changed to ${newRole}`);
        } catch (error) {
            console.error('Error updating role:', error);
            toast.error("Error", error instanceof Error ? error.message : "Failed to update role");
        }
    };

    const handleRemoveMember = async (memberId: string, userId: string, memberName: string) => {
        try {
            const response = await fetch(`/api/projects/${projectId}/members/${userId}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Failed to remove member');
            }

            setMembers(prev => prev.filter(m => m.id !== memberId));
            toast.success("Member removed", `${memberName} has been removed from the team`);
        } catch (error) {
            console.error('Error removing member:', error);
            toast.error("Error", error instanceof Error ? error.message : "Failed to remove member");
        }
    };

    const handleInviteMember = async () => {
        if (!inviteEmail || isSubmitting) return;
        
        setIsSubmitting(true);
        try {
            const response = await fetch(`/api/projects/${projectId}/members`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: inviteEmail,
                    role: inviteRole.toLowerCase(),
                }),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Failed to add member');
            }

            const newMember = await response.json();
            setMembers(prev => [...prev, {
                ...newMember,
                role: newMember.role.charAt(0).toUpperCase() + newMember.role.slice(1),
            }]);
            setShowInviteModal(false);
            setInviteEmail("");
            setInviteRole("Member");
            toast.success("Member added", `${newMember.name || inviteEmail} has been added to the team`);
        } catch (error) {
            console.error('Error adding member:', error);
            toast.error("Error", error instanceof Error ? error.message : "Failed to add member");
        } finally {
            setIsSubmitting(false);
        }
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

    if (isLoading) {
        return (
            <div className="p-5 rounded-4xl bg-b-surface2">
                <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="flex items-center p-4 rounded-xl bg-b-surface1">
                            <Skeleton variant="circular" width={40} height={40} className="mr-4" />
                            <div className="flex-1">
                                <Skeleton variant="text" height={16} className="w-32 mb-2" />
                                <Skeleton variant="text" height={12} className="w-48" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (members.length === 0) {
        return (
            <div className="p-8 text-center rounded-4xl bg-b-surface2">
                <div className="flex items-center justify-center size-12 mx-auto mb-4 rounded-full bg-primary1/5 border-[1.5px] border-primary1/15">
                    <Icon className="!w-6 !h-6 text-primary1" name="profile" />
                </div>
                <div className="text-body-bold mb-2">No team members yet</div>
                <div className="text-small text-t-secondary mb-4">
                    Invite team members to collaborate on this project
                </div>
                <Button isSecondary onClick={handleShowInviteModal}>
                    <Icon className="mr-2 !w-4 !h-4" name="plus" />
                    Invite Member
                </Button>
                
                {/* Upgrade Modal */}
                <UpgradeModal
                    isOpen={showUpgradeModal}
                    onClose={() => setShowUpgradeModal(false)}
                    title={upgradeModalConfig.title}
                    message={upgradeModalConfig.message}
                    suggestedPlan={upgradeModalConfig.suggestedPlan}
                    limitType="team"
                />
            </div>
        );
    }

    return (
        <div>
            <div className="p-5 rounded-4xl bg-b-surface2">
                <div className="space-y-3">
                    {members.map((member) => {
                        // Generate initials from name or email
                        const initials = member.name 
                            ? member.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
                            : member.email.slice(0, 2).toUpperCase();
                        
                        return (
                        <div
                            key={member.id}
                            className="flex items-center p-4 rounded-xl bg-b-surface1"
                        >
                            <div className="flex items-center justify-center size-10 mr-4 rounded-full bg-primary1/10 text-primary1 font-medium">
                                {member.avatarUrl ? (
                                    <img src={member.avatarUrl} alt={member.name} className="size-10 rounded-full object-cover" />
                                ) : (
                                    initials
                                )}
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
                            </div>
                            {member.role !== "Owner" && (
                                <Dropdown
                                    trigger={
                                        <Button isStroke className="shrink-0">
                                            <Icon className="!w-5 !h-5" name="more" />
                                        </Button>
                                    }
                                    items={[
                                        {
                                            label: "Make Admin",
                                            icon: <Icon className="!w-5 !h-5 fill-t-tertiary" name="profile" />,
                                            onClick: () => handleChangeRole(member.id, member.userId || '', "Admin"),
                                        },
                                        {
                                            label: "Make Member",
                                            icon: <Icon className="!w-5 !h-5 fill-t-tertiary" name="profile" />,
                                            onClick: () => handleChangeRole(member.id, member.userId || '', "Member"),
                                        },
                                        {
                                            label: "Make Viewer",
                                            icon: <Icon className="!w-5 !h-5 fill-t-tertiary" name="eye" />,
                                            onClick: () => handleChangeRole(member.id, member.userId || '', "Viewer"),
                                        },
                                        {
                                            label: "Remove",
                                            icon: <Icon className="!w-5 !h-5 fill-red-500" name="close" />,
                                            onClick: () => handleRemoveMember(member.id, member.userId || '', member.name),
                                        },
                                    ]}
                                />
                            )}
                        </div>
                    );
                    })}
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
            
            {/* Upgrade Modal */}
            <UpgradeModal
                isOpen={showUpgradeModal}
                onClose={() => setShowUpgradeModal(false)}
                title={upgradeModalConfig.title}
                message={upgradeModalConfig.message}
                suggestedPlan={upgradeModalConfig.suggestedPlan}
                limitType="team"
            />
        </div>
    );
};

// Export the setShowInviteModal function via a ref or callback pattern
// For now, we expose it through the component's internal state
export const useTeamInvite = () => {
    // This would be implemented with context or zustand in production
};

export default Team;

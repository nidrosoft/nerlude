"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "@/components/Image";
import Button from "@/components/Button";
import Icon from "@/components/Icon";
import { getSupabaseClient } from "@/lib/db";

interface InviteData {
  id: string;
  token: string;
  email: string;
  type: "workspace" | "project";
  target_id: string;
  target_name: string;
  role: string;
  inviter_name: string;
  inviter_email: string;
  workspace_name: string | null;
  expires_at: string;
  accepted_at: string | null;
}

type InviteStatus = "loading" | "valid" | "expired" | "accepted" | "invalid" | "error";

export default function InvitePage() {
  const params = useParams();
  const router = useRouter();
  const token = params.token as string;

  const [status, setStatus] = useState<InviteStatus>("loading");
  const [invite, setInvite] = useState<InviteData | null>(null);
  const [isAccepting, setIsAccepting] = useState(false);
  const [user, setUser] = useState<{ id: string; email: string } | null>(null);

  useEffect(() => {
    const checkInvite = async () => {
      try {
        const supabase = getSupabaseClient();

        // Check if user is logged in
        const { data: { user: currentUser } } = await supabase.auth.getUser();
        if (currentUser) {
          setUser({ id: currentUser.id, email: currentUser.email || "" });
        }

        // Fetch invite details
        const { data, error } = await supabase
          .from("invite_tokens" as any)
          .select("*")
          .eq("token", token)
          .single();

        if (error || !data) {
          setStatus("invalid");
          return;
        }

        const inviteData = data as unknown as InviteData;
        setInvite(inviteData);

        // Check if already accepted
        if (inviteData.accepted_at) {
          setStatus("accepted");
          return;
        }

        // Check if expired
        if (new Date(inviteData.expires_at) < new Date()) {
          setStatus("expired");
          return;
        }

        setStatus("valid");
      } catch (error) {
        console.error("Error checking invite:", error);
        setStatus("error");
      }
    };

    if (token) {
      checkInvite();
    }
  }, [token]);

  const handleAcceptInvite = async () => {
    if (!invite) return;

    setIsAccepting(true);

    try {
      const supabase = getSupabaseClient();

      // If not logged in, redirect to login with return URL
      if (!user) {
        const returnUrl = `/invite/${token}`;
        router.push(`/login?redirect=${encodeURIComponent(returnUrl)}&email=${encodeURIComponent(invite.email)}`);
        return;
      }

      // Check if the logged-in user's email matches the invite
      if (user.email.toLowerCase() !== invite.email.toLowerCase()) {
        alert(`This invitation was sent to ${invite.email}. Please log in with that email address.`);
        setIsAccepting(false);
        return;
      }

      // Accept the invite based on type
      if (invite.type === "workspace") {
        // Add user to workspace
        const { error: memberError } = await supabase
          .from("workspace_members")
          .insert({
            workspace_id: invite.target_id,
            user_id: user.id,
            role: invite.role,
          });

        if (memberError) {
          // Check if already a member
          if (memberError.code === "23505") {
            // Unique violation - already a member
            await supabase
              .from("invite_tokens" as any)
              .update({ accepted_at: new Date().toISOString() })
              .eq("token", token);
            
            router.push("/dashboard");
            return;
          }
          throw memberError;
        }
      } else if (invite.type === "project") {
        // Add user to project
        const { error: memberError } = await supabase
          .from("project_members")
          .insert({
            project_id: invite.target_id,
            user_id: user.id,
            role: invite.role,
          });

        if (memberError) {
          if (memberError.code === "23505") {
            await supabase
              .from("invite_tokens" as any)
              .update({ accepted_at: new Date().toISOString() })
              .eq("token", token);
            
            router.push(`/projects/${invite.target_id}`);
            return;
          }
          throw memberError;
        }
      }

      // Mark invite as accepted
      await supabase
        .from("invite_tokens" as any)
        .update({ accepted_at: new Date().toISOString() })
        .eq("token", token);

      // Redirect to appropriate page
      if (invite.type === "workspace") {
        router.push("/dashboard");
      } else {
        router.push(`/projects/${invite.target_id}`);
      }
    } catch (error) {
      console.error("Error accepting invite:", error);
      alert("Failed to accept invitation. Please try again.");
      setIsAccepting(false);
    }
  };

  const renderContent = () => {
    if (status === "loading") {
      return (
        <div className="text-center">
          <div className="animate-spin size-12 border-4 border-primary1 border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-t-secondary">Verifying invitation...</p>
        </div>
      );
    }

    if (status === "invalid") {
      return (
        <div className="text-center">
          <div className="flex items-center justify-center size-16 rounded-full bg-red-500/10 mx-auto mb-4">
            <Icon className="!w-8 !h-8 fill-red-500" name="close" />
          </div>
          <h1 className="text-h3 mb-2">Invalid Invitation</h1>
          <p className="text-t-secondary mb-6">
            This invitation link is invalid or has been revoked.
          </p>
          <Link href="/">
            <Button isSecondary>Go to Homepage</Button>
          </Link>
        </div>
      );
    }

    if (status === "expired") {
      return (
        <div className="text-center">
          <div className="flex items-center justify-center size-16 rounded-full bg-amber-500/10 mx-auto mb-4">
            <Icon className="!w-8 !h-8 fill-amber-500" name="clock" />
          </div>
          <h1 className="text-h3 mb-2">Invitation Expired</h1>
          <p className="text-t-secondary mb-6">
            This invitation has expired. Please ask {invite?.inviter_name} to send a new invitation.
          </p>
          <Link href="/">
            <Button isSecondary>Go to Homepage</Button>
          </Link>
        </div>
      );
    }

    if (status === "accepted") {
      return (
        <div className="text-center">
          <div className="flex items-center justify-center size-16 rounded-full bg-green-500/10 mx-auto mb-4">
            <Icon className="!w-8 !h-8 fill-green-500" name="check" />
          </div>
          <h1 className="text-h3 mb-2">Already Accepted</h1>
          <p className="text-t-secondary mb-6">
            You've already accepted this invitation.
          </p>
          <Link href="/dashboard">
            <Button isSecondary>Go to Dashboard</Button>
          </Link>
        </div>
      );
    }

    if (status === "error") {
      return (
        <div className="text-center">
          <div className="flex items-center justify-center size-16 rounded-full bg-red-500/10 mx-auto mb-4">
            <Icon className="!w-8 !h-8 fill-red-500" name="close" />
          </div>
          <h1 className="text-h3 mb-2">Something Went Wrong</h1>
          <p className="text-t-secondary mb-6">
            We couldn't verify this invitation. Please try again later.
          </p>
          <Link href="/">
            <Button isSecondary>Go to Homepage</Button>
          </Link>
        </div>
      );
    }

    // Valid invite
    const isWorkspace = invite?.type === "workspace";
    const roleDisplay = invite?.role ? invite.role.charAt(0).toUpperCase() + invite.role.slice(1) : "";

    return (
      <div className="text-center">
        <div className="flex items-center justify-center size-16 rounded-full bg-primary1/10 mx-auto mb-4">
          <Icon className="!w-8 !h-8 fill-primary1" name={isWorkspace ? "cube" : "documents"} />
        </div>
        <h1 className="text-h3 mb-2">You're Invited!</h1>
        <p className="text-t-secondary mb-6">
          <strong className="text-t-primary">{invite?.inviter_name}</strong> has invited you to join
        </p>

        {/* Invite Card */}
        <div className="p-6 rounded-2xl bg-b-surface2 mb-6">
          <p className="text-xs font-semibold text-t-tertiary uppercase tracking-wider mb-2">
            {isWorkspace ? "Workspace" : "Project"}
          </p>
          <h2 className="text-h4 mb-2">{invite?.target_name}</h2>
          {!isWorkspace && invite?.workspace_name && (
            <p className="text-small text-t-tertiary mb-3">
              in {invite.workspace_name}
            </p>
          )}
          <span className="inline-block px-3 py-1 rounded-full bg-primary1 text-white text-small font-medium">
            {roleDisplay}
          </span>
        </div>

        <p className="text-small text-t-tertiary mb-6">
          Invitation sent to: <strong>{invite?.email}</strong>
        </p>

        <Button 
          isSecondary 
          onClick={handleAcceptInvite}
          disabled={isAccepting}
          className="w-full"
        >
          {isAccepting ? "Accepting..." : user ? "Accept Invitation" : "Sign in to Accept"}
        </Button>

        {!user && (
          <p className="text-xs text-t-tertiary mt-4">
            Don't have an account? You'll be able to create one after clicking the button.
          </p>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-b-surface1 p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/">
            <Image
              className="h-8 mx-auto opacity-100 dark:hidden!"
              src="/images/Logo-dark.svg"
              width={142}
              height={36}
              alt="Nerlude"
            />
            <Image
              className="hidden! h-8 mx-auto opacity-100 dark:block!"
              src="/images/Logo-light.svg"
              width={142}
              height={36}
              alt="Nerlude"
            />
          </Link>
        </div>

        {/* Card */}
        <div className="p-8 rounded-4xl bg-b-surface2 shadow-lg">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}

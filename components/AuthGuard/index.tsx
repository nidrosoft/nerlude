"use client";

import { useEffect } from "react";
import { getSupabaseClient } from "@/lib/db";

type Props = {
    children: React.ReactNode;
};

const AuthGuard = ({ children }: Props) => {
    useEffect(() => {
        // Check auth on mount - if no session, redirect
        const checkAuth = async () => {
            try {
                const supabase = getSupabaseClient();
                const { data: { session } } = await supabase.auth.getSession();
                
                if (!session) {
                    // No session, redirect to home
                    window.location.replace("/");
                }
            } catch (error) {
                console.error("Auth check error:", error);
                window.location.replace("/");
            }
        };

        checkAuth();

        // Subscribe to auth state changes for real-time logout detection
        const supabase = getSupabaseClient();
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            if (event === 'SIGNED_OUT' || !session) {
                window.location.replace("/");
            }
        });

        return () => {
            subscription.unsubscribe();
        };
    }, []);

    // Always render children - middleware handles initial auth check
    // This component only handles back button bypass after logout
    return <>{children}</>;
};

export default AuthGuard;

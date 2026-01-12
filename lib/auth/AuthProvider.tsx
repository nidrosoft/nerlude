'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { getSupabaseClient } from '@/lib/db';
import { useUserStore } from '@/stores/userStore';
import { useWorkspaceStore } from '@/stores/workspaceStore';
import { User as SupabaseUser, Session } from '@supabase/supabase-js';

interface AuthContextType {
  user: SupabaseUser | null;
  session: Session | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<{ error?: string }>;
  signUp: (email: string, password: string, name: string) => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const { setUser: setStoreUser, logout: storeLogout } = useUserStore();
  const { setWorkspaces, setCurrentWorkspace } = useWorkspaceStore();

  useEffect(() => {
    const supabase = getSupabaseClient();

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        loadUserData(session.user.id);
      }
      
      setIsLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('Auth state changed:', event);
        setSession(session);
        setUser(session?.user ?? null);

        if (event === 'SIGNED_IN' && session?.user) {
          // Don't await - let it run in background so UI isn't blocked
          loadUserData(session.user.id).catch(err => {
            console.error('Error loading user data:', err);
          });
        } else if (event === 'SIGNED_OUT') {
          storeLogout();
          setWorkspaces([]);
          setCurrentWorkspace(null);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const loadUserData = async (userId: string) => {
    const supabase = getSupabaseClient();
    console.log('loadUserData: Starting for user', userId);
    
    try {
      // Load user profile
      console.log('loadUserData: Fetching user profile...');
      const { data: profile, error: profileError } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (profileError) {
        console.error('loadUserData: Error loading user profile:', profileError);
      } else {
        console.log('loadUserData: Profile loaded successfully');
      }

      if (profile) {
        setStoreUser({
          id: profile.id,
          email: profile.email,
          name: profile.name,
          avatarUrl: profile.avatar_url || undefined,
          createdAt: profile.created_at || new Date().toISOString(),
          updatedAt: profile.updated_at || new Date().toISOString(),
        });
      }

      // Load workspaces - first get membership IDs
      console.log('loadUserData: Fetching workspace memberships...');
      const { data: memberships, error: memberError } = await supabase
        .from('workspace_members')
        .select('workspace_id, role')
        .eq('user_id', userId);

      if (memberError) {
        console.error('loadUserData: Error loading workspace memberships:', memberError);
        return;
      }
      console.log('loadUserData: Memberships loaded:', memberships?.length || 0);

      if (memberships && memberships.length > 0) {
        // Then fetch the workspaces separately
        const workspaceIds = memberships.map(m => m.workspace_id).filter((id): id is string => id !== null);
        console.log('loadUserData: Fetching workspaces for IDs:', workspaceIds);
        const { data: workspacesData, error: wsError } = await supabase
          .from('workspaces')
          .select('*')
          .in('id', workspaceIds);

        if (wsError) {
          console.error('loadUserData: Error loading workspaces:', wsError);
          return;
        }
        console.log('loadUserData: Workspaces loaded:', workspacesData?.length || 0);

        if (workspacesData) {
          const workspaces = workspacesData.map((ws: any) => {
            const membership = memberships.find(m => m.workspace_id === ws.id);
            return {
              ...ws,
              role: membership?.role,
            };
          });
          setWorkspaces(workspaces);
          
          if (workspaces.length > 0) {
            setCurrentWorkspace(workspaces[0]);
          }
        }
      }
      console.log('loadUserData: Completed successfully');
    } catch (error) {
      console.error('loadUserData: Unexpected error:', error);
    }
  };

  const signIn = async (email: string, password: string) => {
    const supabase = getSupabaseClient();
    
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return { error: error.message };
    }

    return {};
  };

  const signUp = async (email: string, password: string, name: string) => {
    const supabase = getSupabaseClient();
    
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { name },
        },
      });

      if (error) {
        console.error('SignUp auth error:', error);
        return { error: error.message };
      }

      // Create user profile
      if (data.user) {
        const { error: userError } = await supabase.from('users').insert({
          id: data.user.id,
          email: data.user.email!,
          name,
        });
        if (userError) console.error('Error creating user profile:', userError);

        // Create default preferences
        const { error: prefError } = await supabase.from('user_preferences').insert({
          user_id: data.user.id,
        });
        if (prefError) console.error('Error creating preferences:', prefError);

        // Create default workspace
        const { data: workspace, error: wsError } = await supabase
          .from('workspaces')
          .insert({
            name: 'My Workspace',
            slug: `workspace-${Date.now()}`,
            owner_id: data.user.id,
            workspace_type: 'personal',
          })
          .select()
          .single();

        if (wsError) {
          console.error('Error creating workspace:', wsError);
        } else if (workspace) {
          const { error: memberError } = await supabase.from('workspace_members').insert({
            workspace_id: workspace.id,
            user_id: data.user.id,
            role: 'owner',
            accepted_at: new Date().toISOString(),
          });
          if (memberError) console.error('Error creating workspace member:', memberError);

          const { error: subError } = await supabase.from('subscriptions').insert({
            workspace_id: workspace.id,
            plan: 'free',
            status: 'active',
          });
          if (subError) console.error('Error creating subscription:', subError);
        }
      }

      return {};
    } catch (err) {
      console.error('SignUp unexpected error:', err);
      return { error: 'An unexpected error occurred' };
    }
  };

  const signOut = async () => {
    const supabase = getSupabaseClient();
    await supabase.auth.signOut();
  };

  const resetPassword = async (email: string) => {
    const supabase = getSupabaseClient();
    
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback?type=recovery`,
    });

    if (error) {
      return { error: error.message };
    }

    return {};
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        isLoading,
        signIn,
        signUp,
        signOut,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

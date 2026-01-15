export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      audit_logs: {
        Row: {
          action: string
          created_at: string | null
          entity_id: string | null
          entity_type: string
          id: string
          ip_address: unknown
          metadata: Json | null
          new_data: Json | null
          old_data: Json | null
          user_agent: string | null
          user_id: string | null
          workspace_id: string | null
        }
        Insert: {
          action: string
          created_at?: string | null
          entity_id?: string | null
          entity_type: string
          id?: string
          ip_address?: unknown
          metadata?: Json | null
          new_data?: Json | null
          old_data?: Json | null
          user_agent?: string | null
          user_id?: string | null
          workspace_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string | null
          entity_id?: string | null
          entity_type?: string
          id?: string
          ip_address?: unknown
          metadata?: Json | null
          new_data?: Json | null
          old_data?: Json | null
          user_agent?: string | null
          user_id?: string | null
          workspace_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "audit_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "audit_logs_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string | null
          data: Json | null
          dismissed_at: string | null
          id: string
          message: string | null
          read_at: string | null
          snoozed_until: string | null
          title: string
          type: string
          user_id: string | null
          workspace_id: string | null
        }
        Insert: {
          created_at?: string | null
          data?: Json | null
          dismissed_at?: string | null
          id?: string
          message?: string | null
          read_at?: string | null
          snoozed_until?: string | null
          title: string
          type: string
          user_id?: string | null
          workspace_id?: string | null
        }
        Update: {
          created_at?: string | null
          data?: Json | null
          dismissed_at?: string | null
          id?: string
          message?: string | null
          read_at?: string | null
          snoozed_until?: string | null
          title?: string
          type?: string
          user_id?: string | null
          workspace_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notifications_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      plan_limits: {
        Row: {
          created_at: string | null
          features: Json | null
          id: string
          max_projects: number | null
          max_services_per_project: number | null
          max_storage_mb: number | null
          max_team_members: number | null
          plan: string
        }
        Insert: {
          created_at?: string | null
          features?: Json | null
          id?: string
          max_projects?: number | null
          max_services_per_project?: number | null
          max_storage_mb?: number | null
          max_team_members?: number | null
          plan: string
        }
        Update: {
          created_at?: string | null
          features?: Json | null
          id?: string
          max_projects?: number | null
          max_services_per_project?: number | null
          max_storage_mb?: number | null
          max_team_members?: number | null
          plan?: string
        }
        Relationships: []
      }
      project_assets: {
        Row: {
          category: string | null
          created_at: string | null
          file_path: string
          file_size: number | null
          file_type: string | null
          folder_id: string | null
          id: string
          metadata: Json | null
          name: string
          project_id: string | null
          uploaded_by: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          file_path: string
          file_size?: number | null
          file_type?: string | null
          folder_id?: string | null
          id?: string
          metadata?: Json | null
          name: string
          project_id?: string | null
          uploaded_by?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string | null
          file_path?: string
          file_size?: number | null
          file_type?: string | null
          folder_id?: string | null
          id?: string
          metadata?: Json | null
          name?: string
          project_id?: string | null
          uploaded_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "project_assets_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_assets_uploaded_by_fkey"
            columns: ["uploaded_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      project_documents: {
        Row: {
          content: string | null
          created_at: string | null
          created_by: string | null
          doc_type: string
          emoji: string | null
          icon: string | null
          id: string
          project_id: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          content?: string | null
          created_at?: string | null
          created_by?: string | null
          doc_type: string
          emoji?: string | null
          icon?: string | null
          id?: string
          project_id?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          content?: string | null
          created_at?: string | null
          created_by?: string | null
          doc_type?: string
          emoji?: string | null
          icon?: string | null
          id?: string
          project_id?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "project_documents_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_documents_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      project_invites: {
        Row: {
          accepted_at: string | null
          created_at: string | null
          email: string
          expires_at: string
          id: string
          invited_by: string | null
          project_id: string | null
          role: string
          token: string
        }
        Insert: {
          accepted_at?: string | null
          created_at?: string | null
          email: string
          expires_at: string
          id?: string
          invited_by?: string | null
          project_id?: string | null
          role: string
          token: string
        }
        Update: {
          accepted_at?: string | null
          created_at?: string | null
          email?: string
          expires_at?: string
          id?: string
          invited_by?: string | null
          project_id?: string | null
          role?: string
          token?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_invites_invited_by_fkey"
            columns: ["invited_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_invites_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      project_members: {
        Row: {
          access_expires_at: string | null
          created_at: string | null
          id: string
          project_id: string | null
          role: string
          user_id: string | null
        }
        Insert: {
          access_expires_at?: string | null
          created_at?: string | null
          id?: string
          project_id?: string | null
          role: string
          user_id?: string | null
        }
        Update: {
          access_expires_at?: string | null
          created_at?: string | null
          id?: string
          project_id?: string | null
          role?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "project_members_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_members_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      project_services: {
        Row: {
          category_id: string
          cost_amount: number | null
          cost_frequency: string | null
          created_at: string | null
          created_by: string | null
          currency: string | null
          custom_logo_url: string | null
          id: string
          name: string
          notes: string | null
          plan: string | null
          project_id: string | null
          registry_id: string | null
          renewal_date: string | null
          renewal_reminder_days: number[] | null
          settings: Json | null
          stack_id: string | null
          status: string | null
          sub_category_id: string | null
          updated_at: string | null
        }
        Insert: {
          category_id: string
          cost_amount?: number | null
          cost_frequency?: string | null
          created_at?: string | null
          created_by?: string | null
          currency?: string | null
          custom_logo_url?: string | null
          id?: string
          name: string
          notes?: string | null
          plan?: string | null
          project_id?: string | null
          registry_id?: string | null
          renewal_date?: string | null
          renewal_reminder_days?: number[] | null
          settings?: Json | null
          stack_id?: string | null
          status?: string | null
          sub_category_id?: string | null
          updated_at?: string | null
        }
        Update: {
          category_id?: string
          cost_amount?: number | null
          cost_frequency?: string | null
          created_at?: string | null
          created_by?: string | null
          currency?: string | null
          custom_logo_url?: string | null
          id?: string
          name?: string
          notes?: string | null
          plan?: string | null
          project_id?: string | null
          registry_id?: string | null
          renewal_date?: string | null
          renewal_reminder_days?: number[] | null
          settings?: Json | null
          stack_id?: string | null
          status?: string | null
          sub_category_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "project_services_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_services_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_services_stack_id_fkey"
            columns: ["stack_id"]
            isOneToOne: false
            referencedRelation: "service_stacks"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          created_at: string | null
          created_by: string | null
          description: string | null
          icon: string | null
          id: string
          name: string
          settings: Json | null
          status: string | null
          type: string
          updated_at: string | null
          workspace_id: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          name: string
          settings?: Json | null
          status?: string | null
          type: string
          updated_at?: string | null
          workspace_id?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          name?: string
          settings?: Json | null
          status?: string | null
          type?: string
          updated_at?: string | null
          workspace_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "projects_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "projects_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      service_credentials: {
        Row: {
          created_at: string | null
          credentials_encrypted: string
          environment: string
          id: string
          last_rotated_at: string | null
          project_service_id: string | null
          rotation_reminder_days: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          credentials_encrypted: string
          environment: string
          id?: string
          last_rotated_at?: string | null
          project_service_id?: string | null
          rotation_reminder_days?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          credentials_encrypted?: string
          environment?: string
          id?: string
          last_rotated_at?: string | null
          project_service_id?: string | null
          rotation_reminder_days?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "service_credentials_project_service_id_fkey"
            columns: ["project_service_id"]
            isOneToOne: false
            referencedRelation: "project_services"
            referencedColumns: ["id"]
          },
        ]
      }
      service_notification_settings: {
        Row: {
          billing_notifications: boolean | null
          created_at: string | null
          id: string
          project_service_id: string | null
          renewal_reminders: boolean | null
          updated_at: string | null
          usage_alerts: boolean | null
          usage_threshold_percent: number | null
        }
        Insert: {
          billing_notifications?: boolean | null
          created_at?: string | null
          id?: string
          project_service_id?: string | null
          renewal_reminders?: boolean | null
          updated_at?: string | null
          usage_alerts?: boolean | null
          usage_threshold_percent?: number | null
        }
        Update: {
          billing_notifications?: boolean | null
          created_at?: string | null
          id?: string
          project_service_id?: string | null
          renewal_reminders?: boolean | null
          updated_at?: string | null
          usage_alerts?: boolean | null
          usage_threshold_percent?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "service_notification_settings_project_service_id_fkey"
            columns: ["project_service_id"]
            isOneToOne: true
            referencedRelation: "project_services"
            referencedColumns: ["id"]
          },
        ]
      }
      service_quick_links: {
        Row: {
          created_at: string | null
          id: string
          label: string
          project_service_id: string | null
          sort_order: number | null
          url: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          label: string
          project_service_id?: string | null
          sort_order?: number | null
          url: string
        }
        Update: {
          created_at?: string | null
          id?: string
          label?: string
          project_service_id?: string | null
          sort_order?: number | null
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "service_quick_links_project_service_id_fkey"
            columns: ["project_service_id"]
            isOneToOne: false
            referencedRelation: "project_services"
            referencedColumns: ["id"]
          },
        ]
      }
      service_stacks: {
        Row: {
          color: string | null
          created_at: string | null
          description: string | null
          icon: string | null
          id: string
          name: string
          project_id: string | null
          sort_order: number | null
          updated_at: string | null
        }
        Insert: {
          color?: string | null
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          name: string
          project_id?: string | null
          sort_order?: number | null
          updated_at?: string | null
        }
        Update: {
          color?: string | null
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          name?: string
          project_id?: string | null
          sort_order?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "service_stacks_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      subscriptions: {
        Row: {
          cancel_at_period_end: boolean | null
          created_at: string | null
          current_period_end: string | null
          current_period_start: string | null
          id: string
          plan: string
          status: string
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          trial_ends_at: string | null
          updated_at: string | null
          workspace_id: string | null
        }
        Insert: {
          cancel_at_period_end?: boolean | null
          created_at?: string | null
          current_period_end?: string | null
          current_period_start?: string | null
          id?: string
          plan?: string
          status?: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          trial_ends_at?: string | null
          updated_at?: string | null
          workspace_id?: string | null
        }
        Update: {
          cancel_at_period_end?: boolean | null
          created_at?: string | null
          current_period_end?: string | null
          current_period_start?: string | null
          id?: string
          plan?: string
          status?: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          trial_ends_at?: string | null
          updated_at?: string | null
          workspace_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: true
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      user_onboarding: {
        Row: {
          company_size: string | null
          completed_at: string | null
          created_at: string | null
          how_found_us: string | null
          id: string
          product_count: string | null
          use_case: string | null
          user_id: string | null
          user_type: string | null
        }
        Insert: {
          company_size?: string | null
          completed_at?: string | null
          created_at?: string | null
          how_found_us?: string | null
          id?: string
          product_count?: string | null
          use_case?: string | null
          user_id?: string | null
          user_type?: string | null
        }
        Update: {
          company_size?: string | null
          completed_at?: string | null
          created_at?: string | null
          how_found_us?: string | null
          id?: string
          product_count?: string | null
          use_case?: string | null
          user_id?: string | null
          user_type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_onboarding_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_preferences: {
        Row: {
          cost_alerts: boolean | null
          created_at: string | null
          email_frequency: string | null
          email_notifications: boolean | null
          id: string
          in_app_notifications: boolean | null
          quiet_hours_end: string | null
          quiet_hours_start: string | null
          renewal_alerts: boolean | null
          system_alerts: boolean | null
          team_alerts: boolean | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          cost_alerts?: boolean | null
          created_at?: string | null
          email_frequency?: string | null
          email_notifications?: boolean | null
          id?: string
          in_app_notifications?: boolean | null
          quiet_hours_end?: string | null
          quiet_hours_start?: string | null
          renewal_alerts?: boolean | null
          system_alerts?: boolean | null
          team_alerts?: boolean | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          cost_alerts?: boolean | null
          created_at?: string | null
          email_frequency?: string | null
          email_notifications?: boolean | null
          id?: string
          in_app_notifications?: boolean | null
          quiet_hours_end?: string | null
          quiet_hours_start?: string | null
          renewal_alerts?: boolean | null
          system_alerts?: boolean | null
          team_alerts?: boolean | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_preferences_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          email: string
          email_verified_at: string | null
          id: string
          name: string
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          email: string
          email_verified_at?: string | null
          id: string
          name: string
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string
          email_verified_at?: string | null
          id?: string
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      workspace_invites: {
        Row: {
          accepted_at: string | null
          created_at: string | null
          email: string
          expires_at: string
          id: string
          invited_by: string | null
          role: string
          token: string
          workspace_id: string | null
        }
        Insert: {
          accepted_at?: string | null
          created_at?: string | null
          email: string
          expires_at: string
          id?: string
          invited_by?: string | null
          role: string
          token: string
          workspace_id?: string | null
        }
        Update: {
          accepted_at?: string | null
          created_at?: string | null
          email?: string
          expires_at?: string
          id?: string
          invited_by?: string | null
          role?: string
          token?: string
          workspace_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "workspace_invites_invited_by_fkey"
            columns: ["invited_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "workspace_invites_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      workspace_members: {
        Row: {
          accepted_at: string | null
          id: string
          invited_at: string | null
          invited_by: string | null
          role: string
          user_id: string | null
          workspace_id: string | null
        }
        Insert: {
          accepted_at?: string | null
          id?: string
          invited_at?: string | null
          invited_by?: string | null
          role: string
          user_id?: string | null
          workspace_id?: string | null
        }
        Update: {
          accepted_at?: string | null
          id?: string
          invited_at?: string | null
          invited_by?: string | null
          role?: string
          user_id?: string | null
          workspace_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "workspace_members_invited_by_fkey"
            columns: ["invited_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "workspace_members_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "workspace_members_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      workspaces: {
        Row: {
          created_at: string | null
          encryption_key_id: string | null
          id: string
          name: string
          owner_id: string | null
          settings: Json | null
          slug: string
          updated_at: string | null
          workspace_type: string | null
        }
        Insert: {
          created_at?: string | null
          encryption_key_id?: string | null
          id?: string
          name: string
          owner_id?: string | null
          settings?: Json | null
          slug: string
          updated_at?: string | null
          workspace_type?: string | null
        }
        Update: {
          created_at?: string | null
          encryption_key_id?: string | null
          id?: string
          name?: string
          owner_id?: string | null
          settings?: Json | null
          slug?: string
          updated_at?: string | null
          workspace_type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "workspaces_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

// Helper types for easier usage
export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type TablesInsert<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert']
export type TablesUpdate<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update']

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      chat_conversations: {
        Row: {
          created_at: string
          id: string
          session_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          session_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          session_id?: string
          updated_at?: string
        }
        Relationships: []
      }
      chat_messages: {
        Row: {
          content: string
          conversation_id: string
          created_at: string
          id: string
          role: string
        }
        Insert: {
          content: string
          conversation_id: string
          created_at?: string
          id?: string
          role: string
        }
        Update: {
          content?: string
          conversation_id?: string
          created_at?: string
          id?: string
          role?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "chat_conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      contact_submissions: {
        Row: {
          created_at: string
          email: string
          id: string
          message: string
          name: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          message: string
          name: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          message?: string
          name?: string
        }
        Relationships: []
      }
      crm_contacts: {
        Row: {
          company: string | null
          created_at: string
          email: string
          id: string
          last_contacted_at: string | null
          name: string
          notes: string | null
          phone: string | null
          role: string | null
          source: string | null
          status: string | null
          subscribed_to_emails: boolean | null
          tags: string[] | null
          updated_at: string
        }
        Insert: {
          company?: string | null
          created_at?: string
          email: string
          id?: string
          last_contacted_at?: string | null
          name: string
          notes?: string | null
          phone?: string | null
          role?: string | null
          source?: string | null
          status?: string | null
          subscribed_to_emails?: boolean | null
          tags?: string[] | null
          updated_at?: string
        }
        Update: {
          company?: string | null
          created_at?: string
          email?: string
          id?: string
          last_contacted_at?: string | null
          name?: string
          notes?: string | null
          phone?: string | null
          role?: string | null
          source?: string | null
          status?: string | null
          subscribed_to_emails?: boolean | null
          tags?: string[] | null
          updated_at?: string
        }
        Relationships: []
      }
      email_campaigns: {
        Row: {
          body_html: string | null
          body_text: string | null
          click_count: number | null
          created_at: string
          created_by: string | null
          id: string
          name: string
          open_count: number | null
          recipient_count: number | null
          scheduled_at: string | null
          sent_at: string | null
          status: string | null
          subject: string
          updated_at: string
        }
        Insert: {
          body_html?: string | null
          body_text?: string | null
          click_count?: number | null
          created_at?: string
          created_by?: string | null
          id?: string
          name: string
          open_count?: number | null
          recipient_count?: number | null
          scheduled_at?: string | null
          sent_at?: string | null
          status?: string | null
          subject: string
          updated_at?: string
        }
        Update: {
          body_html?: string | null
          body_text?: string | null
          click_count?: number | null
          created_at?: string
          created_by?: string | null
          id?: string
          name?: string
          open_count?: number | null
          recipient_count?: number | null
          scheduled_at?: string | null
          sent_at?: string | null
          status?: string | null
          subject?: string
          updated_at?: string
        }
        Relationships: []
      }
      financial_projections: {
        Row: {
          chart_data: Json | null
          created_at: string
          description: string | null
          display_order: number | null
          id: string
          is_published: boolean
          metric_name: string
          metric_unit: string | null
          metric_value: number | null
          quarter: string | null
          updated_at: string
          year: number
        }
        Insert: {
          chart_data?: Json | null
          created_at?: string
          description?: string | null
          display_order?: number | null
          id?: string
          is_published?: boolean
          metric_name: string
          metric_unit?: string | null
          metric_value?: number | null
          quarter?: string | null
          updated_at?: string
          year: number
        }
        Update: {
          chart_data?: Json | null
          created_at?: string
          description?: string | null
          display_order?: number | null
          id?: string
          is_published?: boolean
          metric_name?: string
          metric_unit?: string | null
          metric_value?: number | null
          quarter?: string | null
          updated_at?: string
          year?: number
        }
        Relationships: []
      }
      impact_metrics: {
        Row: {
          category: string
          change_percentage: number | null
          created_at: string
          description: string | null
          display_order: number | null
          icon: string | null
          id: string
          is_published: boolean
          metric_name: string
          metric_value: string | null
          period: string | null
          trend: string | null
          unit: string | null
          updated_at: string
        }
        Insert: {
          category: string
          change_percentage?: number | null
          created_at?: string
          description?: string | null
          display_order?: number | null
          icon?: string | null
          id?: string
          is_published?: boolean
          metric_name: string
          metric_value?: string | null
          period?: string | null
          trend?: string | null
          unit?: string | null
          updated_at?: string
        }
        Update: {
          category?: string
          change_percentage?: number | null
          created_at?: string
          description?: string | null
          display_order?: number | null
          icon?: string | null
          id?: string
          is_published?: boolean
          metric_name?: string
          metric_value?: string | null
          period?: string | null
          trend?: string | null
          unit?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      investor_chat_messages: {
        Row: {
          content: string
          created_at: string
          id: string
          role: string
          session_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          role: string
          session_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          role?: string
          session_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "investor_chat_messages_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "investor_chat_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      investor_chat_sessions: {
        Row: {
          created_at: string
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      portal_access: {
        Row: {
          created_at: string
          granted_by: string | null
          id: string
          portal_section: string
          user_id: string
        }
        Insert: {
          created_at?: string
          granted_by?: string | null
          id?: string
          portal_section: string
          user_id: string
        }
        Update: {
          created_at?: string
          granted_by?: string | null
          id?: string
          portal_section?: string
          user_id?: string
        }
        Relationships: []
      }
      portal_documents: {
        Row: {
          created_at: string
          description: string | null
          file_name: string | null
          file_size: number | null
          file_type: string | null
          file_url: string | null
          id: string
          is_published: boolean
          section: string
          tags: string[] | null
          title: string
          updated_at: string
          uploaded_by: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          file_name?: string | null
          file_size?: number | null
          file_type?: string | null
          file_url?: string | null
          id?: string
          is_published?: boolean
          section: string
          tags?: string[] | null
          title: string
          updated_at?: string
          uploaded_by?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          file_name?: string | null
          file_size?: number | null
          file_type?: string | null
          file_url?: string | null
          id?: string
          is_published?: boolean
          section?: string
          tags?: string[] | null
          title?: string
          updated_at?: string
          uploaded_by?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          display_name: string | null
          email: string | null
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          email?: string | null
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          email?: string | null
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "portal_editor" | "investor" | "viewer"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "portal_editor", "investor", "viewer"],
    },
  },
} as const

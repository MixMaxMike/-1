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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      analytics: {
        Row: {
          content_id: string | null
          created_at: string
          id: string
          metric_type: string
          metric_value: number
          publication_id: string | null
          recorded_at: string
        }
        Insert: {
          content_id?: string | null
          created_at?: string
          id?: string
          metric_type: string
          metric_value: number
          publication_id?: string | null
          recorded_at?: string
        }
        Update: {
          content_id?: string | null
          created_at?: string
          id?: string
          metric_type?: string
          metric_value?: number
          publication_id?: string | null
          recorded_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "analytics_content_id_fkey"
            columns: ["content_id"]
            isOneToOne: false
            referencedRelation: "content"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "analytics_publication_id_fkey"
            columns: ["publication_id"]
            isOneToOne: false
            referencedRelation: "publications"
            referencedColumns: ["id"]
          },
        ]
      }
      content: {
        Row: {
          audio_url: string | null
          created_at: string
          generation_completed_at: string | null
          generation_started_at: string | null
          id: string
          script: string
          status: string
          thumbnail_url: string | null
          title: string
          trend_id: string | null
          updated_at: string
          video_prompt: string | null
          video_url: string | null
        }
        Insert: {
          audio_url?: string | null
          created_at?: string
          generation_completed_at?: string | null
          generation_started_at?: string | null
          id?: string
          script: string
          status?: string
          thumbnail_url?: string | null
          title: string
          trend_id?: string | null
          updated_at?: string
          video_prompt?: string | null
          video_url?: string | null
        }
        Update: {
          audio_url?: string | null
          created_at?: string
          generation_completed_at?: string | null
          generation_started_at?: string | null
          id?: string
          script?: string
          status?: string
          thumbnail_url?: string | null
          title?: string
          trend_id?: string | null
          updated_at?: string
          video_prompt?: string | null
          video_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "content_trend_id_fkey"
            columns: ["trend_id"]
            isOneToOne: false
            referencedRelation: "trends"
            referencedColumns: ["id"]
          },
        ]
      }
      custom_sources: {
        Row: {
          category: string
          created_at: string
          id: string
          is_active: boolean
          name: string
          source_type: string
          updated_at: string
          url: string
        }
        Insert: {
          category?: string
          created_at?: string
          id?: string
          is_active?: boolean
          name: string
          source_type?: string
          updated_at?: string
          url: string
        }
        Update: {
          category?: string
          created_at?: string
          id?: string
          is_active?: boolean
          name?: string
          source_type?: string
          updated_at?: string
          url?: string
        }
        Relationships: []
      }
      pipeline_status: {
        Row: {
          created_at: string
          error_message: string | null
          id: string
          items_processed: number | null
          last_run: string | null
          pipeline_name: string
          progress: number | null
          status: string
          total_items: number | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          error_message?: string | null
          id?: string
          items_processed?: number | null
          last_run?: string | null
          pipeline_name: string
          progress?: number | null
          status?: string
          total_items?: number | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          error_message?: string | null
          id?: string
          items_processed?: number | null
          last_run?: string | null
          pipeline_name?: string
          progress?: number | null
          status?: string
          total_items?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      publications: {
        Row: {
          comments: number | null
          content_id: string | null
          created_at: string
          id: string
          likes: number | null
          platform: string
          platform_post_id: string | null
          post_url: string | null
          published_at: string | null
          shares: number | null
          status: string
          updated_at: string
          views: number | null
        }
        Insert: {
          comments?: number | null
          content_id?: string | null
          created_at?: string
          id?: string
          likes?: number | null
          platform: string
          platform_post_id?: string | null
          post_url?: string | null
          published_at?: string | null
          shares?: number | null
          status?: string
          updated_at?: string
          views?: number | null
        }
        Update: {
          comments?: number | null
          content_id?: string | null
          created_at?: string
          id?: string
          likes?: number | null
          platform?: string
          platform_post_id?: string | null
          post_url?: string | null
          published_at?: string | null
          shares?: number | null
          status?: string
          updated_at?: string
          views?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "publications_content_id_fkey"
            columns: ["content_id"]
            isOneToOne: false
            referencedRelation: "content"
            referencedColumns: ["id"]
          },
        ]
      }
      trends: {
        Row: {
          category: string
          collected_at: string
          content: string | null
          created_at: string
          description: string | null
          id: string
          keywords: string[] | null
          processed: boolean | null
          score: number | null
          source: string
          source_url: string | null
          title: string
        }
        Insert: {
          category?: string
          collected_at?: string
          content?: string | null
          created_at?: string
          description?: string | null
          id?: string
          keywords?: string[] | null
          processed?: boolean | null
          score?: number | null
          source: string
          source_url?: string | null
          title: string
        }
        Update: {
          category?: string
          collected_at?: string
          content?: string | null
          created_at?: string
          description?: string | null
          id?: string
          keywords?: string[] | null
          processed?: boolean | null
          score?: number | null
          source?: string
          source_url?: string | null
          title?: string
        }
        Relationships: []
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
    Enums: {},
  },
} as const

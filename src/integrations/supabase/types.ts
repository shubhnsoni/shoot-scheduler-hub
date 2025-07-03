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
      beta_waitlist: {
        Row: {
          company: string | null
          created_at: string
          email: string
          id: string
          interest_reason: string | null
          name: string
          role: string | null
          status: string
        }
        Insert: {
          company?: string | null
          created_at?: string
          email: string
          id?: string
          interest_reason?: string | null
          name: string
          role?: string | null
          status?: string
        }
        Update: {
          company?: string | null
          created_at?: string
          email?: string
          id?: string
          interest_reason?: string | null
          name?: string
          role?: string | null
          status?: string
        }
        Relationships: []
      }
      coupons: {
        Row: {
          amount: number
          code: string
          created_at: string | null
          current_uses: number | null
          id: string
          is_active: boolean | null
          max_uses: number | null
          type: string
          updated_at: string | null
          valid_until: string | null
        }
        Insert: {
          amount: number
          code: string
          created_at?: string | null
          current_uses?: number | null
          id?: string
          is_active?: boolean | null
          max_uses?: number | null
          type: string
          updated_at?: string | null
          valid_until?: string | null
        }
        Update: {
          amount?: number
          code?: string
          created_at?: string | null
          current_uses?: number | null
          id?: string
          is_active?: boolean | null
          max_uses?: number | null
          type?: string
          updated_at?: string | null
          valid_until?: string | null
        }
        Relationships: []
      }
      integrations: {
        Row: {
          created_at: string | null
          credentials: Json | null
          id: string
          is_active: boolean | null
          is_connected: boolean | null
          name: string
          type: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          credentials?: Json | null
          id?: string
          is_active?: boolean | null
          is_connected?: boolean | null
          name: string
          type: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          credentials?: Json | null
          id?: string
          is_active?: boolean | null
          is_connected?: boolean | null
          name?: string
          type?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      messages: {
        Row: {
          created_at: string | null
          id: string
          message: string
          read: boolean | null
          recipient_id: string
          sender_id: string
          shoot_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          message: string
          read?: boolean | null
          recipient_id: string
          sender_id: string
          shoot_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          message?: string
          read?: boolean | null
          recipient_id?: string
          sender_id?: string
          shoot_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar: string | null
          bio: string | null
          company: string | null
          created_at: string | null
          email: string | null
          id: string
          is_active: boolean | null
          last_login: string | null
          metadata: Json | null
          name: string | null
          phone: string | null
          role: string | null
          username: string | null
        }
        Insert: {
          avatar?: string | null
          bio?: string | null
          company?: string | null
          created_at?: string | null
          email?: string | null
          id: string
          is_active?: boolean | null
          last_login?: string | null
          metadata?: Json | null
          name?: string | null
          phone?: string | null
          role?: string | null
          username?: string | null
        }
        Update: {
          avatar?: string | null
          bio?: string | null
          company?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          is_active?: boolean | null
          last_login?: string | null
          metadata?: Json | null
          name?: string | null
          phone?: string | null
          role?: string | null
          username?: string | null
        }
        Relationships: []
      }
      service_categories: {
        Row: {
          created_at: string | null
          display_order: number
          id: string
          name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          display_order?: number
          id?: string
          name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          display_order?: number
          id?: string
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      services: {
        Row: {
          category: string
          category_id: string | null
          created_at: string | null
          description: string | null
          display_order: number | null
          duration: number | null
          id: string
          is_active: boolean | null
          name: string
          price: number
          updated_at: string | null
        }
        Insert: {
          category: string
          category_id?: string | null
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          duration?: number | null
          id?: string
          is_active?: boolean | null
          name: string
          price: number
          updated_at?: string | null
        }
        Update: {
          category?: string
          category_id?: string | null
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          duration?: number | null
          id?: string
          is_active?: boolean | null
          name?: string
          price?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "services_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "service_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      shoot_reschedule_requests: {
        Row: {
          created_at: string | null
          id: string
          original_date: string
          reason: string | null
          requested_by: string
          requested_date: string
          shoot_id: string
          status: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          original_date: string
          reason?: string | null
          requested_by: string
          requested_date: string
          shoot_id: string
          status?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          original_date?: string
          reason?: string | null
          requested_by?: string
          requested_date?: string
          shoot_id?: string
          status?: string | null
        }
        Relationships: []
      }
      shoots: {
        Row: {
          client: Json
          completed_date: string | null
          created_at: string | null
          created_by: string
          editor: Json | null
          id: string
          location: Json
          media: Json | null
          notes: Json | null
          payment: Json
          photographer: Json
          scheduled_date: string
          services: Json
          status: string
          time: string
          tour_links: Json | null
          updated_at: string | null
        }
        Insert: {
          client: Json
          completed_date?: string | null
          created_at?: string | null
          created_by: string
          editor?: Json | null
          id?: string
          location: Json
          media?: Json | null
          notes?: Json | null
          payment: Json
          photographer: Json
          scheduled_date: string
          services?: Json
          status?: string
          time: string
          tour_links?: Json | null
          updated_at?: string | null
        }
        Update: {
          client?: Json
          completed_date?: string | null
          created_at?: string | null
          created_by?: string
          editor?: Json | null
          id?: string
          location?: Json
          media?: Json | null
          notes?: Json | null
          payment?: Json
          photographer?: Json
          scheduled_date?: string
          services?: Json
          status?: string
          time?: string
          tour_links?: Json | null
          updated_at?: string | null
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

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const

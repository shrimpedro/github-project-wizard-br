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
      analytics: {
        Row: {
          device: string | null
          id: string
          page_path: string
          property_id: string | null
          referrer: string | null
          visit_date: string | null
          visitor_id: string | null
        }
        Insert: {
          device?: string | null
          id?: string
          page_path: string
          property_id?: string | null
          referrer?: string | null
          visit_date?: string | null
          visitor_id?: string | null
        }
        Update: {
          device?: string | null
          id?: string
          page_path?: string
          property_id?: string | null
          referrer?: string | null
          visit_date?: string | null
          visitor_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "analytics_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          created_at: string | null
          email: string
          id: string
          message: string
          name: string
          phone: string | null
          property_id: string | null
          read: boolean | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: string
          message: string
          name: string
          phone?: string | null
          property_id?: string | null
          read?: boolean | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          message?: string
          name?: string
          phone?: string | null
          property_id?: string | null
          read?: boolean | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "messages_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string | null
          id: string
          message: string
          read: boolean | null
          title: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          message: string
          read?: boolean | null
          title: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          message?: string
          read?: boolean | null
          title?: string
          user_id?: string | null
        }
        Relationships: []
      }
      pages: {
        Row: {
          content: string
          id: string
          meta_description: string | null
          slug: string
          title: string
          updated_at: string | null
        }
        Insert: {
          content: string
          id?: string
          meta_description?: string | null
          slug: string
          title: string
          updated_at?: string | null
        }
        Update: {
          content?: string
          id?: string
          meta_description?: string | null
          slug?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          email: string | null
          id: string
          name: string | null
          phone: string | null
          role: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string | null
          id: string
          name?: string | null
          phone?: string | null
          role?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          name?: string | null
          phone?: string | null
          role?: string | null
        }
        Relationships: []
      }
      properties: {
        Row: {
          address: string
          area: number
          bathrooms: number
          bedrooms: number
          created_at: string | null
          description: string | null
          featured: boolean | null
          id: string
          imageurl: string | null
          price: number
          status: string
          title: string
          type: string
          updated_at: string | null
        }
        Insert: {
          address: string
          area: number
          bathrooms: number
          bedrooms: number
          created_at?: string | null
          description?: string | null
          featured?: boolean | null
          id?: string
          imageurl?: string | null
          price: number
          status?: string
          title: string
          type: string
          updated_at?: string | null
        }
        Update: {
          address?: string
          area?: number
          bathrooms?: number
          bedrooms?: number
          created_at?: string | null
          description?: string | null
          featured?: boolean | null
          id?: string
          imageurl?: string | null
          price?: number
          status?: string
          title?: string
          type?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          address: string | null
          contact_email: string | null
          contact_phone: string | null
          hero_background: string | null
          hero_subtitle: string | null
          hero_title: string | null
          id: number
          logo: string | null
          site_name: string
          social_facebook: string | null
          social_instagram: string | null
          social_linkedin: string | null
          updated_at: string | null
        }
        Insert: {
          address?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          hero_background?: string | null
          hero_subtitle?: string | null
          hero_title?: string | null
          id?: number
          logo?: string | null
          site_name: string
          social_facebook?: string | null
          social_instagram?: string | null
          social_linkedin?: string | null
          updated_at?: string | null
        }
        Update: {
          address?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          hero_background?: string | null
          hero_subtitle?: string | null
          hero_title?: string | null
          id?: number
          logo?: string | null
          site_name?: string
          social_facebook?: string | null
          social_instagram?: string | null
          social_linkedin?: string | null
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

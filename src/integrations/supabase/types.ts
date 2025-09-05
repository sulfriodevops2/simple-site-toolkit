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
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      produtos_diarias: {
        Row: {
          ativo: boolean | null
          atributos: Json | null
          codigo: string | null
          created_at: string | null
          grupo: string
          id: string
          nome: string
          ordem: number | null
          updated_at: string | null
        }
        Insert: {
          ativo?: boolean | null
          atributos?: Json | null
          codigo?: string | null
          created_at?: string | null
          grupo: string
          id?: string
          nome: string
          ordem?: number | null
          updated_at?: string | null
        }
        Update: {
          ativo?: boolean | null
          atributos?: Json | null
          codigo?: string | null
          created_at?: string | null
          grupo?: string
          id?: string
          nome?: string
          ordem?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      produtos_multi: {
        Row: {
          ativo: boolean | null
          atributos: Json | null
          codigo: string | null
          created_at: string | null
          grupo: string
          id: string
          nome: string
          ordem: number | null
          updated_at: string | null
        }
        Insert: {
          ativo?: boolean | null
          atributos?: Json | null
          codigo?: string | null
          created_at?: string | null
          grupo: string
          id?: string
          nome: string
          ordem?: number | null
          updated_at?: string | null
        }
        Update: {
          ativo?: boolean | null
          atributos?: Json | null
          codigo?: string | null
          created_at?: string | null
          grupo?: string
          id?: string
          nome?: string
          ordem?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      produtos_vrf: {
        Row: {
          ativo: boolean | null
          atributos: Json | null
          codigo: string | null
          created_at: string | null
          grupo: string
          id: string
          nome: string
          ordem: number | null
          updated_at: string | null
        }
        Insert: {
          ativo?: boolean | null
          atributos?: Json | null
          codigo?: string | null
          created_at?: string | null
          grupo: string
          id?: string
          nome: string
          ordem?: number | null
          updated_at?: string | null
        }
        Update: {
          ativo?: boolean | null
          atributos?: Json | null
          codigo?: string | null
          created_at?: string | null
          grupo?: string
          id?: string
          nome?: string
          ordem?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      user_sessions: {
        Row: {
          created_at: string
          expires_at: string
          id: string
          session_token: string
          user_id: string
        }
        Insert: {
          created_at?: string
          expires_at: string
          id?: string
          session_token: string
          user_id: string
        }
        Update: {
          created_at?: string
          expires_at?: string
          id?: string
          session_token?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_sessions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          ativo: boolean
          created_at: string
          departamento: string | null
          foto_url: string | null
          id: string
          nome_completo: string
          perfil_acesso: Database["public"]["Enums"]["user_profile"]
          senha: string
          updated_at: string
          usuario: string
        }
        Insert: {
          ativo?: boolean
          created_at?: string
          departamento?: string | null
          foto_url?: string | null
          id?: string
          nome_completo: string
          perfil_acesso?: Database["public"]["Enums"]["user_profile"]
          senha: string
          updated_at?: string
          usuario: string
        }
        Update: {
          ativo?: boolean
          created_at?: string
          departamento?: string | null
          foto_url?: string | null
          id?: string
          nome_completo?: string
          perfil_acesso?: Database["public"]["Enums"]["user_profile"]
          senha?: string
          updated_at?: string
          usuario?: string
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
      user_profile: "assistente" | "administrador"
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
      user_profile: ["assistente", "administrador"],
    },
  },
} as const

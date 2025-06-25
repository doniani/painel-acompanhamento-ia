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
      atendimentos: {
        Row: {
          conversa_id: string | null
          created_at: string | null
          data: string
          id: string
          mensagens_count: number | null
          nome: string
          status: string | null
          telefone: string
          ultima_interacao: string | null
          updated_at: string | null
        }
        Insert: {
          conversa_id?: string | null
          created_at?: string | null
          data: string
          id?: string
          mensagens_count?: number | null
          nome: string
          status?: string | null
          telefone: string
          ultima_interacao?: string | null
          updated_at?: string | null
        }
        Update: {
          conversa_id?: string | null
          created_at?: string | null
          data?: string
          id?: string
          mensagens_count?: number | null
          nome?: string
          status?: string | null
          telefone?: string
          ultima_interacao?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "atendimentos_conversa_id_fkey"
            columns: ["conversa_id"]
            isOneToOne: false
            referencedRelation: "conversas"
            referencedColumns: ["id"]
          },
        ]
      }
      atividades_recentes: {
        Row: {
          avatar: string | null
          created_at: string | null
          descricao: string | null
          id: string
          status: string | null
          tipo: string
          titulo: string
        }
        Insert: {
          avatar?: string | null
          created_at?: string | null
          descricao?: string | null
          id?: string
          status?: string | null
          tipo: string
          titulo: string
        }
        Update: {
          avatar?: string | null
          created_at?: string | null
          descricao?: string | null
          id?: string
          status?: string | null
          tipo?: string
          titulo?: string
        }
        Relationships: []
      }
      conversas: {
        Row: {
          cliente_nome: string
          cliente_telefone: string
          created_at: string | null
          id: string
          motivo_reprovacao: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          cliente_nome: string
          cliente_telefone: string
          created_at?: string | null
          id?: string
          motivo_reprovacao?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          cliente_nome?: string
          cliente_telefone?: string
          created_at?: string | null
          id?: string
          motivo_reprovacao?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      mensagens: {
        Row: {
          conversa_id: string | null
          created_at: string | null
          id: string
          is_ai: boolean | null
          texto: string
          timestamp: string | null
        }
        Insert: {
          conversa_id?: string | null
          created_at?: string | null
          id?: string
          is_ai?: boolean | null
          texto: string
          timestamp?: string | null
        }
        Update: {
          conversa_id?: string | null
          created_at?: string | null
          id?: string
          is_ai?: boolean | null
          texto?: string
          timestamp?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "mensagens_conversa_id_fkey"
            columns: ["conversa_id"]
            isOneToOne: false
            referencedRelation: "conversas"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          avatar: string | null
          cpf_cnpj: string | null
          created_at: string | null
          email: string
          id: string
          name: string
          updated_at: string | null
        }
        Insert: {
          avatar?: string | null
          cpf_cnpj?: string | null
          created_at?: string | null
          email: string
          id?: string
          name: string
          updated_at?: string | null
        }
        Update: {
          avatar?: string | null
          cpf_cnpj?: string | null
          created_at?: string | null
          email?: string
          id?: string
          name?: string
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

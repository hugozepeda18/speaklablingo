
export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export type Database = {
  
  "graphql_public": {
          Tables: {
            [_ in never]: never
          }
          Views: {
            [_ in never]: never
          }
          Functions: {
            "graphql":
{ Args: { "extensions"?: Json,"operationName"?: string,"query"?: string,"variables"?: Json }; Returns: Json
                           }
          }
          Enums: {
            [_ in never]: never
          }
          CompositeTypes: {
            [_ in never]: never
          }
        },"public": {
          Tables: {
            "LingoCompletionLog": {
                  Row: {
                    "completed_at": string,"id": string,"module_id": string,"student_id": string
                  }
                  ComputedFields: never
                  Insert: {
                    "completed_at"?: string,"id"?: string,"module_id": string,"student_id": string
                  }
                  Update: {
                    "completed_at"?: string,"id"?: string,"module_id"?: string,"student_id"?: string
                  }
                  Relationships: [
                    {
      foreignKeyName: "LingoCompletionLog_module_id_fkey"
      columns: ["module_id"]
isOneToOne: false
      referencedRelation: "LingoModule"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "LingoCompletionLog_student_id_fkey"
      columns: ["student_id"]
isOneToOne: false
      referencedRelation: "StudentProfile"
      referencedColumns: ["id"]
    }
                  ]
                },"LingoExercise": {
                  Row: {
                    "audio_url": string | null,"correct_answer": string,"id": string,"module_id": string,"options": NonNullable<Json>,"question": string,"type": Database["public"]['Enums']["lingo_exercise_type"]
                  }
                  ComputedFields: never
                  Insert: {
                    "audio_url"?: string | null,"correct_answer": string,"id"?: string,"module_id": string,"options"?: NonNullable<Json>,"question": string,"type": Database["public"]['Enums']["lingo_exercise_type"]
                  }
                  Update: {
                    "audio_url"?: string | null,"correct_answer"?: string,"id"?: string,"module_id"?: string,"options"?: NonNullable<Json>,"question"?: string,"type"?: Database["public"]['Enums']["lingo_exercise_type"]
                  }
                  Relationships: [
                    {
      foreignKeyName: "LingoExercise_module_id_fkey"
      columns: ["module_id"]
isOneToOne: false
      referencedRelation: "LingoModule"
      referencedColumns: ["id"]
    }
                  ]
                },"LingoModule": {
                  Row: {
                    "cefr_level": Database["public"]['Enums']["lingo_cefr_level"],"class_topic": string,"id": string,"language": Database["public"]['Enums']["lingo_language"],"title": string
                  }
                  ComputedFields: never
                  Insert: {
                    "cefr_level": Database["public"]['Enums']["lingo_cefr_level"],"class_topic": string,"id"?: string,"language": Database["public"]['Enums']["lingo_language"],"title": string
                  }
                  Update: {
                    "cefr_level"?: Database["public"]['Enums']["lingo_cefr_level"],"class_topic"?: string,"id"?: string,"language"?: Database["public"]['Enums']["lingo_language"],"title"?: string
                  }
                  Relationships: [
                    
                  ]
                },"StudentLingoProgress": {
                  Row: {
                    "current_streak": number,"last_practice_date": string | null,"student_id": string,"total_xp": number
                  }
                  ComputedFields: never
                  Insert: {
                    "current_streak"?: number,"last_practice_date"?: string | null,"student_id": string,"total_xp"?: number
                  }
                  Update: {
                    "current_streak"?: number,"last_practice_date"?: string | null,"student_id"?: string,"total_xp"?: number
                  }
                  Relationships: [
                    {
      foreignKeyName: "StudentLingoProgress_student_id_fkey"
      columns: ["student_id"]
isOneToOne: true
      referencedRelation: "StudentProfile"
      referencedColumns: ["id"]
    }
                  ]
                },"StudentProfile": {
                  Row: {
                    "id": string
                  }
                  ComputedFields: never
                  Insert: {
                    "id": string
                  }
                  Update: {
                    "id"?: string
                  }
                  Relationships: [
                    
                  ]
                }
          }
          Views: {
            [_ in never]: never
          }
          Functions: {
            "complete_lingo_module":
{ Args: { "p_completion_id": string,"p_module_id": string,"p_student_id": string,"p_today": string }; Returns: {
              "current_streak": number,"streak_anterior": number,"total_xp": number,"xp_ganada": number
            }[]
                           },
"create_lingo_module":
{ Args: { "p": Json }; Returns: string
                           },
"is_lingo_admin":
{ Args: Record<PropertyKey, never>; Returns: boolean
                           }
          }
          Enums: {
            "lingo_cefr_level": "A1"|"A2"|"B1"|"B2","lingo_exercise_type": "MULTIPLE_CHOICE"|"FILL_BLANK"|"LISTENING","lingo_language": "EN"|"FR"|"IT"|"PT"|"DE"
          }
          CompositeTypes: {
            [_ in never]: never
          }
        }
}

type DatabaseWithoutInternals = Omit<Database, '__InternalSupabase'>

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
    : never = never
> = DefaultSchemaTableNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
  ? (DefaultSchema["Tables"] & DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
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
    : never = never
> = DefaultSchemaTableNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
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
    : never = never
> = DefaultSchemaTableNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
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
    : never = never
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
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
    : never = never
> = PublicCompositeTypeNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
  ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
  : never

export const Constants = {
  "graphql_public": {
          Enums: {
            
          }
        },"public": {
          Enums: {
            "lingo_cefr_level": ["A1", "A2", "B1", "B2"],"lingo_exercise_type": ["MULTIPLE_CHOICE", "FILL_BLANK", "LISTENING"],"lingo_language": ["EN", "FR", "IT", "PT", "DE"]
          }
        }
} as const

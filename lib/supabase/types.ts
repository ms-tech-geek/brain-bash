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
      profiles: {
        Row: {
          id: string
          display_name: string
          role: 'admin' | 'player'
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          display_name: string
          role?: 'admin' | 'player'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          display_name?: string
          role?: 'admin' | 'player'
          created_at?: string
          updated_at?: string
        }
      }
      quizzes: {
        Row: {
          id: string
          title: string
          description: string | null
          duration_minutes: number
          created_by: string
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          duration_minutes?: number
          created_by: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          duration_minutes?: number
          created_by?: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      questions: {
        Row: {
          id: string
          quiz_id: string
          question_text: string
          options: Json
          correct_answer: string
          points: number
          created_at: string
        }
        Insert: {
          id?: string
          quiz_id: string
          question_text: string
          options: Json
          correct_answer: string
          points?: number
          created_at?: string
        }
        Update: {
          id?: string
          quiz_id?: string
          question_text?: string
          options?: Json
          correct_answer?: string
          points?: number
          created_at?: string
        }
      }
      responses: {
        Row: {
          id: string
          user_id: string
          quiz_id: string
          question_id: string
          selected_answer: string
          is_correct: boolean
          points_earned: number
          response_time_seconds: number
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          quiz_id: string
          question_id: string
          selected_answer: string
          is_correct: boolean
          points_earned: number
          response_time_seconds: number
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          quiz_id?: string
          question_id?: string
          selected_answer?: string
          is_correct?: boolean
          points_earned?: number
          response_time_seconds?: number
          created_at?: string
        }
      }
      leaderboard: {
        Row: {
          id: string
          quiz_id: string
          user_id: string
          total_points: number
          total_time_seconds: number
          rank: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          quiz_id: string
          user_id: string
          total_points?: number
          total_time_seconds?: number
          rank?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          quiz_id?: string
          user_id?: string
          total_points?: number
          total_time_seconds?: number
          rank?: number | null
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      user_role: 'admin' | 'player'
    }
  }
}
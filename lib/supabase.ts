import { createClient } from '@supabase/supabase-js'

// Check if Supabase environment variables are configured
export const isSupabaseConfigured = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  return !!(url && key && url.startsWith('https://') && key.length > 0)
}

// Create Supabase client
export const supabase = isSupabaseConfigured()
  ? createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        auth: {
          autoRefreshToken: true,
          persistSession: true,
          detectSessionInUrl: true
        }
      }
    )
  : null

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
      nutrition_goals: {
        Row: {
          id: string
          user_id: string
          protein_target: number
          carbs_target: number
          fats_target: number
          calories_target: number | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          protein_target?: number
          carbs_target?: number
          fats_target?: number
          calories_target?: number | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          protein_target?: number
          carbs_target?: number
          fats_target?: number
          calories_target?: number | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
      recipes: {
        Row: {
          id: string
          user_id: string | null
          title: string
          description: string | null
          instructions: string[]
          ingredients: any
          notes: any
          prep_time: number | null
          cook_time: number | null
          servings: number | null
          image_url: string | null
          is_ai_generated: boolean | null
          generation_chat_log: any | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          user_id?: string | null
          title: string
          description?: string | null
          instructions?: string[]
          ingredients?: any
          notes?: any
          prep_time?: number | null
          cook_time?: number | null
          servings?: number | null
          image_url?: string | null
          is_ai_generated?: boolean | null
          generation_chat_log?: any | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string | null
          title?: string
          description?: string | null
          instructions?: string[]
          ingredients?: any
          notes?: any
          prep_time?: number | null
          cook_time?: number | null
          servings?: number | null
          image_url?: string | null
          is_ai_generated?: boolean | null
          generation_chat_log?: any | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
      daily_intake: {
        Row: {
          id: string
          user_id: string
          date: string
          protein_consumed: number
          carbs_consumed: number
          fats_consumed: number
          calories_consumed: number | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          date?: string
          protein_consumed?: number
          carbs_consumed?: number
          fats_consumed?: number
          calories_consumed?: number | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          date?: string
          protein_consumed?: number
          carbs_consumed?: number
          fats_consumed?: number
          calories_consumed?: number | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
      meal_logs: {
        Row: {
          id: string
          user_id: string
          recipe_id: string | null
          meal_name: string
          servings: number | null
          protein_consumed: number
          carbs_consumed: number
          fats_consumed: number
          calories_consumed: number | null
          consumed_at: string | null
          created_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          recipe_id?: string | null
          meal_name: string
          servings?: number | null
          protein_consumed: number
          carbs_consumed: number
          fats_consumed: number
          calories_consumed?: number | null
          consumed_at?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          recipe_id?: string | null
          meal_name?: string
          servings?: number | null
          protein_consumed?: number
          carbs_consumed?: number
          fats_consumed?: number
          calories_consumed?: number | null
          consumed_at?: string | null
          created_at?: string | null
        }
      }
      chat_messages: {
        Row: {
          id: string
          user_id: string
          session_id: string
          role: string
          content: string
          recipe_data: any | null
          created_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          session_id?: string
          role: string
          content: string
          recipe_data?: any | null
          created_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          session_id?: string
          role?: string
          content?: string
          recipe_data?: any | null
          created_at?: string | null
        }
      }
      user_preferences: {
        Row: {
          id: string
          user_id: string
          default_food_mode: string | null
          default_time_preset: string | null
          theme: string | null
          notifications_enabled: boolean | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          default_food_mode?: string | null
          default_time_preset?: string | null
          theme?: string | null
          notifications_enabled?: boolean | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          default_food_mode?: string | null
          default_time_preset?: string | null
          theme?: string | null
          notifications_enabled?: boolean | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
    }
    Enums: {
      food_mode: 'cook' | 'meal-prep' | 'order'
      time_preset: '5' | '15' | '30'
    }
  }
}

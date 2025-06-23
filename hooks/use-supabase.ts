import { useEffect, useState } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import type { Database } from '@/lib/supabase'

type Profile = Database['public']['Tables']['profiles']['Row']
type Recipe = Database['public']['Tables']['recipes']['Row']
type NutritionGoals = Database['public']['Tables']['nutrition_goals']['Row']
type DailyIntake = Database['public']['Tables']['daily_intake']['Row']
type MealLog = Database['public']['Tables']['meal_logs']['Row']
type MealLogInsert = Database['public']['Tables']['meal_logs']['Insert']
type ChatMessage = Database['public']['Tables']['chat_messages']['Row']
type UserPreferences = Database['public']['Tables']['user_preferences']['Row']

// Helper function to safely access supabase
const getSupabase = () => {
  if (!isSupabaseConfigured() || !supabase) {
    throw new Error('Supabase not configured')
  }
  return supabase
}

// Authentication hook
export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isSupabaseConfigured()) {
      setLoading(false)
      return
    }

    // Get initial session
    supabase?.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase?.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    }) || { data: { subscription: null } }

    return () => subscription?.unsubscribe()
  }, [])

  const signIn = async (email: string, password: string) => {
    try {
      const client = getSupabase()
      const { error } = await client.auth.signInWithPassword({ email, password })
      return { error }
    } catch (error) {
      return { error: error as Error }
    }
  }

  const signUp = async (email: string, password: string, fullName?: string) => {
    try {
      const client = getSupabase()
      const { data, error } = await client.auth.signUp({ email, password })
      
      if (data.user && !error) {
        // Create profile
        await client.from('profiles').insert({
          id: data.user.id,
          email: data.user.email!,
          full_name: fullName,
        })
      }
      
      return { data, error }
    } catch (error) {
      return { data: null, error: error as Error }
    }
  }

  const signOut = async () => {
    try {
      const client = getSupabase()
      const { error } = await client.auth.signOut()
      return { error }
    } catch (error) {
      return { error: error as Error }
    }
  }

  return {
    user,
    session,
    loading,
    signIn,
    signUp,
    signOut,
  }
}

// Profile hook
export function useProfile(userId?: string) {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!userId || !isSupabaseConfigured()) {
      setProfile(null)
      setLoading(false)
      return
    }

    const fetchProfile = async () => {
      if (!supabase) return
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (!error && data) {
        setProfile(data)
      }
      setLoading(false)
    }

    fetchProfile()
  }, [userId])

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!userId || !isSupabaseConfigured() || !supabase) return { error: new Error('No user ID or Supabase not configured') }

    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single()

    if (!error && data) {
      setProfile(data)
    }

    return { data, error }
  }

  return { profile, loading, updateProfile }
}

// Recipes hook
export function useRecipes(userId?: string) {
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isSupabaseConfigured()) {
      setRecipes([])
      setLoading(false)
      return
    }

    const fetchRecipes = async () => {
      let query = supabase!.from('recipes').select('*').order('created_at', { ascending: false })
      
      if (userId) {
        query = query.eq('user_id', userId)
      } else {
        query = query.is('user_id', null) // Public recipes
      }

      const { data, error } = await query

      if (!error && data) {
        setRecipes(data)
      }
      setLoading(false)
    }

    fetchRecipes()
  }, [userId])

  const addRecipe = async (recipe: Omit<Recipe, 'id' | 'created_at' | 'updated_at'>) => {
    if (!isSupabaseConfigured()) {
      return { data: null, error: new Error('Supabase not configured') }
    }

    const { data, error } = await supabase!
      .from('recipes')
      .insert(recipe)
      .select()
      .single()

    if (!error && data) {
      setRecipes(prev => [data, ...prev])
    }

    return { data, error }
  }

  const updateRecipe = async (id: string, updates: Partial<Recipe>) => {
    if (!isSupabaseConfigured()) {
      return { data: null, error: new Error('Supabase not configured') }
    }

    const { data, error } = await supabase!
      .from('recipes')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (!error && data) {
      setRecipes(prev => prev.map(recipe => recipe.id === id ? data : recipe))
    }

    return { data, error }
  }

  const deleteRecipe = async (id: string) => {
    if (!isSupabaseConfigured()) {
      return { error: new Error('Supabase not configured') }
    }

    const { error } = await supabase!
      .from('recipes')
      .delete()
      .eq('id', id)

    if (!error) {
      setRecipes(prev => prev.filter(recipe => recipe.id !== id))
    }

    return { error }
  }

  return { recipes, loading, addRecipe, updateRecipe, deleteRecipe }
}

// Nutrition goals hook
export function useNutritionGoals(userId?: string) {
  const [goals, setGoals] = useState<NutritionGoals | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!userId || !isSupabaseConfigured()) {
      setGoals(null)
      setLoading(false)
      return
    }

    const fetchGoals = async () => {
      if (!supabase) return
      const { data, error } = await supabase
        .from('nutrition_goals')
        .select('*')
        .eq('user_id', userId)
        .single()

      if (!error && data) {
        setGoals(data)
      } else if (error && error.code === 'PGRST116') {
        // No goals found, create default ones
        if (!supabase) return
        const { data: newGoals } = await supabase
          .from('nutrition_goals')
          .insert({
            user_id: userId,
            protein_target: 150,
            carbs_target: 200,
            fats_target: 60,
          })
          .select()
          .single()

        if (newGoals) {
          setGoals(newGoals)
        }
      }
      setLoading(false)
    }

    fetchGoals()
  }, [userId])

  const updateGoals = async (updates: Partial<NutritionGoals>) => {
    if (!userId || !isSupabaseConfigured() || !supabase) return { error: new Error('No user ID or Supabase not configured') }

    const { data, error } = await supabase
      .from('nutrition_goals')
      .update(updates)
      .eq('user_id', userId)
      .select()
      .single()

    if (!error && data) {
      setGoals(data)
    }

    return { data, error }
  }

  return { goals, loading, updateGoals }
}

// Daily intake hook
export function useDailyIntake(userId?: string, date?: string) {
  const [intake, setIntake] = useState<DailyIntake | null>(null)
  const [loading, setLoading] = useState(true)

  const targetDate = date || new Date().toISOString().split('T')[0]

  useEffect(() => {
    if (!userId || !isSupabaseConfigured()) {
      setIntake(null)
      setLoading(false)
      return
    }

    const fetchIntake = async () => {
      if (!supabase) return
      const { data, error } = await supabase
        .from('daily_intake')
        .select('*')
        .eq('user_id', userId)
        .eq('date', targetDate)
        .single()

      if (!error && data) {
        setIntake(data)
      } else if (error && error.code === 'PGRST116') {
        // No intake found for today, create empty record
        if (!supabase) return
        const { data: newIntake } = await supabase
          .from('daily_intake')
          .insert({
            user_id: userId,
            date: targetDate,
            protein_consumed: 0,
            carbs_consumed: 0,
            fats_consumed: 0,
          })
          .select()
          .single()

        if (newIntake) {
          setIntake(newIntake)
        }
      }
      setLoading(false)
    }

    fetchIntake()
  }, [userId, targetDate])

  const addMeal = async (protein: number, carbs: number, fats: number) => {
    if (!userId || !isSupabaseConfigured() || !supabase) return { error: new Error('No user ID or Supabase not configured') }

    try {
      // Use the database function to add meal
      const { data, error } = await supabase.rpc('add_meal_to_daily_intake', {
        user_uuid: userId,
        meal_protein: protein,
        meal_carbs: carbs,
        meal_fats: fats,
        meal_date: targetDate,
      })

      if (error) {
        console.error('Error adding meal:', error)
        return { error }
      }

      // Refresh the intake data
      if (!supabase) return { error: new Error('Supabase not available') }
      const { data: updatedIntake } = await supabase
        .from('daily_intake')
        .select('*')
        .eq('user_id', userId)
        .eq('date', targetDate)
        .single()

      if (updatedIntake) {
        setIntake(updatedIntake)
      }

      return { data, error: null }
    } catch (error) {
      console.error('Error adding meal:', error)
      return { error: error as Error }
    }
  }

  return { intake, loading, addMeal }
}

// Meal logs hook
export function useMealLogs(userId?: string) {
  const [logs, setLogs] = useState<MealLog[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!userId || !isSupabaseConfigured()) {
      setLogs([])
      setLoading(false)
      return
    }

    const fetchLogs = async () => {
      if (!supabase) return
      const { data, error } = await supabase
        .from('meal_logs')
        .select('*')
        .eq('user_id', userId)
        .order('consumed_at', { ascending: false })

      if (!error && data) {
        setLogs(data)
      }
      setLoading(false)
    }

    fetchLogs()
  }, [userId])

  const addMealLog = async (log: MealLogInsert) => {
    if (!isSupabaseConfigured() || !supabase) return { data: null, error: new Error('Supabase not configured') }

    const { data, error } = await supabase
      .from('meal_logs')
      .insert(log)
      .select()
      .single()

    if (!error && data) {
      setLogs(prev => [data, ...prev])
    }

    return { data, error }
  }

  return { logs, loading, addMealLog }
}

// Chat messages hook
export function useChatMessages(userId?: string, sessionId?: string) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!userId || !sessionId || !isSupabaseConfigured()) {
      setMessages([])
      setLoading(false)
      return
    }

    const fetchMessages = async () => {
      if (!supabase) return
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('user_id', userId)
        .eq('session_id', sessionId)
        .order('created_at', { ascending: true })

      if (!error && data) {
        setMessages(data)
      }
      setLoading(false)
    }

    fetchMessages()
  }, [userId, sessionId])

  const addMessage = async (message: Omit<ChatMessage, 'id' | 'created_at'>) => {
    if (!isSupabaseConfigured() || !supabase) return { data: null, error: new Error('Supabase not configured') }

    const { data, error } = await supabase
      .from('chat_messages')
      .insert(message)
      .select()
      .single()

    if (!error && data) {
      setMessages(prev => [...prev, data])
    }

    return { data, error }
  }

  return { messages, loading, addMessage }
}

// User preferences hook
export function useUserPreferences(userId?: string) {
  const [preferences, setPreferences] = useState<UserPreferences | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!userId || !isSupabaseConfigured()) {
      setPreferences(null)
      setLoading(false)
      return
    }

    const fetchPreferences = async () => {
      if (!supabase) return
      const { data, error } = await supabase
        .from('user_preferences')
        .select('*')
        .eq('user_id', userId)
        .single()

      if (!error && data) {
        setPreferences(data)
      } else if (error && error.code === 'PGRST116') {
        // No preferences found, create default ones
        if (!supabase) return
        const { data: newPreferences } = await supabase
          .from('user_preferences')
          .insert({
            user_id: userId,
            default_food_mode: 'cook',
            default_time_preset: '15',
            theme: 'system',
            notifications_enabled: true,
          })
          .select()
          .single()

        if (newPreferences) {
          setPreferences(newPreferences)
        }
      }
      setLoading(false)
    }

    fetchPreferences()
  }, [userId])

  const updatePreferences = async (updates: Partial<UserPreferences>) => {
    if (!userId || !isSupabaseConfigured() || !supabase) return { error: new Error('No user ID or Supabase not configured') }

    const { data, error } = await supabase
      .from('user_preferences')
      .update(updates)
      .eq('user_id', userId)
      .select()
      .single()

    if (!error && data) {
      setPreferences(data)
    }

    return { data, error }
  }

  return { preferences, loading, updatePreferences }
} 
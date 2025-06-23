import { create } from "zustand"
import { persist } from "zustand/middleware"
import { supabase, isSupabaseConfigured } from "@/lib/supabase"
import type { Database } from "@/lib/supabase"
import { toast } from "sonner"

export type Recipe = Database['public']['Tables']['recipes']['Row']
export type RecipeInsert = Database['public']['Tables']['recipes']['Insert']

// This is the type that comes from the AI, which is different from the stored recipe
export type AIRecipe = {
  title: string;
  description: string;
  ingredients: { name: string; amount: string }[];
  instructions: string[];
  prep_time?: number | null;
  cook_time?: number | null;
  servings?: number | null;
  notes?: { emoji?: string; text?: string };
}

// Helper to extract numbers from strings like "10 minutes"
const parseTime = (timeString?: string): string | null => {
  if (!timeString) return null;
  return timeString;
};

const parseServings = (servingString?: string): string | null => {
    if (!servingString) return null;
    return servingString;
};

interface RecipeStore {
  recipes: Recipe[]
  loading: boolean
  addRecipeToSupabase: (recipe: Partial<AIRecipe>, userId?: string, chatLog?: any[]) => Promise<void>
  syncWithSupabase: (userId?: string) => Promise<void>
  getRecipeById: (id: string) => Recipe | undefined
}

const generateEmoji = (name: string): string => {
  const emojiMap: Record<string, string> = {
    bowl: "🥗", salad: "🥗", chicken: "🍗", beef: "🥩", fish: "🐟", salmon: "🍣",
    pasta: "🍝", rice: "🍚", quinoa: "🌾", soup: "🍲", stir: "🥘", burrito: "🌯",
    wrap: "🌯", sandwich: "🥪", pizza: "🍕", burger: "🍔", taco: "🌮",
    curry: "🍛", noodle: "🍜", egg: "🥚", avocado: "🥑", smoothie: "🥤", yogurt: "🥣",
  }
  const lowerName = name.toLowerCase()
  for (const [key, emoji] of Object.entries(emojiMap)) {
    if (lowerName.includes(key)) return emoji
  }
  return "🍽️"
}

export const useRecipeStore = create<RecipeStore>()(
  persist(
    (set, get) => ({
      recipes: [],
      loading: false,

      addRecipeToSupabase: async (recipe, userId, chatLog) => {
        set({ loading: true })
        try {
          if (!isSupabaseConfigured() || !supabase) {
            console.warn("Supabase not configured. Could not save recipe to database.")
            return
          }

          // Step 1: Get macro estimates from our secure API endpoint
          const nutritionResponse = await fetch('/api/nutrition', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ingredients: recipe.ingredients || [] }),
          });

          if (!nutritionResponse.ok) {
            throw new Error('Failed to fetch nutritional information.');
          }
          const nutritionalInfo = await nutritionResponse.json();

          const supabaseRecipe: RecipeInsert = {
            user_id: userId || null,
            title: recipe.title || 'Untitled Recipe',
            description: recipe.description || null,
            instructions: recipe.instructions || [],
            ingredients: recipe.ingredients || [],
            prep_time: recipe.prep_time || null,
            cook_time: recipe.cook_time || null,
            servings: recipe.servings || null,
            is_ai_generated: true,
            generation_chat_log: chatLog || null,
            notes: { emoji: recipe.notes?.emoji || generateEmoji(recipe.title || ''), text: recipe.notes?.text },
          }
          
          const { data, error } = await supabase
            .from('recipes')
            .insert(supabaseRecipe)
            .select()
            .single()

          if (error) {
            console.error('Error adding recipe to Supabase:', error)
            toast.error("Error saving recipe.", { description: error.message })
            return
          }

          if (data) {
            set((state) => ({
              recipes: [...state.recipes, data],
            }))
            toast.success("Recipe saved successfully!")
          }
        } catch (error) {
          console.error('An unexpected error occurred:', error)
          toast.error('An unexpected error occurred while saving the recipe.')
        } finally {
          set({ loading: false })
        }
      },

      syncWithSupabase: async (userId) => {
        set({ loading: true })
        try {
          if (!isSupabaseConfigured() || !supabase) return
          let query = supabase.from('recipes').select('*').order('created_at', { ascending: false })
          if (userId) {
            query = query.eq('user_id', userId)
          } else {
            query = query.is('user_id', null)
          }
          const { data, error } = await query
          if (error) {
            console.error('Error syncing with Supabase:', error)
            return
          }
          if (data) {
            set({ recipes: data })
          }
        } catch (error) {
          console.error('Error syncing recipes:', error)
        } finally {
          set({ loading: false })
        }
      },

      getRecipeById: (id) => get().recipes.find((recipe) => recipe.id === id),
    }),
    {
      name: "recipe-store",
      version: 4, 
    },
  ),
)

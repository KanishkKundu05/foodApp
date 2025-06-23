"use client"

import { useMemo } from "react"
import { SuggestionCard } from "@/components/suggestion-card"
import { EmptyState } from "@/components/empty-state"
import { useRecipeStore, Recipe } from "@/stores/recipe-store"
import { useAuth, useDailyIntake, useMealLogs } from "@/hooks/use-supabase"
import { toast } from "sonner"

export type FoodMode = "cook" | "meal-prep" | "order"

interface SuggestionListProps {
  mode: FoodMode
  timePreset?: string
  onAddMeal: (recipe: Recipe) => void
  onGetHelp: (recipe: Recipe) => void
}

export function SuggestionList({ mode, timePreset, onAddMeal, onGetHelp }: SuggestionListProps) {
  const { user } = useAuth()
  const { addMeal } = useDailyIntake(user?.id)
  const { addMealLog } = useMealLogs(user?.id)
  
  const recipes = useRecipeStore((state) => state.recipes)

  const handleAddMealFromCard = async (recipe: Recipe) => {
    try {
      if (user?.id) {
        await addMeal(recipe.protein, recipe.carbs, recipe.fats)
        await addMealLog({
          user_id: user.id,
          recipe_id: recipe.id,
          meal_name: recipe.name,
          servings: 1.0,
          protein_consumed: recipe.protein,
          carbs_consumed: recipe.carbs,
          fats_consumed: recipe.fats,
          consumed_at: new Date().toISOString(),
        })
        toast.success(`${recipe.name} has been added to your daily intake.`)
      } else {
        toast.error("You must be logged in to log meals.")
      }
      onAddMeal(recipe)
    } catch (error) {
      console.error('Error adding meal:', error)
      toast.error('Failed to add meal to daily intake')
    }
  }

  // TODO: Implement logic for meal-prep and order modes
  if (mode === "meal-prep" || mode === "order") {
    return <EmptyState mode={mode} />
  }

  const suggestions = useMemo(() => {
    if (mode === 'cook') {
      return [...recipes]
        .sort((a, b) => b.protein - a.protein)
        .slice(0, 3);
    }
    return recipes;
  }, [recipes, mode]);

  if (suggestions.length === 0) {
    return <EmptyState mode={mode} />
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {suggestions.map((suggestion) => (
        <SuggestionCard 
          key={suggestion.id} 
          suggestion={suggestion} 
          onAdd={handleAddMealFromCard} 
          onGetHelp={onGetHelp}
        />
      ))}
    </div>
  )
}

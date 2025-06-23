"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock } from "lucide-react"
import { useRecipeStore, Recipe } from "@/stores/recipe-store"
import { SuggestionCard } from "@/components/suggestion-card"
import { useMemo } from "react"
import { useHydrated } from "@/hooks/use-hydrated"

interface QuickPicksRowProps {
  onAddMeal: (recipe: Recipe) => void
  onGetHelp: (recipe: Recipe) => void
}

export function QuickPicksRow({ onAddMeal, onGetHelp }: QuickPicksRowProps) {
  const isHydrated = useHydrated()
  const recipes = useRecipeStore((state) => state.recipes)

  const topPicks = useMemo(() => {
    return [...recipes]
      .sort((a, b) => b.protein - a.protein)
      .slice(0, 3)
  }, [recipes])

  if (!isHydrated) {
    return null
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Quick Picks</h2>
      {topPicks.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {topPicks.map((pick) => (
            <SuggestionCard 
                key={pick.id} 
                suggestion={pick} 
                onAdd={onAddMeal} 
                onGetHelp={onGetHelp}
            />
            ))}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">
            You don&apos;t have any saved recipes yet. Create one in the playground!
        </p>
      )}
    </div>
  )
}

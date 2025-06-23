"use client"

import { useState, useEffect } from "react"
import { HeaderBanner } from "@/components/header-banner"
import { QuickPicksRow } from "@/components/quick-picks-row"
import { ContextBar, MacroTargets } from "@/components/context-bar"
import { ModeSelector } from "@/components/mode-selector"
import { SuggestionList } from "@/components/suggestion-list"
import { AddMealModal } from "@/components/add-meal-modal"
import { RecipeChatSheet } from "@/components/recipe-chat-sheet"
import { Recipe, useRecipeStore } from "@/stores/recipe-store"
import { useAuth } from "@/hooks/use-supabase"
import { SousAiChat } from "@/components/sous-ai-chat"

export type FoodMode = "cook" | "meal-prep" | "order"
export type TimePreset = "5" | "15" | "30"

export default function WSEPage() {
  const { user } = useAuth()
  const syncWithSupabase = useRecipeStore((state) => state.syncWithSupabase)
  const [selectedMode, setSelectedMode] = useState<FoodMode>("cook")
  const [selectedTime, setSelectedTime] = useState<TimePreset>("15")
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [selectedMeal, setSelectedMeal] = useState<any>(null)
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false)
  const [recipeForHelp, setRecipeForHelp] = useState<Recipe | null>(null)
  const [macroTargets, setMacroTargets] = useState<MacroTargets>({
    calories: 0,
    protein: 35,
    carbs: 60,
    fats: 20
  })

  useEffect(() => {
    syncWithSupabase(user?.id)
  }, [syncWithSupabase, user?.id])

  const handleAddMeal = (recipe: Recipe) => {
    setSelectedMeal(recipe)
    setIsAddModalOpen(true)
  }

  const handleGetHelp = (recipe: Recipe) => {
    setRecipeForHelp(recipe)
    setIsHelpModalOpen(true)
  }
  
  const handleMacrosChange = (macros: MacroTargets) => {
    setMacroTargets(macros)
  }

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      <HeaderBanner />

      <QuickPicksRow onAddMeal={handleAddMeal} onGetHelp={handleGetHelp} />

      <SousAiChat />

      <ContextBar 
        selectedTime={selectedTime} 
        onTimeChange={setSelectedTime} 
        onMacrosChange={handleMacrosChange}
        initialMacros={macroTargets}
      />

      <ModeSelector selectedMode={selectedMode} onModeChange={setSelectedMode} />

      <SuggestionList 
        mode={selectedMode} 
        timePreset={selectedTime} 
        onAddMeal={handleAddMeal}
        onGetHelp={handleGetHelp}
      />

      <AddMealModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={() => {console.log("Saving")}}
        meal={selectedMeal}
      />

      <RecipeChatSheet
        recipe={recipeForHelp}
        isOpen={isHelpModalOpen}
        onClose={() => setIsHelpModalOpen(false)}
      />
    </div>
  )
} 
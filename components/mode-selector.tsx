"use client"

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

export type FoodMode = "cook" | "meal-prep" | "order"

interface ModeSelectorProps {
  selectedMode: FoodMode
  onModeChange: (mode: FoodMode) => void
}

export function ModeSelector({ selectedMode, onModeChange }: ModeSelectorProps) {
  return (
    <Tabs value={selectedMode} onValueChange={(value) => onModeChange(value as FoodMode)}>
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="cook">Cook</TabsTrigger>
        <TabsTrigger value="meal-prep">Meal-Prep</TabsTrigger>
        <TabsTrigger value="order">Order</TabsTrigger>
      </TabsList>
    </Tabs>
  )
}

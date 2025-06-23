"use client"

import { useState, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"

interface MacroTargets {
  protein: number
  carbs: number
  fats: number
}

interface MacroSliderCardProps {
  onMacroChange: (macros: MacroTargets) => void
}

export function MacroSliderCard({ onMacroChange }: MacroSliderCardProps) {
  const [macros, setMacros] = useState<MacroTargets>({
    protein: 35,
    carbs: 60,
    fats: 15,
  })

  const calculateCalories = useCallback((p: number, c: number, f: number) => {
    return p * 4 + c * 4 + f * 9
  }, [])

  const handleMacroChange = useCallback(
    (type: keyof MacroTargets, value: number) => {
      const newMacros = { ...macros, [type]: value }

      // Constrain to keep total around 500 kcal
      const totalCals = calculateCalories(newMacros.protein, newMacros.carbs, newMacros.fats)
      if (totalCals > 600) {
        // Proportionally reduce other macros
        const factor = 500 / totalCals
        if (type !== "protein") newMacros.protein = Math.round(newMacros.protein * factor)
        if (type !== "carbs") newMacros.carbs = Math.round(newMacros.carbs * factor)
        if (type !== "fats") newMacros.fats = Math.round(newMacros.fats * factor)
      }

      setMacros(newMacros)
      onMacroChange(newMacros)
    },
    [macros, calculateCalories, onMacroChange],
  )

  const totalCalories = calculateCalories(macros.protein, macros.carbs, macros.fats)

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Macro Targets</CardTitle>
          <Badge variant="secondary" className="font-mono">
            ~{totalCalories} kcal
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium" htmlFor="protein-slider">
                Protein: {macros.protein}g
              </label>
              <span className="text-xs text-muted-foreground">{macros.protein * 4} kcal</span>
            </div>
            <Slider
              id="protein-slider"
              value={[macros.protein]}
              onValueChange={(value) => handleMacroChange("protein", value[0])}
              max={100}
              min={10}
              step={5}
              className="w-full"
              aria-label="Protein target in grams"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium" htmlFor="carbs-slider">
                Carbs: {macros.carbs}g
              </label>
              <span className="text-xs text-muted-foreground">{macros.carbs * 4} kcal</span>
            </div>
            <Slider
              id="carbs-slider"
              value={[macros.carbs]}
              onValueChange={(value) => handleMacroChange("carbs", value[0])}
              max={150}
              min={20}
              step={5}
              className="w-full"
              aria-label="Carbohydrate target in grams"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium" htmlFor="fats-slider">
                Fats: {macros.fats}g
              </label>
              <span className="text-xs text-muted-foreground">{macros.fats * 9} kcal</span>
            </div>
            <Slider
              id="fats-slider"
              value={[macros.fats]}
              onValueChange={(value) => handleMacroChange("fats", value[0])}
              max={50}
              min={5}
              step={2}
              className="w-full"
              aria-label="Fat target in grams"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Clock } from "lucide-react"
import { useAuth } from "@/hooks/use-supabase"
import { useNutritionGoals, useDailyIntake } from "@/hooks/use-supabase"

interface MacroData {
  protein: { consumed: number; target: number }
  carbs: { consumed: number; target: number }
  fats: { consumed: number; target: number }
}

export function HeaderBanner() {
  const [viewMode, setViewMode] = useState<"consumed" | "remaining">("consumed")
  const { user } = useAuth()
  const { goals } = useNutritionGoals(user?.id)
  const { intake } = useDailyIntake(user?.id)

  // Default values if no user or data
  const macroData: MacroData = {
    protein: { 
      consumed: intake?.protein_consumed || 0, 
      target: goals?.protein_target || 150 
    },
    carbs: { 
      consumed: intake?.carbs_consumed || 0, 
      target: goals?.carbs_target || 200 
    },
    fats: { 
      consumed: intake?.fats_consumed || 0, 
      target: goals?.fats_target || 60 
    },
  }

  const totalConsumed = macroData.protein.consumed * 4 + macroData.carbs.consumed * 4 + macroData.fats.consumed * 9

  const totalTarget = macroData.protein.target * 4 + macroData.carbs.target * 4 + macroData.fats.target * 9

  const totalRemaining = totalTarget - totalConsumed

  // Calculate progress percentage for the circle
  const progressPercentage = totalTarget > 0 ? (totalConsumed / totalTarget) * 100 : 0

  // Create SVG circle path
  const radius = 64 // Reduced from 80 (20% smaller)
  const circumference = 2 * Math.PI * radius
  const strokeDasharray = circumference
  const strokeDashoffset = circumference - (progressPercentage / 100) * circumference

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl">Today's Nutrition</CardTitle>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Circular Progress */}
        <div className="flex justify-center">
          <div className="relative w-32 h-32">
            <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 128 128">
              {/* Background circle */}
              <circle
                cx="64"
                cy="64"
                r={radius}
                stroke="hsl(var(--muted))"
                strokeWidth="8"
                fill="none"
              />
              {/* Progress circle */}
              <circle
                cx="64"
                cy="64"
                r={radius}
                stroke="hsl(var(--primary))"
                strokeWidth="8"
                fill="none"
                strokeDasharray={strokeDasharray}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                className="transition-all duration-500 ease-in-out"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-2xl font-bold">{Math.round(progressPercentage)}%</div>
                <div className="text-xs text-muted-foreground">Complete</div>
              </div>
            </div>
          </div>
        </div>

        {/* Calorie Summary */}
        <div className="flex justify-between items-center px-2">
          <div className="text-center">
            <div className="text-xl font-bold">{totalRemaining}</div>
            <div className="text-xs text-muted-foreground">Remaining</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold">{totalTarget}</div>
            <div className="text-xs text-muted-foreground">Target</div>
          </div>
        </div>

        {/* Macro Breakdown with Sliders - more compact */}
        <div className="grid grid-cols-3 gap-3">
          {/* Protein - Red */}
          <div className="text-center space-y-1.5">
            <div className="text-xs text-muted-foreground">Protein</div>
            <div className="w-full bg-muted rounded-full h-2.5 relative overflow-hidden">
              <div
                className="h-2.5 rounded-full transition-all duration-300"
                style={{
                  width: `${macroData.protein.target > 0 ? (macroData.protein.consumed / macroData.protein.target) * 100 : 0}%`,
                  background: "linear-gradient(90deg, #ef4444 0%, #dc2626 100%)",
                }}
              />
              {/* Slider thumb */}
              <div
                className="absolute top-0 w-0.5 h-2.5 bg-red-600 rounded-full shadow-sm transition-all duration-300"
                style={{
                  left: `${macroData.protein.target > 0 ? (macroData.protein.consumed / macroData.protein.target) * 100 : 0}%`,
                  transform: "translateX(-50%)",
                }}
              />
            </div>
            <div className="text-xs font-medium">
              {macroData.protein.consumed} / {macroData.protein.target}g
            </div>
          </div>

          {/* Fat - Yellow */}
          <div className="text-center space-y-1.5">
            <div className="text-xs text-muted-foreground">Fat</div>
            <div className="w-full bg-muted rounded-full h-2.5 relative overflow-hidden">
              <div
                className="h-2.5 rounded-full transition-all duration-300"
                style={{
                  width: `${macroData.fats.target > 0 ? (macroData.fats.consumed / macroData.fats.target) * 100 : 0}%`,
                  background: "linear-gradient(90deg, #eab308 0%, #ca8a04 100%)",
                }}
              />
              {/* Slider thumb */}
              <div
                className="absolute top-0 w-0.5 h-2.5 bg-yellow-600 rounded-full shadow-sm transition-all duration-300"
                style={{
                  left: `${macroData.fats.target > 0 ? (macroData.fats.consumed / macroData.fats.target) * 100 : 0}%`,
                  transform: "translateX(-50%)",
                }}
              />
            </div>
            <div className="text-xs font-medium">
              {macroData.fats.consumed} / {macroData.fats.target}g
            </div>
          </div>

          {/* Carbs - Green */}
          <div className="text-center space-y-1.5">
            <div className="text-xs text-muted-foreground">Carbs</div>
            <div className="w-full bg-muted rounded-full h-2.5 relative overflow-hidden">
              <div
                className="h-2.5 rounded-full transition-all duration-300"
                style={{
                  width: `${macroData.carbs.target > 0 ? (macroData.carbs.consumed / macroData.carbs.target) * 100 : 0}%`,
                  background: "linear-gradient(90deg, #22c55e 0%, #16a34a 100%)",
                }}
              />
              {/* Slider thumb */}
              <div
                className="absolute top-0 w-0.5 h-2.5 bg-green-600 rounded-full shadow-sm transition-all duration-300"
                style={{
                  left: `${macroData.carbs.target > 0 ? (macroData.carbs.consumed / macroData.carbs.target) * 100 : 0}%`,
                  transform: "translateX(-50%)",
                }}
              />
            </div>
            <div className="text-xs font-medium">
              {macroData.carbs.consumed} / {macroData.carbs.target}g
            </div>
          </div>
        </div>

        {/* Toggle Buttons - more compact */}
        <div className="flex justify-center">
          <div className="flex bg-muted rounded-full p-0.5">
            <Button
              variant={viewMode === "consumed" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("consumed")}
              className="rounded-full px-4 text-xs"
            >
              Consumed
            </Button>
            <Button
              variant={viewMode === "remaining" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("remaining")}
              className="rounded-full px-4 text-xs"
            >
              Remaining
            </Button>
          </div>
        </div>

        {/* Gym Info - more compact */}
        <div className="text-center text-xs text-muted-foreground">
          <div className="flex items-center justify-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>On track for your goals</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

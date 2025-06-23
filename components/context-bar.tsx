import { MacroGapChip } from "@/components/macro-gap-chip"
import { TimePresetSelector } from "@/components/time-preset-selector"

export type TimePreset = "5" | "15" | "30"

export interface MacroTargets {
  calories: number
  protein: number
  carbs: number
  fats: number
}

interface ContextBarProps {
  selectedTime: TimePreset
  onTimeChange: (time: TimePreset) => void
  onMacrosChange: (macros: MacroTargets) => void
  initialMacros: MacroTargets
}

export function ContextBar({ 
  selectedTime, 
  onTimeChange,
  onMacrosChange,
  initialMacros
}: ContextBarProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
      <MacroGapChip 
        protein={initialMacros.protein} 
        carbs={initialMacros.carbs} 
        fat={initialMacros.fats} 
      />
      <TimePresetSelector selectedTime={selectedTime} onTimeChange={onTimeChange} />
    </div>
  )
}

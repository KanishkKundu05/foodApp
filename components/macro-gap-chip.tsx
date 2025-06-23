import { Badge } from "@/components/ui/badge"

interface MacroGapChipProps {
  protein: number
  carbs: number
  fat: number
}

export function MacroGapChip({ protein, carbs, fat }: MacroGapChipProps) {
  return (
    <Badge variant="secondary" className="px-3 py-1.5 text-sm">
      <span className="flex items-center gap-2">
        <span>P {protein}g</span>
        <span>•</span>
        <span>C {carbs}g</span>
        <span>•</span>
        <span>F {fat}g</span>
      </span>
    </Badge>
  )
}

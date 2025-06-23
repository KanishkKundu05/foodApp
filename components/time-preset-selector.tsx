"use client"

import { Button } from "@/components/ui/button"

export type TimePreset = "5" | "15" | "30"

interface TimePresetSelectorProps {
  selectedTime: TimePreset
  onTimeChange: (time: TimePreset) => void
}

export function TimePresetSelector({ selectedTime, onTimeChange }: TimePresetSelectorProps) {
  const timeOptions: { value: TimePreset; label: string }[] = [
    { value: "5", label: "5 min" },
    { value: "15", label: "15 min" },
    { value: "30", label: "30+ min" },
  ]

  return (
    <div className="flex gap-1 bg-muted p-1 rounded-lg">
      {timeOptions.map((option) => (
        <Button
          key={option.value}
          variant={selectedTime === option.value ? "default" : "ghost"}
          size="sm"
          onClick={() => onTimeChange(option.value)}
          className="text-xs"
        >
          {option.label}
        </Button>
      ))}
    </div>
  )
}

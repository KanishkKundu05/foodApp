"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"

interface Meal {
  id: string
  name: string
  protein: number
  carbs: number
  fat: number
  calories: number
  cost: string
}

interface AddMealModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (mealData: any) => void
  meal: Meal | null
}

export function AddMealModal({ isOpen, onClose, onSave, meal }: AddMealModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    servings: 1,
    protein: 0,
    carbs: 0,
    fat: 0,
    calories: 0,
    cost: "",
  })

  useEffect(() => {
    if (meal) {
      setFormData({
        name: meal.name,
        servings: 1,
        protein: meal.protein,
        carbs: meal.carbs,
        fat: meal.fat,
        calories: meal.calories,
        cost: meal.cost.replace("$", ""),
      })
    }
  }, [meal])

  const handleSave = () => {
    // TODO: validate form data
    onSave(formData)
    setFormData({
      name: "",
      servings: 1,
      protein: 0,
      carbs: 0,
      fat: 0,
      calories: 0,
      cost: "",
    })
  }

  const handleClose = () => {
    onClose()
    setFormData({
      name: "",
      servings: 1,
      protein: 0,
      carbs: 0,
      fat: 0,
      calories: 0,
      cost: "",
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Meal</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <Label htmlFor="meal-name">Meal Name</Label>
            <Input
              id="meal-name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Enter meal name"
            />
          </div>

          <div className="space-y-2">
            <Label>Servings: {formData.servings}</Label>
            <Slider
              value={[formData.servings]}
              onValueChange={(value) => setFormData({ ...formData, servings: value[0] })}
              max={5}
              min={0.5}
              step={0.5}
              className="w-full"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="protein">Protein (g)</Label>
              <Input
                id="protein"
                type="number"
                value={formData.protein}
                onChange={(e) => setFormData({ ...formData, protein: Number(e.target.value) })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="carbs">Carbs (g)</Label>
              <Input
                id="carbs"
                type="number"
                value={formData.carbs}
                onChange={(e) => setFormData({ ...formData, carbs: Number(e.target.value) })}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fat">Fat (g)</Label>
              <Input
                id="fat"
                type="number"
                value={formData.fat}
                onChange={(e) => setFormData({ ...formData, fat: Number(e.target.value) })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cost">Cost ($)</Label>
              <Input
                id="cost"
                type="number"
                value={formData.cost}
                onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
                placeholder="0.00"
              />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save Meal</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

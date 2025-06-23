"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Recipe } from "@/stores/recipe-store"
import { PlusCircle, MessageSquare, BrainCircuit, Wheat, Beef } from "lucide-react"

interface SuggestionCardProps {
  suggestion: Recipe
  onAdd: (recipe: Recipe) => void
  onGetHelp: (recipe: Recipe) => void
}

export function SuggestionCard({ suggestion, onAdd, onGetHelp }: SuggestionCardProps) {
  return (
    <Card className="flex flex-col">
      <CardHeader className="flex-grow">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <CardTitle>{suggestion.name}</CardTitle>
            <CardDescription>{suggestion.cook_time}</CardDescription>
          </div>
          <div className="text-2xl">{suggestion.emoji || "🍽️"}</div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-2 text-sm">
            <div className="flex items-center">
                <BrainCircuit className="h-4 w-4 mr-1.5 text-blue-500" />
                <span>{suggestion.protein}g Protein</span>
            </div>
            <div className="flex items-center">
                <Wheat className="h-4 w-4 mr-1.5 text-yellow-500" />
                <span>{suggestion.carbs}g Carbs</span>
            </div>
            <div className="flex items-center">
                <Beef className="h-4 w-4 mr-1.5 text-red-500" />
                <span>{suggestion.fats}g Fat</span>
            </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={() => onGetHelp(suggestion)}>
            <MessageSquare className="mr-2 h-4 w-4" />
            Get Help
        </Button>
        <Button onClick={() => onAdd(suggestion)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add to Log
        </Button>
      </CardFooter>
    </Card>
  )
}

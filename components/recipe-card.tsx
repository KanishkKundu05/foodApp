"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { type Recipe, type AIRecipe } from "@/stores/recipe-store"

// The card can accept a full recipe from the DB or a freshly generated one from the AI
type RecipeCardProps = {
  recipe: Partial<Recipe> & Partial<AIRecipe>;
};

export function RecipeCard({ recipe }: RecipeCardProps) {
  const ingredientsList = Array.isArray(recipe.ingredients) ? recipe.ingredients : [];
  const instructionsList = Array.isArray(recipe.instructions) 
    ? recipe.instructions 
    : [];
  
  const title = recipe.title;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>{title}</span>
          <span className="text-2xl">{recipe.notes?.emoji}</span>
        </CardTitle>
        <CardDescription>{recipe.description || title}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2 mb-4">
          {recipe.prep_time && <Badge variant="outline">Prep: {recipe.prep_time}</Badge>}
          {recipe.cook_time && <Badge variant="outline">Cook: {recipe.cook_time}</Badge>}
          {recipe.servings && <Badge variant="outline">Serves: {recipe.servings}</Badge>}
        </div>
        
        <div className="mb-4">
          <h4 className="font-semibold mb-2">Ingredients</h4>
          <ul className="list-disc list-inside">
            {ingredientsList.map((ing: any, i: number) => (
              <li key={i}>{ing.amount} {ing.name}</li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-2">Instructions</h4>
          <ol className="list-decimal list-inside">
            {instructionsList.map((step: any, i: number) => (
              <li key={i}>{typeof step === 'string' ? step : step.text}</li>
            ))}
          </ol>
        </div>
        
        {recipe.notes?.text && (
          <div className="mt-4 p-3 bg-muted/50 rounded-lg">
            <h4 className="font-semibold mb-1">Chef's Notes</h4>
            <p className="text-sm text-muted-foreground">{recipe.notes.text}</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
} 
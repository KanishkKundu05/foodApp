"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { useRecipeStore } from "@/stores/recipe-store"
import { RecipeCard } from "@/components/recipe-card"
import { RecipeChatSheet } from "@/components/recipe-chat-sheet"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, ChefHat, MessageSquare, Clock, Users, Timer, Utensils, Star, Share2, Bookmark } from "lucide-react"
import { Recipe } from "@/stores/recipe-store"
import Link from "next/link"

export default function RecipeDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { getRecipeById } = useRecipeStore()
  const [recipe, setRecipe] = useState<Recipe | null>(null)
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [isFavorite, setIsFavorite] = useState(false)

  useEffect(() => {
    if (params.id) {
      const foundRecipe = getRecipeById(params.id as string)
      if (foundRecipe) {
        setRecipe(foundRecipe)
      } else {
        // If not found in store, redirect to recipe list
        router.push('/food')
      }
    }
  }, [params.id, getRecipeById, router])

  const handleShare = async () => {
    if (navigator.share && recipe) {
      try {
        await navigator.share({
          title: recipe.name,
          text: `Check out this recipe: ${recipe.name}`,
          url: window.location.href,
        })
      } catch (error) {
        console.log('Error sharing:', error)
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href)
      // You could add a toast notification here
    }
  }

  if (!recipe) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading recipe...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link href="/food">
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Recipes
          </Button>
        </Link>
        
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-4xl font-bold tracking-tight">{recipe.name}</h1>
            <p className="text-muted-foreground mt-2">
              AI-generated recipe with cooking assistance
            </p>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline"
              size="sm"
              onClick={handleShare}
            >
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
            <Button 
              variant="outline"
              size="sm"
              onClick={() => setIsFavorite(!isFavorite)}
            >
              <Bookmark className={`h-4 w-4 mr-2 ${isFavorite ? 'fill-current' : ''}`} />
              {isFavorite ? 'Saved' : 'Save'}
            </Button>
            <Button 
              onClick={() => setIsChatOpen(true)}
              className="flex items-center gap-2"
            >
              <MessageSquare className="h-4 w-4" />
              Get Cooking Help
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recipe Details - Takes 2 columns */}
        <div className="lg:col-span-2">
          <RecipeCard recipe={recipe as any} />
          
          {/* Cooking Tips Section */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ChefHat className="h-5 w-5" />
                Cooking Tips & Notes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-start gap-3">
                    <Timer className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <h4 className="font-semibold">Timing Tips</h4>
                      <p className="text-sm text-muted-foreground">
                        Prep all ingredients before starting. This recipe takes about {recipe.cook_time || '30 minutes'} to complete.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Utensils className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <h4 className="font-semibold">Equipment Needed</h4>
                      <p className="text-sm text-muted-foreground">
                        Basic kitchen tools: cutting board, knife, pan, and cooking utensils.
                      </p>
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <h4 className="font-semibold mb-2">Pro Tips</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <Star className="h-3 w-3 text-yellow-500 mt-1 flex-shrink-0" />
                      <span>Read through all instructions before starting</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Star className="h-3 w-3 text-yellow-500 mt-1 flex-shrink-0" />
                      <span>Keep your cooking area clean and organized</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Star className="h-3 w-3 text-yellow-500 mt-1 flex-shrink-0" />
                      <span>Taste as you cook and adjust seasoning to your preference</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar - Takes 1 column */}
        <div className="space-y-6">
          {/* Cooking Assistant */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ChefHat className="h-5 w-5" />
                Cooking Assistant
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Need help while cooking? I remember our original conversation and can assist with:
              </p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  Step-by-step guidance
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  Ingredient substitutions
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  Timing and technique tips
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  Troubleshooting issues
                </li>
              </ul>
              
              <Button 
                onClick={() => setIsChatOpen(true)}
                className="w-full"
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                Start Cooking Session
              </Button>
            </CardContent>
          </Card>

          {/* Recipe Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Recipe Info</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <Clock className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm font-medium">Cook Time</p>
                    <p className="text-2xl font-bold">{recipe.cook_time || 'N/A'}</p>
                  </div>
                  <div className="text-center">
                    <Users className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm font-medium">Servings</p>
                    <p className="text-2xl font-bold">2-4</p>
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Difficulty</span>
                    <Badge variant="outline">Easy</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Category</span>
                    <Badge variant="outline">Main Dish</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Created</span>
                    <span className="text-sm">
                      {new Date(recipe.created_at || Date.now()).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                
                <Separator />
                
                <Badge variant="outline" className="w-full justify-center">
                  <ChefHat className="h-3 w-3 mr-1" />
                  AI Generated Recipe
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start">
                <Timer className="h-4 w-4 mr-2" />
                Start Timer
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Utensils className="h-4 w-4 mr-2" />
                View Equipment
              </Button>
              <Link href="/mealprep">
                <Button variant="outline" className="w-full justify-start">
                  <ChefHat className="h-4 w-4 mr-2" />
                  Create Similar Recipe
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>

      <RecipeChatSheet
        recipe={recipe}
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
      />
    </div>
  )
} 
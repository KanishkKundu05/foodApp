"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/hooks/use-supabase"
import { useRecipeStore } from "@/stores/recipe-store"
import { RecipeCard } from "@/components/recipe-card"
import { RecipeChatSheet } from "@/components/recipe-chat-sheet"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChefHat, Plus, MessageSquare, Clock, Users, Search, Filter, Grid, List } from "lucide-react"
import { Recipe } from "@/stores/recipe-store"
import Link from "next/link"

type ViewMode = "grid" | "list"
type SortOption = "newest" | "oldest" | "name" | "cookTime"

export default function FoodPage() {
  const { user } = useAuth()
  const { recipes, syncWithSupabase, loading } = useRecipeStore()
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null)
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [viewMode, setViewMode] = useState<ViewMode>("grid")
  const [sortBy, setSortBy] = useState<SortOption>("newest")

  useEffect(() => {
    if (user) {
      syncWithSupabase(user.id)
    }
  }, [user, syncWithSupabase])

  const handleOpenChat = (recipe: Recipe) => {
    setSelectedRecipe(recipe)
    setIsChatOpen(true)
  }

  // Filter and sort recipes
  const filteredAndSortedRecipes = recipes
    .filter(recipe => {
      if (!searchQuery) return true
      const query = searchQuery.toLowerCase()
      return (
        recipe.title.toLowerCase().includes(query) ||
        (Array.isArray(recipe.ingredients) && recipe.ingredients.some((ing: any) => 
          ing.name.toLowerCase().includes(query)
        ))
      )
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.created_at || Date.now()).getTime() - new Date(a.created_at || Date.now()).getTime()
        case "oldest":
          return new Date(a.created_at || Date.now()).getTime() - new Date(b.created_at || Date.now()).getTime()
        case "name":
          return a.title.localeCompare(b.title)
        case "cookTime":
          const timeA = a.cook_time || 0
          const timeB = b.cook_time || 0
          return timeA - timeB
        default:
          return 0
      }
    })

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading your recipes...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-4xl font-bold tracking-tight">My Recipe Collection</h1>
            <p className="text-muted-foreground mt-2">
              Your AI-generated recipes and cooking assistants
            </p>
          </div>
          <Link href="/mealprep">
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Create New Recipe
            </Button>
          </Link>
        </div>

        {/* Search and Filter Bar */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search recipes or ingredients..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            <Select value={sortBy} onValueChange={(value: SortOption) => setSortBy(value)}>
              <SelectTrigger className="w-[140px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
                <SelectItem value="name">Name A-Z</SelectItem>
                <SelectItem value="cookTime">Cook Time</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex border rounded-md">
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("grid")}
                className="rounded-r-none"
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("list")}
                className="rounded-l-none"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Recipes</p>
                  <p className="text-2xl font-bold">{recipes.length}</p>
                </div>
                <ChefHat className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">AI Generated</p>
                  <p className="text-2xl font-bold">{recipes.filter(r => r.is_ai_generated).length}</p>
                </div>
                <MessageSquare className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">This Month</p>
                  <p className="text-2xl font-bold">
                    {recipes.filter(r => {
                      const created = new Date(r.created_at || Date.now())
                      const now = new Date()
                      return created.getMonth() === now.getMonth() && created.getFullYear() === now.getFullYear()
                    }).length}
                  </p>
                </div>
                <Clock className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {recipes.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <ChefHat className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">No recipes yet</h3>
              <p className="text-muted-foreground mb-4">
                Start by creating your first AI-generated recipe with SousAI
              </p>
              <Link href="/mealprep">
                <Button>
                  <ChefHat className="h-4 w-4 mr-2" />
                  Create Your First Recipe
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : filteredAndSortedRecipes.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <Search className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">No recipes found</h3>
              <p className="text-muted-foreground mb-4">
                Try adjusting your search terms or filters
              </p>
              <Button variant="outline" onClick={() => setSearchQuery("")}>
                Clear Search
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className={viewMode === "grid" 
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" 
            : "space-y-4"
          }>
            {filteredAndSortedRecipes.map((recipe) => (
              <Card key={recipe.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="truncate">{recipe.title}</span>
                    <span className="text-2xl">
                      {recipe.notes?.emoji || "🍽️"}
                    </span>
                  </CardTitle>
                  <div className="flex flex-wrap gap-2">
                    {recipe.cook_time && (
                      <Badge variant="outline" className="text-xs">
                        <Clock className="h-3 w-3 mr-1" />
                        {recipe.cook_time}
                      </Badge>
                    )}
                    <Badge variant="outline" className="text-xs">
                      <MessageSquare className="h-3 w-3 mr-1" />
                      AI Generated
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    <h4 className="font-semibold mb-2 text-sm">Ingredients</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      {Array.isArray(recipe.ingredients) && recipe.ingredients.slice(0, 3).map((ing: any, i: number) => (
                        <li key={i} className="truncate">
                          {ing.amount} {ing.name}
                        </li>
                      ))}
                      {Array.isArray(recipe.ingredients) && recipe.ingredients.length > 3 && (
                        <li className="text-xs">+{recipe.ingredients.length - 3} more...</li>
                      )}
                    </ul>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1"
                      onClick={() => handleOpenChat(recipe)}
                    >
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Cooking Help
                    </Button>
                    <Link href={`/food/${recipe.id}`}>
                      <Button variant="outline" size="sm" className="flex-1">
                        <ChefHat className="h-4 w-4 mr-2" />
                        View Recipe
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <RecipeChatSheet
        recipe={selectedRecipe}
        isOpen={isChatOpen}
        onClose={() => {
          setIsChatOpen(false)
          setSelectedRecipe(null)
        }}
      />
    </div>
  )
} 
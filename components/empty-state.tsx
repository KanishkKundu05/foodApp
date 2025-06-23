import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChefHat, Package, ShoppingCart, RefreshCw } from "lucide-react"

export type FoodMode = "cook" | "meal-prep" | "order"

interface EmptyStateProps {
  mode: FoodMode
}

export function EmptyState({ mode }: EmptyStateProps) {
  const getContent = () => {
    switch (mode) {
      case "cook":
        return {
          icon: ChefHat,
          title: "No cooking suggestions",
          description: "We couldn't find any recipes that match your current preferences and available time.",
          action: "Find Recipes",
        }
      case "meal-prep":
        return {
          icon: Package,
          title: "No leftovers available",
          description: "You don't have any meal-prepped items or leftovers ready to eat right now.",
          action: "Plan Meal Prep",
        }
      case "order":
        return {
          icon: ShoppingCart,
          title: "No delivery options",
          description: "We couldn't find any delivery options that fit your budget and dietary preferences.",
          action: "Browse Restaurants",
        }
    }
  }

  const { icon: Icon, title, description, action } = getContent()

  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center py-16 text-center">
        <div className="mb-6 rounded-full bg-muted p-4">
          <Icon className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="text-xl font-semibold mb-3">{title}</h3>
        <p className="text-muted-foreground mb-8 max-w-md leading-relaxed">{description}</p>
        <div className="flex gap-3">
          <Button variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button>{action}</Button>
        </div>
      </CardContent>
    </Card>
  )
}

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CookingPot } from "lucide-react"
import Link from "next/link"

export function MealPrepTile() {
  return (
    <Link href="/mealprep" aria-label="Go to SousAI Playground">
      <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <CookingPot className="h-6 w-6 text-primary" aria-hidden="true" />
            </div>
            <CardTitle className="text-lg">SousAI Playground</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm">Chat with your AI sous-chef to create new recipes.</p>
        </CardContent>
      </Card>
    </Link>
  )
}

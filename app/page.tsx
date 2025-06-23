import { QuestionCard } from "@/components/question-card"
import { MealPrepTile } from "@/components/meal-prep-tile"

export default function HomePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Life Manager</h1>
        <p className="text-muted-foreground">Your personal assistant for daily decisions</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <QuestionCard
          title="What should I eat right now?"
          subtitle="Get personalized meal suggestions based on your health goals, time, and budget"
          href="/wse"
        />
        <MealPrepTile />
      </div>
    </div>
  )
}

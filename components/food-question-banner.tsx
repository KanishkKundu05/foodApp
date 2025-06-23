import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function FoodQuestionBanner() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">What should I eat right now?</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <p className="text-muted-foreground mb-4">Based on your health goals and current situation</p>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="relative w-16 h-16 rounded-full bg-muted flex items-center justify-center">
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                <span className="text-sm font-medium">70%</span>
              </div>
            </div>
            <span className="text-xs text-muted-foreground">Daily Macros</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

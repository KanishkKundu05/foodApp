import { TrendingDown, TrendingUp } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface MetricCardProps {
  title: string
  value: string | number
  previousValue?: string | number
  format?: "number" | "currency" | "percentage"
  className?: string
}

export function MetricCard({ title, value, previousValue, format = "number", className }: MetricCardProps) {
  const formatValue = (val: string | number) => {
    const numVal = typeof val === "string" ? Number.parseFloat(val) : val

    switch (format) {
      case "currency":
        return new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(numVal)
      case "percentage":
        return `${numVal}%`
      default:
        return numVal.toLocaleString()
    }
  }

  const calculateChange = () => {
    if (!previousValue) return null

    const current = typeof value === "string" ? Number.parseFloat(value) : value
    const previous = typeof previousValue === "string" ? Number.parseFloat(previousValue) : previousValue

    const change = ((current - previous) / previous) * 100
    return {
      value: Math.abs(change),
      isPositive: change > 0,
    }
  }

  const change = calculateChange()

  return (
    <Card className={cn("", className)}>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold mb-2">{formatValue(value)}</div>
        {change && (
          <div className="flex items-center gap-1 text-xs">
            {change.isPositive ? (
              <TrendingUp className="h-3 w-3 text-primary" />
            ) : (
              <TrendingDown className="h-3 w-3 text-destructive" />
            )}
            <span className={cn("font-medium", change.isPositive ? "text-primary" : "text-destructive")}>
              {change.value.toFixed(1)}%
            </span>
            <span className="text-muted-foreground">vs last period</span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

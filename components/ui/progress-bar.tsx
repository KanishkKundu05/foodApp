import { cn } from "@/lib/utils"

interface ProgressBarProps {
  value: number
  max?: number
  size?: "sm" | "md" | "lg"
  variant?: "default" | "success" | "warning" | "error"
  showLabel?: boolean
  className?: string
}

export function ProgressBar({
  value,
  max = 100,
  size = "md",
  variant = "default",
  showLabel = false,
  className,
}: ProgressBarProps) {
  const percentage = Math.min((value / max) * 100, 100)

  const sizeClasses = {
    sm: "h-1",
    md: "h-2",
    lg: "h-3",
  }

  const variantClasses = {
    default: "bg-primary",
    success: "bg-primary",
    warning: "bg-yellow-500",
    error: "bg-destructive",
  }

  return (
    <div className={cn("w-full", className)}>
      {showLabel && (
        <div className="flex justify-between text-sm mb-1">
          <span className="text-muted-foreground">Progress</span>
          <span className="font-medium">{Math.round(percentage)}%</span>
        </div>
      )}
      <div className={cn("w-full bg-muted rounded-full overflow-hidden", sizeClasses[size])}>
        <div
          className={cn("h-full transition-all duration-300 ease-in-out", variantClasses[variant])}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}

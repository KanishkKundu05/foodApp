"use client"

import { AlertTriangle, CheckCircle, Info, X, XCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface AlertBannerProps {
  variant?: "info" | "success" | "warning" | "error"
  title?: string
  description: string
  dismissible?: boolean
  onDismiss?: () => void
  className?: string
}

const variantConfig = {
  info: {
    icon: Info,
    className: "bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-400",
  },
  success: {
    icon: CheckCircle,
    className: "bg-primary/10 border-primary/20 text-primary",
  },
  warning: {
    icon: AlertTriangle,
    className:
      "bg-yellow-50 border-yellow-200 text-yellow-800 dark:bg-yellow-900/20 dark:border-yellow-800 dark:text-yellow-400",
  },
  error: {
    icon: XCircle,
    className: "bg-destructive/10 border-destructive/20 text-destructive",
  },
}

export function AlertBanner({
  variant = "info",
  title,
  description,
  dismissible = false,
  onDismiss,
  className,
}: AlertBannerProps) {
  const config = variantConfig[variant]
  const Icon = config.icon

  return (
    <div className={cn("flex items-start gap-3 rounded-lg border p-4", config.className, className)}>
      <Icon className="h-5 w-5 flex-shrink-0 mt-0.5" />
      <div className="flex-1 min-w-0">
        {title && <h4 className="font-medium mb-1">{title}</h4>}
        <p className="text-sm">{description}</p>
      </div>
      {dismissible && onDismiss && (
        <Button variant="ghost" size="sm" className="h-6 w-6 p-0 hover:bg-transparent" onClick={onDismiss}>
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  )
}

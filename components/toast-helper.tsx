"use client"

import { toast } from "sonner"
import { CheckCircle, AlertCircle, Info, AlertTriangle } from "lucide-react"

export const showToast = {
  success: (message: string) => {
    toast.success(message, {
      icon: <CheckCircle className="h-4 w-4" />,
      duration: 3000,
    })
  },

  error: (message: string) => {
    toast.error(message, {
      icon: <AlertCircle className="h-4 w-4" />,
      duration: 4000,
    })
  },

  info: (message: string) => {
    toast.info(message, {
      icon: <Info className="h-4 w-4" />,
      duration: 3000,
    })
  },

  warning: (message: string) => {
    toast.warning(message, {
      icon: <AlertTriangle className="h-4 w-4" />,
      duration: 3500,
    })
  },

  recipe: (recipeName: string) => {
    toast.success(`✅ ${recipeName} saved to Quick Picks!`, {
      duration: 4000,
      className: "bg-primary/10 border-primary/20",
    })
  },
}

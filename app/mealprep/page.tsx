"use client"

import { SousAiChat } from "@/components/sous-ai-chat"

export default function MealPrepPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 text-center">
        <h1 className="text-4xl font-bold tracking-tight">SousAI Playground</h1>
        <p className="text-muted-foreground mt-2">
          Your AI-powered sous-chef. Brainstorm recipes, get cooking help, and more.
        </p>
      </div>
      <SousAiChat />
    </div>
  )
}

"use client"

import { useState, useEffect } from "react"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Loader2, Send, ChefHat, MessageSquare, Clock, Timer, Utensils, Lightbulb, X, Sparkles } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Recipe } from "@/stores/recipe-store"

interface Message {
  role: "user" | "assistant" | "divider"
  content: string
  timestamp: Date
}

interface RecipeChatSheetProps {
  recipe: Recipe | null
  isOpen: boolean
  onClose: () => void
}

const COOKING_TIPS = [
  "How do I know when the chicken is cooked through?",
  "Can I substitute olive oil for butter?",
  "What if I don't have fresh herbs?",
  "How do I adjust the recipe for 4 people?",
  "What should I do if the sauce is too thick?",
  "Can I make this ahead of time?",
]

export function RecipeChatSheet({ recipe, isOpen, onClose }: RecipeChatSheetProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  // Load saved chat history and add a "New Session" divider
  useEffect(() => {
    if (recipe) {
      const baseMessages: Message[] = [];
      // Load previous chat log if it exists
      if (recipe.generation_chat_log && Array.isArray(recipe.generation_chat_log)) {
        try {
          const savedMessages = recipe.generation_chat_log.map((msg: any) => ({
            role: msg.role,
            content: msg.content,
            timestamp: new Date(msg.timestamp || Date.now())
          }));
          baseMessages.push(...savedMessages);
        } catch (error) {
          console.error("Error loading chat history:", error);
        }
      }
      
      // Add a divider to signify a new cooking session
      baseMessages.push({
        role: "divider",
        content: "New Cooking Session",
        timestamp: new Date()
      });

      setMessages(baseMessages);
    } else {
      setMessages([])
    }
  }, [recipe])

  const sendMessage = async () => {
    if (!inputValue.trim() || !recipe) return

    const userMessage: Message = {
      role: "user",
      content: inputValue,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue("")
    setIsLoading(true)

    try {
      const response = await fetch("/api/chef", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: messages
            .filter(m => m.role !== 'divider') // Don't send dividers to the AI
            .map(msg => ({ role: msg.role, content: msg.content })),
          chatMode: "cooking-help",
          recipeId: recipe.id,
          recipeTitle: recipe.name
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to send message")
      }

      const reader = response.body?.getReader()
      if (!reader) throw new Error("No response body")

      let assistantMessageContent = ""
      const decoder = new TextDecoder()

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value)
        assistantMessageContent += chunk
      }

      const assistantMessage: Message = {
        role: "assistant",
        content: assistantMessageContent,
        timestamp: new Date()
      }

      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      console.error("Error sending message:", error)
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleQuickTip = (tip: string) => {
    setInputValue(tip)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  if (!recipe) return null

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="max-w-4xl w-full flex flex-col p-0 sm:max-w-4xl">
        <SheetHeader className="p-6 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <ChefHat className="h-6 w-6 text-primary" />
              </div>
              <div>
                <SheetTitle className="text-xl font-bold">
                  Cooking Assistant: {recipe.name}
                </SheetTitle>
                <p className="text-sm text-muted-foreground">
                  I remember our original conversation and can help with any cooking questions
                </p>
              </div>
            </div>
          </div>
        </SheetHeader>

        <div className="flex-1 flex min-h-0">
          {/* Main Chat Area */}
          <div className="flex-1 flex flex-col">
            {/* Chat Messages */}
            <ScrollArea className="flex-1 px-6">
              <div className="space-y-4 py-4">
                {messages.map((message, index) => {
                  if (message.role === 'divider') {
                    return (
                      <div key={index} className="relative py-2">
                        <div className="absolute inset-0 flex items-center">
                          <span className="w-full border-t" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                          <span className="bg-background px-2 text-muted-foreground flex items-center gap-2">
                            <Sparkles className="h-3 w-3" />
                            {message.content}
                          </span>
                        </div>
                      </div>
                    )
                  }
                  return (
                    <div
                      key={index}
                      className={`flex ${
                        message.role === "user" ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-[80%] rounded-lg p-4 ${
                          message.role === "user"
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted border"
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <Badge
                            variant={message.role === "user" ? "secondary" : "outline"}
                            className="text-xs"
                          >
                            {message.role === "user" ? "You" : "SousAI"}
                          </Badge>
                          {message.role === "assistant" && (
                            <ChefHat className="h-3 w-3 text-muted-foreground" />
                          )}
                        </div>
                        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                        <p className="text-xs opacity-70 mt-2">
                          {message.timestamp.toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  )
                })}
                
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-muted border rounded-lg p-4 max-w-[80%]">
                      <div className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span className="text-sm">Cooking assistant is thinking...</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>

            {/* Input Area */}
            <div className="p-6 border-t bg-background">
              <form onSubmit={(e) => { e.preventDefault(); sendMessage(); }} className="flex gap-3">
                <Textarea
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask about cooking techniques, substitutions, timing, or any recipe questions..."
                  className="flex-1 min-h-[60px] resize-none"
                  disabled={isLoading}
                />
                <Button
                  type="submit"
                  disabled={!inputValue.trim() || isLoading}
                  size="icon"
                  className="h-[60px] w-[60px]"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </div>
          </div>

          {/* Sidebar with Recipe Info */}
          <div className="w-80 border-l bg-muted/30 p-6 hidden md:block">
            <div className="space-y-6">
              {/* Recipe Summary */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Recipe Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Cook Time: {recipe.cook_time || 'N/A'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Utensils className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Servings: 2-4</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Timer className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Difficulty: Easy</span>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <Timer className="h-4 w-4 mr-2" />
                    Start Cooking Timer
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <Utensils className="h-4 w-4 mr-2" />
                    View Equipment List
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <Lightbulb className="h-4 w-4 mr-2" />
                    Cooking Tips
                  </Button>
                </CardContent>
              </Card>

              {/* Recent Tips */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Recent Tips</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <p>• Always taste as you cook</p>
                    <p>• Keep your workspace clean</p>
                    <p>• Prep ingredients before starting</p>
                    <p>• Don't be afraid to adjust seasoning</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
} 
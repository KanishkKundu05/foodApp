"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Loader2, Send, ChefHat, MessageSquare, Clock, Timer, Utensils, Lightbulb, X } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Recipe } from "@/stores/recipe-store"

interface Message {
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

interface RecipeChatModalProps {
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

export function RecipeChatModal({ recipe, isOpen, onClose }: RecipeChatModalProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  // Load saved chat history when recipe changes
  useEffect(() => {
    if (recipe?.generation_chat_log && Array.isArray(recipe.generation_chat_log)) {
      try {
        const savedMessages = recipe.generation_chat_log.map((msg: any) => ({
          role: msg.role,
          content: msg.content,
          timestamp: new Date(msg.timestamp || Date.now())
        }))
        setMessages(savedMessages)
      } catch (error) {
        console.error("Error loading chat history:", error)
        setMessages([])
      }
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
          messages: [
            ...messages.map(msg => ({ role: msg.role, content: msg.content })),
            { role: "user", content: inputValue }
          ],
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

      let assistantMessage = ""
      const decoder = new TextDecoder()

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value)
        assistantMessage += chunk
      }

      const newAssistantMessage: Message = {
        role: "assistant",
        content: assistantMessage,
        timestamp: new Date()
      }

      setMessages(prev => [...prev, newAssistantMessage])
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
      e.preventDefault()
      sendMessage()
    }
  }

  if (!recipe) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[90vh] flex flex-col p-0">
        <DialogHeader className="p-6 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <ChefHat className="h-6 w-6 text-primary" />
              </div>
              <div>
                <DialogTitle className="text-xl font-bold">
                  Cooking Assistant: {recipe.name}
                </DialogTitle>
                <p className="text-sm text-muted-foreground">
                  I remember our original conversation and can help with any cooking questions
                </p>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="flex-1 flex min-h-0">
          {/* Main Chat Area */}
          <div className="flex-1 flex flex-col">
            {/* Recipe Info Banner */}
            <Card className="m-6 mb-0">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div>
                      <h3 className="font-semibold">{recipe.name}</h3>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        <span>{recipe.cook_time || 'N/A'}</span>
                        <MessageSquare className="h-3 w-3 ml-2" />
                        <span>{messages.length} messages</span>
                      </div>
                    </div>
                  </div>
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <ChefHat className="h-3 w-3" />
                    AI Assistant
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Chat Messages */}
            <ScrollArea className="flex-1 px-6">
              <div className="space-y-4 py-4">
                {messages.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="p-4 bg-primary/10 rounded-full w-16 h-16 mx-auto mb-4">
                      <ChefHat className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">Ready to Cook!</h3>
                    <p className="text-muted-foreground mb-6">
                      I remember our original conversation and can help with any questions about cooking this recipe.
                    </p>
                    
                    {/* Quick Tips */}
                    <div className="max-w-md mx-auto">
                      <h4 className="font-medium mb-3 text-sm">Quick Questions:</h4>
                      <div className="grid grid-cols-1 gap-2">
                        {COOKING_TIPS.map((tip, index) => (
                          <Button
                            key={index}
                            variant="outline"
                            size="sm"
                            className="justify-start text-left h-auto py-2"
                            onClick={() => handleQuickTip(tip)}
                          >
                            <Lightbulb className="h-3 w-3 mr-2 text-yellow-500" />
                            {tip}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  messages.map((message, index) => (
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
                  ))
                )}
                
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
          <div className="w-80 border-l bg-muted/30 p-6">
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
      </DialogContent>
    </Dialog>
  )
}

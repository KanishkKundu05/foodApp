"use client"

import { useState, useRef, useEffect } from "react"
import { useChat } from "ai/react"
import { useAuth } from "@/hooks/use-supabase"
import { useRecipeStore } from "@/stores/recipe-store"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2, Send, ChefHat, Sparkles, Save, MessageSquare } from "lucide-react"
import { RecipeCard } from "@/components/recipe-card"
import { type AIRecipe } from "@/stores/recipe-store"
import { toast } from "sonner"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Separator } from "@/components/ui/separator"

export function SousAiChat() {
  const { user } = useAuth()
  const addRecipeToSupabase = useRecipeStore(
    (state) => state.addRecipeToSupabase
  )
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const formRef = useRef<HTMLFormElement>(null)
  const [latestRecipe, setLatestRecipe] = useState<AIRecipe | null>(null)
  const [showSaveButton, setShowSaveButton] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    setMessages,
    append,
    isLoading,
  } = useChat({
    api: "/api/chef",
    id: user?.id, // Scope chat to user ID
    body: {
      userId: user?.id, // Pass user ID to API
    },
    onFinish: async (message) => {
      try {
        // First, check if the message contains a code block
        const codeBlockMatch = message.content.match(/```json\s*([\s\S]*?)\s*```/);
        if (!codeBlockMatch) {
          // If we don't find a code block, this is probably a normal conversation message
          // Just display it as is
          return;
        }

        // Extract the JSON from the code block
        const jsonString = codeBlockMatch[1];
        
        // Send to our parsing API
        const response = await fetch('/api/parse-recipe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            text: jsonString,
            userId: user?.id, // Pass user ID to ensure proper scoping
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to parse recipe on server.');
        }

        const parsedRecipe = await response.json();

        // Validate the recipe structure
        if (!parsedRecipe.title || !Array.isArray(parsedRecipe.ingredients) || !Array.isArray(parsedRecipe.instructions)) {
          throw new Error('Recipe is missing required fields (title, ingredients, or instructions)');
        }

        // If we get a valid recipe, we update the state.
        setLatestRecipe(parsedRecipe);
        setShowSaveButton(true);

        // We then replace the raw JSON in the chat with a friendly message.
        const friendlyMessage = {
          ...message,
          content: `🎉 I've created a recipe for "${parsedRecipe.title}"! Here's what we came up with:`,
        };
        setMessages((prevMessages) => {
          const newMessages = prevMessages.slice(0, -1);
          return [...newMessages, friendlyMessage];
        });
      } catch (e) {
        console.error('Recipe parsing error:', e);
        const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
        
        toast.error("Failed to process recipe", {
          description: `The AI response couldn't be understood. Please try again. Error: ${errorMessage}`
        });

        const errorMessageForChat = {
          ...message,
          content: `I apologize, but I had trouble formatting that recipe properly. Let's try again! Could you tell me what kind of recipe you'd like to create?`,
        };
        setMessages((prevMessages) => {
          const newMessages = prevMessages.slice(0, -1);
          return [...newMessages, errorMessageForChat];
        });

        setLatestRecipe(null);
        setShowSaveButton(false);
      }
    },
  })

  const handleSaveRecipe = async () => {
    if (!latestRecipe || !user) return

    setIsSaving(true)
    try {
      await addRecipeToSupabase(latestRecipe, user.id, messages)

      setShowSaveButton(false)
      setLatestRecipe(null)
      setMessages([
        ...messages,
        {
          id: Date.now().toString(),
          role: "assistant",
          content: `✅ Perfect! I've saved "${latestRecipe.title}" to your recipe collection. You can now access it anytime from your recipe library and get cooking assistance when you're ready to make it!`,
        },
      ])

      // Clear chat after successful save
      setTimeout(() => {
        setMessages([])
      }, 3000)

      toast.success("Recipe saved successfully!")
    } catch (error) {
      toast.error("Failed to save recipe. Please try again.")
    } finally {
      setIsSaving(false)
    }
  }

  const handleQuickStart = async () => {
    const quickStartMessage = "I want to make something delicious for dinner tonight. I'm open to suggestions!"
    await append({ role: "user", content: quickStartMessage })
  }

  // Auto-scroll to the bottom of the chat
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: "smooth",
      })
    }
  }, [messages])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      formRef.current?.requestSubmit()
    }
  }

  // If no user is logged in, show login prompt
  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center h-[85vh] max-w-4xl mx-auto border rounded-lg shadow-lg bg-background p-6">
        <h2 className="text-2xl font-bold mb-4">Please Log In</h2>
        <p className="text-muted-foreground">You need to be logged in to use the SousAI Recipe Creator.</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-[85vh] max-w-4xl mx-auto border rounded-lg shadow-lg bg-background">
      {/* Header */}
      <div className="p-6 border-b bg-gradient-to-r from-primary/5 to-secondary/5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <ChefHat className="h-6 w-6 text-primary" />
              SousAI Recipe Creator
            </h2>
            <p className="text-muted-foreground mt-1">
              Chat with your AI sous-chef to create personalized recipes
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="flex items-center gap-1">
              <Sparkles className="h-3 w-3" />
              AI Powered
            </Badge>
          </div>
        </div>
      </div>

      {/* Quick Start Section */}
      {messages.length === 0 && (
        <div className="p-6 border-b">
          <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-900">
                <Sparkles className="h-5 w-5" />
                Ready to Create Something Delicious?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-blue-800 mb-4">
                Tell me what you're in the mood for, what ingredients you have, or let me suggest something amazing!
              </p>
              <div className="flex flex-wrap gap-2">
                <Button onClick={handleQuickStart} variant="default" size="sm">
                  <ChefHat className="h-4 w-4 mr-2" />
                  Quick Start
                </Button>
                <Button variant="outline" size="sm" onClick={() => append({ role: "user", content: "I have chicken, rice, and vegetables. What can I make?" })}>
                  Use My Ingredients
                </Button>
                <Button variant="outline" size="sm" onClick={() => append({ role: "user", content: "I want something healthy and quick for lunch" })}>
                  Healthy & Quick
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="flex-1 flex min-h-0">
        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          <ScrollArea className="flex-1" ref={scrollAreaRef as any}>
            <div className="p-6 space-y-4">
              {messages.map((m, i) => (
                <Card
                  key={i}
                  className={`${
                    m.role === "user" 
                      ? "bg-primary/5 border-primary/20 ml-8" 
                      : "bg-muted/50 border-muted mr-8"
                  }`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge
                        variant={m.role === "user" ? "default" : "secondary"}
                        className="text-xs"
                      >
                        {m.role === "user" ? "You" : "SousAI"}
                      </Badge>
                      {m.role === "assistant" && (
                        <ChefHat className="h-3 w-3 text-muted-foreground" />
                      )}
                    </div>
                    <p className="whitespace-pre-wrap text-sm">{m.content}</p>
                  </CardContent>
                </Card>
              ))}
              
              {latestRecipe && (
                <div className="space-y-4">
                  <Separator />
                  <div className="text-center">
                    <Badge variant="outline" className="mb-2">
                      <Sparkles className="h-3 w-3 mr-1" />
                      Recipe Generated!
                    </Badge>
                  </div>
                  <RecipeCard recipe={latestRecipe} />
                  {showSaveButton && (
                    <div className="flex justify-center">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button 
                              onClick={handleSaveRecipe}
                              disabled={isSaving}
                              className="flex items-center gap-2"
                              size="lg"
                            >
                              {isSaving ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <Save className="h-4 w-4" />
                              )}
                              {isSaving ? "Saving..." : "Save to My Recipes"}
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Save this recipe to your collection for later</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  )}
                </div>
              )}
              
              {isLoading && (
                <Card className="bg-muted/50 border-muted mr-8">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span className="text-sm">SousAI is thinking...</span>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </ScrollArea>

          {/* Input Area */}
          <div className="p-6 border-t bg-background">
            <form onSubmit={handleSubmit} ref={formRef} className="flex gap-3">
              <Textarea
                value={input}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                placeholder="Tell me what you want to cook, what ingredients you have, or ask for suggestions..."
                className="flex-1 min-h-[60px] resize-none"
                disabled={isLoading}
              />
              <Button
                type="submit"
                disabled={!input.trim() || isLoading}
                size="icon"
                className="h-[60px] w-[60px]"
              >
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
} 
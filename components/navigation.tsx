"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/use-supabase"
import { User, LogOut } from "lucide-react"

export function Navigation() {
  const { user, signOut } = useAuth()

  const handleSignOut = async () => {
    try {
      await signOut()
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <Link href="/" className="text-xl font-bold">
              FoodApp
            </Link>
            <div className="hidden md:flex items-center space-x-4">
              <Link href="/" className="text-sm font-medium hover:text-primary">
                Home
              </Link>
              <Link href="/wse" className="text-sm font-medium hover:text-primary">
                What Should I Eat
              </Link>
              <Link href="/mealprep" className="text-sm font-medium hover:text-primary">
                Meal Prep
              </Link>
              <Link href="/food" className="text-sm font-medium hover:text-primary">
                Food
              </Link>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {user ? (
              <>
                <Link href="/profile">
                  <Button variant="ghost" size="sm">
                    <User className="h-4 w-4 mr-2" />
                    Profile
                  </Button>
                </Link>
                <Button variant="ghost" size="sm" onClick={handleSignOut}>
                  <LogOut className="h-4 w-4" />
                </Button>
              </>
            ) : (
              <Link href="/profile">
                <Button size="sm">
                  Sign In
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
} 
"use client"

import { useAuth } from "@/hooks/use-supabase"
import { AuthForm } from "@/components/auth-form"
import { UserProfile } from "@/components/user-profile"

export default function ProfilePage() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6 text-center">
          <h1 className="text-4xl font-bold tracking-tight">Welcome to FoodApp</h1>
          <p className="text-muted-foreground mt-2">
            Sign in to access your personalized nutrition tracking and recipes.
          </p>
        </div>
        <AuthForm />
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-4xl font-bold tracking-tight">Profile</h1>
        <p className="text-muted-foreground mt-2">
          Manage your account and nutrition preferences.
        </p>
      </div>
      <UserProfile />
    </div>
  )
} 
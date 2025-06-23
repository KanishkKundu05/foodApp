"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { useAuth } from "@/hooks/use-supabase"
import { useProfile, useNutritionGoals, useUserPreferences } from "@/hooks/use-supabase"
import { toast } from "sonner"

export function UserProfile() {
  const { user, signOut } = useAuth()
  const { profile, updateProfile } = useProfile(user?.id)
  const { goals, updateGoals } = useNutritionGoals(user?.id)
  const { preferences, updatePreferences } = useUserPreferences(user?.id)

  const [isEditing, setIsEditing] = useState(false)
  const [fullName, setFullName] = useState(profile?.full_name || "")
  const [proteinTarget, setProteinTarget] = useState(goals?.protein_target || 150)
  const [carbsTarget, setCarbsTarget] = useState(goals?.carbs_target || 200)
  const [fatsTarget, setFatsTarget] = useState(goals?.fats_target || 60)

  const handleSaveProfile = async () => {
    try {
      await updateProfile({ full_name: fullName })
      toast.success("Profile updated successfully!")
      setIsEditing(false)
    } catch (error) {
      toast.error("Failed to update profile")
    }
  }

  const handleSaveGoals = async () => {
    try {
      await updateGoals({
        protein_target: proteinTarget,
        carbs_target: carbsTarget,
        fats_target: fatsTarget,
      })
      toast.success("Nutrition goals updated successfully!")
    } catch (error) {
      toast.error("Failed to update nutrition goals")
    }
  }

  const handleSignOut = async () => {
    try {
      await signOut()
      toast.success("Signed out successfully!")
    } catch (error) {
      toast.error("Failed to sign out")
    }
  }

  const totalCalories = proteinTarget * 4 + carbsTarget * 4 + fatsTarget * 9

  return (
    <div className="space-y-6">
      {/* Profile Information */}
      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
          <CardDescription>
            Update your personal information
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={profile?.email || ""}
              disabled
              className="bg-muted"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name</Label>
            <Input
              id="fullName"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              disabled={!isEditing}
            />
          </div>
          
          <div className="flex gap-2">
            {isEditing ? (
              <>
                <Button onClick={handleSaveProfile}>Save</Button>
                <Button variant="outline" onClick={() => {
                  setIsEditing(false)
                  setFullName(profile?.full_name || "")
                }}>
                  Cancel
                </Button>
              </>
            ) : (
              <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Nutrition Goals */}
      <Card>
        <CardHeader>
          <CardTitle>Nutrition Goals</CardTitle>
          <CardDescription>
            Set your daily macro targets
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center p-4 bg-muted rounded-lg">
            <div className="text-2xl font-bold">{totalCalories} kcal</div>
            <div className="text-sm text-muted-foreground">Daily Target</div>
          </div>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label>Protein: {proteinTarget}g</Label>
                <span className="text-sm text-muted-foreground">{proteinTarget * 4} kcal</span>
              </div>
              <Slider
                value={[proteinTarget]}
                onValueChange={(value) => setProteinTarget(value[0])}
                max={300}
                min={50}
                step={5}
                className="w-full"
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label>Carbs: {carbsTarget}g</Label>
                <span className="text-sm text-muted-foreground">{carbsTarget * 4} kcal</span>
              </div>
              <Slider
                value={[carbsTarget]}
                onValueChange={(value) => setCarbsTarget(value[0])}
                max={500}
                min={50}
                step={10}
                className="w-full"
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label>Fats: {fatsTarget}g</Label>
                <span className="text-sm text-muted-foreground">{fatsTarget * 9} kcal</span>
              </div>
              <Slider
                value={[fatsTarget]}
                onValueChange={(value) => setFatsTarget(value[0])}
                max={150}
                min={20}
                step={5}
                className="w-full"
              />
            </div>
          </div>
          
          <Button onClick={handleSaveGoals} className="w-full">
            Save Nutrition Goals
          </Button>
        </CardContent>
      </Card>

      {/* Account Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Account</CardTitle>
        </CardHeader>
        <CardContent>
          <Button variant="destructive" onClick={handleSignOut} className="w-full">
            Sign Out
          </Button>
        </CardContent>
      </Card>
    </div>
  )
} 
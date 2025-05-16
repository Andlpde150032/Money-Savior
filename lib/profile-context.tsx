"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { useExpense, type Transaction, type Category } from "@/lib/expense-context"
import { useToast } from "@/components/ui/use-toast"
import { useLanguage } from "@/lib/language-context"

export interface Profile {
  id: string
  name: string
  createdAt: Date
}

interface ProfileData {
  profile: Profile
  transactions: Transaction[]
  categories: Category[]
}

interface ProfileContextType {
  profiles: Profile[]
  currentProfile: Profile
  createProfile: (name: string) => void
  switchProfile: (profileId: string) => void
  deleteProfile: (profileId: string) => void
  exportProfile: () => Promise<void>
  importProfile: () => Promise<void>
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined)

const DEFAULT_PROFILE: Profile = {
  id: "default",
  name: "Default Profile",
  createdAt: new Date(),
}

const defaultCategories: Category[] = [
  {
    id: "food",
    name: "Ăn uống",
    type: "expense",
    icon: "utensils",
    color: "#ef4444",
  },
  {
    id: "transport",
    name: "Di chuyển",
    type: "expense",
    icon: "bus",
    color: "#f97316",
  },
  {
    id: "shopping",
    name: "Mua sắm",
    type: "expense",
    icon: "shopping-bag",
    color: "#8b5cf6",
  },
  {
    id: "entertainment",
    name: "Giải trí",
    type: "expense",
    icon: "coffee",
    color: "#ec4899",
  },
  {
    id: "utilities",
    name: "Hóa đơn",
    type: "expense",
    icon: "lightbulb",
    color: "#14b8a6",
  },
  {
    id: "health",
    name: "Sức khỏe",
    type: "expense",
    icon: "pill",
    color: "#22c55e",
  },
  {
    id: "salary",
    name: "Lương",
    type: "income",
    icon: "banknote",
    color: "#10b981",
  },
  {
    id: "bonus",
    name: "Thưởng",
    type: "income",
    icon: "gift",
    color: "#6366f1",
  },
  {
    id: "investment",
    name: "Đầu tư",
    type: "income",
    icon: "landmark",
    color: "#0ea5e9",
  },
]

export function ProfileProvider({ children }: { children: React.ReactNode }) {
  const { t } = useLanguage()
  const { toast } = useToast()
  const { transactions, categories, setTransactions, setCategories } = useExpense()

  const [profiles, setProfiles] = useState<Profile[]>([DEFAULT_PROFILE])
  const [currentProfile, setCurrentProfile] = useState<Profile>(DEFAULT_PROFILE)
  const [mounted, setMounted] = useState(false)

  // Load profiles from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const savedProfiles = localStorage.getItem("profiles")
        const currentProfileId = localStorage.getItem("currentProfileId")

        if (savedProfiles) {
          const parsedProfiles = JSON.parse(savedProfiles).map((p: any) => ({
            ...p,
            createdAt: new Date(p.createdAt),
          }));

          setProfiles(parsedProfiles);

          // Set the current profile from the parsed profiles directly
          if (currentProfileId) {
            const profile = parsedProfiles.find((p: any) => p.id === currentProfileId);
            if (profile) {
              setCurrentProfile(profile);
            }
          }
        }

        setMounted(true);
      } catch (error) {
        console.error("Error loading profiles from localStorage:", error)
      }
    }
  }, [])

  // Save profiles to localStorage when they change
  useEffect(() => {
    if (mounted && typeof window !== "undefined") {
      try {
        localStorage.setItem("profiles", JSON.stringify(profiles))
        localStorage.setItem("currentProfileId", currentProfile.id)
      } catch (error) {
        console.error("Error saving profiles to localStorage:", error)
      }
    }
  }, [profiles, currentProfile, mounted])

  // Create a new profile
  const createProfile = (name: string) => {
    // Save current data before creating new profile
    saveCurrentProfileData()

    const newProfile: Profile = {
      id: crypto.randomUUID(),
      name,
      createdAt: new Date(),
    }

    setProfiles((prev) => [...prev, newProfile])
    setCurrentProfile(newProfile)

    // Initialize new profile with default categories but empty transactions
    setTransactions([])
    setCategories([...defaultCategories])
  }

  // Switch to another profile
  const switchProfile = async (profileId: string) => {
    // Save current data before switching
    saveCurrentProfileData()

    const profile = profiles.find((p) => p.id === profileId)
    if (!profile) return

    setCurrentProfile(profile)

    // Load data for the selected profile
    loadProfileData(profileId)
  }

  // Delete a profile
  const deleteProfile = (profileId: string) => {
    if (profiles.length <= 1) {
      toast({
        variant: "destructive",
        title: t("errorOccurred"),
        description: t("cannotDeleteLastProfile"),
      })
      return
    }

    // If deleting current profile, switch to another one first
    if (profileId === currentProfile.id) {
      const otherProfile = profiles.find((p) => p.id !== profileId)
      if (otherProfile) {
        switchProfile(otherProfile.id)
      }
    }

    setProfiles((prev) => prev.filter((p) => p.id !== profileId))

    // Remove profile data from localStorage
    if (typeof window !== "undefined") {
      localStorage.removeItem(`profile_${profileId}`)
    }
  }

  // Save current profile data to localStorage
  const saveCurrentProfileData = () => {
    if (typeof window !== "undefined" && mounted) {
      try {
        const profileData: ProfileData = {
          profile: currentProfile,
          transactions,
          categories,
        }
        localStorage.setItem(`profile_${currentProfile.id}`, JSON.stringify(profileData))
      } catch (error) {
        console.error("Error saving profile data:", error)
      }
    }
  }

  // Load profile data from localStorage
  const loadProfileData = (profileId: string) => {
    if (typeof window !== "undefined") {
      try {
        const savedData = localStorage.getItem(`profile_${profileId}`)

        if (savedData) {
          const parsedData: ProfileData = JSON.parse(savedData)

          // Convert string dates back to Date objects
          setTransactions(
            parsedData.transactions.map((t: any) => ({
              ...t,
              date: new Date(t.date),
              createdAt: new Date(t.createdAt),
            })),
          )

          setCategories(parsedData.categories)
        } else {
          // No saved data for this profile, start with empty transactions but default categories
          setTransactions([])
          setCategories([...defaultCategories])
        }
      } catch (error) {
        console.error("Error loading profile data:", error)
        // In case of error, initialize with defaults
        setTransactions([])
        setCategories([...defaultCategories])
      }
    }
  }

  // Export current profile data to a file
  const exportProfile = async () => {
    try {
      // Save current data before exporting
      saveCurrentProfileData()

      const profileData: ProfileData = {
        profile: currentProfile,
        transactions,
        categories,
      }

      const blob = new Blob([JSON.stringify(profileData, null, 2)], { type: "application/json" })
      const url = URL.createObjectURL(blob)

      const a = document.createElement("a")
      a.href = url
      a.download = `money-savior-${currentProfile.name.toLowerCase().replace(/\s+/g, "-")}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error("Error exporting profile:", error)
      throw error
    }
  }

  // Import profile data from a file
  const importProfile = async () => {
    try {
      return new Promise<void>((resolve, reject) => {
        const input = document.createElement("input")
        input.type = "file"
        input.accept = "application/json"

        input.onchange = async (e) => {
          const file = (e.target as HTMLInputElement).files?.[0]
          if (!file) {
            reject(new Error("No file selected"))
            return
          }

          try {
            const text = await file.text()
            const importedData: ProfileData = JSON.parse(text)

            // Check if it's a valid profile data
            if (!importedData.profile || !importedData.transactions || !importedData.categories) {
              reject(new Error("Invalid profile data"))
              return
            }

            // Check if profile with same ID already exists
            const existingProfile = profiles.find((p) => p.id === importedData.profile.id)

            if (existingProfile) {
              // Update existing profile
              setProfiles((prev) => prev.map((p) => (p.id === importedData.profile.id ? importedData.profile : p)))
            } else {
              // Add as new profile
              setProfiles((prev) => [...prev, importedData.profile])
            }

            // Switch to the imported profile
            setCurrentProfile(importedData.profile)

            // Set the imported data
            setTransactions(
              importedData.transactions.map((t: any) => ({
                ...t,
                date: new Date(t.date),
                createdAt: new Date(t.createdAt),
              })),
            )
            setCategories(importedData.categories)

            // Save the imported data
            localStorage.setItem(`profile_${importedData.profile.id}`, text)

            resolve()
          } catch (error) {
            console.error("Error parsing imported file:", error)
            reject(error)
          }
        }

        input.click()
      })
    } catch (error) {
      console.error("Error importing profile:", error)
      throw error
    }
  }

  return (
    <ProfileContext.Provider
      value={{
        profiles,
        currentProfile,
        createProfile,
        switchProfile,
        deleteProfile,
        exportProfile,
        importProfile,
      }}
    >
      {children}
    </ProfileContext.Provider>
  )
}

export function useProfile() {
  const context = useContext(ProfileContext)
  if (context === undefined) {
    throw new Error("useProfile must be used within a ProfileProvider")
  }
  return context
}

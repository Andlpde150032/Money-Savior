"use client"

import type * as React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { en } from "@/translations/en"
import { vi } from "@/translations/vi"

type Language = "en" | "vi"

type Translations = typeof en

interface LanguageContextType {
  language: Language
  setLanguage: (language: Language) => void
  t: (key: keyof typeof en) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

async function getCountryCode(): Promise<string> {
  try {
    const response = await fetch('https://ipapi.co/json/')
    const data = await response.json()
    return data.country_code
  } catch (error) {
    console.error('Error fetching location:', error)
    return 'US' // Default to US if location detection fails
  }
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>("en")
  const [translations, setTranslations] = useState<Translations>(en)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    // Only access localStorage on the client side
    if (typeof window !== "undefined") {
      const savedLanguage = localStorage.getItem("language") as Language
      if (savedLanguage && (savedLanguage === "en" || savedLanguage === "vi")) {
        setLanguage(savedLanguage)
      } else {
        // If no saved language, detect based on location
        getCountryCode().then((countryCode) => {
          if (countryCode === 'VN') {
            setLanguage('vi')
          } else {
            setLanguage('en')
          }
        })
      }
      setMounted(true)
    }
  }, [])

  useEffect(() => {
    // Update translations when language changes
    setTranslations(language === "en" ? en : vi)

    // Only access localStorage on the client side
    if (typeof window !== "undefined" && mounted) {
      localStorage.setItem("language", language)
    }
  }, [language, mounted])

  const t = (key: keyof typeof en): string => {
    return translations[key] || key
  }

  return <LanguageContext.Provider value={{ language, setLanguage, t }}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}

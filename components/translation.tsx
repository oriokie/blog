"use client"

import { useState } from "react"
import { Globe } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface TranslationProps {
  content: string
  originalLanguage?: string
}

const languages = [
  { code: "en", name: "English" },
  { code: "es", name: "Spanish" },
  { code: "fr", name: "French" },
  { code: "de", name: "German" },
  { code: "zh", name: "Chinese" },
  { code: "ja", name: "Japanese" },
  { code: "ko", name: "Korean" },
  { code: "ar", name: "Arabic" },
  { code: "ru", name: "Russian" },
]

export function Translation({ content, originalLanguage = "en" }: TranslationProps) {
  const [translatedContent, setTranslatedContent] = useState(content)
  const [currentLanguage, setCurrentLanguage] = useState(originalLanguage)
  const [isTranslating, setIsTranslating] = useState(false)

  const translateContent = async (targetLanguage: string) => {
    if (targetLanguage === currentLanguage) return

    setIsTranslating(true)

    try {
      // In a real implementation, this would call a translation API
      // For demo purposes, we'll simulate a translation process
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Simulate translated content
      const translated = `[Translated to ${languages.find((l) => l.code === targetLanguage)?.name}] ${content}`
      setTranslatedContent(translated)
      setCurrentLanguage(targetLanguage)
    } catch (error) {
      console.error("Error translating content:", error)
    } finally {
      setIsTranslating(false)
    }
  }

  return (
    <div>
      <div className="flex items-center justify-end mb-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="flex items-center space-x-2">
              {isTranslating ? (
                <div className="h-4 w-4 border-2 border-gray-300 border-t-gray-900 rounded-full animate-spin mr-2"></div>
              ) : (
                <Globe className="h-4 w-4 mr-2" />
              )}
              <span>
                {isTranslating ? "Translating..." : `${languages.find((l) => l.code === currentLanguage)?.name}`}
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {languages.map((language) => (
              <DropdownMenuItem
                key={language.code}
                onClick={() => translateContent(language.code)}
                disabled={isTranslating || language.code === currentLanguage}
              >
                {language.name}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div dangerouslySetInnerHTML={{ __html: translatedContent }} />
    </div>
  )
}

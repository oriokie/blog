"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { settingsAPI } from "@/lib/api"

export default function ExitPopupSettingsPage() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [settings, setSettings] = useState({
    enabled: true,
    title: "Before You Go!",
    description: "Subscribe to our newsletter to get the latest updates and exclusive content.",
    ctaText: "Subscribe Now",
    ctaUrl: "#",
    newsletterEnabled: true,
  })

  useEffect(() => {
    const fetchSettings = async () => {
      setIsLoading(true)
      try {
        const { data } = await settingsAPI.getSiteSettings()
        if (data && data.exitPopup) {
          setSettings(data.exitPopup)
        }
      } catch (error) {
        console.error("Error fetching exit popup settings:", error)
        toast({
          title: "Error",
          description: "Failed to load exit popup settings.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchSettings()
  }, [toast])

  const handleChange = (field, value) => {
    setSettings((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const saveSettings = async () => {
    setIsSaving(true)
    try {
      await settingsAPI.updateSiteSettings({
        exitPopup: settings,
      })

      toast({
        title: "Settings saved",
        description: "Exit popup settings have been updated successfully.",
      })
    } catch (error) {
      console.error("Error saving exit popup settings:", error)
      toast({
        title: "Error",
        description: "Failed to save exit popup settings.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Exit Popup Settings</h1>
        </div>
        <div className="h-96 flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-gray-300 dark:border-gray-700 border-t-gray-900 dark:border-t-white rounded-full animate-spin"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Exit Popup Settings</h1>
        <Button onClick={saveSettings} disabled={isSaving}>
          {isSaving ? "Saving..." : "Save Settings"}
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Exit Intent Popup</CardTitle>
          <CardDescription>Configure the popup that appears when users are about to leave your site</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center space-x-2">
            <Switch
              id="popup-enabled"
              checked={settings.enabled}
              onCheckedChange={(checked) => handleChange("enabled", checked)}
            />
            <Label htmlFor="popup-enabled">Enable Exit Intent Popup</Label>
          </div>

          <div className="space-y-2">
            <Label htmlFor="popup-title">Popup Title</Label>
            <Input
              id="popup-title"
              value={settings.title}
              onChange={(e) => handleChange("title", e.target.value)}
              placeholder="Enter popup title"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="popup-description">Popup Description</Label>
            <Textarea
              id="popup-description"
              value={settings.description}
              onChange={(e) => handleChange("description", e.target.value)}
              placeholder="Enter popup description"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="cta-text">Call to Action Text</Label>
            <Input
              id="cta-text"
              value={settings.ctaText}
              onChange={(e) => handleChange("ctaText", e.target.value)}
              placeholder="Enter CTA text"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="newsletter-enabled"
              checked={settings.newsletterEnabled}
              onCheckedChange={(checked) => handleChange("newsletterEnabled", checked)}
            />
            <Label htmlFor="newsletter-enabled">Include Newsletter Signup Form</Label>
          </div>

          {!settings.newsletterEnabled && (
            <div className="space-y-2">
              <Label htmlFor="cta-url">CTA Button URL</Label>
              <Input
                id="cta-url"
                value={settings.ctaUrl}
                onChange={(e) => handleChange("ctaUrl", e.target.value)}
                placeholder="Enter URL for CTA button"
              />
              <p className="text-sm text-gray-500">
                This URL is used when the newsletter form is disabled. The button will link to this URL.
              </p>
            </div>
          )}

          <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
            <h3 className="font-medium mb-2">Preview</h3>
            <div className="border border-gray-200 dark:border-gray-800 rounded-lg p-4">
              <h4 className="text-lg font-bold">{settings.title}</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">{settings.description}</p>
              <div className="mt-4">
                {settings.newsletterEnabled ? (
                  <div className="space-y-2">
                    <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded w-full"></div>
                    <Button className="w-full" disabled>
                      {settings.ctaText}
                    </Button>
                  </div>
                ) : (
                  <Button className="w-full" disabled>
                    {settings.ctaText}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

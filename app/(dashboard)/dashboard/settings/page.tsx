"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/components/ui/use-toast"
import { api } from "@/lib/api"

export default function SettingsPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [settings, setSettings] = useState({
    siteName: "My Blog",
    siteDescription: "A modern blog platform",
    siteUrl: "https://myblog.com",
    logoUrl: "/logo.png",
    faviconUrl: "/favicon.ico",
    postsPerPage: 10,
    allowComments: true,
    requireCommentApproval: true,
    allowRegistration: true,
    googleAnalyticsId: "",
    facebookPixelId: "",
    customCss: "",
    customJs: "",
    footerText: "© 2023 My Blog. All rights reserved.",
    socialLinks: {
      twitter: "https://twitter.com/myblog",
      facebook: "https://facebook.com/myblog",
      instagram: "https://instagram.com/myblog",
      linkedin: "https://linkedin.com/company/myblog",
    },
    paypalEnabled: false,
    paypalClientId: "",
    paypalSecret: "",
    paypalSandbox: true,
    mpesaEnabled: false,
    mpesaConsumerKey: "",
    mpesaConsumerSecret: "",
    mpesaPasskey: "",
    mpesaSandbox: true,
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setSettings((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSwitchChange = (name) => (checked) => {
    setSettings((prev) => ({
      ...prev,
      [name]: checked,
    }))
  }

  const handleSocialChange = (platform) => (e) => {
    const { value } = e.target
    setSettings((prev) => ({
      ...prev,
      socialLinks: {
        ...prev.socialLinks,
        [platform]: value,
      },
    }))
  }

  const saveSettings = async () => {
    setIsLoading(true)
    try {
      await api.put("/settings", settings)
      toast({
        title: "Settings saved",
        description: "Your site settings have been updated successfully.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save settings. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Site Settings</h1>
        <Button onClick={saveSettings} disabled={isLoading}>
          {isLoading ? "Saving..." : "Save Settings"}
        </Button>
      </div>

      <Tabs defaultValue="general">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
          <TabsTrigger value="advanced">Advanced</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Site Information</CardTitle>
              <CardDescription>Basic information about your site</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="siteName">Site Name</Label>
                  <Input id="siteName" name="siteName" value={settings.siteName} onChange={handleChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="siteUrl">Site URL</Label>
                  <Input id="siteUrl" name="siteUrl" value={settings.siteUrl} onChange={handleChange} />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="siteDescription">Site Description</Label>
                <Textarea
                  id="siteDescription"
                  name="siteDescription"
                  value={settings.siteDescription}
                  onChange={handleChange}
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Content Settings</CardTitle>
              <CardDescription>Configure how content is displayed on your site</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="postsPerPage">Posts Per Page</Label>
                <Input
                  id="postsPerPage"
                  name="postsPerPage"
                  type="number"
                  value={settings.postsPerPage}
                  onChange={handleChange}
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="allowComments"
                  checked={settings.allowComments}
                  onCheckedChange={handleSwitchChange("allowComments")}
                />
                <Label htmlFor="allowComments">Allow Comments</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="requireCommentApproval"
                  checked={settings.requireCommentApproval}
                  onCheckedChange={handleSwitchChange("requireCommentApproval")}
                />
                <Label htmlFor="requireCommentApproval">Require Comment Approval</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="allowRegistration"
                  checked={settings.allowRegistration}
                  onCheckedChange={handleSwitchChange("allowRegistration")}
                />
                <Label htmlFor="allowRegistration">Allow User Registration</Label>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appearance" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Branding</CardTitle>
              <CardDescription>Customize your site's visual identity</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="logoUrl">Logo URL</Label>
                  <Input id="logoUrl" name="logoUrl" value={settings.logoUrl} onChange={handleChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="faviconUrl">Favicon URL</Label>
                  <Input id="faviconUrl" name="faviconUrl" value={settings.faviconUrl} onChange={handleChange} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Footer</CardTitle>
              <CardDescription>Customize your site's footer</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="footerText">Footer Text</Label>
                <Input id="footerText" name="footerText" value={settings.footerText} onChange={handleChange} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Social Media</CardTitle>
              <CardDescription>Connect your social media accounts</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="twitter">Twitter</Label>
                  <Input id="twitter" value={settings.socialLinks.twitter} onChange={handleSocialChange("twitter")} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="facebook">Facebook</Label>
                  <Input
                    id="facebook"
                    value={settings.socialLinks.facebook}
                    onChange={handleSocialChange("facebook")}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="instagram">Instagram</Label>
                  <Input
                    id="instagram"
                    value={settings.socialLinks.instagram}
                    onChange={handleSocialChange("instagram")}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="linkedin">LinkedIn</Label>
                  <Input
                    id="linkedin"
                    value={settings.socialLinks.linkedin}
                    onChange={handleSocialChange("linkedin")}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="integrations" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Analytics</CardTitle>
              <CardDescription>Connect analytics services to track site performance</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="googleAnalyticsId">Google Analytics ID</Label>
                <Input
                  id="googleAnalyticsId"
                  name="googleAnalyticsId"
                  value={settings.googleAnalyticsId}
                  onChange={handleChange}
                  placeholder="UA-XXXXXXXXX-X or G-XXXXXXXXXX"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="facebookPixelId">Facebook Pixel ID</Label>
                <Input
                  id="facebookPixelId"
                  name="facebookPixelId"
                  value={settings.facebookPixelId}
                  onChange={handleChange}
                  placeholder="XXXXXXXXXXXXXXXXXX"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Payment Integrations</CardTitle>
              <CardDescription>Configure payment gateways for your site</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">PayPal</h3>
                    <p className="text-sm text-muted-foreground">Enable PayPal payments for your site</p>
                  </div>
                  <Switch
                    id="paypal-enabled"
                    checked={settings.paypalEnabled}
                    onCheckedChange={handleSwitchChange("paypalEnabled")}
                  />
                </div>
                {settings.paypalEnabled && (
                  <div className="space-y-4 pl-4 border-l-2 border-muted">
                    <div className="space-y-2">
                      <Label htmlFor="paypalClientId">PayPal Client ID</Label>
                      <Input
                        id="paypalClientId"
                        name="paypalClientId"
                        value={settings.paypalClientId}
                        onChange={handleChange}
                        placeholder="Enter your PayPal Client ID"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="paypalSecret">PayPal Secret</Label>
                      <Input
                        id="paypalSecret"
                        name="paypalSecret"
                        type="password"
                        value={settings.paypalSecret}
                        onChange={handleChange}
                        placeholder="Enter your PayPal Secret"
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="paypalSandbox"
                        checked={settings.paypalSandbox}
                        onCheckedChange={handleSwitchChange("paypalSandbox")}
                      />
                      <Label htmlFor="paypalSandbox">Use Sandbox Mode</Label>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">M-Pesa</h3>
                    <p className="text-sm text-muted-foreground">Enable M-Pesa mobile payments</p>
                  </div>
                  <Switch
                    id="mpesa-enabled"
                    checked={settings.mpesaEnabled}
                    onCheckedChange={handleSwitchChange("mpesaEnabled")}
                  />
                </div>
                {settings.mpesaEnabled && (
                  <div className="space-y-4 pl-4 border-l-2 border-muted">
                    <div className="space-y-2">
                      <Label htmlFor="mpesaConsumerKey">Consumer Key</Label>
                      <Input
                        id="mpesaConsumerKey"
                        name="mpesaConsumerKey"
                        value={settings.mpesaConsumerKey}
                        onChange={handleChange}
                        placeholder="Enter your M-Pesa Consumer Key"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="mpesaConsumerSecret">Consumer Secret</Label>
                      <Input
                        id="mpesaConsumerSecret"
                        name="mpesaConsumerSecret"
                        type="password"
                        value={settings.mpesaConsumerSecret}
                        onChange={handleChange}
                        placeholder="Enter your M-Pesa Consumer Secret"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="mpesaPasskey">Passkey</Label>
                      <Input
                        id="mpesaPasskey"
                        name="mpesaPasskey"
                        type="password"
                        value={settings.mpesaPasskey}
                        onChange={handleChange}
                        placeholder="Enter your M-Pesa Passkey"
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="mpesaSandbox"
                        checked={settings.mpesaSandbox}
                        onCheckedChange={handleSwitchChange("mpesaSandbox")}
                      />
                      <Label htmlFor="mpesaSandbox">Use Sandbox Mode</Label>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="advanced" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Custom Code</CardTitle>
              <CardDescription>Add custom CSS and JavaScript to your site</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="customCss">Custom CSS</Label>
                <Textarea
                  id="customCss"
                  name="customCss"
                  value={settings.customCss}
                  onChange={handleChange}
                  rows={5}
                  className="font-mono"
                  placeholder="/* Add your custom CSS here */"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="customJs">Custom JavaScript</Label>
                <Textarea
                  id="customJs"
                  name="customJs"
                  value={settings.customJs}
                  onChange={handleChange}
                  rows={5}
                  className="font-mono"
                  placeholder="// Add your custom JavaScript here"
                />
              </div>
            </CardContent>
            <CardFooter>
              <p className="text-sm text-muted-foreground">Custom code is executed on every page. Use with caution.</p>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

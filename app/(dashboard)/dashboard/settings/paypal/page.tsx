"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/hooks/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertCircle, CheckCircle2 } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function PayPalSettingsPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isTestMode, setIsTestMode] = useState(true)
  const [isConnected, setIsConnected] = useState(false)
  const [testStatus, setTestStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const { toast } = useToast()

  // Form state
  const [formData, setFormData] = useState({
    clientId: "",
    clientSecret: "",
    sandboxClientId: "",
    sandboxClientSecret: "",
    webhookId: "",
    sandboxWebhookId: "",
  })

  useEffect(() => {
    // In a real app, this would fetch settings from the API
    // For demo purposes, we'll simulate loading
    const loadSettings = async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Mock data
        setFormData({
          clientId: "",
          clientSecret: "",
          sandboxClientId: "AZDxjDScFpQtjWTOUtWKbyN_bDt4OgqaF4eYXlewfBP4-8aqX3PiV8e1GWU6liB2CUXlkA59kJXE7M6R",
          sandboxClientSecret: "ECYRSKCWzKfDG6Vms8MKhJjdRysiU-qQH5R9BcFqvfQi5ZJdLSFSDRuR7UZ_BuIh5Y2Jj2uRV-8Y4XD9",
          webhookId: "",
          sandboxWebhookId: "5GP028458E5981853",
        })
        setIsTestMode(true)
        setIsConnected(true)
        setIsLoading(false)
      } catch (error) {
        console.error("Error loading PayPal settings:", error)
        toast({
          title: "Error",
          description: "Failed to load PayPal settings",
          variant: "destructive",
        })
        setIsLoading(false)
      }
    }

    loadSettings()
  }, [toast])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleTestModeToggle = (checked) => {
    setIsTestMode(checked)
  }

  const handleSaveSettings = async () => {
    setIsSaving(true)
    try {
      // In a real app, this would be an API call
      // For demo purposes, we'll simulate success
      await new Promise((resolve) => setTimeout(resolve, 1500))

      toast({
        title: "Settings saved",
        description: "Your PayPal settings have been updated successfully",
      })

      setIsConnected(true)
    } catch (error) {
      console.error("Error saving PayPal settings:", error)
      toast({
        title: "Error",
        description: "Failed to save PayPal settings",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleTestConnection = async () => {
    setTestStatus("loading")
    try {
      // In a real app, this would be an API call to test the connection
      // For demo purposes, we'll simulate success
      await new Promise((resolve) => setTimeout(resolve, 2000))

      setTestStatus("success")
      setTimeout(() => setTestStatus("idle"), 3000)
    } catch (error) {
      console.error("Error testing PayPal connection:", error)
      setTestStatus("error")
      setTimeout(() => setTestStatus("idle"), 3000)
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto py-6">
        <div className="flex justify-center p-8">
          <p>Loading PayPal settings...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">PayPal Settings</h1>
        <p className="text-gray-500 dark:text-gray-400">Configure your PayPal integration for accepting payments</p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Connection Status</CardTitle>
                <CardDescription>Your current PayPal integration status</CardDescription>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm">Test Mode</span>
                <Switch checked={isTestMode} onCheckedChange={handleTestModeToggle} />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4">
              {isConnected ? (
                <>
                  <div className="h-10 w-10 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                    <CheckCircle2 className="h-6 w-6 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <p className="font-medium">{isTestMode ? "Connected to PayPal Sandbox" : "Connected to PayPal"}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {isTestMode
                        ? "Your integration is set up in test mode. No real transactions will be processed."
                        : "Your integration is live and processing real transactions."}
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <div className="h-10 w-10 rounded-full bg-yellow-100 dark:bg-yellow-900 flex items-center justify-center">
                    <AlertCircle className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
                  </div>
                  <div>
                    <p className="font-medium">Not Connected</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Please configure your PayPal API credentials to enable payments.
                    </p>
                  </div>
                </>
              )}
            </div>
          </CardContent>
          <CardFooter>
            <Button
              variant="outline"
              onClick={handleTestConnection}
              disabled={testStatus === "loading" || !isConnected}
            >
              {testStatus === "loading"
                ? "Testing..."
                : testStatus === "success"
                  ? "Connection Successful"
                  : testStatus === "error"
                    ? "Connection Failed"
                    : "Test Connection"}
            </Button>
          </CardFooter>
        </Card>

        <Tabs defaultValue={isTestMode ? "sandbox" : "live"}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="sandbox">Sandbox (Test)</TabsTrigger>
            <TabsTrigger value="live">Live</TabsTrigger>
          </TabsList>

          <TabsContent value="sandbox" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Sandbox API Credentials</CardTitle>
                <CardDescription>
                  Use these credentials for testing. No real payments will be processed.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="sandboxClientId">Client ID</Label>
                  <Input
                    id="sandboxClientId"
                    name="sandboxClientId"
                    value={formData.sandboxClientId}
                    onChange={handleInputChange}
                    placeholder="Enter your PayPal Sandbox Client ID"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sandboxClientSecret">Client Secret</Label>
                  <Input
                    id="sandboxClientSecret"
                    name="sandboxClientSecret"
                    type="password"
                    value={formData.sandboxClientSecret}
                    onChange={handleInputChange}
                    placeholder="Enter your PayPal Sandbox Client Secret"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sandboxWebhookId">Webhook ID (Optional)</Label>
                  <Input
                    id="sandboxWebhookId"
                    name="sandboxWebhookId"
                    value={formData.sandboxWebhookId}
                    onChange={handleInputChange}
                    placeholder="Enter your PayPal Sandbox Webhook ID"
                  />
                </div>
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Sandbox Mode</AlertTitle>
                  <AlertDescription>
                    These credentials are for testing purposes only. You can find your sandbox credentials in the PayPal
                    Developer Dashboard.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="live" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Live API Credentials</CardTitle>
                <CardDescription>Use these credentials for processing real payments in production.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="clientId">Client ID</Label>
                  <Input
                    id="clientId"
                    name="clientId"
                    value={formData.clientId}
                    onChange={handleInputChange}
                    placeholder="Enter your PayPal Client ID"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="clientSecret">Client Secret</Label>
                  <Input
                    id="clientSecret"
                    name="clientSecret"
                    type="password"
                    value={formData.clientSecret}
                    onChange={handleInputChange}
                    placeholder="Enter your PayPal Client Secret"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="webhookId">Webhook ID (Optional)</Label>
                  <Input
                    id="webhookId"
                    name="webhookId"
                    value={formData.webhookId}
                    onChange={handleInputChange}
                    placeholder="Enter your PayPal Webhook ID"
                  />
                </div>
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Live Mode</AlertTitle>
                  <AlertDescription>
                    These credentials will process real payments. Make sure your integration is thoroughly tested before
                    enabling live mode.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <Button onClick={handleSaveSettings} disabled={isSaving} className="w-full">
          {isSaving ? "Saving..." : "Save Settings"}
        </Button>
      </div>
    </div>
  )
}

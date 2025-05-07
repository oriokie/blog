"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { mpesaAPI } from "@/lib/api"
import { Loader2 } from "lucide-react"

export default function MpesaSettingsPage() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [isFetching, setIsFetching] = useState(true)
  const [configExists, setConfigExists] = useState(false)

  const [mpesaConfig, setMpesaConfig] = useState({
    enabled: false,
    consumerKey: "",
    consumerSecret: "",
    passKey: "",
    shortCode: "",
    environment: "sandbox",
    callbackUrl: "",
    timeoutUrl: "",
    resultUrl: "",
  })

  useEffect(() => {
    const fetchMpesaConfig = async () => {
      try {
        setIsFetching(true)
        const response = await mpesaAPI.getConfig()

        if (response.data.exists) {
          setConfigExists(true)
          setMpesaConfig({
            ...mpesaConfig,
            enabled: response.data.enabled,
            environment: response.data.environment,
            shortCode: response.data.shortCode,
            callbackUrl: response.data.callbackUrl,
            timeoutUrl: response.data.timeoutUrl,
            resultUrl: response.data.resultUrl,
          })
        }
      } catch (error) {
        console.error("Error fetching M-Pesa config:", error)
        toast({
          title: "Error",
          description: "Failed to fetch M-Pesa configuration.",
          variant: "destructive",
        })
      } finally {
        setIsFetching(false)
      }
    }

    fetchMpesaConfig()
  }, [])

  const handleInputChange = (field: string, value: any) => {
    setMpesaConfig((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const saveSettings = async () => {
    try {
      setIsLoading(true)

      await mpesaAPI.updateConfig(mpesaConfig)

      toast({
        title: "Settings saved",
        description: "M-Pesa configuration has been updated successfully.",
      })

      setConfigExists(true)
    } catch (error) {
      console.error("Error saving M-Pesa config:", error)
      toast({
        title: "Error",
        description: "Failed to save M-Pesa configuration.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (isFetching) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">M-Pesa Settings</h1>
        <Button onClick={saveSettings} disabled={isLoading}>
          {isLoading ? "Saving..." : "Save Settings"}
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>M-Pesa Integration</CardTitle>
          <CardDescription>Configure M-Pesa STK Push for payments</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center space-x-2">
            <Switch
              id="mpesa-enabled"
              checked={mpesaConfig.enabled}
              onCheckedChange={(checked) => handleInputChange("enabled", checked)}
            />
            <Label htmlFor="mpesa-enabled">Enable M-Pesa Payments</Label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="consumer-key">Consumer Key</Label>
              <Input
                id="consumer-key"
                value={mpesaConfig.consumerKey}
                onChange={(e) => handleInputChange("consumerKey", e.target.value)}
                placeholder="Enter your M-Pesa consumer key"
              />
              <p className="text-xs text-gray-500">Get this from your Safaricom Developer Portal</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="consumer-secret">Consumer Secret</Label>
              <Input
                id="consumer-secret"
                type="password"
                value={mpesaConfig.consumerSecret}
                onChange={(e) => handleInputChange("consumerSecret", e.target.value)}
                placeholder="Enter your M-Pesa consumer secret"
              />
              <p className="text-xs text-gray-500">Get this from your Safaricom Developer Portal</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="pass-key">Pass Key</Label>
              <Input
                id="pass-key"
                type="password"
                value={mpesaConfig.passKey}
                onChange={(e) => handleInputChange("passKey", e.target.value)}
                placeholder="Enter your M-Pesa pass key"
              />
              <p className="text-xs text-gray-500">Get this from your Safaricom Developer Portal</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="short-code">Business Short Code</Label>
              <Input
                id="short-code"
                value={mpesaConfig.shortCode}
                onChange={(e) => handleInputChange("shortCode", e.target.value)}
                placeholder="Enter your business short code"
              />
              <p className="text-xs text-gray-500">Your M-Pesa till number or paybill number</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="environment">Environment</Label>
              <Select
                value={mpesaConfig.environment}
                onValueChange={(value) => handleInputChange("environment", value)}
              >
                <SelectTrigger id="environment">
                  <SelectValue placeholder="Select environment" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sandbox">Sandbox (Testing)</SelectItem>
                  <SelectItem value="production">Production</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-gray-500">Use sandbox for testing, production for live payments</p>
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t">
            <h3 className="text-lg font-medium">Callback URLs</h3>
            <p className="text-sm text-gray-500">These URLs will receive payment notifications from M-Pesa</p>

            <div className="space-y-2">
              <Label htmlFor="callback-url">Callback URL</Label>
              <Input
                id="callback-url"
                value={mpesaConfig.callbackUrl}
                onChange={(e) => handleInputChange("callbackUrl", e.target.value)}
                placeholder="https://yourdomain.com/api/mpesa/callback"
              />
              <p className="text-xs text-gray-500">URL that receives the payment notification</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="timeout-url">Timeout URL</Label>
              <Input
                id="timeout-url"
                value={mpesaConfig.timeoutUrl}
                onChange={(e) => handleInputChange("timeoutUrl", e.target.value)}
                placeholder="https://yourdomain.com/api/mpesa/timeout"
              />
              <p className="text-xs text-gray-500">URL that receives timeout notifications</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="result-url">Result URL</Label>
              <Input
                id="result-url"
                value={mpesaConfig.resultUrl}
                onChange={(e) => handleInputChange("resultUrl", e.target.value)}
                placeholder="https://yourdomain.com/api/mpesa/result"
              />
              <p className="text-xs text-gray-500">URL that receives the final result</p>
            </div>
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md p-4">
            <h4 className="text-blue-800 dark:text-blue-300 font-medium mb-2">Important Notes</h4>
            <ul className="list-disc list-inside text-sm text-blue-700 dark:text-blue-400 space-y-1">
              <li>Make sure your callback URLs are publicly accessible</li>
              <li>For testing, you can use a service like ngrok to expose your local server</li>
              <li>In production, ensure your server has a valid SSL certificate</li>
              <li>The M-Pesa API requires your server to respond within 25 seconds</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Testing</CardTitle>
          <CardDescription>Test your M-Pesa integration</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-500 mb-4">
            After saving your configuration, you can test the integration by making a small payment.
          </p>
          <Button
            variant="outline"
            disabled={!configExists || !mpesaConfig.enabled}
            onClick={() => {
              window.location.href = "/subscription"
            }}
          >
            Test Payment
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

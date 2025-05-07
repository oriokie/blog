"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"

export default function AdvancedSettingsPage() {
  const { toast } = useToast()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const [adSettings, setAdSettings] = useState({
    enabled: false,
    googleAdClient: "",
    slots: {
      header: "",
      sidebar: "",
      inContent: "",
      footer: "",
    },
    frequency: 3,
    excludedCategories: ["premium"],
    excludedPages: ["/about", "/privacy-policy"],
  })

  const [aiSettings, setAiSettings] = useState({
    autoPostingEnabled: true,
    autoPostingFrequency: "weekly",
    autoPostingTopics: ["technology", "design", "innovation"],
    contentEnhancementEnabled: true,
    imageGenerationEnabled: true,
  })

  const [blockchainSettings, setBlockchainSettings] = useState({
    contentVerificationEnabled: true,
    network: "ethereum",
    autoVerifyNewContent: true,
  })

  const [arVrSettings, setArVrSettings] = useState({
    enabled: true,
    defaultModelFormat: "glb",
    autoGenerateForProducts: true,
  })

  const [micropaymentSettings, setMicropaymentSettings] = useState({
    enabled: true,
    defaultPrice: 0.99,
    currency: "USD",
    paymentMethods: ["card", "crypto", "wallet", "paypal"],
  })

  const handleAdSettingsChange = (field, value) => {
    setAdSettings((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleAdSlotChange = (slot, value) => {
    setAdSettings((prev) => ({
      ...prev,
      slots: {
        ...prev.slots,
        [slot]: value,
      },
    }))
  }

  const saveSettings = async () => {
    setIsLoading(true)

    try {
      // In a real implementation, this would call an API to save settings
      await new Promise((resolve) => setTimeout(resolve, 1500))

      toast({
        title: "Settings saved",
        description: "Your advanced settings have been updated successfully.",
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
        <h1 className="text-3xl font-bold">Advanced Settings</h1>
        <Button onClick={saveSettings} disabled={isLoading}>
          {isLoading ? "Saving..." : "Save Settings"}
        </Button>
      </div>

      <Tabs defaultValue="ads">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="ads">Ads</TabsTrigger>
          <TabsTrigger value="ai">AI Features</TabsTrigger>
          <TabsTrigger value="blockchain">Blockchain</TabsTrigger>
          <TabsTrigger value="ar-vr">AR/VR</TabsTrigger>
          <TabsTrigger value="micropayments">Micropayments</TabsTrigger>
          <TabsTrigger value="payment-gateways">Payment Gateways</TabsTrigger>
        </TabsList>

        <TabsContent value="ads" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Google Ads Settings</CardTitle>
              <CardDescription>Configure how ads are displayed on your site</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {!adSettings.googleAdClient && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 mb-4">
                  <p className="text-yellow-800 text-sm">
                    You haven't set up your Google Ad Client ID yet. Enter your ID below to enable ads on your site.
                  </p>
                </div>
              )}
              <div className="flex items-center space-x-2">
                <Switch
                  id="ads-enabled"
                  checked={adSettings.enabled}
                  onCheckedChange={(checked) => handleAdSettingsChange("enabled", checked)}
                />
                <Label htmlFor="ads-enabled">Enable Google Ads</Label>
              </div>

              <div className="space-y-2">
                <Label htmlFor="google-ad-client">Google Ad Client ID</Label>
                <Input
                  id="google-ad-client"
                  value={adSettings.googleAdClient}
                  onChange={(e) => handleAdSettingsChange("googleAdClient", e.target.value)}
                  placeholder="ca-pub-XXXXXXXXXXXXXXXX"
                />
                <p className="text-xs text-gray-500">
                  Enter your Google Ad Client ID here. You can get this from your Google AdSense account.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="header-ad-slot">Header Ad Slot</Label>
                  <Input
                    id="header-ad-slot"
                    value={adSettings.slots.header}
                    onChange={(e) => handleAdSlotChange("header", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sidebar-ad-slot">Sidebar Ad Slot</Label>
                  <Input
                    id="sidebar-ad-slot"
                    value={adSettings.slots.sidebar}
                    onChange={(e) => handleAdSlotChange("sidebar", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="in-content-ad-slot">In-Content Ad Slot</Label>
                  <Input
                    id="in-content-ad-slot"
                    value={adSettings.slots.inContent}
                    onChange={(e) => handleAdSlotChange("inContent", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="footer-ad-slot">Footer Ad Slot</Label>
                  <Input
                    id="footer-ad-slot"
                    value={adSettings.slots.footer}
                    onChange={(e) => handleAdSlotChange("footer", e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="ad-frequency">In-Content Ad Frequency</Label>
                <Select
                  value={adSettings.frequency.toString()}
                  onValueChange={(value) => handleAdSettingsChange("frequency", Number.parseInt(value))}
                >
                  <SelectTrigger id="ad-frequency">
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2">Every 2 paragraphs</SelectItem>
                    <SelectItem value="3">Every 3 paragraphs</SelectItem>
                    <SelectItem value="4">Every 4 paragraphs</SelectItem>
                    <SelectItem value="5">Every 5 paragraphs</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="excluded-categories">Excluded Categories (comma-separated)</Label>
                <Input
                  id="excluded-categories"
                  value={adSettings.excludedCategories.join(", ")}
                  onChange={(e) =>
                    handleAdSettingsChange(
                      "excludedCategories",
                      e.target.value.split(", ").map((item) => item.trim()),
                    )
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="excluded-pages">Excluded Pages (comma-separated)</Label>
                <Input
                  id="excluded-pages"
                  value={adSettings.excludedPages.join(", ")}
                  onChange={(e) =>
                    handleAdSettingsChange(
                      "excludedPages",
                      e.target.value.split(", ").map((item) => item.trim()),
                    )
                  }
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ai" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>AI Features</CardTitle>
              <CardDescription>Configure AI-powered features for your blog</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="auto-posting-enabled"
                  checked={aiSettings.autoPostingEnabled}
                  onCheckedChange={(checked) => setAiSettings({ ...aiSettings, autoPostingEnabled: checked })}
                />
                <Label htmlFor="auto-posting-enabled">Enable AI Auto-Posting</Label>
              </div>

              <div className="space-y-2">
                <Label htmlFor="auto-posting-frequency">Auto-Posting Frequency</Label>
                <Select
                  value={aiSettings.autoPostingFrequency}
                  onValueChange={(value) => setAiSettings({ ...aiSettings, autoPostingFrequency: value })}
                >
                  <SelectTrigger id="auto-posting-frequency">
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="biweekly">Bi-weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="auto-posting-topics">Auto-Posting Topics (comma-separated)</Label>
                <Input
                  id="auto-posting-topics"
                  value={aiSettings.autoPostingTopics.join(", ")}
                  onChange={(e) =>
                    setAiSettings({
                      ...aiSettings,
                      autoPostingTopics: e.target.value.split(", ").map((item) => item.trim()),
                    })
                  }
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="content-enhancement-enabled"
                  checked={aiSettings.contentEnhancementEnabled}
                  onCheckedChange={(checked) => setAiSettings({ ...aiSettings, contentEnhancementEnabled: checked })}
                />
                <Label htmlFor="content-enhancement-enabled">Enable AI Content Enhancement</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="image-generation-enabled"
                  checked={aiSettings.imageGenerationEnabled}
                  onCheckedChange={(checked) => setAiSettings({ ...aiSettings, imageGenerationEnabled: checked })}
                />
                <Label htmlFor="image-generation-enabled">Enable AI Image Generation</Label>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="blockchain" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Blockchain Content Verification</CardTitle>
              <CardDescription>Configure blockchain settings for content verification</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="content-verification-enabled"
                  checked={blockchainSettings.contentVerificationEnabled}
                  onCheckedChange={(checked) =>
                    setBlockchainSettings({ ...blockchainSettings, contentVerificationEnabled: checked })
                  }
                />
                <Label htmlFor="content-verification-enabled">Enable Blockchain Content Verification</Label>
              </div>

              <div className="space-y-2">
                <Label htmlFor="blockchain-network">Blockchain Network</Label>
                <Select
                  value={blockchainSettings.network}
                  onValueChange={(value) => setBlockchainSettings({ ...blockchainSettings, network: value })}
                >
                  <SelectTrigger id="blockchain-network">
                    <SelectValue placeholder="Select network" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ethereum">Ethereum</SelectItem>
                    <SelectItem value="polygon">Polygon</SelectItem>
                    <SelectItem value="solana">Solana</SelectItem>
                    <SelectItem value="arweave">Arweave</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="auto-verify-new-content"
                  checked={blockchainSettings.autoVerifyNewContent}
                  onCheckedChange={(checked) =>
                    setBlockchainSettings({ ...blockchainSettings, autoVerifyNewContent: checked })
                  }
                />
                <Label htmlFor="auto-verify-new-content">Automatically Verify New Content</Label>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ar-vr" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>AR/VR Features</CardTitle>
              <CardDescription>Configure augmented and virtual reality features</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="ar-vr-enabled"
                  checked={arVrSettings.enabled}
                  onCheckedChange={(checked) => setArVrSettings({ ...arVrSettings, enabled: checked })}
                />
                <Label htmlFor="ar-vr-enabled">Enable AR/VR Features</Label>
              </div>

              <div className="space-y-2">
                <Label htmlFor="default-model-format">Default 3D Model Format</Label>
                <Select
                  value={arVrSettings.defaultModelFormat}
                  onValueChange={(value) => setArVrSettings({ ...arVrSettings, defaultModelFormat: value })}
                >
                  <SelectTrigger id="default-model-format">
                    <SelectValue placeholder="Select format" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="glb">GLB</SelectItem>
                    <SelectItem value="gltf">GLTF</SelectItem>
                    <SelectItem value="usdz">USDZ (iOS)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="auto-generate-for-products"
                  checked={arVrSettings.autoGenerateForProducts}
                  onCheckedChange={(checked) => setArVrSettings({ ...arVrSettings, autoGenerateForProducts: checked })}
                />
                <Label htmlFor="auto-generate-for-products">Auto-Generate 3D Models for Product Reviews</Label>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="micropayments" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Micropayments</CardTitle>
              <CardDescription>Configure micropayments for premium content</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="micropayments-enabled"
                  checked={micropaymentSettings.enabled}
                  onCheckedChange={(checked) => setMicropaymentSettings({ ...micropaymentSettings, enabled: checked })}
                />
                <Label htmlFor="micropayments-enabled">Enable Micropayments</Label>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="default-price">Default Price</Label>
                  <Input
                    id="default-price"
                    type="number"
                    step="0.01"
                    value={micropaymentSettings.defaultPrice}
                    onChange={(e) =>
                      setMicropaymentSettings({
                        ...micropaymentSettings,
                        defaultPrice: Number.parseFloat(e.target.value),
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="currency">Currency</Label>
                  <Select
                    value={micropaymentSettings.currency}
                    onValueChange={(value) => setMicropaymentSettings({ ...micropaymentSettings, currency: value })}
                  >
                    <SelectTrigger id="currency">
                      <SelectValue placeholder="Select currency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">USD</SelectItem>
                      <SelectItem value="EUR">EUR</SelectItem>
                      <SelectItem value="GBP">GBP</SelectItem>
                      <SelectItem value="BTC">BTC</SelectItem>
                      <SelectItem value="ETH">ETH</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Payment Methods</Label>
                <div className="flex flex-col space-y-2">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="payment-method-card"
                      checked={micropaymentSettings.paymentMethods.includes("card")}
                      onCheckedChange={(checked) => {
                        const methods = checked
                          ? [...micropaymentSettings.paymentMethods, "card"]
                          : micropaymentSettings.paymentMethods.filter((m) => m !== "card")
                        setMicropaymentSettings({ ...micropaymentSettings, paymentMethods: methods })
                      }}
                    />
                    <Label htmlFor="payment-method-card">Credit/Debit Card</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="payment-method-crypto"
                      checked={micropaymentSettings.paymentMethods.includes("crypto")}
                      onCheckedChange={(checked) => {
                        const methods = checked
                          ? [...micropaymentSettings.paymentMethods, "crypto"]
                          : micropaymentSettings.paymentMethods.filter((m) => m !== "crypto")
                        setMicropaymentSettings({ ...micropaymentSettings, paymentMethods: methods })
                      }}
                    />
                    <Label htmlFor="payment-method-crypto">Cryptocurrency</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="payment-method-wallet"
                      checked={micropaymentSettings.paymentMethods.includes("wallet")}
                      onCheckedChange={(checked) => {
                        const methods = checked
                          ? [...micropaymentSettings.paymentMethods, "wallet"]
                          : micropaymentSettings.paymentMethods.filter((m) => m !== "wallet")
                        setMicropaymentSettings({ ...micropaymentSettings, paymentMethods: methods })
                      }}
                    />
                    <Label htmlFor="payment-method-wallet">Digital Wallet</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="payment-method-paypal"
                      checked={micropaymentSettings.paymentMethods.includes("paypal")}
                      onCheckedChange={(checked) => {
                        const methods = checked
                          ? [...micropaymentSettings.paymentMethods, "paypal"]
                          : micropaymentSettings.paymentMethods.filter((m) => m !== "paypal")
                        setMicropaymentSettings({ ...micropaymentSettings, paymentMethods: methods })
                      }}
                    />
                    <Label htmlFor="payment-method-paypal">PayPal</Label>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payment-gateways" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Payment Gateways</CardTitle>
              <CardDescription>Configure payment gateways for subscriptions and purchases</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="border-2 border-gray-200 dark:border-gray-800">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">M-Pesa Integration</CardTitle>
                    <CardDescription>Configure M-Pesa STK Push for payments</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                      Configure M-Pesa for mobile money payments in Kenya and other supported countries.
                    </p>
                    <Button variant="outline" onClick={() => router.push("/dashboard/settings/mpesa")}>
                      Configure M-Pesa
                    </Button>
                  </CardContent>
                </Card>

                <Card className="border-2 border-gray-200 dark:border-gray-800">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Exit Popup Settings</CardTitle>
                    <CardDescription>Configure exit intent popup for your site</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                      Configure the popup that appears when users are about to leave your site.
                    </p>
                    <Button variant="outline" onClick={() => router.push("/dashboard/settings/exit-popup")}>
                      Configure Exit Popup
                    </Button>
                  </CardContent>
                </Card>

                <Card className="border-2 border-gray-200 dark:border-gray-800">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Stripe Integration</CardTitle>
                    <CardDescription>Configure Stripe for card payments</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                      Configure Stripe for credit/debit card payments and subscriptions.
                    </p>
                    <Button variant="outline" disabled>
                      Coming Soon
                    </Button>
                  </CardContent>
                </Card>

                <Card className="border-2 border-gray-200 dark:border-gray-800">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">PayPal Integration</CardTitle>
                    <CardDescription>Configure PayPal for online payments</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                      Configure PayPal for online payments and subscriptions.
                    </p>
                    <Button variant="outline" disabled>
                      Coming Soon
                    </Button>
                  </CardContent>
                </Card>

                <Card className="border-2 border-gray-200 dark:border-gray-800">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Crypto Integration</CardTitle>
                    <CardDescription>Configure cryptocurrency payments</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                      Configure cryptocurrency payments using Bitcoin, Ethereum, and other tokens.
                    </p>
                    <Button variant="outline" disabled>
                      Coming Soon
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

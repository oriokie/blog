"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { MessageSquare, Mail, Share2, BarChart3, Search, CreditCard, Rss, Globe, AlertCircle } from "lucide-react"

export default function IntegrationsPage() {
  const [activeIntegrations, setActiveIntegrations] = useState({
    disqus: false,
    mailchimp: true,
    googleAnalytics: true,
    algolia: false,
    stripe: false,
    rss: true,
    socialShare: true,
  })

  const toggleIntegration = (key: string) => {
    setActiveIntegrations((prev) => ({
      ...prev,
      [key]: !prev[key as keyof typeof prev],
    }))
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Integrations</h2>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="marketing">Marketing</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {/* Comments Integration */}
            <Card>
              <CardHeader className="space-y-1">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Disqus Comments</CardTitle>
                  <MessageSquare className="h-4 w-4 text-muted-foreground" />
                </div>
                <CardDescription>Add Disqus commenting system to your blog posts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="disqus-shortname">Disqus Shortname</Label>
                    <Input id="disqus-shortname" placeholder="your-disqus-shortname" />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="disqus-active"
                      checked={activeIntegrations.disqus}
                      onCheckedChange={() => toggleIntegration("disqus")}
                    />
                    <Label htmlFor="disqus-active">Enable Disqus Comments</Label>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  variant={activeIntegrations.disqus ? "default" : "outline"}
                  className="w-full"
                  onClick={() => toggleIntegration("disqus")}
                >
                  {activeIntegrations.disqus ? "Deactivate" : "Activate"}
                </Button>
              </CardFooter>
            </Card>

            {/* Email Marketing Integration */}
            <Card>
              <CardHeader className="space-y-1">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Mailchimp</CardTitle>
                  <Mail className="h-4 w-4 text-muted-foreground" />
                </div>
                <CardDescription>Connect your Mailchimp account for email newsletters</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="mailchimp-api">API Key</Label>
                    <Input id="mailchimp-api" type="password" value="••••••••••••••••" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="mailchimp-list">List ID</Label>
                    <Input id="mailchimp-list" value="a1b2c3d4e5" />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="mailchimp-active"
                      checked={activeIntegrations.mailchimp}
                      onCheckedChange={() => toggleIntegration("mailchimp")}
                    />
                    <Label htmlFor="mailchimp-active">Enable Mailchimp</Label>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  variant={activeIntegrations.mailchimp ? "default" : "outline"}
                  className="w-full"
                  onClick={() => toggleIntegration("mailchimp")}
                >
                  {activeIntegrations.mailchimp ? "Deactivate" : "Activate"}
                </Button>
              </CardFooter>
            </Card>

            {/* Social Sharing Integration */}
            <Card>
              <CardHeader className="space-y-1">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Social Sharing</CardTitle>
                  <Share2 className="h-4 w-4 text-muted-foreground" />
                </div>
                <CardDescription>Add social sharing buttons to your blog posts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex items-center space-x-2">
                      <Switch id="share-twitter" checked={true} />
                      <Label htmlFor="share-twitter">Twitter</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch id="share-facebook" checked={true} />
                      <Label htmlFor="share-facebook">Facebook</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch id="share-linkedin" checked={true} />
                      <Label htmlFor="share-linkedin">LinkedIn</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch id="share-pinterest" checked={false} />
                      <Label htmlFor="share-pinterest">Pinterest</Label>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="social-active"
                      checked={activeIntegrations.socialShare}
                      onCheckedChange={() => toggleIntegration("socialShare")}
                    />
                    <Label htmlFor="social-active">Enable Social Sharing</Label>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  variant={activeIntegrations.socialShare ? "default" : "outline"}
                  className="w-full"
                  onClick={() => toggleIntegration("socialShare")}
                >
                  {activeIntegrations.socialShare ? "Deactivate" : "Activate"}
                </Button>
              </CardFooter>
            </Card>

            {/* Analytics Integration */}
            <Card>
              <CardHeader className="space-y-1">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Google Analytics</CardTitle>
                  <BarChart3 className="h-4 w-4 text-muted-foreground" />
                </div>
                <CardDescription>Track your blog's performance with Google Analytics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="ga-id">Tracking ID</Label>
                    <Input id="ga-id" placeholder="UA-XXXXXXXXX-X or G-XXXXXXXXXX" value="G-ABC123XYZ" />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="ga-active"
                      checked={activeIntegrations.googleAnalytics}
                      onCheckedChange={() => toggleIntegration("googleAnalytics")}
                    />
                    <Label htmlFor="ga-active">Enable Google Analytics</Label>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  variant={activeIntegrations.googleAnalytics ? "default" : "outline"}
                  className="w-full"
                  onClick={() => toggleIntegration("googleAnalytics")}
                >
                  {activeIntegrations.googleAnalytics ? "Deactivate" : "Activate"}
                </Button>
              </CardFooter>
            </Card>

            {/* Search Integration */}
            <Card>
              <CardHeader className="space-y-1">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Algolia Search</CardTitle>
                  <Search className="h-4 w-4 text-muted-foreground" />
                </div>
                <CardDescription>Add powerful search functionality to your blog</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="algolia-app">Application ID</Label>
                    <Input id="algolia-app" placeholder="Your Algolia App ID" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="algolia-key">API Key</Label>
                    <Input id="algolia-key" type="password" placeholder="Your Algolia API Key" />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="algolia-active"
                      checked={activeIntegrations.algolia}
                      onCheckedChange={() => toggleIntegration("algolia")}
                    />
                    <Label htmlFor="algolia-active">Enable Algolia Search</Label>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  variant={activeIntegrations.algolia ? "default" : "outline"}
                  className="w-full"
                  onClick={() => toggleIntegration("algolia")}
                >
                  {activeIntegrations.algolia ? "Deactivate" : "Activate"}
                </Button>
              </CardFooter>
            </Card>

            {/* Payment Integration */}
            <Card>
              <CardHeader className="space-y-1">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Stripe Payments</CardTitle>
                  <CreditCard className="h-4 w-4 text-muted-foreground" />
                </div>
                <CardDescription>Accept payments and subscriptions for premium content</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="stripe-key">Publishable Key</Label>
                    <Input id="stripe-key" placeholder="pk_test_..." />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="stripe-secret">Secret Key</Label>
                    <Input id="stripe-secret" type="password" placeholder="sk_test_..." />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="stripe-active"
                      checked={activeIntegrations.stripe}
                      onCheckedChange={() => toggleIntegration("stripe")}
                    />
                    <Label htmlFor="stripe-active">Enable Stripe Payments</Label>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  variant={activeIntegrations.stripe ? "default" : "outline"}
                  className="w-full"
                  onClick={() => toggleIntegration("stripe")}
                >
                  {activeIntegrations.stripe ? "Deactivate" : "Activate"}
                </Button>
              </CardFooter>
            </Card>

            {/* RSS Integration */}
            <Card>
              <CardHeader className="space-y-1">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">RSS Feed</CardTitle>
                  <Rss className="h-4 w-4 text-muted-foreground" />
                </div>
                <CardDescription>Generate RSS feeds for your blog content</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="rss-title">Feed Title</Label>
                    <Input id="rss-title" value="My Blog RSS Feed" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="rss-description">Feed Description</Label>
                    <Input id="rss-description" value="Latest posts from my blog" />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="rss-active"
                      checked={activeIntegrations.rss}
                      onCheckedChange={() => toggleIntegration("rss")}
                    />
                    <Label htmlFor="rss-active">Enable RSS Feed</Label>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  variant={activeIntegrations.rss ? "default" : "outline"}
                  className="w-full"
                  onClick={() => toggleIntegration("rss")}
                >
                  {activeIntegrations.rss ? "Deactivate" : "Activate"}
                </Button>
              </CardFooter>
            </Card>

            {/* Webmaster Tools Integration */}
            <Card>
              <CardHeader className="space-y-1">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Webmaster Tools</CardTitle>
                  <Globe className="h-4 w-4 text-muted-foreground" />
                </div>
                <CardDescription>Verify your site with search engines and webmaster tools</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="google-verify">Google Verification</Label>
                    <Input id="google-verify" placeholder="Google verification code" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bing-verify">Bing Verification</Label>
                    <Input id="bing-verify" placeholder="Bing verification code" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="yandex-verify">Yandex Verification</Label>
                    <Input id="yandex-verify" placeholder="Yandex verification code" />
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  Save Verification Codes
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="active" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {activeIntegrations.mailchimp && (
              <Card>
                <CardHeader className="space-y-1">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">Mailchimp</CardTitle>
                    <Badge variant="outline" className="ml-2">
                      Active
                    </Badge>
                  </div>
                  <CardDescription>Connected to list: Newsletter Subscribers</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">Your Mailchimp integration is working correctly.</p>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full" onClick={() => toggleIntegration("mailchimp")}>
                    Manage
                  </Button>
                </CardFooter>
              </Card>
            )}

            {activeIntegrations.googleAnalytics && (
              <Card>
                <CardHeader className="space-y-1">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">Google Analytics</CardTitle>
                    <Badge variant="outline" className="ml-2">
                      Active
                    </Badge>
                  </div>
                  <CardDescription>Tracking ID: G-ABC123XYZ</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Your Google Analytics integration is working correctly.
                  </p>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full" onClick={() => toggleIntegration("googleAnalytics")}>
                    Manage
                  </Button>
                </CardFooter>
              </Card>
            )}

            {activeIntegrations.socialShare && (
              <Card>
                <CardHeader className="space-y-1">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">Social Sharing</CardTitle>
                    <Badge variant="outline" className="ml-2">
                      Active
                    </Badge>
                  </div>
                  <CardDescription>Enabled platforms: Twitter, Facebook, LinkedIn</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">Social sharing buttons are enabled on all posts.</p>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full" onClick={() => toggleIntegration("socialShare")}>
                    Manage
                  </Button>
                </CardFooter>
              </Card>
            )}

            {activeIntegrations.rss && (
              <Card>
                <CardHeader className="space-y-1">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">RSS Feed</CardTitle>
                    <Badge variant="outline" className="ml-2">
                      Active
                    </Badge>
                  </div>
                  <CardDescription>Feed URL: yourblog.com/rss.xml</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">Your RSS feed is active and updating automatically.</p>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full" onClick={() => toggleIntegration("rss")}>
                    Manage
                  </Button>
                </CardFooter>
              </Card>
            )}

            {Object.values(activeIntegrations).filter(Boolean).length === 0 && (
              <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
                <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="font-medium text-lg">No Active Integrations</h3>
                <p className="text-muted-foreground">You don't have any active integrations yet.</p>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="space-y-1">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Google Analytics</CardTitle>
                  <BarChart3 className="h-4 w-4 text-muted-foreground" />
                </div>
                <CardDescription>Track your blog's performance with Google Analytics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="ga-id-tab">Tracking ID</Label>
                    <Input id="ga-id-tab" placeholder="UA-XXXXXXXXX-X or G-XXXXXXXXXX" value="G-ABC123XYZ" />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="ga-active-tab"
                      checked={activeIntegrations.googleAnalytics}
                      onCheckedChange={() => toggleIntegration("googleAnalytics")}
                    />
                    <Label htmlFor="ga-active-tab">Enable Google Analytics</Label>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  variant={activeIntegrations.googleAnalytics ? "default" : "outline"}
                  className="w-full"
                  onClick={() => toggleIntegration("googleAnalytics")}
                >
                  {activeIntegrations.googleAnalytics ? "Deactivate" : "Activate"}
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="marketing" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="space-y-1">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Mailchimp</CardTitle>
                  <Mail className="h-4 w-4 text-muted-foreground" />
                </div>
                <CardDescription>Connect your Mailchimp account for email newsletters</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="mailchimp-api-tab">API Key</Label>
                    <Input id="mailchimp-api-tab" type="password" value="••••••••••••••••" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="mailchimp-list-tab">List ID</Label>
                    <Input id="mailchimp-list-tab" value="a1b2c3d4e5" />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="mailchimp-active-tab"
                      checked={activeIntegrations.mailchimp}
                      onCheckedChange={() => toggleIntegration("mailchimp")}
                    />
                    <Label htmlFor="mailchimp-active-tab">Enable Mailchimp</Label>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  variant={activeIntegrations.mailchimp ? "default" : "outline"}
                  className="w-full"
                  onClick={() => toggleIntegration("mailchimp")}
                >
                  {activeIntegrations.mailchimp ? "Deactivate" : "Activate"}
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader className="space-y-1">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Social Sharing</CardTitle>
                  <Share2 className="h-4 w-4 text-muted-foreground" />
                </div>
                <CardDescription>Add social sharing buttons to your blog posts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex items-center space-x-2">
                      <Switch id="share-twitter-tab" checked={true} />
                      <Label htmlFor="share-twitter-tab">Twitter</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch id="share-facebook-tab" checked={true} />
                      <Label htmlFor="share-facebook-tab">Facebook</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch id="share-linkedin-tab" checked={true} />
                      <Label htmlFor="share-linkedin-tab">LinkedIn</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch id="share-pinterest-tab" checked={false} />
                      <Label htmlFor="share-pinterest-tab">Pinterest</Label>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="social-active-tab"
                      checked={activeIntegrations.socialShare}
                      onCheckedChange={() => toggleIntegration("socialShare")}
                    />
                    <Label htmlFor="social-active-tab">Enable Social Sharing</Label>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  variant={activeIntegrations.socialShare ? "default" : "outline"}
                  className="w-full"
                  onClick={() => toggleIntegration("socialShare")}
                >
                  {activeIntegrations.socialShare ? "Deactivate" : "Activate"}
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="payments" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="space-y-1">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Stripe Payments</CardTitle>
                  <CreditCard className="h-4 w-4 text-muted-foreground" />
                </div>
                <CardDescription>Accept payments and subscriptions for premium content</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="stripe-key-tab">Publishable Key</Label>
                    <Input id="stripe-key-tab" placeholder="pk_test_..." />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="stripe-secret-tab">Secret Key</Label>
                    <Input id="stripe-secret-tab" type="password" placeholder="sk_test_..." />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="stripe-active-tab"
                      checked={activeIntegrations.stripe}
                      onCheckedChange={() => toggleIntegration("stripe")}
                    />
                    <Label htmlFor="stripe-active-tab">Enable Stripe Payments</Label>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  variant={activeIntegrations.stripe ? "default" : "outline"}
                  className="w-full"
                  onClick={() => toggleIntegration("stripe")}
                >
                  {activeIntegrations.stripe ? "Deactivate" : "Activate"}
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

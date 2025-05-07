"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import {
  CalendarIcon,
  Sparkles,
  Wand2,
  CalendarPlus2Icon as CalendarIcon2,
  Save,
  Loader2,
  X,
  RefreshCw,
} from "lucide-react"
import {
  aiService,
  type ContentGenerationParams,
  type AutopostSchedule,
  type AIGeneratedContent,
} from "@/lib/ai-service"
import { postsAPI } from "@/lib/api"

export default function AIContentPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("generate")
  const [loading, setLoading] = useState(false)
  const [generatedContent, setGeneratedContent] = useState<AIGeneratedContent | null>(null)
  const [contentParams, setContentParams] = useState<ContentGenerationParams>({
    topic: "",
    tone: "professional",
    length: "medium",
    keywords: [],
    targetAudience: "technology enthusiasts",
  })
  const [currentKeyword, setCurrentKeyword] = useState("")
  const [autopostSchedule, setAutopostSchedule] = useState<AutopostSchedule>({
    frequency: "weekly",
    timeOfDay: "09:00",
    timezone: "America/New_York",
  })
  const [topicIdeas, setTopicIdeas] = useState<string[]>([])
  const [currentTopic, setCurrentTopic] = useState("")
  const [scheduledDate, setScheduledDate] = useState<Date | undefined>(new Date())
  const [publishNow, setPublishNow] = useState(false)
  const [autopostLoading, setAutopostLoading] = useState(false)
  const [autopostResult, setAutopostResult] = useState<{ message: string; scheduledDates: string[] } | null>(null)
  const [seoLoading, setSeoLoading] = useState(false)
  const [seoResults, setSeoResults] = useState<{
    improvedTitle: string
    metaDescription: string
    seoSuggestions: string[]
  } | null>(null)

  const handleAddKeyword = () => {
    if (currentKeyword && !contentParams.keywords?.includes(currentKeyword)) {
      setContentParams({
        ...contentParams,
        keywords: [...(contentParams.keywords || []), currentKeyword],
      })
      setCurrentKeyword("")
    }
  }

  const handleRemoveKeyword = (keyword: string) => {
    setContentParams({
      ...contentParams,
      keywords: contentParams.keywords?.filter((k) => k !== keyword) || [],
    })
  }

  const handleAddTopic = () => {
    if (currentTopic && !topicIdeas.includes(currentTopic)) {
      setTopicIdeas([...topicIdeas, currentTopic])
      setCurrentTopic("")
    }
  }

  const handleRemoveTopic = (topic: string) => {
    setTopicIdeas(topicIdeas.filter((t) => t !== topic))
  }

  const handleGenerateContent = async () => {
    try {
      setLoading(true)
      const content = await aiService.generateContent(contentParams)
      setGeneratedContent(content)
      setActiveTab("preview")
    } catch (error) {
      console.error("Error generating content:", error)
      // Handle error
    } finally {
      setLoading(false)
    }
  }

  const handleSavePost = async () => {
    if (!generatedContent) return

    try {
      setLoading(true)
      const postData = {
        title: generatedContent.title,
        excerpt: generatedContent.excerpt,
        content: generatedContent.content,
        coverImage: "/placeholder.svg", // Would be replaced with generated image
        category: generatedContent.suggestedCategory,
        status: publishNow ? "published" : "draft",
        scheduledFor: !publishNow && scheduledDate ? scheduledDate : null,
        tags: generatedContent.suggestedTags,
        metaDescription: seoResults?.metaDescription || generatedContent.excerpt,
        seoTitle: seoResults?.improvedTitle || generatedContent.title,
      }

      const response = await postsAPI.createPost(postData)
      router.push(`/dashboard/posts/edit/${response.data._id}`)
    } catch (error) {
      console.error("Error saving post:", error)
      // Handle error
    } finally {
      setLoading(false)
    }
  }

  const handleScheduleAutopost = async () => {
    if (topicIdeas.length === 0) return

    try {
      setAutopostLoading(true)
      const result = await aiService.scheduleAutopost(topicIdeas, autopostSchedule, contentParams)
      setAutopostResult(result)
    } catch (error) {
      console.error("Error scheduling autopost:", error)
      // Handle error
    } finally {
      setAutopostLoading(false)
    }
  }

  const handleImproveSEO = async () => {
    if (!generatedContent) return

    try {
      setSeoLoading(true)
      const results = await aiService.improveSEO(generatedContent.title, generatedContent.content)
      setSeoResults(results)
    } catch (error) {
      console.error("Error improving SEO:", error)
      // Handle error
    } finally {
      setSeoLoading(false)
    }
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight flex items-center">
            <Sparkles className="mr-2 h-6 w-6 text-apple-blue" />
            AI Content Studio
          </h2>
          <p className="text-muted-foreground">Generate and schedule blog content with AI</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="generate">Generate Content</TabsTrigger>
          <TabsTrigger value="preview" disabled={!generatedContent}>
            Preview & Edit
          </TabsTrigger>
          <TabsTrigger value="autopost">Autopost Schedule</TabsTrigger>
        </TabsList>

        <TabsContent value="generate" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Content Generation</CardTitle>
              <CardDescription>Provide details about the content you want to generate</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="topic">Topic</Label>
                <Textarea
                  id="topic"
                  placeholder="Enter the main topic or title for your blog post"
                  value={contentParams.topic}
                  onChange={(e) => setContentParams({ ...contentParams, topic: e.target.value })}
                  className="min-h-[80px]"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="tone">Tone</Label>
                  <Select
                    value={contentParams.tone}
                    onValueChange={(value: any) => setContentParams({ ...contentParams, tone: value })}
                  >
                    <SelectTrigger id="tone">
                      <SelectValue placeholder="Select tone" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="professional">Professional</SelectItem>
                      <SelectItem value="casual">Casual</SelectItem>
                      <SelectItem value="technical">Technical</SelectItem>
                      <SelectItem value="friendly">Friendly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="length">Length</Label>
                  <Select
                    value={contentParams.length}
                    onValueChange={(value: any) => setContentParams({ ...contentParams, length: value })}
                  >
                    <SelectTrigger id="length">
                      <SelectValue placeholder="Select length" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="short">Short (~300 words)</SelectItem>
                      <SelectItem value="medium">Medium (~600 words)</SelectItem>
                      <SelectItem value="long">Long (~1200 words)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="targetAudience">Target Audience</Label>
                <Input
                  id="targetAudience"
                  placeholder="e.g., technology enthusiasts, beginners, professionals"
                  value={contentParams.targetAudience}
                  onChange={(e) => setContentParams({ ...contentParams, targetAudience: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label>Keywords</Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Add keywords"
                    value={currentKeyword}
                    onChange={(e) => setCurrentKeyword(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault()
                        handleAddKeyword()
                      }
                    }}
                  />
                  <Button type="button" onClick={handleAddKeyword} size="sm">
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {contentParams.keywords?.map((keyword) => (
                    <Badge key={keyword} variant="secondary" className="flex items-center gap-1">
                      {keyword}
                      <X className="h-3 w-3 cursor-pointer" onClick={() => handleRemoveKeyword(keyword)} />
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleGenerateContent} disabled={!contentParams.topic || loading} className="w-full">
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Wand2 className="mr-2 h-4 w-4" />
                    Generate Content
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="preview" className="space-y-4">
          {generatedContent && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle>Preview Generated Content</CardTitle>
                  <CardDescription>Review and edit the AI-generated content before publishing</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      value={seoResults?.improvedTitle || generatedContent.title}
                      onChange={(e) => setGeneratedContent({ ...generatedContent, title: e.target.value })}
                      className="text-lg font-medium"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="excerpt">Excerpt</Label>
                    <Textarea
                      id="excerpt"
                      value={generatedContent.excerpt}
                      onChange={(e) => setGeneratedContent({ ...generatedContent, excerpt: e.target.value })}
                      className="min-h-[80px]"
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="content">Content</Label>
                      <Button variant="outline" size="sm" onClick={handleImproveSEO} disabled={seoLoading}>
                        {seoLoading ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <>
                            <RefreshCw className="mr-2 h-4 w-4" />
                            Optimize SEO
                          </>
                        )}
                      </Button>
                    </div>
                    <Textarea
                      id="content"
                      value={generatedContent.content}
                      onChange={(e) => setGeneratedContent({ ...generatedContent, content: e.target.value })}
                      className="min-h-[400px] font-mono text-sm"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Suggested Category</Label>
                      <div className="flex items-center h-10 px-4 border rounded-md bg-muted">
                        {generatedContent.suggestedCategory}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Suggested Tags</Label>
                      <div className="flex flex-wrap gap-2">
                        {generatedContent.suggestedTags.map((tag) => (
                          <Badge key={tag} variant="secondary">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>

                  {seoResults && (
                    <div className="space-y-2 mt-4 p-4 border rounded-md bg-muted/50">
                      <h3 className="font-medium">SEO Suggestions</h3>
                      <ul className="list-disc pl-5 space-y-1">
                        {seoResults.seoSuggestions.map((suggestion, index) => (
                          <li key={index} className="text-sm">
                            {suggestion}
                          </li>
                        ))}
                      </ul>
                      <div className="mt-2">
                        <Label className="text-sm">Meta Description</Label>
                        <div className="text-sm p-2 bg-background rounded border mt-1">
                          {seoResults.metaDescription}
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Publishing Options</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Switch id="publish-now" checked={publishNow} onCheckedChange={setPublishNow} />
                    <Label htmlFor="publish-now">Publish immediately</Label>
                  </div>

                  {!publishNow && (
                    <div className="space-y-2">
                      <Label>Schedule Publication</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className="w-full justify-start text-left font-normal">
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {scheduledDate ? format(scheduledDate, "PPP") : <span>Pick a date</span>}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar mode="single" selected={scheduledDate} onSelect={setScheduledDate} initialFocus />
                        </PopoverContent>
                      </Popover>
                    </div>
                  )}
                </CardContent>
                <CardFooter>
                  <Button onClick={handleSavePost} disabled={loading} className="w-full">
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        {publishNow ? "Publish Post" : "Save & Schedule"}
                      </>
                    )}
                  </Button>
                </CardFooter>
              </Card>
            </>
          )}
        </TabsContent>

        <TabsContent value="autopost" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Autopost Schedule</CardTitle>
              <CardDescription>Set up automatic content generation and posting schedule</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Topic Ideas</Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Add topic idea"
                    value={currentTopic}
                    onChange={(e) => setCurrentTopic(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault()
                        handleAddTopic()
                      }
                    }}
                  />
                  <Button type="button" onClick={handleAddTopic} size="sm">
                    Add
                  </Button>
                </div>
                <div className="flex flex-col gap-2 mt-2">
                  {topicIdeas.map((topic, index) => (
                    <div key={index} className="flex items-center justify-between p-2 border rounded-md">
                      <span>{topic}</span>
                      <Button variant="ghost" size="sm" onClick={() => handleRemoveTopic(topic)}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  {topicIdeas.length === 0 && (
                    <div className="text-sm text-muted-foreground p-2 border border-dashed rounded-md text-center">
                      Add topic ideas for automatic content generation
                    </div>
                  )}
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="frequency">Posting Frequency</Label>
                  <Select
                    value={autopostSchedule.frequency}
                    onValueChange={(value: any) => setAutopostSchedule({ ...autopostSchedule, frequency: value })}
                  >
                    <SelectTrigger id="frequency">
                      <SelectValue placeholder="Select frequency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="custom">Custom</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="timeOfDay">Time of Day</Label>
                    <Input
                      id="timeOfDay"
                      type="time"
                      value={autopostSchedule.timeOfDay}
                      onChange={(e) => setAutopostSchedule({ ...autopostSchedule, timeOfDay: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="timezone">Timezone</Label>
                    <Select
                      value={autopostSchedule.timezone}
                      onValueChange={(value) => setAutopostSchedule({ ...autopostSchedule, timezone: value })}
                    >
                      <SelectTrigger id="timezone">
                        <SelectValue placeholder="Select timezone" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="America/New_York">Eastern Time (ET)</SelectItem>
                        <SelectItem value="America/Chicago">Central Time (CT)</SelectItem>
                        <SelectItem value="America/Denver">Mountain Time (MT)</SelectItem>
                        <SelectItem value="America/Los_Angeles">Pacific Time (PT)</SelectItem>
                        <SelectItem value="Europe/London">London (GMT)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                onClick={handleScheduleAutopost}
                disabled={topicIdeas.length === 0 || autopostLoading}
                className="w-full"
              >
                {autopostLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Scheduling...
                  </>
                ) : (
                  <>
                    <CalendarIcon2 className="mr-2 h-4 w-4" />
                    Schedule Autoposting
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>

          {autopostResult && (
            <Card>
              <CardHeader>
                <CardTitle>Autopost Schedule Created</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{autopostResult.message}</p>
                <div className="mt-4">
                  <h4 className="font-medium mb-2">Scheduled Dates:</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                    {autopostResult.scheduledDates.map((date, index) => (
                      <div key={index} className="flex items-center p-2 border rounded-md">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        <span>{date}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

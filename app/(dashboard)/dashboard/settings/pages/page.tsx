"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Pencil, Save, Eye } from "lucide-react"
import dynamic from "next/dynamic"

// Dynamically import the editor to avoid SSR issues
const Editor = dynamic(() => import("@/components/editor"), { ssr: false })

export default function PageSettingsPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [activeTab, setActiveTab] = useState("about")
  const [previewMode, setPreviewMode] = useState(false)
  const { toast } = useToast()

  // Form state for each page type
  const [pageContent, setPageContent] = useState({
    about: {
      title: "About Modern Blog",
      content: "",
      metaDescription: "Learn more about Modern Blog, our mission, and our team.",
      seoTitle: "About Us | Modern Blog",
    },
    contact: {
      title: "Contact Us",
      content: "",
      metaDescription: "Contact the Modern Blog team with your questions, feedback, or inquiries.",
      seoTitle: "Contact Us | Modern Blog",
    },
    home: {
      title: "Modern Blog - A Platform for Insightful Content",
      content: "",
      metaDescription: "Modern Blog offers insightful articles on technology, design, business, and lifestyle topics.",
      seoTitle: "Modern Blog - Discover Insights That Matter",
    },
  })

  useEffect(() => {
    // In a real app, this would fetch page content from the API
    // For demo purposes, we'll simulate loading
    const loadPageContent = async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Mock data
        setPageContent({
          about: {
            title: "About Modern Blog",
            content: `
              <h1>About Modern Blog</h1>
              <p class="lead">Modern Blog is a cutting-edge content platform designed to deliver high-quality, insightful articles on technology, design, business, and lifestyle topics.</p>
              
              <h2>Our Mission</h2>
              <p>Our mission is to create a space where knowledge is accessible, engaging, and actionable. We believe in the power of well-crafted content to inspire, educate, and drive positive change.</p>
              
              <h2>Our Story</h2>
              <p>Founded in 2023, Modern Blog began as a small project by a group of tech enthusiasts who wanted to share their knowledge and experiences with the world. What started as a passion project quickly grew into a comprehensive platform serving thousands of readers daily.</p>
              <p>As we've grown, we've remained committed to our core values: quality over quantity, reader-first approach, and continuous innovation. These principles guide everything we do, from the topics we cover to the features we develop.</p>
              
              <h2>Our Team</h2>
              <p>Behind Modern Blog is a diverse team of writers, editors, developers, and designers who are passionate about creating exceptional content and user experiences. Our team members bring expertise from various fields, ensuring that our content is both accurate and accessible.</p>
              
              <div class="team-members">
                <div class="team-member">
                  <h3>Joe Admin</h3>
                  <p class="role">Founder & Editor-in-Chief</p>
                  <p>With over 15 years of experience in technology and digital media, Joe leads our editorial direction and strategic initiatives.</p>
                </div>
                
                <div class="team-member">
                  <h3>Sarah Johnson</h3>
                  <p class="role">Head of Content</p>
                  <p>Sarah brings her expertise in content strategy and digital storytelling to ensure our articles are engaging, informative, and valuable to our readers.</p>
                </div>
              </div>
              
              <h2>Our Values</h2>
              <ul>
                <li><strong>Quality:</strong> We prioritize depth, accuracy, and thoughtfulness in everything we publish.</li>
                <li><strong>Accessibility:</strong> We believe knowledge should be accessible to everyone, regardless of technical background.</li>
                <li><strong>Innovation:</strong> We continuously explore new technologies and approaches to improve our platform.</li>
                <li><strong>Community:</strong> We value the diverse perspectives and contributions of our readers and contributors.</li>
                <li><strong>Integrity:</strong> We maintain editorial independence and transparency in all our content.</li>
              </ul>
            `,
            metaDescription: "Learn more about Modern Blog, our mission, and our team.",
            seoTitle: "About Us | Modern Blog",
          },
          contact: {
            title: "Contact Us",
            content: `
              <h1>Contact Us</h1>
              <p class="lead">We'd love to hear from you. Get in touch with our team.</p>
              
              <div class="contact-info">
                <div class="contact-item">
                  <h3>Email</h3>
                  <p><a href="mailto:info@modernblog.com">info@modernblog.com</a></p>
                </div>
                
                <div class="contact-item">
                  <h3>Phone</h3>
                  <p><a href="tel:+1234567890">+1 (234) 567-890</a></p>
                </div>
                
                <div class="contact-item">
                  <h3>Address</h3>
                  <p>
                    123 Blog Street<br>
                    San Francisco, CA 94103<br>
                    United States
                  </p>
                </div>
                
                <div class="contact-item">
                  <h3>Business Hours</h3>
                  <p>
                    Monday - Friday: 9am - 5pm<br>
                    Saturday: 10am - 2pm<br>
                    Sunday: Closed
                  </p>
                </div>
              </div>
            `,
            metaDescription: "Contact the Modern Blog team with your questions, feedback, or inquiries.",
            seoTitle: "Contact Us | Modern Blog",
          },
          home: {
            title: "Modern Blog - A Platform for Insightful Content",
            content: `
              <section class="hero">
                <h1>Discover Insights That Matter</h1>
                <p>Explore thoughtful articles on technology, design, business, and lifestyle topics.</p>
              </section>
              
              <section class="features">
                <div class="feature">
                  <h3>Expert Insights</h3>
                  <p>Articles written by industry professionals with deep expertise in their fields.</p>
                </div>
                
                <div class="feature">
                  <h3>Practical Advice</h3>
                  <p>Actionable tips and strategies you can apply to your work and life.</p>
                </div>
                
                <div class="feature">
                  <h3>Cutting-Edge Topics</h3>
                  <p>Stay ahead with content covering the latest trends and innovations.</p>
                </div>
              </section>
              
              <section class="cta">
                <h2>Join Our Community</h2>
                <p>Subscribe to get the latest articles, resources, and updates delivered to your inbox.</p>
              </section>
            `,
            metaDescription:
              "Modern Blog offers insightful articles on technology, design, business, and lifestyle topics.",
            seoTitle: "Modern Blog - Discover Insights That Matter",
          },
        })
        setIsLoading(false)
      } catch (error) {
        console.error("Error loading page content:", error)
        toast({
          title: "Error",
          description: "Failed to load page content",
          variant: "destructive",
        })
        setIsLoading(false)
      }
    }

    loadPageContent()
  }, [toast])

  const handleInputChange = (pageType, field, value) => {
    setPageContent((prev) => ({
      ...prev,
      [pageType]: {
        ...prev[pageType],
        [field]: value,
      },
    }))
  }

  const handleEditorChange = (pageType, content) => {
    setPageContent((prev) => ({
      ...prev,
      [pageType]: {
        ...prev[pageType],
        content,
      },
    }))
  }

  const handleSave = async (pageType) => {
    setIsSaving(true)
    try {
      // In a real app, this would be an API call
      // For demo purposes, we'll simulate success
      await new Promise((resolve) => setTimeout(resolve, 1500))

      toast({
        title: "Page updated",
        description: `The ${pageType} page has been updated successfully`,
      })
    } catch (error) {
      console.error(`Error saving ${pageType} page:`, error)
      toast({
        title: "Error",
        description: `Failed to save ${pageType} page`,
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const togglePreviewMode = () => {
    setPreviewMode(!previewMode)
  }

  if (isLoading) {
    return (
      <div className="container mx-auto py-6">
        <div className="flex justify-center p-8">
          <p>Loading page content...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Page Settings</h1>
        <p className="text-gray-500 dark:text-gray-400">Manage content for your website's pages</p>
      </div>

      <Tabs defaultValue="about" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="about">About Page</TabsTrigger>
          <TabsTrigger value="contact">Contact Page</TabsTrigger>
          <TabsTrigger value="home">Home Page</TabsTrigger>
        </TabsList>

        {["about", "contact", "home"].map((pageType) => (
          <TabsContent key={pageType} value={pageType} className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>{pageType.charAt(0).toUpperCase() + pageType.slice(1)} Page Content</CardTitle>
                    <CardDescription>Edit the content that appears on your {pageType} page</CardDescription>
                  </div>
                  <Button variant="outline" size="sm" onClick={togglePreviewMode} className="flex items-center gap-1">
                    {previewMode ? (
                      <>
                        <Pencil className="h-4 w-4" /> Edit
                      </>
                    ) : (
                      <>
                        <Eye className="h-4 w-4" /> Preview
                      </>
                    )}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {!previewMode ? (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor={`${pageType}-title`}>Page Title</Label>
                      <Input
                        id={`${pageType}-title`}
                        value={pageContent[pageType].title}
                        onChange={(e) => handleInputChange(pageType, "title", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`${pageType}-content`}>Content</Label>
                      <div className="min-h-[400px] border rounded-md">
                        <Editor
                          initialContent={pageContent[pageType].content}
                          onChange={(content) => handleEditorChange(pageType, content)}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`${pageType}-meta-description`}>Meta Description</Label>
                      <Input
                        id={`${pageType}-meta-description`}
                        value={pageContent[pageType].metaDescription}
                        onChange={(e) => handleInputChange(pageType, "metaDescription", e.target.value)}
                      />
                      <p className="text-xs text-gray-500">
                        A brief description of the page for search engines (150-160 characters recommended)
                      </p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`${pageType}-seo-title`}>SEO Title</Label>
                      <Input
                        id={`${pageType}-seo-title`}
                        value={pageContent[pageType].seoTitle}
                        onChange={(e) => handleInputChange(pageType, "seoTitle", e.target.value)}
                      />
                      <p className="text-xs text-gray-500">
                        The title that appears in search engine results (50-60 characters recommended)
                      </p>
                    </div>
                  </>
                ) : (
                  <div className="prose prose-sm dark:prose-invert max-w-none">
                    <div dangerouslySetInnerHTML={{ __html: pageContent[pageType].content }} />
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <Button onClick={() => handleSave(pageType)} disabled={isSaving || previewMode} className="ml-auto">
                  {isSaving ? (
                    "Saving..."
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" /> Save Changes
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}

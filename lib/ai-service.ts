import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

// Types for AI content generation
export interface ContentGenerationParams {
  topic: string
  tone?: "professional" | "casual" | "technical" | "friendly"
  length?: "short" | "medium" | "long"
  keywords?: string[]
  targetAudience?: string
}

export interface AutopostSchedule {
  frequency: "daily" | "weekly" | "monthly" | "custom"
  customDays?: number[]
  timeOfDay?: string
  timezone?: string
}

export interface AIGeneratedContent {
  title: string
  excerpt: string
  content: string
  suggestedTags: string[]
  suggestedCategory: string
}

// AI Service for content generation and autoposting
export const aiService = {
  // Generate content using AI
  generateContent: async (params: ContentGenerationParams): Promise<AIGeneratedContent> => {
    try {
      const { topic, tone = "professional", length = "medium", keywords = [], targetAudience = "general" } = params

      // Create a prompt for the AI
      const prompt = `
        Generate a blog post about "${topic}".
        Tone: ${tone}
        Length: ${length} (short: ~300 words, medium: ~600 words, long: ~1200 words)
        Target audience: ${targetAudience}
        Keywords to include: ${keywords.join(", ")}
        
        Format the response as a JSON object with the following structure:
        {
          "title": "An engaging title for the blog post",
          "excerpt": "A compelling 2-3 sentence summary of the blog post",
          "content": "The full blog post content in HTML format with proper headings, paragraphs, and formatting",
          "suggestedTags": ["tag1", "tag2", "tag3"],
          "suggestedCategory": "The most appropriate category for this post"
        }
      `

      // Use AI SDK to generate content
      const { text } = await generateText({
        model: openai("gpt-4o"),
        prompt: prompt,
        system:
          "You are an expert blog content writer specializing in technology, design, and innovation topics. Create engaging, informative content that follows SEO best practices.",
      })

      // Parse the response
      return JSON.parse(text) as AIGeneratedContent
    } catch (error) {
      console.error("Error generating content with AI:", error)
      throw new Error("Failed to generate content. Please try again later.")
    }
  },

  // Generate image prompts for blog post cover images
  generateImagePrompt: async (title: string, content: string): Promise<string> => {
    try {
      const prompt = `
        Generate a detailed image prompt for a blog post titled "${title}".
        Use the following content excerpt to inform the image:
        "${content.substring(0, 300)}..."
        
        The image prompt should be detailed enough for an AI image generator to create a compelling, 
        professional cover image that matches the blog post's theme and tone.
      `

      const { text } = await generateText({
        model: openai("gpt-4o"),
        prompt: prompt,
      })

      return text
    } catch (error) {
      console.error("Error generating image prompt:", error)
      throw new Error("Failed to generate image prompt. Please try again later.")
    }
  },

  // Improve SEO for a blog post
  improveSEO: async (
    title: string,
    content: string,
  ): Promise<{
    improvedTitle: string
    metaDescription: string
    seoSuggestions: string[]
  }> => {
    try {
      const prompt = `
        Analyze the following blog post title and content for SEO optimization:
        
        Title: "${title}"
        
        Content excerpt: "${content.substring(0, 500)}..."
        
        Provide:
        1. An SEO-optimized version of the title
        2. A compelling meta description under 160 characters
        3. A list of 5 SEO improvement suggestions
        
        Format as JSON:
        {
          "improvedTitle": "SEO optimized title",
          "metaDescription": "Compelling meta description under 160 characters",
          "seoSuggestions": ["suggestion1", "suggestion2", "suggestion3", "suggestion4", "suggestion5"]
        }
      `

      const { text } = await generateText({
        model: openai("gpt-4o"),
        prompt: prompt,
      })

      return JSON.parse(text)
    } catch (error) {
      console.error("Error improving SEO:", error)
      throw new Error("Failed to generate SEO improvements. Please try again later.")
    }
  },

  // Schedule autoposting
  scheduleAutopost: async (
    topicIdeas: string[],
    schedule: AutopostSchedule,
    contentParams: ContentGenerationParams,
  ): Promise<{ message: string; scheduledDates: string[] }> => {
    try {
      // This would connect to your scheduling system
      // For now, we'll simulate a response
      const scheduledDates = []
      const now = new Date()

      if (schedule.frequency === "daily") {
        for (let i = 1; i <= 7; i++) {
          const date = new Date(now)
          date.setDate(now.getDate() + i)
          scheduledDates.push(date.toISOString().split("T")[0])
        }
      } else if (schedule.frequency === "weekly") {
        for (let i = 1; i <= 4; i++) {
          const date = new Date(now)
          date.setDate(now.getDate() + i * 7)
          scheduledDates.push(date.toISOString().split("T")[0])
        }
      }

      return {
        message: `Successfully scheduled ${topicIdeas.length} posts for autoposting`,
        scheduledDates,
      }
    } catch (error) {
      console.error("Error scheduling autopost:", error)
      throw new Error("Failed to schedule autoposting. Please try again later.")
    }
  },
}

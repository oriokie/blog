// Types for ad configuration
export interface AdConfig {
  enabled: boolean
  slots: {
    header?: string
    sidebar?: string
    inContent?: string
    footer?: string
  }
  frequency: number // How often to show in-content ads (every N paragraphs)
  excludedCategories?: string[] // Categories where ads should not appear
  excludedPages?: string[] // Specific pages where ads should not appear
}

// Default configuration
const defaultConfig: AdConfig = {
  enabled: true,
  slots: {
    header: "1234567890",
    sidebar: "0987654321",
    inContent: "1122334455",
    footer: "5544332211",
  },
  frequency: 3,
  excludedCategories: ["premium"],
  excludedPages: ["/about", "/privacy-policy"],
}

// Get ad configuration
export const getAdConfig = async (): Promise<AdConfig> => {
  try {
    // In a real app, this would fetch from an API or database
    // For now, we'll return the default config
    return defaultConfig
  } catch (error) {
    console.error("Error fetching ad configuration:", error)
    return defaultConfig
  }
}

// Check if ads should be shown on a specific page
export const shouldShowAds = (path: string, category?: string): boolean => {
  if (defaultConfig.excludedPages?.includes(path)) {
    return false
  }

  if (category && defaultConfig.excludedCategories?.includes(category)) {
    return false
  }

  return defaultConfig.enabled
}

// Insert in-content ads into HTML content
export const insertInContentAds = (content: string, adSlot: string): string => {
  if (!content || !adSlot || !defaultConfig.enabled) {
    return content
  }

  const paragraphs = content.split("</p>")
  if (paragraphs.length <= defaultConfig.frequency) {
    return content
  }

  const adHtml = `</p><div class="my-6"><ins class="adsbygoogle"
    style="display:block"
    data-ad-client="${process.env.NEXT_PUBLIC_GOOGLE_AD_CLIENT}"
    data-ad-slot="${adSlot}"
    data-ad-format="auto"
    data-full-width-responsive="true"></ins></div>`

  let result = ""
  paragraphs.forEach((paragraph, index) => {
    result += paragraph
    if ((index + 1) % defaultConfig.frequency === 0 && index < paragraphs.length - 1) {
      result += adHtml
    } else if (index < paragraphs.length - 1) {
      result += "</p>"
    }
  })

  return result
}

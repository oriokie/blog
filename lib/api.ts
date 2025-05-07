import axios from "axios"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api"

export const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
})

// Auth API
export const authAPI = {
  register: (userData: any) => api.post("/auth/register", userData),
  login: (credentials: any) => api.post("/auth/login", credentials),
  logout: () => api.post("/auth/logout"),
  getCurrentUser: () => api.get("/auth/me"),
}

// Posts API
export const postsAPI = {
  getPosts: (params?: any) => api.get("/posts", { params }),
  getFeaturedPosts: () => api.get("/posts/featured"),
  getRecentPosts: () => api.get("/posts/recent"),
  getTrendingPosts: () => api.get("/recommendations/trending"),
  getPost: (id: string) => api.get(`/posts/${id}`),
  createPost: (postData: any) => api.post("/posts", postData),
  updatePost: (id: string, postData: any) => api.put(`/posts/${id}`, postData),
  deletePost: (id: string) => api.delete(`/posts/${id}`),
  getComments: (params?: any) => api.get("/comments", { params }),
  getComment: (id: string) => api.get(`/comments/${id}`),
  deleteComment: (id: string) => api.delete(`/comments/${id}`),
  replyToComment: (id: string, text: string) => api.post(`/comments/${id}/reply`, { text }),
  addComment: async (postId: string, commentData: any) => {
    try {
      const response = await api.post(`/posts/${postId}/comments`, commentData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  likePost: (id: string) => api.post(`/posts/${id}/like`),
  getDrafts: () => api.get("/posts/drafts"),
  getScheduledPosts: () => api.get("/posts/scheduled"),
  publishPost: (id: string) => api.post(`/posts/${id}/publish`),
  unpublishPost: (id: string) => api.post(`/posts/${id}/unpublish`),
  schedulePost: (id: string, date: string) => api.post(`/posts/${id}/schedule`, { date }),
  getRecommendations: (id: string, limit?: number) => api.get(`/posts/${id}/recommendations`, { params: { limit } }),
  getBookmarked: () => api.get("/posts/bookmarked"),
}

// Users API
export const usersAPI = {
  updateProfile: (userData: any) => api.put("/users/profile", userData),
  changePassword: (passwordData: any) => api.put("/users/password", passwordData),
  getUsers: () => api.get("/users"),
}

// Dashboard API
export const dashboardAPI = {
  getStats: () => api.get("/dashboard/stats"),
  getViewsData: () => api.get("/dashboard/views"),
  getEngagementData: () => api.get("/dashboard/engagement"),
  getRecentPosts: () => api.get("/dashboard/recent-posts"),
}

// Categories API
export const categoriesAPI = {
  getCategories: () => api.get("/categories"),
  getCategory: (id: string) => api.get(`/categories/${id}`),
  getCategoryPosts: (id: string, params?: any) => api.get(`/categories/${id}/posts`, { params }),
  createCategory: (categoryData: any) => api.post("/categories", categoryData),
  updateCategory: (id: string, categoryData: any) => api.put(`/categories/${id}`, categoryData),
  deleteCategory: (id: string) => api.delete(`/categories/${id}`),
}

// Tags API
export const tagsAPI = {
  getTags: () => api.get("/tags"),
  getTag: (id: string) => api.get(`/tags/${id}`),
  getTagPosts: (id: string, params?: any) => api.get(`/tags/${id}/posts`, { params }),
  createTag: (tagData: any) => api.post("/tags", tagData),
  updateTag: (id: string, tagData: any) => api.put(`/tags/${id}`, tagData),
  deleteTag: (id: string) => api.delete(`/tags/${id}`),
}

// Media API
export const mediaAPI = {
  getMedia: (params?: any) => api.get("/media", { params }),
  getMediaItem: (id: string) => api.get(`/media/${id}`),
  uploadMedia: (formData: FormData) =>
    api.post("/media", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),
  updateMedia: (id: string, mediaData: any) => api.put(`/media/${id}`, mediaData),
  deleteMedia: (id: string) => api.delete(`/media/${id}`),
}

// Comments API
export const commentsAPI = {
  getComments: (params?: any) => api.get("/comments", { params }),
  getComment: (id: string) => api.get(`/comments/${id}`),
  deleteComment: (id: string) => api.delete(`/comments/${id}`),
}

// Analytics API
export const analyticsAPI = {
  getDashboardStats: () => api.get("/analytics/dashboard"),
  getPostAnalytics: (id: string) => api.get(`/analytics/posts/${id}`),
  getTrafficSources: () => api.get("/analytics/traffic"),
  getReaderDemographics: () => api.get("/analytics/demographics"),
  getReadingStats: () => api.get("/analytics/reading-stats"),
  getReadingHistory: (limit = 10) => api.get(`/analytics/reading-history?limit=${limit}`),
}

// Newsletter API
export const newsletterAPI = {
  subscribe: (email: string) => api.post("/newsletter/subscribe", { email }),
  unsubscribe: (email: string) => api.post("/newsletter/unsubscribe", { email }),
  getSubscribers: (params?: any) => api.get("/newsletter/subscribers", { params }),
}

// Settings API
export const settingsAPI = {
  getSiteSettings: () => api.get("/settings/site"),
  updateSiteSettings: (settingsData: any) => api.put("/settings/site", settingsData),
  getAppearanceSettings: () => api.get("/settings/appearance"),
  updateAppearanceSettings: (settingsData: any) => api.put("/settings/appearance", settingsData),
  getExitPopupSettings: () => api.get("/settings/exit-popup"),
  updateExitPopupSettings: (settingsData: any) => api.put("/settings/exit-popup", settingsData),
}

// M-Pesa API
export const mpesaAPI = {
  getConfig: () => api.get("/mpesa/config"),
  updateConfig: (configData: any) => api.post("/mpesa/config", configData),
  initiatePayment: (phoneNumber: string, amount: number, reference?: string, description?: string) =>
    api.post("/mpesa/initiate", {
      phoneNumber,
      amount,
      accountReference: reference,
      transactionDesc: description,
    }),
  checkStatus: (checkoutRequestID: string) => api.get(`/mpesa/status/${checkoutRequestID}`),
}

// Bookmark API
export const bookmarkAPI = {
  getBookmarks: () => api.get("/bookmarks"),
  addBookmark: (postId: string) => api.post(`/bookmarks/${postId}`),
  removeBookmark: (postId: string) => api.delete(`/bookmarks/${postId}`),
  checkBookmarkStatus: (postId: string) => api.get(`/bookmarks/${postId}/status`),
}

// Sponsored Content API
export const sponsoredContentAPI = {
  getAll: (params?: any) => api.get("/sponsored", { params }),
  getById: (id: string) => api.get(`/sponsored/${id}`),
  create: (data: any) => api.post("/sponsored", data),
  update: (id: string, data: any) => api.put(`/sponsored/${id}`, data),
  delete: (id: string) => api.delete(`/sponsored/${id}`),
  getForPlacement: (placement: string, params?: any) =>
    api.get("/sponsored/placement", { params: { placement, ...params } }),
  trackView: (id: string) => api.post(`/sponsored/${id}/view`),
  trackClick: (id: string) => api.post(`/sponsored/${id}/click`),
}

// Subscription API
export const subscriptionAPI = {
  getUserSubscription: () => api.get("/subscriptions/my-subscription"),
  create: (data: any) => api.post("/subscriptions", data),
  cancel: (reason: string) => api.post("/subscriptions/cancel", { cancelReason: reason }),
  renew: (data: any) => api.post("/subscriptions/renew", data),
  checkAdFreeAccess: () => api.get("/subscriptions/ad-free"),
  getAll: (params?: any) => api.get("/subscriptions", { params }),
  getAnalytics: () => api.get("/subscriptions/analytics"),
}
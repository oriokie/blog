import axios from "axios"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"

const api = axios.create({
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
  getPost: (id: string) => api.get(`/posts/${id}`),
  createPost: (postData: any) => api.post("/posts", postData),
  updatePost: (id: string, postData: any) => api.put(`/posts/${id}`, postData),
  deletePost: (id: string) => api.delete(`/posts/${id}`),
  addComment: (id: string, text: string) => api.post(`/posts/${id}/comments`, { text }),
  likePost: (id: string) => api.post(`/posts/${id}/like`),
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

export default api

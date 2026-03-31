import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

console.log('🔌 API Base URL:', API_BASE_URL)

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 35000, // 35 second timeout
})

// Add request interceptor for better error messages
api.interceptors.request.use(
  (config) => {
    console.log('📤 API Request:', config.method.toUpperCase(), config.url)
    return config
  },
  (error) => {
    console.error('❌ Request Error:', error)
    return Promise.reject(error)
  }
)

// Add response interceptor for better error messages
api.interceptors.response.use(
  (response) => {
    console.log('✅ API Response:', response.status, response.data)
    return response
  },
  (error) => {
    console.error('❌ Response Error:', error.response?.status, error.response?.data || error.message)
    return Promise.reject(error)
  }
)

export const chatAPI = {
  // Send a message and get AI response
  sendMessage: async (userId, message, personality = null, messageId = null) => {
    try {
      console.log('💬 Sending message from user:', userId, messageId ? `(editing message ${messageId})` : '')
      
      const response = await api.post('/chat', {
        user_id: userId,
        message: message,
        personality: personality || {
          tone: 'Caring',
          energy: 'Chill',
          response_style: 'Medium',
        },
        message_id: messageId,  // For editing/regenerating
      })
      
      if (!response.data?.response) {
        throw new Error('Invalid response format from server')
      }
      
      return response.data
    } catch (error) {
      console.error('💥 Error sending message:', error)
      
      let errorMessage = 'Failed to send message'
      
      if (error.response?.status === 400) {
        errorMessage = 'Invalid message. Please try again.'
      } else if (error.response?.status === 500) {
        errorMessage = 'Server error: ' + (error.response.data?.detail || 'Unknown error')
      } else if (error.code === 'ECONNABORTED') {
        errorMessage = 'Request timeout. Backend might be slow or offline.'
      } else if (error.message === 'Network Error') {
        errorMessage = 'Network error. Check your connection or backend URL.'
      } else if (error.response?.status === 0) {
        errorMessage = 'Cannot connect to backend. Make sure API is running on ' + API_BASE_URL
      }
      
      throw new Error(errorMessage)
    }
  },

  // Get chat history for a user
  getHistory: async (userId) => {
    try {
      const response = await api.get(`/history/${userId}`)
      return response.data.messages || []
    } catch (error) {
      console.error('Error fetching history:', error)
      return [] // Return empty array on error
    }
  },

  // Clear chat history
  clearHistory: async (userId) => {
    try {
      const response = await api.post(`/clear/${userId}`)
      return response.data
    } catch (error) {
      console.error('Error clearing history:', error)
      throw error
    }
  },

  // Save user preferences
  setPreferences: async (userId, aiName, personality) => {
    try {
      const response = await api.post('/preferences', null, {
        params: {
          user_id: userId,
          ai_name: aiName,
          personality: personality ? JSON.stringify(personality) : null,
        },
      })
      return response.data
    } catch (error) {
      console.error('Error setting preferences:', error)
      throw error
    }
  },

  // Get user preferences
  getPreferences: async (userId) => {
    try {
      const response = await api.get(`/preferences/${userId}`)
      return response.data
    } catch (error) {
      console.error('Error fetching preferences:', error)
      return {
        ai_name: 'Luna',
        personality: {
          tone: 'Caring',
          energy: 'Chill',
          response_style: 'Medium',
        },
      }
    }
  },

  // Generate a new avatar for user
  generateAvatar: async (userId) => {
    try {
      console.log('🎨 Generating avatar for user:', userId)
      const response = await api.post(`/avatar/generate`, null, {
        params: {
          user_id: userId,
        },
      })
      console.log('✅ Avatar generated:', response.data.avatar_url)
      return response.data
    } catch (error) {
      console.error('❌ Error generating avatar:', error)
      throw new Error('Failed to generate avatar: ' + (error.response?.data?.detail || error.message))
    }
  },

  // Get user's avatar
  getAvatar: async (userId) => {
    try {
      console.log('🖼️ Fetching avatar for user:', userId)
      const response = await api.get(`/avatar/${userId}`)
      console.log('✅ Avatar fetched:', response.data.avatar_url)
      return response.data
    } catch (error) {
      console.error('❌ Error fetching avatar:', error)
      // Return default avatar if error
      return {
        avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=default_${userId}`,
        user_id: userId,
      }
    }
  },
}

export default api

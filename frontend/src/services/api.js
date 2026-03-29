import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

export const chatAPI = {
  // Send a message and get AI response
  sendMessage: async (userId, message, personality = null) => {
    try {
      const response = await api.post('/chat', {
        user_id: userId,
        message: message,
        personality: personality || {
          tone: 'Caring',
          energy: 'Chill',
          response_style: 'Medium',
        },
      })
      return response.data
    } catch (error) {
      console.error('Error sending message:', error)
      throw error
    }
  },

  // Get chat history for a user
  getHistory: async (userId) => {
    try {
      const response = await api.get(`/history/${userId}`)
      return response.data.messages || []
    } catch (error) {
      console.error('Error fetching history:', error)
      throw error
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
        },
        data: personality,
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
}

export default api

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { chatAPI } from './services/api'
import Sidebar from './components/Sidebar'
import MessageList from './components/MessageList'
import ChatInput from './components/ChatInput'
import PersonalityModal from './components/PersonalityModal'

function App() {
  const [chatHistories, setChatHistories] = useState([])
  const [currentChat, setCurrentChat] = useState(null)
  const [currentMessages, setCurrentMessages] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [preferences, setPreferences] = useState({
    ai_name: 'Luna',
    personality: {
      tone: 'Caring',
      energy: 'Chill',
      response_style: 'Medium',
    },
  })

  // Generate unique user ID (persisted in localStorage)
  const userId = (() => {
    let id = localStorage.getItem('besti_user_id')
    if (!id) {
      id = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      localStorage.setItem('besti_user_id', id)
      console.log('Generated new user ID:', id)
    }
    return id
  })()

  // Load preferences and chat history on mount
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        console.log('Loading initial data for user:', userId)

        // Load preferences
        const prefs = await chatAPI.getPreferences(userId)
        console.log('Loaded preferences:', prefs)
        setPreferences(prefs)

        // Load chat history
        const history = await chatAPI.getHistory(userId)
        console.log('Loaded chat history:', history)

        if (history && history.length > 0) {
          // Create default chat with existing messages
          const defaultChat = {
            id: 'default',
            name: 'Previous Conversation',
            preview: history[history.length - 1]?.content?.substring(0, 40) + '...' || 'Continue chatting...',
            messages: history,
          }
          setChatHistories([defaultChat])
          setCurrentChat(defaultChat)
          setCurrentMessages(history)
        } else {
          console.log('No previous history found')
        }
      } catch (error) {
        console.error('Error loading initial data:', error)
        setError('Failed to load previous data')
      }
    }

    loadInitialData()
  }, [userId])

  // Handle sending a message
  const handleSendMessage = async (message) => {
    if (!message.trim()) return

    setError(null) // Clear previous errors

    console.log('Sending message:', message)

    // Add user message to current chat
    const newMessages = [...currentMessages, { role: 'user', content: message }]
    setCurrentMessages(newMessages)
    setIsLoading(true)

    try {
      console.log('Calling chat API...')

      // Send message to backend
      const response = await chatAPI.sendMessage(userId, message, preferences.personality)

      console.log('Received response:', response)

      if (!response.response) {
        throw new Error('Empty response from AI')
      }

      // Add AI response
      const messagesWithResponse = [
        ...newMessages,
        { role: 'assistant', content: response.response },
      ]
      setCurrentMessages(messagesWithResponse)

      // Update chat history in sidebar
      if (currentChat) {
        const updatedChat = {
          ...currentChat,
          preview: response.response.substring(0, 50) + '...',
          messages: messagesWithResponse,
        }
        setCurrentChat(updatedChat)

        const updatedHistories = chatHistories.map((chat) =>
          chat.id === currentChat.id ? updatedChat : chat
        )
        setChatHistories(updatedHistories)
      }
    } catch (error) {
      console.error('Error sending message:', error)

      const errorMessage = error.message || 'Failed to get response from AI'
      setError(errorMessage)

      // Remove the last user message if there's an error
      setCurrentMessages(newMessages.slice(0, -1))
    } finally {
      setIsLoading(false)
    }
  }

  // Handle new chat
  const handleNewChat = () => {
    const newChat = {
      id: `chat_${Date.now()}`,
      name: `Chat ${new Date().toLocaleDateString()}`,
      preview: 'New conversation',
      messages: [],
    }
    setChatHistories([newChat, ...chatHistories])
    setCurrentChat(newChat)
    setCurrentMessages([])
    setError(null)
  }

  // Handle select chat
  const handleSelectChat = (chat) => {
    setCurrentChat(chat)
    setCurrentMessages(chat.messages || [])
    setError(null)
  }

  // Handle settings save
  const handleSavePreferences = async (newPrefs) => {
    try {
      console.log('Saving preferences:', newPrefs)
      await chatAPI.setPreferences(userId, newPrefs.ai_name, newPrefs.personality)
      setPreferences(newPrefs)
      setIsSettingsOpen(false)
      console.log('Preferences saved successfully')
    } catch (error) {
      console.error('Error saving preferences:', error)
      setError('Failed to save preferences')
    }
  }

  return (
    <div className="flex h-screen overflow-hidden bg-gradient-to-br from-purple-50 via-white to-pink-50">
      {/* Sidebar */}
      <Sidebar
        chatHistories={chatHistories}
        onNewChat={handleNewChat}
        onSelectChat={handleSelectChat}
        onOpenSettings={() => setIsSettingsOpen(true)}
        currentChatId={currentChat?.id}
      />

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Chat Header */}
        <motion.div className="bg-white/80 backdrop-blur-lg border-b border-white/20 px-6 py-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <motion.h2
                key={preferences.ai_name}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-2xl font-bold text-gray-800"
              >
                {preferences.ai_name}
              </motion.h2>
              <motion.p className="text-xs text-gray-500 font-medium mt-1">
                {isLoading ? '💭 thinking...' : '🟢 online'}
              </motion.p>
            </div>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsSettingsOpen(true)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-all"
              title="Customize AI"
            >
              ⚙️
            </motion.button>
          </div>
        </motion.div>

        {/* Message Area */}
        <div className="flex-1 overflow-hidden flex flex-col">
          {currentChat ? (
            <>
              <MessageList
                messages={currentMessages}
                aiName={preferences.ai_name}
                isLoading={isLoading}
                error={error}
              />
              <ChatInput
                onSendMessage={handleSendMessage}
                isLoading={isLoading}
                error={error}
              />
            </>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center justify-center h-full"
            >
              <div className="text-center max-w-sm">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center mx-auto mb-6 shadow-premium text-5xl"
                >
                  💬
                </motion.div>
                <h1 className="text-4xl font-bold text-gray-800 mb-3">Welcome to Besti</h1>
                <p className="text-gray-600 text-sm mb-6 leading-relaxed">
                  Your AI best friend is ready. Start a conversation and let's connect.
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleNewChat}
                  className="px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full font-semibold hover:shadow-lg shadow-purple-500/50 transition-all"
                >
                  Start Chatting + New Chat
                </motion.button>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Settings Modal */}
      <PersonalityModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onSave={handleSavePreferences}
        currentPreferences={preferences}
      />
    </div>
  )
}

export default App

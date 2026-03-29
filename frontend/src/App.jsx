import React, { useState, useEffect } from 'react'
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
    }
    return id
  })()

  // Load preferences and chat history on mount
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        // Load preferences
        const prefs = await chatAPI.getPreferences(userId)
        setPreferences(prefs)

        // Load chat history
        const history = await chatAPI.getHistory(userId)
        
        if (history.length > 0) {
          // Create default chat with existing messages
          const defaultChat = {
            id: 'default',
            name: 'Conversation',
            preview: history[history.length - 1]?.content || 'Start chatting...',
            messages: history,
          }
          setChatHistories([defaultChat])
          setCurrentChat(defaultChat)
          setCurrentMessages(history)
        }
      } catch (error) {
        console.error('Error loading initial data:', error)
      }
    }

    loadInitialData()
  }, [userId])

  // Handle sending a message
  const handleSendMessage = async (message) => {
    if (!message.trim()) return

    // Add user message to current chat
    const newMessages = [...currentMessages, { role: 'user', content: message }]
    setCurrentMessages(newMessages)
    setIsLoading(true)

    try {
      // Send message to backend
      const response = await chatAPI.sendMessage(userId, message, preferences.personality)
      
      // Add AI response
      const messagesWithResponse = [...newMessages, { role: 'assistant', content: response.response }]
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
      // Add error message
      const errorMessages = [
        ...newMessages,
        { role: 'assistant', content: 'Sorry, I encountered an error. Please make sure the backend is running and try again.' },
      ]
      setCurrentMessages(errorMessages)
    } finally {
      setIsLoading(false)
    }
  }

  // Handle new chat
  const handleNewChat = () => {
    const newChat = {
      id: `chat_${Date.now()}`,
      name: `Chat ${chatHistories.length + 1}`,
      preview: 'New conversation',
      messages: [],
    }
    setChatHistories([...chatHistories, newChat])
    setCurrentChat(newChat)
    setCurrentMessages([])
  }

  // Handle select chat
  const handleSelectChat = (chat) => {
    setCurrentChat(chat)
    setCurrentMessages(chat.messages)
  }

  // Handle settings save
  const handleSavePreferences = async (newPrefs) => {
    try {
      await chatAPI.setPreferences(userId, newPrefs.ai_name, newPrefs.personality)
      setPreferences(newPrefs)
      setIsSettingsOpen(false)
    } catch (error) {
      console.error('Error saving preferences:', error)
    }
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar
        chatHistories={chatHistories}
        onNewChat={handleNewChat}
        onSelectChat={handleSelectChat}
        onOpenSettings={() => setIsSettingsOpen(true)}
        currentChatId={currentChat?.id}
      />

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">{preferences.ai_name}</h2>
              <p className="text-sm text-gray-500">
                {isLoading ? 'thinking…' : 'online'}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setIsSettingsOpen(true)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-all"
                title="Settings"
              >
                ⚙️
              </button>
            </div>
          </div>
        </div>

        {/* Message Area */}
        <div className="flex-1 gradient-bg overflow-hidden">
          {currentChat ? (
            <div className="flex flex-col h-full">
              <MessageList
                messages={currentMessages}
                aiName={preferences.ai_name}
                isLoading={isLoading}
              />
              <ChatInput
                onSendMessage={handleSendMessage}
                isLoading={isLoading}
              />
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <span className="text-5xl">💬</span>
                </div>
                <h1 className="text-4xl font-bold text-gray-800 mb-2">Welcome to Besti</h1>
                <p className="text-gray-600 mb-6">Start a new conversation with your AI best friend</p>
                <button
                  onClick={handleNewChat}
                  className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full font-semibold hover:shadow-lg transition-all"
                >
                  New Chat
                </button>
              </div>
            </div>
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

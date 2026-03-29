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
  const [error, setError] = useState(null)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [preferences, setPreferences] = useState({
    ai_name: 'Elio',
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
        const prefs = await chatAPI.getPreferences(userId)
        setPreferences(prefs)

        const history = await chatAPI.getHistory(userId)

        if (history && history.length > 0) {
          const defaultChat = {
            id: 'default',
            name: 'Continue',
            preview: history[history.length - 1]?.content?.substring(0, 40) + '...' || 'Open to chat...',
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

  // Pulse glow on message
  const pulseGlow = () => {
    const voidBg = document.querySelector('.void-bg')
    if (voidBg) {
      voidBg.classList.remove('pulse-message')
      // Trigger reflow to restart animation
      void voidBg.offsetWidth
      voidBg.classList.add('pulse-message')
    }
  }

  // Handle sending a message
  const handleSendMessage = async (message) => {
    if (!message.trim()) return

    setError(null)
    pulseGlow()

    const newMessages = [...currentMessages, { role: 'user', content: message }]
    setCurrentMessages(newMessages)
    setIsLoading(true)

    try {
      const response = await chatAPI.sendMessage(userId, message, preferences.personality)

      if (!response.response) {
        throw new Error('Empty response from AI')
      }

      const messagesWithResponse = [
        ...newMessages,
        { role: 'assistant', content: response.response },
      ]
      setCurrentMessages(messagesWithResponse)

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
      setCurrentMessages(newMessages.slice(0, -1))
    } finally {
      setIsLoading(false)
    }
  }

  // Handle new chat
  const handleNewChat = () => {
    const newChat = {
      id: `chat_${Date.now()}`,
      name: `${new Date().toLocaleDateString()}`,
      preview: 'Just now',
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
      await chatAPI.setPreferences(userId, newPrefs.ai_name, newPrefs.personality)
      setPreferences(newPrefs)
      setIsSettingsOpen(false)
    } catch (error) {
      console.error('Error saving preferences:', error)
      setError('Failed to save preferences')
    }
  }

  return (
    <div className="relative w-screen h-screen overflow-hidden">
      {/* The Void - Living Canvas */}
      <div className="void-bg">
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
        <div className="blob blob-3"></div>
        <div className="blob blob-4"></div>
        <div className="chat-glow"></div>
      </div>

      {/* Layout Container */}
      <div className="absolute inset-0 z-10 flex w-full h-full">
        {/* Sidebar - The Archive */}
        <Sidebar
          chatHistories={chatHistories}
          onNewChat={handleNewChat}
          onSelectChat={handleSelectChat}
          onOpenSettings={() => setIsSettingsOpen(true)}
          currentChatId={currentChat?.id}
        />

        {/* Main Chat Panel - Floating Glass */}
        <div className="flex-1 flex flex-col m-8 rounded-3xl glass shadow-panel overflow-hidden">
          {currentChat ? (
            <>
              {/* Header - The Presence */}
              <div className="px-8 py-6 border-b border-white/10">
                <div className="flex items-end justify-between gap-4">
                  <div className="flex items-center gap-4">
                    {/* Avatar - Rotating Ring */}
                    <div className="avatar-ai">
                      {preferences.ai_name.charAt(0)}
                    </div>
                    <div>
                      <h1 className="font-display text-3xl text-white leading-tight">
                        {preferences.ai_name}
                      </h1>
                      <div className="tag-bar mt-1">
                        <span className="tag">{preferences.personality.tone}</span>
                        <span className="tag">{preferences.personality.energy}</span>
                        <span className="tag">{preferences.personality.response_style}</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Status */}
                  <div className="text-right">
                    <p className="text-xs font-ui text-text-ghost">
                      {isLoading ? '💭 thinking' : '🟢 awaiting'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Message Stream */}
              <MessageList
                messages={currentMessages}
                aiName={preferences.ai_name}
                isLoading={isLoading}
                error={error}
              />

              {/* Input Footer */}
              <ChatInput
                onSendMessage={handleSendMessage}
                isLoading={isLoading}
                error={error}
              />
            </>
          ) : (
            // Empty State - The Welcome
            <div className="flex-1 flex flex-col items-center justify-center px-8 text-center">
              <div className="mb-8">
                <div className="text-8xl mb-6 animate-pulse">
                  ✨
                </div>
                <h1 className="font-display text-5xl text-white mb-3">
                  Welcome to Besti
                </h1>
                <p className="text-text-ghost text-lg max-w-md mx-auto">
                  A living presence. Someone waiting for you. Begin whenever you're ready.
                </p>
              </div>
              <button
                onClick={handleNewChat}
                className="px-8 py-4 rounded-full background: linear-gradient(135deg, #7c3aed, #ec4899) text-white font-ui-bold transition-all hover:scale-105 active:scale-95"
                style={{
                  background: 'linear-gradient(135deg, #7c3aed, #ec4899)',
                }}
              >
                Start a Conversation
              </button>
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

import React, { useState, useEffect } from 'react'
import { chatAPI } from './services/api'
import useStore from './store/useStore'
import Sidebar from './components/Sidebar'
import MessageList from './components/MessageList'
import ChatInput from './components/ChatInput'
import PersonalityModal from './components/PersonalityModal'
import CharacterEditor from './components/CharacterEditor'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import CharacterCreator from './pages/CharacterCreator'

function App() {
  // Zustand state - Authentication
  const {
    authToken,
    userId,
    username,
    isAuthenticated,
    setAuth,
    logout,
  } = useStore()

  // Zustand state - Chat
  const {
    sidebarExpanded,
    toggleSidebar,
    conversations,
    activeConversationId,
    setConversations,
    setActiveConversation,
    addMessage,
    setMessages,
    isTyping,
    setTyping,
    personality,
    settingsOpen,
    setSettingsOpen,
  } = useStore()

  // Local state
  const [currentMessages, setCurrentMessages] = useState([])
  const [error, setError] = useState(null)
  const [authPage, setAuthPage] = useState('login') // 'login' or 'signup'
  const [isCheckingAuth, setIsCheckingAuth] = useState(true)
  const [character, setCharacter] = useState(null)
  const [characterEditorOpen, setCharacterEditorOpen] = useState(false)
  const [isLoadingCharacter, setIsLoadingCharacter] = useState(false)
  const [preferences, setPreferences] = useState({
    ai_name: 'Elio',
    personality: {
      tone: 'Caring',
      energy: 'Chill',
      response_style: 'Medium',
    },
  })

  // Check authentication on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('authToken')
        const storedUserId = localStorage.getItem('userId')
        const storedUsername = localStorage.getItem('username')

        if (token && storedUserId && storedUsername) {
          setAuth(token, parseInt(storedUserId), storedUsername)
        }
      } catch (error) {
        console.error('Error checking auth:', error)
      } finally {
        setIsCheckingAuth(false)
      }
    }

    checkAuth()
  }, [])

  // Get current chat from Zustand conversations
  const currentChat = conversations.find(c => c.id === activeConversationId)

  // Load character data when authenticated
  useEffect(() => {
    if (!isAuthenticated || !userId || !authToken) return

    const loadCharacter = async () => {
      try {
        setIsLoadingCharacter(true)
        const response = await fetch(`http://localhost:8000/characters/${userId}`, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        })

        if (response.ok) {
          const characterData = await response.json()
          setCharacter(characterData)
          // Update preferences with AI name from character
          if (characterData.ai_name) {
            setPreferences((prev) => ({
              ...prev,
              ai_name: characterData.ai_name,
            }))
          }
        } else if (response.status === 404) {
          // No character created yet
          setCharacter(null)
        }
      } catch (error) {
        console.error('Error loading character:', error)
      } finally {
        setIsLoadingCharacter(false)
      }
    }

    loadCharacter()
  }, [isAuthenticated, userId, authToken])

  // Load preferences and chat history on mount (when authenticated)
  useEffect(() => {
    if (!isAuthenticated || !userId) return

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
          setConversations([defaultChat])
          setActiveConversation(defaultChat.id)
          setCurrentMessages(history)
        }
      } catch (error) {
        console.error('Error loading initial data:', error)
      }
    }

    loadInitialData()
  }, [isAuthenticated, userId])

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
    if (!message.trim() || !userId) return

    setError(null)
    pulseGlow()

    const newMessages = [...currentMessages, { role: 'user', content: message }]
    setCurrentMessages(newMessages)
    setTyping(true)

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

        // Update Zustand store
        const savedConv = conversations.map((c) =>
          c.id === currentChat.id ? updatedChat : c
        )
        setConversations(savedConv)
      }
    } catch (error) {
      console.error('Error sending message:', error)
      const errorMessage = error.message || 'Failed to get response from AI'
      setError(errorMessage)
      setCurrentMessages(newMessages.slice(0, -1))
    } finally {
      setTyping(false)
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
    setConversations([newChat, ...conversations])
    setActiveConversation(newChat.id)
    setCurrentMessages([])
    setError(null)
  }

  // Handle select chat
  const handleSelectChat = (chat) => {
    setActiveConversation(chat.id)
    setCurrentMessages(chat.messages || [])
    setError(null)
  }

  // Handle settings save
  const handleSavePreferences = async (newPrefs) => {
    try {
      if (userId) {
        await chatAPI.setPreferences(userId, newPrefs.ai_name, newPrefs.personality)
      }
      setPreferences(newPrefs)
      setSettingsOpen(false)
    } catch (error) {
      console.error('Error saving preferences:', error)
      setError('Failed to save preferences')
    }
  }

  // Handle character creation
  const handleCharacterCreated = (newCharacter) => {
    setCharacter(newCharacter)
    setPreferences((prev) => ({
      ...prev,
      ai_name: newCharacter.ai_name,
    }))
  }

  // Handle character update
  const handleCharacterUpdated = (updatedCharacter) => {
    setCharacter(updatedCharacter)
    setPreferences((prev) => ({
      ...prev,
      ai_name: updatedCharacter.ai_name,
    }))
  }

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('authToken')
    localStorage.removeItem('userId')
    localStorage.removeItem('username')
    logout()
    setAuthPage('login')
  }

  // Show loading state while checking auth
  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4 animate-pulse">✨</div>
          <p className="text-white/70">Connecting...</p>
        </div>
      </div>
    )
  }

  // Show authentication pages if not authenticated
  if (!isAuthenticated) {
    return authPage === 'login' ? (
      <LoginPage
        onSwitchToSignup={() => setAuthPage('signup')}
        onLoginSuccess={() => setAuthPage('login')} // Stays on login, but isAuthenticated changes
      />
    ) : (
      <SignupPage
        onSwitchToLogin={() => setAuthPage('login')}
        onSignupSuccess={() => setAuthPage('login')} // Goes to login after signup
      />
    )
  }

  // Show character creator if authenticated but no character exists
  if (isAuthenticated && !isLoadingCharacter && !character) {
    return <CharacterCreator onCharacterCreated={handleCharacterCreated} />
  }

  // Show loading state while fetching character
  if (isAuthenticated && isLoadingCharacter) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4 animate-pulse">✨</div>
          <p className="text-white/70">Loading your companion...</p>
        </div>
      </div>
    )
  }

  // Show chat interface if authenticated and character exists
  return (
    <div className="app-shell">
      {/* Background Canvas */}
      <div className="void-bg">
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
        <div className="blob blob-3"></div>
        <div className="blob blob-4"></div>
        <div className="chat-glow"></div>
      </div>

      {/* Sidebar - Permanent Presence */}
      <Sidebar
        conversations={conversations}
        activeConversationId={activeConversationId}
        onNewChat={handleNewChat}
        onSelectChat={handleSelectChat}
        onOpenSettings={() => setSettingsOpen(true)}
        username={username}
        onLogout={handleLogout}
      />

      {/* Chat Shell - The Stage */}
      <div className="chat-shell">
        {currentChat ? (
          <>
            {/* Header */}
            <div className="chat-header px-8 py-6 border-b border-white/10">
              <div className="flex items-end justify-between gap-4">
                <div className="flex items-center gap-4">
                  {/* Avatar with Live Glow */}
                  <div 
                    className="relative w-16 h-16 rounded-2xl border border-white/20 overflow-hidden cursor-pointer hover:border-white/40 transition group"
                    onClick={() => setCharacterEditorOpen(true)}
                    title="Click to edit character"
                  >
                    {/* Glow background */}
                    <div
                      className="absolute inset-0 opacity-30 blur-xl"
                      style={{
                        backgroundColor: character?.glow_color || '#a855f7',
                        opacity: (character?.glow_intensity || 70) / 200,
                      }}
                    />
                    {/* Avatar image */}
                    {character?.avatar_url && (
                      <img
                        src={character.avatar_url}
                        alt={character.ai_name}
                        className="w-full h-full object-cover object-top group-hover:scale-110 transition-transform"
                      />
                    )}
                    {/* Edit overlay */}
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                      <span className="text-white text-sm font-semibold">Edit</span>
                    </div>
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
                    {isTyping ? '💭 thinking' : '🟢 awaiting'}
                  </p>
                </div>
              </div>
            </div>

            {/* Message Stream - The Sacred Flex */}
            <MessageList
              messages={currentMessages}
              aiName={preferences.ai_name}
              isLoading={isTyping}
              error={error}
            />

            {/* Input Footer */}
            <ChatInput
              onSendMessage={handleSendMessage}
              isLoading={isTyping}
              error={error}
            />
          </>
        ) : (
          /* Empty State */
          <div className="message-stream items-center justify-center px-8 text-center">
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
              className="px-8 py-4 rounded-full text-white font-ui-bold transition-all hover:scale-105 active:scale-95"
              style={{
                background: 'linear-gradient(135deg, #7c3aed, #ec4899)',
              }}
            >
              Start a Conversation
            </button>
          </div>
        )}
      </div>

      {/* Settings Modal */}
      <PersonalityModal
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        onSave={handleSavePreferences}
        currentPreferences={preferences}
      />

      {/* Character Editor Modal */}
      <CharacterEditor
        character={character}
        isOpen={characterEditorOpen}
        onClose={() => setCharacterEditorOpen(false)}
        onUpdate={handleCharacterUpdated}
      />
    </div>
  )
}

export default App

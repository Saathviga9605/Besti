import React, { useState, useEffect } from 'react'
import { chatAPI } from './services/api'
import useStore from './store/useStore'
import Sidebar from './components/Sidebar'
import MessageList from './components/MessageList'
import ChatInput from './components/ChatInput'
import PersonalityModal from './components/PersonalityModal'
import AvatarPicker from './components/AvatarPicker'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'

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
    pinnedMessages,
    setPinnedMessages,
    addPinnedMessage,
    removePinnedMessage,
  } = useStore()

  // Local state
  const [currentMessages, setCurrentMessages] = useState([])
  const [error, setError] = useState(null)
  const [authPage, setAuthPage] = useState('login') // 'login' or 'signup'
  const [isCheckingAuth, setIsCheckingAuth] = useState(true)
  const [preferences, setPreferences] = useState({
    ai_name: 'Elio',
    personality: {
      tone: 'Caring',
      energy: 'Chill',
      response_style: 'Medium',
    },
  })
  const [avatarUrl, setAvatarUrl] = useState(null)
  const [showAvatarPicker, setShowAvatarPicker] = useState(false)
  const [pinnedMessageIds, setPinnedMessageIds] = useState([])

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

  // Load preferences and chat history on mount (when authenticated)
  useEffect(() => {
    if (!isAuthenticated || !userId) return

    const loadInitialData = async () => {
      try {
        const prefs = await chatAPI.getPreferences(userId)
        setPreferences(prefs)

        // Load avatar
        const avatar = await chatAPI.getAvatar(userId)
        setAvatarUrl(avatar.avatar_url)

        // Load pinned messages
        const pinned = await chatAPI.getPinnedMessages(authToken)
        setPinnedMessages(pinned)
        console.log('📌 Loaded pinned messages:', pinned.length)

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
  const handleSendMessage = async (message, messageId = null) => {
    if (!message.trim()) {
      console.log('❌ Cannot send message: empty text')
      setError('Message cannot be empty')
      return
    }

    if (!userId) {
      console.log('❌ Cannot send message: no userId')
      setError('User ID missing - please log in again')
      return
    }

    console.log('📤 handleSendMessage called:', { message: message.substring(0, 30), messageId, userId, currentChatId: activeConversationId })
    
    setError(null)
    pulseGlow()

    // Save the original state in case we need to roll back
    const originalMessages = currentMessages
    const originalConversations = conversations
    const originalActiveChat = activeConversationId

    try {
      // Create or use existing chat
      let chatId = activeConversationId
      let newConversations = conversations
      
      if (!chatId) {
        console.log('📌 No active chat, creating new...')
        chatId = `chat_${Date.now()}`
        const newChat = {
          id: chatId,
          name: `${new Date().toLocaleDateString()}`,
          preview: 'Sending message...',
          messages: [],
        }
        newConversations = [newChat, ...conversations]
        setConversations(newConversations)
        setActiveConversation(chatId)
        console.log('✅ New chat created:', chatId)
      }

      // Add user message to local state immediately (visual feedback)
      const newMessages = messageId !== null 
        ? currentMessages 
        : [...currentMessages, { role: 'user', content: message }]
      setCurrentMessages(newMessages)
      setTyping(true)

      console.log('🚀 Calling API with userId:', userId)
      const response = await chatAPI.sendMessage(userId, message, preferences.personality, messageId)

      if (!response || !response.response) {
        throw new Error('Invalid response from server - empty or malformed')
      }

      console.log('✅ Got AI response:', response.response.substring(0, 50) + '...')

      // Log typing delay for debugging
      if (response.typing_delay) {
        console.log(`⏱️ Typing delay from API: ${response.typing_delay}ms`)
      }

      // Besti 2.0: Extract emotion data
      if (response.emotion) {
        setCurrentEmotion(response.emotion)
        setEmotionIntensity(response.emotion_intensity || 0.5)
        console.log('😊 Emotion detected:', response.emotion, response.emotion_intensity)
      }

      // Build messages with AI response (include typing_delay for animation)
      const messagesWithResponse = [
        ...newMessages,
        { 
          role: 'assistant', 
          content: response.response,
          typing_delay: response.typing_delay || 0
        },
      ]
      
      console.log('📝 Updated messages, count:', messagesWithResponse.length)
      setCurrentMessages(messagesWithResponse)

      // Update the conversation with new messages
      const updatedChat = {
        id: chatId,
        name: `${new Date().toLocaleDateString()}`,
        preview: response.response.substring(0, 50) + '...',
        messages: messagesWithResponse,
      }

      // Update conversations list
      const existingIndex = newConversations.findIndex(c => c.id === chatId)
      let updatedConversations
      
      if (existingIndex >= 0) {
        // Update existing conversation
        updatedConversations = [...newConversations]
        updatedConversations[existingIndex] = updatedChat
        console.log('🔄 Updated existing conversation at index:', existingIndex)
      } else {
        // Add new conversation
        updatedConversations = [updatedChat, ...newConversations]
        console.log('➕ Added new conversation')
      }

      setConversations(updatedConversations)
      setActiveConversation(chatId)
      
      console.log('✅ All state updated successfully!')
      console.log('   - activeConversationId:', chatId)
      console.log('   - conversations count:', updatedConversations.length)
      console.log('   - messages count:', messagesWithResponse.length)
      
    } catch (error) {
      console.error('❌ Error in handleSendMessage:', error)
      const errorMessage = error.message || 'Failed to send message'
      console.error('   Error details:', errorMessage)
      
      setError(errorMessage)
      setTyping(false)
      
      // Only roll back if it was a new message
      if (messageId === null && originalMessages.length < currentMessages.length) {
        console.log('⏮️ Rolling back message - removing the unsent message')
        setCurrentMessages(originalMessages)
      }
      
      return // Don't continue to finally block below
    }
    
    setTyping(false)
  }

  // Handle editing a message
  const handleEditMessage = async (messageId, editedContent) => {
    console.log(`✏️ Editing message ${messageId}: "${editedContent}"`)
    
    // Update the message in currentMessages
    const updatedMessages = [...currentMessages]
    updatedMessages[messageId] = {
      ...updatedMessages[messageId],
      content: editedContent
    }
    
    // If this is a user message with an AI response following it, regenerate the response
    if (messageId % 2 === 0 && messageId + 1 < updatedMessages.length) {
      // This is a user message with an AI response following it
      // Delete the AI response and regenerate
      const messagesBeforeResponse = updatedMessages.slice(0, messageId + 1)
      setCurrentMessages(messagesBeforeResponse)
      
      // Send the edited message with its ID to backend
      await handleSendMessage(editedContent, messageId)
    }
  }

  // Handle regenerating an AI response
  const handleRegenerateMessage = async (messageId) => {
    console.log(`🔄 Regenerating response for message ${messageId}`)
    
    // Find the user message before this AI response (previous message)
    const userMessageId = messageId - 1
    if (userMessageId < 0 || userMessageId >= currentMessages.length) {
      setError('Could not find the message to regenerate')
      return
    }
    
    const userMessage = currentMessages[userMessageId]
    if (userMessage.role !== 'user') {
      setError('Invalid message structure')
      return
    }
    
    // Remove the AI response 
    const messagesBeforeResponse = currentMessages.slice(0, messageId)
    setCurrentMessages(messagesBeforeResponse)
    
    // Send the user message again with its ID (without incrementing, just replacing the response)
    await handleSendMessage(userMessage.content, userMessageId)
  }

  // Handle pinning a message
  const handlePinMessage = async (messageIdx) => {
    console.log(`📌 Pin/Unpin message at index ${messageIdx}`)
    
    try {
      const messageId = messageIdx // For now, using the index as message ID
      const isCurrentlyPinned = pinnedMessageIds.includes(messageId)
      
      if (isCurrentlyPinned) {
        // Unpin logic
        const pinnedMsg = pinnedMessages.find((pm) => pm.chat_history_id === messageId)
        if (pinnedMsg) {
          await chatAPI.unpinMessage(authToken, pinnedMsg.id)
          removePinnedMessage(pinnedMsg.id)
          setPinnedMessageIds(pinnedMessageIds.filter((id) => id !== messageId))
          console.log('✅ Message unpinned')
        }
      } else {
        // Pin logic - we need the actual chat_history_id from the backend
        // For now, we'll use a generated ID
        const newPinned = {
          id: Date.now(), // Temporary ID until we get it from backend
          chat_history_id: messageId,
          message_content: currentMessages[messageIdx]?.content || '',
          role: currentMessages[messageIdx]?.role || 'user',
          conversation_id: activeConversationId || 'main',
          pinned_at: new Date().toISOString(),
          pinned_note: null,
        }
        
        // Call backend to pin
        try {
          const result = await chatAPI.pinMessage(authToken, messageId)
          addPinnedMessage(result)
          setPinnedMessageIds([...pinnedMessageIds, messageId])
          console.log('✅ Message pinned:', result)
        } catch (err) {
          console.error('Error pinning message:', err)
          setError('Failed to pin message')
        }
      }
    } catch (error) {
      console.error('Error handling pin action:', error)
      setError('Failed to pin/unpin message')
    }
  }

  // Handle select pinned message
  const handleSelectPinnedMessage = (pinnedMsg) => {
    console.log('📌 Selecting pinned message:', pinnedMsg.id)
    // Navigate to the conversation where this message exists
    // For now, we'll just show a toast or notification
    setError(`Viewing pinned message: ${pinnedMsg.message_content?.substring(0, 30)}...`)
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

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('authToken')
    localStorage.removeItem('userId')
    localStorage.removeItem('username')
    logout()
    setAuthPage('login')
  }

  // Handle avatar generation
  const handleGenerateNewAvatar = async () => {
    if (!userId) return
    try {
      const result = await chatAPI.generateAvatar(userId)
      setAvatarUrl(result.avatar_url)
      setShowAvatarPicker(false)
    } catch (error) {
      console.error('Error generating avatar:', error)
      setError('Failed to generate avatar')
    }
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

  // Show chat interface if authenticated
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
        pinnedMessages={pinnedMessages}
        onSelectPinnedMessage={handleSelectPinnedMessage}
      />

      {/* Chat Shell - The Stage */}
      <div className="chat-shell">
        {currentChat ? (
          <>
            {/* Header */}
            <div className="chat-header px-8 py-6 border-b border-white/10">
              <div className="flex items-end justify-between gap-4">
                <div className="flex items-center gap-4">
                  {/* Avatar */}
                  <div 
                    className="avatar-header-image cursor-pointer"
                    onClick={() => setShowAvatarPicker(true)}
                  >
                    {avatarUrl ? (
                      <img src={avatarUrl} alt="Avatar" />
                    ) : (
                      <div className="avatar-header-image-placeholder">
                        {preferences.ai_name.charAt(0)}
                      </div>
                    )}
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
              onEditMessage={handleEditMessage}
              onRegenerateMessage={handleRegenerateMessage}
              onPinMessage={handlePinMessage}
              pinnedMessageIds={pinnedMessageIds}
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

      {/* Avatar Picker Modal */}
      {showAvatarPicker && (
        <AvatarPicker
          avatarUrl={avatarUrl}
          onGenerateNew={handleGenerateNewAvatar}
          onClose={() => setShowAvatarPicker(false)}
        />
      )}
    </div>
  )
}

export default App

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const ChatMessage = ({ message, isUser, aiName, timestamp, messageId, onEdit, onRegenerate, onPin, isPinned = false, typing_delay = 0 }) => {
  const [reactions, setReactions] = useState({})
  const [showReactions, setShowReactions] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editText, setEditText] = useState(message)
  const [showActions, setShowActions] = useState(false)
  const [displayedText, setDisplayedText] = useState(isUser ? message : '')
  const [isTyping, setIsTyping] = useState(!isUser && typing_delay > 0)
  const [wordIndex, setWordIndex] = useState(0)
  const [pinned, setPinned] = useState(isPinned)

  // Handle typing animation for AI messages
  useEffect(() => {
    if (isUser || typing_delay <= 0) {
      // User messages display instantly
      setDisplayedText(message)
      setIsTyping(false)
      return
    }

    // AI message typing animation
    const words = message.split(' ')
    const totalWords = words.length
    const delayPerWord = typing_delay / Math.max(totalWords, 1)

    let currentIndex = 0
    let currentDisplayText = ''

    const typeNextWord = () => {
      if (currentIndex < totalWords) {
        currentDisplayText += (currentIndex > 0 ? ' ' : '') + words[currentIndex]
        setDisplayedText(currentDisplayText)
        currentIndex++
        setTimeout(typeNextWord, Math.max(delayPerWord, 50)) // Min 50ms per word
      } else {
        setIsTyping(false)
      }
    }

    // Start typing after brief initial delay
    const initialDelay = Math.min(300, delayPerWord * 0.2)
    const timeoutId = setTimeout(typeNextWord, initialDelay)

    return () => clearTimeout(timeoutId)
  }, [message, isUser, typing_delay])

  const reactionEmojis = ['❤️', '😂', '😢', '🔥', '👀']

  const addReaction = (emoji) => {
    setReactions((prev) => ({
      ...prev,
      [emoji]: (prev[emoji] || 0) + 1,
    }))
  }

  const formatTime = () => {
    const now = new Date()
    return `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`
  }

  const handleEditSubmit = () => {
    if (editText.trim() && editText !== message) {
      onEdit(messageId, editText)
      setIsEditing(false)
    } else {
      setIsEditing(false)
    }
  }

  const handleRegenerate = () => {
    if (onRegenerate) {
      onRegenerate(messageId)
    }
  }

  const handlePin = () => {
    if (onPin) {
      onPin(messageId)
      setPinned(!pinned)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, ...( isUser ? { x: 20 } : { x: -20 })}}
      animate={{ opacity: 1, x: 0 }}
      transition={{ type: 'spring', damping: 14, stiffness: 200 }}
      className={`flex gap-3 mb-6 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
      onHoverStart={() => !isUser && setShowReactions(true)}
      onHoverEnd={() => !isUser && setShowReactions(false)}
    >
      {/* Avatar */}
      <motion.div
        whileHover={{ scale: 1.08 }}
        className={`${isUser ? 'avatar-user' : 'avatar-ai'} flex-shrink-0 relative`}
      >
        {isUser ? '🧑' : aiName.charAt(0)}
      </motion.div>

      {/* Message Container */}
      <div className={`flex flex-col gap-2 ${isUser ? 'items-end' : 'items-start'} max-w-sm`}>
        {/* Edit Mode */}
        <AnimatePresence>
          {isEditing && isUser && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="w-full"
            >
              <textarea
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                className="w-full p-3 bg-purple-600/20 border border-purple-400/50 rounded-lg text-white font-ui resize-none focus:outline-none focus:border-purple-400"
                rows="2"
                autoFocus
              />
              <div className="flex gap-2 mt-2">
                <button
                  onClick={handleEditSubmit}
                  className="px-3 py-1 bg-purple-500 hover:bg-purple-600 rounded text-sm text-white transition"
                >
                  ✓ Save
                </button>
                <button
                  onClick={() => {
                    setIsEditing(false)
                    setEditText(message)
                  }}
                  className="px-3 py-1 bg-gray-500 hover:bg-gray-600 rounded text-sm text-white transition"
                >
                  ✕ Cancel
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Message Bubble */}
        {!isEditing && (
          <motion.div
            whileHover={!isUser ? { scale: 1.02 } : {}}
            className={`${isUser ? 'bubble-user' : 'bubble-ai'} relative group`}
          >
            <div className="flex items-end gap-2">
              <div className="flex-1">
                {displayedText}
                {isTyping && !isUser && (
                  <motion.span
                    animate={{ opacity: [1, 0.5, 1] }}
                    transition={{ duration: 0.8, repeat: Infinity }}
                    className="inline-block w-2 h-5 ml-1 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full align-text-bottom"
                  />
                )}
              </div>
            </div>

            {/* Hover Actions */}
            <AnimatePresence>
              {showActions && !isTyping && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.2 }}
                  className={`absolute top-0 ${isUser ? 'right-full' : 'left-full'} mr-2 ml-2 flex gap-1`}
                >
                  {isUser && (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="p-2 rounded-lg bg-blue-500/20 hover:bg-blue-500/40 text-blue-300 hover:text-blue-200 transition flex items-center gap-1 text-xs font-ui whitespace-nowrap"
                      title="Edit message"
                    >
                      ✏️
                    </button>
                  )}
                  {!isUser && (
                    <button
                      onClick={handleRegenerate}
                      className="p-2 rounded-lg bg-green-500/20 hover:bg-green-500/40 text-green-300 hover:text-green-200 transition flex items-center gap-1 text-xs font-ui whitespace-nowrap"
                      title="Regenerate response"
                    >
                      🔄
                    </button>
                  )}
                  <button
                    onClick={handlePin}
                    className={`p-2 rounded-lg transition flex items-center gap-1 text-xs font-ui whitespace-nowrap ${
                      pinned
                        ? 'bg-yellow-500/40 hover:bg-yellow-500/50 text-yellow-200 hover:text-yellow-100'
                        : 'bg-purple-500/20 hover:bg-purple-500/40 text-purple-300 hover:text-purple-200'
                    }`}
                    title={pinned ? 'Unpin message' : 'Pin message'}
                  >
                    {pinned ? '📌' : '📍'}
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Reactions & Timestamp Row */}
        <div className={`flex gap-3 items-center px-2 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
          {/* Timestamp */}
          <span className="text-xs font-ui text-text-ghost whitespace-nowrap">
            {formatTime()}
          </span>

          {/* Reactions Display or Picker */}
          <AnimatePresence mode="wait">
            {showReactions && !isUser ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.8, y: 8 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: 8 }}
                transition={{ type: 'spring', damping: 12, stiffness: 200 }}
                className="reactions-container"
              >
                {reactionEmojis.map((emoji) => (
                  <motion.button
                    key={emoji}
                    whileHover={{ scale: 1.25 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => addReaction(emoji)}
                    className="reaction-btn"
                    type="button"
                  >
                    {emoji}
                  </motion.button>
                ))}
              </motion.div>
            ) : Object.keys(reactions).length > 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex gap-1"
              >
                {reactionEmojis.map(
                  (emoji) =>
                    reactions[emoji] && (
                      <motion.span
                        key={emoji}
                        whileHover={{ scale: 1.15 }}
                        className="text-sm bg-white/10 backdrop-blur px-2 py-1 rounded-full cursor-pointer hover:bg-white/20 transition-colors"
                      >
                        {emoji} {reactions[emoji]}
                      </motion.span>
                    )
                )}
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  )
}

export default ChatMessage

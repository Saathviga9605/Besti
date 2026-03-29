import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const ChatMessage = ({ message, isUser, aiName, timestamp }) => {
  const [reactions, setReactions] = useState({})
  const [showReactions, setShowReactions] = useState(false)

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

  return (
    <motion.div
      initial={{ opacity: 0, ...( isUser ? { x: 20 } : { x: -20 })}}
      animate={{ opacity: 1, x: 0 }}
      transition={{ type: 'spring', damping: 14, stiffness: 200 }}
      className={`flex gap-3 mb-6 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
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
        {/* Bubble */}
        <motion.div
          whileHover={!isUser ? { scale: 1.02 } : {}}
          className={`${isUser ? 'bubble-user' : 'bubble-ai'}`}
        >
          {message}
        </motion.div>

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

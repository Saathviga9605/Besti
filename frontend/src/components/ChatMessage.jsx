import React, { useState } from 'react'
import { motion } from 'framer-motion'

const ChatMessage = ({ message, isUser, aiName, timestamp }) => {
  const [reactions, setReactions] = useState({})
  const [showReactions, setShowReactions] = useState(false)

  const reactionEmojis = ['❤️', '😂', '😢', '🔥', '👏', '✨']

  const toggleReaction = (emoji) => {
    setReactions((prev) => ({
      ...prev,
      [emoji]: !prev[emoji],
    }))
  }

  const hasReactions = Object.values(reactions).some(Boolean)

  const formatTime = (ts) => {
    if (!ts) return ''
    const date = new Date(ts)
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex gap-3 mb-6 message-enter ${isUser ? 'justify-end' : 'justify-start'}`}
      onHoverStart={() => !isUser && setShowReactions(true)}
      onHoverEnd={() => setShowReactions(false)}
    >
      {!isUser && (
        <div className="flex-shrink-0">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 via-pink-400 to-purple-500 flex items-center justify-center text-white text-sm font-bold shadow-md"
          >
            {aiName[0].toUpperCase()}
          </motion.div>
        </div>
      )}

      <div className={`max-w-xs lg:max-w-md flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
        {/* Message bubble */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          className={`px-4 py-3 rounded-2xl ${
            isUser
              ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-br-none shadow-lg'
              : 'glass text-gray-800 rounded-bl-none'
          }`}
        >
          <p className="text-sm leading-relaxed break-words">{message}</p>
        </motion.div>

        {/* Reactions */}
        {hasReactions && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex gap-1 mt-2 px-2"
          >
            {reactionEmojis.map(
              (emoji) =>
                reactions[emoji] && (
                  <span
                    key={emoji}
                    className="text-lg cursor-pointer transition-transform hover:scale-125"
                  >
                    {emoji}
                  </span>
                )
            )}
          </motion.div>
        )}

        {/* Timestamp and reactions */}
        <div className="flex gap-2 items-center mt-1 px-1">
          <span className="text-xs text-gray-400">{formatTime(timestamp)}</span>

          {showReactions && (
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex gap-1 bg-white rounded-full p-2 shadow-md border border-gray-200"
            >
              {reactionEmojis.map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => toggleReaction(emoji)}
                  className={`text-lg transition-all hover:scale-125 ${
                    reactions[emoji] ? 'scale-125' : 'hover:opacity-80'
                  }`}
                >
                  {emoji}
                </button>
              ))}
            </motion.div>
          )}
        </div>
      </div>

      {isUser && (
        <div className="flex-shrink-0 mt-1">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center text-white text-xs font-bold shadow-md"
          >
            🧑
          </motion.div>
        </div>
      )}
    </motion.div>
  )
}

export default ChatMessage

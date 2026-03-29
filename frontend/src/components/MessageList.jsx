import React, { useEffect, useRef } from 'react'
import ChatMessage from './ChatMessage'
import { motion } from 'framer-motion'

const MessageList = ({ messages, aiName, isLoading, error }) => {
  const endRef = useRef(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoading])

  const getMessageTime = (index) => {
    return new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
  }

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-1 messages-container">
      {messages.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex items-center justify-center h-full"
        >
          <div className="text-center max-w-sm">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity }}
              className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center mx-auto mb-6 shadow-premium text-4xl"
            >
              ✨
            </motion.div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Hey! I'm {aiName}
            </h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              Your AI best friend is ready to chat, support, and celebrate with you. What's on your mind today?
            </p>
          </div>
        </motion.div>
      ) : (
        <>
          {messages.map((msg, idx) => (
            <ChatMessage
              key={idx}
              message={msg.content}
              isUser={msg.role === 'user'}
              aiName={aiName}
              timestamp={getMessageTime(idx)}
            />
          ))}

          {/* Error message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="my-4 px-4 py-3 bg-red-50 border border-red-200 rounded-lg"
            >
              <p className="text-red-700 text-sm font-medium">
                ⚠️ {error}
              </p>
            </motion.div>
          )}

          {/* Typing indicator */}
          {isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex gap-3 mb-4"
            >
              <div className="flex-shrink-0">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white text-sm font-bold shadow-md">
                  {aiName[0]}
                </div>
              </div>
              <div className="glass px-4 py-3 rounded-2xl rounded-bl-none flex items-center gap-1">
                <span className="text-xs text-gray-500 font-medium">thinking</span>
                <div className="typing">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </motion.div>
          )}

          <div ref={endRef} className="pt-4" />
        </>
      )}
    </div>
  )
}

export default MessageList

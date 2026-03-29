import React, { useEffect, useRef } from 'react'
import ChatMessage from './ChatMessage'
import { motion, AnimatePresence } from 'framer-motion'

const MessageList = ({ messages, aiName, isLoading, error }) => {
  const endRef = useRef(null)

  useEffect(() => {
    setTimeout(() => {
      endRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, 0)
  }, [messages, isLoading])

  return (
    <div className="flex-1 overflow-y-auto flex flex-col p-8 space-y-2">
      {messages.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col items-center justify-center flex-1 text-center"
        >
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-7xl mb-8"
          >
            ✨
          </motion.div>
          <h2 className="font-display text-3xl text-white mb-3">
            {aiName} is waiting for you
          </h2>
          <p className="text-text-ghost max-w-sm text-lg leading-relaxed">
            Begin whenever you're ready. Everything you share here is treated with care.
          </p>
        </motion.div>
      ) : (
        <>
          <AnimatePresence mode="popLayout">
            {messages.map((msg, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <ChatMessage
                  message={msg.content}
                  isUser={msg.role === 'user'}
                  aiName={aiName}
                  timestamp={new Date()}
                />
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Error message */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: 12, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -12, scale: 0.95 }}
                className="my-6 px-5 py-4 glass-card border-l-4 border-red-500 rounded-lg"
              >
                <p className="text-red-300 text-sm font-ui leading-relaxed">
                  <span className="mr-2">⚠️</span>
                  {error}
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Typing indicator - The Heartbeat */}
          <AnimatePresence>
            {isLoading && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="flex gap-3 mt-6"
              >
                <motion.div className="avatar-ai">
                  {aiName.charAt(0)}
                </motion.div>
                <div className="flex flex-col gap-1">
                  <div className="typing-indicator">
                    <span className="typing-dot"></span>
                    <span className="typing-dot"></span>
                    <span className="typing-dot"></span>
                    <span className="typing-label">{aiName} is thinking…</span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div ref={endRef} className="pt-6" />
        </>
      )}
    </div>
  )
}

export default MessageList

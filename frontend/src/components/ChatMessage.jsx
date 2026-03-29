import React from 'react'
import { motion } from 'framer-motion'

const ChatMessage = ({ message, isUser, aiName }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex gap-3 mb-4 animate-fadeIn ${isUser ? 'justify-end' : 'justify-start'}`}
    >
      {!isUser && (
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center flex-shrink-0 shadow-lg">
          <span className="text-white text-sm font-bold">{aiName[0]}</span>
        </div>
      )}
      
      <div
        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
          isUser
            ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-br-none'
            : 'glass text-gray-800 rounded-bl-none'
        }`}
      >
        <p className="text-sm leading-relaxed break-words">{message}</p>
      </div>

      {isUser && (
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-cyan-400 flex items-center justify-center flex-shrink-0 shadow-lg">
          <span className="text-white text-xs font-bold">You</span>
        </div>
      )}
    </motion.div>
  )
}

export default ChatMessage

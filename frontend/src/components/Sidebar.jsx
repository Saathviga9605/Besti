import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const Sidebar = ({ chatHistories, onNewChat, onSelectChat, onOpenSettings, currentChatId }) => {
  const streak = localStorage.getItem('besti_streak') || '0'

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.1 }}
      className="sidebar flex flex-col h-full"
    >
      {/* Header */}
      <motion.div className="sidebar-header">
        <h1 className="font-display text-2xl text-white italic mb-2">Besti</h1>
        <p className="text-text-ghost text-sm">Your living presence</p>
      </motion.div>

      {/* New Chat Button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={onNewChat}
        className="new-chat-btn mx-4 mb-4"
        type="button"
      >
        + New Conversation
      </motion.button>

      {/* Chat History */}
      <div className="chat-list">
        <AnimatePresence mode="popLayout">
          {chatHistories.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-8 px-4"
            >
              <p className="text-text-ghost text-sm leading-relaxed">
                Begin a conversation to see history here.
              </p>
            </motion.div>
          ) : (
            chatHistories.map((chat, idx) => (
              <motion.button
                key={chat.id}
                onClick={() => onSelectChat(chat)}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 50 / 1000 }}
                className={`chat-card ${currentChatId === chat.id ? 'active' : ''}`}
                type="button"
              >
                <div className="chat-card-name">{chat.name}</div>
                <div className="chat-card-preview">
                  <span>{chat.preview?.substring(0, 30)}...</span>
                </div>
              </motion.button>
            ))
          )}
        </AnimatePresence>
      </div>

      {/* Streak Footer */}
      <motion.div className="sidebar-footer">
        <span className="streak-flame">🔥</span>
        <span>Day {streak} streak</span>
      </motion.div>

      {/* Settings Button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.95 }}
        onClick={onOpenSettings}
        className="mx-4 mb-4 chat-card hover:bg-aurora-1/20"
        type="button"
      >
        <div className="flex items-center gap-3">
          <span className="text-xl">⚙️</span>
          <span className="chat-card-name">Customize</span>
        </div>
      </motion.button>
    </motion.div>
  )
}

export default Sidebar

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import useStore from '../store/useStore'

const Sidebar = ({ conversations, activeConversationId, onNewChat, onSelectChat, onOpenSettings }) => {
  const { sidebarExpanded, toggleSidebar } = useStore()
  const streak = localStorage.getItem('besti_streak') || '0'

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.1 }}
      className={`sidebar ${sidebarExpanded ? '' : 'collapsed'} flex flex-col h-full bg-abyss/85 backdrop-blur-24 border-r border-white/6`}
    >
      {/* Header */}
      <motion.div className="sidebar-header flex items-center justify-between gap-2">
        <div className="flex-1 overflow-hidden">
          <h1 className="font-display text-2xl text-white italic mb-2 truncate">Besti</h1>
          <p className="text-text-ghost text-sm">Your living presence</p>
        </div>
        <button
          onClick={toggleSidebar}
          className="sidebar-toggle-btn"
          title={sidebarExpanded ? 'Collapse' : 'Expand'}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M15 18l-6-6 6-6"></path>
          </svg>
        </button>
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
      <div className="chat-list flex-1 overflow-y-auto">
        <AnimatePresence mode="popLayout">
          {conversations.length === 0 ? (
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
            conversations.map((chat, idx) => (
              <motion.button
                key={chat.id}
                onClick={() => onSelectChat(chat)}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 50 / 1000 }}
                className={`chat-card ${activeConversationId === chat.id ? 'active' : ''}`}
                type="button"
              >
                <div className="chat-card-content">
                  <div className="chat-card-name">{chat.name}</div>
                  <div className="chat-card-preview">
                    <span>{chat.preview?.substring(0, 30)}...</span>
                  </div>
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

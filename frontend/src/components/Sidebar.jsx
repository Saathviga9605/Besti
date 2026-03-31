import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import useStore from '../store/useStore'

const Sidebar = ({ conversations, activeConversationId, onNewChat, onExportChat, onSelectChat, onOpenSettings, username, onLogout, pinnedMessages = [], onSelectPinnedMessage }) => {
  const { sidebarExpanded, toggleSidebar } = useStore()
  const streak = localStorage.getItem('besti_streak') || '0'
  const [showExportPicker, setShowExportPicker] = useState(false)

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

      <div className="mx-4 mb-4">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowExportPicker((prev) => !prev)}
          className="new-chat-btn w-full"
          type="button"
        >
          Export Chat
        </motion.button>

        <AnimatePresence>
          {showExportPicker && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="mt-2 p-2 rounded-lg bg-white/5 border border-white/10"
            >
              <p className="text-xs text-text-ghost mb-2 px-1">Choose format</p>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    onExportChat('txt')
                    setShowExportPicker(false)
                  }}
                  className="flex-1 px-3 py-2 text-xs rounded-md bg-white/8 hover:bg-white/12 text-white transition"
                  type="button"
                >
                  TXT
                </button>
                <button
                  onClick={() => {
                    onExportChat('json')
                    setShowExportPicker(false)
                  }}
                  className="flex-1 px-3 py-2 text-xs rounded-md bg-white/8 hover:bg-white/12 text-white transition"
                  type="button"
                >
                  JSON
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

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

      {/* Pinned Messages Section */}
      {pinnedMessages && pinnedMessages.length > 0 && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mx-2 mb-4 border-t border-white/10 pt-3"
        >
          <div className="px-3 py-2">
            <h3 className="text-xs font-semibold text-text-ghost uppercase tracking-wide mb-2 flex items-center gap-1">
              <span>📌</span> Pinned ({pinnedMessages.length})
            </h3>
            <div className="space-y-1">
              <AnimatePresence mode="popLayout">
                {pinnedMessages.map((msg, idx) => (
                  <motion.button
                    key={msg.id}
                    onClick={() => onSelectPinnedMessage && onSelectPinnedMessage(msg)}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ delay: idx * 30 / 1000 }}
                    className="w-full text-left p-2 rounded hover:bg-white/5 transition group"
                    type="button"
                    title={msg.message_content}
                  >
                    <p className="text-xs text-text-ghost group-hover:text-white truncate">
                      {msg.message_content?.substring(0, 30)}...
                    </p>
                    <p className="text-xs text-text-ghost/50 mt-1">
                      {msg.role === 'user' ? '👤' : '🤖'} {msg.role === 'user' ? 'You' : 'Besti'}
                    </p>
                  </motion.button>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      )}

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

      {/* User Profile & Logout */}
      {username && (
        <motion.div className="mx-4 mb-4 p-3 rounded-lg bg-white/5 border border-white/10">
          <p className="text-xs text-text-ghost mb-2">Logged in as</p>
          <p className="text-sm text-white font-semibold mb-3 truncate">{username}</p>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.95 }}
            onClick={onLogout}
            className="w-full px-3 py-2 text-xs bg-red-500/10 hover:bg-red-500/20 text-red-300 rounded-md border border-red-500/30 transition"
            type="button"
          >
            Sign Out
          </motion.button>
        </motion.div>
      )}
    </motion.div>
  )
}

export default Sidebar

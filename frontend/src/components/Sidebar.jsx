import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const Sidebar = ({ chatHistories, onNewChat, onSelectChat, onOpenSettings, currentChatId }) => {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <motion.div
      initial={{ x: collapsed ? -300 : 0 }}
      animate={{ x: 0 }}
      className={`${
        collapsed ? 'w-16' : 'w-72'
      } glass flex flex-col shadow-premium-lg transition-all duration-300 border-r border-white/20 h-screen`}
    >
      {/* Header */}
      <motion.div className="p-4 border-b border-white/20 flex items-center justify-between">
        <AnimatePresence>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent flex items-center gap-2">
                ✨ Besti
              </h1>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setCollapsed(!collapsed)}
          className="p-2 hover:bg-white/10 rounded-lg transition-all"
        >
          {collapsed ? '▶' : '◀'}
        </motion.button>
      </motion.div>

      {/* New Chat Button */}
      {!collapsed && (
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onNewChat}
          className="m-4 px-4 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-semibold hover:shadow-lg shadow-purple-500/50 transition-all flex items-center justify-center gap-2"
        >
          <span>+</span>
          <span>New Chat</span>
        </motion.button>
      )}

      {/* Chat History */}
      <motion.div className="flex-1 overflow-y-auto p-2 space-y-2">
        <AnimatePresence>
          {chatHistories.length === 0 ? (
            !collapsed && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-xs text-gray-400 p-3 text-center leading-relaxed"
              >
                No chats yet. Start a new conversation!
              </motion.p>
            )
          ) : (
            chatHistories.map((chat) => (
              <motion.button
                key={chat.id}
                onClick={() => onSelectChat(chat)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`w-full text-left p-3 rounded-lg transition-all text-sm font-medium ${
                  currentChatId === chat.id
                    ? 'bg-gradient-to-r from-purple-500/40 to-pink-500/40 text-white border border-purple-400/50'
                    : 'hover:bg-white/10 text-gray-700'
                }`}
              >
                {!collapsed && (
                  <>
                    <p className="font-semibold truncate">{chat.name}</p>
                    <p className="text-xs opacity-70 truncate">{chat.preview}</p>
                  </>
                )}
              </motion.button>
            ))
          )}
        </AnimatePresence>
      </motion.div>

      {/* Settings */}
      <motion.div className="p-4 border-t border-white/20">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onOpenSettings}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white/10 hover:bg-white/20 rounded-lg transition-all text-sm font-semibold text-gray-800"
        >
          <span>⚙️</span>
          {!collapsed && <span>Settings</span>}
        </motion.button>
      </motion.div>
    </motion.div>
  )
}

export default Sidebar

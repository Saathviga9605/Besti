import React, { useState } from 'react'
import { motion } from 'framer-motion'

const Sidebar = ({ chatHistories, onNewChat, onSelectChat, onOpenSettings, currentChatId } ) => {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <motion.div
      initial={{ x: collapsed ? -300 : 0 }}
      animate={{ x: 0 }}
      className={`${
        collapsed ? 'w-20' : 'w-64'
      } bg-gradient-to-b from-purple-50 to-pink-50 border-r border-purple-200 flex flex-col shadow-lg transition-all duration-300`}
    >
      {/* Header */}
      <div className="p-4 border-b border-purple-200">
        {!collapsed && (
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              ✨ Besti
            </h1>
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="p-1 hover:bg-white rounded-lg transition-all"
            >
              {'◀'}
            </button>
          </div>
        )}
        {collapsed && (
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1 hover:bg-white rounded-lg transition-all"
          >
            {'▶'}
          </button>
        )}
      </div>

      {/* New Chat Button */}
      {!collapsed && (
        <button
          onClick={onNewChat}
          className="m-4 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-semibold hover:shadow-lg transition-all text-sm"
        >
          + New Chat
        </button>
      )}

      {/* Chat History */}
      <div className="flex-1 overflow-y-auto p-2">
        {chatHistories.length === 0 ? (
          !collapsed && (
            <p className="text-xs text-gray-500 p-2 text-center">No chats yet. Start a new one!</p>
          )
        ) : (
          chatHistories.map((chat) => (
            <button
              key={chat.id}
              onClick={() => onSelectChat(chat)}
              className={`w-full text-left p-3 rounded-lg mb-2 transition-all text-sm ${
                currentChatId === chat.id
                  ? 'bg-gradient-to-r from-purple-400 to-pink-400 text-white'
                  : 'hover:bg-white text-gray-700'
              }`}
            >
              {!collapsed && (
                <>
                  <p className="font-semibold truncate">{chat.name}</p>
                  <p className="text-xs opacity-75 truncate">{chat.preview}</p>
                </>
              )}
            </button>
          ))
        )}
      </div>

      {/* Settings */}
      <div className="p-4 border-t border-purple-200">
        <button
          onClick={onOpenSettings}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-white rounded-lg hover:bg-gray-100 transition-all text-sm font-semibold text-gray-700"
        >
          {!collapsed ? (
            <>
              <span>⚙️</span>
              <span>Settings</span>
            </>
          ) : (
            <span>⚙️</span>
          )}
        </button>
      </div>
    </motion.div>
  )
}

export default Sidebar

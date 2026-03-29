import React, { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'

const ChatInput = ({ onSendMessage, isLoading, error: _error }) => {
  const [input, setInput] = useState('')
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const textareaRef = useRef(null)
  const emojiPickerRef = useRef(null)

  const quickEmojis = ['😊', '😂', '❤️', '🔥', '👍', '🎉', '🤔', '😢', '✨', '🎨']

  const handleSendMessage = (e) => {
    e.preventDefault()
    if (input.trim() && !isLoading) {
      onSendMessage(input)
      setInput('')
      setShowEmojiPicker(false)
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto'
      }
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage(e)
    }
  }

  const handleInput = (e) => {
    setInput(e.target.value)
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 120) + 'px'
    }
  }

  const addEmoji = (emoji) => {
    setInput(input + emoji)
    if (textareaRef.current) {
      textareaRef.current.focus()
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 120) + 'px'
    }
  }

  // Close emoji picker on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(e.target)) {
        setShowEmojiPicker(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <motion.form
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      onSubmit={handleSendMessage}
      className="p-4 border-t border-white/20 glass-purple"
    >
      <div className="flex gap-2 mb-2">
        {/* Emoji Picker Button */}
        <div className="relative" ref={emojiPickerRef}>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="button"
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            className="p-2 rounded-full hover:bg-white/20 transition-all text-lg"
            title="Add emoji"
          >
            😊
          </motion.button>

          {/* Emoji Picker Dropdown */}
          {showEmojiPicker && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="absolute bottom-full left-0 mb-2 bg-white rounded-xl shadow-premium p-3 grid grid-cols-5 gap-2 z-50"
            >
              {quickEmojis.map((emoji, idx) => (
                <motion.button
                  key={idx}
                  type="button"
                  onClick={() => {
                    addEmoji(emoji)
                    setShowEmojiPicker(false)
                  }}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                  className="text-xl p-2 rounded hover:bg-gray-100 transition-all"
                >
                  {emoji}
                </motion.button>
              ))}
            </motion.div>
          )}
        </div>
      </div>

      <div className="flex gap-2">
        <textarea
          ref={textareaRef}
          value={input}
          onChange={handleInput}
          onKeyDown={handleKeyDown}
          placeholder="What's on your mind?"
          disabled={isLoading}
          className="flex-1 px-4 py-3 bg-white/90 rounded-full border border-purple-200/50 focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-400/50 resize-none text-gray-800 placeholder-gray-500 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          rows="1"
          style={{ maxHeight: '120px' }}
        />

        {/* Send Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          type="submit"
          disabled={isLoading || !input.trim()}
          className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed self-end flex items-center gap-2"
        >
          {isLoading ? (
            <>
              <span className="text-sm">Sending</span>
              <div className="typing gap-1">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </>
          ) : (
            <>
              <span>Send</span>
              <span>✉️</span>
            </>
          )}
        </motion.button>
      </div>
    </motion.form>
  )
}

export default ChatInput

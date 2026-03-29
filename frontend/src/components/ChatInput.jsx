import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const ChatInput = ({ onSendMessage, isLoading }) => {
  const [input, setInput] = useState('')
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const textareaRef = useRef(null)
  const pickerRef = useRef(null)

  const quickEmojis = ['😊', '😂', '❤️', '🔥', '👍', '🎉', '🤔', '😢', '✨', '🎨']
  const suggestions = ['Tell me more…', 'That\'s interesting', 'What happened next?']

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
    setShowEmojiPicker(false)
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus()
      }
    }, 0)
  }

  const addSuggestion = (text) => {
    onSendMessage(text)
  }

  // Close emoji picker on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (pickerRef.current && !pickerRef.current.contains(e.target)) {
        setShowEmojiPicker(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const placeholders = [
    'Tell me everything…',
    'I\'m listening…',
    'What\'s on your mind?',
    'You can be honest here…',
  ]

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="px-8 pb-8 pt-0"
    >
      {/* Suggestion chips */}
      {input === '' && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          className="suggestion-chips mb-4"
        >
          {suggestions.map((sug, idx) => (
            <motion.button
              key={idx}
              whileHover={{ translateY: -3 }}
              onClick={() => addSuggestion(sug)}
              className="chip"
              type="button"
              style={{
                animationDelay: `${idx * 80}ms`,
              }}
            >
              {sug}
            </motion.button>
          ))}
        </motion.div>
      )}

      {/* Input form */}
      <form onSubmit={handleSendMessage} className="flex gap-3">
        <div className="flex-1 flex flex-col gap-2">
          {/* Input bar - glass pill */}
          <div className="relative">
            <input
              ref={textareaRef}
              value={input}
              onChange={handleInput}
              onKeyDown={handleKeyDown}
              placeholder={placeholders[0]}
              disabled={isLoading}
              className="input-field w-full"
              style={{
                minHeight: '44px',
              }}
            />

            {/* Emoji picker button */}
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2" ref={pickerRef}>
              <motion.button
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.9 }}
                type="button"
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                className="text-lg p-1 rounded-full hover:bg-white/10 transition-all"
                title="Add emoji"
              >
                😊
              </motion.button>

              {/* Emoji picker dropdown */}
              <AnimatePresence>
                {showEmojiPicker && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8, y: -8 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.8, y: -8 }}
                    className="absolute bottom-full right-0 mb-3 bg-gradient-to-br from-purple-500/20 to-pink-500/10 backdrop-blur-xl border border-white/20 rounded-2xl p-4 grid grid-cols-5 gap-2 z-50 w-max shadow-panel"
                  >
                    {quickEmojis.map((emoji, idx) => (
                      <motion.button
                        key={idx}
                        type="button"
                        onClick={() => addEmoji(emoji)}
                        whileHover={{ scale: 1.25 }}
                        whileTap={{ scale: 0.85 }}
                        className="text-2xl p-2 rounded-lg hover:bg-white/10 transition-all"
                      >
                        {emoji}
                      </motion.button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Send button */}
        <motion.button
          whileHover={!isLoading && input.trim() ? { scale: 1.08 } : {}}
          whileTap={!isLoading && input.trim() ? { scale: 0.85 } : {}}
          type="submit"
          disabled={isLoading || !input.trim()}
          className="send-button"
        >
          {isLoading ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            >
              ⟳
            </motion.div>
          ) : (
            '↗'
          )}
        </motion.button>
      </form>
    </motion.div>
  )
}

export default ChatInput

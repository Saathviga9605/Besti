import React, { useState, useRef, useEffect } from 'react'

const ChatInput = ({ onSendMessage, isLoading }) => {
  const [input, setInput] = useState('')
  const textareaRef = useRef(null)

  const handleSendMessage = (e) => {
    e.preventDefault()
    if (input.trim() && !isLoading) {
      onSendMessage(input)
      setInput('')
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

  return (
    <form
      onSubmit={handleSendMessage}
      className="p-4 border-t border-gray-200 glass-dark"
    >
      <div className="flex gap-2">
        <textarea
          ref={textareaRef}
          value={input}
          onChange={handleInput}
          onKeyDown={handleKeyDown}
          placeholder="Talk to your best friend…"
          disabled={isLoading}
          className="flex-1 px-4 py-2 bg-white rounded-full border border-purple-200 focus:border-purple-400 focus:outline-none resize-none text-gray-800 placeholder-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
          rows="1"
          style={{ maxHeight: '120px' }}
        />
        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          className="px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed self-end"
        >
          {isLoading ? '…' : '✉️'}
        </button>
      </div>
    </form>
  )
}

export default ChatInput

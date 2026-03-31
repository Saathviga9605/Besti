import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

/**
 * TypingMessage Component
 * Displays text with word-by-word typing animation
 * Simulates human-like typing with variable delays
 */
export const TypingMessage = ({ message, isUser, aiName, typing_delay = 0, onTypingComplete }) => {
  const [displayedText, setDisplayedText] = useState('')
  const [isTyping, setIsTyping] = useState(!isUser && typing_delay > 0)
  const [words, setWords] = useState([])

  useEffect(() => {
    if (isUser) {
      // User messages display instantly
      setDisplayedText(message)
      setIsTyping(false)
      if (onTypingComplete) {
        onTypingComplete()
      }
      return
    }

    // AI messages have typing animation
    const splitWords = message.split(' ')
    setWords(splitWords)

    if (typing_delay <= 0) {
      // No delay - show instantly
      setDisplayedText(message)
      setIsTyping(false)
      if (onTypingComplete) {
        onTypingComplete()
      }
      return
    }

    // Calculate delay per word
    const totalWords = splitWords.length
    const delayPerWord = typing_delay / Math.max(totalWords, 1)

    let currentIndex = 0
    let currentText = ''

    const typeWord = () => {
      if (currentIndex < totalWords) {
        currentText += (currentIndex > 0 ? ' ' : '') + splitWords[currentIndex]
        setDisplayedText(currentText)
        currentIndex++
        setTimeout(typeWord, delayPerWord)
      } else {
        setIsTyping(false)
        if (onTypingComplete) {
          onTypingComplete()
        }
      }
    }

    // Start with an initial delay before first word
    const initialDelay = Math.min(500, delayPerWord * 0.3)
    const timeoutId = setTimeout(typeWord, initialDelay)

    return () => clearTimeout(timeoutId)
  }, [message, isUser, typing_delay, onTypingComplete])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="relative"
    >
      {/* Displayed text */}
      <div className="text-white leading-relaxed whitespace-pre-wrap">
        {displayedText}
      </div>

      {/* Typing cursor */}
      {isTyping && !isUser && (
        <motion.span
          animate={{ opacity: [1, 0] }}
          transition={{ duration: 0.6, repeat: Infinity }}
          className="inline-block w-2 h-5 ml-1 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full"
        />
      )}
    </motion.div>
  )
}

export default TypingMessage

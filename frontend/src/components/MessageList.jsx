import React, { useEffect, useRef } from 'react'
import ChatMessage from './ChatMessage'

const MessageList = ({ messages, aiName, isLoading }) => {
  const endRef = useRef(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoading])

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-2">
      {messages.length === 0 ? (
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center mx-auto mb-4 shadow-lg">
              <span className="text-3xl">✨</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Hey! I'm {aiName}</h2>
            <p className="text-gray-600">Start a conversation with your AI best friend!</p>
          </div>
        </div>
      ) : (
        <>
          {messages.map((msg, idx) => (
            <ChatMessage
              key={idx}
              message={msg.content}
              isUser={msg.role === 'user'}
              aiName={aiName}
            />
          ))}
          {isLoading && (
            <div className="flex gap-3 mb-4">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center flex-shrink-0 shadow-lg">
                <span className="text-white text-sm font-bold">{aiName[0]}</span>
              </div>
              <div className="glass px-4 py-2 rounded-2xl rounded-bl-none">
                <div className="typing">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          )}
          <div ref={endRef} />
        </>
      )}
    </div>
  )
}

export default MessageList

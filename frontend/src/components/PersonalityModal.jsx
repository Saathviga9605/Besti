import React, { useState } from 'react'
import { motion } from 'framer-motion'

const PersonalityModal = ({ isOpen, onClose, onSave, currentPreferences }) => {
  const [aiName, setAiName] = useState(currentPreferences?.ai_name || 'Luna')
  const [personality, setPersonality] = useState(
    currentPreferences?.personality || {
      tone: 'Caring',
      energy: 'Chill',
      response_style: 'Medium',
    }
  )

  const tones = ['Caring', 'Funny', 'Sarcastic', 'Protective', 'Romantic']
  const energies = ['Chill', 'Chaotic', 'Deep']
  const responseStyles = ['Short', 'Medium', 'Long', 'Emoji-heavy']

  const handleSave = () => {
    onSave({
      ai_name: aiName,
      personality: personality,
    })
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 p-6"
      >
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Customize Your AI Friend</h2>

        {/* AI Name */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-2">AI Name</label>
          <input
            type="text"
            value={aiName}
            onChange={(e) => setAiName(e.target.value)}
            placeholder="Enter AI name"
            className="w-full px-4 py-2 border border-purple-200 rounded-lg focus:border-purple-400 focus:outline-none"
          />
        </div>

        {/* Tone */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-3">Tone</label>
          <div className="flex flex-wrap gap-2">
            {tones.map((tone) => (
              <button
                key={tone}
                onClick={() => setPersonality({ ...personality, tone })}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
                  personality.tone === tone
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {tone}
              </button>
            ))}
          </div>
        </div>

        {/* Energy */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-3">Energy</label>
          <div className="flex flex-wrap gap-2">
            {energies.map((energy) => (
              <button
                key={energy}
                onClick={() => setPersonality({ ...personality, energy })}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
                  personality.energy === energy
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {energy}
              </button>
            ))}
          </div>
        </div>

        {/* Response Style */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-3">Response Style</label>
          <div className="flex flex-wrap gap-2">
            {responseStyles.map((style) => (
              <button
                key={style}
                onClick={() => setPersonality({ ...personality, response_style: style })}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
                  personality.response_style === style
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {style}
              </button>
            ))}
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg font-semibold hover:bg-gray-300 transition-all"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-semibold hover:shadow-lg transition-all"
          >
            Save
          </button>
        </div>
      </motion.div>
    </div>
  )
}

export default PersonalityModal

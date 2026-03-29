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

  const tones = [
    { name: 'Caring', icon: '🤗', desc: 'Warm & supportive' },
    { name: 'Funny', icon: '😂', desc: 'Witty & playful' },
    { name: 'Sarcastic', icon: '😏', desc: 'Clever & edgy' },
    { name: 'Protective', icon: '🛡️', desc: 'Caring & watchful' },
    { name: 'Romantic', icon: '💕', desc: 'Affectionate' },
  ]

  const energies = [
    { name: 'Chill', icon: '😌', desc: 'Relaxed & calm' },
    { name: 'Chaotic', icon: '⚡', desc: 'Energetic & fun' },
    { name: 'Deep', icon: '🧠', desc: 'Thoughtful & meaningful' },
  ]

  const responseStyles = [
    { name: 'Short', icon: '📝', desc: '1-2 sentences' },
    { name: 'Medium', icon: '💬', desc: 'Balanced & natural' },
    { name: 'Long', icon: '📚', desc: 'Detailed & deep' },
    { name: 'Emoji-heavy', icon: '😊', desc: 'Lots of emojis' },
  ]

  const handleSave = () => {
    onSave({
      ai_name: aiName,
      personality: personality,
    })
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-gradient-to-br from-white to-purple-50 rounded-3xl shadow-premium-lg max-w-2xl w-full p-8 max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Craft Your AI Friend</h2>
          <p className="text-gray-600">Customize how {aiName} talks to you</p>
        </div>

        {/* AI Name Input */}
        <div className="mb-8">
          <label className="block text-sm font-semibold text-gray-700 mb-3">AI Name</label>
          <motion.input
            type="text"
            value={aiName}
            onChange={(e) => setAiName(e.target.value)}
            placeholder="Enter AI name"
            className="w-full px-4 py-3 border border-purple-200 rounded-xl focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-400/50 font-medium"
          />
          <p className="text-xs text-gray-500 mt-2">Give your AI friend a unique identity</p>
        </div>

        {/* Tone Selection - Cards */}
        <div className="mb-8">
          <label className="block text-sm font-semibold text-gray-700 mb-4">
            Tone - How should they be?
          </label>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {tones.map((tone) => (
              <motion.button
                key={tone.name}
                onClick={() => setPersonality({ ...personality, tone: tone.name })}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`p-3 rounded-xl font-medium transition-all text-center ${
                  personality.tone === tone.name
                    ? 'bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-lg'
                    : 'bg-white border border-gray-200 text-gray-800 hover:border-purple-300'
                }`}
              >
                <div className="text-2xl mb-1">{tone.icon}</div>
                <div className="text-sm font-semibold">{tone.name}</div>
                <div className="text-xs opacity-70">{tone.desc}</div>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Energy Selection - Cards */}
        <div className="mb-8">
          <label className="block text-sm font-semibold text-gray-700 mb-4">
            Energy - What's their vibe?
          </label>
          <div className="grid grid-cols-3 gap-3">
            {energies.map((energy) => (
              <motion.button
                key={energy.name}
                onClick={() => setPersonality({ ...personality, energy: energy.name })}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`p-4 rounded-xl font-medium transition-all text-center ${
                  personality.energy === energy.name
                    ? 'bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-lg'
                    : 'bg-white border border-gray-200 text-gray-800 hover:border-purple-300'
                }`}
              >
                <div className="text-2xl mb-1">{energy.icon}</div>
                <div className="text-sm font-semibold">{energy.name}</div>
                <div className="text-xs opacity-70">{energy.desc}</div>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Response Style Selection - Cards */}
        <div className="mb-8">
          <label className="block text-sm font-semibold text-gray-700 mb-4">
            Response Style - How detailed?
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {responseStyles.map((style) => (
              <motion.button
                key={style.name}
                onClick={() => setPersonality({ ...personality, response_style: style.name })}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`p-3 rounded-xl font-medium transition-all text-center ${
                  personality.response_style === style.name
                    ? 'bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-lg'
                    : 'bg-white border border-gray-200 text-gray-800 hover:border-purple-300'
                }`}
              >
                <div className="text-2xl mb-1">{style.icon}</div>
                <div className="text-sm font-semibold">{style.name}</div>
                <div className="text-xs opacity-70">{style.desc}</div>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Preview */}
        <div className="mb-8 p-4 bg-purple-50 rounded-xl border border-purple-200">
          <p className="text-xs font-semibold text-purple-700 mb-2">💭 PERSONALITY PREVIEW</p>
          <p className="text-sm text-gray-700 italic">
            {aiName} is {personality.tone.toLowerCase()} • {personality.energy.toLowerCase()} •{' '}
            {personality.response_style.toLowerCase()}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onClose}
            className="flex-1 px-4 py-3 bg-gray-200 text-gray-800 rounded-xl font-semibold hover:bg-gray-300 transition-all"
          >
            Cancel
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSave}
            className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
          >
            Save Changes ✨
          </motion.button>
        </div>
      </motion.div>
    </div>
  )
}

export default PersonalityModal

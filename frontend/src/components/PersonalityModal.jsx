import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const PersonalityModal = ({ isOpen, onClose, onSave, currentPreferences }) => {
  const [aiName, setAiName] = useState(currentPreferences?.ai_name || 'Elio')
  const [personality, setPersonality] = useState(
    currentPreferences?.personality || {
      tone: 'Caring',
      energy: 'Chill',
      response_style: 'Medium',
    }
  )

  const tones = [
    { name: 'Caring', icon: '🤗', desc: 'Warm & supportive' },
    { name: 'Playful', icon: '😂', desc: 'Witty & fun' },
    { name: 'Sarcastic', icon: '😏', desc: 'Clever & edgy' },
    { name: 'Protective', icon: '🛡️', desc: 'Caring & watchful' },
    { name: 'Romantic', icon: '💕', desc: 'Affectionate' },
  ]

  const energies = [
    { name: 'Chill', icon: '😌', desc: 'Relaxed & calm' },
    { name: 'Chaotic', icon: '⚡', desc: 'Energetic & wild' },
    { name: 'Deep', icon: '🧠', desc: 'Thoughtful & wise' },
  ]

  const responseStyles = [
    { name: 'Short', icon: '📝', desc: '1-2 lines' },
    { name: 'Medium', icon: '💬', desc: 'Natural & flowing' },
    { name: 'Long', icon: '📚', desc: 'Detailed & rich' },
    { name: 'Emoji-heavy', icon: '✨', desc: 'Full of emojis' },
  ]

  const handleSave = () => {
    onSave({
      ai_name: aiName,
      personality: personality,
    })
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-md"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-6"
          >
            <div className="glass shadow-panel rounded-3xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
              <div className="p-8">
                {/* Header */}
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
                  <h2 className="font-display text-4xl text-white italic mb-2">
                    Craft {aiName}
                  </h2>
                  <p className="text-text-ghost text-sm">
                    Define their essence. Shape their presence.
                  </p>
                </motion.div>

                {/* AI Name Input */}
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.05 }} className="mb-10">
                  <label className="block font-ui text-xm font-bold text-text-soul mb-3 uppercase tracking-wide">
                    Their Name
                  </label>
                  <input
                    type="text"
                    value={aiName}
                    onChange={(e) => setAiName(e.target.value)}
                    placeholder="e.g., Elio, Luna, Kai"
                    className="input-field w-full px-4 py-3"
                  />
                  <p className="text-xs text-text-ghost mt-2">
                    What will you call them?
                  </p>
                </motion.div>

                {/* Tone Selection */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.1 }}
                  className="mb-10"
                >
                  <label className="block font-ui text-xs font-bold text-text-soul mb-4 uppercase tracking-wide">
                    💫 Tone — Their Emotional Essence
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                    {tones.map((tone, idx) => (
                      <motion.button
                        key={tone.name}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.12 + idx * 0.03 }}
                        onClick={() => setPersonality({ ...personality, tone: tone.name })}
                        whileHover={{ scale: 1.05, y: -4 }}
                        whileTap={{ scale: 0.95 }}
                        className={`p-4 rounded-2xl transition-all font-ui text-center group ${
                          personality.tone === tone.name
                            ? 'bg-gradient-to-br from-aurora-1/40 to-aurora-3/40 border border-aurora-2/80 shadow-glow'
                            : 'glass-card hover:border-aurora-2/50'
                        }`}
                      >
                        <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">{tone.icon}</div>
                        <div className="font-ui-bold text-xs text-text-soul">{tone.name}</div>
                        <div className="text-xs text-text-ghost mt-1">{tone.desc}</div>
                      </motion.button>
                    ))}
                  </div>
                </motion.div>

                {/* Energy Selection */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="mb-10"
                >
                  <label className="block font-ui text-xs font-bold text-text-soul mb-4 uppercase tracking-wide">
                    ⚡ Energy — Their Vibe & Pace
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {energies.map((energy, idx) => (
                      <motion.button
                        key={energy.name}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.22 + idx * 0.03 }}
                        onClick={() => setPersonality({ ...personality, energy: energy.name })}
                        whileHover={{ scale: 1.05, y: -4 }}
                        whileTap={{ scale: 0.95 }}
                        className={`p-4 rounded-2xl transition-all font-ui text-center group ${
                          personality.energy === energy.name
                            ? 'bg-gradient-to-br from-aurora-1/40 to-aurora-3/40 border border-aurora-2/80 shadow-glow'
                            : 'glass-card hover:border-aurora-2/50'
                        }`}
                      >
                        <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">{energy.icon}</div>
                        <div className="font-ui-bold text-xs text-text-soul">{energy.name}</div>
                        <div className="text-xs text-text-ghost mt-1">{energy.desc}</div>
                      </motion.button>
                    ))}
                  </div>
                </motion.div>

                {/* Response Style Selection */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.28 }}
                  className="mb-10"
                >
                  <label className="block font-ui text-xs font-bold text-text-soul mb-4 uppercase tracking-wide">
                    📝 Response Style — How They Speak
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {responseStyles.map((style, idx) => (
                      <motion.button
                        key={style.name}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.30 + idx * 0.03 }}
                        onClick={() => setPersonality({ ...personality, response_style: style.name })}
                        whileHover={{ scale: 1.05, y: -4 }}
                        whileTap={{ scale: 0.95 }}
                        className={`p-4 rounded-2xl transition-all font-ui text-center group ${
                          personality.response_style === style.name
                            ? 'bg-gradient-to-br from-aurora-1/40 to-aurora-3/40 border border-aurora-2/80 shadow-glow'
                            : 'glass-card hover:border-aurora-2/50'
                        }`}
                      >
                        <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">{style.icon}</div>
                        <div className="font-ui-bold text-xs text-text-soul">{style.name}</div>
                        <div className="text-xs text-text-ghost mt-1">{style.desc}</div>
                      </motion.button>
                    ))}
                  </div>
                </motion.div>

                {/* Preview */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.36 }}
                  className="mb-8 p-4 glass-card border border-aurora-2/30 rounded-xl"
                >
                  <p className="text-xs font-ui-bold text-aurora-2 mb-2 uppercase tracking-wide">
                    ✨ Your Creation
                  </p>
                  <p className="font-display text-lg text-white italic leading-relaxed">
                    {aiName} is <span className="text-aurora-3">{personality.tone.toLowerCase()}</span> • <span className="text-aurora-2">{personality.energy.toLowerCase()}</span> • <span className="text-aurora-4">{personality.response_style.toLowerCase()}</span>
                  </p>
                </motion.div>

                {/* Action Buttons */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="flex gap-3"
                >
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={onClose}
                    className="flex-1 px-4 py-3 glass-card font-ui-bold text-text-soul rounded-full hover:border-aurora-1/50 transition-all"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleSave}
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-aurora-1 to-aurora-3 text-white rounded-full font-ui-bold hover:shadow-panel transition-all"
                  >
                    Save Changes ✨
                  </motion.button>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default PersonalityModal

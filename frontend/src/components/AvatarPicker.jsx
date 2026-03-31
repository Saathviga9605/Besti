import React, { useState } from 'react'
import '../styles/avatar-picker.css'

export default function AvatarPicker({ avatarUrl, onGenerateNew, onClose }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [previewSeed, setPreviewSeed] = useState('')

  const handleGenerate = async () => {
    setLoading(true)
    setError(null)
    try {
      console.log('🎨 Starting avatar generation...')
      await onGenerateNew()
      console.log('✅ Avatar generated successfully')
    } catch (err) {
      console.error('❌ Avatar generation failed:', err)
      setError(err.message || 'Failed to generate avatar')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="avatar-picker-overlay" onClick={onClose}>
      <div className="avatar-picker-modal" onClick={(e) => e.stopPropagation()}>
        <div className="avatar-picker-header">
          <h2>Your Avatar</h2>
          <button 
            className="close-btn" 
            onClick={onClose}
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <div className="avatar-picker-content">
          {/* Current Avatar */}
          <div className="avatar-section">
            <h3>Current Avatar</h3>
            <div className="avatar-display">
              {avatarUrl ? (
                <img src={avatarUrl} alt="Your avatar" />
              ) : (
                <div className="avatar-placeholder">
                  <span className="text-4xl">✨</span>
                </div>
              )}
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="avatar-error">
              <span>⚠️</span> {error}
            </div>
          )}

          {/* Actions */}
          <div className="avatar-actions">
            <button
              className="btn btn-primary"
              onClick={handleGenerate}
              disabled={loading}
            >
              {loading ? '⏳ Generating...' : '🎨 Generate New Avatar'}
            </button>
          </div>

          {/* Info */}
          <p className="avatar-info">
            Your avatar is generated using DiceBear. Click the button above to get a new one!
          </p>
        </div>
      </div>
    </div>
  )
}

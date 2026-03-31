import React from 'react'
import { motion } from 'framer-motion'

const CATEGORY_ORDER = ['Likes', 'Important moments', 'Emotional states']

const formatDate = (iso) => {
  if (!iso) return 'Unknown time'
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return 'Unknown time'
  return date.toLocaleString()
}

function MemoryViewPage({ memories = [], isLoading = false }) {
  const grouped = memories.reduce((acc, item) => {
    const key = CATEGORY_ORDER.includes(item.category) ? item.category : 'Important moments'
    if (!acc[key]) acc[key] = []
    acc[key].push(item)
    return acc
  }, {})

  return (
    <div className="memory-page-shell">
      <div className="memory-page-header">
        <h1 className="font-display memory-title">Things I Remember About You</h1>
        <p className="memory-subtitle">A living archive of your preferences, moments, and emotional patterns.</p>
      </div>

      <div className="memory-scroll-area">
        {isLoading ? (
          <div className="memory-empty">Loading memories...</div>
        ) : memories.length === 0 ? (
          <div className="memory-empty">No memories yet. Keep chatting and I will remember meaningful details over time.</div>
        ) : (
          <div className="memory-grid">
            {CATEGORY_ORDER.map((category, categoryIndex) => {
              const categoryItems = grouped[category] || []
              return (
                <motion.section
                  key={category}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: categoryIndex * 0.08 }}
                  className="memory-card"
                >
                  <div className="memory-card-header">
                    <h2>{category}</h2>
                    <span>{categoryItems.length}</span>
                  </div>

                  {categoryItems.length === 0 ? (
                    <p className="memory-card-empty">No entries in this category yet.</p>
                  ) : (
                    <div className="memory-items">
                      {categoryItems.map((entry) => (
                        <article key={entry.id} className="memory-item">
                          <p className="memory-content">{entry.content}</p>
                          <div className="memory-meta">
                            <span>Mentions: {entry.frequency || 1}</span>
                            <span>Updated: {formatDate(entry.last_accessed || entry.created_at)}</span>
                          </div>
                        </article>
                      ))}
                    </div>
                  )}
                </motion.section>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default MemoryViewPage

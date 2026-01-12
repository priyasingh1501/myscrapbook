'use client'

import { useState, useEffect } from 'react'
import { Note } from '@/lib/db'

export default function Dashboard() {
  const [notes, setNotes] = useState<Note[]>([])
  const [loading, setLoading] = useState(true)
  const [shareLink, setShareLink] = useState('')

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setShareLink(`${window.location.origin}/share`)
      fetchNotes()
    }
  }, [])

  const fetchNotes = async () => {
    try {
      const response = await fetch('/api/notes')
      const data = await response.json()
      setNotes(data)
    } catch (error) {
      console.error('Error fetching notes:', error)
    } finally {
      setLoading(false)
    }
  }

  const [copied, setCopied] = useState(false)

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const noteColors = [
    'bg-yellow-50',
    'bg-pink-50',
    'bg-blue-50',
    'bg-green-50',
    'bg-purple-50',
    'bg-orange-50',
  ]

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="glass-strong rounded-3xl p-8 mb-8 text-center floating">
          <h1 className="nostalgic text-6xl md:text-7xl font-bold text-white mb-4 drop-shadow-lg">
            My Digital Scrapbook
          </h1>
          <p className="handwriting text-xl md:text-2xl text-white/90 mb-6">
            Memories & Moments from Amazing People
          </p>
          
          {/* Share Link Section */}
          <div className="glass rounded-2xl p-6 max-w-2xl mx-auto">
            <p className="handwriting text-lg text-white mb-3">Share this link with your colleagues:</p>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                value={shareLink}
                readOnly
                className="flex-1 px-4 py-3 rounded-xl bg-white/20 text-white placeholder-white/60 border border-white/30 focus:outline-none focus:ring-2 focus:ring-white/50 handwriting"
              />
              <button
                onClick={copyToClipboard}
                className="px-6 py-3 bg-white/30 hover:bg-white/40 rounded-xl text-white font-bold handwriting transition-all duration-300 hover:scale-105 flex items-center gap-2"
              >
                {copied ? (
                  <>
                    <span>✓</span> Copied!
                  </>
                ) : (
                  'Copy Link'
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Notes Grid */}
        {loading ? (
          <div className="text-center text-white handwriting text-2xl">Loading memories...</div>
        ) : notes.length === 0 ? (
          <div className="glass-strong rounded-3xl p-12 text-center">
            <p className="nostalgic text-3xl text-white mb-4">No memories yet...</p>
            <p className="handwriting text-xl text-white/80">Share the link above to start collecting memories!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {notes.map((note, index) => (
              <div
                key={note.id}
                className={`polaroid note-card glass-strong rounded-2xl p-6 ${noteColors[index % noteColors.length]}`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="nostalgic text-2xl font-bold text-gray-800">
                      {note.author}
                    </h3>
                    {note.visibleToOthers && (
                      <span className="text-xs bg-green-200 text-green-800 px-2 py-1 rounded-full handwriting">
                        Public
                      </span>
                    )}
                  </div>
                  <p className="handwriting text-gray-700 text-base leading-relaxed whitespace-pre-wrap">
                    {note.message}
                  </p>
                </div>
                <div className="text-xs text-gray-500 handwriting mt-4 pt-4 border-t border-gray-300">
                  {new Date(note.createdAt).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}


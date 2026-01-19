'use client'

import { useState, useEffect } from 'react'
import { Note } from '@/lib/db'

export default function Dashboard() {
  const [notes, setNotes] = useState<Note[]>([])
  const [loading, setLoading] = useState(true)
  const [shareLink, setShareLink] = useState('')
  const [windowWidth, setWindowWidth] = useState(1200)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setShareLink(`${window.location.origin}/share`)
      setWindowWidth(window.innerWidth)
      fetchNotes()
      
      const handleResize = () => {
        setWindowWidth(window.innerWidth)
      }
      window.addEventListener('resize', handleResize)
      return () => window.removeEventListener('resize', handleResize)
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

  // Calculate random rotation and position for scrapbook effect
  const getScrapbookStyle = (index: number, note: Note) => {
    const rotations = [-3, -2, -1, 0, 1, 2, 3, -4, 4, -1.5, 1.5]
    const rotation = rotations[index % rotations.length]
    const zIndex = index + 1
    
    // Determine size based on content
    const messageLength = note.message.length
    let width = 280
    let minHeight = 200
    
    if (messageLength > 600) {
      width = 380
      minHeight = 300
    } else if (messageLength > 300) {
      width = 320
      minHeight = 250
    }
    
    // Calculate position for collage layout
    const cols = Math.floor(windowWidth / 350) || 3
    const col = index % cols
    const row = Math.floor(index / cols)
    
    const leftOffset = (index % 3) * 50 - 50 // Overlap effect
    const topOffset = (index % 4) * 40 - 40
    
    const left = `${col * 320 + leftOffset + 50}px`
    const top = `${row * 280 + topOffset + 50}px`
    
    return {
      transform: `rotate(${rotation}deg)`,
      zIndex,
      width: `${width}px`,
      minHeight: `${minHeight}px`,
      left,
      top,
    }
  }


  return (
    <div className="scrapbook-dashboard min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="scrapbook-header mb-8 text-center">
          <h1 className="nostalgic text-5xl md:text-6xl font-bold text-gray-800 mb-2 drop-shadow-sm">
            My Digital Scrapbook
          </h1>
          <p className="handwriting text-lg md:text-xl text-gray-700 mb-6">
            Memories & Moments from Amazing People
          </p>
          
          {/* Share Link Section */}
          <div className="scrapbook-share-box inline-block p-6 max-w-2xl mx-auto relative">
            <div className="paperclip-decoration"></div>
            <p className="handwriting text-base text-gray-800 mb-3">Share this link with your colleagues:</p>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                value={shareLink}
                readOnly
                className="flex-1 px-4 py-3 rounded-lg bg-white/90 text-gray-800 placeholder-gray-500 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-600 handwriting"
              />
              <button
                onClick={copyToClipboard}
                className="px-6 py-3 bg-amber-600 hover:bg-amber-700 rounded-lg text-white font-bold handwriting transition-all duration-300 hover:scale-105 flex items-center gap-2 shadow-md"
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

        {/* Scrapbook Collage */}
        {loading ? (
          <div className="text-center text-gray-700 handwriting text-2xl">Loading memories...</div>
        ) : notes.length === 0 ? (
          <div className="scrapbook-empty text-center p-12">
            <p className="nostalgic text-3xl text-gray-800 mb-4">No memories yet...</p>
            <p className="handwriting text-xl text-gray-700">Share the link above to start collecting memories!</p>
          </div>
        ) : (
          <div className="scrapbook-collage">
            {notes.map((note, index) => {
              const style = getScrapbookStyle(index, note)
              const hasPin = index % 3 === 0
              const hasTape = index % 4 === 1
              const hasPaperclip = index % 5 === 2
              
              return (
                <div
                  key={note.id}
                  className="scrapbook-photo-card"
                  style={style}
                >
                  {/* Decorative Pin */}
                  {hasPin && <div className="photo-pin pin-red"></div>}
                  {hasPin && index % 6 === 0 && <div className="photo-pin pin-white"></div>}
                  
                  {/* Decorative Tape */}
                  {hasTape && <div className="photo-tape tape-green"></div>}
                  
                  {/* Card Content */}
                  <div className="photo-content">
                    <div className="photo-frame">
                      <div className="photo-inner">
                        <h3 className="nostalgic text-xl font-bold text-gray-800 mb-3">
                          {note.author}
                        </h3>
                        <p className="handwriting text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">
                          {note.message}
                        </p>
                        <div className="photo-date handwriting text-xs text-gray-500 mt-4 pt-3 border-t border-gray-300">
                          {new Date(note.createdAt).toLocaleDateString('en-US', {
                            month: 'long',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Decorative Paperclip */}
                  {hasPaperclip && <div className="photo-paperclip"></div>}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}


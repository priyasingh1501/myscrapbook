'use client'

import { useState, useEffect, useRef } from 'react'
import { Note } from '@/lib/db'

export default function Dashboard() {
  const [notes, setNotes] = useState<Note[]>([])
  const [loading, setLoading] = useState(true)
  const [windowWidth, setWindowWidth] = useState(1200)
  const [musicStarted, setMusicStarted] = useState(false)
  const [musicPlaying, setMusicPlaying] = useState(true)
  const audioRef = useRef<HTMLAudioElement>(null)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setWindowWidth(window.innerWidth)
      fetchNotes()
      
      const handleResize = () => {
        setWindowWidth(window.innerWidth)
      }
      window.addEventListener('resize', handleResize)
      return () => window.removeEventListener('resize', handleResize)
    }
  }, [])

  // Start music on user interaction
  useEffect(() => {
    const handleUserInteraction = () => {
      startMusic()
      document.removeEventListener('click', handleUserInteraction)
      document.removeEventListener('touchstart', handleUserInteraction)
      document.removeEventListener('keydown', handleUserInteraction)
    }

    document.addEventListener('click', handleUserInteraction)
    document.addEventListener('touchstart', handleUserInteraction)
    document.addEventListener('keydown', handleUserInteraction)

    return () => {
      document.removeEventListener('click', handleUserInteraction)
      document.removeEventListener('touchstart', handleUserInteraction)
      document.removeEventListener('keydown', handleUserInteraction)
    }
  }, [])

  const startMusic = async () => {
    if (audioRef.current && !musicStarted) {
      try {
        await audioRef.current.play()
        setMusicStarted(true)
        setMusicPlaying(true)
      } catch (err) {
        console.log('Audio play failed:', err)
        setMusicPlaying(false)
      }
    }
  }

  const toggleMusic = () => {
    if (audioRef.current) {
      if (musicPlaying) {
        audioRef.current.pause()
        setMusicPlaying(false)
      } else {
        audioRef.current.play()
        setMusicPlaying(true)
      }
    }
  }

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
    <div className="min-h-screen relative overflow-hidden book-background p-4 md:p-8">
      {/* Background Music */}
      <audio ref={audioRef} loop>
        <source src="/music.mp3" type="audio/mpeg" />
        <source src="/music.ogg" type="audio/ogg" />
      </audio>

      {/* Floating Clouds */}
      <div className="cloud cloud1"></div>
      <div className="cloud cloud2"></div>
      <div className="cloud cloud3"></div>
      <div className="cloud cloud4"></div>
      <div className="cloud cloud5"></div>

      {/* Music Control Button - Top Right */}
      <div className="music-control-button">
        <button
          type="button"
          onClick={toggleMusic}
          className="px-4 py-2 rounded-lg text-gray-800 handwriting text-sm transition-all duration-300 hover:scale-105 shadow-sm"
          style={{ 
            background: 'rgba(255, 255, 255, 0.9)',
            border: '1px solid rgba(0, 0, 0, 0.1)',
            backdropFilter: 'blur(10px)'
          }}
          title={musicPlaying ? 'Pause music' : 'Play music'}
        >
          {musicPlaying ? '🔊 Music On' : '🔇 Music Off'}
        </button>
      </div>

      <div className="max-w-7xl mx-auto relative z-20">
        {/* Header */}
        <div className="scrapbook-header mb-8 text-center">
          <h1 className="nostalgic text-5xl md:text-6xl font-bold text-white mb-2 drop-shadow-lg">
            Just gratitude
          </h1>
        </div>

        {/* Scrapbook Collage */}
        {loading ? (
          <div className="text-center text-white handwriting text-2xl">Loading memories...</div>
        ) : notes.length === 0 ? (
          <div className="scrapbook-empty text-center p-12">
            <p className="nostalgic text-3xl text-white mb-4">No memories yet...</p>
            <p className="handwriting text-xl text-white/90">Share the link above to start collecting memories!</p>
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


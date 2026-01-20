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

  // Try to start music on page load, fallback to user interaction if autoplay is blocked
  useEffect(() => {
    // Reset music state on page load
    setMusicStarted(false)
    setMusicPlaying(true)
    
    // Always try to start music on page load
    const tryStartMusic = () => {
      if (audioRef.current) {
        audioRef.current.currentTime = 0
        startMusic().catch(() => {
          // If autoplay fails, will start on user interaction
        })
      }
    }
    
    // Try immediately and also after a short delay to ensure audio is ready
    setTimeout(tryStartMusic, 100)
    setTimeout(tryStartMusic, 500)
    
    // Also set up user interaction listener as fallback
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
    if (audioRef.current) {
      try {
        // Reset audio to beginning and play
        audioRef.current.currentTime = 0
        await audioRef.current.play()
        setMusicStarted(true)
        setMusicPlaying(true)
      } catch (err) {
        console.log('Audio play failed:', err)
        // If autoplay fails, music will start on user interaction
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

  // Generate consistent random values for each note based on index
  const getRandomForIndex = (index: number, seed: number) => {
    // Simple seeded random function for consistency
    const x = Math.sin(index * seed) * 10000
    return x - Math.floor(x)
  }

  // Calculate position for notes without overlap, connected by string
  const getScrapbookStyle = (index: number, note: Note) => {
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
    
    // Calculate position for grid layout - maximum 5 notes per row, no overlap
    const calculatedCols = Math.floor(windowWidth / 350) || 3
    const cols = Math.min(calculatedCols, 5) // Cap at 5 columns
    const col = index % cols
    const row = Math.floor(index / cols)
    
    // Spacing between notes (no overlap)
    const cardSpacing = 350
    const rowSpacing = 400
    
    // Shift everything to the left to add right padding
    const leftOffset = 20
    const left = col * cardSpacing + 50 - leftOffset
    const top = row * rowSpacing + 50
    
    // Get pin position to calculate rotation
    const { pinX: relativePinX } = getPinPosition(index, width)
    const cardCenterX = width / 2
    const pinOffsetFromCenter = relativePinX - cardCenterX
    
    // Calculate rotation based on pin position - pin on left tilts right, pin on right tilts left
    // More offset = more rotation (max ±8 degrees)
    const rotation = (pinOffsetFromCenter / cardCenterX) * 8
    
    // Transform origin should be at the pin position for natural hanging effect
    const transformOriginX = relativePinX
    const transformOriginY = 0 // Top of card where pin is
    
    return {
      transformOrigin: `${transformOriginX}px ${transformOriginY}px`,
      zIndex,
      width: `${width}px`,
      minHeight: `${minHeight}px`,
      left: `${left}px`,
      top: `${top}px`,
      position: 'absolute' as const,
      // Store base rotation for animation
      '--base-rotation': rotation,
      // Add animation delay variation for each card to create natural hanging effect
      animationDelay: `${(index % 5) * 0.2}s`,
    } as React.CSSProperties & { '--base-rotation': number }
  }

  // Get random pin position for each note (consistent per note)
  const getPinPosition = (index: number, cardWidth: number) => {
    // Generate consistent random position between 20% and 80% of card width
    const randomX = getRandomForIndex(index, 12.345) // Seed for X position
    const pinXPercent = 0.2 + (randomX * 0.6) // Between 20% and 80%
    const pinX = cardWidth * pinXPercent
    
    // Pin Y is always near the top (8px above card)
    const pinY = -8
    
    return { pinX, pinY }
  }

  // Calculate string path connecting all notes with random/curved loose effect
  const getStringPath = () => {
    if (notes.length === 0) return ''
    
    const calculatedCols = Math.floor(windowWidth / 350) || 3
    const cols = Math.min(calculatedCols, 5)
    const cardSpacing = 350
    const rowSpacing = 400
    
    let path = ''
    let prevPinX = 0
    let prevPinY = 0
    
    notes.forEach((note, index) => {
      const col = index % cols
      const row = Math.floor(index / cols)
      
      // Determine card width based on content
      const messageLength = note.message.length
      let cardWidth = 280
      if (messageLength > 600) {
        cardWidth = 380
      } else if (messageLength > 300) {
        cardWidth = 320
      }
      
      // Get random pin position for this card
      const { pinX: relativePinX, pinY: relativePinY } = getPinPosition(index, cardWidth)
      
      // Calculate absolute pin position (matching the left offset)
      const leftOffset = 20
      const cardLeft = col * cardSpacing + 50 - leftOffset
      const cardTop = row * rowSpacing + 50
      const pinX = cardLeft + relativePinX // Random position along card width
      const pinY = cardTop + relativePinY // 8px above card top
      
      if (index === 0) {
        path += `M ${pinX} ${pinY}`
        prevPinX = pinX
        prevPinY = pinY
      } else {
        // Calculate distance and midpoint
        const midX = (prevPinX + pinX) / 2
        const midY = (prevPinY + pinY) / 2
        const distance = Math.sqrt(Math.pow(pinX - prevPinX, 2) + Math.pow(pinY - prevPinY, 2))
        
        // Add random variation to create organic, non-Z shape
        const randomOffsetX = (Math.random() - 0.5) * Math.min(distance * 0.3, 60) // Random horizontal offset
        const randomOffsetY = (Math.random() - 0.5) * 20 // Random vertical variation
        
        // Add sag - the longer the distance, the more sag (loose string effect)
        const sagAmount = Math.min(distance * 0.15, 40) // Max 40px sag
        
        // Create two control points for smoother, more random curves
        const control1X = prevPinX + (pinX - prevPinX) * 0.3 + randomOffsetX * 0.5
        const control1Y = prevPinY + (pinY - prevPinY) * 0.3 + sagAmount * 0.5 + randomOffsetY
        const control2X = prevPinX + (pinX - prevPinX) * 0.7 + randomOffsetX * 0.5
        const control2Y = prevPinY + (pinY - prevPinY) * 0.7 + sagAmount + randomOffsetY
        
        // Use cubic bezier curve for smoother, more organic path
        path += ` C ${control1X} ${control1Y}, ${control2X} ${control2Y}, ${pinX} ${pinY}`
        
        prevPinX = pinX
        prevPinY = pinY
      }
    })
    
    return path
  }


  // Calculate container height based on number of notes
  const calculatedCols = Math.floor(windowWidth / 350) || 3
  const cols = Math.min(calculatedCols, 5)
  const rowSpacing = 400
  const totalRows = Math.ceil(notes.length / cols)
  const bottomPadding = 100
  const containerHeight = Math.max(600, totalRows * rowSpacing + 100 + bottomPadding)

  return (
    <div className="min-h-screen relative overflow-y-auto book-background p-4 md:p-8">
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
          <div className="scrapbook-collage" style={{ position: 'relative', minHeight: `${containerHeight}px`, height: 'auto', paddingBottom: '100px', paddingRight: '100px' }}>
            {/* String connecting all notes */}
            {notes.length > 1 && (
              <svg
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  zIndex: 1,
                  pointerEvents: 'none',
                }}
              >
                <path
                  d={getStringPath()}
                  fill="none"
                  stroke="#8B4513"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeDasharray="5,5"
                  opacity="0.6"
                />
              </svg>
            )}
            
            {notes.map((note, index) => {
              const style = getScrapbookStyle(index, note)
              const hasTape = index % 4 === 1
              const hasPaperclip = index % 5 === 2
              
              // Vary pin colors and shapes
              const pinColors = ['#dc2626', '#2563eb', '#16a34a', '#ca8a04', '#9333ea', '#e11d48', '#0891b2', '#f59e0b']
              const pinColor = pinColors[index % pinColors.length]
              const pinShapes = ['circle', 'square', 'diamond', 'star']
              const pinShape = pinShapes[index % pinShapes.length]
              
              // Get random pin position for this card
              const messageLength = note.message.length
              let cardWidth = 280
              if (messageLength > 600) {
                cardWidth = 380
              } else if (messageLength > 300) {
                cardWidth = 320
              }
              const { pinX: relativePinX } = getPinPosition(index, cardWidth)
              
              // Calculate pin style based on shape
              const getPinStyle = () => {
                const baseStyle: any = {
                  background: pinColor,
                  top: '-8px',
                  left: `${relativePinX}px`, // Random position along card width
                  zIndex: 20,
                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
                }
                
                switch (pinShape) {
                  case 'circle':
                    return { ...baseStyle, borderRadius: '50%', transform: 'translateX(-50%)', width: '16px', height: '16px' }
                  case 'square':
                    return { ...baseStyle, borderRadius: '2px', transform: 'translateX(-50%)', width: '14px', height: '14px' }
                  case 'diamond':
                    return { ...baseStyle, borderRadius: '0', transform: 'translateX(-50%) rotate(45deg)', width: '12px', height: '12px' }
                  case 'star':
                    return { ...baseStyle, borderRadius: '50%', transform: 'translateX(-50%)', width: '16px', height: '16px', clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)' }
                  default:
                    return { ...baseStyle, borderRadius: '50%', transform: 'translateX(-50%)', width: '16px', height: '16px' }
                }
              }
              
              return (
                <div
                  key={note.id}
                  className="scrapbook-photo-card"
                  style={style}
                >
                  {/* Decorative Pin - All notes have pins to hang from string with varied colors, shapes, and random positions */}
                  <div 
                    className="photo-pin" 
                    style={getPinStyle()}
                  ></div>
                  
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


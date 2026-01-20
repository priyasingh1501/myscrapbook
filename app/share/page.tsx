'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'

// Digital Scrapbook - Share Page Component

const prompts = [
  "What's your favorite memory of working together?",
  "What's something you admire about them?",
  "What makes them a great colleague?",
  "Share a funny moment you shared together",
  "What's one thing they taught you?",
  "Describe their impact on the team",
  "What's their best quality?",
  "Share a moment when they helped you",
  "What will you miss most?",
  "What makes them unique?",
]


export default function SharePage() {
  const [formData, setFormData] = useState({
    author: '',
    message: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [showPrompts, setShowPrompts] = useState(true)
  const [showRightPage, setShowRightPage] = useState(false)
  const [animatedText, setAnimatedText] = useState('')
  const [isAnimating, setIsAnimating] = useState(true)
  const [musicStarted, setMusicStarted] = useState(false)
  const [musicPlaying, setMusicPlaying] = useState(true)
  const [showMusicPopup, setShowMusicPopup] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const audioRef = useRef<HTMLAudioElement>(null)
  const animatedTextRef = useRef<HTMLDivElement>(null)
  const leftPageRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  const fullText = `It's been four and a half years at Tekion. When I joined, I never imagined I'd stay this long — but here we are.

Tekion has been a very special chapter of my life. When I joined, I was just a bud — a self-taught designer, only a couple of years into this new design world, full of passion and eager to prove myself and create impact through my work.

Over the years, this place taught me how growth takes time. From working on some amazing projects — including the SO Revamp, which was interestingly my very first project here — to learning through challenges and collaboration, I've grown not just as a designer, but as a mentor, a teammate, and a collaborator.

The design team has always been very close to my heart, especially Fixed Ops. And while I spent most of my time with product teams, I'm deeply grateful to you all as well — the backbone of any product, often doing the most thankless work. You are incredible leaders, and I've learned so much from you.

And of course, thank you to the real makers — our engineers — who brought my vision to life. Sorry for all the debates, and thank you for meeting me in them.

I'll always cherish the beautiful moments, the laughter, and the people who made this journey so meaningful. Thank you for making my time at Tekion truly wonderful.

If you'd like, I'd truly love to hear a few thoughts or memories from you as well — I'm putting together a small farewell scrapbook to carry this chapter with me.

Love,
Priya`

  const startMusic = async () => {
    if (audioRef.current && !musicStarted) {
      try {
        await audioRef.current.play()
        setMusicStarted(true)
        setMusicPlaying(true)
      } catch (err) {
        console.log('Audio play failed:', err)
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

  const closeMusicPopup = () => {
    setShowMusicPopup(false)
    if (typeof window !== 'undefined') {
      localStorage.setItem('musicPopupShown', 'true')
    }
    startMusic() // Start music when popup is closed
  }

  useEffect(() => {
    // Check if popup has been shown before
    if (typeof window !== 'undefined') {
      const popupShown = localStorage.getItem('musicPopupShown')
      if (!popupShown) {
        setShowMusicPopup(true)
      }
    }
  }, [])

  useEffect(() => {
    // Word-by-word animation
    if (isAnimating) {
      const words = fullText.split(' ')
      let currentIndex = 0

      const interval = setInterval(() => {
        if (currentIndex < words.length) {
          setAnimatedText(words.slice(0, currentIndex + 1).join(' '))
          currentIndex++
          
          // Auto-scroll to keep animated text in view
          if (animatedTextRef.current && leftPageRef.current) {
            const textElement = animatedTextRef.current
            const pageElement = leftPageRef.current
            
            const textBottom = textElement.offsetTop + textElement.offsetHeight
            const pageHeight = pageElement.clientHeight
            const scrollTop = pageElement.scrollTop
            
            // If text is near the bottom of visible area, scroll down
            if (textBottom > scrollTop + pageHeight - 100) {
              pageElement.scrollTo({
                top: textBottom - pageHeight + 150,
                behavior: 'smooth'
              })
            }
          }
        } else {
          setIsAnimating(false)
          clearInterval(interval)
          
          // After animation completes, scroll to show the button at the bottom
          setTimeout(() => {
            if (buttonRef.current && leftPageRef.current) {
              const buttonElement = buttonRef.current
              const pageElement = leftPageRef.current
              
              const buttonBottom = buttonElement.offsetTop + buttonElement.offsetHeight
              const pageHeight = pageElement.clientHeight
              const scrollTop = pageElement.scrollTop
              
              // Scroll until button is visible at the bottom
              if (buttonBottom > scrollTop + pageHeight - 50) {
                pageElement.scrollTo({
                  top: buttonBottom - pageHeight + 50,
                  behavior: 'smooth'
                })
              }
            }
          }, 300) // Small delay to ensure DOM is updated
        }
      }, 100) // Adjust speed as needed

      return () => clearInterval(interval)
    }
  }, [isAnimating, fullText])

  // Try to start music on any user interaction
  useEffect(() => {
    const handleUserInteraction = () => {
      startMusic()
      // Remove listeners after first interaction
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
  }, [musicStarted])

  const handleFlipPage = () => {
    // Start music if not already started
    startMusic()
    // Start the flip animation
    setShowRightPage(true)
  }

  const insertPrompt = (prompt: string) => {
    if (formData.message.trim()) {
      setFormData({ ...formData, message: formData.message + '\n\n' + prompt })
    } else {
      setFormData({ ...formData, message: prompt })
    }
  }


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      const response = await fetch('/api/notes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          author: formData.author,
          message: formData.message,
        }),
      })

      if (response.ok) {
        setSubmitted(true)
        setTimeout(() => {
          router.push('/')
        }, 3000)
      } else {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }))
        console.error('Error response:', errorData)
        alert(`Failed to save note: ${errorData.error || 'Please try again.'}`)
      }
    } catch (error) {
      console.error('Error submitting note:', error)
      alert(`Error: ${error instanceof Error ? error.message : 'Something went wrong. Please try again.'}`)
    } finally {
      setSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="glass-strong rounded-3xl p-12 text-center max-w-md floating">
          <div className="text-6xl mb-6">✨</div>
          <h2 className="nostalgic text-4xl font-bold text-white mb-4">
            Thank You!
          </h2>
          <p className="handwriting text-xl text-white/90">
            Your memory has been added to the scrapbook!
          </p>
          <p className="handwriting text-lg text-white/80 mt-4">
            Redirecting...
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen relative overflow-hidden book-background">
      {/* Background Music */}
      <audio ref={audioRef} loop>
        <source src="/music.mp3" type="audio/mpeg" />
        <source src="/music.ogg" type="audio/ogg" />
      </audio>

      {/* Music Popup */}
      {showMusicPopup && (
        <div className="music-popup-overlay" onClick={closeMusicPopup}>
          <div className="music-popup" onClick={(e) => e.stopPropagation()}>
            <div className="music-popup-content">
              <h3 className="nostalgic text-2xl font-bold text-gray-800 mb-4">
                Welcome to My Scrapbook
              </h3>
              <p className="handwriting text-base text-gray-700 leading-relaxed mb-6">
                You might hear Safarnama play in the background. It felt the right bg score for the scrapbook. If you would want to switch it off, there is a button that will enable you to do so.
              </p>
              <button
                onClick={closeMusicPopup}
                className="px-6 py-3 bg-amber-600 hover:bg-amber-700 rounded-lg text-white font-bold handwriting transition-all duration-300 hover:scale-105 shadow-md"
              >
                Got it!
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Clouds */}
      <div className="cloud cloud1"></div>
      <div className="cloud cloud2"></div>
      <div className="cloud cloud3"></div>
      <div className="cloud cloud4"></div>
      <div className="cloud cloud5"></div>

      {/* Music Control Button - Top Right */}
      <div className="music-control-button-share">
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

      {/* Book Container */}
      <div className="relative z-20 min-h-screen flex items-center justify-center py-8 px-4">
        <div className={`book-container ${showRightPage ? 'page-flipped' : 'single-page'}`}>
          {/* Left Page - Message */}
          <div ref={leftPageRef} className={`book-page book-page-left ${showRightPage ? 'flip-left' : ''}`}>
            <div className="page-content">
              {/* Heading */}
              <div className="mb-6">
                <h1 className="nostalgic text-4xl md:text-5xl font-bold text-gray-800 text-center">
                  A chapter I'll always carry
                </h1>
              </div>
              
              {/* Thank You GIF */}
              <div className="flex justify-center mb-6" style={{ minHeight: '128px' }}>
                <img 
                  src="https://media.tenor.com/vUs9wZlvzv8AAAAC/thank-you.gif" 
                  alt="Thank you sticker" 
                  className="w-32 h-32 object-contain"
                  style={{ width: '128px', height: '128px', display: 'block' }}
                  onError={(e) => {
                    // Fallback to original URL if media URL fails
                    e.currentTarget.src = 'https://tenor.com/vUs9wZlvzv8.gif';
                  }}
                />
              </div>
              
              <div className="space-y-6 text-gray-800 handwriting text-lg leading-relaxed pb-8">
                <div ref={animatedTextRef} className="whitespace-pre-wrap">
                  {animatedText}
                  {isAnimating && <span className="animate-blink">|</span>}
                </div>
              </div>

              {!isAnimating && !showRightPage && (
                <div ref={buttonRef} className="mt-8 flex justify-center flex-shrink-0">
                  <button
                    onClick={handleFlipPage}
                    className="px-8 py-3 rounded-lg text-white font-bold handwriting text-lg transition-all duration-300 hover:scale-105 shadow-md"
                    style={{ 
                      background: 'linear-gradient(to bottom, #87CEEB 0%, #98D8E8 50%, #B0E0E6 100%)',
                      border: '1px solid rgba(135, 206, 235, 0.5)'
                    }}
                  >
                    Add your note →
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Book Spine - Only show when right page is visible */}
          {showRightPage && <div className="book-spine"></div>}

          {/* Right Page - Writing Area */}
          {showRightPage && (
            <div className="book-page book-page-right show">
              <div className="page-content" style={{ height: '100%', display: 'flex', flexDirection: 'column', width: '100%' }}>
                {/* Heading */}
                <div className="mb-6 flex-shrink-0">
                  <h2 className="nostalgic text-3xl md:text-4xl font-bold text-gray-800 text-center">
                    Would love to hear from you
                  </h2>
                </div>
                
                <form onSubmit={handleSubmit} className="flex-1 flex flex-col w-full" style={{ minHeight: 0, height: '100%' }}>
                {/* Transparent Writing Area */}
                <div className="flex-1 flex flex-col w-full" style={{ minHeight: 0, height: '100%' }}>
                  <div className="flex-1 mb-4 w-full" style={{ minHeight: 0, height: '100%' }}>
                    <textarea
                      ref={textareaRef}
                      id="message"
                      required
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full h-full px-3 py-2 bg-transparent text-gray-800 placeholder-gray-400 focus:outline-none handwriting text-lg resize-none leading-relaxed"
                      style={{ width: '100%', height: '100%' }}
                      placeholder="Type your message here"
                    />
                  </div>
                  
                  <div className="mb-4 w-full flex-shrink-0">
                    <input
                      type="text"
                      id="author"
                      required
                      value={formData.author}
                      onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                      className="w-full px-3 py-2 bg-transparent text-gray-800 placeholder-gray-500 border-b-2 border-gray-300 focus:outline-none focus:border-amber-700 handwriting text-lg"
                      style={{ width: '100%' }}
                      placeholder="Let me know who you are"
                    />
                  </div>
                  
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full px-6 py-3 rounded-lg text-white font-bold handwriting text-base transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed shadow-md flex-shrink-0"
                    style={{ 
                      background: 'linear-gradient(to bottom, #87CEEB 0%, #98D8E8 50%, #B0E0E6 100%)',
                      border: '1px solid rgba(135, 206, 235, 0.5)',
                      width: '100%',
                      marginBottom: '2rem'
                    }}
                  >
                    {submitting ? 'Adding Memory...' : 'Add to Scrapbook ✨'}
                  </button>
                </div>
              </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}


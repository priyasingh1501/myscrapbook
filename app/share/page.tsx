'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'

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
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const audioRef = useRef<HTMLAudioElement>(null)
  const router = useRouter()

  const fullText = `It's been four and a half years at Tekion. When I joined, I never imagined I'd stay this long — but here we are.

Tekion has been a very special chapter of my life. When I joined, I was just a bud — a self-taught designer, only a couple of years into this new design world, full of passion and eager to prove myself and create impact through my work.

Over the years, this place taught me exactly that. From working on some amazing projects — including the SO Revamp, which was interestingly my very first project here — to learning through challenges and collaboration, I've grown not just as a designer, but as a mentor, a teammate, and a collaborator.

The design team has always been very close to my heart, especially Fixed Ops. And while I spent most of my time with product teams, I'm deeply grateful to you all as well — the backbone of any product, often doing the most thankless work. You are incredible leaders, and I've learned so much from you.

And of course, thank you to the real makers — our engineers — who brought my vision to life. Sorry for all the debates, and thank you for meeting me in them.

I'll always cherish the beautiful moments, the laughter, and the people who made this journey so meaningful. Thank you for making my time at Tekion truly wonderful.

Love,
Priya`

  useEffect(() => {
    // Start background music
    if (audioRef.current) {
      audioRef.current.play().catch(err => {
        console.log('Audio autoplay prevented:', err)
      })
    }

    // Word-by-word animation
    if (isAnimating) {
      const words = fullText.split(' ')
      let currentIndex = 0

      const interval = setInterval(() => {
        if (currentIndex < words.length) {
          setAnimatedText(words.slice(0, currentIndex + 1).join(' '))
          currentIndex++
        } else {
          setIsAnimating(false)
          clearInterval(interval)
        }
      }, 100) // Adjust speed as needed

      return () => clearInterval(interval)
    }
  }, [isAnimating, fullText])

  const handleFlipPage = () => {
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
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setSubmitted(true)
        setTimeout(() => {
          router.push('/')
        }, 3000)
      } else {
        alert('Something went wrong. Please try again.')
      }
    } catch (error) {
      console.error('Error submitting note:', error)
      alert('Something went wrong. Please try again.')
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

      {/* Floating Clouds */}
      <div className="cloud cloud1"></div>
      <div className="cloud cloud2"></div>
      <div className="cloud cloud3"></div>
      <div className="cloud cloud4"></div>
      <div className="cloud cloud5"></div>

      {/* Book Container */}
      <div className="relative z-20 min-h-screen flex items-center justify-center py-8 px-4">
        <div className={`book-container ${showRightPage ? 'page-flipped' : 'single-page'}`}>
          {/* Left Page - Message */}
          <div className={`book-page book-page-left ${showRightPage ? 'flip-left' : ''}`}>
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
              
              <div className="space-y-6 text-gray-800 handwriting text-lg leading-relaxed">
                <div className="whitespace-pre-wrap">
                  {animatedText}
                  {isAnimating && <span className="animate-blink">|</span>}
                </div>
              </div>

              {!isAnimating && !showRightPage && (
                <div className="mt-8 flex justify-center">
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
              <div className="page-content">
                <form onSubmit={handleSubmit} className="h-full flex flex-col">
                {/* Transparent Writing Area */}
                <div className="flex-1 flex flex-col">
                  <div className="flex-1 mb-4">
                    <textarea
                      ref={textareaRef}
                      id="message"
                      required
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full h-full px-3 py-2 bg-transparent text-gray-800 placeholder-gray-400 focus:outline-none handwriting text-lg resize-none leading-relaxed"
                      placeholder="I'm making a farewell scrapbook and I'd really value a note from you.&#10;&#10;If you're up for it, you could write about a moment we shared, something you noticed about me, or something you think I should carry forward. Honest > polished."
                    />
                  </div>
                  
                  <div className="mb-4">
                    <input
                      type="text"
                      id="author"
                      required
                      value={formData.author}
                      onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                      className="w-full px-3 py-2 bg-transparent text-gray-800 placeholder-gray-500 border-b-2 border-gray-300 focus:outline-none focus:border-amber-700 handwriting text-lg"
                      placeholder="Let me know who you are"
                    />
                  </div>
                  
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full px-6 py-3 rounded-lg text-white font-bold handwriting text-base transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
                    style={{ 
                      background: 'linear-gradient(to bottom, #87CEEB 0%, #98D8E8 50%, #B0E0E6 100%)',
                      border: '1px solid rgba(135, 206, 235, 0.5)'
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


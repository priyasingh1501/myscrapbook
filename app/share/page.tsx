'use client'

import { useState, useRef } from 'react'
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
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const router = useRouter()

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
      {/* Floating Clouds */}
      <div className="cloud cloud1"></div>
      <div className="cloud cloud2"></div>
      <div className="cloud cloud3"></div>
      <div className="cloud cloud4"></div>
      <div className="cloud cloud5"></div>

      {/* Book Container */}
      <div className="relative z-20 min-h-screen flex items-center justify-center py-8 px-4">
        <div className="book-container">
          {/* Left Page - Message */}
          <div className="book-page book-page-left">
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
                <p>
                  It's been four and a half years at Tekion, the longest I have stayed at a company. Thank you so much for being part of my wonderful journey here. Four and a half years at Tekion the longest I've stayed anywhere says more than I could.
                </p>
                
                <p>
                  This place shaped me in ways I didn't expect, through the people I worked with, learned from, and grew alongside. Thank you for the honesty, the challenges, the laughter, and the moments that made this journey meaningful.
                </p>
                
                <p>
                  I leave with gratitude, respect, and a lot of memories I'll carry forward. I'll truly miss this chapter and the people who made it what it was.
                </p>
                
                <p className="mt-8">
                  Love,<br />
                  Priya
                </p>
              </div>
            </div>
          </div>

          {/* Book Spine */}
          <div className="book-spine"></div>

          {/* Right Page - Writing Area */}
          <div className="book-page book-page-right">
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
              
              {/* Prompts Section */}
              {showPrompts && (
                <div className="mt-6 pt-6 border-t border-gray-300">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="nostalgic text-xl font-bold text-gray-800">
                      Need Inspiration? 💭
                    </h3>
                    <button
                      type="button"
                      onClick={() => setShowPrompts(false)}
                      className="text-gray-600 hover:text-gray-800 handwriting text-sm font-semibold"
                    >
                      ✕
                    </button>
                  </div>
                  <div className="space-y-2">
                    {prompts.map((prompt, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => insertPrompt(prompt)}
                        className="w-full bg-white/30 hover:bg-white/50 backdrop-blur-sm border border-gray-200 hover:border-amber-400 rounded p-3 text-left transition-all duration-300 hover:scale-105 group"
                      >
                        <p className="handwriting text-gray-800 text-xs group-hover:text-amber-700">
                          {prompt}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>
              )}
              
              {!showPrompts && (
                <div className="mt-6 pt-6 border-t border-gray-300 text-center">
                  <button
                    type="button"
                    onClick={() => setShowPrompts(true)}
                    className="text-gray-600 hover:text-amber-700 handwriting text-sm font-semibold transition-colors"
                  >
                    Show Writing Prompts 💡
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


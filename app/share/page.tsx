'use client'

import { useState, useEffect, useRef } from 'react'
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

const stickers = [
  { type: 'gif', url: 'https://media.giphy.com/media/26u4cqiYI50juCOGY/giphy.gif', emoji: '✨' }, // Sparkles
  { type: 'gif', url: 'https://media.giphy.com/media/3o7aD2saQ8LDl9K2i4/giphy.gif', emoji: '💝' }, // Heart
  { type: 'gif', url: 'https://media.giphy.com/media/26u4lOMA8JKSnL9Uk/giphy.gif', emoji: '🌟' }, // Star
  { type: 'gif', url: 'https://media.giphy.com/media/3o7aCTPPm4OHfRLSH6/giphy.gif', emoji: '🎉' }, // Celebration
  { type: 'gif', url: 'https://media.giphy.com/media/26u4exbQg1MqLd8iI/giphy.gif', emoji: '💖' }, // Heart eyes
  { type: 'gif', url: 'https://media.giphy.com/media/3o7aD2saQ8LDl9K2i4/giphy.gif', emoji: '⭐' }, // Star
  { type: 'gif', url: 'https://media.giphy.com/media/26u4cqiYI50juCOGY/giphy.gif', emoji: '🎈' }, // Balloon
  { type: 'gif', url: 'https://media.giphy.com/media/3o7aCTPPm4OHfRLSH6/giphy.gif', emoji: '💕' }, // Hearts
  { type: 'gif', url: 'https://media.giphy.com/media/26u4lOMA8JKSnL9Uk/giphy.gif', emoji: '🌈' }, // Rainbow
  { type: 'gif', url: 'https://media.giphy.com/media/26u4exbQg1MqLd8iI/giphy.gif', emoji: '🦋' }, // Butterfly
  { type: 'gif', url: 'https://media.giphy.com/media/3o7aD2saQ8LDl9K2i4/giphy.gif', emoji: '🌸' }, // Flower
  { type: 'gif', url: 'https://media.giphy.com/media/26u4cqiYI50juCOGY/giphy.gif', emoji: '💫' }, // Dizzy star
]

export default function SharePage() {
  const [formData, setFormData] = useState({
    author: '',
    message: '',
    visibleToOthers: false,
  })
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [showPrompts, setShowPrompts] = useState(true)
  const [showTooltip, setShowTooltip] = useState(true)
  const [draggedSticker, setDraggedSticker] = useState<string | null>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const router = useRouter()

  useEffect(() => {
    // Hide tooltip after 5 seconds
    const timer = setTimeout(() => {
      setShowTooltip(false)
    }, 5000)
    return () => clearTimeout(timer)
  }, [])

  const insertPrompt = (prompt: string) => {
    if (formData.message.trim()) {
      setFormData({ ...formData, message: formData.message + '\n\n' + prompt })
    } else {
      setFormData({ ...formData, message: prompt })
    }
  }

  const handleDragStart = (e: React.DragEvent, sticker: { type: string; url: string; emoji: string }) => {
    setDraggedSticker(sticker.emoji)
    e.dataTransfer.effectAllowed = 'copy'
    setShowTooltip(false)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'copy'
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    if (draggedSticker) {
      const textarea = textareaRef.current
      if (textarea) {
        const start = textarea.selectionStart
        const end = textarea.selectionEnd
        const text = formData.message
        const newText = text.substring(0, start) + draggedSticker + text.substring(end)
        setFormData({ ...formData, message: newText })
        
        // Set cursor position after the inserted emoji
        setTimeout(() => {
          textarea.focus()
          textarea.setSelectionRange(start + draggedSticker.length, start + draggedSticker.length)
        }, 0)
      } else {
        // Fallback: append to end
        setFormData({ ...formData, message: formData.message + draggedSticker })
      }
      setDraggedSticker(null)
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
    <div className="min-h-screen relative overflow-hidden scrapbook-bg">
      {/* Kraft Paper Background */}
      <div className="fixed inset-0 kraft-paper"></div>
      
      {/* Floating Stickers */}
      <div className="fixed inset-0 pointer-events-none z-10">
        {stickers.map((sticker, index) => {
          const positions = [
            { top: '10%', left: '5%' },
            { top: '15%', right: '8%' },
            { top: '25%', left: '3%' },
            { top: '30%', right: '5%' },
            { bottom: '25%', left: '5%' },
            { bottom: '30%', right: '8%' },
            { bottom: '15%', left: '3%' },
            { bottom: '20%', right: '5%' },
            { top: '50%', left: '2%' },
            { top: '55%', right: '3%' },
            { bottom: '50%', left: '2%' },
            { bottom: '55%', right: '3%' },
          ]
          const position = positions[index % positions.length]
          const isFirst = index === 0
          
          return (
            <div
              key={index}
              draggable
              onDragStart={(e) => handleDragStart(e, sticker)}
              className={`sticker floating absolute cursor-grab active:cursor-grabbing pointer-events-auto transition-transform hover:scale-125 ${isFirst && showTooltip ? 'wiggle' : ''}`}
              style={position}
            >
              <img
                src={sticker.url}
                alt={sticker.emoji}
                className="w-16 h-16 md:w-20 md:h-20 object-contain"
                draggable={false}
              />
              {isFirst && showTooltip && (
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 bg-white/95 border border-gray-300 rounded-lg px-3 py-2 whitespace-nowrap pointer-events-none z-50 shadow-lg">
                  <p className="handwriting text-gray-800 text-sm font-semibold">Drag me to the note area!</p>
                  <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-b-4 border-transparent border-b-white"></div>
                </div>
              )}
            </div>
          )
        })}
      </div>

      <div className="relative z-20 min-h-screen flex flex-col items-center py-8 px-4">
        {/* Banner */}
        <div className="mb-8 mt-4">
          <div className="scrapbook-banner px-8 py-3">
            <h1 className="nostalgic text-2xl md:text-3xl font-bold text-white uppercase tracking-wider">
              Making Your Scrapbook
            </h1>
          </div>
        </div>

        {/* Note Area with Tape */}
        <div className="scrapbook-note-container relative max-w-3xl w-full mb-8">
          {/* Tape decorations */}
          <div className="tape tape-top-left"></div>
          <div className="tape tape-bottom-right"></div>
          
          {/* Note Area */}
          <form onSubmit={handleSubmit} className="scrapbook-note-area p-8 md:p-12">
            <div className="mb-6">
              <label htmlFor="author" className="block text-gray-800 handwriting text-lg mb-2 font-semibold">
                Your Name
              </label>
              <input
                type="text"
                id="author"
                required
                value={formData.author}
                onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                className="w-full px-4 py-3 rounded-lg bg-white/80 text-gray-800 placeholder-gray-400 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-fuchsia-500 handwriting text-base"
                placeholder="Enter your name..."
              />
            </div>

            <div className="mb-6">
              <label htmlFor="message" className="block text-gray-800 handwriting text-lg mb-2 font-semibold">
                Your Message
              </label>
              <textarea
                ref={textareaRef}
                id="message"
                required
                rows={12}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                className="w-full px-4 py-3 rounded-lg bg-white/80 text-gray-800 placeholder-gray-400 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-fuchsia-500 handwriting text-base resize-none transition-all duration-200 min-h-[300px]"
                placeholder="Write your thoughts, memories, or feelings here... 💝"
                onDragEnter={(e) => {
                  e.preventDefault()
                  e.currentTarget.classList.add('border-fuchsia-500', 'bg-fuchsia-50')
                }}
                onDragLeave={(e) => {
                  e.currentTarget.classList.remove('border-fuchsia-500', 'bg-fuchsia-50')
                }}
              />
            </div>

            <div className="mb-6">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.visibleToOthers}
                  onChange={(e) => setFormData({ ...formData, visibleToOthers: e.target.checked })}
                  className="w-5 h-5 rounded border-gray-400 bg-white text-fuchsia-600 focus:ring-fuchsia-500 cursor-pointer"
                />
                <span className="ml-3 text-gray-700 handwriting text-base">
                  Make this note visible to everyone (otherwise only visible to the scrapbook owner)
                </span>
              </label>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full px-8 py-4 bg-fuchsia-600 hover:bg-fuchsia-700 rounded-lg text-white font-bold handwriting text-lg transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-fuchsia-500/50"
            >
              {submitting ? 'Adding Memory...' : 'Add to Scrapbook ✨'}
            </button>
          </form>
        </div>

        {/* Prompts Section */}
        {showPrompts && (
          <div className="scrapbook-note-area p-6 md:p-8 mb-6 max-w-3xl w-full">
            <div className="flex items-center justify-between mb-4">
              <h2 className="nostalgic text-2xl md:text-3xl font-bold text-gray-800">
                Need Inspiration? 💭
              </h2>
              <button
                type="button"
                onClick={() => setShowPrompts(false)}
                className="text-gray-600 hover:text-gray-800 handwriting text-base font-semibold"
              >
                Hide
              </button>
            </div>
            <p className="handwriting text-gray-700 mb-4 text-base">
              Click on any prompt below to get started or use them as inspiration:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {prompts.map((prompt, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => insertPrompt(prompt)}
                  className="bg-white/60 hover:bg-fuchsia-50 border border-gray-300 hover:border-fuchsia-300 rounded-lg p-4 text-left transition-all duration-300 hover:scale-105 hover:rotate-1 group"
                >
                  <p className="handwriting text-gray-800 text-sm md:text-base group-hover:text-fuchsia-700">
                    {prompt}
                  </p>
                </button>
              ))}
            </div>
          </div>
        )}

        {!showPrompts && (
          <div className="text-center mb-6">
            <button
              type="button"
              onClick={() => setShowPrompts(true)}
              className="bg-white/80 hover:bg-white border border-gray-300 hover:border-fuchsia-500 rounded-lg px-6 py-3 text-gray-800 handwriting text-base font-semibold hover:text-fuchsia-700 transition-all duration-300 shadow-md"
            >
              Show Writing Prompts 💡
            </button>
          </div>
        )}
      </div>
    </div>
  )
}


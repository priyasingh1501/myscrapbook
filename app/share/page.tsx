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
    visibleToOthers: false,
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
    <div className="min-h-screen relative overflow-hidden scrapbook-bg">
      {/* Kraft Paper Background */}
      <div className="fixed inset-0 kraft-paper"></div>

      <div className="relative z-20 min-h-screen flex flex-col items-center py-8 px-4">
        {/* Banner */}
        <div className="mb-8 mt-4">
          <div className="scrapbook-banner px-8 py-3">
            <h1 className="nostalgic text-2xl md:text-3xl font-bold text-white uppercase tracking-wider">
              Making Your Scrapbook
            </h1>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="w-full max-w-6xl flex flex-col lg:flex-row gap-6 items-start">
          {/* Note Area with Tape */}
          <div className="scrapbook-note-container relative flex-1 w-full lg:max-w-2xl">
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
                className="w-full px-4 py-3 rounded-lg bg-white/80 text-gray-800 placeholder-gray-400 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-fuchsia-500 handwriting text-base resize-none transition-all duration-200 min-h-[300px]"
                placeholder="Write your thoughts, memories, or feelings here... 💝"
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

          {/* Floating Prompts Section */}
          {showPrompts && (
            <div className="floating-prompts glassmorphic-sidebar p-6 w-full lg:w-80 lg:sticky lg:top-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="nostalgic text-xl md:text-2xl font-bold text-gray-800">
                  Need Inspiration? 💭
                </h2>
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
                    className="w-full bg-white/30 hover:bg-white/40 backdrop-blur-sm border border-white/20 hover:border-fuchsia-300/50 rounded-lg p-3 text-left transition-all duration-300 hover:scale-105 group shadow-sm"
                  >
                    <p className="handwriting text-gray-800 text-sm group-hover:text-fuchsia-700 font-medium">
                      {prompt}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {!showPrompts && (
            <div className="w-full lg:w-80 lg:sticky lg:top-8">
              <button
                type="button"
                onClick={() => setShowPrompts(true)}
                className="w-full glassmorphic-sidebar p-4 text-center hover:bg-white/20 transition-all duration-300"
              >
                <span className="handwriting text-gray-800 text-base font-semibold hover:text-fuchsia-700">
                  Show Writing Prompts 💡
                </span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}


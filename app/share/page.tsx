'use client'

import { useState } from 'react'
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
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="glass-strong rounded-3xl p-8 md:p-12 mb-8 text-center floating">
          <h1 className="nostalgic text-5xl md:text-6xl font-bold text-white mb-4 drop-shadow-lg">
            Add Your Memory
          </h1>
          <p className="handwriting text-xl text-white/90">
            Share your thoughts and feelings
          </p>
        </div>

        {/* Prompts Section */}
        {showPrompts && (
          <div className="glass-strong rounded-3xl p-6 md:p-8 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="nostalgic text-3xl font-bold text-white">
                Need Inspiration? 💭
              </h2>
              <button
                type="button"
                onClick={() => setShowPrompts(false)}
                className="text-white/80 hover:text-white handwriting text-lg"
              >
                Hide
              </button>
            </div>
            <p className="handwriting text-white/90 mb-4 text-lg">
              Click on any prompt below to get started or use them as inspiration:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {prompts.map((prompt, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => insertPrompt(prompt)}
                  className="glass rounded-xl p-4 text-left hover:bg-white/30 transition-all duration-300 hover:scale-105 hover:rotate-1 group"
                >
                  <p className="handwriting text-white text-sm md:text-base group-hover:text-white/90">
                    {prompt}
                  </p>
                </button>
              ))}
            </div>
          </div>
        )}

        {!showPrompts && (
          <div className="mb-6 text-center">
            <button
              type="button"
              onClick={() => setShowPrompts(true)}
              className="glass rounded-xl px-6 py-3 text-white handwriting text-lg hover:bg-white/30 transition-all duration-300"
            >
              Show Writing Prompts 💡
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="glass-strong rounded-3xl p-8 md:p-12">
          <div className="mb-6">
            <label htmlFor="author" className="block text-white handwriting text-xl mb-3">
              Your Name
            </label>
            <input
              type="text"
              id="author"
              required
              value={formData.author}
              onChange={(e) => setFormData({ ...formData, author: e.target.value })}
              className="w-full px-6 py-4 rounded-xl bg-white/20 text-white placeholder-white/60 border border-white/30 focus:outline-none focus:ring-2 focus:ring-white/50 handwriting text-lg"
              placeholder="Enter your name..."
            />
          </div>

          <div className="mb-6">
            <label htmlFor="message" className="block text-white handwriting text-xl mb-3">
              Your Message
            </label>
            <textarea
              id="message"
              required
              rows={8}
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              className="w-full px-6 py-4 rounded-xl bg-white/20 text-white placeholder-white/60 border border-white/30 focus:outline-none focus:ring-2 focus:ring-white/50 handwriting text-lg resize-none"
              placeholder="Share your thoughts, memories, or feelings here... 💝"
            />
          </div>

          <div className="mb-8">
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={formData.visibleToOthers}
                onChange={(e) => setFormData({ ...formData, visibleToOthers: e.target.checked })}
                className="w-5 h-5 rounded border-white/30 bg-white/20 text-purple-600 focus:ring-white/50 cursor-pointer"
              />
              <span className="ml-3 text-white handwriting text-lg">
                Make this note visible to everyone (otherwise only visible to the scrapbook owner)
              </span>
            </label>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full px-8 py-4 bg-white/30 hover:bg-white/40 rounded-xl text-white font-bold handwriting text-xl transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? 'Adding Memory...' : 'Add to Scrapbook ✨'}
          </button>
        </form>
      </div>
    </div>
  )
}


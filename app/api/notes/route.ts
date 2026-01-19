import { NextRequest, NextResponse } from 'next/server'
import { getNotes, saveNote, getPublicNotes, Note } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    // Return all notes - all notes are visible on dashboard
    const notes = await getNotes()
    
    return NextResponse.json(notes)
  } catch (error) {
    console.error('Error fetching notes:', error)
    return NextResponse.json(
      { error: 'Failed to fetch notes' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { author, message } = body

    if (!author || !message) {
      return NextResponse.json(
        { error: 'Author and message are required' },
        { status: 400 }
      )
    }

    // All notes are visible on dashboard
    const note = await saveNote({
      author: author.trim(),
      message: message.trim(),
      visibleToOthers: true,
    })

    return NextResponse.json(note, { status: 201 })
  } catch (error) {
    console.error('Error saving note:', error)
    const errorMessage = error instanceof Error ? error.message : 'Failed to save note'
    return NextResponse.json(
      { error: errorMessage, details: error instanceof Error ? error.stack : undefined },
      { status: 500 }
    )
  }
}


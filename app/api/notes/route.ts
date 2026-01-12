import { NextRequest, NextResponse } from 'next/server'
import { getNotes, saveNote, getPublicNotes, Note } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const viewMode = searchParams.get('view')
    
    // If view=public, return only public notes
    // Otherwise, return all notes (for dashboard owner)
    const notes = viewMode === 'public' ? await getPublicNotes() : await getNotes()
    
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
    const { author, message, visibleToOthers } = body

    if (!author || !message) {
      return NextResponse.json(
        { error: 'Author and message are required' },
        { status: 400 }
      )
    }

    const note = await saveNote({
      author: author.trim(),
      message: message.trim(),
      visibleToOthers: visibleToOthers || false,
    })

    return NextResponse.json(note, { status: 201 })
  } catch (error) {
    console.error('Error saving note:', error)
    return NextResponse.json(
      { error: 'Failed to save note' },
      { status: 500 }
    )
  }
}


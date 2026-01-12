import { v4 as uuidv4 } from 'uuid';

export interface Note {
  id: string;
  author: string;
  message: string;
  visibleToOthers: boolean;
  createdAt: string;
  color?: string;
}

// Check if we're in Vercel environment
const isVercel = !!process.env.VERCEL;

// Try to use KV, fallback to file system or in-memory
let kvModule: any = null;
if (isVercel) {
  try {
    kvModule = require('@vercel/kv');
  } catch (e) {
    console.log('KV not available, using fallback');
  }
}

const NOTES_KEY = 'scrapbook:notes';
let inMemoryNotes: Note[] = [];

// File system functions (for local dev)
let fs: any = null;
let path: any = null;
let dataDir: string = '';
let dataFilePath: string = '';

if (!isVercel && typeof window === 'undefined') {
  try {
    fs = require('fs');
    path = require('path');
    dataDir = path.join(process.cwd(), 'data');
    dataFilePath = path.join(dataDir, 'notes.json');
    
    // Ensure data directory exists
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
  } catch (e) {
    console.log('File system not available');
  }
}

export async function getNotes(): Promise<Note[]> {
  // Try Vercel KV first
  if (isVercel && kvModule && process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
    try {
      const { kv } = kvModule;
      const notes = await kv.get<Note[]>(NOTES_KEY);
      return notes || [];
    } catch (error) {
      console.error('Error reading from KV:', error);
    }
  }
  
  // Try file system (local dev)
  if (fs && fs.existsSync && dataFilePath) {
    try {
      if (fs.existsSync(dataFilePath)) {
        const fileContents = fs.readFileSync(dataFilePath, 'utf8');
        return JSON.parse(fileContents);
      }
    } catch (error) {
      console.error('Error reading from file:', error);
    }
  }
  
  // Fallback to in-memory
  return inMemoryNotes;
}

export async function saveNote(note: Omit<Note, 'id' | 'createdAt'>): Promise<Note> {
  const notes = await getNotes();
  const newNote: Note = {
    id: uuidv4(),
    ...note,
    createdAt: new Date().toISOString(),
  };
  
  const updatedNotes = [...notes, newNote];
  
  // Try Vercel KV first
  if (isVercel && kvModule && process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
    try {
      const { kv } = kvModule;
      await kv.set(NOTES_KEY, updatedNotes);
      return newNote;
    } catch (error) {
      console.error('Error saving to KV:', error);
    }
  }
  
  // Try file system (local dev)
  if (fs && fs.writeFileSync && dataFilePath) {
    try {
      fs.writeFileSync(dataFilePath, JSON.stringify(updatedNotes, null, 2));
      return newNote;
    } catch (error) {
      console.error('Error saving to file:', error);
    }
  }
  
  // Fallback to in-memory
  inMemoryNotes = updatedNotes;
  return newNote;
}

export async function getPublicNotes(): Promise<Note[]> {
  const notes = await getNotes();
  return notes.filter(note => note.visibleToOthers);
}

import { v4 as uuidv4 } from 'uuid';
import { supabase } from './supabase';

export interface Note {
  id: string;
  author: string;
  message: string;
  visibleToOthers: boolean;
  createdAt: string;
  color?: string;
}

// File system functions (for local dev fallback)
let fs: any = null;
let path: any = null;
let dataDir: string = '';
let dataFilePath: string = '';

if (typeof window === 'undefined') {
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
    // File system not available
  }
}

// Initialize Supabase table if using Supabase
async function initSupabaseTable() {
  if (!supabase) return;
  
  try {
    // Create table if it doesn't exist (this will be done via SQL in Supabase dashboard)
    // But we can check if it exists by trying to query it
    const { error } = await supabase.from('notes').select('id').limit(1);
    if (error && error.code === '42P01') {
      // Table doesn't exist - user needs to create it via SQL
      console.warn('Notes table does not exist. Please run the SQL migration in Supabase.');
    }
  } catch (error) {
    console.error('Error checking Supabase table:', error);
  }
}

export async function getNotes(): Promise<Note[]> {
  // Try Supabase first
  if (supabase) {
    try {
      await initSupabaseTable();
      const { data, error } = await supabase
        .from('notes')
        .select('*')
        .order('createdAt', { ascending: false });
      
      if (error) {
        console.error('Error reading from Supabase:', error);
      } else if (data) {
        return data.map(row => ({
          id: row.id,
          author: row.author,
          message: row.message,
          visibleToOthers: row.visibleToOthers,
          createdAt: row.createdAt,
        }));
      }
    } catch (error) {
      console.error('Error reading from Supabase:', error);
    }
  }
  
  // Try file system (local dev fallback)
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
  
  // Fallback to empty array
  return [];
}

export async function saveNote(note: Omit<Note, 'id' | 'createdAt'>): Promise<Note> {
  const newNote: Note = {
    id: uuidv4(),
    ...note,
    createdAt: new Date().toISOString(),
  };
  
  // Try Supabase first
  if (supabase) {
    try {
      await initSupabaseTable();
      const { data, error } = await supabase
        .from('notes')
        .insert([{
          id: newNote.id,
          author: newNote.author,
          message: newNote.message,
          visibleToOthers: newNote.visibleToOthers,
          createdAt: newNote.createdAt,
        }])
        .select()
        .single();
      
      if (error) {
        console.error('Error saving to Supabase:', error);
        throw error;
      }
      
      return newNote;
    } catch (error) {
      console.error('Error saving to Supabase:', error);
      throw error;
    }
  }
  
  // Try file system (local dev fallback)
  if (fs && fs.writeFileSync && dataFilePath) {
    try {
      const notes = await getNotes();
      notes.push(newNote);
      fs.writeFileSync(dataFilePath, JSON.stringify(notes, null, 2));
      return newNote;
    } catch (error) {
      console.error('Error saving to file:', error);
      throw error;
    }
  }
  
  throw new Error('No storage method available. Please set up Supabase or use local development.');
}

export async function getPublicNotes(): Promise<Note[]> {
  // Try Supabase first
  if (supabase) {
    try {
      await initSupabaseTable();
      const { data, error } = await supabase
        .from('notes')
        .select('*')
        .eq('visibleToOthers', true)
        .order('createdAt', { ascending: false });
      
      if (error) {
        console.error('Error reading public notes from Supabase:', error);
      } else if (data) {
        return data.map(row => ({
          id: row.id,
          author: row.author,
          message: row.message,
          visibleToOthers: row.visibleToOthers,
          createdAt: row.createdAt,
        }));
      }
    } catch (error) {
      console.error('Error reading public notes from Supabase:', error);
    }
  }
  
  // Fallback to filtering all notes
  const notes = await getNotes();
  return notes.filter(note => note.visibleToOthers);
}

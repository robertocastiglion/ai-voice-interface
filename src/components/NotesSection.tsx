import React from 'react';
import { Save, Trash2 } from 'lucide-react';
import { Note } from '../types';

interface NotesSectionProps {
  currentNote: string;
  notes: Note[];
  onNoteChange: (note: string) => void;
  onSaveNote: () => void;
  onDeleteNote: (noteId: string) => void;
  loading: boolean;
}

export const NotesSection = ({
  currentNote,
  notes,
  onNoteChange,
  onSaveNote,
  onDeleteNote,
  loading,
}: NotesSectionProps) => (
  <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-purple-500/20">
    <h2 className="text-2xl font-semibold text-white mb-6">Session Notes</h2>
    
    <div className="space-y-4">
      <textarea
        value={currentNote}
        onChange={(e) => onNoteChange(e.target.value)}
        placeholder="Take notes during your consultation..."
        className="w-full h-32 bg-white/5 border border-purple-500/20 rounded-lg p-3 text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
      />
      
      <button
        onClick={onSaveNote}
        disabled={!currentNote.trim()}
        className="w-full bg-purple-500 hover:bg-purple-600 disabled:bg-purple-500/50 disabled:cursor-not-allowed text-white font-medium py-2 px-4 rounded-lg flex items-center justify-center space-x-2 transition-colors duration-200"
      >
        <Save className="w-4 h-4" />
        <span>Save Note</span>
      </button>
    </div>

    <div className="mt-6 space-y-4 max-h-[400px] overflow-y-auto">
      {loading ? (
        <div className="text-center text-white/70">Loading notes...</div>
      ) : notes.length > 0 ? (
        notes.map((note) => (
          <div
            key={note.id}
            className="bg-white/5 rounded-lg p-4 border border-purple-500/20 group relative"
          >
            <button
              onClick={() => onDeleteNote(note.id)}
              className="absolute top-2 right-2 p-1.5 rounded-lg bg-red-500/20 hover:bg-red-500/30 opacity-0 group-hover:opacity-100 transition-all duration-200"
              title="Delete note"
            >
              <Trash2 className="w-4 h-4 text-red-400" />
            </button>
            <p className="text-white/90 mb-2 pr-8">{note.content}</p>
            <p className="text-sm text-purple-400">{note.timestamp}</p>
          </div>
        ))
      ) : (
        <div className="text-center text-white/70">No notes yet</div>
      )}
    </div>
  </div>
);
import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { VoiceInterface } from './components/VoiceInterface';
import { NotesSection } from './components/NotesSection';
import { saveNote, deleteNote, getNotes } from './services/noteService';
import type { Note, VoiceSettings } from './types';

const App: React.FC = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [currentNote, setCurrentNote] = useState('');
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState<VoiceSettings>({
    useAudioResponse: true
  });

  useEffect(() => {
    loadNotes();
  }, []);

  const loadNotes = async () => {
    try {
      const fetchedNotes = await getNotes();
      setNotes(fetchedNotes);
    } catch (error) {
      console.error('Error loading notes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveNote = async () => {
    if (!currentNote.trim()) return;
    
    try {
      await saveNote(currentNote);
      setCurrentNote('');
      await loadNotes();
    } catch (error) {
      console.error('Error saving note:', error);
    }
  };

  const handleDeleteNote = async (noteId: string) => {
    try {
      await deleteNote(noteId);
      await loadNotes();
    } catch (error) {
      console.error('Error deleting note:', error);
    }
  };

  const handleTransferToNotes = (text: string) => {
    setCurrentNote(prev => prev ? `${prev}\n\n${text}` : text);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-blue-900 text-white p-8">
      <div className="max-w-6xl mx-auto">
        <Header />
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
          <VoiceInterface
            isRecording={isRecording}
            onToggleRecording={() => setIsRecording(!isRecording)}
            onTranscriptReceived={text => setCurrentNote(text)}
            settings={settings}
            onSettingsChange={setSettings}
            onTransferToNotes={handleTransferToNotes}
          />
          
          <NotesSection
            currentNote={currentNote}
            notes={notes}
            onNoteChange={setCurrentNote}
            onSaveNote={handleSaveNote}
            onDeleteNote={handleDeleteNote}
            loading={loading}
          />
        </div>
      </div>
    </div>
  );
};

export default App;
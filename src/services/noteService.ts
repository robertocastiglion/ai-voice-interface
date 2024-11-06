import { collection, addDoc, query, orderBy, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import type { Note } from '../types';

export const saveNote = async (content: string): Promise<void> => {
  try {
    const timestamp = new Date().toISOString();
    await addDoc(collection(db, 'notes'), {
      content,
      timestamp,
      createdAt: new Date()
    });
  } catch (error) {
    console.error('Error saving note:', error);
    throw error;
  }
};

export const deleteNote = async (noteId: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, 'notes', noteId));
  } catch (error) {
    console.error('Error deleting note:', error);
    throw error;
  }
};

export const getNotes = async (): Promise<Note[]> => {
  try {
    const q = query(
      collection(db, 'notes'), 
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      content: doc.data().content,
      timestamp: new Date(doc.data().timestamp).toLocaleString()
    }));
  } catch (error) {
    console.error('Error fetching notes:', error);
    throw error;
  }
};
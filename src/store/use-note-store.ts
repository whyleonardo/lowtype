import { Note } from '@/@types/note'
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

interface NoteStore {
  notes: Note[]
  queryNoteSearch: string
  setQueryNoteSearch: (query: string) => void
  addNote: (note: Note) => void
  removeNote: (id: string) => void
}

export const useNoteStore = create<NoteStore>()(
  persist(
    set => ({
      notes: [],
      queryNoteSearch: '',
      setQueryNoteSearch: (query: string) =>
        set(() => ({ queryNoteSearch: query })),
      addNote: (note: Note) =>
        set(({ notes }) => ({ notes: [note, ...notes] })),
      removeNote: (id: string) =>
        set(({ notes }) => ({ notes: notes.filter(note => note.id !== id) }))
    }),
    {
      name: 'note-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: state => ({ notes: state.notes })
    }
  )
)

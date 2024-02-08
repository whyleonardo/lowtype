import { useNoteStore } from '@/store/use-note-store'
import { ChangeEvent } from 'react'

export const NoteSearch = () => {
  const { setQueryNoteSearch } = useNoteStore()

  function handleSearch(event: ChangeEvent<HTMLInputElement>) {
    const query = event.target.value
    setQueryNoteSearch(query)
  }

  return (
    <form className="w-full">
      <input
        onChange={handleSearch}
        type="text"
        placeholder="Busque em suas notas..."
        className="w-full bg-transparent text-3xl font-bold tracking-tighter outline-none placeholder:text-foreground/40"
      />
    </form>
  )
}

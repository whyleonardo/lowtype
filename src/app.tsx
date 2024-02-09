import { Separator } from '@/components/ui/separator'
import { NoteCard } from '@/components/note-card'
import { NewNoteCard } from '@/components/new-note-card'
import { useNoteStore } from '@/store/use-note-store'
import { useAutoAnimate } from '@formkit/auto-animate/react'
import { Header } from '@/components/header'
import { Fragment } from 'react'
import { NoteSearch } from '@/components/note-search'

export const App = () => {
  const { notes, queryNoteSearch } = useNoteStore()
  const [parent] = useAutoAnimate()

  const filteredNotes =
    queryNoteSearch !== ''
      ? notes.filter(note =>
          note.content.includes(queryNoteSearch.toLowerCase())
        )
      : notes

  return (
    <Fragment>
      <Header />

      <div className="mx-auto my-4 max-w-6xl space-y-6 px-8 lowercase md:px-0">
        <NoteSearch />

        <Separator />

        <div
          ref={parent}
          className="grid auto-rows-[250px] grid-cols-1 gap-6 md:grid-cols-3"
        >
          <NewNoteCard />

          {filteredNotes.map(note => (
            <NoteCard key={note.id} note={note} />
          ))}
        </div>
      </div>
    </Fragment>
  )
}

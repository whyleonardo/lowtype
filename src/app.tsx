import { Logo } from '@/components/logo'
import { Separator } from '@/components/ui/separator'
import { NoteCard } from '@/components/note-card'
import { NewNoteCard } from '@/components/new-note-card'

const note = {
  date: 2,
  content: 'Hello World'
}

export const App = () => {
  return (
    <div className="mx-auto my-12 max-w-6xl space-y-6 lowercase">
      <Logo className="fill-lime-200" />

      <form className="w-full">
        <input
          type="text"
          placeholder="Busque em suas notas..."
          className="w-full bg-transparent text-3xl font-bold tracking-tighter outline-none placeholder:text-foreground/40"
        />
      </form>

      <Separator />

      <div className="grid auto-rows-[250px] grid-cols-3 gap-6">
        <NewNoteCard />
        <NoteCard note={note} />
      </div>
    </div>
  )
}

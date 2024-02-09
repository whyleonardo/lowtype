import { Note } from '@/@types/note'
import * as Dialog from '@radix-ui/react-dialog'
import { useNoteStore } from '@/store/use-note-store'

import { X } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'

interface NoteCardProps {
  note: Note
}

export const NoteCard = ({ note }: NoteCardProps) => {
  const { removeNote } = useNoteStore()

  if (!note.content) return null

  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <button className="relative flex flex-col gap-3 overflow-hidden rounded-md bg-stone-800 p-5 text-left outline-none transition hover:ring-2 hover:ring-stone-700 focus-visible:ring-2 focus-visible:ring-indigo-300">
          <span className="text-sm font-medium">
            {formatDistanceToNow(note.createdAt, {
              locale: ptBR,
              addSuffix: true
            })}
          </span>
          <p className="text-sm leading-6 text-stone-400">{note.content}</p>

          {note.content.length > 370 && (
            <div className="pointer-events-none absolute inset-0 top-1/4 w-full bg-gradient-to-t from-stone-950 to-transparent" />
          )}
        </button>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50" />

        <Dialog.Content className="fixed left-1/2 top-1/2 z-10 flex h-[60vh] w-11/12 -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-md bg-stone-800 outline-none md:max-w-[640px]">
          <Dialog.Close className="absolute right-5 top-5" asChild>
            <X className="size-5 cursor-pointer text-foreground transition hover:text-muted-foreground" />
          </Dialog.Close>

          <div className="flex flex-1 flex-col gap-3 p-5">
            <span className="text-sm font-medium">
              {formatDistanceToNow(new Date(), {
                locale: ptBR,
                addSuffix: true
              })}
            </span>

            <p className="text-sm leading-6 text-stone-400">{note.content}</p>
          </div>

          <button
            onClick={() => removeNote(note.id)}
            type="button"
            className="group w-full bg-stone-900 py-4 text-center text-sm text-stone-300 outline-none transition hover:bg-stone-900/60"
          >
            Deseja{' '}
            <span className="text-red-300 transition group-hover:text-red-400 group-hover:underline">
              apagar essa nota
            </span>
            ?
          </button>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

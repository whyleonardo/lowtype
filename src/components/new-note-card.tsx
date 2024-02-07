import { randomSentences as sentences } from '@/constants/random-sentences'
import * as Dialog from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import { ChangeEvent, Fragment, useEffect, useState } from 'react'

export const NewNoteCard = () => {
  const [isTextEditorOpen, setIsTextEditorOpen] = useState(false)
  const [randomSentence, setRandomSentence] = useState<string>(
    sentences[Math.floor(Math.random() * sentences.length)]
  )

  function handleStartEditor() {
    setIsTextEditorOpen(prevState => !prevState)
  }

  function handleContentChanged(event: ChangeEvent<HTMLTextAreaElement>) {
    const { value } = event.target

    if (value === '') {
      setIsTextEditorOpen(false)
    }
  }

  function handleSaveNote(formData: FormData) {
    console.log(formData.values())
  }

  useEffect(() => {
    setRandomSentence(sentences[Math.floor(Math.random() * sentences.length)])
  }, [isTextEditorOpen])

  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <button className="flex flex-col gap-3 rounded-md bg-stone-700/80 p-5 text-left outline-none hover:ring-2 hover:ring-stone-600/80 focus-visible:ring-2 focus-visible:ring-lime-300">
          <span className="text-sm font-medium">adicionar nota</span>
          <p className="text-sm leading-6 text-stone-400">
            grave uma nota em áudio que será convertida para texto
            automaticamente.
          </p>
        </button>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50" />

        <Dialog.Content className="fixed left-1/2 top-1/2 z-10  flex h-[60vh] w-full max-w-[340px] -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-md bg-stone-800 outline-none md:max-w-[640px]">
          <Dialog.Close
            className="absolute right-5 top-5"
            asChild
            onClick={handleStartEditor}
          >
            <X className="size-5 cursor-pointer text-foreground transition hover:text-muted-foreground" />
          </Dialog.Close>

          <form className="flex size-full flex-1 flex-col" action>
            <div className="flex flex-1 flex-col gap-3 p-5">
              <span className="text-sm font-medium">adicionar nota</span>
              {isTextEditorOpen ? (
                <textarea
                  placeholder={randomSentence}
                  onChange={handleContentChanged}
                  className="flex-1 resize-none bg-transparent normal-case text-stone-300 outline-none placeholder:text-stone-500/30"
                  spellCheck={false}
                  autoFocus
                ></textarea>
              ) : (
                <Fragment>
                  <p className="text-sm leading-6 text-stone-400">
                    comece{' '}
                    <button className="rounded-sm font-medium text-lime-300 outline-none hover:underline focus-visible:ring-1 focus-visible:ring-stone-700">
                      gravando
                    </button>{' '}
                    uma nota em áudio ou se preferir{' '}
                    <button
                      onClick={handleStartEditor}
                      className="rounded-sm font-medium text-lime-300 outline-none hover:underline focus-visible:ring-1 focus-visible:ring-stone-700"
                    >
                      utilize apenas texto
                    </button>
                    .
                  </p>
                </Fragment>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-lime-300 py-4 text-center text-sm text-background outline-none transition hover:bg-lime-200"
            >
              salvar Nota
            </button>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

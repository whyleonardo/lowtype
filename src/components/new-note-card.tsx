import { ChangeEvent, FormEvent, Fragment, useEffect, useState } from 'react'

import { randomSentences as sentences } from '@/constants/random-sentences'
import * as Dialog from '@radix-ui/react-dialog'
import { useNoteStore } from '@/store/use-note-store'

import { X } from 'lucide-react'
import { useDebounceValue } from 'usehooks-ts'
import { toast } from 'sonner'

let speechRecognition: SpeechRecognition | null = null

export const NewNoteCard = () => {
  const [isTextEditorOpen, setIsTextEditorOpen] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [recordingContent, setRecordingContent] = useState('')
  const [debouncedNoteContent, setDebouncedNoteContent] = useDebounceValue(
    '',
    150
  )

  const [randomSentence, setRandomSentence] = useState<string>(
    sentences[Math.floor(Math.random() * sentences.length)]
  )

  const noteStore = useNoteStore()

  function handleStartEditor() {
    setIsTextEditorOpen(prevState => !prevState)
  }

  function handleContentChanged(event: ChangeEvent<HTMLTextAreaElement>) {
    setDebouncedNoteContent(event.target.value)

    const { value } = event.target

    if (value === '') {
      setIsTextEditorOpen(false)
    }
  }

  function handleSaveNote(event: FormEvent) {
    event.preventDefault()

    if (debouncedNoteContent === '') {
      return toast.error('você não pode salvar uma nota vazia', {
        className: '!font-medium !text-[0.95rem]',
        duration: 700
      })
    }

    const newNote = {
      content: debouncedNoteContent,
      createdAt: new Date(),
      id: crypto.randomUUID()
    }

    noteStore.addNote(newNote)

    setIsTextEditorOpen(false)

    toast.success('sua nota foi salva!', {
      className: '!font-medium !text-[0.95rem]',
      duration: 700
    })
  }

  function handleStartRecording() {
    const isSpeechRecognitionAPIAvailable =
      'SpeechRecognition' in window || 'webkitSpeechRecognition' in window

    if (!isSpeechRecognitionAPIAvailable) {
      return toast.error(
        'infelizmente, seu navegador não suporta a funcionalidade de gravação',
        {
          className: '!font-medium !text-[0.95rem]',
          duration: 3000
        }
      )
    }

    const SpeechRecognitionAPI =
      window.SpeechRecognition || window.webkitSpeechRecognition

    speechRecognition = new SpeechRecognitionAPI()

    setIsRecording(true)
    setIsTextEditorOpen(true)

    speechRecognition.lang = 'pt-BR'
    speechRecognition.continuous = true
    speechRecognition.maxAlternatives = 1
    speechRecognition.interimResults = true

    speechRecognition.onresult = event => {
      const transcription = Array.from(event.results).reduce((text, result) => {
        return text.concat(result[0].transcript)
      }, '')

      setRecordingContent(transcription)
    }

    speechRecognition.onerror = () => {
      toast.error('ops, algo deu errado. tente novamente!')
      if (speechRecognition) {
        speechRecognition.stop()
      }
    }

    speechRecognition.start()
  }

  function handleStopRecording() {
    setIsRecording(false)

    if (speechRecognition) {
      speechRecognition.stop()
      setDebouncedNoteContent(recordingContent)
      setRecordingContent('')
    }
  }

  useEffect(() => {
    setRandomSentence(sentences[Math.floor(Math.random() * sentences.length)])
  }, [isTextEditorOpen])

  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <button className="flex flex-col gap-3 rounded-md bg-stone-700/80 p-5 text-left outline-none hover:ring-2 hover:ring-stone-600/80 focus-visible:ring-2 focus-visible:ring-indigo-300">
          <span className="text-sm font-medium">adicionar nota</span>
          <p className="text-sm leading-6 text-stone-400">
            grave uma nota em áudio que será convertida para texto
            automaticamente.
          </p>
        </button>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50" />

        <Dialog.Content className="fixed left-1/2 top-1/2 z-10  flex h-[60vh] w-11/12 -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-md bg-stone-800 outline-none md:max-w-[640px]">
          <Dialog.Close
            className="absolute right-5 top-5"
            asChild
            onClick={handleStartEditor}
          >
            <X className="size-5 cursor-pointer text-foreground transition hover:text-muted-foreground" />
          </Dialog.Close>

          <form className="flex size-full flex-1 flex-col">
            <div className="flex flex-1 flex-col gap-3 p-5">
              <span className="text-sm font-medium">adicionar nota</span>

              {isTextEditorOpen ? (
                <textarea
                  placeholder={randomSentence}
                  onChange={handleContentChanged}
                  value={isRecording ? recordingContent : undefined}
                  className="flex-1 resize-none bg-transparent lowercase text-stone-300 outline-none placeholder:text-stone-500/30"
                  spellCheck={false}
                  autoFocus
                ></textarea>
              ) : (
                <Fragment>
                  <p className="text-sm leading-6 text-stone-400">
                    comece{' '}
                    <button
                      type="button"
                      onClick={handleStartRecording}
                      className="rounded-sm font-medium text-indigo-300 outline-none hover:underline focus-visible:ring-1 focus-visible:ring-stone-700"
                    >
                      gravando
                    </button>{' '}
                    uma nota em áudio ou se preferir{' '}
                    <button
                      type="button"
                      onClick={handleStartEditor}
                      className="rounded-sm font-medium text-indigo-300 outline-none hover:underline focus-visible:ring-1 focus-visible:ring-stone-700"
                    >
                      utilize apenas texto
                    </button>
                    .
                  </p>
                </Fragment>
              )}
            </div>

            {isRecording ? (
              <button
                type="button"
                onClick={handleStopRecording}
                className="flex w-full items-center justify-center gap-2 bg-stone-900 py-4 text-center text-sm text-foreground outline-none transition hover:bg-stone-900/70 focus-visible:underline"
              >
                <div className="size-3 animate-pulse rounded-full bg-red-400" />
                gravando! (clique p/ interromper)
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSaveNote}
                className="w-full bg-indigo-300 py-4 text-center text-sm text-background outline-none transition hover:bg-indigo-200 focus-visible:underline"
              >
                salvar Nota
              </button>
            )}
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

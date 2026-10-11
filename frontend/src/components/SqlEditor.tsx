import { useEffect, useRef } from 'react'
import { defaultKeymap, history, historyKeymap } from '@codemirror/commands'
import { sql } from '@codemirror/lang-sql'
import { HighlightStyle, syntaxHighlighting } from '@codemirror/language'
import { EditorState } from '@codemirror/state'
import {
  drawSelection,
  EditorView,
  highlightActiveLine,
  highlightActiveLineGutter,
  keymap,
  lineNumbers,
} from '@codemirror/view'
import { tags as t } from '@lezer/highlight'

const highlight = HighlightStyle.define([
  { tag: t.keyword, color: '#d4b896' },
  { tag: t.string, color: '#b7c4a8' },
  { tag: t.number, color: '#dcc49a' },
  { tag: t.comment, color: '#7d766c' },
  { tag: t.operator, color: '#c4bbb0' },
  { tag: t.typeName, color: '#c9a36a' },
  { tag: t.variableName, color: '#e6dfd4' },
  { tag: t.punctuation, color: '#b8b0a6' },
])

const kosTheme = EditorView.theme(
  {
    '&': {
      height: '100%',
      backgroundColor: '#0e0c0a',
      color: '#e6dfd4',
      fontSize: '13px',
    },
    '.cm-scroller': {
      fontFamily: '"IBM Plex Mono", ui-monospace, SFMono-Regular, Menlo, monospace',
      lineHeight: '1.55',
      overflow: 'auto',
    },
    '.cm-content': {
      caretColor: '#c9a36a',
      padding: '0.6rem 0',
    },
    '.cm-gutters': {
      backgroundColor: '#0e0c0a',
      color: '#6e675e',
      borderRight: '1px solid #2c2823',
    },
    '.cm-activeLine': {
      backgroundColor: 'rgba(255, 255, 255, 0.03)',
    },
    '.cm-activeLineGutter': {
      backgroundColor: 'rgba(255, 255, 255, 0.03)',
      color: '#c9a36a',
    },
    '&.cm-focused .cm-selectionBackground, .cm-selectionBackground': {
      backgroundColor: 'rgba(201, 163, 106, 0.28)',
    },
    '.cm-cursor, .cm-dropCursor': {
      borderLeftColor: '#c9a36a',
    },
    '&.cm-focused': {
      outline: 'none',
    },
  },
  { dark: true },
)

type SqlEditorProps = {
  initialDoc: string
  onChange: (value: string) => void
  onRun: () => void
  onSubmit: () => void
}

export function SqlEditor({ initialDoc, onChange, onRun, onSubmit }: SqlEditorProps) {
  const hostRef = useRef<HTMLDivElement>(null)
  const onChangeRef = useRef(onChange)
  const onRunRef = useRef(onRun)
  const onSubmitRef = useRef(onSubmit)

  useEffect(() => {
    onChangeRef.current = onChange
    onRunRef.current = onRun
    onSubmitRef.current = onSubmit
  }, [onChange, onRun, onSubmit])

  useEffect(() => {
    const host = hostRef.current
    if (!host) return

    const view = new EditorView({
      parent: host,
      state: EditorState.create({
        doc: initialDoc,
        extensions: [
          lineNumbers(),
          highlightActiveLine(),
          highlightActiveLineGutter(),
          drawSelection(),
          history(),
          sql(),
          syntaxHighlighting(highlight),
          kosTheme,
          EditorView.contentAttributes.of({ 'aria-label': 'Editor SQL' }),
          keymap.of([
            {
              key: 'Mod-Shift-Enter',
              preventDefault: true,
              run: () => {
                onSubmitRef.current()
                return true
              },
            },
            {
              key: 'Mod-Enter',
              preventDefault: true,
              run: () => {
                onRunRef.current()
                return true
              },
            },
            ...defaultKeymap,
            ...historyKeymap,
          ]),
          EditorView.updateListener.of((update) => {
            if (update.docChanged) {
              onChangeRef.current(update.state.doc.toString())
            }
          }),
          EditorView.lineWrapping,
        ],
      }),
    })

    return () => view.destroy()
  }, [initialDoc])

  return <div ref={hostRef} className="sql-editor-host" />
}


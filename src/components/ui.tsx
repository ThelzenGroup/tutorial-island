import {
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from 'react'

/** A fake browser window chrome with a (optionally editable) URL bar. */
export function BrowserFrame({
  url,
  onNavigate,
  editable = false,
  children,
  toolbar,
}: {
  url: string
  onNavigate?: (url: string) => void
  editable?: boolean
  children: ReactNode
  toolbar?: ReactNode
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-edge bg-panel shadow-2xl">
      <div className="flex items-center gap-2 border-b border-edge bg-panel-2 px-3 py-2">
        <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
        <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
        <span className="h-3 w-3 rounded-full bg-[#28c840]" />
        <form
          className="ml-2 flex-1"
          onSubmit={(e) => {
            e.preventDefault()
            const value = new FormData(e.currentTarget).get('addr')
            onNavigate?.(String(value ?? ''))
          }}
        >
          {/* keyed by url so the bar resets to the current address after each
              navigation without needing a sync effect */}
          <input
            key={url}
            name="addr"
            defaultValue={url}
            readOnly={!editable}
            spellCheck={false}
            aria-label="address bar"
            className={`w-full rounded-md border border-edge bg-bg px-3 py-1 font-mono text-xs text-cyan outline-none ${
              editable
                ? 'focus:border-cyan cursor-text'
                : 'cursor-default text-muted'
            }`}
          />
        </form>
        {toolbar}
      </div>
      <div className="bg-white text-black">{children}</div>
    </div>
  )
}

export interface TerminalLine {
  text: string
  tone?: 'out' | 'cmd' | 'err' | 'ok' | 'muted'
}

const toneClass: Record<NonNullable<TerminalLine['tone']>, string> = {
  out: 'text-[#cdd9e5]',
  cmd: 'text-neon',
  err: 'text-[#ff6b6b]',
  ok: 'text-neon',
  muted: 'text-muted',
}

/** A minimal interactive terminal. The parent supplies a command handler. */
export function Terminal({
  prompt = 'guest@island:~$',
  intro = [],
  onCommand,
  className = '',
}: {
  prompt?: string
  intro?: TerminalLine[]
  onCommand: (cmd: string) => TerminalLine[]
  className?: string
}) {
  const [lines, setLines] = useState<TerminalLine[]>(intro)
  const [input, setInput] = useState('')
  const [history, setHistory] = useState<string[]>([])
  const [histIdx, setHistIdx] = useState<number | null>(null)
  const endRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: 'end' })
  }, [lines])

  function run() {
    const cmd = input
    const trimmed = cmd.trim()
    const next: TerminalLine[] = [{ text: `${prompt} ${cmd}`, tone: 'cmd' }]
    if (trimmed) {
      setHistory((h) => [...h, trimmed])
      next.push(...onCommand(trimmed))
    }
    setLines((l) => [...l, ...next])
    setInput('')
    setHistIdx(null)
  }

  function onKey(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      run()
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      if (history.length === 0) return
      const idx = histIdx === null ? history.length - 1 : Math.max(0, histIdx - 1)
      setHistIdx(idx)
      setInput(history[idx])
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      if (histIdx === null) return
      const idx = histIdx + 1
      if (idx >= history.length) {
        setHistIdx(null)
        setInput('')
      } else {
        setHistIdx(idx)
        setInput(history[idx])
      }
    }
  }

  return (
    <div
      className={`scroll-thin flex h-full flex-col overflow-y-auto rounded-xl border border-edge bg-term p-3 font-mono text-[13px] leading-relaxed ${className}`}
      onClick={() => inputRef.current?.focus()}
    >
      {lines.map((l, i) => (
        <div key={i} className={`whitespace-pre-wrap ${toneClass[l.tone ?? 'out']}`}>
          {l.text}
        </div>
      ))}
      <div className="flex items-center gap-2">
        <span className="shrink-0 text-neon">{prompt}</span>
        <input
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={onKey}
          autoFocus
          spellCheck={false}
          aria-label="terminal input"
          className="flex-1 bg-transparent text-[#cdd9e5] caret-neon outline-none"
        />
      </div>
      <div ref={endRef} />
    </div>
  )
}

export function Tag({ children }: { children: ReactNode }) {
  return (
    <span className="rounded-md border border-edge bg-panel-2 px-2 py-0.5 font-mono text-[11px] text-muted">
      {children}
    </span>
  )
}

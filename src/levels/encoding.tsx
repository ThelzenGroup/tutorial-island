import { useState } from 'react'
import type { Level, SandboxProps } from '../types'

const FLAG = 'FLAG{base64_is_not_encryption}'
const ENCODED = btoa(FLAG) // shown to the player as a mysterious string

function rot13(s: string): string {
  return s.replace(/[a-z]/gi, (c) => {
    const base = c <= 'Z' ? 65 : 97
    return String.fromCharCode(((c.charCodeAt(0) - base + 13) % 26) + base)
  })
}

function safeAtob(s: string): string {
  try {
    return atob(s.trim())
  } catch {
    return '⚠ That is not valid Base64.'
  }
}

function Sandbox({ onDiscover }: SandboxProps) {
  const [text, setText] = useState(ENCODED)
  const [output, setOutput] = useState('')

  function apply(kind: 'b64' | 'rot13' | 'reverse') {
    let result: string
    if (kind === 'b64') result = safeAtob(text)
    else if (kind === 'rot13') result = rot13(text)
    else result = text.split('').reverse().join('')
    setOutput(result)
    if (result.includes('FLAG{')) onDiscover?.('You decoded the flag!')
  }

  return (
    <div className="p-5 font-sans text-black">
      <div className="rounded-lg border border-gray-300 bg-gray-50 p-4">
        <p className="text-sm text-gray-600">
          Intercepted transmission. It looks scrambled:
        </p>
        <code className="mt-2 block break-all rounded bg-gray-900 p-3 font-mono text-sm text-green-400">
          {ENCODED}
        </code>
      </div>

      <div className="mt-4">
        <label className="text-xs font-semibold text-gray-500">
          DECODER — paste a string and try a transformation
        </label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          spellCheck={false}
          aria-label="decoder input"
          className="mt-1 h-20 w-full rounded-md border border-gray-300 p-2 font-mono text-sm"
        />
        <div className="mt-2 flex flex-wrap gap-2">
          <button
            onClick={() => apply('b64')}
            className="rounded-md bg-indigo-600 px-3 py-1.5 text-sm text-white hover:bg-indigo-700"
          >
            Base64 decode
          </button>
          <button
            onClick={() => apply('rot13')}
            className="rounded-md bg-gray-200 px-3 py-1.5 text-sm text-gray-800 hover:bg-gray-300"
          >
            ROT13
          </button>
          <button
            onClick={() => apply('reverse')}
            className="rounded-md bg-gray-200 px-3 py-1.5 text-sm text-gray-800 hover:bg-gray-300"
          >
            Reverse
          </button>
          <button
            onClick={() => {
              setOutput('')
              setText(ENCODED)
            }}
            className="rounded-md px-3 py-1.5 text-sm text-gray-500 hover:text-gray-800"
          >
            Reset
          </button>
        </div>
        {output && (
          <div className="mt-3">
            <span className="text-xs font-semibold text-gray-500">OUTPUT</span>
            <code className="mt-1 block break-all rounded bg-gray-900 p-3 font-mono text-sm text-amber-300">
              {output}
            </code>
          </div>
        )}
      </div>
    </div>
  )
}

export const encoding: Level = {
  id: 'encoding',
  order: 3,
  title: 'Backwards Day',
  tagline: 'Scrambled is not the same as secret.',
  concept: 'Encoding (Base64) vs. real encryption',
  difficulty: 2,
  xp: 100,
  badge: { emoji: '🔤', name: 'Decoder Ring' },
  flag: FLAG,
  briefing: [
    'You intercepted a message that looks like gibberish. But not all gibberish is secure!',
    'Encoding just rewrites data in another format so computers can move it around — it is fully reversible by anyone. Base64 is the most common example.',
    'Encryption, by contrast, needs a secret key. People constantly confuse the two.',
  ],
  objective: 'Decode the scrambled transmission to reveal the FLAG{...}.',
  hints: [
    'The string ends with “=” and uses letters/numbers only — a classic sign of Base64.',
    'Try the “Base64 decode” button on the intercepted string.',
    'If one transformation gives gibberish, try another. The right one reveals readable text.',
  ],
  debrief: [
    'Base64 looks cryptic but offers ZERO protection — it’s just a reversible alphabet. The same goes for ROT13 and hex.',
    'When you find data that’s “encoded,” treat it as plaintext. Real secrets need encryption with a key. Recognising encodings (Base64, hex, URL-encoding) is a daily skill in CTFs and real assessments.',
  ],
  Sandbox,
}

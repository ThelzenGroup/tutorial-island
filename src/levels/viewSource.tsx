import { useState } from 'react'
import type { Level, SandboxProps } from '../types'
import { BrowserFrame } from '../components/ui'

const FLAG = 'FLAG{view_source_is_your_friend}'

const PAGE_SOURCE = `<!doctype html>
<html>
  <head>
    <title>Paws &amp; Reflect — Daily Cat Facts</title>
  </head>
  <body>
    <h1>Paws &amp; Reflect</h1>
    <p>Did you know? A group of cats is called a "clowder".</p>

    <!-- NOTE TO SELF: take this out before launch!!
         dev login flag = ${FLAG}
    -->

    <footer>(c) 2026 Paws &amp; Reflect</footer>
  </body>
</html>`

function Sandbox({ onDiscover }: SandboxProps) {
  const [showSource, setShowSource] = useState(false)

  return (
    <BrowserFrame
      url="http://paws-and-reflect.io/"
      toolbar={
        <button
          onClick={() => {
            setShowSource((s) => !s)
            if (!showSource) onDiscover?.('You opened the page source.')
          }}
          className="rounded-md border border-edge bg-bg px-2 py-1 font-mono text-[11px] text-cyan hover:border-cyan"
        >
          {showSource ? '◀ Back to page' : '</> View Source'}
        </button>
      }
    >
      {showSource ? (
        <pre className="scroll-thin max-h-80 overflow-auto bg-[#0c1018] p-4 font-mono text-xs leading-relaxed text-[#9fe6b0]">
          {PAGE_SOURCE}
        </pre>
      ) : (
        <div className="p-6 font-sans">
          <h1 className="text-2xl font-bold text-pink-600">Paws &amp; Reflect</h1>
          <p className="mt-3 text-gray-700">
            Did you know? A group of cats is called a "clowder".
          </p>
          <div className="mt-6 text-4xl">🐱</div>
          <p className="mt-8 text-xs text-gray-400">© 2026 Paws &amp; Reflect</p>
        </div>
      )}
    </BrowserFrame>
  )
}

export const viewSource: Level = {
  id: 'view-source',
  order: 1,
  title: 'Hidden in Plain Sight',
  tagline: 'The answer is right there — if you know where to look.',
  concept: 'Viewing a page’s HTML source',
  difficulty: 1,
  xp: 50,
  badge: { emoji: '🔍', name: 'Source Sleuth' },
  flag: FLAG,
  briefing: [
    'Every website you visit is built from code your browser downloads and renders.',
    'Developers sometimes leave secrets — passwords, notes, hidden flags — right inside that code, thinking nobody will look.',
    'This adorable cat-facts site is hiding a developer login flag somewhere in its source.',
  ],
  objective: 'Read the page’s HTML source and find the hidden FLAG{...}.',
  hints: [
    'In a real browser you can right-click a page and choose “View Page Source”, or press Ctrl+U.',
    'Use the “</> View Source” button on the fake browser’s toolbar.',
    'Look for an HTML comment — it starts with <!-- and ends with -->. Developers hide notes there.',
  ],
  debrief: [
    'You just did real recon. Viewing source (Ctrl+U) and Inspect Element are the very first things a pentester checks on any web page.',
    'Comments, hidden form fields, and leftover “TODO” notes leak secrets constantly. Anything sent to the browser is visible to the user — it is NOT a safe place to hide anything.',
  ],
  Sandbox,
}
